import SearchBar from './SearchBar';

/**
 * Navbar - top bar with the hotel name, a search input (mirrors the
 * same searchTerm/onSearchChange state used by the main SearchBar, so
 * staff can search from either place), and a profile avatar.
 */
function Navbar({ searchTerm, onSearchChange, onToggleSidebar }) {
  return (
    <header className="navbar">
      <button
        type="button"
        className="navbar__menu-btn"
        onClick={onToggleSidebar}
        aria-label="Toggle navigation menu"
      >
        <svg viewBox="0 0 24 24" width="20" height="20" fill="none">
          <path d="M4 6h16M4 12h16M4 18h16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        </svg>
      </button>

      <h1 className="navbar__hotel-name">Harborview Hotel</h1>

      <div className="navbar__search">
        <SearchBar value={searchTerm} onChange={onSearchChange} id="navbar-room-search" />
      </div>

      <div className="navbar__profile">
        <span className="navbar__profile-name">Front Desk</span>
        <div className="navbar__avatar" aria-hidden="true">FD</div>
      </div>
    </header>
  );
}

export default Navbar;
