import { useState } from 'react';
import { getStreamUrl, getThumbnailUrl } from '../api';

function formatBytes(bytes) {
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function timeAgo(dateStr) {
  const diff = Date.now() - new Date(dateStr);
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
}

export default function VideoCard({ video, onPlay, onDelete }) {
  const thumb = getThumbnailUrl(video);
  const [imgError, setImgError] = useState(false);

  return (
    <div className="video-card" onClick={onPlay}>
      <div className="card-thumb">
        {thumb && !imgError ? (
          <img src={thumb} alt={video.title} onError={() => setImgError(true)} />
        ) : (
          <div className="thumb-placeholder"><span>🎞️</span></div>
        )}
        <div className="play-overlay">
          <div className="play-btn">▶</div>
        </div>
      </div>

      <div className="card-info">
        <h3 className="card-title" title={video.title}>{video.title}</h3>
        <div className="card-meta">
          <span>{formatBytes(video.size)}</span>
          <span>·</span>
          <span>{timeAgo(video.createdAt)}</span>
          {video.duration && (
            <>
              <span>·</span>
              <span>{Math.floor(video.duration / 60)}:{String(Math.floor(video.duration % 60)).padStart(2, '0')}</span>
            </>
          )}
        </div>
      </div>

      <button
        className="card-delete"
        title="Delete"
        onClick={(e) => { e.stopPropagation(); onDelete(); }}
      >
        🗑️
      </button>
    </div>
  );
}
