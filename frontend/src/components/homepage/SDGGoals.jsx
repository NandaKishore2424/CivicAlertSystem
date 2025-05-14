import React from 'react';
import { Card, CardContent } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { ArrowRight } from "lucide-react";

const SDGGoals = () => {
  const sdgGoals = [
    {
      number: 3,
      title: "Good Health and Well-being",
      description: "Our system enables rapid health alerts during disease outbreaks, helping to contain spread and save lives.",
      color: "bg-red-500",
      hoverColor: "hover:bg-red-600",
      textColor: "text-red-600",
    },
    {
      number: 9,
      title: "Industry, Innovation and Infrastructure",
      description: "We're building resilient infrastructure using blockchain technology to strengthen emergency communication systems.",
      color: "bg-orange-500",
      hoverColor: "hover:bg-orange-600",
      textColor: "text-orange-600",
    },
    {
      number: 11,
      title: "Sustainable Cities and Communities",
      description: "Making cities more resilient by improving disaster preparedness and response capabilities.",
      color: "bg-yellow-500",
      hoverColor: "hover:bg-yellow-600",
      textColor: "text-yellow-600",
    },
    {
      number: 13,
      title: "Climate Action",
      description: "Supporting climate-related hazard warnings and disaster risk reduction strategies.",
      color: "bg-green-600",
      hoverColor: "hover:bg-green-700",
      textColor: "text-green-600",
    },
    {
      number: 16,
      title: "Peace, Justice and Strong Institutions",
      description: "Promoting transparent, accountable institutions through verified, tamper-proof emergency communications.",
      color: "bg-blue-700",
      hoverColor: "hover:bg-blue-800",
      textColor: "text-blue-600",
    },
    {
      number: 17,
      title: "Partnerships for the Goals",
      description: "Facilitating multi-stakeholder partnerships between government agencies and technology providers.",
      color: "bg-purple-600",
      hoverColor: "hover:bg-purple-700",
      textColor: "text-purple-600",
    },
  ];

  return (
    <section id="sdg" className="py-16 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4 text-foreground">Supporting UN Sustainable Development Goals</h2>
          <p className="text-muted-foreground max-w-3xl mx-auto">
            Our Web3 Emergency Alert System contributes to multiple UN Sustainable Development Goals, helping to create a safer and more resilient world.
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sdgGoals.map((goal, index) => (
            <Card key={index} className="overflow-hidden transition-shadow hover:shadow-md">
              <div className={`h-2 ${goal.color}`}></div>
              <CardContent className="p-6">
                <div className="flex items-center mb-4">
                  <div className={`w-12 h-12 ${goal.color} text-white rounded-full flex items-center justify-center font-bold mr-4 shadow-sm`}>
                    {goal.number}
                  </div>
                  <h3 className={`font-bold text-xl ${goal.textColor}`}>{goal.title}</h3>
                </div>
                <p className="text-muted-foreground">{goal.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
        
        <div className="mt-12 text-center">
          <Button 
            variant="link" 
            asChild 
            className="text-primary font-medium"
          >
            <a 
              href="https://sdgs.un.org/goals" 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-flex items-center"
            >
              <span>Learn more about UN SDGs</span>
              <ArrowRight className="ml-2 h-5 w-5" />
            </a>
          </Button>
        </div>
      </div>
    </section>
  );
};

export default SDGGoals;