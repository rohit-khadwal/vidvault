import { useRef, useEffect, useState } from 'react';
import { getStreamUrl } from '../api';

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
  const videoRef = useRef();
  const [thumbReady, setThumbReady] = useState(false);
  const [thumbUrl, setThumbUrl] = useState(null);

  // Generate thumbnail by loading video and snapping first frame
  useEffect(() => {
    const vid = document.createElement('video');
    vid.src = getStreamUrl(video._id);
    vid.crossOrigin = 'anonymous';
    vid.muted = true;
    vid.currentTime = 1;

    vid.addEventListener('seeked', () => {
      const canvas = document.createElement('canvas');
      canvas.width = 320;
      canvas.height = 180;
      canvas.getContext('2d').drawImage(vid, 0, 0, 320, 180);
      setThumbUrl(canvas.toDataURL('image/jpeg', 0.7));
      setThumbReady(true);
    });

    vid.addEventListener('error', () => setThumbReady(true)); // show fallback
    vid.load();
  }, [video._id]);

  return (
    <div className="video-card" onClick={onPlay}>
      <div className="card-thumb">
        {thumbUrl ? (
          <img src={thumbUrl} alt={video.title} />
        ) : (
          <div className="thumb-placeholder">
            <span>🎞️</span>
          </div>
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
