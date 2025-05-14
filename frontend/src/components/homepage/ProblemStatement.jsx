import React from 'react';
import { Card, CardContent } from "../../components/ui/card";
import { AlertTriangle } from "lucide-react";

const ProblemStatement = () => {
  const problems = [
    {
      title: "Centralized Vulnerability",
      description: "Current emergency alert systems rely on centralized infrastructure, creating single points of failure during disasters. When servers or communication networks go down, critical alerts cannot reach citizens."
    },
    {
      title: "Information Integrity Concerns",
      description: "Without a tamper-proof record system, emergency notifications can be altered, delayed, or even fabricated, leading to potential misinformation during crises when accuracy is most vital."
    },
    {
      title: "Lack of Transparency",
      description: "Citizens have no way to verify the source, timing, or authenticity of emergency alerts, creating an environment where trust in official communications can erode."
    }
  ];

  return (
    <section id="problem" className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-12">The Problem</h2>
        
        <div className="grid md:grid-cols-2 gap-10 items-center">
          <div className="relative">
            <div className="aspect-video rounded-lg overflow-hidden shadow-xl">
              <img 
                src="https://images.unsplash.com/photo-1541963463532-d68292c34b19?auto=format&fit=crop&w=1200&q=80" 
                alt="Emergency notification system failure" 
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-end p-6">
                <p className="text-white font-medium text-lg">Unreliable emergency alerts put communities at risk</p>
              </div>
            </div>
            <div className="absolute -bottom-4 -right-4 bg-black text-white p-3 rounded-full shadow-lg hidden md:flex items-center justify-center">
              <AlertTriangle size={28} />
            </div>
          </div>
          
          <div className="space-y-6">
            {problems.map((problem, index) => (
              <Card key={index} className="border-l-4 border-l-gray-900 shadow-sm">
                <CardContent className="p-6">
                  <h3 className="font-bold text-xl text-gray-900 mb-2">{problem.title}</h3>
                  <p className="text-gray-600">
                    {problem.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProblemStatement;