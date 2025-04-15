import Navbar from './components/layout/Navbar';
import HeroSection from './components/sections/HeroSection';
import AboutSection from './components/sections/AboutSection';
import ProcessSection from './components/sections/ProcessSection';
import EventsSection from './components/sections/EventsSection';
import ContactSection from './components/sections/ContactSection';
import DirectionsSection from './components/sections/DirectionsSection';
import FAQSection from './components/sections/FAQSection';
import Footer from './components/layout/Footer';

function App() {
  return (
    <div className="font-['Lato'] text-[#3E3C3B]">
      <Navbar />
      <main>
        <HeroSection />
        <AboutSection />
        <ProcessSection />
        <EventsSection />
        <ContactSection />
        <DirectionsSection />
        <FAQSection />
      </main>
      <Footer />
    </div>
  );
}

export default App
