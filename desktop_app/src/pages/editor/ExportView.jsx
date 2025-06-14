import { motion } from 'framer-motion';
import { useOutletContext } from 'react-router-dom';
import ExportPanel from '../../components/editor/ExportPanel';

const ExportView = () => {
  const { 
    transcriptSegments,
    speakers,
    timelineTracks,
    exportSettings,
    onExportSettingsChange,
    onExport  } = useOutletContext();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.2 }}
      className="flex-1 overflow-hidden"
    >
      <ExportPanel
        transcriptSegments={transcriptSegments}
        speakers={speakers}
        tracks={timelineTracks}
        exportSettings={exportSettings}
        onExportSettingsChange={onExportSettingsChange}
        onExport={onExport}
      />
    </motion.div>
  );
};

export default ExportView;
