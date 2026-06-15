import React from 'react';
import { motion } from 'framer-motion';
interface Story {
  id: string;
  title: string;
  category: string;
  source: string;
  time: string;
  image: string;
}
interface HeroProps {
  mainStory: Story;
  subStories: Story[];
}
import { useNavigate } from 'react-router-dom';
export function Hero({ mainStory, subStories }: HeroProps) {
  const navigate = useNavigate();
  return (
    <section className="grid grid-cols-1 lg:grid-cols-12 gap-4">
      {/* Main Story */}
      <motion.div
        whileHover={{
          y: -4
        }}
        onClick={() => navigate(`/story/${mainStory.id}`)}
        className="lg:col-span-8 group relative rounded-2xl border border-border bg-surface overflow-hidden transition-colors hover:border-accent hover:shadow-[0_0_20px_rgba(99,102,241,0.15)] cursor-pointer min-h-[400px] flex flex-col justify-end p-6 md:p-8">
        
        <div className="absolute inset-0">
          <img
            src={mainStory.image}
            alt={mainStory.title}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
          
          <div className="absolute inset-0 bg-gradient-to-t from-base via-base/60 to-transparent"></div>
        </div>
        <div className="relative z-10 max-w-2xl">
          <span className="inline-block px-3 py-1 bg-accent text-white text-xs font-bold rounded-full mb-4 uppercase tracking-wider">
            {mainStory.category}
          </span>
          <h1 className="text-3xl md:text-4xl font-bold font-sora leading-tight mb-4 group-hover:text-accent transition-colors">
            {mainStory.title}
          </h1>
          <div className="flex items-center gap-3 text-sm text-secondary">
            <span className="font-medium text-primary">{mainStory.source}</span>
            <span>&middot;</span>
            <span>{mainStory.time}</span>
          </div>
        </div>
      </motion.div>

      {/* Sub Stories */}
      <div className="lg:col-span-4 flex flex-col gap-4">
        {subStories.map((story, index) =>
        <motion.div
          key={story.id}
          initial={{
            opacity: 0,
            x: 20
          }}
          animate={{
            opacity: 1,
            x: 0
          }}
          transition={{
            delay: index * 0.1
          }}
          whileHover={{
            y: -4
          }}
          onClick={() => navigate(`/story/${story.id}`)}
          className="flex-1 group relative rounded-2xl border border-border bg-surface overflow-hidden transition-colors hover:border-accent hover:shadow-[0_0_20px_rgba(99,102,241,0.15)] cursor-pointer p-5 md:p-6 flex flex-col justify-end min-h-[200px]">
          
            <div className="absolute inset-0">
              <img
              src={story.image}
              alt={story.title}
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
            
              <div className="absolute inset-0 bg-gradient-to-t from-base via-base/80 to-base/20"></div>
            </div>
            <div className="relative z-10">
              <span className="text-accent text-xs font-bold uppercase tracking-wider mb-2 block">
                {story.category}
              </span>
              <h2 className="text-lg md:text-xl font-bold font-sora leading-snug mb-3 group-hover:text-accent transition-colors">
                {story.title}
              </h2>
              <div className="flex items-center gap-2 text-xs text-secondary">
                <span className="font-medium text-primary">{story.source}</span>
                <span>&middot;</span>
                <span>{story.time}</span>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </section>);

}