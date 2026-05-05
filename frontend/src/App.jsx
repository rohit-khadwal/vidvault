import { useState, useEffect, useCallback } from 'react';
import toast from 'react-hot-toast';
import Navbar from './components/Navbar';
import UploadZone from './components/UploadZone';
import VideoGrid from './components/VideoGrid';
import VideoPlayer from './components/VideoPlayer';
import { fetchVideos, deleteVideo } from './api';

export default function App() {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [activeVideo, setActiveVideo] = useState(null);
  const [showUpload, setShowUpload] = useState(false);

  const loadVideos = useCallback(async (q = '') => {
    try {
      setLoading(true);
      const { data } = await fetchVideos(q);
      setVideos(data);
    } catch {
      toast.error('Failed to load videos');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadVideos();
  }, [loadVideos]);

  // Debounced search
  useEffect(() => {
    const t = setTimeout(() => loadVideos(search), 350);
    return () => clearTimeout(t);
  }, [search, loadVideos]);

  const handleUploaded = (video) => {
    setVideos((prev) => [video, ...prev]);
    setShowUpload(false);
    toast.success(`"${video.title}" uploaded!`);
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this video?')) return;
    try {
      await deleteVideo(id);
      setVideos((prev) => prev.filter((v) => v._id !== id));
      if (activeVideo?._id === id) setActiveVideo(null);
      toast.success('Video deleted');
    } catch {
      toast.error('Delete failed');
    }
  };

  return (
    <div className="app">
      <Navbar
        search={search}
        onSearch={setSearch}
        onUploadClick={() => setShowUpload(true)}
        videoCount={videos.length}
      />

      <main className="main">
        {showUpload && (
          <UploadZone
            onUploaded={handleUploaded}
            onClose={() => setShowUpload(false)}
          />
        )}

        <VideoGrid
          videos={videos}
          loading={loading}
          onPlay={setActiveVideo}
          onDelete={handleDelete}
          search={search}
          onUploadClick={() => setShowUpload(true)}
        />
      </main>

      {activeVideo && (
        <VideoPlayer
          video={activeVideo}
          onClose={() => setActiveVideo(null)}
        />
      )}
    </div>
  );
}
