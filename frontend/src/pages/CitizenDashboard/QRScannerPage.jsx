import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiCamera, FiCheck, FiAlertTriangle } from 'react-icons/fi';
import { useWeb3 } from '../context/Web3Context';
import { toast } from 'react-toastify';

// React 18 compatibility with legacy QR reader
import { QrReader } from 'react-qr-reader';

const QRScannerPage = () => {
  const navigate = useNavigate();
  const { getAlertByQrCode } = useWeb3();
  const [scanning, setScanning] = useState(false);
  const [manualCode, setManualCode] = useState('');
  const [scanResult, setScanResult] = useState(null);
  const [error, setError] = useState(null);
  const [lookingUp, setLookingUp] = useState(false);

  // Enable camera when scanning is true
  const startScanning = () => {
    setScanning(true);
    setScanResult(null);
    setError(null);
  };

  // Process scanned or manually entered QR code
  const processQrCode = async (qrCodeId) => {
    if (!qrCodeId) return;
    
    try {
      setLookingUp(true);
      setScanResult(qrCodeId);
      
      // Hex prefix check - blockchain IDs often need 0x prefix
      const formattedId = qrCodeId.startsWith('0x') ? qrCodeId : `0x${qrCodeId}`;
      
      const alert = await getAlertByQrCode(formattedId);
      
      if (alert && alert.id) {
        toast.success("Alert found! Redirecting to details...");
        // Short delay before navigation for UX
        setTimeout(() => {
          navigate(`/alerts/${alert.id}`);
        }, 1500);
      } else {
        setError("This QR code is not associated with any valid alert");
        toast.error("Invalid QR code - No alert found");
      }
    } catch (err) {
      console.error("Error looking up QR code:", err);
      setError(`Error: ${err.message}`);
      toast.error("Failed to lookup QR code");
    } finally {
      setLookingUp(false);
      setScanning(false);
    }
  };

  // Handle manually entered code
  const handleManualSubmit = (e) => {
    e.preventDefault();
    if (manualCode.trim()) {
      processQrCode(manualCode.trim());
    } else {
      toast.error("Please enter a QR code");
    }
  };

  return (
    <div className="max-w-lg mx-auto text-center p-4">
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
        
        {scanning ? (
          <div className="relative">
            <QrReader
              constraints={{ facingMode: 'environment' }}
              onResult={(result, error) => {
                if (result) {
                  processQrCode(result?.text);
                }
                if (error) {
                  console.info("QR scan error:", error);
                }
              }}
              className="w-full rounded-lg overflow-hidden"
              containerStyle={{ borderRadius: "0.5rem" }}
              videoStyle={{ borderRadius: "0.5rem" }}
            />
            <button 
              onClick={() => setScanning(false)}
              className="mt-4 px-4 py-2 bg-red-500 text-white rounded-lg"
            >
              Cancel Scan
            </button>
          </div>
        ) : (
          <>
            <div className="bg-gray-200 dark:bg-gray-700 rounded-lg aspect-square max-w-xs mx-auto flex items-center justify-center mb-6">
              {scanResult ? (
                <div className="text-center">
                  {lookingUp ? (
                    <div className="flex flex-col items-center">
                      <svg className="animate-spin h-10 w-10 text-gray-500 mb-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      <p>Looking up alert information...</p>
                    </div>
                  ) : error ? (
                    <div className="text-red-500 dark:text-red-400 flex flex-col items-center">
                      <FiAlertTriangle className="w-10 h-10 mb-2" />
                      <p>{error}</p>
                    </div>
                  ) : (
                    <div className="text-green-500 dark:text-green-400 flex flex-col items-center">
                      <FiCheck className="w-10 h-10 mb-2" />
                      <p>QR code scanned successfully!</p>
                      <p className="text-xs opacity-70">{scanResult}</p>
                    </div>
                  )}
                </div>
              ) : (
                <p className="text-gray-500 dark:text-gray-400">Camera access required</p>
              )}
            </div>
            
            <button 
              onClick={startScanning} 
              disabled={lookingUp}
              className="w-full bg-black hover:bg-gray-800 text-white px-4 py-2 rounded-lg mb-4"
            >
              Start Scanning
            </button>
            
            <div className="border-t dark:border-gray-700 pt-4">
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">
                Or enter QR code manually:
              </p>
              <form onSubmit={handleManualSubmit} className="flex gap-2">
                <input 
                  type="text" 
                  placeholder="Enter QR code" 
                  value={manualCode}
                  onChange={(e) => setManualCode(e.target.value)}
                  className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-white rounded-l-lg focus:outline-none focus:ring-2 focus:ring-black"
                />
                <button 
                  type="submit"
                  disabled={lookingUp || !manualCode.trim()}
                  className="px-4 py-2 bg-black hover:bg-gray-800 text-white rounded-r-lg disabled:opacity-50"
                >
                  Lookup
                </button>
              </form>
            </div>
          </>
        )}
      </div>
      
      <p className="text-sm text-gray-500 dark:text-gray-400">
        QR codes can be found on official government notices, public displays, and emergency broadcast channels.
      </p>
    </div>
  );
};

export default QRScannerPage;
