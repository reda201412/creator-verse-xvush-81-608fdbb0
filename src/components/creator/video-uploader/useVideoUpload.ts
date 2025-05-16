
import { z } from 'zod';

// Define the schema for the form
export const videoFormSchema = z.object({
  title: z.string().min(1, 'Un titre est requis'),
  description: z.string().optional(),
  videoType: z.enum(['standard', 'teaser', 'premium', 'vip']),
  allowSharing: z.boolean().default(false),
  allowDownload: z.boolean().default(false),
  subscriptionLevel: z.enum(['free', 'fan', 'superfan', 'vip', 'exclusive']).default('free'),
  tokenPrice: z.number().min(0).default(0),
});

// Define the type based on the schema
export type VideoFormValues = z.infer<typeof videoFormSchema>;

// Function to convert file size to readable format
export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

// Helper function to generate a thumbnail from a video file
export const generateVideoThumbnail = (videoFile: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const video = document.createElement('video');
    video.preload = 'metadata';
    video.onloadedmetadata = () => {
      // Seek to a frame at 25% of the video
      video.currentTime = video.duration * 0.25;
    };
    video.oncanplay = () => {
      const canvas = document.createElement('canvas');
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const ctx = canvas.getContext('2d');
      ctx?.drawImage(video, 0, 0, canvas.width, canvas.height);
      const thumbnail = canvas.toDataURL('image/jpeg', 0.8);
      resolve(thumbnail);
    };
    video.onerror = (e) => {
      reject(new Error('Error generating thumbnail: ' + e));
    };
    video.src = URL.createObjectURL(videoFile);
  });
};

// Helper function to detect video format based on aspect ratio
export const detectVideoFormat = (width: number, height: number): '16:9' | '9:16' | '1:1' | 'other' => {
  const ratio = width / height;
  if (Math.abs(ratio - 16/9) < 0.1) return '16:9';
  if (Math.abs(ratio - 9/16) < 0.1) return '9:16';
  if (Math.abs(ratio - 1) < 0.1) return '1:1';
  return 'other';
};
