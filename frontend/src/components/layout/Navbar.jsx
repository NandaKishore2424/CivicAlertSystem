// import React, { useState } from 'react';
// import { Link } from 'react-router-dom';
// import { FiBell, FiMenu, FiX, FiMap, FiQrCode } from 'react-icons/fi';

// const Navbar = () => {
//   const [isMenuOpen, setIsMenuOpen] = useState(false);
//   const [connected, setConnected] = useState(false);
  
//   const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  
//   const handleConnectWallet = () => {
//     // This would connect to a blockchain wallet in the real implementation
//     setConnected(true);
//   };

//   return (
//     <nav className="bg-white shadow-md dark:bg-gray-800">
//       <div className="container mx-auto px-4">
//         <div className="flex justify-between items-center h-16">
//           <div className="flex items-center">
//             <Link to="/" className="flex items-center">
//               <FiBell className="h-8 w-8 text-primary-600" />
//               <span className="ml-2 text-xl font-bold text-gray-900 dark:text-white">
//                 CivicAlertChain
//               </span>
//             </Link>
//           </div>
          
//           {/* Desktop menu */}
//           <div className="hidden md:flex items-center space-x-4">
//             <Link 
//               to="/alerts" 
//               className="px-3 py-2 rounded-md text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
//             >
//               Alert Feed
//             </Link>
//             <Link 
//               to="/map" 
//               className="px-3 py-2 rounded-md text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
//             >
//               <div className="flex items-center">
//                 <FiMap className="mr-1" />
//                 Alert Map
//               </div>
//             </Link>
//             <Link 
//               to="/scanner" 
//               className="px-3 py-2 rounded-md text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
//             >
//               <div className="flex items-center">
//                 <FiQrCode className="mr-1" />
//                 QR Scanner
//               </div>
//             </Link>
            
//             {!connected ? (
//               <button onClick={handleConnectWallet} className="btn-primary">
//                 Connect Wallet
//               </button>
//             ) : (
//               <Link to="/dashboard" className="btn-primary">
//                 Dashboard
//               </Link>
//             )}
//           </div>
          
//           {/* Mobile menu button */}
//           <div className="md:hidden flex items-center">
//             <button 
//               className="text-gray-500 dark:text-gray-400 hover:text-gray-600 dark:hover:text-gray-300" 
//               onClick={toggleMenu}
//             >
//               {isMenuOpen ? (
//                 <FiX className="h-6 w-6" />
//               ) : (
//                 <FiMenu className="h-6 w-6" />
//               )}
//             </button>
//           </div>
//         </div>
        
//         {/* Mobile menu */}
//         {isMenuOpen && (
//           <div className="md:hidden py-2">
//             <div className="flex flex-col space-y-2">
//               <Link 
//                 to="/alerts" 
//                 className="px-3 py-2 rounded-md text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
//                 onClick={() => setIsMenuOpen(false)}
//               >
//                 Alert Feed
//               </Link>
//               <Link 
//                 to="/map" 
//                 className="px-3 py-2 rounded-md text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
//                 onClick={() => setIsMenuOpen(false)}
//               >
//                 Alert Map
//               </Link>
//               <Link 
//                 to="/scanner" 
//                 className="px-3 py-2 rounded-md text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
//                 onClick={() => setIsMenuOpen(false)}
//               >
//                 QR Scanner
//               </Link>
              
//               {!connected ? (
//                 <button 
//                   onClick={() => {
//                     handleConnectWallet();
//                     setIsMenuOpen(false);
//                   }} 
//                   className="btn-primary"
//                 >
//                   Connect Wallet
//                 </button>
//               ) : (
//                 <Link 
//                   to="/dashboard" 
//                   className="btn-primary"
//                   onClick={() => setIsMenuOpen(false)}
//                 >
//                   Dashboard
//                 </Link>
//               )}
//             </div>
//           </div>
//         )}
//       </div>
//     </nav>
//   );
// };

// export default Navbar;


import React from 'react'

const Navbar = () => {
  return (
    <div>
      
    </div>
  )
}

export default Navbar
