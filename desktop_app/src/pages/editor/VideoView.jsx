import { motion } from 'framer-motion';
import { useOutletContext } from 'react-router-dom';
import VideoPlayerSection from '../../components/layout/VideoPlayerSection';
import VideoTranscriptEditor from '../../components/editor/VideoTranscriptEditor';

const VideoView = () => {
  const { 
    playerState, 
    speakers, 
    viewState, 
    transcriptSegments,
    editState,
    onPlay, 
    onPause, 
    onSeek, 
    onSpeakerFocus, 
    onSegmentEdit,
    onSegmentSelect,
    setViewState 
  } = useOutletContext();

  return (
    <div className="flex-1 flex overflow-hidden">
      {/* Left Side - Video Player */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <VideoPlayerSection
          playerState={playerState}
          speakers={speakers}
          transcriptOverlay={viewState.transcriptOverlay}
          onPlay={onPlay}
          onPause={onPause}
          onSeek={onSeek}
          onSpeakerFocus={onSpeakerFocus}
          onToggleOverlay={() => 
            setViewState(prev => ({ ...prev, transcriptOverlay: !prev.transcriptOverlay }))
          }
        />
      </div>

      {/* Right Side - Transcript Editor */}
      <div className="w-96 border-l border-zinc-800 bg-zinc-950 flex flex-col">
        <VideoTranscriptEditor
          transcriptSegments={transcriptSegments}
          speakers={speakers}
          currentTime={playerState.currentTime}
          isPlaying={playerState.isPlaying}
          selectedSegment={transcriptSegments.find(seg => seg.id === editState.selectedSegment)}
          onSeek={onSeek}
          onSegmentEdit={onSegmentEdit}
          onSegmentSelect={onSegmentSelect}
        />
      </div>
    </div>
  );
};

export default VideoView;
