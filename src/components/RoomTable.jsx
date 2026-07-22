import RoomCard from './RoomCard';
import EmptyState from './EmptyState';
import { ROOM_STATUSES } from '../data/rooms';
import { formatDateTime } from '../utils/format';

/**
 * Builds a compact list of page numbers to render, e.g.
 * [1, '…', 4, 5, 6, '…', 50] instead of 50 individual buttons.
 */
function getPageNumbers(currentPage, totalPages) {
  const pages = [];
  const windowSize = 1; // pages shown on each side of the current page

  const addPage = (page) => pages.push(page);

  for (let page = 1; page <= totalPages; page++) {
    const isEdge = page === 1 || page === totalPages;
    const isNearCurrent = Math.abs(page - currentPage) <= windowSize;

    if (isEdge || isNearCurrent) {
      addPage(page);
    } else if (pages[pages.length - 1] !== '…') {
      addPage('…');
    }
  }

  return pages;
}

/**
 * RoomTable - the main data view: sortable/sticky-header table on
 * desktop, a stacked RoomCard list on mobile (toggled purely via CSS
 * so there's a single source of truth for the row data), plus
 * pagination controls shared by both layouts.
 */
function RoomTable({
  rooms,
  sortConfig,
  onSortChange,
  onStatusChange,
  currentPage,
  totalPages,
  totalCount,
  pageSize,
  onPageChange,
  emptyMessage,
}) {
  if (rooms.length === 0) {
    return <EmptyState message={emptyMessage} />;
  }

  const renderSortIndicator = (columnKey) => {
    if (sortConfig.key !== columnKey) return null;
    return (
      <span className="room-table__sort-indicator" aria-hidden="true">
        {sortConfig.direction === 'asc' ? '▲' : '▼'}
      </span>
    );
  };

  const sortAriaSort = (columnKey) => {
    if (sortConfig.key !== columnKey) return 'none';
    return sortConfig.direction === 'asc' ? 'ascending' : 'descending';
  };

  const firstRowIndex = (currentPage - 1) * pageSize + 1;
  const lastRowIndex = Math.min(currentPage * pageSize, totalCount);

  return (
    <div className="room-table-container">
      {/* --- Desktop table view --- */}
      <div className="room-table-wrapper">
        <table className="room-table">
          <thead>
            <tr>
              <th scope="col" aria-sort={sortAriaSort('number')}>
                <button
                  type="button"
                  className="room-table__sort-btn"
                  onClick={() => onSortChange('number')}
                >
                  Room Number {renderSortIndicator('number')}
                </button>
              </th>
              <th scope="col">Room Type</th>
              <th scope="col" aria-sort={sortAriaSort('status')}>
                <button
                  type="button"
                  className="room-table__sort-btn"
                  onClick={() => onSortChange('status')}
                >
                  Status {renderSortIndicator('status')}
                </button>
              </th>
              <th scope="col">Last Updated</th>
            </tr>
          </thead>
          <tbody>
            {rooms.map((room) => (
              <tr key={room.id}>
                <td data-label="Room Number">
                  <span className="room-table__number">{room.number}</span>
                </td>
                <td data-label="Room Type">{room.type}</td>
                <td data-label="Status">
                  <label className="visually-hidden" htmlFor={`table-status-${room.id}`}>
                    Update status for room {room.number}
                  </label>
                  <select
                    id={`table-status-${room.id}`}
                    className={`status-select status-select--${room.status.toLowerCase()}`}
                    value={room.status}
                    onChange={(e) => onStatusChange(room.id, e.target.value)}
                  >
                    {ROOM_STATUSES.map((status) => (
                      <option key={status} value={status}>
                        {status}
                      </option>
                    ))}
                  </select>
                </td>
                <td data-label="Last Updated" className="room-table__updated">
                  {formatDateTime(room.lastUpdated)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* --- Mobile card view (same data, CSS toggles which is visible) --- */}
      <div className="room-card-list">
        {rooms.map((room) => (
          <RoomCard key={room.id} room={room} onStatusChange={onStatusChange} />
        ))}
      </div>

      {/* --- Pagination (shared by both layouts) --- */}
      <div className="pagination">
        <p className="pagination__summary">
          Showing <strong>{firstRowIndex}–{lastRowIndex}</strong> of{' '}
          <strong>{totalCount}</strong> rooms
        </p>

        <nav className="pagination__controls" aria-label="Table pagination">
          <button
            type="button"
            className="pagination__btn"
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage === 1}
            aria-label="Previous page"
          >
            ‹ Prev
          </button>

          {getPageNumbers(currentPage, totalPages).map((page, index) =>
            page === '…' ? (
              <span key={`ellipsis-${index}`} className="pagination__ellipsis">
                …
              </span>
            ) : (
              <button
                key={page}
                type="button"
                className={`pagination__page ${
                  page === currentPage ? 'pagination__page--active' : ''
                }`}
                onClick={() => onPageChange(page)}
                aria-current={page === currentPage ? 'page' : undefined}
                aria-label={`Go to page ${page}`}
              >
                {page}
              </button>
            )
          )}

          <button
            type="button"
            className="pagination__btn"
            onClick={() => onPageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            aria-label="Next page"
          >
            Next ›
          </button>
        </nav>
      </div>
    </div>
  );
}

export default RoomTable;
