import { useState, useRef, useCallback } from 'react';
import toast from 'react-hot-toast';
import { uploadVideo } from '../api';

const ACCEPTED = ['video/mp4', 'video/quicktime', 'video/x-msvideo', 'video/webm', 'video/x-matroska'];

function formatBytes(bytes) {
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export default function UploadZone({ onUploaded, onClose }) {
  const [file, setFile] = useState(null);
  const [title, setTitle] = useState('');
  const [dragging, setDragging] = useState(false);
  const [progress, setProgress] = useState(0);
  const [uploading, setUploading] = useState(false);
  const inputRef = useRef();

  const handleFile = (f) => {
    if (!ACCEPTED.includes(f.type)) {
      toast.error('Unsupported file type. Use MP4, MOV, AVI, WebM, or MKV.');
      return;
    }
    if (f.size > 500 * 1024 * 1024) {
      toast.error('File too large. Max 500 MB.');
      return;
    }
    setFile(f);
    setTitle(f.name.replace(/\.[^.]+$/, ''));
  };

  const onDrop = useCallback((e) => {
    e.preventDefault();
    setDragging(false);
    const f = e.dataTransfer.files[0];
    if (f) handleFile(f);
  }, []);

  const onDragOver = (e) => { e.preventDefault(); setDragging(true); };
  const onDragLeave = () => setDragging(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) return;

    const fd = new FormData();
    fd.append('video', file);
    fd.append('title', title || file.name);

    try {
      setUploading(true);
      const { data } = await uploadVideo(fd, setProgress);
      onUploaded(data);
    } catch (err) {
      toast.error(err.response?.data?.error || 'Upload failed');
      setUploading(false);
      setProgress(0);
    }
  };

  return (
    <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && !uploading && onClose()}>
      <div className="upload-modal">
        <div className="modal-header">
          <h2>Upload Video</h2>
          {!uploading && (
            <button className="modal-close" onClick={onClose}>✕</button>
          )}
        </div>

        <form onSubmit={handleSubmit}>
          {!file ? (
            <div
              className={`drop-zone ${dragging ? 'dragging' : ''}`}
              onDrop={onDrop}
              onDragOver={onDragOver}
              onDragLeave={onDragLeave}
              onClick={() => inputRef.current.click()}
            >
              <div className="drop-icon">📹</div>
              <p className="drop-title">Drag & drop a video here</p>
              <p className="drop-sub">or click to browse</p>
              <p className="drop-hint">MP4, MOV, AVI, WebM, MKV · Max 500 MB</p>
              <input
                ref={inputRef}
                type="file"
                accept="video/*"
                hidden
                onChange={(e) => e.target.files[0] && handleFile(e.target.files[0])}
              />
            </div>
          ) : (
            <div className="file-preview">
              <div className="file-info">
                <span className="file-icon">🎞️</span>
                <div>
                  <p className="file-name">{file.name}</p>
                  <p className="file-size">{formatBytes(file.size)}</p>
                </div>
                {!uploading && (
                  <button type="button" className="file-remove" onClick={() => { setFile(null); setProgress(0); }}>✕</button>
                )}
              </div>

              <div className="form-group">
                <label>Title</label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Enter video title..."
                  disabled={uploading}
                  maxLength={200}
                />
              </div>

              {uploading && (
                <div className="progress-wrap">
                  <div className="progress-bar">
                    <div className="progress-fill" style={{ width: `${progress}%` }} />
                  </div>
                  <span className="progress-label">{progress}%</span>
                </div>
              )}
            </div>
          )}

          {file && (
            <div className="modal-actions">
              <button type="button" className="btn-cancel" onClick={onClose} disabled={uploading}>
                Cancel
              </button>
              <button type="submit" className="btn-primary" disabled={uploading || !file}>
                {uploading ? `Uploading ${progress}%...` : 'Upload Video'}
              </button>
            </div>
          )}
        </form>
      </div>
    </div>
  );
}
