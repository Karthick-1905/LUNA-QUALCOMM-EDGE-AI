import { motion } from 'framer-motion';
import { useOutletContext } from 'react-router-dom';
import TranscriptEditor from '../../components/editor/TranscriptEditor';

const TranscriptView = () => {
  const { 
    transcriptSegments,
    speakers,
    playerState,
    editState,
    macroSettings,
    onSegmentEdit,
    onSegmentRegenerate,
    onSeek,
    onPlay,
    onPause,
    onSegmentSelect,
    onMacroApply,
    onMacroPreview,
    onUndo,
    onRedo,
    onMacroSettingsChange  } = useOutletContext();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.2 }}
      className="flex-1 overflow-hidden"
    >
      <TranscriptEditor
        transcription={transcriptSegments}
        speakers={speakers}
        currentTime={playerState.currentTime}
        isPlaying={playerState.isPlaying}
        duration={playerState.duration}
        volume={playerState.volume}
        onSegmentEdit={onSegmentEdit}
        onSegmentRegenerate={onSegmentRegenerate}
        onSeek={onSeek}
        onPlay={onPlay}
        onPause={onPause}
        // Integrated editing props
        selectedSegment={transcriptSegments.find(seg => seg.id === editState.selectedSegment)}
        undoStack={editState.undoStack[editState.selectedSegment] || []}
        redoStack={[]} // Implement redo stack
        macroSettings={macroSettings}
        onSegmentSelect={onSegmentSelect}
        onMacroApply={onMacroApply}
        onMacroPreview={onMacroPreview}
        onUndo={onUndo}
        onRedo={onRedo}
        onMacroSettingsChange={onMacroSettingsChange}
      />
    </motion.div>
  );
};

export default TranscriptView;
