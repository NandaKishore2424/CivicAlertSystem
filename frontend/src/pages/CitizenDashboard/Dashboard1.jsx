"use client";

import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  AlertCircle, Map, QrCode, Search, 
  PlusCircle, ChevronDown, Bell, Menu,
  MapPin, Clock, AlertTriangle
} from "lucide-react";
import { useWeb3 } from "../../context/Web3Context";
import { toast } from "react-toastify";

const features = [
  {
    title: "Alert Feed",
    icon: <Bell className="w-6 h-6 text-black" />,
    path: "/alerts",
    points: [
      "List of recent alerts",
      "Filter by type or severity",
      "Detailed alert information"
    ],
    color: "bg-white border-gray-200"
  },
  {
    title: "Alert Details",
    icon: <Search className="w-6 h-6 text-black" />,
    path: "/alerts",
    points: [
      "Full alert description",
      "Location mapping",
      "Safety instructions"
    ],
    color: "bg-white border-gray-200"
  },
  {
    title: "Alert Map",
    icon: <Map className="w-6 h-6 text-black" />,
    path: "/map",
    points: [
      "Real-time alerts visualization",
      "Interactive map interface",
      "Geospatial filtering"
    ],
    color: "bg-white border-gray-200"
  },
  {
    title: "Resource Network",
    icon: "🔄",
    path: "/resource-requests",
    points: [
      "Request essential supplies",
      "Connect donors with needs",
      "Inventory management",
      "Logistics coordination"
    ],
    color: "bg-green-500/10 border border-green-200"
  },
  {
    title: "QR Scanner",
    icon: <QrCode className="w-6 h-6 text-black" />,
    path: "/scanner",
    points: [
      "Location-based scanning",
      "Automated data capture",
      "Manual entry fallback"
    ],
    color: "bg-white border-gray-200"
  }
];

// Alert type badges with different styling
const AlertTypeBadge = ({ type }) => {
  const types = {
    0: { label: "Emergency", className: "bg-red-100 text-red-800 border border-red-200" },
    1: { label: "Warning", className: "bg-yellow-100 text-yellow-800 border border-yellow-200" },
    2: { label: "Information", className: "bg-blue-100 text-blue-800 border border-blue-200" },
    3: { label: "Safe", className: "bg-green-100 text-green-800 border border-green-200" }
  };
  
  const { label, className } = types[type] || { label: "Unknown", className: "bg-gray-100 text-gray-800" };
  
  return (
    <span className={`px-2 py-1 rounded text-xs font-medium ${className}`}>
      {label}
    </span>
  );
};

