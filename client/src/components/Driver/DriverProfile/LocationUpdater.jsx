const LocationUpdater = ({ currentLocation, isTracking }) => {
  const hasCoords = currentLocation && typeof currentLocation.lat === "number" && typeof currentLocation.lng === "number";

  return (
    <div className="location-updater-box">
      <div className="tracking-header">
        <span className={`pulse-dot ${isTracking ? "active" : ""}`} />
        <h4>Rastreo GPS en Tiempo Real</h4>
      </div>

      <p className="coords-text">
        {hasCoords
          ? `Lat: ${currentLocation.lat.toFixed(4)}, Lng: ${currentLocation.lng.toFixed(4)}`
          : "Transmitiendo posición al servidor..."}
      </p>
    </div>
  );
};

export default LocationUpdater;