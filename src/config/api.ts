// API Configuration
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://creator-verse-xvush-81-608fdbb0-2st4obiig-reda201412s-projects.vercel.app';

export const API_ENDPOINTS = {
  MUX: {
    CREATE_UPLOAD: `${API_BASE_URL}/api/mux/create-upload`,
    ASSETS: `${API_BASE_URL}/api/mux/assets`,
  },
  OSS: {
    UPLOAD_THUMBNAIL: `${API_BASE_URL}/api/oss/upload-thumbnail`,
  },
};

export default API_ENDPOINTS; 