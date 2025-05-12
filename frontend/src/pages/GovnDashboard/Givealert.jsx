import React, { useState } from 'react';
import axios from 'axios';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
  iconUrl: require('leaflet/dist/images/marker-icon.png'),
  shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
});

const LocationPicker = ({ setUserLocation }) => {
  useMapEvents({
    click(e) {
      setUserLocation({ lat: e.latlng.lat, lng: e.latlng.lng });
    },
  });
  return null;
};

const GiveAlert = () => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    mediaUrl: '',
    reportType: '',
  });
  const [userLocation, setUserLocation] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResult, setSearchResult] = useState(null);

  const handleSearchLocation = async () => {
    if (!searchQuery) return;
    try {
      const response = await axios.get('https://nominatim.openstreetmap.org/search', {
        params: { q: searchQuery, format: 'json', limit: 1 },
      });

      if (response.data.length > 0) {
        const location = response.data[0];
        setUserLocation({ lat: parseFloat(location.lat), lng: parseFloat(location.lon) });
        setSearchResult(location.display_name);
      } else {
        alert('Location not found.');
      }
    } catch (err) {
      console.error('Search error:', err);
      alert('Failed to search location.');
    }
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title || !formData.description || !formData.reportType) {
      alert('Please fill all required fields.');
      return;
    }

    const payload = {
      ...formData,
      timestamp: new Date().toISOString(),
      location: userLocation
        ? { lat: userLocation.lat, lng: userLocation.lng, address: searchResult || 'Manual location' }
        : null,
    };

    try {
      const response = await axios.post('http://localhost:3001/api/alerts', payload);
      alert('Alert submitted successfully!');
      setFormData({ title: '', description: '', mediaUrl: '', reportType: '' });
      setUserLocation(null);
      setSearchQuery('');
      setSearchResult(null);
    } catch (err) {
      console.error('Submit Error:', err.response || err);
      alert('Failed to submit alert.');
    }
  };

  return (
    <div className="p-6 min-h-screen bg-white text-black font-bold text-lg">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-4xl font-extrabold text-black mb-6 text-center">🚨 Submit an Alert</h1>
        <form onSubmit={handleFormSubmit} className="bg-white p-6 rounded-lg border border-black shadow-lg">
          <input type="text" placeholder="Title" className="w-full mb-4 p-3 rounded border border-black"
            value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} />
          <textarea placeholder="Description" rows="4" className="w-full mb-4 p-3 rounded border border-black"
            value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} />
          <input type="text" placeholder="Image URL (optional)" className="w-full mb-4 p-3 rounded border border-black"
            value={formData.mediaUrl} onChange={(e) => setFormData({ ...formData, mediaUrl: e.target.value })} />
          <select value={formData.reportType} onChange={(e) => setFormData({ ...formData, reportType: e.target.value })}
            className="w-full mb-4 p-3 rounded border border-black">
            <option value="">Select Report Type</option>
            <option value="Earthquake">Earthquake</option>
            <option value="Landslide">Landslide</option>
            <option value="Heavy Rain">Heavy Rain</option>
            <option value="Attacks">Attacks</option>
            <option value="Others">Others</option>
          </select>
          <div className="mb-4">
            <p className="mb-2">📍 Search for a location:</p>
            <input type="text" placeholder="Enter a location" className="w-full p-3 rounded border border-black"
              value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
            <button type="button" onClick={handleSearchLocation} className="bg-black text-white px-6 py-3 rounded mt-2">
              🔍 Search Location
            </button>
          </div>
          {userLocation && (
            <p className="text-green-600 mb-4">
              📌 Location found: {searchResult || 'Manually selected'}
            </p>
          )}
          <div className="mb-4">
            <p className="mb-2">📍 Click on the map to select a location:</p>
            <MapContainer center={[20.5937, 78.9629]} zoom={5} scrollWheelZoom={true}
              style={{ height: '300px', borderRadius: '10px' }}>
              <TileLayer
                attribution='&copy; OpenStreetMap contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              <LocationPicker setUserLocation={setUserLocation} />
              {userLocation && <Marker position={[userLocation.lat, userLocation.lng]} />}
            </MapContainer>
          </div>
          <button type="submit" className="bg-black hover:bg-gray-800 text-white px-6 py-3 rounded w-full">
            🚨 Submit Report
          </button>
        </form>
      </div>
    </div>
  );
};

export default GiveAlert;
