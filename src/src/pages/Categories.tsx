import React from 'react';
import { motion } from 'framer-motion';
import { Cpu, Network, Database, Briefcase, Palette, Scale } from 'lucide-react';
const categories = [
{
  name: 'AI Models',
  icon: Network,
  count: 142,
  color: 'text-blue-400',
  bg: 'bg-blue-400/10'
},
{
  name: 'Hardware',
  icon: Cpu,
  count: 89,
  color: 'text-orange-400',
  bg: 'bg-orange-400/10'
},
{
  name: 'Industry',
  icon: Database,
  count: 215,
  color: 'text-green-400',
  bg: 'bg-green-400/10'
},
{
  name: 'Business',
  icon: Briefcase,
  count: 176,
  color: 'text-purple-400',
  bg: 'bg-purple-400/10'
},
{
  name: 'Creative',
  icon: Palette,
  count: 94,
  color: 'text-pink-400',
  bg: 'bg-pink-400/10'
},
{
  name: 'Policy',
  icon: Scale,
  count: 63,
  color: 'text-yellow-400',
  bg: 'bg-yellow-400/10'
}];

export function Categories() {
  return (
    <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-10">
        <h1 className="text-4xl font-sora font-bold mb-4">Categories</h1>
        <p className="text-secondary text-lg">
          Browse news and updates by topic.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {categories.map((cat, index) =>
        <motion.div
          key={cat.name}
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
          className="group p-6 rounded-2xl border border-border bg-surface hover:border-accent transition-all cursor-pointer flex items-center gap-5">
          
            <div
            className={`w-14 h-14 rounded-xl ${cat.bg} flex items-center justify-center shrink-0`}>
            
              <cat.icon className={`w-7 h-7 ${cat.color}`} />
            </div>
            <div>
              <h2 className="text-xl font-sora font-bold group-hover:text-accent transition-colors">
                {cat.name}
              </h2>
              <p className="text-sm text-secondary mt-1">
                {cat.count} articles
              </p>
            </div>
          </motion.div>
        )}
      </div>
    </main>);

}