

const DeliveryMap = ({ coordinates, address }) => {
  let lat = null;
  let lng = null;

  if (coordinates) {
    if (typeof coordinates.lat === "number" && typeof coordinates.lng === "number") {
      lat = coordinates.lat;
      lng = coordinates.lng;
    } else if (Array.isArray(coordinates) && coordinates.length >= 2) {
      // Si es un arreglo GeoJSON, el orden común es [lng, lat]
      if (Math.abs(coordinates[0]) > 90) {
        lng = Number(coordinates[0]);
        lat = Number(coordinates[1]);
      } else {
        lat = Number(coordinates[0]);
        lng = Number(coordinates[1]);
      }
    } else if (Array.isArray(coordinates.coordinates) && coordinates.coordinates.length >= 2) {
      lng = Number(coordinates.coordinates[0]);
      lat = Number(coordinates.coordinates[1]);
    }
  }

  const hasCoords = lat !== null && lng !== null && !isNaN(lat) && !isNaN(lng);

  return (
    <div className="delivery-map-container" style={{ marginTop: "1rem", padding: "1rem", background: "#f8f9fa", borderRadius: "8px" }}>
      <div className="map-header">
        <h4 style={{ margin: "0 0 4px 0" }}>📍 Coordenadas de la Ruta</h4>
        <p style={{ margin: 0, color: "#666", fontSize: "0.9rem" }}>{address || "Ubicación cargada..."}</p>
      </div>

      <div className="map-placeholder" style={{ marginTop: "0.5rem" }}>
        {hasCoords ? (
          <div className="map-info" style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <p style={{ margin: 0, fontWeight: "bold" }}>Lat: {lat.toFixed(5)}, Lng: {lng.toFixed(5)}</p>
            <span className="map-mock-badge" style={{ background: "#4caf50", color: "#fff", padding: "2px 8px", borderRadius: "12px", fontSize: "0.75rem" }}>
              GPS Activo
            </span>
          </div>
        ) : (
          <p className="no-coords" style={{ color: "#d32f2f", margin: 0 }}>⚠️ Ubicación GPS no disponible (usando texto de dirección).</p>
        )}
      </div>
    </div>
  );
};

export default DeliveryMap;