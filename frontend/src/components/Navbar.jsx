export default function Navbar({ search, onSearch, onUploadClick, videoCount }) {
  return (
    <nav className="navbar">
      <div className="navbar-inner">
        <div className="navbar-brand">
          <span className="brand-icon">🎬</span>
          <span className="brand-name">VidVault</span>
          {videoCount > 0 && (
            <span className="brand-count">{videoCount} videos</span>
          )}
        </div>

        <div className="navbar-search">
          <svg className="search-icon" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M9 3a6 6 0 100 12A6 6 0 009 3zM1 9a8 8 0 1114.32 4.906l3.387 3.387a1 1 0 01-1.414 1.414l-3.387-3.387A8 8 0 011 9z" clipRule="evenodd"/>
          </svg>
          <input
            type="text"
            placeholder="Search videos..."
            value={search}
            onChange={(e) => onSearch(e.target.value)}
            className="search-input"
          />
          {search && (
            <button className="search-clear" onClick={() => onSearch('')}>✕</button>
          )}
        </div>

        <button className="btn-upload" onClick={onUploadClick}>
          <svg viewBox="0 0 20 20" fill="currentColor" width="16" height="16">
            <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM6.293 6.707a1 1 0 010-1.414l3-3a1 1 0 011.414 0l3 3a1 1 0 01-1.414 1.414L11 5.414V13a1 1 0 11-2 0V5.414L7.707 6.707a1 1 0 01-1.414 0z" clipRule="evenodd"/>
          </svg>
          Upload
        </button>
      </div>
    </nav>
  );
}
