import React from "react";
import Hero from "./hero";
import Navbar from "./navbar";


const LandingPage = () => {
  return (
    <div className=" flex flex-col h-screen">
      <Navbar />
      <Hero />
    </div>
  );
};

export default LandingPage;
