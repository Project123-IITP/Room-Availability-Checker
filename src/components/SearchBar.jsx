/**
 * SearchBar - controlled search input. Search happens across room
 * number, type, and status (the filtering itself lives in App.jsx via
 * useMemo); this component only owns the input's markup/accessibility.
 */
function SearchBar({ value, onChange, id = 'room-search' }) {
  return (
    <div className="search-bar">
      <svg
        className="search-bar__icon"
        viewBox="0 0 24 24"
        width="18"
        height="18"
        fill="none"
        aria-hidden="true"
      >
        <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="2" />
        <line x1="21" y1="21" x2="16.65" y2="16.65" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      </svg>

      <label htmlFor={id} className="visually-hidden">
        Search rooms by number, type, or status
      </label>
      <input
        id={id}
        type="text"
        className="search-bar__input"
        placeholder="Search by room number, type, or status…"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        aria-label="Search rooms by number, type, or status"
      />

      {value && (
        <button
          type="button"
          className="search-bar__clear"
          onClick={() => onChange('')}
          aria-label="Clear search"
        >
          ✕
        </button>
      )}
    </div>
  );
}

export default SearchBar;
