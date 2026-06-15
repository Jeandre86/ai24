import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Header } from './src/components/Header';
import { Footer } from './src/components/Footer';
import { Home } from './src/pages/Home';
import { Explore } from './src/pages/Explore';
import { Curated } from './src/pages/Curated';
import { Categories } from './src/pages/Categories';
import { StoryDetail } from './src/pages/StoryDetail';
export function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen flex flex-col bg-base text-primary font-inter">
        <Header />

        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/explore" element={<Explore />} />
          <Route path="/curated" element={<Curated />} />
          <Route path="/categories" element={<Categories />} />
          <Route path="/story/:id" element={<StoryDetail />} />
        </Routes>

        <Footer />
      </div>
    </BrowserRouter>);

}