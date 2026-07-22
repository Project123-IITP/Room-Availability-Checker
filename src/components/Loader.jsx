/**
 * Loader - shown while the simulated network fetch is in flight.
 * Combines a spinner + message with a skeleton preview of the table
 * so the layout doesn't jump once real data arrives.
 */
function Loader() {
  // A handful of skeleton rows is enough to suggest "a table is coming"
  const skeletonRows = Array.from({ length: 6 });

  return (
    <div className="loader" role="status" aria-live="polite">
      <div className="loader__spinner-row">
        <span className="loader__spinner" aria-hidden="true" />
        <p className="loader__message">Loading room availability…</p>
      </div>

      <div className="loader__skeleton" aria-hidden="true">
        {skeletonRows.map((_, index) => (
          <div className="loader__skeleton-row" key={index}>
            <span className="loader__skeleton-block loader__skeleton-block--sm" />
            <span className="loader__skeleton-block loader__skeleton-block--md" />
            <span className="loader__skeleton-block loader__skeleton-block--sm" />
            <span className="loader__skeleton-block loader__skeleton-block--md" />
          </div>
        ))}
      </div>
    </div>
  );
}

export default Loader;
