import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Cpu, Network, Database, Briefcase, Palette, Scale } from 'lucide-react';

const categoryIcons: { [key: string]: any } = {
  'AI Models': Network,
  'Hardware': Cpu,
  'Industry': Database,
  'Business': Briefcase,
  'Generative Art': Palette,
  'Policy': Scale,
  'Updates': Database
};

const categoryColors: { [key: string]: { color: string; bg: string } } = {
  'AI Models': { color: 'text-blue-400', bg: 'bg-blue-400/10' },
  'Hardware': { color: 'text-orange-400', bg: 'bg-orange-400/10' },
  'Industry': { color: 'text-green-400', bg: 'bg-green-400/10' },
  'Business': { color: 'text-purple-400', bg: 'bg-purple-400/10' },
  'Generative Art': { color: 'text-pink-400', bg: 'bg-pink-400/10' },
  'Policy': { color: 'text-yellow-400', bg: 'bg-yellow-400/10' },
  'Updates': { color: 'text-cyan-400', bg: 'bg-cyan-400/10' }
};

export function Categories() {
  const navigate = useNavigate();
  const [categories, setCategories] = useState<Array<{ category: string; count: number }>>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch('http://localhost:3001/api/categories');
        const data = await response.json();
        setCategories(data || []);
      } catch (error) {
        console.error('Error fetching categories:', error);
        setCategories([]);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  const handleCategoryClick = (categoryName: string) => {
    navigate(`/category/${encodeURIComponent(categoryName)}`);
  }
  if (loading) {
    return (
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center text-secondary">Loading categories...</div>
      </main>
    );
  }

  return (
    <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-10">
        <h1 className="text-4xl font-sora font-bold mb-4">Categories</h1>
        <p className="text-secondary text-lg">
          Browse news and updates by topic.
        </p>
      </div>

      {categories.length === 0 ? (
        <div className="text-center text-secondary">No categories found</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((cat, index) => {
            const Icon = categoryIcons[cat.category] || Database;
            const colors = categoryColors[cat.category] || { color: 'text-gray-400', bg: 'bg-gray-400/10' };

            return (
              <motion.div
                key={cat.category}
                initial={{
                  opacity: 0,
                  scale: 0.95
                }}
                animate={{
                  opacity: 1,
                  scale: 1
                }}
                transition={{
                  delay: index * 0.05
                }}
                whileHover={{
                  y: -4
                }}
                onClick={() => handleCategoryClick(cat.category)}
                className="group p-6 rounded-2xl border border-border bg-surface hover:border-accent transition-all cursor-pointer flex items-center gap-5">

                <div
                  className={`w-14 h-14 rounded-xl ${colors.bg} flex items-center justify-center shrink-0`}>

                  <Icon className={`w-7 h-7 ${colors.color}`} />
                </div>
                <div>
                  <h2 className="text-xl font-sora font-bold group-hover:text-accent transition-colors">
                    {cat.category}
                  </h2>
                  <p className="text-sm text-secondary mt-1">
                    {cat.count} article{cat.count !== 1 ? 's' : ''}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}
    </main>
  );
}