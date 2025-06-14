// Mock data for the application

export const projects = [
  { id: 'current-project', name: 'AI Ethics Podcast - Episode 1' },
  { id: 'project-2', name: 'Tech Talk - Future of Work' }
];

export const speakers = [
  { id: 'host', name: 'Alex Chen', color: '#3b82f6', avatar: undefined },
  { id: 'guest', name: 'Dr. Sarah Martinez', color: '#10b981', avatar: undefined }
];

// Transcription data for the TranscriptEditor (uses speaker IDs)
export const transcriptionData = [
  {
    id: '1',
    start: 0,
    end: 5.2,
    text: "Welcome to our podcast. Today we're discussing the future of artificial intelligence and its impact on society.",
    speaker: 'host',
    confidence: 0.98
  },
  {
    id: '2',
    start: 5.2,
    end: 12.8,
    text: "That's a fascinating topic. I think AI will transform how we work, learn, and even think about creativity.",
    speaker: 'guest',
    confidence: 0.94
  },
  {
    id: '3',
    start: 12.8,
    end: 18.5,
    text: "Absolutely. But we also need to consider the ethical implications and ensure that AI development is responsible.",
    speaker: 'host',
    confidence: 0.96
  },
  {
    id: '4',
    start: 18.5,
    end: 26.2,
    text: "I completely agree. We need frameworks and policies that guide AI development while still encouraging innovation.",
    speaker: 'guest',
    confidence: 0.92
  },  {
    id: '5',
    start: 26.2,
    end: 34.8,
    text: "Exactly. And it's not just about the technology itself, but how it integrates into our social and economic systems.",
    speaker: 'host',
    confidence: 0.97
  },
  {
    id: '6',
    start: 34.8,
    end: 45.0,
    text: "That's a great point. We should also consider the global implications and ensure equitable access to AI benefits.",
    speaker: 'guest',
    confidence: 0.95
  }
];

export const getTranscriptSegments = (speakers) => [
  {
    id: '1',
    start: 0,
    end: 5.2,
    text: "Welcome to our podcast. Today we're discussing the future of artificial intelligence and its impact on society.",
    speaker: speakers[0],
    confidence: 0.98,
    isEditable: true
  },
  {
    id: '2',
    start: 5.2,
    end: 12.8,
    text: "That's a fascinating topic. I think AI will transform how we work, learn, and even think about creativity.",
    speaker: speakers[1],
    confidence: 0.94,
    isEditable: true
  },
  {
    id: '3',
    start: 12.8,
    end: 18.5,
    text: "Absolutely. But we also need to consider the ethical implications and ensure that AI development is responsible.",
    speaker: speakers[0],
    confidence: 0.96,
    isEditable: true
  },
  {
    id: '4',
    start: 18.5,
    end: 26.2,
    text: "I completely agree. We need frameworks and policies that guide AI development while still encouraging innovation.",
    speaker: speakers[1],
    confidence: 0.92,
    isEditable: true
  },
  {
    id: '5',
    start: 26.2,
    end: 34.8,
    text: "Exactly. And it's not just about the technology itself, but how it integrates into our social and economic systems.",
    speaker: speakers[0],
    confidence: 0.97,
    isEditable: true
  },
  {
    id: '6',
    start: 34.8,
    end: 45.0,
    text: "That's a great point. We should also consider the global implications and ensure equitable access to AI benefits.",
    speaker: speakers[1],
    confidence: 0.95,
    isEditable: true
  }
];

export const timelineTracks = [
  {
    id: 'audio-host',
    name: 'Alex Chen',
    type: 'audio',
    segments: [
      { id: 'seg-1', start: 0, end: 5.2, color: '#3b82f6', trackId: 'audio-host', gain: 1 },
      { id: 'seg-3', start: 12.8, end: 18.5, color: '#3b82f6', trackId: 'audio-host', gain: 1 },
      { id: 'seg-5', start: 26.2, end: 34.8, color: '#3b82f6', trackId: 'audio-host', gain: 1 }
    ],
    muted: false,
    volume: 1,
    solo: false
  },
  {
    id: 'audio-guest',
    name: 'Dr. Sarah Martinez',
    type: 'audio',
    segments: [
      { id: 'seg-2', start: 5.2, end: 12.8, color: '#10b981', trackId: 'audio-guest', gain: 1 },
      { id: 'seg-4', start: 18.5, end: 26.2, color: '#10b981', trackId: 'audio-guest', gain: 1 },
      { id: 'seg-6', start: 34.8, end: 45.0, color: '#10b981', trackId: 'audio-guest', gain: 1 }
    ],
    muted: false,
    volume: 1,
    solo: false
  },
  {
    id: 'music-bg',
    name: 'Background Music',
    type: 'music',
    segments: [
      { id: 'music-1', start: 0, end: 45, color: '#8b5cf6', trackId: 'music-bg', gain: 0.3 },
      { id: 'music-2', start: 135, end: 180, color: '#8b5cf6', trackId: 'music-bg', gain: 0.3 }
    ],
    muted: false,
    volume: 0.6,
    solo: false
  }
];

// Default settings
export const defaultTtsSettings = {
  voiceModel: 'xtts-v2',
  pitch: 0,
  speed: 1,
  emotion: 'neutral'
};

export const defaultExportSettings = {
  format: 'wav',
  quality: 'high',
  splitSpeakers: true,
  includeChapters: true,
  embedTranscript: true,
  transcriptFormat: 'srt'
};

export const defaultMacros = {
  removeFiller: false,
  removeStutter: false,
  adjustPacing: false,
  adjustProsody: false
};

export const defaultMacroSettings = {
  removeFiller: {
    aggressiveness: 5,
    preserveNatural: true
  },
  adjustPacing: {
    paceMultiplier: 1,
    pauseDuration: 0.5
  },
  removeStutter: {
    sensitivity: 7,
    preserveEmphasis: true
  },
  enhanceClarity: {
    enhanceContractions: true,
    preserveAccent: true
  }
};
