import React, { useState } from 'react';
import { TrendingUp, BookOpen, Star, Image as ImageIcon } from 'lucide-react';
import { motion } from 'framer-motion';
interface TrendingItem {
  id: string;
  title: string;
  source: string;
}
interface DeepDiveItem {
  id: string;
  title: string;
  readTime: string;
  image: string;
}
interface CurationItem {
  id: string;
  title: string;
  curator: string;
}
interface SidebarProps {
  trending: TrendingItem[];
  deepDives: DeepDiveItem[];
  curationPicks: CurationItem[];
}
import { useNavigate } from 'react-router-dom';
import { getFallbackImage, DEFAULT_IMAGE } from '../utils/imageHandler';

export function Sidebar({ trending, deepDives, curationPicks }: SidebarProps) {
  const navigate = useNavigate();
  const [brokenImages, setBrokenImages] = useState<Map<string, string>>(new Map());

  const handleImageError = (originalUrl: string, index: number) => {
    // Map broken image URL to its fallback
    setBrokenImages(prev => {
      const updated = new Map(prev);
      updated.set(originalUrl, getFallbackImage(index));
      return updated;
    });
  };

  const getImageUrl = (url: string | undefined, index: number = 0): string => {
    if (!url) return DEFAULT_IMAGE;
    // If this image URL is broken, use fallback
    if (brokenImages.has(url)) {
      return brokenImages.get(url) || DEFAULT_IMAGE;
    }
    // Otherwise use article's own image
    return url;
  };
  return (
    <div className="sticky top-24 flex flex-col gap-10">
      {/* Trending Now */}
      <section>
        <h3 className="text-xs font-bold text-secondary uppercase tracking-widest mb-5 flex items-center gap-2">
          <TrendingUp className="w-4 h-4 text-accent" /> Trending Now
        </h3>
        <div className="flex flex-col gap-5">
          {trending.map((item, i) =>
          <div
            key={item.id}
            onClick={() => navigate(`/story/${item.id}`)}
            className="flex gap-4 group cursor-pointer">
            
              <span className="text-2xl font-sora font-bold text-primary group-hover:text-accent transition-colors">
                0{i + 1}
              </span>
              <div className="flex flex-col pt-1">
                <h4 className="text-sm font-semibold leading-snug group-hover:text-primary text-primary/90 transition-colors">
                  {item.title}
                </h4>
                <span className="text-xs text-muted mt-1.5">{item.source}</span>
              </div>
            </div>
          )}
        </div>
      </section>

      <hr className="border-border" />

      {/* Weekly Deep Dives */}
      <section>
        <h3 className="text-xs font-bold text-secondary uppercase tracking-widest mb-5 flex items-center gap-2">
          <BookOpen className="w-4 h-4 text-accent" /> Weekly Deep Dives
        </h3>
        <div className="flex flex-col gap-2">
          {deepDives.map((item) =>
          <motion.div
            whileHover={{
              y: -2
            }}
            key={item.id}
            onClick={() => navigate(`/story/${item.id}`)}
            className="group flex gap-3 p-2 -mx-2 rounded-lg hover:bg-surface transition-colors cursor-pointer">
            
              <img
              src={getImageUrl(item.image)}
              alt={item.title}
              onError={() => handleImageError(item.image, deepDives.indexOf(item))}
              className="w-16 h-16 rounded-md object-cover shrink-0 bg-secondary/30"
              loading="lazy" />
            
              <div className="flex flex-col justify-center">
                <h4 className="text-sm font-semibold leading-snug group-hover:text-accent transition-colors line-clamp-2">
                  {item.title}
                </h4>
                <span className="text-xs text-muted mt-1.5">
                  {item.readTime}
                </span>
              </div>
            </motion.div>
          )}
        </div>
      </section>

      <hr className="border-border" />

      {/* Curation Picks */}
      <section>
        <h3 className="text-xs font-bold text-secondary uppercase tracking-widest mb-5 flex items-center gap-2">
          <Star className="w-4 h-4 text-accent" /> Curation Picks
        </h3>
        <div className="flex flex-col gap-4">
          {curationPicks.map((item) =>
          <div
            key={item.id}
            onClick={() => navigate('/curated')}
            className="group cursor-pointer">
            
              <h4 className="text-sm font-medium text-primary/90 group-hover:text-accent transition-colors line-clamp-1">
                {item.title}
              </h4>
              <span className="text-xs text-muted mt-1 block">
                via {item.curator}
              </span>
            </div>
          )}
        </div>
      </section>
    </div>);

}