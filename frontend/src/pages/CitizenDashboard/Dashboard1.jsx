"use client";

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  AlertCircle,
  Map,
  QrCode,
  Search,
  PlusCircle,
  ChevronDown,
  Bell,
  Menu
} from "lucide-react";

const features = [
  {
    title: "Alert Feed",
    icon: <Bell className="w-6 h-6 text-black" />,
    path: "/AlertFeedPage",
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
    path: "/AlertDetailsPage",
    points: [
      "Full alert description",
      "Location mapping",
      "Resolution options"
    ],
    color: "bg-white border-gray-200"
  },
  {
    title: "Alert Map",
    icon: <Map className="w-6 h-6 text-black" />,
    path: "/AlertMapPage",
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
    path: "/ResourceRequests",
    points: [
      "Request essential supplies",
      "Connect donors with needs",
      "Inventory management",
      "Logistics coordination"
    ],
    color: "bg-green-500/10 text-green-400"
  },
  {
    title: "QR Scanner",
    icon: <QrCode className="w-6 h-6 text-black" />,
    path: "/QRScannerPage",
    points: [
      "Location-based scanning",
      "Automated data capture",
      "Manual entry fallback"
    ],
    color: "bg-white border-gray-200"
  }
];

const Dashboard = () => {
  const navigate = useNavigate();
  const [userName, setUserName] = useState(() => localStorage.getItem("userName") || "Responder");
  const [phone, setPhone] = useState(() => localStorage.getItem("phone") || "+91 •••• ••••••");
  const [isEditing, setIsEditing] = useState(false);
  const [tempName, setTempName] = useState(userName);
  const [tempPhone, setTempPhone] = useState(phone);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const handleEdit = () => setIsEditing(true);
  const handleSave = () => {
    setUserName(tempName);
    setPhone(tempPhone);
    localStorage.setItem("userName", tempName);
    localStorage.setItem("phone", tempPhone);
    setIsEditing(false);
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
              <h1 className="text-3xl font-bold text-black">Emergency Command Center</h1>
              <p className="text-gray-600 mt-1 text-base">
                Real-time monitoring and response coordination
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
    </div>
  );
};

export default Dashboard;
