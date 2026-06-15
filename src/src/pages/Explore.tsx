import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

export function Explore() {
  const navigate = useNavigate();
  const [stories, setStories] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStories = async () => {
      try {
        setLoading(true);
        const response = await fetch(`http://localhost:3001/api/explore?page=${page}&limit=24`);
        const data = await response.json();
        setStories(data.articles || []);
        setTotalPages(data.pages || 1);
      } catch (error) {
        console.error('Error fetching stories:', error);
        setStories([]);
      } finally {
        setLoading(false);
      }
    };

    fetchStories();
  }, [page]);

  if (loading) {
    return (
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center text-secondary">Loading articles...</div>
      </main>
    );
  }

  return (
    <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-10">
        <h1 className="text-4xl font-sora font-bold mb-4">Explore</h1>
        <p className="text-secondary text-lg">
          Discover the latest breakthroughs and news across the AI landscape.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {stories.map((story, index) =>
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

      {/* Pagination */}
      <div className="mt-12 flex justify-center items-center gap-4">
        <button
          onClick={() => setPage(p => Math.max(1, p - 1))}
          disabled={page === 1}
          className="px-4 py-2 rounded-lg border border-border bg-surface text-primary hover:border-accent disabled:opacity-50 disabled:cursor-not-allowed transition-colors">
          Previous
        </button>
        <span className="text-secondary">Page {page} of {totalPages}</span>
        <button
          onClick={() => setPage(p => Math.min(totalPages, p + 1))}
          disabled={page === totalPages}
          className="px-4 py-2 rounded-lg border border-border bg-surface text-primary hover:border-accent disabled:opacity-50 disabled:cursor-not-allowed transition-colors">
          Next
        </button>
      </div>
    </main>);

}