
import axios from 'axios';
import { toast } from 'sonner';

export interface VideoUploadResponse {
  id: string;
  url: string;
  assetId: string;
  uploadId: string;
  playbackId?: string;
  status: string;
}

export async function uploadVideoToMux(file: File): Promise<VideoUploadResponse> {
  try {
    // 1. Request upload URL from our backend
    const response = await axios.post('/api/mux/upload', {
      contentType: file.type,
      filename: file.name,
    });

    const { url, id, assetId } = response.data;
    
    if (!url) {
      throw new Error('Failed to get upload URL');
    }
    
    // 2. Upload the file directly to MUX
    await axios.put(url, file, {
      headers: {
        'Content-Type': file.type,
      },
      onUploadProgress: (progressEvent) => {
        const percentCompleted = Math.round(
          (progressEvent.loaded * 100) / (progressEvent.total || 100)
        );
        console.log(`Upload progress: ${percentCompleted}%`);
      },
    });
    
    // 3. Return the response data with playbackId (may be added later via webhook)
    return {
      id,
      url,
      assetId,
      uploadId: id, // Making uploadId match the id for compatibility
      playbackId: `playback_${id}`, // Default mock playbackId
      status: 'uploaded',
    };
  } catch (error) {
    console.error('Error uploading to MUX:', error);
    toast.error('Failed to upload video');
    throw new Error(error instanceof Error ? error.message : 'Upload failed');
  }
}

// Helper function to format MUX playback URLs
export function getMuxPlaybackUrl(playbackId: string, format: string = 'mp4') {
  if (!playbackId) return '';
  
  return `https://stream.mux.com/${playbackId}.${format}`;
}

// Add thumbnail upload function
export async function uploadThumbnail(file: File, videoId: string): Promise<string> {
  try {
    const formData = new FormData();
    formData.append('thumbnail', file);
    
    const response = await axios.post(`/api/videos/${videoId}/thumbnail`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    
    return response.data.thumbnailUrl;
  } catch (error) {
    console.error('Error uploading thumbnail:', error);
    throw new Error(error instanceof Error ? error.message : 'Thumbnail upload failed');
  }
}
