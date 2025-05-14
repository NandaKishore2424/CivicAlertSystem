import React from 'react';
import { Button } from "../../components/ui/button";
import { 
  Card,
  CardContent,
  CardHeader,
  CardTitle
} from "../../components/ui/card";
import { Badge } from "../../components/ui/badge";
import { Shield, Bell, ArrowRight } from "lucide-react";

const HeroSection = () => {
  return (
    <section id="home" className="relative bg-white text-slate-900 py-24 overflow-hidden">
      {/* Abstract background shapes */}
      <div className="absolute inset-0 overflow-hidden opacity-10">
        <div className="absolute -top-[10%] -right-[10%] w-[40%] h-[40%] rounded-full bg-gray-300"></div>
        <div className="absolute top-[60%] -left-[5%] w-[30%] h-[30%] rounded-full bg-gray-300"></div>
        <div className="absolute top-[20%] left-[50%] w-[15%] h-[15%] rounded-full bg-gray-300"></div>
      </div>
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="flex flex-col md:flex-row items-center gap-12">
          <div className="md:w-1/2 mb-10 md:mb-0 md:pr-8">
            <div className="flex items-center mb-6">
              <Shield className="text-slate-800 h-5 w-5 mr-2" />
              <Badge variant="outline" className="bg-slate-100 text-slate-800 border-slate-200 py-1 font-medium">
                Blockchain Powered Security
              </Badge>
            </div>
            
            <h1 className="text-3xl md:text-5xl lg:text-4xl font-extrabold mb-5 tracking-tight text-slate-900 leading-tight">
              CivicAlertSystem
            </h1>
            
            <p className="text-xl mb-8 text-slate-600 leading-relaxed max-w-xl">
              A blockchain-powered platform for secure, tamper-proof emergency alerts that ensures critical information reaches citizens when they need it most.
            </p>
            
            <div className="flex flex-wrap gap-4 items-center">
              <Button 
                size="lg" 
                className="bg-slate-900 hover:bg-slate-800 text-white shadow-md hover:shadow-lg transition-all"
              >
                <a href="#solution" className="flex items-center">
                  Learn How It Works
                  <ArrowRight className="ml-2 h-4 w-4" />
                </a>
              </Button>
              
              <Button 
                size="lg" 
                variant="outline" 
                className="text-slate-700 border-slate-300 hover:bg-slate-100"
              >
                <a href="#features">View Features</a>
              </Button>
            </div>
            
            <div className="mt-8 flex items-center text-sm text-slate-500">
              <Bell className="h-4 w-4 mr-2 text-slate-600" />
              <span>Trusted by 200+ government agencies worldwide</span>
            </div>
          </div>
          
          <div className="md:w-1/2 flex justify-center">
            <Card className="w-full max-w-md border border-slate-200 shadow-lg rounded-xl overflow-hidden">
              <CardHeader className="bg-slate-900 text-white px-6 py-4 border-b border-slate-800">
                <div className="flex justify-between items-center">
                  <div className="flex items-center">
                    <Shield className="h-5 w-5 mr-2 text-slate-400" />
                    <CardTitle className="text-base font-semibold">CivicAlertSystem Dashboard</CardTitle>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-2.5 h-2.5 bg-red-500 rounded-full"></div>
                    <div className="w-2.5 h-2.5 bg-yellow-500 rounded-full"></div>
                    <div className="w-2.5 h-2.5 bg-green-500 rounded-full"></div>
                  </div>
                </div>
              </CardHeader>
              
              <div className="px-6 py-4 bg-slate-800 text-white">
                <p className="text-sm text-slate-400 uppercase tracking-wide mb-1">
                  CURRENT STATUS
                </p>
                <div className="flex justify-between items-center">
                  <span className="text-lg font-semibold">Active Alerts: 2</span>
                  <Badge className="bg-slate-700 hover:bg-slate-600 text-white">Live</Badge>
                </div>
              </div>
              
              <CardContent className="space-y-3 p-6">
                <Card className="bg-slate-50 border-l-4 border-l-slate-900 hover:shadow transition-shadow">
                  <CardContent className="p-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="text-xs font-semibold text-slate-500 mb-1 uppercase tracking-wide">EMERGENCY ALERT - 10:45 AM</p>
                        <p className="font-semibold text-base text-slate-900">Flash Flood Warning</p>
                      </div>
                      <Badge className="bg-slate-200 text-slate-800 hover:bg-slate-300">Critical</Badge>
                    </div>
                    <div className="flex justify-between text-xs text-slate-500 mt-2">
                      <span>Verified by: City Emergency Services</span>
                      <Badge variant="outline" className="text-slate-700 border-slate-300 font-mono text-xs">
                        Block #4752886
                      </Badge>
                    </div>
                  </CardContent>
                </Card>
                
                <Card className="bg-slate-50 border-l-4 border-l-slate-900 hover:shadow transition-shadow">
                  <CardContent className="p-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="text-xs font-semibold text-slate-500 mb-1 uppercase tracking-wide">EMERGENCY ALERT - 09:30 AM</p>
                        <p className="font-semibold text-base text-slate-900">Severe Weather Advisory</p>
                      </div>
                      <Badge className="bg-slate-200 text-slate-800 hover:bg-slate-300">Urgent</Badge>
                    </div>
                    <div className="flex justify-between text-xs text-slate-500 mt-2">
                      <span>Verified by: National Weather Service</span>
                      <Badge variant="outline" className="text-slate-700 border-slate-300 font-mono text-xs">
                        Block #4752870
                      </Badge>
                    </div>
                  </CardContent>
                </Card>
              </CardContent>
              
              <div className="bg-slate-50 border-t border-slate-200 px-6 py-3">
                <div className="flex justify-between items-center w-full">
                  <div className="text-xs text-slate-500">Last updated: 2 min ago</div>
                  <Button variant="ghost" size="sm" className="text-slate-700">
                    View All Alerts
                  </Button>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;