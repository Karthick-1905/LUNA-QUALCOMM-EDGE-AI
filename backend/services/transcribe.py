import torch
import librosa
import numpy as np
import pandas as pd
import json
import os
import soundfile as sf
from pyannote.audio import Pipeline
from faster_whisper import WhisperModel
from typing import Union
from concurrent.futures import ThreadPoolExecutor
from .speaker_segmentation import main
import subprocess

#HUGGINGFACE_TOKEN = "your_huggingface_token_here"  # Replace with your Hugging Face token
SAMPLE_RATE = 16000
OUTPUT_DIR = os.path.join(os.getcwd(), "assests/users_segements")
os.makedirs(OUTPUT_DIR, exist_ok=True)

def extract_audio_from_video(video_path, audio_out_path):
    cmd = [
        "ffmpeg", "-y", "-i", video_path,
        "-ar", str(SAMPLE_RATE), "-ac", "1",
        "-f", "wav", audio_out_path
    ]
    subprocess.run(cmd, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
    print(f"[Extract] Audio saved to {audio_out_path}")

def transcribe(audio_file):
    print("[Transcription] Loading model...")
    model = WhisperModel("small", device="cuda" if torch.cuda.is_available() else "cpu")

    print(f"[Transcription] Transcribing {audio_file}...")
    segments, info = model.transcribe(audio_file, beam_size=5, word_timestamps=True)

    transcript_result = {"segments": []}
    for segment in segments:
        seg = {
            "start": segment.start,
            "end": segment.end,
            "text": segment.text,
            "words": []
        }
        if segment.words:
            for word in segment.words:
                seg["words"].append({
                    "start": word.start,
                    "end": word.end,
                    "word": word.word
                })
        transcript_result["segments"].append(seg)

    print("[Transcription] Done.")
    return transcript_result

def diarize(audio_file):
    print("[Diarization] Loading audio with librosa...")
    audio, sr = librosa.load(audio_file, sr=SAMPLE_RATE)
    audio_data = {
        "waveform": torch.from_numpy(audio).unsqueeze(0),
        "sample_rate": SAMPLE_RATE
    }

    print("[Diarization] Loading diarization model...")
    pipeline = Pipeline.from_pretrained(
        "pyannote/speaker-diarization-3.1",
        use_auth_token=HUGGINGFACE_TOKEN
    )

    print("[Diarization] Running diarization...")
    diarization = pipeline(audio_data)

    segments = []
    for turn, _, speaker in diarization.itertracks(yield_label=True):
        segments.append({
            "start": turn.start,
            "end": turn.end,
            "speaker": speaker
        })

    df = pd.DataFrame(segments)
    return df, audio

def assign_speakers(diarize_df, transcript_result, fill_nearest=False):
    # (Same as your code)
    for seg in transcript_result["segments"]:
        diarize_df["intersection"] = np.minimum(diarize_df["end"], seg["end"]) - np.maximum(diarize_df["start"], seg["start"])
        if not fill_nearest:
            dia_tmp = diarize_df[diarize_df["intersection"] > 0]
        else:
            dia_tmp = diarize_df
        if len(dia_tmp) > 0:
            speaker = dia_tmp.groupby("speaker")["intersection"].sum().sort_values(ascending=False).index[0]
            seg["speaker"] = speaker

        for word in seg["words"]:
            diarize_df["intersection"] = np.minimum(diarize_df["end"], word["end"]) - np.maximum(diarize_df["start"], word["start"])
            if not fill_nearest:
                dia_tmp = diarize_df[diarize_df["intersection"] > 0]
            else:
                dia_tmp = diarize_df
            if len(dia_tmp) > 0:
                speaker = dia_tmp.groupby("speaker")["intersection"].sum().sort_values(ascending=False).index[0]
                word["speaker"] = speaker
    return transcript_result

def save_to_json(result, filename):
    with open(filename, "w", encoding="utf-8") as f:
        json.dump(result, f, indent=2)
    print(f"[Save] Output saved to {filename}")

def save_speaker_audio(diarize_df, audio, sr, min_duration_sec=180, max_duration_sec=300):
    os.makedirs(OUTPUT_DIR, exist_ok=True)
    for speaker in diarize_df["speaker"].unique():
        speaker_segs = diarize_df[diarize_df["speaker"] == speaker]
        combined_audio = []
        total_duration = 0.0
        for _, row in speaker_segs.iterrows():
            start_sample = int(row["start"] * sr)
            end_sample = int(row["end"] * sr)
            combined_audio.append(audio[start_sample:end_sample])
            total_duration += (row["end"] - row["start"])
            if total_duration >= min_duration_sec:
                break
        if combined_audio:
            combined_audio = np.concatenate(combined_audio)
            max_samples = int(max_duration_sec * sr)
            combined_audio = combined_audio[:max_samples]
            output_file = os.path.join(OUTPUT_DIR, f"{speaker}_segment.wav")
            sf.write(output_file, combined_audio, sr)
            print(f"[SAVE] Saved {output_file} ({combined_audio.shape[0]/sr:.1f} sec)")