import React, { useState } from 'react';
import { useWeb3 } from '../../context/Web3Context';
import { toast } from 'react-toastify';
import { Wallet, ChevronDown, ExternalLink, Copy, Power, AlertTriangle, RefreshCcw } from 'lucide-react';

const WalletConnection = ({ className }) => {
  const { isConnected, account, connectWallet, networkId } = useWeb3();
  const [showDropdown, setShowDropdown] = useState(false);

  // Format address for display
  const formatAddress = (address) => {
    if (!address) return '';
    return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`;
  };

  // Get network name based on chainId
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

  // Copy address to clipboard
  const copyToClipboard = () => {
    if (account) {
      navigator.clipboard.writeText(account);
      toast.success('Address copied to clipboard');
      setShowDropdown(false);
    }
  };

  // View on explorer
  const viewOnExplorer = () => {
    if (!account) return;
    
    let explorerUrl;
    switch (networkId) {
      case 1:
        explorerUrl = `https://etherscan.io/address/${account}`;
        break;
      case 5:
        explorerUrl = `https://goerli.etherscan.io/address/${account}`;
        break;
      case 11155111:
        explorerUrl = `https://sepolia.etherscan.io/address/${account}`;
        break;
      case 137:
        explorerUrl = `https://polygonscan.com/address/${account}`;
        break;
      case 80001:
        explorerUrl = `https://mumbai.polygonscan.com/address/${account}`;
        break;
      default:
        toast.warning('Explorer not available for this network');
        return;
    }
    
    window.open(explorerUrl, '_blank');
    setShowDropdown(false);
  };

  // Disconnect wallet
  const disconnect = async () => {
    // This is a soft disconnect since MetaMask doesn't support programmatic disconnect
    // We'll clear the state in our app
    localStorage.removeItem('isWalletConnected');
    
    // Force page reload to reset the state
    window.location.reload();
    
    toast.info('Wallet disconnected');
    setShowDropdown(false);
  };

  // Reset wallet connection
  const resetWalletConnection = () => {
    localStorage.removeItem('isWalletConnected');
    toast.info("Wallet connection reset. Please try connecting again.");
    // Force page reload to clear any pending states
    window.location.reload();
  };

  return (
    <div className={className}>
      {!isConnected ? (
        <div className="space-y-2">
          <button
            onClick={connectWallet}
            className="w-full flex items-center justify-center gap-2 py-2 px-4 bg-slate-900 text-white rounded-md hover:bg-slate-800 transition-colors"
          >
            <Wallet className="h-4 w-4" />
            <span>Connect Wallet</span>
          </button>
          
          {/* Add this button for users experiencing connection issues */}
          <button
            onClick={resetWalletConnection}
            className="w-full flex items-center justify-center gap-2 py-2 px-4 border border-slate-300 text-slate-700 rounded-md hover:bg-slate-100 transition-colors text-sm"
          >
            <RefreshCcw className="h-3 w-3" />
            <span>Reset Connection</span>
          </button>
        </div>
      ) : (
        <div className="relative">
          <button
            onClick={() => setShowDropdown(!showDropdown)}
            className="w-full flex items-center justify-between gap-2 py-2 px-4 border border-slate-200 rounded-md hover:bg-slate-50 transition-colors"
          >
            <div className="flex items-center gap-2">
              <Wallet className="h-4 w-4 text-slate-600" />
              <span className="font-medium">{formatAddress(account)}</span>
            </div>
            <ChevronDown className="h-4 w-4 text-slate-500" />
          </button>
          
          {showDropdown && (
            <div className="absolute top-full left-0 right-0 mt-1 p-2 bg-white rounded-md shadow-lg border border-slate-200 z-50">
              <div className="p-2 mb-2 border-b border-slate-100">
                <div className="text-xs text-slate-500 mb-1">Connected to</div>
                <div className="flex items-center gap-1">
                  <div className={`w-2 h-2 rounded-full ${networkId ? 'bg-green-500' : 'bg-red-500'}`}></div>
                  <span className="text-sm font-medium">{getNetworkName(networkId)}</span>
                </div>
              </div>
              
              <button 
                onClick={copyToClipboard}
                className="w-full flex items-center gap-2 p-2 text-left text-sm hover:bg-slate-50 rounded"
              >
                <Copy className="h-4 w-4" />
                <span>Copy Address</span>
              </button>
              
              <button 
                onClick={viewOnExplorer}
                className="w-full flex items-center gap-2 p-2 text-left text-sm hover:bg-slate-50 rounded"
              >
                <ExternalLink className="h-4 w-4" />
                <span>View on Explorer</span>
              </button>
              
              <button 
                onClick={disconnect}
                className="w-full flex items-center gap-2 p-2 text-left text-sm text-red-600 hover:bg-red-50 rounded"
              >
                <Power className="h-4 w-4" />
                <span>Disconnect</span>
              </button>
              
              {![1, 5, 11155111, 137, 80001].includes(networkId) && (
                <div className="mt-2 p-2 border-t border-slate-100 flex items-center gap-2 text-amber-600 text-xs">
                  <AlertTriangle className="h-3.5 w-3.5" />
                  <span>You're on an unsupported network</span>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default WalletConnection;