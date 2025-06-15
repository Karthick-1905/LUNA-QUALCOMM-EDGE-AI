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

const EditorLayout = () => {
  const navigate = useNavigate();

  const location = useLocation();
  const [loading, setLoading] = useState(false);
   // Create a ref to be passed down to the component with the <video> tag
  const videoRef = useRef(null);
  const [transcription, setTranscription] = useState(null);
  const [videoUrl, setVideoUrl] = useState(null);

  // Core Player State
  const [playerState, setPlayerState] = useState({
    currentTime: 0,
    duration: 180,
    isPlaying: false,
    volume: 1,
    playbackRate: 1,
    loop: false,
    transcriptSync: true,
    selectedSpeaker: undefined
  });

  // View State
  const [viewState, setViewState] = useState({
    splitRatio: 0.6,
    transcriptOverlay: false,
    dockableLayout: {}
  });

  // Edit State
  const [editState, setEditState] = useState({
    selectedSegment: undefined,
    undoStack: {},
    regenHistory: [],
    macroQueue: []
  });

  // UI State
  const [isDark, setIsDark] = useState(true);
  const [selectedProject] = useState('current-project');
  const [autosaveStatus, setAutosaveStatus] = useState('saved');
  const [isRightSidebarOpen, setIsRightSidebarOpen] = useState(true);

  // Application State
  const [transcriptSegments, setTranscriptSegments] = useState(() => getTranscriptSegments(speakers));
  const [ttsSettings, setTtsSettings] = useState(defaultTtsSettings);
  const [exportSettings, setExportSettings] = useState(defaultExportSettings);
  const [macros, setMacros] = useState(defaultMacros);
  const [macroSettings, setMacroSettings] = useState(defaultMacroSettings);

  // Speaker Stats (computed)
  const speakerStats = calculateSpeakerStats(speakers, transcriptSegments);

  // Get current view from location
  const getCurrentView = () => {
    const path = location.pathname;
    if (path === ROUTES.EDITOR_VIDEO) return 'video';
    if (path === ROUTES.EDITOR_TRANSCRIPT) return 'transcript';
   
    if (path === ROUTES.EDITOR_EXPORT) return 'export';
    return 'video';
  };

  const currentView = getCurrentView();
  console.log(location.state)
  
  useEffect(() => {
    // Check if file is passed from HomePage
    if (location.state && location.state.file) {
      const file = location.state.file;
      setLoading(true);
      setTranscription(null);
      // Create a local URL for video playback
      const url = URL.createObjectURL(file);
      setVideoUrl(url);
      // Send to backend
      const formData = new FormData();
      formData.append('file', file);
      fetch('/api/analyze-video/', {
        method: 'POST',
        body: formData,
      })
        .then(response => {
          if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
          }
          return response.json();
        })
        .then(data => {
          setTranscription(data);
          if (data?.transcription?.segments) {
        setTranscriptSegments(data.transcription.segments.map((seg, i) => ({
          ...seg,
          id: String(i),
          speaker: seg.speaker,
          text: seg.text,
          start: seg.start,
          end: seg.end,
          confidence: 1,
          isEditable: true
        })));
          }
        })
        .catch((error) => {
          console.error("Fetch error:", error);
          setTranscription(null);
        })
        .finally(() => setLoading(false));
    }
  }, [location.state]);

  // Set video duration from metadata
  const handleVideoLoadedMetadata = (e) => {
    const duration = e.target.duration;
    setPlayerState(prev => ({ ...prev, duration }));
  };

  // Event Handlers
  const handlePlay = useCallback(() => {
    videoRef.current?.play();

    setPlayerState(prev => ({ ...prev, isPlaying: true }));
  }, []);

  const handlePause = useCallback(() => {
    videoRef.current?.pause();
    setPlayerState(prev => ({ ...prev, isPlaying: false }));
  }, []);

  const handleSeek = useCallback((time) => {
    if (videoRef.current) {
      videoRef.current.currentTime = time;
    }
    setPlayerState(prev => ({ ...prev, currentTime: time }));
  }, []);

  const handleSpeakerFocus = useCallback((speakerId) => {
    setPlayerState(prev => ({ ...prev, selectedSpeaker: speakerId }));
  }, []);


   const handleTimeUpdate = useCallback((e) => {
    if (!videoRef.current || videoRef.current.seeking) return;
    setPlayerState(prev => ({ ...prev, currentTime: e.target.currentTime }));
}, [])
 const handleVideoPlay = useCallback(() => {
   // Syncs state if playback is triggered by native controls
   setPlayerState(prev => ({ ...prev, isPlaying: true }));
 }, []);

 const handleVideoPause = useCallback(() => {
   // Syncs state if pause is triggered by native controls
   setPlayerState(prev => ({ ...prev, isPlaying: false }));
   }, []);
  const handleViewChange = useCallback((view) => {
    const routeMap = {
      'video': ROUTES.EDITOR,
      'transcript': ROUTES.EDITOR_TRANSCRIPT,
      'timeline': ROUTES.EDITOR_TIMELINE,
      'split': ROUTES.EDITOR_SPLIT,
      'export': ROUTES.EDITOR_EXPORT
    };
    navigate(routeMap[view]);
  }, [navigate]);

  const handleSegmentEdit = useCallback((segmentId, newText) => {
    const undoAction = {
      type: 'edit',
      timestamp: Date.now(),
      data: { originalText: transcriptSegments.find(s => s.id === segmentId)?.text },
      segmentId
    };
    
    setEditState(prev => ({
      ...prev,
      undoStack: {
        ...prev.undoStack,
        [segmentId]: [...(prev.undoStack[segmentId] || []), undoAction]
      }
    }));

    setTranscriptSegments(prev =>
      prev.map(seg => seg.id === segmentId ? { ...seg, text: newText } : seg)
    );
    setAutosaveStatus('pending');
  }, [transcriptSegments]);

  const handleSegmentRegenerate = useCallback((segmentId) => {
    const segment = transcriptSegments.find(s => s.id === segmentId);
    if (!segment) return;

    const regenLog = {
      segmentId,
      timestamp: Date.now(),
      originalText: segment.text,
      newText: `[TTS Generated] ${segment.text}`,
      ttsSettings,
      audioGenerated: true
    };

    setEditState(prev => ({
      ...prev,
      regenHistory: [...prev.regenHistory, regenLog]
    }));

    console.log('Regenerating TTS for segment:', segmentId);
  }, [transcriptSegments, ttsSettings]);

  const handleSpeakerAssign = useCallback((segmentId, speakerId) => {
    const speaker = speakers.find(s => s.id === speakerId);
    if (!speaker) return;

    setTranscriptSegments(prev =>
      prev.map(seg => seg.id === segmentId ? { ...seg, speaker } : seg)
    );
  }, []);

  const handleMacroToggle = useCallback((macro) => {
    setMacros(prev => ({ ...prev, [macro]: !prev[macro] }));
  }, []);

  const handleTTSChange = useCallback((settings) => {
    setTtsSettings(prev => ({ ...prev, ...settings }));
  }, []);

  const handleExportChange = useCallback((settings) => {
    setExportSettings(prev => ({ ...prev, ...settings }));
  }, []);

  const handleExport = useCallback(() => {
    console.log('Exporting with settings:', exportSettings);
  }, [exportSettings]);

  const handleMacroSettingsChange = useCallback((macroId, settingKey, value) => {
    setMacroSettings(prev => ({
      ...prev,
      [macroId]: {
        ...prev[macroId],
        [settingKey]: value
      }
    }));
  }, []);

  const handleMacroApply = useCallback((macroId, segmentId, results) => {
    console.log('Applying macro:', macroId, 'to segment:', segmentId, 'results:', results);
    if (results && results.processedText) {
      handleSegmentEdit(segmentId, results.processedText);
    }
  }, [handleSegmentEdit]);

  const handleMacroPreview = useCallback((macroId, results) => {
    console.log('Previewing macro:', macroId, 'results:', results);
  }, []);

  const handleUndo = useCallback(() => {
    const selectedSegment = editState.selectedSegment;
    if (!selectedSegment || !editState.undoStack[selectedSegment]?.length) return;
    console.log('Undo for segment:', selectedSegment);
  }, [editState]);

  const handleRedo = useCallback(() => {
    const selectedSegment = editState.selectedSegment;
    if (!selectedSegment) return;
    console.log('Redo for segment:', selectedSegment);
  }, [editState]);

  const handleTTSRegenerate = useCallback((segmentId, settings) => {
    console.log('TTS Regenerate for segment:', segmentId, 'with settings:', settings);
    handleSegmentRegenerate(segmentId);
  }, [handleSegmentRegenerate]);

  const handleSegmentSelect = useCallback((segment) => {
    setEditState(prev => ({ ...prev, selectedSegment: segment?.id }));
    console.log('Selected segment:', segment);
  }, []);

  const handleExportSettingsChange = useCallback((settings) => {
    setExportSettings(prev => ({ ...prev, ...settings }));
  }, []);

  const handleTogglePlayback = useCallback(() => {
    playerState.isPlaying ? handlePause() : handlePlay();
  }, [playerState.isPlaying, handlePlay, handlePause]);

  // Hotkeys
  useHotkeys('space', (e) => {
    e.preventDefault();
    handleTogglePlayback();
  });

  useHotkeys('modp', (e) => {
    e.preventDefault();
    handleTogglePlayback();
  });

  useHotkeys('modt', (e) => {
    e.preventDefault();
    setIsDark(!isDark);
  });

  useHotkeys('mode', (e) => {
    e.preventDefault();
    handleExport();
  });

  useHotkeys('modr', (e) => {
    e.preventDefault();
    if (editState.selectedSegment) {
      handleSegmentRegenerate(editState.selectedSegment);
    }
  });

  useHotkeys('modshiftt', (e) => {
    e.preventDefault();
    handleViewChange(currentView === 'split' ? 'transcript' : 'split');
  });

  useHotkeys('mod1', (e) => {
    e.preventDefault();
    handleViewChange('transcript');
  });

  useHotkeys('mod2', (e) => {
    e.preventDefault();
    handleViewChange('timeline');
  });

  useHotkeys('mod3', (e) => {
    e.preventDefault();
    handleViewChange('video');
  });

  useHotkeys('mod4', (e) => {
    e.preventDefault();
    handleViewChange('split');
  });

  useHotkeys('mod5', (e) => {
    e.preventDefault();
    handleViewChange('editing');
  });

  useHotkeys('mod6', (e) => {
    e.preventDefault();
    handleViewChange('export');
  });

  useHotkeys('moda', (e) => {
    e.preventDefault();
    setIsRightSidebarOpen(!isRightSidebarOpen);
  });

  // Shared props for all views
  const sharedProps = {

playerState: {
      ...playerState,
      videoUrl,
      videoRef, // Pass ref to child
      onLoadedMetadata: handleVideoLoadedMetadata,
      onTimeUpdate: handleTimeUpdate,
      onPlay: handleVideoPlay, // For the <video> element
      onPause: handleVideoPause, // For the <video> element
    },    speakers,
    viewState,
    file: location.state?.file || null,
    setViewState,
    transcriptSegments,
    timelineTracks,
    editState,
    macroSettings,
    exportSettings,
    loading,
    transcription, // These handlers are for UI controls (buttons, hotkeys) to call
    onPlay: handlePlay, // Renamed for clarity in child component+    onPause: handlePause, // Renamed for clarity in child component
    onSeek: handleSeek,
    onSpeakerFocus: handleSpeakerFocus,
    onSegmentEdit: handleSegmentEdit,
    onSegmentRegenerate: handleSegmentRegenerate,
    onSegmentSelect: handleSegmentSelect,
    onMacroApply: handleMacroApply,
    onMacroPreview: handleMacroPreview,
    onUndo: handleUndo,
    onRedo: handleRedo,
    onMacroSettingsChange: handleMacroSettingsChange,
    onExportSettingsChange: handleExportSettingsChange,
    onExport: handleExport
  };

  return (
    <div className="h-screen bg-zinc-950 text-neutral-100 flex flex-col overflow-hidden">
      
      <TopBar
        projectName={projects.find(p => p.id === selectedProject)?.name || 'Untitled Project'}
        autosaveStatus={autosaveStatus}
        onNavigateHome={() => navigate(ROUTES.HOME)}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Center Workspace */}
        <div className="flex-1 flex overflow-hidden">
          {/* Main Content */}
          <div className="flex-1 flex flex-col overflow-hidden">
            {/* Content Panels */}
            <div className="flex-1 flex flex-col overflow-hidden">
              <AnimatePresence mode="wait">
                <Outlet context={sharedProps} />
              </AnimatePresence>

              {/* View Toggle Controls - Always visible at bottom */}
              <div className="border-t border-zinc-800 p-2 flex items-center justify-center gap-2 flex-wrap bg-zinc-950 z-10">
                {/* Primary Views */}
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
              transcription={transcription}
              onClose={() => setIsRightSidebarOpen(false)}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default EditorLayout;
