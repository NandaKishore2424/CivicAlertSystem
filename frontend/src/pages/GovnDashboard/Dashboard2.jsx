import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  AlertCircle, Map, QrCode, Search, PlusCircle, 
  ChevronDown, Bell, Menu, X, Calendar, Clock,
  Check, AlertTriangle
} from "lucide-react";
import { useWeb3 } from "../../context/Web3Context";
import { toast } from "react-toastify";
import CreateAlertModal from "./CreateAlertModal";

const features = [
  {
    title: "Create Alert",
    icon: <Bell className="w-6 h-6 text-black" />,
    path: "/government/create-alert",
    points: [
      "Issue emergency notifications",
      "Set alert severity and type",
      "Include location and instructions"
    ],
    color: "bg-white border-gray-200"
  },
  {
    title: "Manage Alerts",
    icon: <Search className="w-6 h-6 text-black" />,
    path: "/government/alerts",
    points: [
      "View your issued alerts",
      "Update alert statuses",
      "Monitor civilian response"
    ],
    color: "bg-white border-gray-200"
  },
  {
    title: "Alert Map",
    icon: <Map className="w-6 h-6 text-black" />,
    path: "/map",
    points: [
      "Live alert mapping",
      "Track emergency zones",
      "Geographic alert filter"
    ],
    color: "bg-white border-gray-200"
  },
  {
    title: "QR Checkpoint Scan",
    icon: <QrCode className="w-6 h-6 text-black" />,
    path: "/scanner",
    points: [
      "Scan checkpoints for validation",
      "Monitor location-based check-ins",
      "Alternative manual entry"
    ],
    color: "bg-white border-gray-200"
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
  
  const [userName, setUserName] = useState(() => localStorage.getItem("userName") || "Official");
  const [phone, setPhone] = useState(() => localStorage.getItem("phone") || "+91 •••• ••••••");
  const [isEditing, setIsEditing] = useState(false);
  const [tempName, setTempName] = useState(userName);
  const [tempPhone, setTempPhone] = useState(phone);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [myAlerts, setMyAlerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const loadAlerts = async () => {
      try {
        setLoading(true);
        // Get all alerts (with a high limit to ensure we get everything)
        const alerts = await getAlerts(0, 100);
        
        // Filter to show only alerts issued by the current account
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

  const handleEdit = () => setIsEditing(true);
  const handleSave = () => {
    setUserName(tempName);
    setPhone(tempPhone);
    localStorage.setItem("userName", tempName);
    localStorage.setItem("phone", tempPhone);
    setIsEditing(false);
  };
  
  const handleMarkAsSafe = async (alertId) => {
    try {
      await changeAlertStatus(alertId, 1); // 1 = Resolved
      
      // Update the UI optimistically
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
      
      // Update the UI optimistically
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

  return (
    <div className="flex min-h-screen bg-white text-black font-sans">
      {/* Mobile Header */}
      <header className="md:hidden flex items-center justify-between p-4 bg-white border-b">
        <button onClick={() => setSidebarOpen(!sidebarOpen)} className="p-2 rounded-md hover:bg-gray-100">
          <Menu className="w-6 h-6" />
        </button>
        <h1 className="text-xl font-bold">Gov Dashboard</h1>
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
          <h2 className="text-2xl font-bold text-black">Gov<span className="text-gray-700">Command</span></h2>
        </div>

        <nav className="flex-1">
          <div className="mb-6">
            <button 
              onClick={() => setShowModal(true)}
              className="w-full flex items-center gap-2 px-3 py-2.5 rounded-lg bg-black text-white hover:bg-gray-800 transition-colors font-medium text-lg"
            >
              <PlusCircle className="w-5 h-5" />
              <span>Issue Alert</span>
            </button>
          </div>

          <h3 className="text-xs uppercase tracking-widest text-gray-500 mb-4 px-2 font-semibold">Admin Tools</h3>
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
              <p className="text-xs text-gray-500 truncate">Govt Official</p>
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
              <h1 className="text-3xl font-bold text-black">Government Control Panel</h1>
              <p className="text-gray-600 mt-1 text-base">
                Manage and broadcast emergency alerts to the public
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
              <div className="overflow-x-auto">
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

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4"
          >
            {features.map((feature, idx) => (
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
