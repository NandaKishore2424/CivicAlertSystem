// src/pages/LiveEmergencyMap.jsx
import React, { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import { useLocation, useNavigate } from "react-router-dom";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import axios from 'axios'; // Add axios import
import { ChevronLeft } from "lucide-react"; // Add ChevronLeft import

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
    "0": "red", // Emergency
    "1": "orange", // Warning
    "2": "blue", // Information
    "3": "green", // Safe
    "fire": "red",
    "accident": "orange",
    "medical": "blue",
    "police": "purple",
    "other": "gray",
  };
  
  const color = colorMap[type] || "gray";
  
  return new L.Icon({
    iconUrl: `https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-${color}.png`,
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
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
  const location = useLocation();
  const navigate = useNavigate();
  const [emergencies, setEmergencies] = useState([]);
  const [filter, setFilter] = useState("all");
  const [userLocation, setUserLocation] = useState({ lat: 20.5937, lng: 78.9629 });
  
  // Parse URL parameters if coming from alert details
  const queryParams = new URLSearchParams(location.search);
  const alertFromUrl = queryParams.get('alert');
  const alertLat = parseFloat(queryParams.get('lat'));
  const alertLng = parseFloat(queryParams.get('lng')); 
  const alertType = queryParams.get('type');
  const alertTitle = queryParams.get('title');

  // Initialize map center from URL parameters or default to user location
  const [mapCenter, setMapCenter] = useState(
    !isNaN(alertLat) && !isNaN(alertLng) 
      ? [alertLat, alertLng] 
      : [userLocation.lat, userLocation.lng]
  );
  
  // Option 1: Keep it but add a comment to silence the warning
  // eslint-disable-next-line no-unused-vars
  const [mapZoom, setMapZoom] = useState(!isNaN(alertLat) ? 15 : 14);

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
          const userPos = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };
          setUserLocation(userPos);
          
          // Only update map center if we don't have an alert from URL
          if (isNaN(alertLat) || isNaN(alertLng)) {
            setMapCenter([userPos.lat, userPos.lng]);
          }
        },
        (error) => {
          console.error("Geolocation error:", error);
        }
      );
    }
  }, [alertLat, alertLng]);

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

  // Update the return section with improved header
  return (
    <div className="min-h-screen bg-white px-4 py-8">
      <div className="max-w-6xl mx-auto">
        {/* Enhanced header with navigation */}
        <div className="flex flex-wrap items-center justify-between mb-6 gap-4">
          <div className="flex items-center">
            {/* Back button - always visible */}
            <button
              onClick={() => navigate(-1)}
              className="flex items-center justify-center h-10 w-10 rounded-full bg-slate-100 hover:bg-slate-200 mr-3 transition-colors"
            >
              <ChevronLeft className="h-5 w-5 text-slate-700" />
            </button>
            
            <h2 className="text-2xl md:text-3xl font-bold text-slate-900 flex items-center">
              <span className="bg-red-100 text-red-700 p-1.5 rounded-lg mr-2">🔥</span>
              Live Emergency Map
            </h2>
          </div>
          
          {/* Alert-specific back button with more context */}
          {alertFromUrl && (
            <div className="flex-shrink-0">
              <button 
                onClick={() => navigate(`/alerts/${alertFromUrl}`)}
                className="bg-slate-800 hover:bg-slate-900 text-white px-4 py-2 rounded-md text-sm font-medium flex items-center transition-colors"
              >
                <ChevronLeft className="h-4 w-4 mr-1.5" /> Back to Alert Details
              </button>
            </div>
          )}
        </div>

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
        <div className="rounded-xl overflow-hidden border border-gray-200 shadow-lg">
          <MapContainer
            center={mapCenter}
            zoom={mapZoom}
            style={{ height: "600px", width: "100%" }}
          >
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution="© OpenStreetMap contributors"
            />

            {/* Show user's location */}
            {userLocation && (
              <Marker position={[userLocation.lat, userLocation.lng]} icon={userIcon}>
                <Popup>
                  <strong>Your Location</strong>
                </Popup>
              </Marker>
            )}

            {/* Show specific alert from URL if available */}
            {!isNaN(alertLat) && !isNaN(alertLng) && (
              <Marker 
                position={[alertLat, alertLng]} 
                icon={getIcon(alertType || "0")}
              >
                <Popup>
                  <strong>{alertTitle || "Alert"}</strong>
                  <p>Location: {alertLat.toFixed(6)}, {alertLng.toFixed(6)}</p>
                  <button
                    onClick={() => navigate(`/alerts/${alertFromUrl}`)}
                    className="text-sm text-blue-600 underline"
                  >
                    View Details
                  </button>
                </Popup>
              </Marker>
            )}

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
        </div>

        <div className="mt-4 text-sm text-slate-600">
          <p className="mb-2">Note: The map displays emergencies reported by officials and citizens.</p>
          <p>Click on a marker for more details about the incident.</p>
        </div>
      </div>
    </div>
  );
};

export default AlertMapPage;
