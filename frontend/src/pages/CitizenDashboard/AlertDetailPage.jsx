import React, { useState, useEffect, useCallback } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { Clock, MapPin, AlertTriangle, ChevronLeft, Shield, AlertCircle, Bell, Loader, CheckCircle, Map, Share2 } from 'lucide-react';
import { useWeb3 } from '../../context/Web3Context';
import { toast } from 'react-toastify';
import { useAlerts } from '../../context/AlertsContext';
import { demoAlerts } from '../../data/demoAlerts';

// Fix Leaflet icon issues
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
  iconUrl: require('leaflet/dist/images/marker-icon.png'),
  shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
});

// IPFS error retry component
const IpfsErrorWithRetry = ({ onRetry, section }) => (
  <div className="mt-6 bg-red-50 border border-red-100 rounded-lg p-4 flex flex-col items-center">
    <AlertCircle className="h-6 w-6 text-red-500 mb-2" />
    <h3 className="text-md font-semibold text-red-700 mb-1">Failed to load {section}</h3>
    <p className="text-red-600 text-sm mb-3">The detailed information could not be retrieved</p>
    <button 
      onClick={onRetry}
      className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md text-sm"
    >
      Retry
    </button>
  </div>
);

// Add this prop to your function signature
const AlertDetailPage = ({ preSelectedAlert }) => {
  const navigate = useNavigate();
  const { alertId } = useParams();
  const isDemo = alertId?.startsWith('demo-') || preSelectedAlert;
  const { getAlertById, changeAlertStatus, isGovernmentAuthority, isAdmin, web3Service } = useWeb3();
  const { getCachedAlert, cacheAlert } = useAlerts();
  const [alert, setAlert] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);
  const [ipfsContent, setIpfsContent] = useState(null);
  const [ipfsLoading, setIpfsLoading] = useState(false);
  const [ipfsError, setIpfsError] = useState(false);
  // eslint-disable-next-line no-unused-vars
  const [userLocation, setUserLocation] = useState(null);

  // Fetch IPFS content
  const fetchIpfsContent = useCallback(async (ipfsHash) => {
    if (!ipfsHash) return null;
    
    try {
      setIpfsLoading(true);
      setIpfsError(false);
      const ipfsData = await web3Service.fetchFromIPFS(ipfsHash);
      return ipfsData;
    } catch (error) {
      console.error("Error fetching IPFS content:", error);
      setIpfsError(true);
      return null;
    } finally {
      setIpfsLoading(false);
    }
  }, [web3Service]);

  const fetchAlert = useCallback(async () => {
    if (!alertId) return;
    
    // Check cache first
    const cachedAlert = getCachedAlert(alertId);
    if (cachedAlert && (Date.now() - cachedAlert.timestamp < 300000)) { // 5 min cache
      setAlert(cachedAlert);
      setIpfsContent(cachedAlert.ipfsContent);
      setLoading(false);
      return;
    }
    
    // Otherwise fetch from API
    try {
      setLoading(true);
      const alertData = await getAlertById(alertId);
      
      if (alertData) {
        setAlert(alertData);
        setLoading(false);
        
        // Fetch IPFS content in the background
        if (alertData.ipfsHash) {
          const ipfsData = await fetchIpfsContent(alertData.ipfsHash);
          setIpfsContent(ipfsData);
          
          // Cache both alert and IPFS data
          cacheAlert(alertId, { ...alertData, ipfsContent: ipfsData });
        } else {
          cacheAlert(alertId, { ...alertData, ipfsContent: null });
        }
      } else {
        setLoading(false);
      }
    } catch (error) {
      console.error("Error fetching alert:", error);
      setLoading(false);
      toast.error("Failed to load alert details");
    }
  }, [alertId, getAlertById, getCachedAlert, cacheAlert, fetchIpfsContent]);

  useEffect(() => {
    if (preSelectedAlert) {
      // Use the provided alert directly
      setAlert(preSelectedAlert);
      setIpfsContent({
        description: preSelectedAlert.description,
        instructions: preSelectedAlert.instructions,
        additionalInfo: preSelectedAlert.additionalInfo
      });
      setLoading(false);
    } else if (isDemo) {
      // Load demo alert from the imported data
      const foundAlert = demoAlerts.find(alert => alert.id === alertId);
      if (foundAlert) {
        setAlert(foundAlert);
        setIpfsContent({
          description: foundAlert.description,
          instructions: foundAlert.instructions,
          additionalInfo: foundAlert.additionalInfo
        });
        setLoading(false);
      } else {
        setLoading(false);
      }
    } else {
      // Fetch real alert
      fetchAlert();
    }
  }, [alertId, isDemo, fetchAlert, preSelectedAlert]);

  useEffect(() => {
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
  }, []);

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

  // Find alert type icon
  const getAlertTypeIcon = (alertType) => {
    switch (parseInt(alertType)) {
      case 0: return <AlertTriangle className="h-5 w-5" />;
      case 1: return <AlertCircle className="h-5 w-5" />;
      case 2: return <Bell className="h-5 w-5" />;
      case 3: return <Shield className="h-5 w-5" />;
      default: return <AlertCircle className="h-5 w-5" />;
    }
  };

  // Replace the current loading state with a more detailed skeleton UI

