import React from 'react';
import { Button } from "../../components/ui/button";
import { 
  Twitter, 
  Github, 
  Linkedin, 
  Mail, 
  Phone, 
  MapPin,
  Shield
} from "lucide-react";

const Footer = () => {
  const currentYear = new Date().getFullYear();
  
  const quickLinks = [
    { name: 'Home', href: '#home' },
    { name: 'Problem Statement', href: '#problem' },
    { name: 'Our Solution', href: '#solution' },
    { name: 'Features', href: '#features' },
    { name: 'Team', href: '#team' },
    { name: 'SDG Goals', href: '#sdg' }
  ];
  
  return (
    <footer className="bg-slate-900 text-slate-200 border-t border-slate-800">
      <div className="container mx-auto px-4 py-16">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {/* Company Info */}
          <div>
            <div className="flex items-center mb-4 justify-center md:justify-start">
              <Shield className="h-6 w-6 mr-2 text-slate-400" />
              <h3 className="text-2xl font-bold text-white">AlertChain</h3>
            </div>
            <p className="mb-6 text-slate-400 text-base leading-relaxed text-center md:text-left">
              A decentralized emergency alert system powered by blockchain technology, 
              providing secure and transparent communication during crises.
            </p>
            <div className="flex space-x-4 justify-center md:justify-start">
              <Button variant="outline" size="icon" className="rounded-full border-slate-700 text-slate-400 hover:text-white hover:bg-slate-800 hover:border-slate-600">
                <a href="https://twitter.com/" target="_blank" rel="noopener noreferrer" aria-label="Twitter">
                  <Twitter className="h-5 w-5" />
                </a>
              </Button>
              <Button variant="outline" size="icon" className="rounded-full border-slate-700 text-slate-400 hover:text-white hover:bg-slate-800 hover:border-slate-600">
                <a href="https://github.com/" target="_blank" rel="noopener noreferrer" aria-label="GitHub">
                  <Github className="h-5 w-5" />
                </a>
              </Button>
              <Button variant="outline" size="icon" className="rounded-full border-slate-700 text-slate-400 hover:text-white hover:bg-slate-800 hover:border-slate-600">
                <a href="https://linkedin.com/" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">
                  <Linkedin className="h-5 w-5" />
                </a>
              </Button>
            </div>
          </div>
          
          {/* Quick Links - Centered */}
          <div className="flex flex-col items-center justify-start">
            <h4 className="font-bold text-lg mb-5 text-white">Quick Links</h4>
            <ul className="space-y-3 text-center">
              {quickLinks.map((link, index) => (
                <li key={index}>
                  <a 
                    href={link.href}
                    className="text-slate-400 hover:text-white transition-colors inline-block px-4 py-1 hover:bg-slate-800 rounded-md"
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>
          
          {/* Contact Info */}
          <div className="flex flex-col items-center md:items-start">
            <h4 className="font-bold text-lg mb-5 text-white">Contact</h4>
            <ul className="space-y-4">
              <li className="flex items-start">
                <Mail className="h-5 w-5 mr-3 text-slate-400 mt-0.5" />
                <span className="text-slate-400">createalertsystem@gmail.com</span>
              </li>
              <li className="flex items-start">
                <Phone className="h-5 w-5 mr-3 text-slate-400 mt-0.5" />
                <span className="text-slate-400">9344248604</span>
              </li>
              <li className="flex items-start">
                <MapPin className="h-5 w-5 mr-3 text-slate-400 mt-0.5" />
                <span className="text-slate-400">Saveetha Engineering College, Saveetha Nagar</span>
              </li>
            </ul>
          </div>
        </div>
        
        {/* Footer Bottom */}
        <div className="border-t border-slate-800 mt-12 pt-8 flex flex-col items-center">
          <p className="text-slate-500 text-sm mb-6">© {currentYear} AlertChain. All rights reserved.</p>
          <div className="flex flex-wrap justify-center gap-6">
            <a href="/privacy-policy" className="text-slate-400 hover:text-white text-sm">Privacy Policy</a>
            <a href="/terms-of-service" className="text-slate-400 hover:text-white text-sm">Terms of Service</a>
            <a href="/cookie-policy" className="text-slate-400 hover:text-white text-sm">Cookie Policy</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;