import numpy as np
import os
import queue
import sounddevice as sd
import sys
import threading
import yaml

from concurrent.futures import ThreadPoolExecutor
from faster_whisper import WhisperModel


def process_transcription(
    whisper: WhisperModel,
    chunk: np.ndarray,
    silence_threshold: float,
    sample_rate: int
) -> None:
    """
    Process a chunk of audio data and transcribe it using the Whisper model.
    This function is run in a separate thread to allow for concurrent processing.

    Inputs:
    - whisper: WhisperModel instance for transcription
    - chunk: Audio data chunk to be transcribed (numpy array)
    - silence_threshold: Threshold for silence detection
    - sample_rate: Sample rate for audio recording
    """
    
    if np.abs(chunk).mean() > silence_threshold:
        # faster-whisper expects audio data as float32 numpy array
        # Transcribe the audio chunk
        segments, _ = whisper.transcribe(chunk, beam_size=5)
        
        # Combine all segments into a single transcript
        transcript = " ".join([segment.text for segment in segments])
        
        if transcript.strip():
            print(f"Transcript: {transcript}")

def process_audio(
    whisper: WhisperModel,
    audio_queue: queue.Queue,
    stop_event: threading.Event,
    max_workers: int,
    queue_timeout: float,
    chunk_samples: int,
    silence_threshold: float,
    sample_rate: int
) -> None:
    """
    Process audio data from the queue and transcribe it using the Whisper model.
    This function runs in a separate thread to allow for concurrent processing.

    Inputs:
    - whisper: WhisperModel instance for transcription
    - audio_queue: Queue containing audio data chunks
    - stop_event: Event to signal when to stop processing
    - max_workers: Number of parallel transcription workers
    - queue_timeout: Timeout for queue operations
    - chunk_samples: Number of samples in each audio chunk
    - silence_threshold: Threshold for silence detection
    - sample_rate: Sample rate for audio recording
    """

    buffer = np.empty((0,), dtype=np.float32)
    
    with ThreadPoolExecutor(max_workers=max_workers) as executor:
        futures = []
        
        while not stop_event.is_set():
            try:
                audio_chunk = audio_queue.get(timeout=queue_timeout)
                audio_chunk = audio_chunk.flatten()
                buffer = np.concatenate([buffer, audio_chunk])

                while len(buffer) >= chunk_samples:
                    current_chunk = buffer[:chunk_samples]
                    buffer = buffer[chunk_samples:]
                    
                    future = executor.submit(
                        process_transcription,
                        whisper,
                        current_chunk,
                        silence_threshold,
                        sample_rate
                    )
                    futures = [f for f in futures if not f.done()] + [future]

            except queue.Empty:
                continue
            
        for future in futures:
            future.result()

def record_audio(
    audio_queue: queue.Queue,
    stop_event: threading.Event,
    sample_rate: int,
    channels: int
) -> None:
    """
    Record audio from the microphone and put it into the audio queue.
    This function runs in a separate thread to allow for concurrent processing.

    Inputs:
    - audio_queue: Queue to store audio data chunks
    - stop_event: Event to signal when to stop recording
    - sample_rate: Sample rate for audio recording
    - channels: Number of audio channels (1 for mono)
    """

    def audio_callback(indata, frames, time, status):
        """
        Callback function for audio input stream. This function is called by the sounddevice library
        whenever there is new audio data available.
        """

        if status:
            print(f"Status: {status}")
        if not stop_event.is_set():
            audio_queue.put(indata.copy())

    with sd.InputStream(
        samplerate=sample_rate,
        channels=channels,
        callback=audio_callback
    ):
        print("Microphone stream initialized... (Press Ctrl+C to stop)")
        stop_event.wait()

class LiveTranscriber:
    def __init__(self):
        # Load configuration if config file exists, otherwise use defaults
        config = {}
        if os.path.exists("config.yaml"):
            with open("config.yaml", "r") as f:
                config = yaml.safe_load(f)
        
        # audio settings
        self.sample_rate = config.get("sample_rate", 16000)
        self.chunk_duration = config.get("chunk_duration", 4)
        self.channels = config.get("channels", 1)
        
        # processing settings
        self.max_workers = config.get("max_workers", 4)
        self.silence_threshold = config.get("silence_threshold", 0.001)
        self.queue_timeout = config.get("queue_timeout", 1.0)
        self.chunk_samples = int(self.sample_rate * self.chunk_duration)
        
        # model settings
        self.model_size = config.get("model_size", "small")
        self.device = config.get("device", "cpu")  # can be "cpu", "cuda", or "auto"
        self.compute_type = config.get("compute_type", "int8")  # can be "float16", "int8", etc.

        # initialize the faster-whisper model
        print(f"Loading faster-whisper {self.model_size} model...")
        self.model = WhisperModel(
            self.model_size, 
            device=self.device, 
            compute_type=self.compute_type
        )

        # initialize the audio queue and stop event
        self.audio_queue = queue.Queue()
        self.stop_event = threading.Event()

    def run(self):
        """
        Run the live transcription.
        """
        
        # launch the audio processing and recording threads
        process_thread = threading.Thread(
            target=process_audio, 
            args=(
                self.model,
                self.audio_queue,
                self.stop_event,
                self.max_workers,
                self.queue_timeout,
                self.chunk_samples,
                self.silence_threshold,
                self.sample_rate
            )
        )
        process_thread.start()

        record_thread = threading.Thread(
            target=record_audio, 
            args=(
                self.audio_queue,
                self.stop_event,
                self.sample_rate,
                self.channels
            )
        )
        record_thread.start()

        # wait for threads to finish
        try:
            while True:
                record_thread.join(timeout=0.1)
                if not record_thread.is_alive():
                    break
        except KeyboardInterrupt:
            print("\nStopping transcription...")
        finally:
            self.stop_event.set()
            record_thread.join()
            process_thread.join()
            print("Transcription stopped.")

if __name__ == "__main__":
    transcriber = LiveTranscriber()
    transcriber.run()