if (loading) {
  return (
    <div className="max-w-4xl mx-auto py-6 px-4 sm:px-6 animate-pulse">
      {/* Back button placeholder */}
      <div className="h-8 w-24 bg-slate-200 rounded mb-6"></div>
      
      {/* Main alert card skeleton */}
      <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
        <div className="h-12 bg-slate-100 border-b border-slate-200"></div>
        
        <div className="p-6">
          {/* Title placeholder */}
          <div className="h-8 w-3/4 bg-slate-200 rounded mb-4"></div>
          
          {/* Info line placeholders */}
          <div className="flex flex-wrap gap-4 mb-6">
            <div className="h-5 w-32 bg-slate-200 rounded"></div>
            <div className="h-5 w-40 bg-slate-200 rounded"></div>
          </div>
          
          {/* Description placeholder */}
          <div className="space-y-2 mb-6">
            <div className="h-4 w-full bg-slate-200 rounded"></div>
            <div className="h-4 w-full bg-slate-200 rounded"></div>
            <div className="h-4 w-3/4 bg-slate-200 rounded"></div>
          </div>
        </div>
      </div>
      
      {/* Map skeleton */}
      <div className="mt-6 bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
        <div className="border-b border-slate-200 px-6 py-4">
          <div className="h-6 w-24 bg-slate-200 rounded"></div>
        </div>
        <div className="h-96 bg-slate-100"></div>
      </div>
    </div>
  );
}

  if (!alert) {
    return (
      <div className="max-w-4xl mx-auto py-8 px-6">
        <div className="bg-white border border-slate-200 rounded-xl p-8 text-center shadow-sm">
          <AlertTriangle className="w-16 h-16 text-orange-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold mb-2 text-slate-900">Alert Not Found</h2>
          <p className="text-slate-600 mb-6">
            The alert you're looking for doesn't exist or has been removed.
          </p>
          <div className="flex justify-center">
            <Link to="/alerts" className="bg-slate-900 hover:bg-slate-800 text-white py-2.5 px-4 rounded-md font-medium shadow-sm transition-colors">
              View All Alerts
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Format timestamp
  const alertDate = new Date(Number(isDemo ? alert.timestamp : alert.timestamp * 1000)).toLocaleString();
  
  // Get status color and text
  let statusText = "Informational";
  let statusBgColor = "bg-blue-50";
  let statusTextColor = "text-blue-700";
  let statusBorderColor = "border-blue-200";
  
  switch (parseInt(alert.status)) {
    case 0:
      statusText = "Active Emergency";
      statusBgColor = "bg-red-50";
      statusTextColor = "text-red-700";
      statusBorderColor = "border-red-200";
      break;
    case 1:
      statusText = "Resolved";
      statusBgColor = "bg-green-50";
      statusTextColor = "text-green-700";
      statusBorderColor = "border-green-200";
      break;
    case 2:
      statusText = "Expired";
      statusBgColor = "bg-gray-50";
      statusTextColor = "text-gray-700";
      statusBorderColor = "border-gray-200";
      break;
    default:
      statusText = "Informational";
      statusBgColor = "bg-blue-50";
      statusTextColor = "text-blue-700";
      statusBorderColor = "border-blue-200";
      break;
  }

  // Get alert type text and styling
  let typeText = "Information";
  let typeColor = "bg-blue-500";
  
  switch (parseInt(alert.alertType)) {
    case 0:
      typeText = "Emergency";
      typeColor = "bg-red-500";
      break;
    case 1:
      typeText = "Warning";
      typeColor = "bg-amber-500";
      break;
    case 2:
      typeText = "Information";
      typeColor = "bg-blue-500";
      break;
    case 3:
      typeText = "Safe";
      typeColor = "bg-green-500";
      break;
    default:
      typeText = "Unknown Type";
      typeColor = "bg-slate-500";
      break;
  }

  return (
    <div className="max-w-4xl mx-auto py-6 px-4 sm:px-6">
      {/* Back button */}
      <button
        onClick={() => navigate(-1)}
        className="flex items-center text-slate-600 hover:text-slate-900 mb-6 transition-colors"
      >
        <ChevronLeft className="w-4 h-4 mr-1" />
        <span>Back to alerts</span>
      </button>
      
      {/* Priority content - always shows immediately */}
      <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
        {/* Status bar at top */}
        <div className={`${statusBgColor} ${statusTextColor} px-6 py-3 border-b ${statusBorderColor} flex items-center justify-between`}>
          <div className="flex items-center">
            {getAlertTypeIcon(alert.alertType)}
            <span className="ml-2 font-semibold">{statusText} - {typeText}</span>
          </div>
          <div className="flex space-x-2">
            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${typeColor} text-white`}>
              {typeText}
            </span>
          </div>
        </div>
        
        {/* Alert content - core information */}
        <div className="p-6">
          <h1 className="text-2xl font-bold mb-4 text-slate-900">{alert.title}</h1>
          
          <div className="flex flex-wrap gap-4 mb-6 text-sm text-slate-500">
            <div className="flex items-center">
              <Clock className="h-4 w-4 mr-1.5 text-slate-400" />
              <span>{alertDate}</span>
            </div>
            <div className="flex items-center">
              <MapPin className="h-4 w-4 mr-1.5 text-slate-400" />
              <span>{alert.location}</span>
            </div>
          </div>
          
          {/* Description - core information */}
          <div className="prose max-w-none mb-6">
            <div className="text-slate-700">
              {ipfsContent?.description || alert.description || "No description available."}
            </div>
            
            {/* Secondary content that loads progressively */}
            {/* ... instructions, additional info, media sections with loading states ... */}
          </div>
        </div>
      </div>

      {/* Add this after the main content section */}

      {/* Instructions section */}
      {ipfsLoading ? (
        <div className="mt-6 bg-slate-50 border border-slate-100 rounded-lg p-4 flex items-center justify-center">
          <Loader className="h-5 w-5 text-slate-400 animate-spin mr-2" />
          <span className="text-slate-500">Loading safety instructions...</span>
        </div>
      ) : ipfsError ? (
        <IpfsErrorWithRetry
          section="safety instructions"
          onRetry={() => {
            if (alert?.ipfsHash) {
              fetchIpfsContent(alert.ipfsHash)
                .then(data => setIpfsContent(data));
            }
          }}
        />
      ) : (
        ipfsContent?.instructions && ipfsContent.instructions.length > 0 && (
          <div className="mt-6 bg-slate-50 border border-slate-100 rounded-lg p-4">
            <h3 className="text-lg font-semibold text-slate-900 mb-3">Safety Instructions</h3>
            <ul className="space-y-2">
              {ipfsContent.instructions.map((instruction, idx) => (
                <li key={idx} className="flex items-start">
                  <div className="flex-shrink-0 h-5 w-5 text-emerald-500 mt-0.5">
                    <CheckCircle className="h-5 w-5" />
                  </div>
                  <span className="ml-2 text-slate-700">{instruction}</span>
                </li>
              ))}
            </ul>
          </div>
        )
      )}

      {/* Map button */}
      {alert.latitude && alert.longitude && (
        <div className="mt-6 bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
          <div className="p-6 flex flex-col items-center">
            <div className="text-center mb-4">
              <h2 className="text-lg font-semibold text-slate-900">View on Map</h2>
              <p className="text-slate-500 text-sm mt-1">See the exact location of this alert</p>
            </div>
            <button
              onClick={() => navigate(`/map?alert=${alertId}&lat=${alert.latitude}&lng=${alert.longitude}&type=${alert.alertType}&title=${encodeURIComponent(alert.title)}`)}
              className="bg-slate-900 hover:bg-slate-800 text-white py-3 px-6 rounded-lg flex items-center justify-center font-medium transition-colors"
            >
              <Map className="h-5 w-5 mr-2" /> Open Map View
            </button>
          </div>
        </div>
      )}

      {/* Actions footer */}
      <div className="border-t border-slate-200 bg-slate-50 px-6 py-4 mt-6">
        <div className="flex flex-wrap gap-3 justify-end">
          <button 
            className={`flex items-center px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              isUpdating || alert.status === 1 || (!isGovernmentAuthority && !isAdmin)
                ? 'bg-slate-200 text-slate-500 cursor-not-allowed'
                : 'bg-emerald-500 text-white shadow-sm hover:bg-emerald-600'
            }`}
            onClick={handleMarkSafe}
            disabled={isUpdating || alert.status === 1 || (!isGovernmentAuthority && !isAdmin)}
          >
            {alert.status === 1 ? (
              <>
                <CheckCircle className="h-4 w-4 mr-1.5" /> Already Resolved
              </>
            ) : (
              <>
                <CheckCircle className="h-4 w-4 mr-1.5" /> Mark as Resolved
              </>
            )}
          </button>
          <button 
            className="bg-white border border-slate-300 text-slate-700 hover:bg-slate-50 px-4 py-2 rounded-md text-sm font-medium flex items-center transition-colors shadow-sm"
            onClick={handleShare}
          >
            <Share2 className="h-4 w-4 mr-1.5" /> Share
          </button>
        </div>
      </div>
    </div>
  );
};

export default AlertDetailPage;
