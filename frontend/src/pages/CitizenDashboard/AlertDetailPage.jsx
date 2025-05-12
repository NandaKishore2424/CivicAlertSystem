import React, { useState, useEffect, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { FiClock, FiMapPin, FiAlertTriangle, FiCheck, FiMap, FiUser, FiArrowLeft, FiShare2 } from 'react-icons/fi';
import { useWeb3 } from '../../context/Web3Context';
import { toast } from 'react-toastify';

// Fix Leaflet icon issues
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
  iconUrl: require('leaflet/dist/images/marker-icon.png'),
  shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
});

// Create custom icons for different alert types
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

const AlertDetailsPage = () => {
  const { alertId } = useParams();
  const { getAlertById, changeAlertStatus, isGovernmentAuthority, isAdmin, web3Service } = useWeb3();
  const [alert, setAlert] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);
  const [ipfsContent, setIpfsContent] = useState(null);
  const [userLocation, setUserLocation] = useState(null);

  const fetchAlert = useCallback(async () => {
    if (!alertId) return;
    
    try {
      setLoading(true);
      const alertData = await getAlertById(alertId);
      setAlert(alertData);
      
      // Fetch extended data from IPFS if available
      if (alertData?.ipfsHash) {
        try {
          const ipfsData = await web3Service.fetchFromIPFS(alertData.ipfsHash);
          setIpfsContent(ipfsData);
        } catch (error) {
          console.error("Failed to fetch IPFS content:", error);
        }
      }
    } catch (error) {
      console.error("Error fetching alert:", error);
      toast.error("Failed to load alert details");
    } finally {
      setLoading(false);
    }
  }, [alertId, getAlertById, web3Service]);

  useEffect(() => {
    fetchAlert();
    
    // Get user's location
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });
        },
        (error) => {
          console.error("Geolocation error:", error);
        }
      );
    }
  }, [fetchAlert]);

  const handleMarkSafe = async () => {
    if (!isGovernmentAuthority && !isAdmin) {
      toast.error("Only government authorities or admins can mark alerts as safe");
      return;
    }
    
    try {
      setIsUpdating(true);
      // Status 1 = Resolved (Safe)
      await changeAlertStatus(alert.id, 1);
      
      // Update the local alert data
      setAlert(prev => ({...prev, status: 1}));
      
      toast.success("Alert has been marked as safe");
    } catch (error) {
      console.error("Error marking alert as safe:", error);
      toast.error("Failed to update alert status");
    } finally {
      setIsUpdating(false);
    }
  };
  
  const handleShare = async () => {
    const alertUrl = window.location.href;
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: alert.title,
          text: `Check this emergency alert: ${alert.title} at ${alert.location}`,
          url: alertUrl,
        });
      } catch (error) {
        console.error('Error sharing:', error);
        fallbackShare(alertUrl);
      }
    } else {
      fallbackShare(alertUrl);
    }
  };
  
  const fallbackShare = (url) => {
    navigator.clipboard.writeText(url)
      .then(() => toast.success('Alert link copied to clipboard'))
      .catch(err => {
        console.error('Could not copy text: ', err);
        toast.error('Could not copy link');
      });
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  if (!alert) {
    return (
      <div className="max-w-3xl mx-auto py-8 px-4">
        <div className="card text-center py-12">
          <FiAlertTriangle className="w-16 h-16 text-yellow-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold mb-2 text-gray-900 dark:text-white">Alert Not Found</h2>
          <p className="text-gray-600 dark:text-gray-300 mb-6">
            The alert you're looking for doesn't exist or has been removed.
          </p>
          <Link to="/alerts" className="btn-primary">
            View All Alerts
          </Link>
        </div>
      </div>
    );
  }

  // Format timestamp
  const alertDate = new Date(Number(alert.timestamp) * 1000).toLocaleString();
  
  // Get status color and text
  let statusColor = "bg-alert-info";
  let statusText = "Informational";
  
  switch (parseInt(alert.status)) {
    case 0:
      statusColor = "bg-alert-emergency";
      statusText = "Active Emergency";
      break;
    case 1:
      statusColor = "bg-alert-safe";
      statusText = "Resolved";
      break;
    case 2:
      statusColor = "bg-gray-500";
      statusText = "Expired";
      break;
  }

  // Get alert type text
  let typeText = "Information";
  switch (parseInt(alert.alertType)) {
    case 0:
      typeText = "Emergency";
      break;
    case 1:
      typeText = "Warning";
      break;
    case 2:
      typeText = "Information";
      break;
    case 3:
      typeText = "Safe";
      break;
  }

  return (
    <div className="max-w-3xl mx-auto py-8 px-4">
      <div className="card">
        <div className="mb-6">
          <span className={`${statusColor} text-white text-xs px-2.5 py-1 rounded-full mr-2`}>
            {statusText}
          </span>
          <span className={`bg-gray-700 text-white text-xs px-2.5 py-1 rounded-full`}>
            {typeText}
          </span>
        </div>
        
        <h1 className="text-3xl font-bold mb-3 text-gray-900 dark:text-white">{alert.title}</h1>
        
        <div className="flex flex-wrap gap-4 mb-6 text-sm text-gray-500">
          <div className="flex items-center">
            <FiClock className="mr-1" />
            <span>{alertDate}</span>
          </div>
          <div className="flex items-center">
            <FiMapPin className="mr-1" />
            <span>{alert.location}</span>
          </div>
        </div>
        
        <div className="prose dark:prose-invert max-w-none mb-6">
          {ipfsContent ? (
            <>
              <p>{ipfsContent.description}</p>
              
              {ipfsContent.instructions && ipfsContent.instructions.length > 0 && (
                <>
                  <h3>Instructions</h3>
                  <ul>
                    {ipfsContent.instructions.map((instruction, idx) => (
                      <li key={idx}>{instruction}</li>
                    ))}
                  </ul>
                </>
              )}
              
              {ipfsContent.additionalInfo && (
                <>
                  <h3>Additional Information</h3>
                  <p>{ipfsContent.additionalInfo}</p>
                </>
              )}
              
              {ipfsContent.images && ipfsContent.images.length > 0 && (
                <>
                  <h3>Media</h3>
                  <div className="grid grid-cols-2 gap-2">
                    {ipfsContent.images.map((image, idx) => (
                      <a 
                        key={idx} 
                        href={`https://ipfs.io/ipfs/${image.cid}`} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="border dark:border-gray-700 p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-800"
                      >
                        {image.type.startsWith('image/') ? (
                          <img 
                            src={`https://ipfs.io/ipfs/${image.cid}`} 
                            alt={image.name}
                            className="rounded w-full h-32 object-cover" 
                          />
                        ) : (
                          <div className="h-32 flex items-center justify-center">
                            <div className="text-center">
                              <p className="font-medium">{image.name}</p>
                              <p className="text-xs text-gray-500">{Math.round(image.size / 1024)} KB</p>
                            </div>
                          </div>
                        )}
                      </a>
                    ))}
                  </div>
                </>
              )}
            </>
          ) : (
            <p className="text-gray-600 dark:text-gray-300">
              {alert.description || "No detailed description available."}
            </p>
          )}
        </div>
        
        <div className="border-t dark:border-gray-700 pt-4 mt-6">
          <div className="flex justify-between items-center">
            <button 
              className="btn-primary flex items-center"
              onClick={handleMarkSafe}
              disabled={isUpdating || alert.status === 1 || (!isGovernmentAuthority && !isAdmin)}
            >
              {isUpdating ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Processing...
                </>
              ) : alert.status === 1 ? (
                <>
                  <FiCheck className="mr-1" /> Already Safe
                </>
              ) : (
                <>
                  <FiCheck className="mr-1" /> Mark as Safe
                </>
              )}
            </button>
            <Link to={`/map?alert=${alertId}`} className="btn bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600 flex items-center">
              <FiMap className="mr-1" /> View on Map
            </Link>
            <button 
              className="btn bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600 flex items-center"
              onClick={handleShare}
            >
              <FiShare2 className="mr-1" /> Share
            </button>
          </div>
        </div>
      </div>
      {userLocation && (
        <div className="mt-8">
          <MapContainer center={[alert.latitude, alert.longitude]} zoom={13} style={{ height: "400px", width: "100%" }}>
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            />
            <Marker position={[alert.latitude, alert.longitude]} icon={createCustomIcon(alert.alertType)}>
              <Popup>
                {alert.title} <br /> {alert.location}
              </Popup>
            </Marker>
            <Marker position={[userLocation.lat, userLocation.lng]} icon={createCustomIcon(3)}>
              <Popup>
                Your Location
              </Popup>
            </Marker>
          </MapContainer>
        </div>
      )}
    </div>
  );
};

export default AlertDetailsPage;
