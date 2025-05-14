import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Clock, MapPin, Bell, ChevronLeft, CheckCircle, Share2 } from 'lucide-react';
import { toast } from 'react-toastify';

const RoadClosure = () => {
  const navigate = useNavigate();
  
  const handleShare = () => {
    const alertUrl = window.location.href;
    navigator.clipboard.writeText(alertUrl)
      .then(() => toast.success('Alert link copied to clipboard'))
      .catch(err => toast.error('Could not copy link'));
  };

  return (
    <div className="max-w-4xl mx-auto py-6 px-4 sm:px-6">
      {/* Back button */}
      <button
        onClick={() => navigate('/alerts')}
        className="flex items-center text-slate-600 hover:text-slate-900 mb-6 transition-colors"
      >
        <ChevronLeft className="w-4 h-4 mr-1" />
        <span>Back to alerts</span>
      </button>
      
      {/* Alert content */}
      <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
        {/* Status bar */}
        <div className="bg-blue-50 text-blue-700 px-6 py-3 border-b border-blue-200 flex items-center justify-between">
          <div className="flex items-center">
            <Bell className="h-5 w-5" />
            <span className="ml-2 font-semibold">Informational - Information</span>
          </div>
          <div className="flex space-x-2">
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-500 text-white">
              Information
            </span>
          </div>
        </div>
        
        {/* Alert content */}
        <div className="p-6">
          <h1 className="text-2xl font-bold mb-4 text-slate-900">Road Closure</h1>
          
          <div className="flex flex-wrap gap-4 mb-6 text-sm text-slate-500">
            <div className="flex items-center">
              <Clock className="h-4 w-4 mr-1.5 text-slate-400" />
              <span>12 hours ago</span>
            </div>
            <div className="flex items-center">
              <MapPin className="h-4 w-4 mr-1.5 text-slate-400" />
              <span>Anna Salai, Chennai</span>
            </div>
          </div>
          
          <div className="prose max-w-none mb-6">
            <div className="text-slate-700">
              <p>Anna Salai is closed due to construction. Expected to reopen tomorrow morning. Use alternative routes.</p>
              <p className="mt-4">The closure affects the stretch between Government Estate and LIC Building. This is part of the ongoing Metro Rail expansion work in the area.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Safety Instructions */}
      <div className="mt-6 bg-slate-50 border border-slate-100 rounded-lg p-4">
        <h3 className="text-lg font-semibold text-slate-900 mb-3">Traffic Instructions</h3>
        <ul className="space-y-2">
          <li className="flex items-start">
            <div className="flex-shrink-0 h-5 w-5 text-emerald-500 mt-0.5">
              <CheckCircle className="h-5 w-5" />
            </div>
            <span className="ml-2 text-slate-700">Use alternative routes via Kamarajar Salai or Mount Road</span>
          </li>
          <li className="flex items-start">
            <div className="flex-shrink-0 h-5 w-5 text-emerald-500 mt-0.5">
              <CheckCircle className="h-5 w-5" />
            </div>
            <span className="ml-2 text-slate-700">Expect delays in surrounding areas</span>
          </li>
          <li className="flex items-start">
            <div className="flex-shrink-0 h-5 w-5 text-emerald-500 mt-0.5">
              <CheckCircle className="h-5 w-5" />
            </div>
            <span className="ml-2 text-slate-700">Follow traffic police directions at diversions</span>
          </li>
          <li className="flex items-start">
            <div className="flex-shrink-0 h-5 w-5 text-emerald-500 mt-0.5">
              <CheckCircle className="h-5 w-5" />
            </div>
            <span className="ml-2 text-slate-700">Consider using public transportation if possible</span>
          </li>
        </ul>
      </div>
      
      {/* Additional Info */}
      <div className="mt-6 bg-white border border-slate-200 rounded-lg p-4">
        <h3 className="text-md font-semibold text-slate-900 mb-2">Additional Information</h3>
        <p className="text-slate-600 mb-2">Issued by: Chennai Traffic Police</p>
        <p className="text-slate-600 mb-2">Traffic Helpline: 103</p>
        <p className="text-slate-600">For live traffic updates, follow Chennai Traffic Police on Twitter @ChennaiTraffic</p>
      </div>

      {/* Actions footer */}
      <div className="border-t border-slate-200 bg-slate-50 px-6 py-4 mt-6">
        <div className="flex flex-wrap gap-3 justify-end">
          <button 
            className="bg-white border border-slate-300 text-slate-700 hover:bg-slate-50 px-4 py-2 rounded-md text-sm font-medium flex items-center transition-colors shadow-sm"
            onClick={handleShare}
          >
            <Share2 className="h-4 w-4 mr-1.5" /> Share
          </button>
        </div>
      </div>
    </div>
  );
};

export default RoadClosure;