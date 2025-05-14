import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { 
  PhoneCall, Trash2, MapPin, Calendar, RefreshCcw, Heart, 
  SortAsc, SortDesc, Send, AlertTriangle, ChevronLeft
} from "lucide-react";

const ResourceRequests = () => {
  const navigate = useNavigate();
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
    upiId: "donate@safedrive", // Static UPI ID
  });

  const [totalDonated, setTotalDonated] = useState(0);
  const [thankYouMsg, setThankYouMsg] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    // Fetch stored requests from localStorage
    const storedRequests = JSON.parse(localStorage.getItem("requests")) || [];
    setRequests(storedRequests);

    // Get user's geolocation
    navigator.geolocation.getCurrentPosition((position) => {
      const { latitude, longitude } = position.coords;
      const link = `https://www.google.com/maps?q=${latitude},${longitude}`;
      setForm((prev) => ({ ...prev, geolocation: link }));
    });
  }, []);

  const handleRequestSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    const newRequest = {
      ...form,
      timestamp: new Date().toISOString(),
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

    setTimeout(() => {
      setIsSubmitting(false);
    }, 500);
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

  const handleDonation = (amount) => {
    setTotalDonated(prev => prev + parseFloat(amount));
    setThankYouMsg(`Thank you for your donation of ₹${amount}!`);
    setTimeout(() => setThankYouMsg(""), 5000);
  };

  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp);
    return new Intl.DateTimeFormat('en-IN', {
      day: '2-digit',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  };

  return (
    <div className="bg-background min-h-screen pt-16 p-4 md:p-8 space-y-8 max-w-7xl mx-auto relative">
      {/* Back Button */}
      <button 
        onClick={() => navigate(-1)}
        className="absolute top-6 left-6 flex items-center text-sm font-medium text-primary hover:text-primary/90 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-ring"
      >
        <ChevronLeft className="mr-1 h-4 w-4" />
        Back
      </button>

      <div className="space-y-2 mt-4">
        <h1 className="text-3xl font-bold tracking-tight">Resource Network</h1>
        <p className="text-muted-foreground">Request and offer emergency resources during disasters</p>
      </div>
      
      {/* Donation Card */}
      <div className="rounded-lg border bg-card text-card-foreground shadow overflow-hidden">
        <div className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 p-6">
          <div className="space-y-2 text-white">
            <div className="flex items-center space-x-2">
              <Heart className="h-5 w-5 text-white" />
              <h2 className="text-xl font-semibold leading-none tracking-tight">Donation Center</h2>
            </div>
            <p className="text-white/90">Support emergency response efforts with your contribution</p>
          </div>
        </div>
        
        <div className="p-6 pt-4 space-y-4">
          {thankYouMsg && (
            <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-md text-sm">
              {thankYouMsg}
            </div>
          )}
          
          <div className="flex flex-col space-y-1.5">
            <div className="flex items-center justify-between">
              <p className="text-muted-foreground text-sm">Total contributions</p>
              <p className="font-semibold text-lg">₹{totalDonated}</p>
            </div>
            <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
              <div 
                className="bg-gradient-to-r from-indigo-500 to-purple-500 h-full" 
                style={{ width: `${Math.min(totalDonated / 10000 * 100, 100)}%` }}
              ></div>
            </div>
            <p className="text-xs text-muted-foreground">UPI ID: {commonDonation.upiId}</p>
          </div>
          
          <div className="flex flex-wrap gap-2 pt-2">
            <button 
              onClick={() => handleDonation("100")} 
              className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-9 px-4 py-2"
            >
              Donate ₹100
            </button>
            <button 
              onClick={() => handleDonation("500")} 
              className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-9 px-4 py-2"
            >
              Donate ₹500
            </button>
            <button 
              onClick={() => handleDonation("1000")} 
              className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-secondary text-secondary-foreground hover:bg-secondary/80 h-9 px-4 py-2"
            >
              Donate ₹1000
            </button>
          </div>
        </div>
      </div>
      
      {/* Help Request Form */}
      <div className="rounded-lg border bg-card text-card-foreground shadow">
        <div className="p-6 flex flex-row items-center justify-between space-y-0 pb-2 border-b">
          <h3 className="font-semibold text-lg leading-none tracking-tight">Submit a Help Request</h3>
        </div>
        <form onSubmit={handleRequestSubmit} className="p-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">Name</label>
              <input
                type="text"
                placeholder="Your Full Name"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                required
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">Phone Number</label>
              <input
                type="text"
                placeholder="Contact Number"
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                required
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">Help Type</label>
              <select
                value={form.type}
                onChange={(e) => setForm({ ...form, type: e.target.value })}
                className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                required
              >
                <option value="">Select Resource Type</option>
                <option>Food</option>
                <option>Shelter</option>
                <option>Blood</option>
                <option>Ambulance</option>
                <option>Medical Supplies</option>
                <option>Transportation</option>
                <option>Other</option>
              </select>
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">Location</label>
              <input
                type="text"
                placeholder="Describe your location"
                value={form.location}
                onChange={(e) => setForm({ ...form, location: e.target.value })}
                className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
              />
            </div>
          </div>
          
          <div className="space-y-1.5">
            <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">Additional Information</label>
            <textarea
              placeholder="Provide details about your request"
              value={form.info}
              onChange={(e) => setForm({ ...form, info: e.target.value })}
              className="flex min-h-[80px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
              rows={3}
            />
          </div>
          
          <div className="space-y-1.5">
            <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">UPI ID</label>
            <input
              type="text"
              placeholder="Your UPI ID to receive donations"
              value={form.upi}
              onChange={(e) => setForm({ ...form, upi: e.target.value })}
              className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
              required
            />
            <p className="text-xs text-muted-foreground">Example: name@upi or 1234567890@ybl</p>
          </div>
          
          {form.geolocation && (
            <div className="flex items-center text-sm space-x-1">
              <MapPin className="h-4 w-4 text-muted-foreground" />
              <a
                href={form.geolocation}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-primary underline-offset-4 hover:underline"
              >
                View your current location on map
              </a>
            </div>
          )}
          
          <button
            type="submit"
            disabled={isSubmitting}
            className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2 w-full"
          >
            {isSubmitting ? (
              <>
                <RefreshCcw className="mr-2 h-4 w-4 animate-spin" />
                Submitting...
              </>
            ) : (
              <>
                <Send className="mr-2 h-4 w-4" />
                Submit Request
              </>
            )}
          </button>
        </form>
      </div>
      
      {/* Help Requests List */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center sm:justify-between gap-4">
          <div className="flex items-center space-x-1">
            <h2 className="text-xl font-semibold tracking-tight">Help Requests</h2>
            <div className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-xs font-medium bg-primary/10 text-primary h-6 px-2">
              {requests.length}
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => handleSortRequests("desc")}
              className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-9 px-3"
            >
              <SortDesc className="mr-1 h-4 w-4" /> Newest
            </button>
            <button
              onClick={() => handleSortRequests("asc")}
              className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-9 px-3"
            >
              <SortAsc className="mr-1 h-4 w-4" /> Oldest
            </button>
          </div>
        </div>
        
        {requests.length > 0 ? (
          <div className="space-y-4">
            {requests.map((req, index) => (
              <div
                key={index}
                className="rounded-lg border bg-card text-card-foreground shadow"
              >
                <div className="p-6">
                  <div className="flex flex-col md:flex-row justify-between mb-4">
                    <div>
                      <h3 className="font-semibold text-lg">{req.name}</h3>
                      <div className="flex items-center text-sm text-muted-foreground space-x-2">
                        <div className="flex items-center">
                          <Calendar className="h-4 w-4 mr-1" />
                          <span>{formatTimestamp(req.timestamp)}</span>
                        </div>
                        <div className="flex items-center">
                          <MapPin className="h-4 w-4 mr-1" />
                          <span>{req.location || "Unknown location"}</span>
                        </div>
                      </div>
                    </div>
                    <div className="mt-2 md:mt-0">
                      <div className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border-transparent bg-primary text-primary-foreground">
                        {req.type}
                      </div>
                    </div>
                  </div>
                  
                  {req.info && (
                    <p className="mt-2 text-sm">{req.info}</p>
                  )}
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                    <div className="space-y-2">
                      <div className="text-sm">
                        <span className="text-muted-foreground">Contact:</span>{" "}
                        <a href={`tel:${req.phone}`} className="font-medium hover:underline">
                          {req.phone}
                        </a>
                      </div>
                      <div className="text-sm font-mono">
                        <span className="text-muted-foreground">UPI ID:</span>{" "}
                        <span>{req.upi}</span>
                      </div>
                    </div>
                    
                    <div className="flex flex-wrap gap-2 justify-start md:justify-end">
                      <a
                        href={generateUpiLink(req.upi, req.name)}
                        className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-secondary text-secondary-foreground hover:bg-secondary/80 h-9 px-3 py-2"
                      >
                        <Heart className="mr-1 h-4 w-4" /> Donate
                      </a>
                      <a
                        href={`tel:${req.phone}`}
                        className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-9 px-3 py-2"
                      >
                        <PhoneCall className="mr-1 h-4 w-4" /> Call
                      </a>
                      <a
                        href={req.geolocation}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-9 px-3 py-2"
                      >
                        <MapPin className="mr-1 h-4 w-4" /> Map
                      </a>
                      <button
                        onClick={() => handleDeleteRequest(index)}
                        className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-destructive text-destructive-foreground hover:bg-destructive/90 h-9 px-3 py-2"
                      >
                        <Trash2 className="mr-1 h-4 w-4" /> Delete
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="rounded-lg border bg-card text-card-foreground shadow p-8 text-center">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-muted">
              <AlertTriangle className="h-6 w-6 text-muted-foreground" />
            </div>
            <h3 className="mt-4 text-lg font-semibold">No help requests yet</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              Be the first to submit a help request. Your request will appear here.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ResourceRequests;