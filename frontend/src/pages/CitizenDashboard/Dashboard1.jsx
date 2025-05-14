"use client";

import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  AlertCircle, Map, QrCode,  
  ChevronDown, Bell, Menu, ChevronRight,
  MapPin, Clock, AlertTriangle, 
  PanelLeftClose, Home, Settings, LogOut,
  Wallet
} from "lucide-react";
import { useWeb3 } from "../../context/Web3Context";
import { toast } from "react-toastify";
import { useAlerts } from '../../context/AlertsContext';
import { demoAlerts } from '../../data/demoAlerts';
import WalletConnection from '../../components/wallet/WalletConnection';

const features = [
  {
    title: "Home",
    icon: <Home className="w-5 h-5" />,
    path: "/citizen/dashboard",
    badge: null
  },
  {
    title: "Alert Feed",
    icon: <Bell className="w-5 h-5" />,
    path: "/alerts",
    badge: "New"
  },
  {
    title: "Alert Map",
    icon: <Map className="w-5 h-5" />,
    path: "/map",
    badge: null
  },
  {
    title: "Resource Network",
    icon: <AlertCircle className="w-5 h-5" />,
    path: "/resource-requests",
    badge: "5"
  },
  {
    title: "QR Scanner",
    icon: <QrCode className="w-5 h-5" />,
    path: "/scanner",
    badge: null
  },
  {
    title: "Settings",
    icon: <Settings className="w-5 h-5" />,
    path: "/settings",
    badge: null,
    separator: true
  },
  {
    title: "Logout",
    icon: <LogOut className="w-5 h-5" />,
    path: "/signin",
    badge: null
  }
];

// Alert type badges with shadcn-inspired design
const AlertTypeBadge = ({ type }) => {
  const types = {
    0: { label: "Emergency", className: "bg-red-100 text-red-800 border border-red-200" },
    1: { label: "Warning", className: "bg-amber-100 text-amber-800 border border-amber-200" },
    2: { label: "Information", className: "bg-blue-100 text-blue-800 border border-blue-200" },
    3: { label: "Safe", className: "bg-emerald-100 text-emerald-800 border border-emerald-200" }
  };
  
  const { label, className } = types[type] || { label: "Unknown", className: "bg-gray-100 text-gray-800" };
  
  return (
    <span className={`px-2 py-1 rounded-md text-xs font-medium ${className}`}>
      {label}
    </span>
  );
};

const Dashboard = () => {
  const navigate = useNavigate();
  // Add web3Service to the destructured values from useWeb3
  const { getAlerts, isConnected, connectWallet, getAlertById, web3Service, networkId } = useWeb3();
  // Add getCachedAlert to the destructured values from useAlerts
  const { cacheAlert, getCachedAlert } = useAlerts();
  
  const [userName] = useState(() => localStorage.getItem("userName") || "Responder");
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false); // For mobile
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
                    icon: "/alert-icon.png"
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

  // Calculate distance between two points using Haversine formula
  const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371; // Radius of Earth in km
    const dLat = (lat2 - lat1) * (Math.PI / 180);
    const dLon = (lon1 - lon2) * (Math.PI / 180);
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) * 
      Math.sin(dLon/2) * Math.sin(dLon/2); 
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
    const distance = R * c;
    return distance;
  };

  // Helper function to format time
  const getTimeAgo = (timestamp) => {
    const now = new Date();
    const diff = now - timestamp;
    
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);
    
    if (minutes < 60) {
      return `${minutes} min${minutes !== 1 ? 's' : ''} ago`;
    } else if (hours < 24) {
      return `${hours} hour${hours !== 1 ? 's' : ''} ago`;
    } else {
      return `${days} day${days !== 1 ? 's' : ''} ago`;
    }
  };

  const toggleSidebar = () => {
    setSidebarCollapsed(!sidebarCollapsed);
  };

  // Update the prefetchAlertDetails function

