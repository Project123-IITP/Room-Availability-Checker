import { ROOM_STATUSES } from '../data/rooms';
import { formatDateTime } from '../utils/format';

/**
 * RoomCard - renders one room as a compact card. Used on narrow
 * viewports (via CSS display toggling) as the responsive replacement
 * for a table row, so the dashboard never forces horizontal scrolling
 * on mobile.
 */
function RoomCard({ room, onStatusChange }) {
  return (
    <div className="room-card">
      <div className="room-card__top">
        <span className="room-card__number">Room {room.number}</span>
        <span className={`status-pill status-pill--${room.status.toLowerCase()}`}>
          {room.status}
        </span>
      </div>

      <p className="room-card__type">{room.type}</p>

      <p className="room-card__updated">
        Updated {formatDateTime(room.lastUpdated)}
      </p>

      <label className="room-card__status-label" htmlFor={`status-${room.id}`}>
        Update status
      </label>
      <select
        id={`status-${room.id}`}
        className="room-card__status-select"
        value={room.status}
        onChange={(e) => onStatusChange(room.id, e.target.value)}
        aria-label={`Update status for room ${room.number}`}
      >
        {ROOM_STATUSES.map((status) => (
          <option key={status} value={status}>
            {status}
          </option>
        ))}
      </select>
    </div>
  );
}

export default RoomCard;
