import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Html5Qrcode } from 'html5-qrcode';
import { 
  Camera, 
  CheckCircle, 
  AlertTriangle, 
  X, 
  Loader, 
  ChevronLeft 
} from 'lucide-react';
import { useWeb3 } from '../../context/Web3Context';
import { toast } from 'react-toastify';

const QRScannerPage = () => {
  const navigate = useNavigate();
  const { getAlertByQrCode } = useWeb3();
  const [scanning, setScanning] = useState(false);
  const [manualCode, setManualCode] = useState('');
  const [scanResult, setScanResult] = useState(null);
  const [error, setError] = useState(null);
  const [lookingUp, setLookingUp] = useState(false);
  const [hasCamera, setHasCamera] = useState(null);
  const scannerRef = useRef(null);
  const scannerContainerRef = useRef(null);
  
  // Check for camera availability
  useEffect(() => {
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      navigator.mediaDevices.getUserMedia({ video: true })
        .then(() => setHasCamera(true))
        .catch(() => setHasCamera(false));
    } else {
      setHasCamera(false);
    }
  }, []);

  // Clean up scanner when component unmounts
  useEffect(() => {
    return () => {
      if (scannerRef.current) {
        scannerRef.current.stop().catch(error => {
          console.error("Failed to stop scanner:", error);
        });
      }
    };
  }, []);

  // Start scanning function
  const startScanning = () => {
    setScanning(true);
    setScanResult(null);
    setError(null);
    
    // Short delay to ensure the DOM element is available
    setTimeout(() => {
      const html5QrCode = new Html5Qrcode("scanner-container");
      scannerRef.current = html5QrCode;
      
      html5QrCode.start(
        { facingMode: "environment" },
        {
          fps: 10,
          qrbox: { width: 250, height: 250 },
        },
        (decodedText) => {
          // On success
          html5QrCode.stop().then(() => {
            setScanning(false);
            processQrCode(decodedText);
          }).catch(err => {
            console.error("Failed to stop scanner:", err);
          });
        },
        (errorMessage) => {
          // QR scan error - but don't show this to user unless it's persistent
          console.log(errorMessage);
        }
      ).catch(err => {
        setScanning(false);
        setError("Failed to start camera: " + err.message);
        toast.error("Camera error: " + err.message);
      });
    }, 500);
  };

  // Stop scanning
  const stopScanning = () => {
    if (scannerRef.current) {
      scannerRef.current.stop().then(() => {
        setScanning(false);
      }).catch(err => {
        console.error("Failed to stop scanner:", err);
        setScanning(false);
      });
    } else {
      setScanning(false);
    }
  };

  // Process scanned or manually entered QR code
  const processQrCode = async (qrCodeId) => {
    if (!qrCodeId) return;
    
    try {
      setLookingUp(true);
      setScanResult(qrCodeId);
      
      // For demo purposes - handle demo QR codes directly
      if (qrCodeId === "DEMO-FLOOD") {
        toast.success("Demo alert found! Redirecting...");
        setTimeout(() => navigate("/demo/flood-warning"), 1500);
        return;
      } else if (qrCodeId === "DEMO-WEATHER") {
        toast.success("Demo alert found! Redirecting...");
        setTimeout(() => navigate("/demo/weather-advisory"), 1500);
        return;
      } else if (qrCodeId === "DEMO-ROAD") {
        toast.success("Demo alert found! Redirecting...");
        setTimeout(() => navigate("/demo/road-closure"), 1500);
        return;
      } else if (qrCodeId === "DEMO-EVAC") {
        toast.success("Demo alert found! Redirecting...");
        setTimeout(() => navigate("/demo/evacuation-lifted"), 1500);
        return;
      }
      
      // Handle real blockchain QR codes
      const formattedId = qrCodeId.startsWith('0x') ? qrCodeId : `0x${qrCodeId}`;
      
      const alert = await getAlertByQrCode(formattedId);
      
      if (alert && alert.id) {
        toast.success("Alert found! Redirecting to details...");
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
      {/* Back button */}
      <button
        onClick={() => navigate(-1)}
        className="flex items-center text-slate-600 hover:text-slate-900 mb-6 transition-colors absolute top-4 left-4"
      >
        <ChevronLeft className="w-4 h-4 mr-1" />
        <span>Back</span>
      </button>
      
      <h1 className="text-3xl font-bold mb-6 text-slate-900">QR Code Scanner</h1>
      
      <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden p-6 mb-6">
        {!scanning ? (
          <div className="mb-6">
            <div className="w-20 h-20 bg-slate-100 rounded-full mx-auto flex items-center justify-center">
              <Camera className="h-10 w-10 text-slate-500" />
            </div>
          </div>
        ) : null}
        
        <p className="text-slate-700 mb-6">
          Scan an official CivicAlert QR code to access verified emergency information.
        </p>
        
        {scanning ? (
          <div className="relative">
            <div className="bg-black p-1 rounded-lg aspect-square max-w-xs mx-auto mb-6 overflow-hidden">
              {hasCamera ? (
                <div id="scanner-container" ref={scannerContainerRef} className="w-full h-full" style={{ minHeight: '250px' }}></div>
              ) : (
                <div className="w-full h-full bg-slate-800 flex items-center justify-center text-white">
                  <p>Camera access not available</p>
                </div>
              )}
              
              {/* Visual scanning indicator */}
              <div className="absolute top-0 left-0 right-0 h-0.5 bg-red-500 animate-scan-line"></div>
            </div>
            
            <button 
              onClick={stopScanning}
              className="flex items-center justify-center gap-2 w-full mt-4 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
            >
              <X className="h-4 w-4" /> Cancel Scan
            </button>
          </div>
        ) : (
          <>
            <div className="bg-slate-100 rounded-lg aspect-square max-w-xs mx-auto flex items-center justify-center mb-6 p-4">
              {scanResult ? (
                <div className="text-center">
                  {lookingUp ? (
                    <div className="flex flex-col items-center">
                      <Loader className="h-10 w-10 text-slate-500 mb-2 animate-spin" />
                      <p className="text-slate-700">Looking up alert information...</p>
                    </div>
                  ) : error ? (
                    <div className="text-red-500 flex flex-col items-center">
                      <AlertTriangle className="h-10 w-10 mb-2" />
                      <p>{error}</p>
                    </div>
                  ) : (
                    <div className="text-emerald-500 flex flex-col items-center">
                      <CheckCircle className="h-10 w-10 mb-2" />
                      <p>QR code scanned successfully!</p>
                      <p className="text-xs text-slate-500 mt-1">{scanResult}</p>
                    </div>
                  )}
                </div>
              ) : hasCamera === false ? (
                <p className="text-slate-500">Camera access unavailable</p>
              ) : (
                <p className="text-slate-500">Ready to scan</p>
              )}
            </div>
            
            <button 
              onClick={startScanning} 
              disabled={lookingUp || hasCamera === false}
              className={`w-full flex items-center justify-center gap-2 px-4 py-2 rounded-lg mb-4 transition-colors ${
                lookingUp || hasCamera === false 
                  ? "bg-slate-300 text-slate-500 cursor-not-allowed" 
                  : "bg-slate-900 hover:bg-slate-800 text-white"
              }`}
            >
              <Camera className="h-5 w-5" /> Start Scanning
            </button>
            
            <div className="border-t border-slate-200 pt-4">
              <p className="text-sm text-slate-500 mb-3">
                Or enter QR code manually:
              </p>
              <form onSubmit={handleManualSubmit} className="flex gap-2">
                <input 
                  type="text" 
                  placeholder="Enter QR code" 
                  value={manualCode}
                  onChange={(e) => setManualCode(e.target.value)}
                  className="flex-1 px-3 py-2 border border-slate-300 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-slate-500"
                />
                <button 
                  type="submit"
                  disabled={lookingUp || !manualCode.trim()}
                  className={`px-4 py-2 rounded-r-lg transition-colors ${
                    lookingUp || !manualCode.trim()
                      ? "bg-slate-300 text-slate-500 cursor-not-allowed"
                      : "bg-slate-900 hover:bg-slate-800 text-white"
                  }`}
                >
                  Lookup
                </button>
              </form>
            </div>
          </>
        )}
      </div>
      
      {/* Additional information section */}
      <div className="bg-slate-50 border border-slate-200 rounded-xl p-4">
        <h3 className="font-semibold text-slate-900 mb-2">Demo QR Codes</h3>
        <p className="text-sm text-slate-500 mb-2">
          For testing purposes, you can enter these codes manually:
        </p>
        <ul className="text-xs text-left text-slate-700 space-y-1">
          <li><span className="font-medium">DEMO-FLOOD</span> - Flash Flood Warning</li>
          <li><span className="font-medium">DEMO-WEATHER</span> - Severe Weather Advisory</li>
          <li><span className="font-medium">DEMO-ROAD</span> - Road Closure</li>
          <li><span className="font-medium">DEMO-EVAC</span> - Evacuation Order Lifted</li>
        </ul>
      </div>
      
      <p className="text-sm text-slate-500 mt-6">
        QR codes can be found on official government notices, public displays, and emergency broadcast channels.
      </p>
    </div>
  );
};

export default QRScannerPage;
