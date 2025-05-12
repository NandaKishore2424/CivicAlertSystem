// src/pages/LiveEmergencyMap.jsx
import React, { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import axios from "axios";
import L from "leaflet";

// Fix Leaflet default marker icon URLs
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.3/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.3/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.3/dist/images/marker-shadow.png",
});

// Emergency icon based on type
const getIcon = (type) => {
  const colorMap = {
    fire: "red",
    accident: "orange",
    medical: "blue",
    police: "purple",
    other: "gray",
  };
  const color = colorMap[type] || "black";

  return new L.Icon({
    iconUrl: `https://chart.googleapis.com/chart?chst=d_map_pin_letter&chld=%E2%80%A2|${color}`,
    iconSize: [21, 34],
    iconAnchor: [10, 34],
    popupAnchor: [0, -30],
  });
};

// User's own location marker
const userIcon = new L.Icon({
  iconUrl: "https://chart.googleapis.com/chart?chst=d_map_pin_letter&chld=U|00BFFF|000000",
  iconSize: [24, 38],
  iconAnchor: [12, 38],
  popupAnchor: [0, -30],
});

const AlertMapPage = () => {
  const [emergencies, setEmergencies] = useState([]);
  const [filter, setFilter] = useState("all");
  const [userLocation, setUserLocation] = useState(null);

  useEffect(() => {
    // Fetch emergency data
    axios
      .get("http://localhost:3001/api/reports")
      .then((res) => setEmergencies(res.data))
      .catch((err) => console.error("Error fetching emergency reports:", err));

    // Get user's current location
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
        },
        (error) => {
          console.error("Geolocation error:", error);
          setUserLocation({ lat: 20.5937, lng: 78.9629 });
        }
      );
    } else {
      console.error("Geolocation not supported.");
      setUserLocation({ lat: 20.5937, lng: 78.9629 });
    }
  }, []);

  const filteredEmergencies =
    filter === "all" ? emergencies : emergencies.filter((e) => e.type === filter);

  const getCategoryDescription = (type) => {
    switch (type) {
      case "fire":
        return "Fire Accident";
      case "accident":
        return "Road Accident";
      case "medical":
        return "Medical Emergency";
      case "police":
        return "Police Report";
      default:
        return "Other Emergency";
    }
  };

  return (
    <div className="min-h-screen bg-white px-4 py-8">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-3xl font-bold text-left mb-6 text-black-500">
          🔥 Live Emergency Map
        </h2>

        {/* Filter Buttons */}
        <div className="flex flex-wrap justify-center gap-3 mb-6">
          {["all", "fire", "accident", "medical", "police", "other"].map((type) => (
            <button
              key={type}
              className={`px-4 py-2 rounded-full font-semibold transition duration-200 border ${
                filter === type
                  ? "bg-black-600 text-black border-black-500 shadow-lg"
                  : "bg-white-900 text-black-300 border-black-700 hover:bg-red-700 hover:text-white"
              }`}
              onClick={() => setFilter(type)}
            >
              {type.charAt(0).toUpperCase() + type.slice(1)}
            </button>
          ))}
        </div>

        {/* Map */}
        <div className="rounded-xl overflow-hidden border border-gray-800 shadow-lg">
          {userLocation && (
            <MapContainer
              center={[userLocation.lat, userLocation.lng]}
              zoom={14}
              style={{ height: "600px", width: "100%" }}
            >
              <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution="© OpenStreetMap contributors"
              />

              {/* Show user's location */}
              <Marker position={[userLocation.lat, userLocation.lng]} icon={userIcon}>
                <Popup>
                  <strong>You are here</strong>
                </Popup>
              </Marker>

              {/* Emergency markers */}
              {filteredEmergencies
                .filter(
                  (e) =>
                    e.location &&
                    typeof e.location.lat === "number" &&
                    typeof e.location.lng === "number"
                )
                .map((e, idx) => (
                  <Marker
                    key={idx}
                    position={[e.location.lat, e.location.lng]}
                    icon={getIcon(e.type)}
                  >
                    <Popup>
                      <p><strong>Type:</strong> {getCategoryDescription(e.type)}</p>
                      <p><strong>Description:</strong> {e.description || "N/A"}</p>
                      {e.mediaUrl && (
                        <a
                          href={e.mediaUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-red-600 underline"
                        >
                          View Media
                        </a>
                      )}
                    </Popup>
                  </Marker>
                ))}
            </MapContainer>
          )}
        </div>
      </div>
    </div>
  );
};

export default AlertMapPage;
