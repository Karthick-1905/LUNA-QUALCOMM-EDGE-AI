import os
import json
import logging
from typing import List, Dict, Tuple, Optional
from dataclasses import dataclass
from pydub import AudioSegment

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

@dataclass
class SpeakerSegment:
    """Speaker segment with timing and text information"""
    speaker_id: str
    start_time: float
    end_time: float
    text: str
    words: List[Dict] = None

class SpeakerSegmentationService:
    """Service for processing speaker segmentation from transcript data"""
    
    def __init__(self, assets_dir: str = None):
        # Set up paths - use absolute paths
        if assets_dir is None:
            # Get the backend directory (parent of services)
            backend_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
            self.assets_dir = os.path.join(backend_dir, "assests")
        else:
            self.assets_dir = assets_dir
            
        self.original_audio_path = os.path.join(self.assets_dir, "audio", "extracted_audio.wav")
        self.speaker_audio_output_dir = os.path.join(self.assets_dir, "speaker_audio")
        self.transcripts_dir = os.path.join(self.assets_dir, "users_segements")
        
        # Ensure output directory exists
        os.makedirs(self.speaker_audio_output_dir, exist_ok=True)
    
    def load_transcript_data(self, transcript_path: str = None) -> Dict:
        """Load transcript JSON file"""
        try:
            if not transcript_path:
                transcript_path = os.path.join(self.transcripts_dir, "transcript.json")
            
            with open(transcript_path, 'r', encoding='utf-8') as f:
                transcript_data = json.load(f)
            
            logger.info(f"Loaded transcript with {len(transcript_data.get('segments', []))} segments")
            return transcript_data
            
        except Exception as e:
            logger.error(f"Error loading transcript data: {e}")
            raise
    
    def extract_speaker_segments(self, transcript_data: Dict) -> Dict[str, List[SpeakerSegment]]:
        """Extract speaker segments from transcript data"""
        speaker_segments = {}
        
        for segment in transcript_data.get("segments", []):
            segment_start = segment.get("start", 0)
            segment_end = segment.get("end", 0)
            segment_text = segment.get("text", "").strip()
            segment_speaker = segment.get("speaker")
            
            # If segment has speaker info, use it
            if segment_speaker:
                if segment_speaker not in speaker_segments:
                    speaker_segments[segment_speaker] = []
                
                speaker_segments[segment_speaker].append(SpeakerSegment(
                    speaker_id=segment_speaker,
                    start_time=segment_start,
                    end_time=segment_end,
                    text=segment_text,
                    words=segment.get("words", [])
                ))
            
            # Also check words for speaker information
            for word in segment.get("words", []):
                word_speaker = word.get("speaker")
                if word_speaker:
                    if word_speaker not in speaker_segments:
                        speaker_segments[word_speaker] = []
                    
                    # Create mini-segments for each word if needed
                    word_start = word.get("start", segment_start)
                    word_end = word.get("end", segment_end)
                    word_text = word.get("word", "").strip()
                    
                    # Group consecutive words by the same speaker
                    if (speaker_segments[word_speaker] and 
                        speaker_segments[word_speaker][-1].end_time >= word_start - 0.1):
                        # Extend the last segment
                        last_segment = speaker_segments[word_speaker][-1]
                        last_segment.end_time = word_end
                        last_segment.text += " " + word_text
                    else:
                        # Create new segment
                        speaker_segments[word_speaker].append(SpeakerSegment(
                            speaker_id=word_speaker,
                            start_time=word_start,
                            end_time=word_end,
                            text=word_text
                        ))
        
        # Sort segments by start time for each speaker
        for speaker_id in speaker_segments:
            speaker_segments[speaker_id].sort(key=lambda x: x.start_time)
        
        logger.info(f"Extracted segments for {len(speaker_segments)} speakers")
        for speaker_id, segments in speaker_segments.items():
            total_duration = sum(seg.end_time - seg.start_time for seg in segments)
            logger.info(f"{speaker_id}: {len(segments)} segments, {total_duration:.2f}s total")
        
        return speaker_segments
    
    def create_speaker_audio_files(self, speaker_segments: Dict[str, List[SpeakerSegment]]) -> Dict[str, str]:
        """Create individual audio files for each speaker"""
        try:
            # Load original audio
            original_audio = AudioSegment.from_file(self.original_audio_path)
            speaker_audio_paths = {}
            
            for speaker_id, segments in speaker_segments.items():
                # Combine all segments for this speaker
                combined_audio = AudioSegment.empty()
                
                for segment in segments:
                    start_ms = int(segment.start_time * 1000)
                    end_ms = int(segment.end_time * 1000)
                    
                    # Extract segment audio
                    segment_audio = original_audio[start_ms:end_ms]
                    combined_audio += segment_audio
                    
                    # Add small silence between segments for natural speech
                    if len(combined_audio) > 0:
                        combined_audio += AudioSegment.silent(duration=100)  # 100ms silence
                
                # Export speaker audio
                output_path = os.path.join(self.speaker_audio_output_dir, f"{speaker_id}.wav")
                combined_audio.export(output_path, format="wav")
                speaker_audio_paths[speaker_id] = output_path
                
                logger.info(f"Created speaker audio for {speaker_id}: {output_path} ({len(combined_audio)/1000:.2f}s)")
            
            return speaker_audio_paths
            
        except Exception as e:
            logger.error(f"Error creating speaker audio files: {e}")
            raise
    
    def process_speaker_segmentation(self, transcript_path: str = None) -> Dict[str, str]:
        """Complete workflow to process speaker segmentation"""
        try:
            # Load transcript data
            transcript_data = self.load_transcript_data(transcript_path)
            
            # Extract speaker segments
            speaker_segments = self.extract_speaker_segments(transcript_data)
            
            # Create speaker audio files
            speaker_audio_paths = self.create_speaker_audio_files(speaker_segments)
            
            logger.info(f"Speaker segmentation processing complete: {len(speaker_audio_paths)} speaker files created")
            return speaker_audio_paths
            
        except Exception as e:
            logger.error(f"Error in speaker segmentation process: {e}")
            raise


def run_speaker_segmentation_service():
    """Main function to run the speaker segmentation service"""
    try:
        # Initialize service
        segmentation_service = SpeakerSegmentationService()
        
        # Process speaker segmentation
        speaker_files = segmentation_service.process_speaker_segmentation()
        
        print(f"Speaker segmentation completed!")
        for speaker_id, file_path in speaker_files.items():
            print(f"{speaker_id}: {file_path}")
        
        return speaker_files
        
    except Exception as e:
        logger.error(f"Speaker segmentation service failed: {e}")
        raise

if __name__ == "__main__":
    run_speaker_segmentation_service()