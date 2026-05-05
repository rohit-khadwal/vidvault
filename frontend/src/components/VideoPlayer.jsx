import { useEffect, useRef } from 'react';
import { getStreamUrl } from '../api';

function formatBytes(bytes) {
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export default function VideoPlayer({ video, onClose }) {
  const videoRef = useRef();

  useEffect(() => {
    const handler = (e) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [onClose]);

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
          src={getStreamUrl(video)}
          controls
          playsInline
        />

        <div className="player-meta">
          <span>📁 {video.originalName}</span>
          <span>💾 {formatBytes(video.size)}</span>
          {video.duration && <span>⏱ {Math.floor(video.duration / 60)}:{String(Math.floor(video.duration % 60)).padStart(2, '0')}</span>}
          <span>📅 {new Date(video.createdAt).toLocaleDateString()}</span>
        </div>
      </div>
    </div>
  );
}
