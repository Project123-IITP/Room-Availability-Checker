// Central place for room data shape, constants, and the generator
// used to seed localStorage the very first time the app runs.

export const ROOM_TYPES = ['Standard', 'Deluxe', 'Suite', 'Executive'];

export const ROOM_STATUSES = ['Available', 'Occupied', 'Maintenance'];

// localStorage key used to persist the room list across reloads
export const STORAGE_KEY = 'hotel-room-availability-v1';

// How many rooms are shown per page in the table
export const PAGE_SIZE = 20;

const randomFrom = (list) => list[Math.floor(Math.random() * list.length)];

/**
 * Generates `count` room records with sequential room numbers starting
 * at `startNumber` (e.g. 101 → 1100 for count = 1000), random type,
 * random status, and a randomized "last updated" timestamp within the
 * past 30 days so the dashboard feels like real historical data.
 */
export function generateRooms(count = 1000, startNumber = 101) {
  const rooms = [];

  for (let i = 0; i < count; i++) {
    const roomNumber = startNumber + i;

    // Spread "last updated" timestamps across the past 30 days so
    // sorting/filtering on real data looks realistic, not identical.
    const daysAgo = Math.floor(Math.random() * 30);
    const minutesAgo = Math.floor(Math.random() * 24 * 60);
    const lastUpdated = new Date(
      Date.now() - daysAgo * 24 * 60 * 60 * 1000 - minutesAgo * 60 * 1000
    ).toISOString();

    rooms.push({
      id: i + 1,
      number: String(roomNumber),
      type: randomFrom(ROOM_TYPES),
      status: randomFrom(ROOM_STATUSES),
      lastUpdated,
    });
  }

  return rooms;
}
