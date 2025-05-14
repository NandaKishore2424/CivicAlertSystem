import React from 'react';
import { Card, CardContent } from "../../components/ui/card";
import { Badge } from "../../components/ui/badge";
import { 
  Shield, 
  Lock, 
  Network 
} from "lucide-react";

const Solution = () => {
  const solutions = [
    {
      title: "Decentralized Infrastructure",
      description: "Our system distributes alert data across multiple blockchain nodes, eliminating single points of failure. Even if some nodes go offline during a disaster, the network remains operational.",
      icon: <Network className="h-6 w-6 text-blue-600" />
    },
    {
      title: "Immutable Records",
      description: "Every alert is permanently recorded on the blockchain with a cryptographic signature, timestamp, and location data. This creates an unalterable audit trail that prevents tampering or falsification.",
      icon: <Lock className="h-6 w-6 text-blue-600" />
    },
    {
      title: "Verified Authority",
      description: "Only cryptographically authorized entities can issue alerts, using secure identity verification through blockchain wallets. Smart contracts enforce role-based access control to ensure only legitimate authorities can broadcast alerts.",
      icon: <Shield className="h-6 w-6 text-blue-600" />
    }
  ];

  return (
    <section id="solution" className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Our Solution</h2>
          <p className="text-gray-600 max-w-3xl mx-auto">
            AlertChain utilizes blockchain technology to create a decentralized emergency alert system that is secure, transparent, and resilient.
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 gap-10 items-center">
          <div className="order-2 md:order-1">
            <div className="space-y-6">
              {solutions.map((solution, index) => (
                <Card key={index} className="border-l-4 border-l-blue-500">
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <div className="mt-1 bg-blue-100 p-2 rounded-full">
                        {solution.icon}
                      </div>
                      <div>
                        <h3 className="font-bold text-xl text-blue-800 mb-2">{solution.title}</h3>
                        <p className="text-gray-600">
                          {solution.description}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
          
          <div className="order-1 md:order-2">
            <div className="relative">
              <Card className="border-2 border-blue-200">
                <CardContent className="p-6">
                  <div className="flex justify-between items-center mb-6">
                    <h3 className="font-bold">AlertChain Technology</h3>
                    <Badge className="bg-green-100 text-green-800 hover:bg-green-200">Live Network</Badge>
                  </div>
                  
                  <div className="space-y-6">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                        <Shield className="h-5 w-5 text-blue-600" />
                      </div>
                      <div>
                        <p className="font-medium">Verified Authority Issuance</p>
                        <p className="text-sm text-gray-500">Cryptographic authentication</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                        <Lock className="h-5 w-5 text-blue-600" />
                      </div>
                      <div>
                        <p className="font-medium">Immutable Records</p>
                        <p className="text-sm text-gray-500">Tamper-proof blockchain storage</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                        <Network className="h-5 w-5 text-blue-600" />
                      </div>
                      <div>
                        <p className="font-medium">Distributed Network</p>
                        <p className="text-sm text-gray-500">No single point of failure</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <div className="absolute -bottom-5 -right-5 w-24 h-24 bg-yellow-400 rounded-full flex items-center justify-center shadow-lg">
                <div className="text-center">
                  <div className="text-xs font-bold">Blockchain</div>
                  <div className="text-lg font-bold">Powered</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Solution;