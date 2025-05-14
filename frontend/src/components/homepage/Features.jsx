import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { 
  Shield, 
  Lock, 
  MapPin, 
  Monitor, 
  Building, 
  ArrowLeftRight 
} from "lucide-react";

const Features = () => {
  const featuresList = [
    {
      title: "Verified Issuers",
      description: "Only cryptographically verified government agencies and authorities can issue alerts through our blockchain-based authentication system.",
      icon: <Shield className="h-12 w-12 text-primary" />,
    },
    {
      title: "Immutable Records",
      description: "All alerts are permanently recorded on the blockchain, creating a tamper-proof audit trail that can be verified by anyone.",
      icon: <Lock className="h-12 w-12 text-primary" />,
    },
    {
      title: "Geo-Tagging & Timing",
      description: "Alerts include precise location data and time windows, ensuring citizens only receive relevant notifications for their area.",
      icon: <MapPin className="h-12 w-12 text-primary" />,
    },
    {
      title: "Citizen Dashboards",
      description: "User-friendly interfaces allow citizens to view alerts, verify their authenticity, and receive real-time notifications.",
      icon: <Monitor className="h-12 w-12 text-primary" />,
    },
    {
      title: "Government Tools",
      description: "Specialized interfaces for authorities to compose, approve, and manage alerts with multi-signature security for critical communications.",
      icon: <Building className="h-12 w-12 text-primary" />,
    },
    {
      title: "Interoperability",
      description: "Seamless integration with existing emergency systems, IoT sensors, and communication channels for comprehensive alert coverage.",
      icon: <ArrowLeftRight className="h-12 w-12 text-primary" />,
    },
  ];

  return (
    <section id="features" className="py-16 bg-background/50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4 text-foreground">Key Features</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Our decentralized alert system combines blockchain security with user-friendly interfaces
            to provide a reliable emergency communication platform.
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {featuresList.map((feature, index) => (
            <Card key={index} className="border shadow-sm hover:shadow-md transition-shadow">
              <CardHeader className="pb-2">
                <div className="mb-4">{feature.icon}</div>
                <CardTitle>{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;