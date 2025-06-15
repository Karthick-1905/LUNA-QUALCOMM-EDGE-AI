import { motion } from 'framer-motion';
import { useOutletContext } from 'react-router-dom';
import VideoPlayerSection from '../../components/layout/VideoPlayerSection';
import VideoTranscriptEditor from '../../components/editor/VideoTranscriptEditor';
import Skeleton from '../../components/ui/Skeleton';
import React from 'react';
const VideoView = () => {
  
   const { 
    file,
    playerState, 
    speakers, 
    viewState,
    transcriptSegments,
    editState,
    loading,
    transcription,
    onPlay,
    onPause, 
    onSeek,
    onSpeakerFocus,
    onSegmentEdit,
    onSegmentSelect,
    setViewState,
  } = useOutletContext();
  const skeletonCount = transcription?.transcription?.segments?.length || 6;
  return (
    <div className="flex-1 flex overflow-hidden h-full">
      {/* Left Side - Video Player */}
      <div className="flex-1 flex flex-col overflow-hidden min-w-0">
        <VideoPlayerSection
          // add this prop
          videoSrc={file?.url || file?.path}
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
      <div className="w-96 min-w-96 border-l border-zinc-800 bg-zinc-950 flex flex-col overflow-hidden">
        {loading ? (
          <div className="p-4 space-y-2 overflow-y-auto">
            <div className="mb-4">
              <h3 className="text-sm font-medium text-zinc-400 mb-2">Loading Transcript...</h3>
            </div>
            {[...Array(skeletonCount)].map((_, i) => (
              <Skeleton key={i} className="h-6 w-full bg-zinc-800" />
            ))}
          </div>
        ) : (
          <div className="flex-1 flex flex-col overflow-hidden">
            <div className="p-4 border-b border-zinc-800">
              <h3 className="text-sm font-medium text-zinc-300">Transcript Editor</h3>
            </div>
            <div className="flex-1 overflow-hidden">
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
        )}
      </div>
    </div>
  );
};

export default VideoView;
