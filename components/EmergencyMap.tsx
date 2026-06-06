"use client";

import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

export default function EmergencyMap({ requests }: any) {

  const redIcon = new L.Icon({
    iconUrl: "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-red.png",
    shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
    iconSize: [25, 41],
    iconAnchor: [12, 41],
  });

  const greenIcon = new L.Icon({
    iconUrl: "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-green.png",
    shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
    iconSize: [25, 41],
    iconAnchor: [12, 41],
  });

  const orangeIcon = new L.Icon({
    iconUrl: "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-orange.png",
    shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
    iconSize: [25, 41],
    iconAnchor: [12, 41],
  });

  return (
    <MapContainer
      center={[23.2599, 77.4126]}
      zoom={11}
      style={{
        height: "600px",
        width: "100%",
      }}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      {requests
  .filter(
  (req: any) =>
    req.latitude !== null &&
    req.longitude !== null &&
    !isNaN(Number(req.latitude)) &&
    !isNaN(Number(req.longitude))
)
  .map((req: any) => (
    <Marker
      key={req.id}
      position={[
        Number(req.latitude),
        Number(req.longitude),
      ]}
            icon={
              req.is_sos
                ? redIcon
                : req.status === "open"
                ? orangeIcon
                : greenIcon
            }
          >
            <Popup>
              <div className="space-y-2">
                <h3 className="font-bold">{req.category}</h3>
                <p> {req.city}, {req.state}</p>
                <p>{req.description}</p>
                <p>Status: {req.status}</p>
                {req.is_sos && (
                  <p className="text-red-600 font-bold">
                     SOS Priority
                  </p>
                )}
              </div>
            </Popup>
          </Marker>
        ))}
    </MapContainer>
  );
}