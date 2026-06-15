import React from 'react';
import { Hero } from '../components/Hero';
import { Feed } from '../components/Feed';
import { Sidebar } from '../components/Sidebar';
import {
  heroStories,
  feedStories,
  trending,
  deepDives,
  curationPicks } from
'../data';
export function Home() {
  return (
    <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col lg:flex-row gap-10">
      {/* Main Content Column */}
      <div className="flex-1 flex flex-col gap-10 min-w-0">
        <Hero mainStory={heroStories[0]} subStories={heroStories.slice(1)} />
        <Feed stories={feedStories} />
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