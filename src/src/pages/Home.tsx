import React, { useState, useEffect } from 'react';
import { Hero } from '../components/Hero';
import { Feed } from '../components/Feed';
import { Sidebar } from '../components/Sidebar';
import {
  trending,
  deepDives,
  curationPicks } from
'../data';

export function Home() {
  const [heroStories, setHeroStories] = useState([]);
  const [feedStories, setFeedStories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStories = async () => {
      try {
        const [featuredRes, feedRes] = await Promise.all([
          fetch('http://localhost:3001/api/featured'),
          fetch('http://localhost:3001/api/feed')
        ]);

        const featured = await featuredRes.json();
        const feed = await feedRes.json();

        setHeroStories(featured);
        setFeedStories(feed);
      } catch (error) {
        console.error('Error fetching stories:', error);
        // Fallback to mock data if API is not available
      } finally {
        setLoading(false);
      }
    };

    fetchStories();
  }, []);

  if (loading) {
    return (
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center text-secondary">Loading articles...</div>
      </main>
    );
  }

  return (
    <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col lg:flex-row gap-10">
      {/* Main Content Column */}
      <div className="flex-1 flex flex-col gap-10 min-w-0">
        {heroStories.length > 0 && <Hero mainStory={heroStories[0]} subStories={heroStories.slice(1)} />}
        {feedStories.length > 0 && <Feed stories={feedStories} />}
      </div>

      {/* Sidebar Column */}
      <aside className="w-full lg:w-[320px] shrink-0">
        <Sidebar
          trending={trending}
          deepDives={deepDives}
          curationPicks={curationPicks} />

      </aside>
    </main>);

}