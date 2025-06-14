import json
from pydub import AudioSegment
import os

def main( audio_file_path: str, transcript_file_json_path: str, output_dir: str = "speaker_audio"):
    def process_speaker_segments(transcript_file_json_path: str ) :
        def get_largest_contiguous_chunks(speaker_words, min_total_duration=30.0):
            result = {}
            for speaker, words in speaker_words.items():
                # Find contiguous chunks
                chunks = []
                current_chunk = []
                for i, word in enumerate(words):
                    if not current_chunk:
                        current_chunk = [word]
                    else:
                        # Check if contiguous (end == start)
                        if abs(word["start"] - current_chunk[-1]["end"]) < 1e-6:
                            current_chunk.append(word)
                        else:
                            chunks.append(current_chunk)
                            current_chunk = [word]
                if current_chunk:
                    chunks.append(current_chunk)

                # Sort chunks by duration (descending)
                chunks = sorted(
                    chunks,
                    key=lambda chunk: chunk[-1]["end"] - chunk[0]["start"],
                    reverse=True
                )

                # Merge chunks until reaching min_total_duration
                merged = []
                total_duration = 0.0
                for chunk in chunks:
                    if not merged:
                        merged.extend(chunk)
                        total_duration = merged[-1]["end"] - merged[0]["start"]
                    else:
                        # Add a gap if needed
                        if abs(chunk[0]["start"] - merged[-1]["end"]) < 1e-6:
                            merged.extend(chunk)
                        else:
                            # Insert a gap word if you want, or just concatenate
                            merged.extend(chunk)
                        total_duration = merged[-1]["end"] - merged[0]["start"]
                    if total_duration >= min_total_duration:
                        break

                result[speaker] = merged
            return result

        with open(transcript_file_json_path, "r", encoding="utf-8") as f:
            output_with_speakers = json.load(f)
            # Group words by speaker and merge consecutive words for the same speaker
            speaker_words = {}
            for segment in output_with_speakers.get("segments", []):
                words = segment.get("words", [])
                i = 0
                while i < len(words):
                    word_info = words[i]
                    speaker = word_info.get("speaker")
                    if speaker is None:
                        i += 1
                        continue
                    if speaker not in speaker_words:
                        speaker_words[speaker] = []
                    current_word = {
                        "word": word_info.get("word"),
                        "start": word_info.get("start"),
                        "end": word_info.get("end")
                    }
                    # Merge with previous word if end == start
                    if (
                        speaker_words[speaker]
                        and speaker_words[speaker][-1]["end"] == current_word["start"]
                    ):
                        prev_word = speaker_words[speaker].pop()
                        merged_word = {
                            "word": prev_word["word"] + current_word["word"],
                            "start": prev_word["start"],
                            "end": current_word["end"]
                        }
                        speaker_words[speaker].append(merged_word)
                    else:
                        speaker_words[speaker].append(current_word)

                    # Merge with next word if the next speaker is the same
                    while (
                        i + 1 < len(words)
                        and words[i + 1].get("speaker") == speaker
                    ):
                        next_word_info = words[i + 1]
                        last_word = speaker_words[speaker].pop()
                        merged_word = {
                            "word": last_word["word"] + next_word_info.get("word"),
                            "start": last_word["start"],
                            "end": next_word_info.get("end")
                        }
                        speaker_words[speaker].append(merged_word)
                        i += 1
                    i += 1

            # Get 30 seconds of highest quality data for each speaker
            best_chunks = get_largest_contiguous_chunks(speaker_words, min_total_duration=30.0)

            # For each speaker, sort the segments by start and end time
            for speaker, segments in best_chunks.items():
                best_chunks[speaker] = sorted(segments, key=lambda x: (x["start"], x["end"]))

            return best_chunks


    speaker_segments = process_speaker_segments(transcript_file_json_path)
    def split_audio_by_speaker(speaker_segments, audio_file_path, output_dir="speaker_audio"):
        os.makedirs(output_dir, exist_ok=True)
        audio = AudioSegment.from_file(audio_file_path)
        speaker_audio_paths = {}

        for speaker, segments in speaker_segments.items():
            speaker_audio = AudioSegment.empty()
            for seg in segments:
                start_ms = int(seg["start"] * 1000)
                end_ms = int(seg["end"] * 1000)
                speaker_audio += audio[start_ms:end_ms]
            output_path = os.path.join(output_dir, f"{speaker}.wav")
            speaker_audio.export(output_path, format="wav")
            speaker_audio_paths[speaker] = output_path

        return speaker_audio_paths
    return split_audio_by_speaker(speaker_segments, audio_file_path, output_dir)