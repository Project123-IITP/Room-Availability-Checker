# 🏨 Hotel Room Availability Checker

A production-quality staff dashboard for tracking room availability, built
with **React + Vite** using only `useState`, `useEffect`, and prop drilling
— no Redux, no Router, no Context API, no UI library.

Preloaded with **1,000 realistic room records** (numbers 101–1100) and
built to stay fast at that scale via `useMemo`-memoized filtering/sorting
and pagination (20 rooms per page).

## Features

- **Dashboard** — 5 stat cards: Total, Available, Occupied, Maintenance, Occupancy %
- **Search** — by room number, type, or status (debounced, 250ms)
- **Filters** — All / Available / Occupied / Maintenance
- **Sorting** — by Room Number or Status, with a sticky table header
- **Pagination** — 20 rooms/page, windowed page controls
- **Add Room** — validated form (required fields, duplicate-number check, input sanitization)
- **Update Status** — inline dropdown per room, timestamps the change
- **Persistence** — all 1,000+ records live in `localStorage`; survives reloads
- **Loading state** — simulated network delay with skeleton + spinner
- **Error state** — corrupted localStorage data surfaces a retry-able error screen
- **Offline banner** — shown automatically via the browser's online/offline events; app keeps working from localStorage
- **Empty states** — "No rooms found." vs "No matching rooms found."
- **Responsive** — sidebar becomes a slide-in drawer, table becomes stacked cards, on mobile
- **Accessibility** — semantic HTML, labels, `aria-*` attributes, visible focus rings, `prefers-reduced-motion` support
- **Telemetry** — logs `[Analytics] User interacted with React Room Availability Checker` on Add Room, Update Status, Search, and Filter

## Tech Stack

- React 18 + Vite
- Plain CSS (design tokens via CSS custom properties)
- No external UI libraries, no state-management libraries

## Getting Started

```bash
npm install
npm run dev
```

Visit `http://localhost:5173`.

## Project Structure

```
src/
 ├── components/
 │    ├── Sidebar.jsx        # nav (Dashboard / Rooms / Availability / Settings)
 │    ├── Navbar.jsx         # hotel name, search, profile avatar
 │    ├── DashboardCards.jsx # 5 stat widgets
 │    ├── RoomTable.jsx      # sortable, paginated, sticky-header table
 │    ├── RoomCard.jsx       # mobile card view of a single room
 │    ├── AddRoomModal.jsx   # add-room form with validation
 │    ├── SearchBar.jsx      # shared search input
 │    ├── Loader.jsx         # spinner + skeleton
 │    ├── EmptyState.jsx     # "no rooms" panel
 │    └── OfflineBanner.jsx  # offline notice
 │
 ├── data/
 │    └── rooms.js           # 1000-room generator + constants
 │
 ├── utils/
 │    ├── sanitize.js        # strips script/HTML tags from input (XSS defense)
 │    └── format.js          # date formatting + occupancy % helper
 │
 ├── App.jsx                 # all state, effects, derived data, layout
 ├── App.css                 # every component's styling in one file
 └── main.jsx
```

## Performance Notes

- All filtering/sorting/stat calculations are wrapped in `useMemo`, keyed
  to their actual dependencies, so typing in search or clicking a filter
  on a 1,000-row dataset doesn't re-filter/re-sort more than necessary.
- Search input is debounced (250ms) before it touches the memoized filter,
  so filtering isn't recomputed on every keystroke.
- Only 20 rows are ever mounted in the DOM at once (pagination), which
  keeps the table itself cheap regardless of total dataset size.

## Security Notes

- `sanitizeInput()` strips `<script>` blocks and any other HTML tags from
  the Add Room form's text field before it's ever stored in React state
  or localStorage.
- React itself escapes all rendered text by default, so this is
  defense-in-depth rather than the only protection.

## Data Persistence Notes

- On first load (or if `localStorage` is empty), 1,000 rooms are generated
  automatically and saved.
- If the stored value is present but corrupted (invalid JSON or wrong
  shape), the app shows the error state with a **Try Again** button rather
  than crashing.
- The **Settings** view includes a **Reset Data** action (with a
  confirmation prompt) that regenerates a fresh set of 1,000 rooms —
  useful for demoing the loading/empty states again.
