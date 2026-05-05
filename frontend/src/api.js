import axios from 'axios';

const api = axios.create({ baseURL: '/api' });

export const fetchVideos = (search = '') =>
  api.get(`/videos${search ? `?search=${encodeURIComponent(search)}` : ''}`);

export const uploadVideo = (formData, onProgress) =>
  api.post('/videos', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
    onUploadProgress: (e) => {
      if (onProgress) onProgress(Math.round((e.loaded * 100) / e.total));
    },
  });

export const deleteVideo = (id) => api.delete(`/videos/${id}`);

export const updateVideoTitle = (id, title) => api.patch(`/videos/${id}`, { title });

export const getStreamUrl = (id) => `/api/videos/${id}/stream`;
