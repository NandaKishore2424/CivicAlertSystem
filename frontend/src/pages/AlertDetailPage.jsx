import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { FiArrowLeft, FiMap, FiCheck, FiExternalLink } from 'react-icons/fi';

const AlertDetailPage = () => {
  const { id } = useParams();
  
  // This would fetch from API in real implementation
  const alert = {
    id,
    type: 'emergency',
    title: 'Water Contamination Warning',
    description: 'Contamination detected in Central District water supply. Harmful levels of E. coli bacteria have been found in samples from the Main Street reservoir. All residents should boil water for at least one minute before drinking, cooking, or brushing teeth. Bottled water is recommended for infants and those with compromised immune systems.',
    issuer: 'Department of Public Health',
    severity: 'Critical',
    date: 'May 10, 2025',
    location: 'Central District, Metro City',
    coordinates: { lat: 40.7128, lng: -74.006 },
    txHash: '0x8a35acfbc15ff81a39ae7d344fd709f28e8600b4aa8c65c6b64bfe7fe36bd19b',
    ipfsHash: 'QmW2WQi7j6c7UgJTarActp7tDNikE4B2qXtFCfLPdsgaTQ',
    instructions: [
      'Boil water vigorously for at least one minute',
      'Let water cool before using',
      'Use boiled or bottled water for drinking, making ice, washing dishes, brushing teeth, and food preparation',
      'Do not use water from any appliance connected to your water lines'
    ]
  };

  return (
    <div className="max-w-4xl mx-auto">
      <Link to="/alerts" className="inline-flex items-center text-primary-600 hover:underline mb-4">
        <FiArrowLeft className="mr-1" /> Back to alerts
      </Link>
      
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
        <div className={`bg-alert-${alert.type} p-4`}>
          <div className="flex justify-between items-center">
            <span className="bg-white text-alert-emergency px-2 py-1 rounded-full text-xs font-medium">
              {alert.type.charAt(0).toUpperCase() + alert.type.slice(1)}
            </span>
            <span className="text-white text-sm">ID: {alert.id}</span>
          </div>
          <h1 className="text-white text-2xl font-bold mt-2">{alert.title}</h1>
        </div>
        
        <div className="p-6">
          <div className="flex flex-wrap gap-4 text-sm mb-6">
            <div className="flex items-center">
              <span className="font-semibold text-gray-700 dark:text-gray-300">Issued by:</span>
              <span className="ml-2 text-gray-600 dark:text-gray-400">{alert.issuer}</span>
            </div>
            <div className="flex items-center">
              <span className="font-semibold text-gray-700 dark:text-gray-300">Date:</span>
              <span className="ml-2 text-gray-600 dark:text-gray-400">{alert.date}</span>
            </div>
            <div className="flex items-center">
              <span className="font-semibold text-gray-700 dark:text-gray-300">Location:</span>
              <span className="ml-2 text-gray-600 dark:text-gray-400">{alert.location}</span>
            </div>
          </div>
          
          <div className="mb-6">
            <h2 className="text-lg font-semibold mb-2 text-gray-900 dark:text-white">Description</h2>
            <p className="text-gray-700 dark:text-gray-300">{alert.description}</p>
          </div>
          
          <div className="mb-6">
            <h2 className="text-lg font-semibold mb-2 text-gray-900 dark:text-white">Instructions</h2>
            <ul className="list-disc pl-5 space-y-1 text-gray-700 dark:text-gray-300">
              {alert.instructions.map((instruction, index) => (
                <li key={index}>{instruction}</li>
              ))}
            </ul>
          </div>
          
          <div className="border-t dark:border-gray-700 pt-4 mt-6">
            <div className="flex justify-between items-center">
              <button className="btn-primary flex items-center">
                <FiCheck className="mr-1" /> Mark as Safe
              </button>
              <button className="btn bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600 flex items-center">
                <FiMap className="mr-1" /> View on Map
              </button>
            </div>
          </div>
        </div>
        
        <div className="bg-gray-50 dark:bg-gray-700 p-4 text-sm">
          <div className="flex flex-col sm:flex-row justify-between">
            <a 
              href={`https://etherscan.io/tx/${alert.txHash}`} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="flex items-center text-primary-600 hover:underline mb-2 sm:mb-0"
            >
              <FiExternalLink className="mr-1" /> View on blockchain
            </a>
            <a 
              href={`https://ipfs.io/ipfs/${alert.ipfsHash}`} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="flex items-center text-primary-600 hover:underline"
            >
              <FiExternalLink className="mr-1" /> View on IPFS
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AlertDetailPage;