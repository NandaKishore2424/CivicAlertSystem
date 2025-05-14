import React from 'react';
import { Card, CardContent } from "../../components/ui/card";
import { Linkedin } from "lucide-react";

const Team = () => {
  const teamMembers = [
    {
      name: "Meenakshi Sundaram",
      role: "Frontend Developer",
      bio: "Specialized in authentication, authorization, and responsive navigation systems for the CivicAlertSystem platform.",
      image: require("../../assets/images/sanjith.jpg"),
      initials: "MS",
      social: {
        linkedin: "https://linkedin.com/"
      }
    },
    {
      name: "Mahalakshmi",
      role: "Frontend Developer",
      bio: "Created intuitive dashboards and alert pages with emphasis on emergency information clarity and accessibility.",
      image: require("../../assets/images/maha.jpg"),
      initials: "ML",
      social: {
        linkedin: "https://linkedin.com/"
      }
    },
    {
      name: "Subashini",
      role: "Backend Developer",
      bio: "Developed robust API architectures and database systems supporting the alert management infrastructure.",
      image: require("../../assets/images/suba.jpg"),
      initials: "SB",
      social: {
        linkedin: "https://linkedin.com/"
      }
    },
    {
      name: "Nanda Kishore",
      role: "Blockchain Developer",
      bio: "Implemented smart contracts and blockchain integration for tamper-proof, decentralized emergency alert storage.",
      image: require("../../assets/images/nanda.jpg"),
      initials: "NK",
      social: {
        linkedin: "https://www.linkedin.com/in/nanda-kishore-7290551b8/"
      }
    }
  ];

  return (
    <section id="team" className="py-16 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4 text-foreground">Our Team</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Meet the talented individuals behind the CivicAlertSystem project.
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {teamMembers.map((member, index) => (
            <Card key={index} className="overflow-hidden">
              <div className="h-64 w-full relative">
                <img 
                  src={member.image} 
                  alt={member.name} 
                  className="w-full h-full object-cover object-center"
                />
              </div>
              <CardContent className="p-6">
                <h3 className="font-bold text-xl mb-1 text-foreground">{member.name}</h3>
                <p className="text-primary font-medium mb-3">{member.role}</p>
                <p className="text-muted-foreground mb-4 text-sm">{member.bio}</p>
                
                <div className="flex justify-center">
                  <a href={member.social.linkedin} target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-foreground transition-colors">
                    <Linkedin className="h-6 w-6" />
                  </a>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Team;