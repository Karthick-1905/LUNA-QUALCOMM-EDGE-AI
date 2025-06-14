// Custom hooks for TanStack React Query integration
// These hooks will be ready to use when you integrate the backend

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiService, QUERY_KEYS } from '../services/apiService';


// Transcription hooks
export const useTranscribeAudio = () => {
  return useMutation({
    mutationFn: ({ audioFile, options }) => apiService.transcribeAudio(audioFile, options),
  });
};

export const useTranscriptionStatus = (id) => {
  return useQuery({
    queryKey: QUERY_KEYS.TRANSCRIPTION_STATUS(id),
    queryFn: () => apiService.getTranscriptionStatus(id),
    enabled: !!id,
    refetchInterval: (data) => {
      // Stop polling when transcription is complete
      return data?.status === 'completed' || data?.status === 'failed' ? false : 2000;
    },
  });
};

// TTS hooks
export const useGenerateTTS = () => {
  return useMutation({
    mutationFn: ({ text, voice, settings }) => apiService.generateTTS(text, voice, settings),
  });
};

export const useTTSStatus = (id) => {
  return useQuery({
    queryKey: QUERY_KEYS.TTS_STATUS(id),
    queryFn: () => apiService.getTTSStatus(id),
    enabled: !!id,
    refetchInterval: (data) => {
      return data?.status === 'completed' || data?.status === 'failed' ? false : 1000;
    },
  });
};

// Export hooks
export const useExportProject = () => {
  return useMutation({
    mutationFn: ({ projectId, exportSettings }) => apiService.exportProject(projectId, exportSettings),
  });
};

export const useExportStatus = (id) => {
  return useQuery({
    queryKey: QUERY_KEYS.EXPORT_STATUS(id),
    queryFn: () => apiService.getExportStatus(id),
    enabled: !!id,
    refetchInterval: (data) => {
      return data?.status === 'completed' || data?.status === 'failed' ? false : 2000;
    },
  });
};

// Audio processing hooks
export const useProcessAudio = () => {
  return useMutation({
    mutationFn: ({ audioFile, processingOptions }) => apiService.processAudio(audioFile, processingOptions),
  });
};

export const useAnalyzeAudio = () => {
  return useMutation({
    mutationFn: apiService.analyzeAudio,
  });
};




