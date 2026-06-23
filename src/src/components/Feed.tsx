import React, { Children, useState } from 'react';
import { motion } from 'framer-motion';
import { MoreVertical } from 'lucide-react';
import { DEFAULT_IMAGE, getFallbackImage } from '../utils/imageHandler';

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
export function Feed({ stories: initialStories }: FeedProps) {
  const navigate = useNavigate();
  const [stories, setStories] = useState(initialStories);
  const [hiddenIds, setHiddenIds] = useState(new Set<string>());
  const [brokenImages, setBrokenImages] = useState<Map<string, string>>(new Map());

  const handleImageError = (originalUrl: string, index: number) => {
    setBrokenImages(prev => {
      const updated = new Map(prev);
      updated.set(originalUrl, getFallbackImage(index));
      return updated;
    });
  };

  const getImageUrl = (url: string | undefined): string => {
    if (!url) return DEFAULT_IMAGE;
    if (brokenImages.has(url)) {
      return brokenImages.get(url) || DEFAULT_IMAGE;
    }
    return url;
  };

  const handleHide = async (e: React.MouseEvent, storyId: string) => {
    e.stopPropagation();
    try {
      await fetch(`http://localhost:3001/api/article/${storyId}/hide`, {
        method: 'PUT'
      });
      setHiddenIds(new Set(hiddenIds).add(storyId));
      setStories(stories.filter(s => s.id !== storyId));
    } catch (error) {
      console.error('Error hiding article:', error);
    }
  };
  return (
    <section className="mt-4">
      <div className="mb-6 border-b border-border pb-4">
        <h2 className="text-xl font-sora font-bold flex items-center gap-2 text-primary">
          <div className="w-2 h-2 rounded-full bg-accent"></div>
          Latest News
        </h2>
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
            x: 4
          }}
          onClick={() => navigate(`/story/${story.id}`)}
          className="group flex flex-col sm:flex-row gap-4 p-3 -mx-3 rounded-xl border border-transparent hover:border-border transition-all cursor-pointer relative">
          
            <div className="w-full sm:w-36 h-48 sm:h-28 shrink-0 overflow-hidden rounded-lg bg-secondary/30">
              <img
              src={getImageUrl(story.image)}
              alt={story.title}
              onError={() => handleImageError(story.image, stories.indexOf(story))}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              loading="lazy" />

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
            <button
              onClick={(e) => handleHide(e, story.id)}
              className="opacity-0 group-hover:opacity-100 transition-opacity absolute top-2 right-2 p-2 rounded hover:bg-secondary/30"
              title="Hide this article"
            >
              <MoreVertical className="w-4 h-4 text-secondary hover:text-primary" />
            </button>
          </motion.div>
        )}
      </motion.div>
    </section>);

}