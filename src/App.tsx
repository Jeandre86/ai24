import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Header } from './src/components/Header';
import { Footer } from './src/components/Footer';
import { Home } from './src/pages/Home';
import { Explore } from './src/pages/Explore';
import { Curated } from './src/pages/Curated';
import { Categories } from './src/pages/Categories';
import { StoryDetail } from './src/pages/StoryDetail';
import { Picks } from './src/pages/Picks';
import { Community } from './src/pages/Community';
import { Preferences } from './src/pages/Preferences';
import { Profile } from './src/pages/Profile';
import { Jobs } from './src/pages/Jobs';
import { Advertise } from './src/pages/Advertise';
import { About } from './src/pages/About';
import { Privacy } from './src/pages/Privacy';
import { Terms } from './src/pages/Terms';
import { useAuth } from './hooks/useAuth';
import { useThemeStore } from './store/themeStore';

export function App() {
  // Initialize auth listener
  useAuth();

  // Initialize theme from localStorage
  const { theme } = useThemeStore();

  useEffect(() => {
    // Set theme on mount and when it changes
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  return (
    <BrowserRouter>
      <div className="min-h-screen flex flex-col bg-base text-primary font-inter">
        <Header />

        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/explore" element={<Explore />} />
          <Route path="/curated" element={<Curated />} />
          <Route path="/categories" element={<Categories />} />
          <Route path="/picks" element={<Picks />} />
          <Route path="/community" element={<Community />} />
          <Route path="/preferences" element={<Preferences />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/jobs" element={<Jobs />} />
          <Route path="/advertise" element={<Advertise />} />
          <Route path="/about" element={<About />} />
          <Route path="/privacy" element={<Privacy />} />
          <Route path="/terms" element={<Terms />} />
          <Route path="/story/:id" element={<StoryDetail />} />
        </Routes>

        <Footer />
      </div>
    </BrowserRouter>
  );
}
