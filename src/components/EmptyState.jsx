/**
 * EmptyState - reusable "nothing to show" panel with an icon and a
 * message. Used both for "no rooms exist yet" and "search/filter
 * returned nothing" so the app never shows a blank screen.
 */
function EmptyState({ message = 'No rooms found.', hint }) {
  return (
    <div className="empty-state" role="status">
      <div className="empty-state__icon" aria-hidden="true">
        <svg viewBox="0 0 24 24" width="40" height="40" fill="none">
          <rect x="3" y="7" width="18" height="13" rx="2" stroke="currentColor" strokeWidth="1.6" />
          <path d="M8 7V5a2 2 0 012-2h4a2 2 0 012 2v2" stroke="currentColor" strokeWidth="1.6" />
          <path d="M3 12h18" stroke="currentColor" strokeWidth="1.6" />
        </svg>
      </div>
      <p className="empty-state__message">{message}</p>
      {hint && <p className="empty-state__hint">{hint}</p>}
    </div>
  );
}

export default EmptyState;
