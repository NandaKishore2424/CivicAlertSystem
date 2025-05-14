import React from 'react';
import Navbar from './Navbar';
import HeroSection from './HeroSection';
import ProblemStatement from './ProblemStatement';
import Solution from './Solution';
import Features from './Features';
import Team from './Team';
import SDGGoals from './SDGGoals';
import Footer from './Footer';

const LandingPage = () => {
  return (
    <div className="min-h-screen">
      <Navbar />
      <HeroSection />
      <ProblemStatement />
      <Solution />
      <Features />
      <Team />
      <SDGGoals />
      <Footer />
    </div>
  );
};

export default LandingPage;