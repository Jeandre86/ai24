import React from 'react';
import { Zap, Users, Globe } from 'lucide-react';

export function About() {
  return (
    <main className="flex-1 max-w-4xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Header */}
      <div className="mb-12">
        <h1 className="text-4xl font-bold mb-4 text-primary font-sora">About Mosaic</h1>
        <p className="text-lg text-secondary">
          Mosaic is a curated AI and technology news digest designed for builders, founders, and tech enthusiasts.
        </p>
      </div>

      {/* Mission */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold mb-4 text-primary font-sora">Our Mission</h2>
        <p className="text-secondary leading-relaxed mb-4">
          We believe that staying informed about AI and technology trends shouldn't be overwhelming. Mosaic filters through thousands of news sources to bring you the most relevant, impactful stories—curated daily for people who shape the future.
        </p>
        <p className="text-secondary leading-relaxed">
          Whether you're interested in AI models, business announcements, research breakthroughs, or hardware innovations, Mosaic delivers the insights that matter to your work and interests.
        </p>
      </section>

      {/* Features */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold mb-8 text-primary font-sora">What We Offer</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Feature 1 */}
          <div className="p-6 bg-surface rounded-lg border border-border">
            <Zap className="w-8 h-8 text-accent mb-3" />
            <h3 className="font-semibold text-primary mb-2">Daily Curation</h3>
            <p className="text-sm text-secondary">
              Fresh articles delivered every 24 hours from trusted sources across the AI and tech industry.
            </p>
          </div>

          {/* Feature 2 */}
          <div className="p-6 bg-surface rounded-lg border border-border">
            <Users className="w-8 h-8 text-accent mb-3" />
            <h3 className="font-semibold text-primary mb-2">Personalized Feed</h3>
            <p className="text-sm text-secondary">
              Customize which sources you follow, create shortcuts to boost content, and tailor your experience.
            </p>
          </div>

          {/* Feature 3 */}
          <div className="p-6 bg-surface rounded-lg border border-border">
            <Globe className="w-8 h-8 text-accent mb-3" />
            <h3 className="font-semibold text-primary mb-2">Global Coverage</h3>
            <p className="text-sm text-secondary">
              Aggregated from Hacker News, tech blogs, research papers, and industry announcements worldwide.
            </p>
          </div>
        </div>
      </section>

      {/* Content Categories */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold mb-4 text-primary font-sora">Content Categories</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {[
            'AI Models',
            'Hardware',
            'Business',
            'Research',
            'Generative Art',
            'Policy'
          ].map((category) => (
            <div key={category} className="p-3 bg-accent/10 border border-accent/20 rounded-lg">
              <p className="text-sm font-medium text-primary">{category}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Built By */}
      <section className="p-6 bg-surface rounded-lg border border-border">
        <h2 className="text-xl font-bold mb-3 text-primary font-sora">Built By Not Normal</h2>
        <p className="text-secondary">
          Mosaic is created by Not Normal, a team dedicated to building tools that empower the tech community.
          We're passionate about making information accessible and actionable for everyone building the future.
        </p>
      </section>
    </main>
  );
}