const Dashboard = () => {
  const navigate = useNavigate();
  const { getAlerts, isConnected, connectWallet } = useWeb3();
  
  const [userName, setUserName] = useState(() => localStorage.getItem("userName") || "Responder");
  const [phone, setPhone] = useState(() => localStorage.getItem("phone") || "+91 •••• ••••••");
  const [isEditing, setIsEditing] = useState(false);
  const [tempName, setTempName] = useState(userName);
  const [tempPhone, setTempPhone] = useState(phone);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [recentAlerts, setRecentAlerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userLocation, setUserLocation] = useState(null);
  const [nearbyAlert, setNearbyAlert] = useState(null);
  const [showNearbyNotification, setShowNearbyNotification] = useState(false);

  useEffect(() => {
    // Get user's location
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const userPos = {
            lat: position.coords.latitude,
            lng: position.coords.longitude
          };
          setUserLocation(userPos);
        },
        (error) => {
          console.error("Geolocation error:", error);
        }
      );
    }
  }, []);

  useEffect(() => {
    const fetchAlerts = async () => {
      if (isConnected) {
        try {
          setLoading(true);
          const alerts = await getAlerts(0, 5); // Get 5 most recent alerts
          setRecentAlerts(alerts);
          
          // Check for nearby alerts (active emergencies) if user location is available
          if (userLocation) {
            const activeEmergencies = alerts.filter(
              alert => parseInt(alert.alertType) === 0 && parseInt(alert.status) === 0
            );
            
            // Check if any active emergency is nearby (within ~5km)
            const nearby = activeEmergencies.find(alert => {
              // Convert stored int to actual coordinates
              const alertLat = parseFloat(alert.latitude) / 1000000;
              const alertLng = parseFloat(alert.longitude) / 1000000;
              
              // Simple distance calculation (not perfect but works for small distances)
              const distance = calculateDistance(
                userLocation.lat, userLocation.lng,
                alertLat, alertLng
              );
              
              return distance < 5; // Within 5km
            });
            
            if (nearby) {
              setNearbyAlert(nearby);
              setShowNearbyNotification(true);
              
              // Trigger notification
              try {
                if (Notification && Notification.permission === "granted") {
                  new Notification("Emergency Alert Nearby", {
                    body: `${nearby.title} - ${nearby.location}`,
                    icon: "/alert-icon.png" // Make sure this exists in your public folder
                  });
                } else if (Notification && Notification.permission !== "denied") {
                  Notification.requestPermission().then(permission => {
                    if (permission === "granted") {
                      new Notification("Emergency Alert Nearby", {
                        body: `${nearby.title} - ${nearby.location}`,
                        icon: "/alert-icon.png"
                      });
                    }
                  });
                }
              } catch (error) {
                console.error("Notification error:", error);
              }
            }
          }
        } catch (error) {
          console.error("Error fetching alerts:", error);
          toast.error("Failed to fetch alerts");
        } finally {
          setLoading(false);
        }
      } else {
        setLoading(false);
      }
    };
    
    fetchAlerts();
  }, [isConnected, getAlerts, userLocation]);

  const handleEdit = () => setIsEditing(true);
  const handleSave = () => {
    setUserName(tempName);
    setPhone(tempPhone);
    localStorage.setItem("userName", tempName);
    localStorage.setItem("phone", tempPhone);
    setIsEditing(false);
  };

  // Calculate distance between two points using Haversine formula
  const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371; // Radius of Earth in km
    const dLat = (lat2 - lat1) * (Math.PI / 180);
    const dLon = (lon2 - lon1) * (Math.PI / 180);
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) * 
      Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
  };

  return (
    <div className="flex min-h-screen bg-white text-black font-sans">
      {/* Mobile Header */}
      <header className="md:hidden flex items-center justify-between p-4 bg-white border-b">
        <button onClick={() => setSidebarOpen(!sidebarOpen)} className="p-2 rounded-md hover:bg-gray-100">
          <Menu className="w-6 h-6" />
        </button>
        <h1 className="text-xl font-bold">Dashboard</h1>
        <div className="w-8" />
      </header>

      {/* Sidebar */}
      <motion.div
        initial={{ x: -20, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.4 }}
        className={`${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0 fixed md:static z-10 flex flex-col bg-white h-screen w-64 p-6 border-r transition-transform duration-300`}
      >
        <div className="flex items-center mb-8">
          <div className="bg-black w-9 h-9 rounded-lg flex items-center justify-center mr-3 text-white">
            <AlertCircle className="w-5 h-5" />
          </div>
          <h2 className="text-2xl font-bold text-black">Rescue<span className="text-gray-700">Command</span></h2>
        </div>

        <nav className="flex-1">
          <div className="mb-6">
            <button className="w-full flex items-center gap-2 px-3 py-2.5 rounded-lg bg-black text-white hover:bg-gray-800 transition-colors font-medium text-lg">
              <PlusCircle className="w-5 h-5" />
              <span>Quick Create</span>
            </button>
          </div>

          <h3 className="text-xs uppercase tracking-widest text-gray-500 mb-4 px-2 font-semibold">Emergency Features</h3>
          <ul className="space-y-2">
            {features.map((feature, index) => (
              <li key={index}>
                <button
                  onClick={() => navigate(feature.path)}
                  className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-gray-100 transition-colors text-left text-black text-base font-medium"
                >
                  {feature.icon}
                  <span>{feature.title}</span>
                </button>
              </li>
            ))}
          </ul>
        </nav>

        <div className="mt-auto pt-4 border-t">
          <div className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer">
            <div className="bg-black w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-bold">
              {userName.charAt(0)}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-base font-semibold truncate">{userName}</p>
              <p className="text-xs text-gray-500 truncate">Responder</p>
            </div>
            <ChevronDown className="w-4 h-4 text-gray-500" />
          </div>
        </div>
      </motion.div>

      {/* Main Content */}
      <div className="flex-1">
        <motion.header
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="bg-white border-b p-6"
        >
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h1 className="text-3xl font-bold text-black">Citizen Dashboard</h1>
              <p className="text-gray-600 mt-1 text-base">
                Track alerts and stay informed during emergencies
              </p>
            </div>

            <div className="flex items-center gap-4">
              {isEditing ? (
                <div className="flex gap-2">
                  <input
                    className="px-3 py-2 text-sm rounded border border-gray-300 focus:ring-2 focus:ring-black focus:border-transparent"
                    value={tempName}
                    onChange={(e) => setTempName(e.target.value)}
                    placeholder="Name"
                  />
                  <input
                    className="px-3 py-2 text-sm rounded border border-gray-300 focus:ring-2 focus:ring-black focus:border-transparent"
                    value={tempPhone}
                    onChange={(e) => setTempPhone(e.target.value)}
                    placeholder="Phone"
                  />
                  <button
                    onClick={handleSave}
                    className="px-4 py-2 text-sm rounded bg-black text-white hover:bg-gray-800 font-medium"
                  >
                    Save
                  </button>
                </div>
              ) : (
                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <p className="text-base font-semibold">{userName}</p>
                    <p className="text-sm text-gray-600">{phone}</p>
                  </div>
                  <button
                    onClick={handleEdit}
                    className="text-sm font-medium text-black hover:text-gray-700"
                  >
                    Edit
                  </button>
                </div>
              )}
            </div>
          </div>
        </motion.header>

        <main className="p-6">
          {/* Nearby alert notification */}
          {showNearbyNotification && nearbyAlert && (
            <div className="mb-8 bg-red-50 border border-red-200 rounded-lg p-4 shadow-md">
              <div className="flex justify-between">
                <div className="flex items-start">
                  <AlertTriangle className="h-6 w-6 text-red-500 mr-2 flex-shrink-0" />
                  <div>
                    <h3 className="font-bold text-red-700">Emergency Alert Near You!</h3>
                    <p className="text-red-600">{nearbyAlert.title} - {nearbyAlert.location}</p>
                    <div className="flex items-center text-xs text-red-500 mt-1">
                      <MapPin className="h-3 w-3 mr-1" /> Nearby your current location
                    </div>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button 
                    onClick={() => navigate(`/alerts/${nearbyAlert.id}`)} 
                    className="text-xs bg-red-600 text-white py-1 px-2 rounded hover:bg-red-700"
                  >
                    View Details
                  </button>
                  <button 
                    onClick={() => setShowNearbyNotification(false)} 
                    className="text-xs bg-gray-200 py-1 px-2 rounded hover:bg-gray-300"
                  >
                    Dismiss
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Recent alerts section */}
          <div className="mb-8">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold">Recent Alerts</h2>
              <button 
                onClick={() => navigate('/alerts')} 
                className="text-sm bg-gray-200 hover:bg-gray-300 px-3 py-1 rounded transition-colors"
              >
                View All
              </button>
            </div>
            
            {loading ? (
              <div className="flex justify-center items-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-black"></div>
              </div>
            ) : !isConnected ? (
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 text-center">
                <p className="text-gray-600 mb-4">Connect your wallet to view emergency alerts</p>
                <button 
                  onClick={connectWallet}
                  className="px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition"
                >
                  Connect Wallet
                </button>
              </div>
            ) : recentAlerts.length === 0 ? (
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 text-center">
                <AlertCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-700 mb-2">No Recent Alerts</h3>
                <p className="text-gray-500">There are currently no active alerts in your area.</p>
              </div>
            ) : (
              <div className="grid gap-4 grid-cols-1 md:grid-cols-2">
                {recentAlerts.map(alert => {
                  const timestamp = new Date(parseInt(alert.timestamp) * 1000);
                  const timeAgo = getTimeAgo(timestamp);
                  
                  return (
                    <div 
                      key={alert.id.toString()} 
                      onClick={() => navigate(`/alerts/${alert.id}`)}
                      className="bg-white border rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer"
                    >
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="font-bold text-lg text-gray-900">{alert.title}</h3>
                        <AlertTypeBadge type={parseInt(alert.alertType)} />
                      </div>
                      <p className="text-gray-600 mb-4 line-clamp-2">{alert.description || "No description available"}</p>
                      <div className="flex justify-between text-xs text-gray-500">
                        <div className="flex items-center">
                          <MapPin className="h-3 w-3 mr-1" />
                          <span className="truncate max-w-[150px]">{alert.location}</span>
                        </div>
                        <div className="flex items-center">
                          <Clock className="h-3 w-3 mr-1" />
                          <span>{timeAgo}</span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"
          >
            {features.slice(0, 3).map((feature, idx) => (
              <motion.div
                key={idx}
                whileHover={{ y: -5 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => navigate(feature.path)}
                className={`cursor-pointer rounded-xl p-6 border ${feature.color} hover:shadow-md transition-all`}
                role="button"
                tabIndex={0}
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 rounded-lg bg-gray-100">
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-bold text-black">{feature.title}</h3>
                </div>
                <ul className="space-y-2 text-sm text-gray-700">
                  {feature.points.map((point, i) => (
                    <li key={i} className="flex items-start">
                      <span className="mr-2">•</span>
                      <span>{point}</span>
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </motion.div>
        </main>
      </div>
    </div>
  );
};

// Helper function to format time ago
const getTimeAgo = (date) => {
  const seconds = Math.floor((new Date() - date) / 1000);
  
  let interval = Math.floor(seconds / 31536000);
  if (interval > 1) return `${interval} years ago`;
  
  interval = Math.floor(seconds / 2592000);
  if (interval > 1) return `${interval} months ago`;
  
  interval = Math.floor(seconds / 86400);
  if (interval > 1) return `${interval} days ago`;
  
  interval = Math.floor(seconds / 3600);
  if (interval > 1) return `${interval} hours ago`;
  
  interval = Math.floor(seconds / 60);
  if (interval > 1) return `${interval} minutes ago`;
  
  return "just now";
};

export default Dashboard;
