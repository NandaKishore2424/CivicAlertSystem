import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom'; // for extracting params from the URL

const AlertDetailsPage = () => {
  const [alertData, setAlertData] = useState(null);
  const [error, setError] = useState(null);
  
  const { id: alertId } = useParams(); // Extract the alert ID using useParams hook

  // Fetch the alert details from the backend when the page loads
  useEffect(() => {
    const fetchAlertDetails = async () => {
      try {
        const response = await fetch(`/api/alerts/${alertId}`);
        if (!response.ok) {
          throw new Error('Failed to fetch alert details');
        }
        const data = await response.json();
        setAlertData(data);
      } catch (err) {
        setError(err.message);
      }
    };

    fetchAlertDetails();
  }, [alertId]); // Re-run when alertId changes

  if (error) {
    return <div className="text-center text-red-500">Error: {error}</div>;
  }

  if (!alertData) {
    return (
      <div className="p-6 min-h-screen bg-white text-black font-bold text-lg">
        <h1 className="text-4xl font-extrabold text-black mb-6 text-center">🚨 Loading Alert...</h1>
      </div>
    );
  }

  return (
    <div className="p-6 min-h-screen bg-white text-black font-bold text-lg">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-4xl font-extrabold text-black mb-6 text-center">
          🚨 Alert Details
        </h1>

        <div className="bg-white p-6 rounded-lg border border-black shadow-lg">
          <h2 className="text-3xl font-semibold mb-4">{alertData.title}</h2>

          <p className="text-xl mb-4">{alertData.description}</p>

          {alertData.mediaUrl && (
            <div className="mb-4">
              <img
                src={alertData.mediaUrl}
                alt="Alert Media"
                className="w-full h-auto rounded-lg shadow-lg"
              />
            </div>
          )}

          <p className="text-lg mb-4">
            <strong>Report Type:</strong> {alertData.reportType}
          </p>

          <p className="text-lg mb-4">
            <strong>Location:</strong>{' '}
            {alertData.location
              ? `Lat: ${alertData.location.lat}, Lng: ${alertData.location.lng}`
              : 'Location not provided'}
          </p>

          <p className="text-sm text-gray-600">
            <strong>Timestamp:</strong> {new Date(alertData.timestamp).toLocaleString()}
          </p>
        </div>
      </div>
    </div>
  );
};

export default AlertDetailsPage;
