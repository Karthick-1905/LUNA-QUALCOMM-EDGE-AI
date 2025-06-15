import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Play, 
  Pause, 
  RotateCcw, 
  FastForward, 
  Volume2,
  VolumeX,
  Subtitles,
  SquarePlay
} from 'lucide-react';

export default function VideoPlayerSection({ 
  file,
  playerState, 
  speakers, 
  transcriptOverlay, 
  onPlay, 
  onPause, 
  onSeek, 
  onSpeakerFocus, 
  onToggleOverlay
}) {
  const [videoSrc, setVideoSrc] = useState(null);
  const [volume, setVolume] = useState(playerState.volume);
  const [isMuted, setIsMuted] = useState(false);

  // build + revoke blob URL
  useEffect(() => {
    if (!file) return;
    const url = URL.createObjectURL(file);
    setVideoSrc(url);
    return () => {
      URL.revokeObjectURL(url);
      setVideoSrc(null);
    };
  }, [file]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleVolumeChange = (newVolume) => {
    setVolume(newVolume);
    setIsMuted(newVolume === 0);
  };

  const handleMuteToggle = () => {
    setIsMuted(!isMuted);
  };

  const handleRewind = () => {
    onSeek(Math.max(0, playerState.currentTime - 10));
  };

  const handleFastForward = () => {
    onSeek(Math.min(playerState.duration, playerState.currentTime + 10));
  };

  const handleScrubberChange = (e) => {
    const newTime = (parseFloat(e.target.value) / 100) * playerState.duration;
    onSeek(newTime);
  };

  const progressPercentage = (playerState.currentTime / playerState.duration) * 100;
  return (
    <div className="bg-zinc-900 border-b border-zinc-800 h-full flex flex-col">
        <div className="flex-1 flex justify-center items-center px-4 pt-4 pb-3">
          <div className="relative w-full h-full max-h-[60vh] aspect-[16/9] bg-black rounded-lg overflow-hidden shadow-2xl border border-zinc-700">
            {/* File input for selecting video */}
            {!videoSrc && (
          <div className="absolute inset-0 flex flex-col items-center justify-center z-10 text-center">
            <SquarePlay className="w-16 h-16 text-zinc-600 mb-2" />
            <p className="text-zinc-500 text-sm">Select a video file to play</p>
          </div>
            )}
            {videoSrc && (
         <video
          ref={playerState.videoRef}
          src={videoSrc}
          controls
      onLoadedMetadata={playerState.onLoadedMetadata}
      onTimeUpdate={playerState.onTimeUpdate}
      onPlay={playerState.onPlay}
      onPause={playerState.onPause}
      className="w-full h-full object-contain"
    />
            )}
            {/* Transcript Overlay */}
          {transcriptOverlay && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/60 flex items-end p-4"
            >
              <div className="bg-black/80 rounded-lg p-3 max-w-lg">
                <p className="text-white text-sm leading-relaxed">
                  Welcome to our podcast. Today we're discussing the future of artificial intelligence and its impact on society.
                </p>
                <div className="flex items-center mt-2 text-xs text-zinc-300">
                  <div 
                    className="w-2 h-2 rounded-full mr-2"
                    style={{ backgroundColor: speakers[0]?.color || '#3b82f6' }}
                  />
                  <span>{speakers[0]?.name || 'Speaker 1'}</span>
                  <span className="ml-2 text-zinc-500">0:00 - 0:05</span>
                </div>
              </div>
            </motion.div>
          )}
        </div>      </div>

      {/* Controls Section - Fixed at bottom */}
      <div className="flex justify-center px-4 pb-4 mt-auto">
        <div className="w-full max-w-2xl space-y-3">
          {/* Progress Scrubber */}
          <div className="space-y-2">
            <div className="relative">
              <input
                type="range"
                min="0"
                max="100"
                value={progressPercentage}
                onChange={handleScrubberChange}
                className="w-full h-2 bg-zinc-700 rounded-lg appearance-none cursor-pointer slider"
                style={{
                  background: `linear-gradient(to right, #3b82f6 0%, #3b82f6 ${progressPercentage}%, #52525b ${progressPercentage}%, #52525b 100%)`
                }}
              />
            </div>
            <div className="flex justify-between text-xs text-zinc-400">
              <span>{formatTime(playerState.currentTime)}</span>
              <span>{formatTime(playerState.duration)}</span>
            </div>
          </div>

          {/* Transport Controls */}
          <div className="flex items-center justify-between">
            {/* Left Controls */}
            <div className="flex items-center space-x-3">
              {/* Main Transport */}
              <div className="flex items-center space-x-2">
                <button
                  onClick={handleRewind}
                  className="p-2 text-zinc-400 hover:text-white hover:bg-zinc-800 rounded-lg transition-colors"
                  title="Rewind 10s"
                >
                  <RotateCcw className="w-5 h-5" />
                </button>

                <button
                  onClick={playerState.isPlaying ? onPause : onPlay}
                  className="p-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                >
                  {playerState.isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5 ml-0.5" />}
                </button>

                <button
                  onClick={handleFastForward}
                  className="p-2 text-zinc-400 hover:text-white hover:bg-zinc-800 rounded-lg transition-colors"
                  title="Forward 10s"
                >
                  <FastForward className="w-5 h-5" />
                </button>

                
              </div>

              {/* Volume Control */}
              <div className="flex items-center space-x-2">
                <button
                  onClick={handleMuteToggle}
                  className="p-2 text-zinc-400 hover:text-white hover:bg-zinc-800 rounded-lg transition-colors"
                >
                  {isMuted || volume === 0 ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                </button>                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.1"
                  value={isMuted ? 0 : volume}
                  onChange={(e) => handleVolumeChange(parseFloat(e.target.value))}
                  className="w-20 h-4 video-volume-slider"
                />
              </div>
            </div>

            {/* Right Controls */}
            <div className="flex items-center space-x-3">
              

              {/* Transcript Overlay Toggle */}
              <button
                onClick={onToggleOverlay}
                className={`p-2 rounded-lg transition-colors ${
                  transcriptOverlay
                    ? 'text-blue-400 bg-blue-400/20'
                    : 'text-zinc-400 hover:text-white hover:bg-zinc-800'
                }`}
                title="Toggle transcript overlay"
              >
                <Subtitles className="w-4 h-4" />
              </button>

              
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
