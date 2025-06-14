import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';

// Pages
import { HomePage } from './pages';
import EditorLayout from './pages/EditorLayout';
import { VideoView, TranscriptView, ExportView } from './pages/editor';

// Components
import Navigation from './components/layout/Navigation';

// Configuration
import { ROUTES } from './config/routes';

const AppContent = () => {
  const location = useLocation();
  const [isNavOpen, setIsNavOpen] = useState(false);
    // Hide navigation on editor page to keep it fullscreen
  const hideNavigation = location.pathname.startsWith(ROUTES.EDITOR);

  return (
    <div className="h-screen bg-zinc-950 text-neutral-100 flex overflow-hidden">
      {/* {!hideNavigation && (
        <AnimatePresence>
          <Navigation 
            isOpen={isNavOpen} 
            onToggle={() => setIsNavOpen(!isNavOpen)} 
          />
        </AnimatePresence>
      )} */}

      {/* Main Content */}
      <div className={`flex-1 transition-all duration-300 ${
        !hideNavigation && isNavOpen ? 'ml-64' : 'ml-0'
      }`}>        <Routes>
          {/* Home Route */}
          <Route path={ROUTES.HOME} element={<HomePage />} />
          
          {/* Projects Route */}
          {/* <Route path={ROUTES.PROJECTS} element={<ProjectsPage />} /> */}
          
          {/* Editor Routes with nested routing */}
          <Route path={ROUTES.EDITOR} element={<EditorLayout />}>
            <Route path="video" element={<VideoView />} />
            <Route path="transcript" element={<TranscriptView />} />
            <Route path="export" element={<ExportView />} />
          </Route>
          
          
          {/* Redirect any unknown routes to home */}
          <Route path="*" element={<Navigate to={ROUTES.HOME} replace />} />
        </Routes>
      </div>
    </div>
  );
};

function App() {
  // Global application state
  const [globalState, setGlobalState] = useState({
    theme: 'dark',
    currentUser: null,
    isAuthenticated: false
  });

  // Global state handlers
  const updateGlobalState = (updates) => {
    setGlobalState(prev => ({ ...prev, ...updates }));
  };

  return (
    <Router>
      <div className={`app ${globalState.theme === 'dark' ? 'dark' : ''}`}>
        <AppContent />
      </div>
    </Router>
  );
}

export default App;
