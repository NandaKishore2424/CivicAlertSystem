import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from "../../components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "../../components/ui/sheet";
import { Menu, LogIn, UserPlus } from "lucide-react";

const Navbar = () => {
  const navLinks = [
    { href: "#home", label: "Home" },
    { href: "#problem", label: "Problem" },
    { href: "#solution", label: "Solution" },
    { href: "#features", label: "Features" },
    { href: "#team", label: "Team" },
    { href: "#sdg", label: "SDG Goals" },
  ];

  return (
    <nav className="sticky top-0 z-50 w-full bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b border-border">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center">
          <h1 className="text-2xl font-bold text-foreground">CivicAlertSystem</h1>
        </div>
        
        {/* Desktop Navigation */}
        <div className="hidden md:flex space-x-6 items-center">
          {navLinks.map((link, index) => (
            <a 
              key={index}
              href={link.href} 
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              {link.label}
            </a>
          ))}
          
          {/* Auth Buttons - Desktop */}
          <div className="flex space-x-2 ml-4">
            <Button variant="outline" asChild size="sm">
              <Link to="/signin" className="flex items-center">
                <LogIn className="mr-1 h-4 w-4" />
                Sign In
              </Link>
            </Button>
            <Button asChild size="sm">
              <Link to="/signup" className="flex items-center">
                <UserPlus className="mr-1 h-4 w-4" />
                Sign Up
              </Link>
            </Button>
          </div>
        </div>
        
        {/* Mobile Navigation */}
        <div className="md:hidden">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" aria-label="Menu">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent className="w-[300px] sm:w-[400px]">
              <nav className="flex flex-col space-y-4 mt-8">
                {navLinks.map((link, index) => (
                  <a 
                    key={index}
                    href={link.href} 
                    className="text-muted-foreground hover:text-foreground transition-colors py-2 px-4 rounded-md hover:bg-accent"
                  >
                    {link.label}
                  </a>
                ))}
                
                {/* Auth Buttons - Mobile */}
                <div className="pt-4 mt-4 border-t border-border flex flex-col space-y-2">
                  <Button variant="outline" asChild>
                    <Link to="/signin" className="flex items-center justify-center">
                      <LogIn className="mr-2 h-4 w-4" />
                      Sign In
                    </Link>
                  </Button>
                  <Button asChild>
                    <Link to="/signup" className="flex items-center justify-center">
                      <UserPlus className="mr-2 h-4 w-4" />
                      Sign Up
                    </Link>
                  </Button>
                </div>
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;