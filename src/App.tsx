import { useState } from "react";
import Navbar from "./components/layout/Navbar";
import Hero from "./components/home/Hero";
import Problem from "./components/home/Problem";
import Solution from "./components/home/Solution";
import HowItWorks from "./components/home/HowItWorks";
import Mindset from "./components/home/Mindset";
import Footer from "./components/layout/Footer";
import Signup from "./pages/Signup";
import "./App.css";

function App() {
  const [currentPage, setCurrentPage] = useState<"home" | "signup">("home");

  if (currentPage === "signup") {
    return <Signup onBack={() => setCurrentPage("home")} />;
  }

  return (
    <main className="min-h-screen bg-[#03070b] text-white font-sans overflow-x-hidden">
      <Navbar onGetStarted={() => setCurrentPage("signup")} />
      <Hero onGetStarted={() => setCurrentPage("signup")} />
      <Problem />
      <Solution />
      <HowItWorks />
      <Mindset onGetStarted={() => setCurrentPage("signup")} />
      <Footer />
    </main>
  );
}

export default App;
