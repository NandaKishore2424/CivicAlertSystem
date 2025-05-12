import React from 'react';
import { FiCamera } from 'react-icons/fi';

const QRScannerPage = () => {
  return (
    <div className="max-w-lg mx-auto text-center">
      <h1 className="text-3xl font-bold mb-6 text-gray-900 dark:text-white">QR Scanner</h1>
      
      <div className="card mb-6">
        <div className="mb-6">
          <div className="w-20 h-20 bg-gray-100 dark:bg-gray-700 rounded-full mx-auto flex items-center justify-center">
            <FiCamera className="h-10 w-10 text-gray-500" />
          </div>
        </div>
        
        <p className="text-gray-700 dark:text-gray-300 mb-6">
          Scan an official CivicAlertChain QR code to access verified emergency information.
        </p>
        
        <div className="bg-gray-200 dark:bg-gray-700 rounded-lg aspect-square max-w-xs mx-auto flex items-center justify-center">
          <p className="text-gray-500 dark:text-gray-400">Camera access required</p>
        </div>
        
        <button className="btn-primary w-full mt-6">
          Start Scanning
        </button>
      </div>
      
      <p className="text-sm text-gray-500 dark:text-gray-400">
        QR codes can be found on official government notices, public displays, and emergency broadcast channels.
      </p>
    </div>
  );
};

export default QRScannerPage;