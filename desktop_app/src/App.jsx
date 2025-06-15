import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';

import { HomePage } from './pages';
import EditorLayout from './pages/EditorLayout';
import { VideoView, TranscriptView, ExportView } from './pages/editor';


import { ROUTES } from './config/routes';

const AppContent = () => {
  const location = useLocation();
  const [isNavOpen, setIsNavOpen] = useState(false);
  const hideNavigation = location.pathname.startsWith(ROUTES.EDITOR);
  return (
    <div className={`bg-zinc-950 text-neutral-100 flex ${hideNavigation ? 'h-screen overflow-hidden' : 'min-h-screen'}`}>
      <div className={`flex-1 transition-all duration-300 ${
        !hideNavigation && isNavOpen ? 'ml-64' : 'ml-0'
      }`}>
        <Routes>
          <Route path={ROUTES.HOME} element={<HomePage />} />
    
          <Route path={ROUTES.EDITOR} element={<EditorLayout />}>
            <Route index element={<VideoView />} />
            <Route path="transcript" element={<TranscriptView />} />
            <Route path="export" element={<ExportView />} />
          </Route>
          
        
          {/* <Route path="*" element={<Navigate to={ROUTES.HOME} replace />} /> */}
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
