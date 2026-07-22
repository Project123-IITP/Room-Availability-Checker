/**
 * OfflineBanner - persistent banner shown at the top of the app whenever
 * the browser reports it has lost network connectivity. The app keeps
 * working against localStorage regardless, so this is purely informative.
 */
function OfflineBanner() {
  return (
    <div className="offline-banner" role="status" aria-live="assertive">
      <span className="offline-banner__dot" aria-hidden="true" />
      You are currently offline. Changes are still saved on this device.
    </div>
  );
}

export default OfflineBanner;