const prefetchAlertDetails = async (alertId) => {
  if (alertId.startsWith('demo-')) {
    // For demo alerts, prefetch by finding the alert in the demoAlerts array
    const demoAlert = demoAlerts.find(a => a.id === alertId);
    if (demoAlert) {
      cacheAlert(alertId, { 
        ...demoAlert, 
        ipfsContent: {
          description: demoAlert.description,
          instructions: demoAlert.instructions,
          additionalInfo: demoAlert.additionalInfo
        },
        timestamp: Date.now() // For cache invalidation
      });
    }
    return;
  }
  
  // Skip if getAlertById doesn't exist
  if (!getAlertById || typeof getAlertById !== 'function') return;
  
  try {
    // First check if it's already in cache
    const cachedAlert = getCachedAlert(alertId);
    if (cachedAlert && (Date.now() - cachedAlert.timestamp < 300000)) {
      return; // Already cached and fresh
    }
    
    // Fetch alert data
    const alertData = await getAlertById(alertId);
    if (!alertData) return;
    
    // Start loading IPFS data in the background, but don't wait for it
    if (alertData.ipfsHash && web3Service) {
      // Cache the alert immediately without IPFS content
      cacheAlert(alertId, { ...alertData, ipfsContent: null });
      
      // Then fetch IPFS content in the background
      web3Service.fetchFromIPFS(alertData.ipfsHash)
        .then(ipfsData => {
          // Update cache with IPFS content when it's available
          cacheAlert(alertId, { ...alertData, ipfsContent: ipfsData });
        })
        .catch(error => {
          console.error("Error prefetching IPFS content:", error);
          // Still cache what we have
          cacheAlert(alertId, { ...alertData, ipfsContent: null });
        });
    } else {
      // Cache alert without IPFS content
      cacheAlert(alertId, alertData);
    }
  } catch (error) {
    console.error("Error prefetching alert:", error);
  }
};

