const CARD_CONFIG = [
  { key: 'total', label: 'Total Rooms', subtitle: 'All registered rooms', icon: '🏨', accent: 'neutral' },
  { key: 'available', label: 'Available Rooms', subtitle: 'Ready for check-in', icon: '✓', accent: 'available' },
  { key: 'occupied', label: 'Occupied Rooms', subtitle: 'Currently in use', icon: '●', accent: 'occupied' },
  { key: 'maintenance', label: 'Maintenance Rooms', subtitle: 'Out of service', icon: '⚠', accent: 'maintenance' },
  { key: 'occupancyPercentage', label: 'Occupancy Rate', subtitle: 'Of total inventory', icon: '%', accent: 'occupancy', suffix: '%' },
];

/**
 * DashboardCards - top-of-page statistics. `stats` is a plain object
 * computed once via useMemo in App.jsx from the full (unfiltered)
 * room list, so these numbers always reflect the entire dataset.
 */
function DashboardCards({ stats }) {
  return (
    <section className="dashboard-cards" aria-label="Room statistics">
      {CARD_CONFIG.map((card) => (
        <div key={card.key} className={`stat-card stat-card--${card.accent}`}>
          <div className="stat-card__icon" aria-hidden="true">{card.icon}</div>
          <div className="stat-card__body">
            <span className="stat-card__number">
              {stats[card.key]}
              {card.suffix || ''}
            </span>
            <span className="stat-card__label">{card.label}</span>
            <span className="stat-card__subtitle">{card.subtitle}</span>
          </div>
        </div>
      ))}
    </section>
  );
}

export default DashboardCards;
