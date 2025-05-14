import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FiBell, FiMenu, FiX, FiMap, FiUser } from 'react-icons/fi';
import { FiHash as QrCodeIcon } from 'react-icons/fi';
import { useWeb3 } from '../../context/Web3Context';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { isConnected, account, connectWallet, isGovernmentAuthority, isAdmin } = useWeb3();
  const location = useLocation();
  
  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  
  // Format account address for display
  const formatAddress = (address) => {
    if (!address) return '';
    return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`;
  };
  
  // Function to render different dashboard link based on user role
  const getDashboardLink = () => {
    if (isGovernmentAuthority || isAdmin) {
      return "/government/dashboard";
    }
    return "/citizen/dashboard";
  };

  return (
    <nav className="bg-slate-900 shadow-lg text-white">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center">
              <FiBell className="h-8 w-8 text-red-500" />
              <span className="ml-2 text-xl font-bold text-white">
                CivicAlertSystem
              </span>
            </Link>
          </div>
          
          {/* Desktop menu */}
          <div className="hidden md:flex items-center space-x-4">
            <Link 
              to="/alerts" 
              className={`px-3 py-2 rounded-md transition-colors ${
                location.pathname === "/alerts" 
                  ? "bg-slate-700 text-white" 
                  : "text-slate-200 hover:bg-slate-800"
              }`}
            >
              <FiBell className="h-4 w-4 inline mr-2" />
              Alert Feed
            </Link>
            <Link 
              to="/map" 
              className={`px-3 py-2 rounded-md transition-colors ${
                location.pathname === "/map" 
                  ? "bg-slate-700 text-white" 
                  : "text-slate-200 hover:bg-slate-800"
              }`}
            >
              <FiMap className="h-4 w-4 inline mr-2" />
              Alert Map
            </Link>
            <Link 
              to="/scanner" 
              className={`px-3 py-2 rounded-md transition-colors ${
                location.pathname === "/scanner" 
                  ? "bg-slate-700 text-white" 
                  : "text-slate-200 hover:bg-slate-800"
              }`}
            >
              <QrCodeIcon className="h-4 w-4 inline mr-2" />
              QR Scanner
            </Link>
            
            {!isConnected ? (
              <button onClick={connectWallet} className="btn-primary">
                Connect Wallet
              </button>
            ) : (
              <div className="flex items-center space-x-2">
                <span className="text-sm bg-gray-100 dark:bg-gray-700 px-3 py-1 rounded-full text-gray-700 dark:text-gray-300">
                  {formatAddress(account)}
                </span>
                <Link to={getDashboardLink()} className="btn-primary flex items-center">
                  <FiUser className="mr-1" /> 
                  Dashboard
                </Link>
              </div>
            )}
          </div>
          
          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button 
              className="text-white focus:outline-none" 
              onClick={toggleMenu}
            >
              {isMenuOpen ? (
                <FiX className="h-6 w-6" />
              ) : (
                <FiMenu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>
        
        {/* Mobile menu */}
        {isMenuOpen && (
          <div className="md:hidden py-2 pb-4 bg-slate-800">
            <div className="flex flex-col space-y-2">
              <Link 
                to="/alerts" 
                className={`px-3 py-2 rounded-md ${
                  location.pathname === "/alerts" 
                    ? "bg-slate-700 text-white" 
                    : "text-slate-200 hover:bg-slate-800"
                }`}
                onClick={() => setIsMenuOpen(false)}
              >
                Alert Feed
              </Link>
              <Link 
                to="/map" 
                className={`px-3 py-2 rounded-md ${
                  location.pathname === "/map" 
                    ? "bg-slate-700 text-white" 
                    : "text-slate-200 hover:bg-slate-800"
                }`}
                onClick={() => setIsMenuOpen(false)}
              >
                Alert Map
              </Link>
              <Link 
                to="/scanner" 
                className={`px-3 py-2 rounded-md ${
                  location.pathname === "/scanner" 
                    ? "bg-slate-700 text-white" 
                    : "text-slate-200 hover:bg-slate-800"
                }`}
                onClick={() => setIsMenuOpen(false)}
              >
                QR Scanner
              </Link>
              
              {!isConnected ? (
                <button 
                  onClick={() => {
                    connectWallet();
                    setIsMenuOpen(false);
                  }} 
                  className="btn-primary mt-2"
                >
                  Connect Wallet
                </button>
              ) : (
                <div className="flex flex-col space-y-2 mt-2">
                  <span className="text-sm bg-gray-100 dark:bg-gray-700 px-3 py-2 rounded text-gray-700 dark:text-gray-300 text-center">
                    {formatAddress(account)}
                  </span>
                  <Link 
                    to={getDashboardLink()} 
                    className="btn-primary flex items-center justify-center"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <FiUser className="mr-1" />
                    Dashboard
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
