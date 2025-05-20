
import React, { createContext, useContext, useReducer, useCallback } from 'react';
import { UploadState, UploadAction, UploaderContextType } from './types';

const initialState: UploadState = {
  stage: 'idle',
  progress: 0,
  file: null,
  thumbnail: null,
  error: null,
  metadata: {
    title: '',
    description: '',
    type: 'standard',
    isPremium: false,
    tokenPrice: 0,
  },
  shieldStatus: {
    encryption: 'inactive',
    watermark: 'inactive',
    drm: 'inactive',
  },
};

function uploadReducer(state: UploadState, action: UploadAction): UploadState {
  switch (action.type) {
    case 'SET_STAGE':
      return { ...state, stage: action.payload };
    case 'SET_PROGRESS':
      return { ...state, progress: action.payload };
    case 'SET_FILE':
      return { ...state, file: action.payload };
    case 'SET_THUMBNAIL':
      return { ...state, thumbnail: action.payload };
    case 'SET_ERROR':
      return { ...state, error: action.payload };
    case 'SET_METADATA':
      return { ...state, metadata: { ...state.metadata, ...action.payload } };
    case 'SET_SHIELD_STATUS':
      return { 
        ...state, 
        shieldStatus: { ...state.shieldStatus, ...action.payload } 
      };
    case 'RESET':
      return { ...initialState };
    default:
      return state;
  }
}

const UploaderContext = createContext<UploaderContextType | undefined>(undefined);

export const UploaderProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(uploadReducer, initialState);

  const setStage = useCallback((stage: UploadState['stage']) => {
    dispatch({ type: 'SET_STAGE', payload: stage });
  }, []); 

  const setProgress = useCallback((progress: number) => {
    dispatch({ type: 'SET_PROGRESS', payload: progress });
  }, []);

  const setFile = useCallback((file: File | null) => {
    dispatch({ type: 'SET_FILE', payload: file });
  }, []); 

  const setThumbnail = useCallback((thumbnail: File | null) => {
    dispatch({ type: 'SET_THUMBNAIL', payload: thumbnail });
  }, []);

  const setError = useCallback((error: string | null) => {
    dispatch({ type: 'SET_ERROR', payload: error });
  }, []); 

  const setMetadata = useCallback((metadata: Partial<UploadState['metadata']>) => {
    dispatch({ type: 'SET_METADATA', payload: metadata });
  }, []);

  const setShieldStatus = useCallback((status: Partial<UploadState['shieldStatus']>) => {
    dispatch({ type: 'SET_SHIELD_STATUS', payload: status });
  }, []);

  const reset = useCallback(() => {
    dispatch({ type: 'RESET' });
  }, []);

  return (
    <UploaderContext.Provider
      value={{
        ...state,
        setStage,
        setProgress,
        setFile,
        setThumbnail,
        setError,
        setMetadata,
        setShieldStatus,
        reset,
      }}
    >
      {children}
    </UploaderContext.Provider>
  );
};

export const useUploader = (): UploaderContextType => {
  const context = useContext(UploaderContext);
  if (context === undefined) {
    throw new Error('useUploader must be used within an UploaderProvider');
  }
  return context;
};
