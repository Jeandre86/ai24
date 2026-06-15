import React, { Children } from 'react';
import { motion } from 'framer-motion';
interface FeedStory {
  id: string;
  title: string;
  dek: string;
  category: string;
  source: string;
  readTime: string;
  time: string;
  image: string;
}
interface FeedProps {
  stories: FeedStory[];
}
const container = {
  hidden: {
    opacity: 0
  },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};
const item = {
  hidden: {
    opacity: 0,
    y: 20
  },
  show: {
    opacity: 1,
    y: 0
  }
};
import { useNavigate } from 'react-router-dom';
export function Feed({ stories }: FeedProps) {
  const navigate = useNavigate();
  return (
    <section className="mt-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 border-b border-border pb-4 gap-4">
        <h2 className="text-xl font-sora font-bold flex items-center gap-2" style={{ color: '#f5f5f5' }}>
          <div className="w-2 h-2 rounded-full bg-accent"></div>
          Latest News
        </h2>
        <div className="flex items-center gap-4 text-sm text-secondary overflow-x-auto pb-2 sm:pb-0 hide-scrollbar">
          <button className="text-primary font-medium whitespace-nowrap">
            All Stories
          </button>
          <button className="hover:text-primary transition-colors whitespace-nowrap">
            AI Models
          </button>
          <button className="hover:text-primary transition-colors whitespace-nowrap">
            Industry
          </button>
          <button className="hover:text-primary transition-colors whitespace-nowrap">
            Hardware
          </button>
        </div>
      </div>

      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="flex flex-col gap-2">
        
        {stories.map((story) =>
        <motion.div
          key={story.id}
          variants={item}
          whileHover={{
            x: 4,
            backgroundColor: '#1a1a1a'
          }}
          onClick={() => navigate(`/story/${story.id}`)}
          className="group flex flex-col sm:flex-row gap-4 p-3 -mx-3 rounded-xl border border-transparent hover:border-border transition-all cursor-pointer">
          
            <div className="w-full sm:w-36 h-48 sm:h-28 shrink-0 overflow-hidden rounded-lg bg-surface">
              <img
              src={story.image}
              alt={story.title}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
            
            </div>
            <div className="flex flex-col justify-center flex-1 py-1">
              <div className="flex items-center gap-2 mb-1.5">
                <span className="text-accent text-[10px] font-bold uppercase tracking-wider">
                  {story.category}
                </span>
              </div>
              <h3 className="text-base md:text-lg font-sora font-semibold leading-tight mb-1.5 text-primary group-hover:text-accent transition-colors">
                {story.title}
              </h3>
              <p className="text-secondary text-sm line-clamp-1 mb-2">
                {story.dek}
              </p>
              <div className="flex items-center gap-2 text-muted text-xs mt-auto">
                <span className="font-medium text-primary">{story.source}</span>
                <span>&middot;</span>
                <span>{story.readTime}</span>
                <span>&middot;</span>
                <span>{story.time}</span>
              </div>
            </div>
          </motion.div>
        )}
      </motion.div>
    </section>);

}