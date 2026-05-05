import { useEffect, useRef } from 'react';
import { getStreamUrl } from '../api';

function formatBytes(bytes) {
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export default function VideoPlayer({ video, onClose }) {
  const videoRef = useRef();

  // Close on Escape
  useEffect(() => {
    const handler = (e) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [onClose]);

  // Auto-play
  useEffect(() => {
    videoRef.current?.play().catch(() => {});
  }, []);

  return (
    <div className="player-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="player-modal">
        <div className="player-header">
          <h2 className="player-title">{video.title}</h2>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>

        <video
          ref={videoRef}
          className="player-video"
          src={getStreamUrl(video._id)}
          controls
          controlsList="nodownload"
          playsInline
        />

        <div className="player-meta">
          <span>📁 {video.originalName}</span>
          <span>💾 {formatBytes(video.size)}</span>
          <span>📅 {new Date(video.createdAt).toLocaleDateString()}</span>
        </div>
      </div>
    </div>
  );
}
