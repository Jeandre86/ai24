import React, { useState, useEffect } from 'react';
import { Hero } from '../components/Hero';
import { Feed } from '../components/Feed';
import { Sidebar } from '../components/Sidebar';

export function Home() {
  const [heroStories, setHeroStories] = useState([]);
  const [feedStories, setFeedStories] = useState([]);
  const [trendingStories, setTrendingStories] = useState([]);
  const [deepDives, setDeepDives] = useState([]);
  const [curationPicks, setCurationPicks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStories = async () => {
      try {
        const [featuredRes, feedRes, exploreRes, picksRes] = await Promise.all([
          fetch('http://localhost:3001/api/featured'),
          fetch('http://localhost:3001/api/feed'),
          fetch('http://localhost:3001/api/explore?limit=12'),
          fetch('http://localhost:3001/api/picks')
        ]);

        const featured = await featuredRes.json();
        const feed = await feedRes.json();
        const explore = await exploreRes.json();
        const picks = await picksRes.json();

        setHeroStories(featured);
        setFeedStories(feed && Array.isArray(feed) ? feed : []);

        // Trending Now: Top 5 most recent articles from explore
        const trendingData = explore.articles?.slice(0, 5).map(article => ({
          id: article.id,
          title: article.title,
          source: article.source
        })) || [];
        setTrendingStories(trendingData);

        // Weekly Deep Dives: 4 articles with high read time
        const deepDiveData = explore.articles?.slice(5, 9).map(article => ({
          id: article.id,
          title: article.title,
          readTime: article.readTime,
          image: article.image
        })) || [];
        setDeepDives(deepDiveData);

        // Curation Picks: Use Mosaic Picks data
        const curationData = picks.slice(0, 3).map(article => ({
          id: article.id,
          title: article.title,
          curator: 'Mosaic Team'
        })) || [];
        setCurationPicks(curationData);
      } catch (error) {
        console.error('Error fetching stories:', error);
        setTrendingStories(trending);
        setDeepDives(deepDives);
        setCurationPicks(curationPicks);
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
          trending={trendingStories}
          deepDives={deepDives}
          curationPicks={curationPicks} />

      </aside>
    </main>);

}