// Add this function in your Dashboard component:
const getNetworkName = (chainId) => {
  const networks = {
    1: 'Ethereum',
    5: 'Goerli',
    11155111: 'Sepolia',
    137: 'Polygon',
    80001: 'Mumbai',
    31337: 'Hardhat',
    1337: 'Local'
  };
  return networks[chainId] || `Unknown (${chainId})`;
};

  return (
    <div className="flex min-h-screen bg-gray-50 text-slate-900 font-sans">
      {/* Mobile Header */}
      <header className="md:hidden flex items-center justify-between p-4 bg-white border-b fixed top-0 left-0 right-0 z-10 shadow-sm">
        <button onClick={() => setSidebarOpen(!sidebarOpen)} className="p-2 rounded-md hover:bg-gray-100">
          <Menu className="w-5 h-5" />
        </button>
        <h1 className="text-xl font-bold">Civic Alert</h1>
        <div className="w-8" />
      </header>

      {/* Collapsible Sidebar - Desktop */}
      <aside 
        className={`
          hidden md:flex flex-col fixed z-20 h-screen 
          border-r border-slate-200 bg-white transition-all duration-300 ease-in-out
          ${sidebarCollapsed ? 'w-[70px]' : 'w-[280px]'}
        `}
      >
        <div className={`flex items-center px-4 h-16 ${sidebarCollapsed ? 'justify-center' : 'justify-between'}`}>
          {!sidebarCollapsed && (
            <div className="flex items-center gap-2">
              <div className="bg-slate-900 w-8 h-8 rounded-md flex items-center justify-center text-white">
                <AlertCircle className="w-5 h-5" />
              </div>
              <span className="font-bold text-xl">CivicAlert</span>
            </div>
          )}
          {sidebarCollapsed && (
            <div className="bg-slate-900 w-10 h-10 rounded-md flex items-center justify-center text-white">
              <AlertCircle className="w-6 h-6" />
            </div>
          )}
          
          <button 
            onClick={toggleSidebar}
            className={`
              p-2 rounded-md hover:bg-slate-100 transition-colors
              ${sidebarCollapsed ? 'absolute right-[-12px] top-5 bg-white shadow-md border border-slate-200 rounded-full' : ''}
            `}
          >
            {sidebarCollapsed ? <ChevronRight className="h-4 w-4" /> : <PanelLeftClose className="h-5 w-5" />}
          </button>
        </div>

        <nav className="flex-1 py-6 overflow-y-auto">
          <ul className="space-y-1 px-3">
            {features.map((feature, index) => (
              <React.Fragment key={index}>
                <li>
                  <button
                    onClick={() => {
                      if (feature.title === "Logout") {
                        // Clear any auth tokens if needed
                        localStorage.removeItem("token");
                        localStorage.removeItem("userName");
                        // Any other cleanup needed before redirecting
                        toast.success("Logged out successfully");
                      }
                      navigate(feature.path);
                    }}
                    className={`
                      w-full flex items-center gap-3 py-2.5 px-3 rounded-md transition-colors
                      ${feature.path === window.location.pathname 
                        ? "bg-slate-100 text-slate-900 font-medium" 
                        : feature.title === "Logout" ? "text-red-600 hover:bg-red-50" : "text-slate-700 hover:bg-slate-100/80"
                      }
                    `}
                  >
                    <span className={`
                      ${feature.path === window.location.pathname 
                        ? "text-slate-900" 
                        : feature.title === "Logout" ? "text-red-600" : "text-slate-600"
                      }`}>
                      {feature.icon}
                    </span>
                    
                    {!sidebarCollapsed && (
                      <>
                        <span>{feature.title}</span>
                        {feature.badge && (
                          <span className={`ml-auto inline-flex items-center justify-center px-2 py-0.5 text-xs rounded-full
                            ${feature.badge === 'New' ? 'bg-blue-100 text-blue-800' : 'bg-red-100 text-red-800'}`}>
                            {feature.badge}
                          </span>
                        )}
                      </>
                    )}
                  </button>
                </li>
                {feature.separator && !sidebarCollapsed && (
                  <li className="my-2 border-t border-slate-200"></li>
                )}
              </React.Fragment>
            ))}
          </ul>
        </nav>

        <div className="p-4 border-t border-slate-200">
          {sidebarCollapsed ? (
            <div className="flex flex-col gap-3">
              <div className="flex justify-center">
                <div className="bg-slate-900 w-10 h-10 rounded-full flex items-center justify-center text-white font-bold">
                  {userName.charAt(0)}
                </div>
              </div>
              {/* Add wallet icon in collapsed mode */}
              <div className="flex justify-center">
                <button
                  onClick={connectWallet}
                  className="p-2 rounded-md bg-slate-100 text-slate-700 hover:bg-slate-200 transition-colors"
                >
                  <Wallet className="w-5 h-5" />
                </button>
              </div>
            </div>
          ) : (
            <>
              <div className="flex items-center gap-3 p-2 rounded-md hover:bg-slate-100 transition-colors cursor-pointer mb-3">
                <div className="bg-slate-900 w-10 h-10 rounded-full flex items-center justify-center text-white font-bold">
                  {userName.charAt(0)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold truncate">{userName}</p>
                  <p className="text-xs text-slate-500 truncate">Citizen Responder</p>
                </div>
                <ChevronDown className="w-4 h-4 text-slate-500" />
              </div>
              {/* Add wallet component here */}
              <WalletConnection className="mt-2" />
            </>
          )}
        </div>
      </aside>

      {/* Mobile Sidebar - Overlay */}
      <AnimatePresence>
        {sidebarOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              onClick={() => setSidebarOpen(false)}
              className="md:hidden fixed inset-0 z-20 bg-black"
            />
            <motion.aside
              initial={{ x: -300 }}
              animate={{ x: 0 }}
              exit={{ x: -300 }}
              className="md:hidden fixed top-0 left-0 z-30 h-screen w-[280px] bg-white overflow-y-auto shadow-xl"
            >
              <div className="flex items-center justify-between p-4 border-b">
                <div className="flex items-center gap-2">
                  <div className="bg-slate-900 w-8 h-8 rounded-md flex items-center justify-center text-white">
                    <AlertCircle className="w-5 h-5" />
                  </div>
                  <span className="font-bold text-xl">CivicAlert</span>
                </div>
                <button 
                  onClick={() => setSidebarOpen(false)} 
                  className="p-2 rounded-md hover:bg-slate-100"
                >
                  <ChevronRight className="h-5 w-5" />
                </button>
              </div>

              <nav className="p-4">
                <ul className="space-y-1">
                  {features.map((feature, index) => (
                    <React.Fragment key={index}>
                      <li>
                        <button
                          onClick={() => {
                            if (feature.title === "Logout") {
                              // Clear any auth tokens if needed
                              localStorage.removeItem("token");
                              localStorage.removeItem("userName");
                              // Any other cleanup needed before redirecting
                              toast.success("Logged out successfully");
                            }
                            navigate(feature.path);
                            setSidebarOpen(false);
                          }}
                          className={`
                            w-full flex items-center gap-3 py-2.5 px-3 rounded-md transition-colors
                            ${feature.path === window.location.pathname 
                              ? "bg-slate-100 text-slate-900 font-medium" 
                              : feature.title === "Logout" ? "text-red-600 hover:bg-red-50" : "text-slate-700 hover:bg-slate-100/80"
                            }
                          `}
                        >
                          <span className={`
                            ${feature.path === window.location.pathname 
                              ? "text-slate-900" 
                              : feature.title === "Logout" ? "text-red-600" : "text-slate-600"
                            }`}>
                            {feature.icon}
                          </span>
                          <span>{feature.title}</span>
                          {feature.badge && (
                            <span className={`ml-auto inline-flex items-center justify-center px-2 py-0.5 text-xs rounded-full
                              ${feature.badge === 'New' ? 'bg-blue-100 text-blue-800' : 'bg-red-100 text-red-800'}`}>
                              {feature.badge}
                            </span>
                          )}
                        </button>
                      </li>
                      {feature.separator && (
                        <li className="my-2 border-t border-slate-200"></li>
                      )}
                    </React.Fragment>
                  ))}
                </ul>
              </nav>

              <div className="absolute bottom-0 left-0 w-full p-4 border-t border-slate-200 bg-white">
                <div className="flex items-center gap-3 p-2 rounded-md hover:bg-slate-100 transition-colors cursor-pointer mb-3">
                  <div className="bg-slate-900 w-10 h-10 rounded-full flex items-center justify-center text-white font-bold">
                    {userName.charAt(0)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold truncate">{userName}</p>
                    <p className="text-xs text-slate-500 truncate">Citizen Responder</p>
                  </div>
                  <ChevronDown className="w-4 h-4 text-slate-500" />
                </div>
                {/* Add wallet component here too */}
                <WalletConnection className="mt-2" />
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <div className={`flex-1 transition-all duration-300 ${sidebarCollapsed ? 'md:ml-[70px]' : 'md:ml-[280px]'} mt-16 md:mt-0`}>
        <main className="py-6 px-4 md:px-8 max-w-7xl mx-auto">
          <div className="bg-white rounded-lg shadow-sm mb-6 p-6 border border-slate-200">
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-2xl font-bold mb-2">Emergency Alerts Dashboard</h1>
                <p className="text-slate-600">Stay informed with the latest alerts in your area</p>
              </div>
              {isConnected && networkId && (
                <div className="flex items-center gap-2 px-3 py-1.5 bg-slate-50 rounded-full border border-slate-200">
                  <div className="h-2 w-2 rounded-full bg-green-500"></div>
                  <span className="text-xs font-medium text-slate-700">{getNetworkName(networkId)}</span>
                </div>
              )}
            </div>
          </div>

          {/* Nearby alert notification */}
          {showNearbyNotification && nearbyAlert && (
            <motion.div 
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6 bg-red-50 border-l-4 border-l-red-500 rounded-lg p-4 shadow-sm"
            >
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
                    className="text-xs bg-red-600 text-white py-1 px-3 rounded-md hover:bg-red-700"
                  >
                    View Details
                  </button>
                  <button 
                    onClick={() => setShowNearbyNotification(false)} 
                    className="text-xs bg-slate-200 py-1 px-3 rounded-md hover:bg-slate-300"
                  >
                    Dismiss
                  </button>
                </div>
              </div>
            </motion.div>
          )}

          {/* Alert Feed */}
          <div className="mb-8">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-slate-900">Recent Alerts</h2>
              <button
                onClick={() => navigate('/alerts')}
                className="text-sm flex items-center gap-1 text-slate-600 hover:text-slate-900"
              >
                View all <ChevronRight className="h-4 w-4" />
              </button>
            </div>
            
            {loading ? (
              <div className="flex justify-center items-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-slate-900"></div>
              </div>
            ) : !isConnected ? (
              <div className="space-y-6">
                <div className="bg-slate-50 border border-slate-200 rounded-lg p-6 mb-6">
                  <p className="text-slate-600 mb-4">Connect your wallet to see real-time emergency alerts</p>
                  <button 
                    onClick={connectWallet}
                    className="px-4 py-2 bg-slate-900 text-white rounded-md hover:bg-slate-800 transition"
                  >
                    Connect Wallet
                  </button>
                </div>
                
                {/* Show demo alerts when not connected */}
                <h3 className="text-lg font-semibold mb-3 text-slate-900">Example Alerts</h3>
                <div className="grid gap-4 md:grid-cols-2">
                  {demoAlerts.map(alert => {
                    const timeAgo = getTimeAgo(new Date(alert.timestamp));
                    
                    // Map demo alert IDs to their corresponding static routes
                    const getDemoRoute = (id) => {
                      switch(id) {
                        case 'demo-1': return '/demo/flood-warning';
                        case 'demo-2': return '/demo/weather-advisory';
                        case 'demo-3': return '/demo/road-closure';
                        case 'demo-4': return '/demo/evacuation-lifted';
                        default: return `/alerts/${id}`;
                      }
                    };
                    
                    return (
                      <motion.div 
                        key={alert.id} 
                        onClick={() => navigate(getDemoRoute(alert.id))}
                        whileHover={{ y: -3, transition: { duration: 0.2 } }}
                        className="bg-white border rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer"
                      >
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center">
                            <div className={`w-2 h-2 rounded-full mr-2 ${
                              parseInt(alert.alertType) === 0 ? 'bg-red-500' : 
                              parseInt(alert.alertType) === 1 ? 'bg-amber-500' : 
                              parseInt(alert.alertType) === 2 ? 'bg-blue-500' : 
                              'bg-emerald-500'
                            }`}></div>
                            <h3 className="font-bold text-lg text-slate-900">{alert.title}</h3>
                          </div>
                          <AlertTypeBadge type={parseInt(alert.alertType)} />
                        </div>
                        <p className="text-slate-600 mb-4 line-clamp-2">{alert.description}</p>
                        <div className="flex justify-between text-xs text-slate-500">
                          <div className="flex items-center">
                            <MapPin className="h-3 w-3 mr-1" />
                            <span className="truncate max-w-[150px]">{alert.location}</span>
                          </div>
                          <div className="flex items-center">
                            <Clock className="h-3 w-3 mr-1" />
                            <span>{timeAgo}</span>
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              </div>
            ) : recentAlerts.length === 0 ? (
              <div>
                <div className="bg-slate-50 border border-slate-200 rounded-lg p-6 text-center mb-8">
                  <AlertCircle className="h-12 w-12 text-slate-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-slate-700 mb-2">No Recent Alerts</h3>
                  <p className="text-slate-500">There are currently no active alerts in your area.</p>
                </div>
                
                {/* Show demo alerts as examples when no real alerts exist */}
                <h3 className="text-lg font-semibold mb-3">Example Alerts</h3>
                <div className="grid gap-4 md:grid-cols-2">
                  {demoAlerts.map(alert => {
                    const timestamp = new Date(parseInt(alert.timestamp));
                    const timeAgo = getTimeAgo(timestamp);
                    
                    // Map demo alert IDs to their corresponding static routes
                    const getDemoRoute = (id) => {
                      switch(id) {
                        case 'demo-1': return '/demo/flood-warning';
                        case 'demo-2': return '/demo/weather-advisory';
                        case 'demo-3': return '/demo/road-closure';
                        case 'demo-4': return '/demo/evacuation-lifted';
                        default: return `/alerts/${id}`;
                      }
                    };
                    
                    return (
                      <motion.div 
                        key={alert.id} 
                        onClick={() => navigate(getDemoRoute(alert.id))}
                        onMouseEnter={() => prefetchAlertDetails(alert.id)}
                        whileHover={{ y: -3, transition: { duration: 0.2 } }}
                        className={`bg-white border rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer`}
                      >
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center">
                            <div className={`w-2 h-2 rounded-full mr-2 ${
                              parseInt(alert.alertType) === 0 ? 'bg-red-500' : 
                              parseInt(alert.alertType) === 1 ? 'bg-amber-500' : 
                              parseInt(alert.alertType) === 2 ? 'bg-blue-500' : 
                              'bg-emerald-500'
                            }`}></div>
                            <h3 className="font-bold text-lg text-slate-900">{alert.title}</h3>
                          </div>
                          <AlertTypeBadge type={parseInt(alert.alertType)} />
                        </div>
                        <p className="text-slate-600 mb-4 line-clamp-2">{alert.description}</p>
                        <div className="flex justify-between text-xs text-slate-500">
                          <div className="flex items-center">
                            <MapPin className="h-3 w-3 mr-1" />
                            <span className="truncate max-w-[150px]">{alert.location}</span>
                          </div>
                          <div className="flex items-center">
                            <Clock className="h-3 w-3 mr-1" />
                            <span>{timeAgo}</span>
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              </div>
            ) : (
              <div className="grid gap-4 md:grid-cols-2">
                {recentAlerts.map(alert => {
                  const timestamp = new Date(parseInt(alert.timestamp) * 1000);
                  const timeAgo = getTimeAgo(timestamp);
                  
                  return (
                    <motion.div 
                      key={alert.id.toString()} 
                      onClick={() => navigate(`/alerts/${alert.id}`)}
                      onMouseEnter={() => prefetchAlertDetails(alert.id)}
                      whileHover={{ y: -3, transition: { duration: 0.2 } }}
                      className={`bg-white border rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer`}
                    >
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center">
                          <div className={`w-2 h-2 rounded-full mr-2 ${
                            parseInt(alert.alertType) === 0 ? 'bg-red-500' : 
                            parseInt(alert.alertType) === 1 ? 'bg-amber-500' : 
                            parseInt(alert.alertType) === 2 ? 'bg-blue-500' : 
                            'bg-emerald-500'
                          }`}></div>
                          <h3 className="font-bold text-lg text-slate-900">{alert.title}</h3>
                        </div>
                        <AlertTypeBadge type={parseInt(alert.alertType)} />
                      </div>
                      <p className="text-slate-600 mb-4 line-clamp-2">{alert.description || "No description available"}</p>
                      <div className="flex justify-between text-xs text-slate-500">
                        <div className="flex items-center">
                          <MapPin className="h-3 w-3 mr-1" />
                          <span className="truncate max-w-[150px]">{alert.location}</span>
                        </div>
                        <div className="flex items-center">
                          <Clock className="h-3 w-3 mr-1" />
                          <span>{timeAgo}</span>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
