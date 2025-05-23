import React, { useState } from 'react';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { useWeb3 } from '../../context/Web3Context';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

// Fixing Leaflet icon issue
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
  const navigate = useNavigate();
  const { createAlert, isGovernmentAuthority } = useWeb3();
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    mediaUrl: '',
    reportType: '0', // Default to Emergency (0)
    instructions: '',
    additionalInfo: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [userLocation, setUserLocation] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResult, setSearchResult] = useState(null);
  const [mediaFiles, setMediaFiles] = useState([]);

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Handle media file uploads
  const handleFileChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      // Convert FileList to array and add to mediaFiles
      const newFiles = Array.from(e.target.files);
      setMediaFiles(prev => [...prev, ...newFiles]);
    }
  };

  // Remove a file from the list
  const removeFile = (index) => {
    setMediaFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleSearchLocation = async () => {
    if (!searchQuery) return;
    try {
      const response = await fetch(`https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(searchQuery)}&format=json&limit=1`);
      const data = await response.json();

      if (data && data.length > 0) {
        const location = data[0];
        setUserLocation({ lat: parseFloat(location.lat), lng: parseFloat(location.lon) });
        setSearchResult(location.display_name);
      } else {
        toast.error('Location not found.');
      }
    } catch (err) {
      console.error('Search error:', err);
      toast.error('Failed to search location.');
    }
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    
    // Form validation
    if (!formData.title || !formData.description || !formData.reportType) {
      toast.error('Please fill all required fields.');
      return;
    }

    if (!userLocation) {
      toast.error('Please select a location on the map.');
      return;
    }

    if (!isGovernmentAuthority) {
      toast.error('Only government authorities can create alerts.');
      return;
    }

    setIsSubmitting(true);

    try {
      // Prepare data for blockchain
      const alertData = {
        title: formData.title,
        description: formData.description,
        location: searchResult || `${userLocation.lat.toFixed(6)}, ${userLocation.lng.toFixed(6)}`,
        alertType: parseInt(formData.reportType), // Convert to integer for enum
        latitude: userLocation.lat,
        longitude: userLocation.lng,
        instructions: formData.instructions ? formData.instructions.split('\n') : [],
        additionalInfo: formData.additionalInfo,
        images: mediaFiles,
        timestamp: new Date().toISOString()
      };

      // Call createAlert from Web3Context
      const result = await createAlert(alertData);
      
      if (result) {
        toast.success('Alert created successfully!');
        
        // Navigate to alert details page or dashboard
        navigate(`/alerts/${result.alertId}`);
      }
    } catch (error) {
      console.error('Error creating alert:', error);
      toast.error(`Failed to create alert: ${error.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="p-6 min-h-screen bg-white text-black font-bold text-lg">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-4xl font-extrabold text-black mb-6 text-center">🚨 Submit an Alert</h1>
        <form onSubmit={handleFormSubmit} className="bg-white p-6 rounded-lg border border-black shadow-lg">
          <div className="mb-4">
            <label className="block mb-2">Alert Title*</label>
            <input 
              type="text" 
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-black"
              placeholder="E.g. Flood Warning"
            />
          </div>
          
          <div className="mb-4">
            <label className="block mb-2">Alert Type*</label>
            <select 
              name="reportType" 
              value={formData.reportType}
              onChange={handleInputChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-black"
            >
              <option value="0">Emergency</option>
              <option value="1">Warning</option>
              <option value="2">Information</option>
              <option value="3">Safe</option>
            </select>
          </div>
          
          <div className="mb-4">
            <label className="block mb-2">Description*</label>
            <textarea 
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              required
              rows={4}
              className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-black"
              placeholder="Provide detailed information about the alert..."
            ></textarea>
          </div>
          
          <div className="mb-4">
            <label className="block mb-2">Instructions (each line will be a separate instruction)</label>
            <textarea 
              name="instructions"
              value={formData.instructions}
              onChange={handleInputChange}
              rows={4}
              className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-black"
              placeholder="Enter instructions, one per line..."
            ></textarea>
          </div>
          
          <div className="mb-4">
            <label className="block mb-2">Additional Information</label>
            <textarea 
              name="additionalInfo"
              value={formData.additionalInfo}
              onChange={handleInputChange}
              rows={3}
              className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-black"
              placeholder="Any additional information..."
            ></textarea>
          </div>
          
          <div className="mb-6">
            <label className="block mb-2">Upload Media</label>
            <input 
              type="file" 
              onChange={handleFileChange} 
              multiple
              accept="image/*,video/*,application/pdf"
              className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-black"
            />
            
            {mediaFiles.length > 0 && (
              <div className="mt-2 space-y-2">
                <p className="font-semibold">Selected files:</p>
                {mediaFiles.map((file, index) => (
                  <div key={index} className="flex justify-between items-center bg-gray-100 p-2 rounded">
                    <span>{file.name} ({Math.round(file.size / 1024)} KB)</span>
                    <button 
                      type="button" 
                      onClick={() => removeFile(index)}
                      className="text-red-500"
                    >
                      Remove
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
          
          <div className="mb-6">
            <label className="block mb-2">Location Search</label>
            <div className="flex space-x-2 mb-2">
              <input 
                type="text" 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="flex-grow px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-black"
                placeholder="Enter a location to search..."
                onKeyPress={(e) => e.key === 'Enter' && handleSearchLocation()}
              />
              <button 
                type="button" 
                onClick={handleSearchLocation}
                className="bg-gray-200 px-4 py-2 rounded"
              >
                Search
              </button>
            </div>
            
            {searchResult && (
              <div className="mb-2 text-sm text-blue-600">
                Found: {searchResult}
              </div>
            )}
            
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
          
          <button 
            type="submit" 
            disabled={isSubmitting}
            className={`bg-black hover:bg-gray-800 text-white px-6 py-3 rounded w-full flex justify-center items-center ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            {isSubmitting ? (
              <>
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Processing...
              </>
            ) : (
              '🚨 Submit Alert'
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default GiveAlert;
