import React from 'react';
import { motion } from 'framer-motion';
import { Star } from 'lucide-react';
import { curationPicks } from '../data';
export function Curated() {
  return (
    <main className="flex-1 max-w-4xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-10 flex items-center gap-4">
        <div className="w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center">
          <Star className="w-6 h-6 text-accent" />
        </div>
        <div>
          <h1 className="text-4xl font-sora font-bold">Curated Picks</h1>
          <p className="text-secondary mt-2">
            Hand-selected resources, tools, and repositories by our expert team.
          </p>
        </div>
      </div>

      <div className="flex flex-col gap-4">
        {curationPicks.map((pick, index) =>
        <motion.div
          key={pick.id}
          initial={{
            opacity: 0,
            x: -20
          }}
          animate={{
            opacity: 1,
            x: 0
          }}
          transition={{
            delay: index * 0.1
          }}
          whileHover={{
            x: 4
          }}
          className="group p-6 rounded-2xl border border-border bg-surface hover:border-accent transition-all cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-4">

            <div>
              <h2 className="text-xl font-sora font-semibold group-hover:text-accent transition-colors mb-2">
                {pick.title}
              </h2>
              <p className="text-sm text-secondary">
                Curated by{' '}
                <span className="text-primary font-medium">{pick.curator}</span>
              </p>
            </div>
            <a
              href={`#${pick.id}`}
              className="px-4 py-2 rounded-full bg-base border border-border text-sm font-medium hover:bg-accent hover:text-white hover:border-accent transition-colors shrink-0 text-center">
              View Resource
            </a>
          </motion.div>
        )}
      </div>
    </main>);

}