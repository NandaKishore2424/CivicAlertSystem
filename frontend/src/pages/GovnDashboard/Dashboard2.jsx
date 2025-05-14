import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  AlertCircle, Map, QrCode, PlusCircle, 
  ChevronDown, Bell, Menu, Calendar, Clock,
  Check, AlertTriangle, ChevronRight, PanelLeftClose,
  LogOut, Home, Settings, MapPin
} from "lucide-react";
import { useWeb3 } from "../../context/Web3Context";
import { toast } from "react-toastify";
import CreateAlertModal from "./CreateAlertModal";
import { demoAlerts } from '../../data/demoAlerts';

const features = [
  {
    title: "Dashboard",
    icon: <Home className="w-5 h-5" />,
    path: "/government/dashboard",
    badge: null
  },
  {
    title: "Create Alert",
    icon: <Bell className="w-5 h-5" />,
    path: "/government/create-alert",
    badge: null
  },
  {
    title: "Alert Map",
    icon: <Map className="w-5 h-5" />,
    path: "/map",
    badge: null
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
    path: "/government/settings", 
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

const AlertStatusBadge = ({ status }) => {
  const statuses = {
    0: { label: "Active", className: "bg-red-500 text-white" },
    1: { label: "Resolved", className: "bg-green-500 text-white" },
    2: { label: "Expired", className: "bg-gray-500 text-white" }
  };
  
  const { label, className } = statuses[status] || { label: "Unknown", className: "bg-gray-300" };
  
  return (
    <span className={`px-2 py-1 rounded-full text-xs font-medium ${className}`}>
      {label}
    </span>
  );
};

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

const GovernmentDashboard = () => {
  const navigate = useNavigate();
  const { getAlerts, changeAlertStatus, account } = useWeb3();
  
  // Fix 1: Remove the unused setter function
  const [userName] = useState(() => localStorage.getItem("userName") || "Official");
  // Fix 2: Remove the unused variable entirely
  // const [phone] = useState(() => localStorage.getItem("phone") || "+91 •••• ••••••");
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false); 
  const [myAlerts, setMyAlerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);

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

  useEffect(() => {
    const loadAlerts = async () => {
      try {
        setLoading(true);
        const alerts = await getAlerts(0, 100);
        const myFilteredAlerts = alerts.filter(alert => 
          alert.issuer.toLowerCase() === account.toLowerCase()
        );
        
        setMyAlerts(myFilteredAlerts);
      } catch (error) {
        console.error("Failed to load alerts:", error);
        toast.error("Failed to load alerts. Please try again.");
      } finally {
        setLoading(false);
      }
    };
    
    if (account) {
      loadAlerts();
    }
  }, [getAlerts, account]);

  const toggleSidebar = () => {
    setSidebarCollapsed(!sidebarCollapsed);
  };

  const handleMarkAsSafe = async (alertId) => {
    try {
      await changeAlertStatus(alertId, 1); // 1 = Resolved
      
      setMyAlerts(prev => 
        prev.map(alert => 
          alert.id.toString() === alertId.toString() 
            ? {...alert, status: 1} 
            : alert
        )
      );
      
      toast.success("Alert marked as resolved successfully");
    } catch (error) {
      console.error("Failed to update alert:", error);
      toast.error("Failed to mark alert as resolved");
    }
  };
  
  const handleMarkAsExpired = async (alertId) => {
    try {
      await changeAlertStatus(alertId, 2); // 2 = Expired
      
      setMyAlerts(prev => 
        prev.map(alert => 
          alert.id.toString() === alertId.toString() 
            ? {...alert, status: 2} 
            : alert
        )
      );
      
      toast.success("Alert marked as expired successfully");
    } catch (error) {
      console.error("Failed to update alert:", error);
      toast.error("Failed to mark alert as expired");
    }
  };
  
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
    <div className="flex min-h-screen bg-white text-black font-sans">
      {/* Mobile Header */}
      <header className="md:hidden flex items-center justify-between p-4 bg-white border-b fixed top-0 left-0 right-0 z-10 shadow-sm">
        <button onClick={() => setSidebarOpen(!sidebarOpen)} className="p-2 rounded-md hover:bg-gray-100">
          <Menu className="w-6 h-6" />
        </button>
        <h1 className="text-xl font-bold">Gov Dashboard</h1>
        <div className="w-8" />
      </header>

      {/* Collapsible Sidebar - Desktop */}
      <aside 
        className={`
          hidden md:flex flex-col fixed z-20 h-screen 
          border-r border-gray-200 bg-white transition-all duration-300 ease-in-out
          ${sidebarCollapsed ? 'w-[70px]' : 'w-[280px]'}
        `}
      >
        <div className={`flex items-center px-4 h-16 ${sidebarCollapsed ? 'justify-center' : 'justify-between'}`}>
          {!sidebarCollapsed && (
            <div className="flex items-center gap-2">
              <div className="bg-black w-8 h-8 rounded-md flex items-center justify-center text-white">
                <AlertCircle className="w-5 h-5" />
              </div>
              <span className="font-bold text-xl">GovCommand</span>
            </div>
          )}
          {sidebarCollapsed && (
            <div className="bg-black w-10 h-10 rounded-md flex items-center justify-center text-white">
              <AlertCircle className="w-6 h-6" />
            </div>
          )}
          
          <button 
            onClick={toggleSidebar}
            className={`
              p-2 rounded-md hover:bg-gray-100 transition-colors
              ${sidebarCollapsed ? 'absolute right-[-12px] top-5 bg-white shadow-md border border-gray-200 rounded-full' : ''}
            `}
          >
            {sidebarCollapsed ? <ChevronRight className="h-4 w-4" /> : <PanelLeftClose className="h-5 w-5" />}
          </button>
        </div>

        <nav className="flex-1 py-6 overflow-y-auto">
          {/* Issue Alert Button */}
          <div className={`px-3 mb-6 ${sidebarCollapsed ? 'flex justify-center' : ''}`}>
            <button 
              onClick={() => setShowModal(true)}
              className={`
                flex items-center gap-2 px-4 py-2.5 rounded-lg bg-black text-white hover:bg-gray-800 transition-colors font-medium
                ${sidebarCollapsed ? 'justify-center w-10 h-10 p-0' : 'w-full'}
              `}
            >
              <PlusCircle className="h-5 w-5" />
              {!sidebarCollapsed && <span>Issue Alert</span>}
            </button>
          </div>

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
                        localStorage.removeItem("phone");
                        // Any other cleanup needed before redirecting
                        toast.success("Logged out successfully");
                      }
                      navigate(feature.path);
                    }}
                    className={`
                      w-full flex items-center gap-3 py-2.5 px-3 rounded-md transition-colors
                      ${feature.path === window.location.pathname 
                        ? "bg-gray-100 text-black font-medium" 
                        : feature.title === "Logout" ? "text-red-600 hover:bg-red-50" : "text-gray-700 hover:bg-gray-100/80"
                      }
                    `}
                  >
                    <span className={`${
                      feature.path === window.location.pathname 
                        ? "text-black" 
                        : feature.title === "Logout" ? "text-red-600" : "text-gray-600"
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
                  <li className="my-2 border-t border-gray-200"></li>
                )}
              </React.Fragment>
            ))}
          </ul>
        </nav>

        <div className="p-4 border-t border-gray-200">
          {sidebarCollapsed ? (
            <div className="flex justify-center">
              <div className="bg-black w-10 h-10 rounded-full flex items-center justify-center text-white font-bold">
                {userName.charAt(0)}
              </div>
            </div>
          ) : (
            <div className="flex flex-col">
              <div className="flex items-center gap-3 p-2 rounded-md hover:bg-gray-100 transition-colors cursor-pointer">
                <div className="bg-black w-10 h-10 rounded-full flex items-center justify-center text-white font-bold">
                  {userName.charAt(0)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold truncate">{userName}</p>
                  <p className="text-xs text-gray-500 truncate">Government Authority</p>
                </div>
                <ChevronDown className="w-4 h-4 text-gray-500" />
              </div>
              
              {/* Authority info */}
              <div className="mt-2 px-2">
                <p className="text-xs font-medium text-gray-500">Department of Emergency Management</p>
                <p className="text-xs text-gray-400">Official ID: {localStorage.getItem("officialId") || "GMD29584"}</p>
              </div>
            </div>
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
                  <div className="bg-black w-8 h-8 rounded-md flex items-center justify-center text-white">
                    <AlertCircle className="w-5 h-5" />
                  </div>
                  <span className="font-bold text-xl">GovCommand</span>
                </div>
                <button 
                  onClick={() => setSidebarOpen(false)} 
                  className="p-2 rounded-md hover:bg-gray-100"
                >
                  <ChevronRight className="h-5 w-5" />
                </button>
              </div>

              {/* Mobile Issue Alert Button */}
              <div className="p-4">
                <button 
                  onClick={() => {
                    setShowModal(true);
                    setSidebarOpen(false);
                  }}
                  className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-black text-white hover:bg-gray-800 transition-colors font-medium"
                >
                  <PlusCircle className="h-5 w-5" />
                  <span>Issue Alert</span>
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
                              localStorage.removeItem("phone");
                              // Any other cleanup needed before redirecting
                              toast.success("Logged out successfully");
                            }
                            navigate(feature.path);
                            setSidebarOpen(false);
                          }}
                          className={`
                            w-full flex items-center gap-3 py-2.5 px-3 rounded-md transition-colors
                            ${feature.path === window.location.pathname 
                              ? "bg-gray-100 text-black font-medium" 
                              : feature.title === "Logout" ? "text-red-600 hover:bg-red-50" : "text-gray-700 hover:bg-gray-100/80"
                            }
                          `}
                        >
                          <span className={`${
                            feature.path === window.location.pathname 
                              ? "text-black" 
                              : feature.title === "Logout" ? "text-red-600" : "text-gray-600"
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
                        <li className="my-2 border-t border-gray-200"></li>
                      )}
                    </React.Fragment>
                  ))}
                </ul>
              </nav>

              <div className="absolute bottom-0 left-0 w-full p-4 border-t border-gray-200 bg-white">
                <div className="flex flex-col">
                  <div className="flex items-center gap-3 p-2 rounded-md hover:bg-gray-100 transition-colors cursor-pointer">
                    <div className="bg-black w-10 h-10 rounded-full flex items-center justify-center text-white font-bold">
                      {userName.charAt(0)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold truncate">{userName}</p>
                      <p className="text-xs text-gray-500 truncate">Government Authority</p>
                    </div>
                    <ChevronDown className="w-4 h-4 text-gray-500" />
                  </div>
                  
                  {/* Authority info for mobile view */}
                  <div className="mt-2 px-2">
                    <p className="text-xs font-medium text-gray-500">Department of Emergency Management</p>
                    <p className="text-xs text-gray-400">Official ID: {localStorage.getItem("officialId") || "GMD29584"}</p>
                  </div>
                </div>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <div className={`flex-1 transition-all duration-300 ${sidebarCollapsed ? 'md:ml-[70px]' : 'md:ml-[280px]'} mt-16 md:mt-0`}>
        <main className="py-6 px-4 md:px-8 max-w-7xl mx-auto">
          <div className="bg-white rounded-lg shadow-sm mb-6 p-6 border border-gray-200">
            <h1 className="text-2xl font-bold mb-2">Government Control Panel</h1>
            <p className="text-gray-600">Manage and broadcast emergency alerts to the public</p>
          </div>

          <div className="mb-8">
            <h2 className="text-2xl font-bold mb-6">Recent Alerts You've Issued</h2>
            
            {loading ? (
              <div className="flex justify-center items-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-black"></div>
              </div>
            ) : myAlerts.length === 0 ? (
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 text-center">
                <AlertTriangle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-700 mb-2">No Alerts Issued Yet</h3>
                <p className="text-gray-500">You haven't created any alerts yet. Use the "Issue Alert" button to create your first alert.</p>
                <button 
                  onClick={() => setShowModal(true)}
                  className="mt-4 px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition"
                >
                  Create First Alert
                </button>
              </div>
            ) : (
              <div className="overflow-x-auto bg-white rounded-lg shadow border border-gray-200">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Alert</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Location</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Issued</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {myAlerts.map((alert) => {
                      const timestamp = new Date(Number(alert.timestamp) * 1000);
                      const formattedDate = timestamp.toLocaleDateString();
                      const formattedTime = timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
                      
                      return (
                        <tr key={alert.id.toString()} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="font-medium text-gray-900">{alert.title}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <AlertTypeBadge type={parseInt(alert.alertType)} />
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {alert.location}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <AlertStatusBadge status={parseInt(alert.status)} />
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            <div className="flex flex-col">
                              <span className="flex items-center"><Calendar className="h-3 w-3 mr-1" /> {formattedDate}</span>
                              <span className="flex items-center"><Clock className="h-3 w-3 mr-1" /> {formattedTime}</span>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            <div className="flex space-x-2">
                              <button 
                                onClick={() => navigate(`/alerts/${alert.id}`)}
                                className="text-blue-600 hover:text-blue-900"
                              >
                                View
                              </button>
                              {parseInt(alert.status) === 0 && (
                                <>
                                  <button 
                                    onClick={() => handleMarkAsSafe(alert.id)}
                                    className="text-green-600 hover:text-green-900 flex items-center"
                                  >
                                    <Check className="h-3 w-3 mr-1" /> Mark Safe
                                  </button>
                                  <button 
                                    onClick={() => handleMarkAsExpired(alert.id)}
                                    className="text-gray-600 hover:text-gray-900"
                                  >
                                    Expire
                                  </button>
                                </>
                              )}
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Sample Alerts - Replacing previous feature cards */}
          <div className="mb-6">
            <h2 className="text-xl font-bold mb-6 text-gray-800">Sample Alerts</h2>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {demoAlerts.map(alert => {
                const timestamp = new Date(parseInt(alert.timestamp));
                const timeAgo = getTimeAgo(timestamp);
                
                return (
                  <motion.div 
                    key={alert.id} 
                    onClick={() => navigate(getDemoRoute(alert.id))}
                    whileHover={{ y: -3, transition: { duration: 0.2 } }}
                    className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center">
                        <div className={`w-2 h-2 rounded-full mr-2 ${
                          parseInt(alert.alertType) === 0 ? 'bg-red-500' : 
                          parseInt(alert.alertType) === 1 ? 'bg-amber-500' : 
                          parseInt(alert.alertType) === 2 ? 'bg-blue-500' : 
                          'bg-emerald-500'
                        }`}></div>
                        <h3 className="font-bold text-lg text-gray-900">{alert.title}</h3>
                      </div>
                      <AlertTypeBadge type={parseInt(alert.alertType)} />
                    </div>
                    <p className="text-gray-600 mb-4 line-clamp-2">{alert.description}</p>
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
                  </motion.div>
                );
              })}
            </div>
          </div>
        </main>
      </div>
      
      {/* Alert Creation Modal */}
      {showModal && (
        <CreateAlertModal 
          onClose={() => setShowModal(false)} 
          onSuccess={(alertId) => {
            setShowModal(false);
            toast.success("Alert created successfully!");
            navigate(`/alerts/${alertId}`);
          }} 
        />
      )}
    </div>
  );
};

export default GovernmentDashboard;
