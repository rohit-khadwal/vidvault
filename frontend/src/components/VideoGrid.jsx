import VideoCard from './VideoCard';

export default function VideoGrid({ videos, loading, onPlay, onDelete, search, onUploadClick }) {
  if (loading) {
    return (
      <div className="grid">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="card-skeleton" />
        ))}
      </div>
    );
  }

  if (videos.length === 0) {
    return (
      <div className="empty-state">
        <div className="empty-icon">{search ? '🔍' : '🎬'}</div>
        <h2>{search ? `No videos found for "${search}"` : 'No videos yet'}</h2>
        <p>{search ? 'Try a different search term.' : 'Upload your first video to get started.'}</p>
        {!search && (
          <button className="btn-primary" onClick={onUploadClick}>
            Upload Video
          </button>
        )}
      </div>
    );
  }

  return (
    <div className="grid">
      {videos.map((video) => (
        <VideoCard
          key={video._id}
          video={video}
          onPlay={() => onPlay(video)}
          onDelete={() => onDelete(video._id)}
        />
      ))}
    </div>
  );
}
