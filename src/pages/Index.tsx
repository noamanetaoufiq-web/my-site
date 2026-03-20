import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Projects from "@/components/Projects";
import TechStack from "@/components/TechStack";
import ClientQuestionnaire from "@/components/ClientQuestionnaire";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <Hero />
      <Projects />
      <div id="tech">
        <TechStack />
      </div>
      <ClientQuestionnaire />
      <Footer />
    </div>
  );
};

export default Index;
