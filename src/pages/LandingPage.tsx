import Hero from "../components/Hero";
import ProblemSolution from "../components/ProblemSolution";
import HowItWorks from "../components/HowItWorks";
import Features from "../components/Features";
import Testimonials from "../components/Testimonials";
import Pricing from "../components/Pricing";
import FAQ from "../components/FAQ";
import FinalCTA from "../components/FinalCTA";
import Footer from "../components/Footer";
import Header from "../components/Header";

export default function LandingPage() {
  return (
    <main className="bg-white">
      <Header />
      {/* Hero Section with Dark Gradient Background */}
      <Hero />

      {/* Problem-Solution Section with Light Background */}
      <ProblemSolution />

      {/* How It Works Section */}
      <HowItWorks />

      {/* Features Section with Light Gray Background */}
      <Features />

      {/* Testimonials Section */}
      <Testimonials />

      {/* Pricing Section */}
      {/* <Pricing /> */}

      {/* FAQ Section */}
      <FAQ />

      {/* Final CTA Section with Dark Gradient Background */}
      <FinalCTA />

      {/* Footer */}
      <Footer />
    </main>
  );
}
