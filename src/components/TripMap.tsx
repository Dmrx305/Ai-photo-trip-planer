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
        <h2>Die Route wird hier visualisiert</h2>
        <p className="muted">
          Nach der Generierung siehst du Marker, Reihenfolge und die einfache Linie
          zwischen den Spots.
        </p>
      </section>
    );
  }

  const center = [plan.spots[0].lat, plan.spots[0].lon] as [number, number];
  const polyline = plan.routePolyline.map((point) => [point.lat, point.lon] as [number, number]);

  return (
    <section className="panel map-panel">
      <div className="panel-header">
        <p className="eyebrow">Map</p>
        <h2>Route und Spots</h2>
      </div>
      <div className="map-frame">
        <MapContainer center={center} zoom={13} scrollWheelZoom className="leaflet-map">
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <Polyline positions={polyline} pathOptions={{ color: "#c55d2d", weight: 4 }} />
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
