from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.responses import JSONResponse
from concurrent.futures import ThreadPoolExecutor
import tempfile
import os
from typing import Dict, Any
from services.transcribe import extract_audio_from_video,transcribe,diarize,assign_speakers

app = FastAPI()

def process_video_analysis(video_path: str) -> Dict[str, Any]:
    try:
        audio_path = "extracted_audio.wav"
        extract_audio_from_video(video_path, audio_path)

        with ThreadPoolExecutor(max_workers=2) as executor:
            transcribe_future = executor.submit(transcribe, audio_path)
            diarize_future = executor.submit(diarize, audio_path)

            transcript = transcribe_future.result()
            diarize_df, audio = diarize_future.result()

        combined = assign_speakers(diarize_df, transcript, fill_nearest=False)


        statistics = generate_statistics(combined, diarize_df)
        
        # Clean up temporary audio file
        if os.path.exists(audio_path):
            os.remove(audio_path)
        
        return {
            "transcription": combined,
            "statistics": statistics,
            "status": "success"
        }
    
    except Exception as e:
        return {
            "error": str(e),
            "status": "failed"
        }

def generate_statistics(combined_data, diarize_df) -> Dict[str, Any]:
    """Generate statistics from the analysis results."""
    try:
        # Extract speaker statistics
        speakers = set()
        total_words = 0
        speaker_word_counts = {}
        
        for segment in combined_data:
            speaker = segment.get('speaker', 'Unknown')
            speakers.add(speaker)
            words = len(segment.get('text', '').split())
            total_words += words
            speaker_word_counts[speaker] = speaker_word_counts.get(speaker, 0) + words
        
        # Calculate speaking time per speaker
        speaker_times = {}
        for speaker in speakers:
            speaker_segments = diarize_df[diarize_df['speaker'] == speaker]
            total_time = (speaker_segments['end'] - speaker_segments['start']).sum()
            speaker_times[speaker] = float(total_time)
        
        return {
            "total_speakers": len(speakers),
            "total_words": total_words,
            "speaker_word_counts": speaker_word_counts,
            "speaker_speaking_times": speaker_times,
            "speakers_list": list(speakers)
        }
    
    except Exception as e:
        return {"error": f"Statistics generation failed: {str(e)}"}

@app.post("/analyze-video/")
async def analyze_video(file: UploadFile = File(...)):
    try:
        # Validate file type
        if not file.filename.lower().endswith(('.mp4', '.avi', '.mov', '.mkv')):
            raise HTTPException(status_code=400, detail="Invalid file format. Please upload a video file.")
        
        # Save uploaded file temporarily
        with tempfile.NamedTemporaryFile(delete=False, suffix='.mp4') as temp_file:
            content = await file.read()
            temp_file.write(content)
            temp_video_path = temp_file.name
        
        try:
            # Process the video
            result = process_video_analysis(temp_video_path)
            
            return JSONResponse(content=result)
        
        finally:
            # Clean up temporary video file
            if os.path.exists(temp_video_path):
                os.remove(temp_video_path)
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Processing failed: {str(e)}")

@app.post("/analyze-video-path/")
async def analyze_video_from_path(video_path: str):
    try:
        if not os.path.exists(video_path):
            raise HTTPException(status_code=404, detail="Video file not found")
        
        result = process_video_analysis(video_path)
        
        return JSONResponse(content=result)
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Processing failed: {str(e)}")

if _name_ == "_main_":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)