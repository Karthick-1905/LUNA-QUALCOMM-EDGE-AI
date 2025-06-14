// Utility functions for the application

// Calculate speaker statistics
export const calculateSpeakerStats = (speakers, transcriptSegments) => {
  return speakers.map(speaker => {
    const segments = transcriptSegments.filter(seg => seg.speaker.id === speaker.id);
    const totalTime = segments.reduce((acc, seg) => acc + (seg.end - seg.start), 0);
    const avgConfidence = segments.reduce((acc, seg) => acc + seg.confidence, 0) / segments.length || 0;
    const wordCount = segments.reduce((acc, seg) => acc + seg.text.split(' ').length, 0);
    
    return {
      speakerId: speaker.id,
      totalTime,
      segmentCount: segments.length,
      averageConfidence: avgConfidence,
      wordsPerMinute: totalTime > 0 ? (wordCount / (totalTime / 60)) : 0
    };
  });
};

// Playback utilities
export const formatTime = (seconds) => {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
};

export const parseTime = (timeString) => {
  const [mins, secs] = timeString.split(':').map(Number);
  return mins * 60 + secs;
};

// Segment utilities
export const findSegmentAtTime = (segments, time) => {
  return segments.find(segment => time >= segment.start && time <= segment.end);
};

export const findActiveSegments = (segments, time) => {
  return segments.filter(segment => time >= segment.start && time <= segment.end);
};

// Export utilities
export const generateExportData = (transcriptSegments, speakers, exportSettings) => {
  const data = {
    timestamp: new Date().toISOString(),
    exportSettings,
    segments: transcriptSegments,
    speakers,
    metadata: {
      totalDuration: Math.max(...transcriptSegments.map(s => s.end)),
      segmentCount: transcriptSegments.length,
      speakerCount: speakers.length
    }
  };
  
  return data;
};

// Undo/Redo utilities
export const createUndoAction = (type, segmentId, originalData, newData) => {
  return {
    type,
    timestamp: Date.now(),
    segmentId,
    originalData,
    newData
  };
};

export const applyUndoAction = (transcriptSegments, action) => {
  return transcriptSegments.map(seg => 
    seg.id === action.segmentId 
      ? { ...seg, ...action.originalData }
      : seg
  );
};

// Macro utilities
export const generateRegenLog = (segmentId, originalText, newText, ttsSettings) => {
  return {
    segmentId,
    timestamp: Date.now(),
    originalText,
    newText,
    ttsSettings,
    audioGenerated: true
  };
};

// Validation utilities
export const validateSegment = (segment) => {
  return {
    isValid: segment.start < segment.end && segment.text.trim().length > 0,
    errors: []
  };
};

export const validateExportSettings = (settings) => {
  const errors = [];
  
  if (!['wav', 'mp3', 'flac'].includes(settings.format)) {
    errors.push('Invalid audio format');
  }
  
  if (!['low', 'medium', 'high'].includes(settings.quality)) {
    errors.push('Invalid quality setting');
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
};

// Local storage utilities
export const saveToLocalStorage = (key, data) => {
  try {
    localStorage.setItem(key, JSON.stringify(data));
    return true;
  } catch (error) {
    console.error('Failed to save to localStorage:', error);
    return false;
  }
};

export const loadFromLocalStorage = (key, defaultValue = null) => {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
  } catch (error) {
    console.error('Failed to load from localStorage:', error);
    return defaultValue;
  }
};

// Debounce utility
export const debounce = (func, wait) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

// Theme utilities
export const getThemeClasses = (isDark) => {
  return {
    bg: isDark ? 'bg-zinc-950' : 'bg-white',
    text: isDark ? 'text-neutral-100' : 'text-gray-900',
    border: isDark ? 'border-zinc-800' : 'border-gray-200',
    panel: isDark ? 'bg-zinc-900' : 'bg-gray-50'
  };
};
