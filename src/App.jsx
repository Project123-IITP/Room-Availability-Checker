import { useState, useEffect, useMemo } from 'react';

import Sidebar from './components/Sidebar';
import Navbar from './components/Navbar';
import DashboardCards from './components/DashboardCards';
import RoomTable from './components/RoomTable';
import AddRoomModal from './components/AddRoomModal';
import SearchBar from './components/SearchBar';
import Loader from './components/Loader';
import OfflineBanner from './components/OfflineBanner';

import { generateRooms, STORAGE_KEY, PAGE_SIZE } from './data/rooms';
import { calculateOccupancyPercentage } from './utils/format';

const STATUS_FILTERS = ['All', 'Available', 'Occupied', 'Maintenance'];

const logTelemetry = () => {
  // eslint-disable-next-line no-console
  console.log('[Analytics] User interacted with React Room Availability Checker');
};

/**
 * SettingsPanel - small inline panel for the "Settings" nav item.
 * Kept local to App.jsx (not its own file) since it's a thin wrapper
 * around a single reset action; it doesn't warrant its own module.
 */
function SettingsPanel({ roomCount, onReset }) {
  return (
    <section className="settings-panel">
      <h2 className="settings-panel__title">Settings</h2>
      <p className="settings-panel__description">
        This dashboard currently tracks <strong>{roomCount}</strong> rooms,
        persisted locally on this device.
      </p>

      <div className="settings-panel__danger-zone">
        <div>
          <h3>Reset room data</h3>
          <p>
            Replace all rooms with a freshly generated set of 1,000 sample
            rooms. This cannot be undone.
          </p>
        </div>
        <button type="button" className="btn btn--danger" onClick={onReset}>
          Reset Data
        </button>
      </div>
    </section>
  );
}

