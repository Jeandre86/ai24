import React, { useState, useEffect } from 'react';
import { Star } from 'lucide-react';
import { Link } from 'react-router-dom';
import { DEFAULT_IMAGE, getFallbackImage } from '../utils/imageHandler';

interface Article {
  id: string;
  title: string;
  dek: string;
  category: string;
  source: string;
  readTime: string;
  time: string;
  image: string;
  url: string;
  published_at: string;
  is_pick: boolean;
}

export function Picks() {
  const [picks, setPicks] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
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

  useEffect(() => {
    const fetchPicks = async () => {
      try {
        const res = await fetch('http://localhost:3001/api/picks');
        const data = await res.json();
        setPicks(data);
      } catch (error) {
        console.error('Error fetching picks:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPicks();
  }, []);

  if (loading) {
    return (
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center text-secondary">Loading Mosaic Picks...</div>
      </main>
    );
  }

  return (
    <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2 flex items-center gap-2">
          <Star className="w-8 h-8 text-accent" fill="currentColor" />
          Mosaic Picks
        </h1>
        <p className="text-secondary">Our curated selection of the most impactful AI & tech stories</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {picks.map((article, index) => (
          <Link key={article.id} to={`/story/${article.id}`}>
            <article className="bg-card rounded-lg overflow-hidden hover:shadow-lg transition-shadow cursor-pointer h-full">
              <div className="aspect-video bg-secondary/30 relative overflow-hidden">
                <img
                  src={getImageUrl(article.image)}
                  alt={article.title}
                  onError={() => handleImageError(article.image, index)}
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
                <div className="absolute top-3 right-3 bg-accent text-white px-2 py-1 rounded text-xs font-bold flex items-center gap-1">
                  <Star className="w-3 h-3" fill="currentColor" />
                  Pick
                </div>
              </div>
              <div className="p-4">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xs font-medium text-accent bg-accent/10 px-2 py-1 rounded">
                    {article.category}
                  </span>
                  <span className="text-xs text-secondary">{article.time}</span>
                </div>
                <h3 className="font-bold line-clamp-2 mb-2 hover:text-accent">
                  {article.title}
                </h3>
                <p className="text-sm text-secondary line-clamp-2 mb-3">
                  {article.dek}
                </p>
                <div className="flex justify-between items-center text-xs text-secondary">
                  <span>{article.source}</span>
                  <span>{article.readTime}</span>
                </div>
              </div>
            </article>
          </Link>
        ))}
      </div>

      {picks.length === 0 && (
        <div className="text-center py-12 text-secondary">
          No picks available yet. Check back soon!
        </div>
      )}
    </main>
  );
}
