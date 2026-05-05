import axios from 'axios';

const BASE = import.meta.env.VITE_API_URL || '/api';

const api = axios.create({ baseURL: BASE });

export const fetchVideos = (search = '') =>
  api.get(`/videos${search ? `?search=${encodeURIComponent(search)}` : ''}`);

export const uploadVideo = (formData, onProgress) =>
  api.post('/videos', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
    onUploadProgress: (e) => onProgress?.(Math.round((e.loaded * 100) / e.total)),
  });

export const deleteVideo = (id) => api.delete(`/videos/${id}`);

export const updateVideoTitle = (id, title) => api.patch(`/videos/${id}`, { title });

// Videos are served directly from Cloudinary — no custom stream route needed
export const getStreamUrl = (video) => video.url;

export const getThumbnailUrl = (video) => video.thumbnailUrl || null;