function App() {
  // ---- Core data state ----
  const [rooms, setRooms] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);

  // ---- Navigation (no router — just a prop-drilled view key) ----
  const [activeView, setActiveView] = useState('dashboard');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // ---- Search / filter / sort / pagination ----
  const [searchInput, setSearchInput] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [sortConfig, setSortConfig] = useState({ key: 'number', direction: 'asc' });
  const [currentPage, setCurrentPage] = useState(1);

  // ---- Modal ----
  const [showAddModal, setShowAddModal] = useState(false);

  // ---- Connectivity ----
  const [isOffline, setIsOffline] = useState(() =>
    typeof navigator !== 'undefined' ? !navigator.onLine : false
  );

  // ---------------------------------------------------------------------
  // Data loading: simulates a network fetch with setTimeout. Reads from
  // localStorage if data already exists; otherwise generates 1000 fresh
  // rooms and persists them. A corrupted localStorage value (invalid
  // JSON / wrong shape) surfaces the error state with a Retry action.
  // ---------------------------------------------------------------------
  const loadRooms = (forceRegenerate = false) => {
    setIsLoading(true);
    setIsError(false);

    setTimeout(() => {
      try {
        let data = null;

        if (!forceRegenerate) {
          const stored = localStorage.getItem(STORAGE_KEY);
          if (stored) {
            const parsed = JSON.parse(stored);
            if (!Array.isArray(parsed)) {
              throw new Error('Stored room data is corrupted.');
            }
            data = parsed;
          }
        }

        if (!data) {
          data = generateRooms(1000);
        }

        localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
        setRooms(data);
        setIsLoading(false);
      } catch (err) {
        setIsError(true);
        setIsLoading(false);
      }
    }, 900);
  };

  // Load once on mount
  useEffect(() => {
    loadRooms();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Persist any change to `rooms` back to localStorage (skipped while
  // still loading/erroring so we never overwrite good data with []).
  useEffect(() => {
    if (isLoading || isError) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(rooms));
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error('Failed to persist room data to localStorage:', err);
    }
  }, [rooms, isLoading, isError]);

  // Track browser connectivity
  useEffect(() => {
    const handleOnline = () => setIsOffline(false);
    const handleOffline = () => setIsOffline(true);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Debounce the search input so filtering 1000+ rooms doesn't run on
  // every keystroke — both a performance win and a cleaner telemetry
  // signal (we log once the user pauses, not per character).
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setDebouncedSearch(searchInput.trim().toLowerCase());
    }, 250);
    return () => clearTimeout(timeoutId);
  }, [searchInput]);

  useEffect(() => {
    if (debouncedSearch) {
      logTelemetry();
    }
  }, [debouncedSearch]);

  // Any time the visible result set could change shape, snap back to
  // page 1 so the user never lands on a now-empty page.
  useEffect(() => {
    setCurrentPage(1);
  }, [debouncedSearch, statusFilter, sortConfig, activeView]);

  // ---------------------------------------------------------------------
  // Derived data — all memoized so 1000+ rooms stay fast and re-renders
  // don't recompute filtering/sorting/stats unless their inputs changed.
  // ---------------------------------------------------------------------

  const stats = useMemo(() => {
    const total = rooms.length;
    const available = rooms.filter((r) => r.status === 'Available').length;
    const occupied = rooms.filter((r) => r.status === 'Occupied').length;
    const maintenance = rooms.filter((r) => r.status === 'Maintenance').length;
    return {
      total,
      available,
      occupied,
      maintenance,
      occupancyPercentage: calculateOccupancyPercentage(total, occupied),
    };
  }, [rooms]);

  // Room numbers as a plain array for O(n) duplicate-checking in the
  // Add Room modal (n = 1000 is trivial; memoized so it only rebuilds
  // when the room list itself changes).
  const existingNumbers = useMemo(() => rooms.map((r) => r.number), [rooms]);

  // The "Availability" nav view is a focused shortcut that always shows
  // Available rooms, regardless of the filter buttons' own state.
  const effectiveStatusFilter = activeView === 'availability' ? 'Available' : statusFilter;

  const filteredRooms = useMemo(() => {
    return rooms.filter((room) => {
      if (effectiveStatusFilter !== 'All' && room.status !== effectiveStatusFilter) {
        return false;
      }
      if (!debouncedSearch) return true;
      return (
        room.number.toLowerCase().includes(debouncedSearch) ||
        room.type.toLowerCase().includes(debouncedSearch) ||
        room.status.toLowerCase().includes(debouncedSearch)
      );
    });
  }, [rooms, effectiveStatusFilter, debouncedSearch]);

  const sortedRooms = useMemo(() => {
    const sorted = [...filteredRooms];
    sorted.sort((a, b) => {
      let comparison = 0;
      if (sortConfig.key === 'number') {
        comparison = parseInt(a.number, 10) - parseInt(b.number, 10);
      } else if (sortConfig.key === 'status') {
        comparison = a.status.localeCompare(b.status);
      }
      return sortConfig.direction === 'asc' ? comparison : -comparison;
    });
    return sorted;
  }, [filteredRooms, sortConfig]);

  const totalPages = Math.max(1, Math.ceil(sortedRooms.length / PAGE_SIZE));

  const paginatedRooms = useMemo(() => {
    const start = (currentPage - 1) * PAGE_SIZE;
    return sortedRooms.slice(start, start + PAGE_SIZE);
  }, [sortedRooms, currentPage]);

  // ---------------------------------------------------------------------
  // Handlers
  // ---------------------------------------------------------------------

  const handleSortChange = (key) => {
    setSortConfig((prev) => {
      if (prev.key === key) {
        return { key, direction: prev.direction === 'asc' ? 'desc' : 'asc' };
      }
      return { key, direction: 'asc' };
    });
  };

  const handleStatusFilterChange = (status) => {
    setStatusFilter(status);
    logTelemetry();
  };

  const handleStatusChange = (roomId, newStatus) => {
    setRooms((prev) =>
      prev.map((room) =>
        room.id === roomId
          ? { ...room, status: newStatus, lastUpdated: new Date().toISOString() }
          : room
      )
    );
    logTelemetry();
  };

  const handleAddRoom = (roomData) => {
    setRooms((prev) => {
      const nextId = prev.length > 0 ? Math.max(...prev.map((r) => r.id)) + 1 : 1;
      const newRoom = {
        id: nextId,
        ...roomData,
        lastUpdated: new Date().toISOString(),
      };
      return [...prev, newRoom];
    });
    logTelemetry();
  };

  const handlePageChange = (page) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
  };

  const handleResetData = () => {
    const confirmed = window.confirm(
      'This will replace all room data with a freshly generated set of 1,000 rooms. Continue?'
    );
    if (!confirmed) return;
    loadRooms(true);
  };

  const emptyMessage =
    debouncedSearch || effectiveStatusFilter !== 'All'
      ? 'No matching rooms found.'
      : 'No rooms found.';

  const showStatsAndTable = activeView !== 'settings';
  const showDashboardCards = activeView === 'dashboard' || activeView === 'rooms';

  return (
    <div className="app-shell">
      {isOffline && <OfflineBanner />}

      <Navbar
        searchTerm={searchInput}
        onSearchChange={setSearchInput}
        onToggleSidebar={() => setIsSidebarOpen((open) => !open)}
      />

      <div className="app-body">
        <Sidebar
          activeView={activeView}
          onNavigate={setActiveView}
          isOpen={isSidebarOpen}
          onCloseMobile={() => setIsSidebarOpen(false)}
        />

        <main className="main-content">
          {!showStatsAndTable ? (
            <SettingsPanel roomCount={rooms.length} onReset={handleResetData} />
          ) : (
            <>
              {showDashboardCards && <DashboardCards stats={stats} />}

              <div className="toolbar">
                <SearchBar
                  value={searchInput}
                  onChange={setSearchInput}
                  id="main-room-search"
                />

                <div className="filter-bar" role="group" aria-label="Filter rooms by status">
                  {STATUS_FILTERS.map((status) => (
                    <button
                      key={status}
                      type="button"
                      className={`filter-btn ${
                        statusFilter === status ? 'filter-btn--active' : ''
                      }`}
                      onClick={() => handleStatusFilterChange(status)}
                      disabled={activeView === 'availability'}
                      aria-pressed={statusFilter === status}
                    >
                      {status}
                    </button>
                  ))}
                </div>

                <button
                  type="button"
                  className="btn btn--primary"
                  onClick={() => setShowAddModal(true)}
                >
                  + Add Room
                </button>
              </div>

              {isLoading ? (
                <Loader />
              ) : isError ? (
                <div className="error-state" role="alert">
                  <p>Something went wrong. Please try again.</p>
                  <button
                    type="button"
                    className="btn btn--primary"
                    onClick={() => loadRooms()}
                  >
                    Try Again
                  </button>
                </div>
              ) : (
                <RoomTable
                  rooms={paginatedRooms}
                  sortConfig={sortConfig}
                  onSortChange={handleSortChange}
                  onStatusChange={handleStatusChange}
                  currentPage={currentPage}
                  totalPages={totalPages}
                  totalCount={sortedRooms.length}
                  pageSize={PAGE_SIZE}
                  onPageChange={handlePageChange}
                  emptyMessage={emptyMessage}
                />
              )}
            </>
          )}
        </main>
      </div>

      <AddRoomModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        onAddRoom={handleAddRoom}
        existingNumbers={existingNumbers}
      />
    </div>
  );
}

export default App;
