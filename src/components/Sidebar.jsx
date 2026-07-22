const NAV_ITEMS = [
  { key: 'dashboard', label: 'Dashboard', icon: '▦' },
  { key: 'rooms', label: 'Rooms', icon: '▤' },
  { key: 'availability', label: 'Availability', icon: '◔' },
  { key: 'settings', label: 'Settings', icon: '⚙' },
];

/**
 * Sidebar - primary navigation. Since React Router isn't allowed, this
 * simply lifts an `activeView` string up to App.jsx via `onNavigate`,
 * and App conditionally renders the matching section. No routing,
 * just prop-drilled local view state.
 */
function Sidebar({ activeView, onNavigate, isOpen, onCloseMobile }) {
  const handleNavigate = (key) => {
    onNavigate(key);
    onCloseMobile();
  };

  return (
    <>
      {isOpen && (
        <div
          className="sidebar__scrim"
          onClick={onCloseMobile}
          aria-hidden="true"
        />
      )}
      <aside
        className={`sidebar ${isOpen ? 'sidebar--open' : ''}`}
        aria-label="Primary navigation"
      >
        <div className="sidebar__brand">
          <span className="sidebar__brand-mark" aria-hidden="true">H</span>
          <span className="sidebar__brand-name">Harborview</span>
        </div>

        <nav>
          <ul className="sidebar__nav">
            {NAV_ITEMS.map((item) => (
              <li key={item.key}>
                <button
                  type="button"
                  className={`sidebar__nav-item ${
                    activeView === item.key ? 'sidebar__nav-item--active' : ''
                  }`}
                  onClick={() => handleNavigate(item.key)}
                  aria-current={activeView === item.key ? 'page' : undefined}
                >
                  <span className="sidebar__nav-icon" aria-hidden="true">{item.icon}</span>
                  {item.label}
                </button>
              </li>
            ))}
          </ul>
        </nav>

        <div className="sidebar__footer">
          <p className="sidebar__footer-text">Staff Console</p>
          <p className="sidebar__footer-version">v1.0.0</p>
        </div>
      </aside>
    </>
  );
}

export default Sidebar;
