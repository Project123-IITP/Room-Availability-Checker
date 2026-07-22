/**
 * Formats an ISO timestamp into a short, human-readable string for the
 * "Last Updated" column, e.g. "Jul 16, 2026, 3:45 PM".
 */
export function formatDateTime(isoString) {
  if (!isoString) return '—';

  return new Date(isoString).toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  });
}

/**
 * Computes what percentage of rooms are currently occupied, rounded to
 * the nearest whole number. Returns 0 when there are no rooms yet.
 */
export function calculateOccupancyPercentage(totalRooms, occupiedRooms) {
  if (!totalRooms) return 0;
  return Math.round((occupiedRooms / totalRooms) * 100);
}
