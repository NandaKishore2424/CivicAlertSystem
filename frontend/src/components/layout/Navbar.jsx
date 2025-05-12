import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FiBell, FiMenu, FiX, FiMap, FiQrCode, FiUser } from 'react-icons/fi';
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
    <nav className="bg-white shadow-md dark:bg-gray-800">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center">
              <FiBell className="h-8 w-8 text-primary-600" />
              <span className="ml-2 text-xl font-bold text-gray-900 dark:text-white">
                CivicAlertChain
              </span>
            </Link>
          </div>
          
          {/* Desktop menu */}
          <div className="hidden md:flex items-center space-x-4">
            <Link 
              to="/alerts" 
              className={`px-3 py-2 rounded-md ${
                location.pathname === "/alerts" 
                  ? "bg-gray-100 dark:bg-gray-700 text-primary-600" 
                  : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
              }`}
            >
              Alert Feed
            </Link>
            <Link 
              to="/map" 
              className={`px-3 py-2 rounded-md flex items-center ${
                location.pathname === "/map" 
                  ? "bg-gray-100 dark:bg-gray-700 text-primary-600" 
                  : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
              }`}
            >
              <FiMap className="mr-1" />
              Alert Map
            </Link>
            <Link 
              to="/scanner" 
              className={`px-3 py-2 rounded-md flex items-center ${
                location.pathname === "/scanner" 
                  ? "bg-gray-100 dark:bg-gray-700 text-primary-600" 
                  : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
              }`}
            >
              <FiQrCode className="mr-1" />
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
              className="text-gray-500 dark:text-gray-400 hover:text-gray-600 dark:hover:text-gray-300" 
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
          <div className="md:hidden py-2 pb-4">
            <div className="flex flex-col space-y-2">
              <Link 
                to="/alerts" 
                className={`px-3 py-2 rounded-md ${
                  location.pathname === "/alerts" 
                    ? "bg-gray-100 dark:bg-gray-700 text-primary-600" 
                    : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                }`}
                onClick={() => setIsMenuOpen(false)}
              >
                Alert Feed
              </Link>
              <Link 
                to="/map" 
                className={`px-3 py-2 rounded-md ${
                  location.pathname === "/map" 
                    ? "bg-gray-100 dark:bg-gray-700 text-primary-600" 
                    : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                }`}
                onClick={() => setIsMenuOpen(false)}
              >
                Alert Map
              </Link>
              <Link 
                to="/scanner" 
                className={`px-3 py-2 rounded-md ${
                  location.pathname === "/scanner" 
                    ? "bg-gray-100 dark:bg-gray-700 text-primary-600" 
                    : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
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
