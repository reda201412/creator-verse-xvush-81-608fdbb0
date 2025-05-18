import { UploadMetadata } from './types';

/**
 * Format file size to human readable format
 */
export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

/**
 * Get file extension from filename
 */
export const getFileExtension = (filename: string): string => {
  return filename.split('.').pop()?.toLowerCase() || '';
};

/**
 * Validate video file
 */
export const validateVideoFile = (file: File): { valid: boolean; error?: string } => {
  const MAX_SIZE = 500 * 1024 * 1024; // 500MB
  const ALLOWED_TYPES = [
    'video/mp4', 
    'video/quicktime', 
    'video/webm', 
    'video/x-matroska', 
    'video/x-msvideo', 
    'video/mpeg'
  ];
  
  if (file.size > MAX_SIZE) {
    return {
      valid: false,
      error: `La taille du fichier dépasse la limite de ${MAX_SIZE / (1024 * 1024)}MB.`
    };
  }
  
  if (!ALLOWED_TYPES.includes(file.type)) {
    return {
      valid: false,
      error: 'Type de fichier vidéo non supporté. Veuillez choisir un fichier MP4, MOV, WebM, MKV, AVI ou MPEG.'
    };
  }
  
  return { valid: true };
};

/**
 * Generate a thumbnail from video file
 */
export const generateThumbnail = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const video = document.createElement('video');
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');
    
    video.preload = 'metadata';
    
    video.onloadedmetadata = () => {
      // Set canvas dimensions
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      
      // Capture a frame at 25% of the video duration
      video.currentTime = video.duration * 0.25;
    };
    
    video.onseeked = () => {
      if (!context) {
        reject(new Error('Could not get canvas context'));
        return;
      }
      
      context.drawImage(video, 0, 0, canvas.width, canvas.height);
      
      // Convert canvas to blob
      canvas.toBlob((blob) => {
        if (!blob) {
          reject(new Error('Failed to create thumbnail'));
          return;
        }
        
        const thumbnailUrl = URL.createObjectURL(blob);
        resolve(thumbnailUrl);
      }, 'image/jpeg', 0.8);
    };
    
    video.onerror = () => {
      reject(new Error('Error loading video file'));
    };
    
    video.src = URL.createObjectURL(file);
  });
};

/**
 * Format metadata for API submission
 */
export const formatMetadataForApi = (metadata: UploadMetadata): FormData => {
  const formData = new FormData();
  
  // Add all metadata fields
  Object.entries(metadata).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      if (value instanceof Date) {
        formData.append(key, value.toISOString());
      } else if (Array.isArray(value)) {
        formData.append(key, JSON.stringify(value));
      } else if (typeof value === 'object') {
        formData.append(key, JSON.stringify(value));
      } else {
        formData.append(key, value.toString());
      }
    }
  });
  
  return formData;
};

/**
 * Format duration in seconds to HH:MM:SS
 */
export const formatDuration = (seconds: number): string => {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = Math.floor(seconds % 60);
  
  return [
    h,
    m.toString().padStart(2, '0'),
    s.toString().padStart(2, '0')
  ].filter(Boolean).join(':');
};

/**
 * Calculate video dimensions while maintaining aspect ratio
 */
export const calculateAspectRatio = (
  width: number, 
  height: number, 
  maxWidth: number = 1280, 
  maxHeight: number = 720
): { width: number; height: number } => {
  const ratio = Math.min(maxWidth / width, maxHeight / height);
  return {
    width: Math.floor(width * ratio),
    height: Math.floor(height * ratio)
  };
};
