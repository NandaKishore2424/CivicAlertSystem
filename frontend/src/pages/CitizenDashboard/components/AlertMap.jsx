import React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';

const createCustomIcon = (alertType) => {
  const colors = {
    0: 'red', // Emergency
    1: 'orange', // Warning
    2: 'blue', // Info
    3: 'green', // Safe
  };
  
  const color = colors[alertType] || 'gray';
  
  return new L.Icon({
    iconUrl: `https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-${color}.png`,
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
  });
};

const AlertMap = ({ position, alertType, title, location, userLocation }) => {
  return (
    <div className="h-96">
      <MapContainer center={position} zoom={13} style={{ height: "100%", width: "100%" }}>
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        <Marker position={position} icon={createCustomIcon(alertType)}>
          <Popup>
            <strong>{title}</strong><br />{location}
          </Popup>
        </Marker>
        {userLocation && (
          <Marker position={[userLocation.lat, userLocation.lng]} icon={createCustomIcon(3)}>
            <Popup>
              <strong>Your Location</strong>
            </Popup>
          </Marker>
        )}
      </MapContainer>
    </div>
  );
};

export default AlertMap;