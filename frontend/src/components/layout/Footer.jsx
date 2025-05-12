import React from 'react';
import { FiGithub } from 'react-icons/fi';

const Footer = () => {
  return (
    <footer className="bg-white dark:bg-gray-800 shadow-inner py-6">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            <p className="text-gray-600 dark:text-gray-300">
              © {new Date().getFullYear()} CivicAlertChain - Decentralized Emergency Alert Platform
            </p>
          </div>
          <div className="flex space-x-6">
            <span className="text-sm text-gray-500 dark:text-gray-400">Powered by Ethereum</span>
            <span className="text-sm text-gray-500 dark:text-gray-400">IPFS Storage</span>
            <a 
              href="https://github.com/yourusername/civic-alert-chain" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
            >
              <FiGithub className="h-5 w-5" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;