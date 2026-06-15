import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { heroStories, feedStories } from '../data';
export function Explore() {
  const navigate = useNavigate();
  const allStories = [...heroStories, ...feedStories];
  return (
    <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-10">
        <h1 className="text-4xl font-sora font-bold mb-4">Explore</h1>
        <p className="text-secondary text-lg">
          Discover the latest breakthroughs and news across the AI landscape.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {allStories.map((story, index) =>
        <motion.div
          key={story.id}
          initial={{
            opacity: 0,
            y: 20
          }}
          animate={{
            opacity: 1,
            y: 0
          }}
          transition={{
            delay: index * 0.05
          }}
          whileHover={{
            y: -4
          }}
          onClick={() => navigate(`/story/${story.id}`)}
          className="group flex flex-col rounded-2xl border border-border bg-surface overflow-hidden transition-colors hover:border-accent cursor-pointer">
          
            <div className="h-48 overflow-hidden bg-base">
              <img
              src={story.image}
              alt={story.title}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
            
            </div>
            <div className="p-5 flex flex-col flex-1">
              <span className="text-accent text-xs font-bold uppercase tracking-wider mb-2">
                {story.category || 'News'}
              </span>
              <h2 className="text-lg font-sora font-bold leading-snug mb-3 group-hover:text-accent transition-colors">
                {story.title}
              </h2>
              <div className="mt-auto flex items-center gap-2 text-xs text-muted">
                <span className="font-medium text-primary">{story.source}</span>
                <span>&middot;</span>
                <span>{story.time}</span>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </main>);

}