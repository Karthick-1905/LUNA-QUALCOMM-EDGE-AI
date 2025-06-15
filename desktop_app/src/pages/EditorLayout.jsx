import { useState, useCallback, useEffect, useRef } from 'react';
import { Outlet, useNavigate, useLocation, Navigate } from 'react-router-dom';
import { useHotkeys } from 'react-hotkeys-hook';
import { motion, AnimatePresence } from 'framer-motion';

// Components
import TopBar from '../components/layout/TopBar';
import RightSidebar from '../components/layout/RightSidebar';
import Skeleton from '../components/ui/Skeleton';

// Data and utilities
import { 
  projects, 
  speakers, 
  transcriptionData, 
  getTranscriptSegments, 
  timelineTracks,
  defaultTtsSettings,
  defaultExportSettings,
  defaultMacros,
  defaultMacroSettings
} from '../data/mockData';

import { calculateSpeakerStats } from '../utils/appUtils';
import { ROUTES } from '../config/routes';
import VideoView from './editor/VideoView';

const EditorLayout = () => {
  const navigate = useNavigate();
  const [isRightSidebarOpen,setIsRightSidebarOpen] = useState(true);
  const [currentView, setCurrentView] = useState('video');
  const [speakerStats,SetSpeakerStats] = useState([]);
  const [transcription, setTranscription] = useState(transcriptionData);
  const [autosaveStatus, setAutosaveStatus] = useState('Saving...');
  
  return (
    <div className="h-screen bg-zinc-950 text-neutral-100 flex flex-col overflow-hidden">
      
      <TopBar
        projectName={'Untitled Project'}
        autosaveStatus={autosaveStatus}
        onNavigateHome={() => navigate(ROUTES.HOME)}
      />

      <div className="flex-1 flex flex-col overflow-hidden">
        <div className="flex-1 flex overflow-hidden">
          <div className="flex-1 flex flex-col overflow-hidden">
            <div className="flex-1 flex flex-col overflow-hidden max-h-90vh">
              <AnimatePresence mode="wait">
                <Outlet context={{transcription,setTranscription,speakerStats,SetSpeakerStats}}/>
              </AnimatePresence>

              <div className="border-t border-zinc-800 p-2 flex items-center justify-center gap-2 flex-wrap bg-zinc-950 z-10">
                <div className="flex gap-2">
                  <button
                    onClick={() => handleViewChange('video')}
                    className={`px-3 py-1 rounded-lg text-sm transition-colors ${
                      currentView === 'video'
                        ? 'bg-blue-600 text-white'
                        : 'text-zinc-400 hover:text-white hover:bg-zinc-800'
                    }`}
                  >
                    Video
                  </button>
                  <button
                    onClick={() => handleViewChange('transcript')}
                    className={`px-3 py-1 rounded-lg text-sm transition-colors ${
                      currentView === 'transcript'
                        ? 'bg-blue-600 text-white'
                        : 'text-zinc-400 hover:text-white hover:bg-zinc-800'
                    }`}
                  >
                    Transcript
                  </button>
                 
                </div>

                {/* Divider */}
                <div className="w-px h-6 bg-zinc-700 mx-2"></div>

                {/* Tool Views */}
                <div className="flex gap-2">
                  <button
                    onClick={() => handleViewChange('export')}
                    className={`px-3 py-1 rounded-lg text-sm transition-colors ${
                      currentView === 'export'
                        ? 'bg-red-600 text-white'
                        : 'text-zinc-400 hover:text-white hover:bg-zinc-800'
                    }`}
                  >
                    Export
                  </button>
                </div>

                {/* Divider */}
                <div className="w-px h-6 bg-zinc-700 mx-2"></div>

                {/* Panel Toggle */}
                <div className="flex gap-2">
                  <button
                    onClick={() => setIsRightSidebarOpen(!isRightSidebarOpen)}
                    className={`px-3 py-1 rounded-lg text-sm transition-colors ${
                      isRightSidebarOpen
                        ? 'bg-zinc-600 text-white'
                        : 'text-zinc-400 hover:text-white hover:bg-zinc-800'
                    }`}
                    title={isRightSidebarOpen ? 'Hide Analytics' : 'Show Analytics'}
                  >
                    Analytics
                  </button>
                </div>
              </div>
            </div>
          </div>
          
          {/* Right Sidebar */}
          {isRightSidebarOpen && (
            <RightSidebar
              speakers={speakers}
              speakerStats={speakerStats}
              transcriptionData={transcription}
              onClose={() => setIsRightSidebarOpen(false)}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default EditorLayout;