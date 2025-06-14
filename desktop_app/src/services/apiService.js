// API service configuration for future backend integration with TanStack React Query

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001/api';

// API endpoints
export const API_ENDPOINTS = {
  // Projects
  PROJECTS: '/projects',
  PROJECT_BY_ID: (id) => `/projects/${id}`,
  
  // Transcription
  TRANSCRIBE_AUDIO: '/transcribe',
  TRANSCRIPTION_STATUS: (id) => `/transcribe/status/${id}`,
  
  // TTS
  GENERATE_TTS: '/tts/generate',
  TTS_STATUS: (id) => `/tts/status/${id}`,
  
  // Export
  EXPORT_PROJECT: '/export',
  EXPORT_STATUS: (id) => `/export/status/${id}`,
  
  // Audio processing
  PROCESS_AUDIO: '/audio/process',
  AUDIO_ANALYSIS: '/audio/analyze',
  
  // Settings
  USER_SETTINGS: '/settings',
  SPEAKERS: '/speakers'
};

// Base fetch configuration
const createFetchConfig = (method = 'GET', body = null, headers = {}) => ({
  method,
  headers: {
    'Content-Type': 'application/json',
    ...headers
  },
  ...(body && { body: JSON.stringify(body) })
});

// API service functions (ready for TanStack React Query)
export const apiService = {
  // Projects
  async getProjects() {
    const response = await fetch(`${API_BASE_URL}${API_ENDPOINTS.PROJECTS}`);
    if (!response.ok) throw new Error('Failed to fetch projects');
    return response.json();
  },

  async getProject(id) {
    const response = await fetch(`${API_BASE_URL}${API_ENDPOINTS.PROJECT_BY_ID(id)}`);
    if (!response.ok) throw new Error('Failed to fetch project');
    return response.json();
  },

  async createProject(projectData) {
    const response = await fetch(
      `${API_BASE_URL}${API_ENDPOINTS.PROJECTS}`,
      createFetchConfig('POST', projectData)
    );
    if (!response.ok) throw new Error('Failed to create project');
    return response.json();
  },

  async updateProject(id, projectData) {
    const response = await fetch(
      `${API_BASE_URL}${API_ENDPOINTS.PROJECT_BY_ID(id)}`,
      createFetchConfig('PUT', projectData)
    );
    if (!response.ok) throw new Error('Failed to update project');
    return response.json();
  },

  async deleteProject(id) {
    const response = await fetch(
      `${API_BASE_URL}${API_ENDPOINTS.PROJECT_BY_ID(id)}`,
      createFetchConfig('DELETE')
    );
    if (!response.ok) throw new Error('Failed to delete project');
    return response.json();
  },

  // Transcription
  async transcribeAudio(audioFile, options = {}) {
    const formData = new FormData();
    formData.append('audio', audioFile);
    formData.append('options', JSON.stringify(options));

    const response = await fetch(`${API_BASE_URL}${API_ENDPOINTS.TRANSCRIBE_AUDIO}`, {
      method: 'POST',
      body: formData
    });
    if (!response.ok) throw new Error('Failed to start transcription');
    return response.json();
  },

  async getTranscriptionStatus(id) {
    const response = await fetch(`${API_BASE_URL}${API_ENDPOINTS.TRANSCRIPTION_STATUS(id)}`);
    if (!response.ok) throw new Error('Failed to get transcription status');
    return response.json();
  },

  // TTS
  async generateTTS(text, voice, settings) {
    const response = await fetch(
      `${API_BASE_URL}${API_ENDPOINTS.GENERATE_TTS}`,
      createFetchConfig('POST', { text, voice, settings })
    );
    if (!response.ok) throw new Error('Failed to generate TTS');
    return response.json();
  },

  // Export
  async exportProject(projectId, exportSettings) {
    const response = await fetch(
      `${API_BASE_URL}${API_ENDPOINTS.EXPORT_PROJECT}`,
      createFetchConfig('POST', { projectId, exportSettings })
    );
    if (!response.ok) throw new Error('Failed to start export');
    return response.json();
  },

  // Audio processing
  async processAudio(audioFile, processingOptions) {
    const formData = new FormData();
    formData.append('audio', audioFile);
    formData.append('options', JSON.stringify(processingOptions));

    const response = await fetch(`${API_BASE_URL}${API_ENDPOINTS.PROCESS_AUDIO}`, {
      method: 'POST',
      body: formData
    });
    if (!response.ok) throw new Error('Failed to process audio');
    return response.json();
  },

  async analyzeAudio(audioFile) {
    const formData = new FormData();
    formData.append('audio', audioFile);

    const response = await fetch(`${API_BASE_URL}${API_ENDPOINTS.AUDIO_ANALYSIS}`, {
      method: 'POST',
      body: formData
    });
    if (!response.ok) throw new Error('Failed to analyze audio');
    return response.json();
  },

  // Settings
  async getUserSettings() {
    const response = await fetch(`${API_BASE_URL}${API_ENDPOINTS.USER_SETTINGS}`);
    if (!response.ok) throw new Error('Failed to fetch user settings');
    return response.json();
  },

  async updateUserSettings(settings) {
    const response = await fetch(
      `${API_BASE_URL}${API_ENDPOINTS.USER_SETTINGS}`,
      createFetchConfig('PUT', settings)
    );
    if (!response.ok) throw new Error('Failed to update user settings');
    return response.json();
  }
};

// Query keys for TanStack React Query
export const QUERY_KEYS = {
  PROJECTS: ['projects'],
  PROJECT: (id) => ['projects', id],
  TRANSCRIPTION_STATUS: (id) => ['transcription', 'status', id],
  TTS_STATUS: (id) => ['tts', 'status', id],
  EXPORT_STATUS: (id) => ['export', 'status', id],
  USER_SETTINGS: ['user', 'settings'],
  SPEAKERS: ['speakers']
};

export default apiService;
