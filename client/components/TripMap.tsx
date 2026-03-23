import { MapContainer, Marker, Polyline, Popup, TileLayer } from "react-leaflet";
import L from "leaflet";
import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";
import type { TripPlan } from "../types";

L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow
});

type TripMapProps = {
  plan: TripPlan | null;
};

export function TripMap({ plan }: TripMapProps) {
  if (!plan || plan.spots.length === 0) {
    return (
      <section className="panel map-panel empty-map">
        <p className="eyebrow">Map</p>
        <h2>The route will be visualized here</h2>
        <p className="muted">
          After generation, you will see markers, route order, and a simple visual path.
        </p>
        <div className="empty-route-grid">
          <div className="empty-route-card">
            <strong>1. Start</strong>
            <span>quiet opening location</span>
          </div>
          <div className="empty-route-card">
            <strong>2. Middle</strong>
            <span>urban or architectural focus</span>
          </div>
          <div className="empty-route-card">
            <strong>3. Finish</strong>
            <span>light or sunset as the final anchor</span>
          </div>
        </div>
      </section>
    );
  }

  const center = [plan.spots[0].lat, plan.spots[0].lon] as [number, number];
  const polyline = plan.routePolyline.map((point) => [point.lat, point.lon] as [number, number]);

  return (
    <section className="panel map-panel">
      <div className="panel-header">
        <p className="eyebrow">Map</p>
        <h2>Route and spots</h2>
        <div className="map-meta-row">
          <span className="map-meta-pill">{plan.spots.length} stops</span>
          <span className="map-meta-pill">
            {plan.generatedWith === "ollama" ? "Enriched with Ollama" : "Fallback active"}
          </span>
        </div>
      </div>
      <div className="route-strip">
        {plan.spots.map((spot) => (
          <div key={spot.id} className="route-stop">
            <span className="route-stop-index">{spot.rank}</span>
            <div>
              <strong>{spot.name}</strong>
              <p>{spot.timeWindow}</p>
            </div>
          </div>
        ))}
      </div>
      <div className="map-frame">
        <MapContainer center={center} zoom={13} scrollWheelZoom className="leaflet-map">
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <Polyline positions={polyline} pathOptions={{ color: "#2c6a6d", weight: 5 }} />
          {plan.spots.map((spot) => (
            <Marker key={spot.id} position={[spot.lat, spot.lon]}>
              <Popup>
                <strong>{spot.rank}. {spot.name}</strong>
                <br />
                {spot.bestTime}
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>
    </section>
  );
}
