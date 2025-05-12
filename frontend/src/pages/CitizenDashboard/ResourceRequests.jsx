import React, { useEffect, useState } from "react";

const ResourceRequests = () => {
  const [requests, setRequests] = useState([]);
  const [form, setForm] = useState({
    name: "",
    phone: "",
    type: "",
    location: "",
    info: "",
    geolocation: "",
    upi: "",
  });

  const [commonDonation] = useState({
    upiId: "donate@safedrive", // This is now static and always shown
  });

  const [totalDonated, setTotalDonated] = useState(0);
  const [thankYouMsg, setThankYouMsg] = useState("");

  useEffect(() => {
    // Fetch stored requests from localStorage when the component loads
    const storedRequests = JSON.parse(localStorage.getItem("requests")) || [];
    setRequests(storedRequests);

    // Get the user's geolocation
    navigator.geolocation.getCurrentPosition((position) => {
      const { latitude, longitude } = position.coords;
      const link = `https://www.google.com/maps?q=${latitude},${longitude}`;
      setForm((prev) => ({ ...prev, geolocation: link }));
    });
  }, []);

  const handleRequestSubmit = (e) => {
    e.preventDefault();

    const newRequest = {
      ...form,
      timestamp: new Date().toISOString(), // Add timestamp to the request
    };

    // Add new request to the requests array
    const updatedRequests = [...requests, newRequest];

    // Save updated requests to localStorage
    localStorage.setItem("requests", JSON.stringify(updatedRequests));

    // Update state
    setRequests(updatedRequests);

    // Clear the form
    setForm({
      name: "",
      phone: "",
      type: "",
      location: "",
      info: "",
      geolocation: form.geolocation,
      upi: "",
    });
  };

  const generateUpiLink = (upiId, name, amount = "") => {
    return `upi://pay?pa=${upiId}&pn=${name}&am=${amount}&cu=INR`;
  };

  const handleSortRequests = (order) => {
    const sortedRequests = [...requests].sort((a, b) => {
      if (order === "desc") {
        return new Date(b.timestamp) - new Date(a.timestamp);
      } else {
        return new Date(a.timestamp) - new Date(b.timestamp);
      }
    });

    setRequests(sortedRequests);
  };

  const handleDeleteRequest = (index) => {
    const updatedRequests = requests.filter((_, idx) => idx !== index);
    setRequests(updatedRequests);
    localStorage.setItem("requests", JSON.stringify(updatedRequests));
  };

  return (
    <div className="bg-black min-h-screen text-white p-4 md:p-8 space-y-12">
      {/* 💖 Creative Donation Banner - Simplified */}
      <div className="relative bg-gradient-to-br from-red-900 via-red-500 to-red-900 text-white rounded-3xl shadow-2xl p-10 text-center max-w-4xl mx-auto overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full bg-black bg-opacity-30 rounded-3xl z-0"></div>
        <div className="relative z-10">
          <h1 className="text-4xl md:text-5xl font-extrabold drop-shadow mb-4">
            🌟 Be Someone's Superhero!
          </h1>
          <p className="text-lg md:text-xl mb-6 font-semibold">
            A small donation can create a big impact. Help save lives today.
          </p>

          {thankYouMsg && (
            <p className="text-md font-semibold text-green-200 animate-pulse mb-4">
              {thankYouMsg}
            </p>
          )}

          <p className="mt-4 text-white font-semibold text-md">
            🧾 Total Donated:{" "}
            <span className="text-yellow-200 font-bold">₹{totalDonated}</span>
          </p>
          <p className="text-sm mt-1 text-white/80 font-mono">
            UPI ID: {commonDonation.upiId}
          </p>
        </div>
      </div>

      {/* 🆘 Help Request Form */}
      <div className="bg-zinc-900 p-8 rounded-2xl shadow-xl max-w-4xl mx-auto w-full">
        <h2 className="text-3xl font-bold text-red-400 mb-6 text-center">
          🆘 Submit a Help Request
        </h2>
        <form onSubmit={handleRequestSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              type="text"
              placeholder="Your Name"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="p-3 rounded bg-zinc-800 text-white w-full"
              required
            />
            <input
              type="text"
              placeholder="Phone Number"
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
              className="p-3 rounded bg-zinc-800 text-white w-full"
              required
            />
            <select
              value={form.type}
              onChange={(e) => setForm({ ...form, type: e.target.value })}
              className="p-3 rounded bg-zinc-800 text-white w-full"
              required
            >
              <option value="">Select Help Type</option>
              <option>Food</option>
              <option>Shelter</option>
              <option>Blood</option>
              <option>Ambulance</option>
            </select>
            <input
              type="text"
              placeholder="Manual Location (Optional)"
              value={form.location}
              onChange={(e) => setForm({ ...form, location: e.target.value })}
              className="p-3 rounded bg-zinc-800 text-white w-full"
            />
          </div>
          <textarea
            placeholder="Additional Info"
            value={form.info}
            onChange={(e) => setForm({ ...form, info: e.target.value })}
            className="w-full p-3 rounded bg-zinc-800 text-white"
          />
          <div>
            <input
              type="text"
              placeholder="Your UPI ID (to receive donations)"
              value={form.upi}
              onChange={(e) => setForm({ ...form, upi: e.target.value })}
              className="w-full p-3 rounded bg-zinc-800 text-white mb-1"
              required
            />
            <p className="text-xs text-gray-400">
              Example: name@upi or 1234567890@ybl
            </p>
          </div>
          <p className="text-sm text-gray-400">
            📍 Live Location:{" "}
            <a
              href={form.geolocation}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-400 underline"
            >
              View on Google Maps
            </a>
          </p>
          <button
            type="submit"
            className="bg-red-500 px-5 py-3 rounded hover:bg-red-600 w-full font-semibold mt-2"
          >
            Submit Help Request
          </button>
        </form>
      </div>

      {/* 📋 Request List */}
      <div className="flex justify-between items-center mb-6 max-w-4xl mx-auto">
        <h2 className="text-2xl font-bold text-yellow-400">
          📋 Live Help Requests
        </h2>
        <div className="flex gap-2">
          <button
            onClick={() => handleSortRequests("desc")}
            className="text-white px-4 py-2 bg-blue-500 rounded"
          >
            Newest First
          </button>
          <button
            onClick={() => handleSortRequests("asc")}
            className="text-white px-4 py-2 bg-green-500 rounded"
          >
            Oldest First
          </button>
        </div>
      </div>

      {requests.length > 0 ? (
        <div className="max-w-4xl mx-auto">
          {requests.map((req, index) => (
            <div
              key={index}
              className="bg-zinc-800 p-5 rounded-xl mb-4 border border-zinc-700"
            >
              <p className="font-semibold text-lg">
                {req.name} needs{" "}
                <span className="text-red-300">{req.type}</span> at{" "}
                <strong>{req.location || "Unknown Location"}</strong>
              </p>
              <p className="text-gray-300 text-sm mt-1">{req.info}</p>
              <a
                href={req.geolocation}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-400 underline text-sm mt-1 inline-block"
              >
                🔗 View Live Location
              </a>
              <div className="mt-2">
                <p className="text-sm text-green-400">
                  💸 UPI ID: <span className="font-mono">{req.upi}</span>
                </p>
                <p className="text-sm text-yellow-300 mt-1">
                  📞 Contact:{" "}
                  <a href={`tel:${req.phone}`} className="underline">
                    {req.phone}
                  </a>
                </p>
              </div>
              <div className="mt-3 flex flex-wrap gap-4">
                <a
                  href={generateUpiLink(req.upi, req.name)}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
                >
                  💖 Donate to {req.name}
                </a>
                <a
                  href={`tel:${req.phone}`}
                  className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded"
                >
                  📞 Call Now
                </a>
                <button
                  onClick={() => handleDeleteRequest(index)}
                  className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded"
                >
                  🗑️ Delete Request
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-center text-gray-400 max-w-4xl mx-auto">
          No help requests yet. Be the first to submit one!
        </p>
      )}
    </div>
  );
};

export default ResourceRequests;