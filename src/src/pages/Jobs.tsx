import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { MapPin, Briefcase, DollarSign, Clock, ExternalLink, Heart } from 'lucide-react';
import { useAuthStore } from '../../store/authStore';
import { useNavigate } from 'react-router-dom';

interface Job {
  id: string;
  title: string;
  company: string;
  location: string;
  type: 'Full-time' | 'Contract' | 'Freelance';
  salary?: string;
  level: 'Entry' | 'Mid' | 'Senior';
  tags: string[];
  description: string;
  url: string;
  postedAt: string;
}

const SAMPLE_JOBS: Job[] = [
  {
    id: '1',
    title: 'ML Engineer - LLM Infrastructure',
    company: 'OpenAI',
    location: 'San Francisco, CA',
    type: 'Full-time',
    salary: '$200k - $350k',
    level: 'Senior',
    tags: ['Python', 'LLM', 'Infrastructure', 'Distributed Systems'],
    description: 'Build and optimize large language model infrastructure at scale. Experience with training pipelines, inference optimization, and distributed computing required.',
    url: 'https://openai.com/careers',
    postedAt: '2 days ago'
  },
  {
    id: '2',
    title: 'AI Research Scientist',
    company: 'Google DeepMind',
    location: 'London, UK',
    type: 'Full-time',
    salary: '$180k - $320k',
    level: 'Senior',
    tags: ['Research', 'Deep Learning', 'NLP', 'Computer Vision'],
    description: 'Conduct cutting-edge AI research in natural language processing and multimodal models. Publish papers and contribute to open-source projects.',
    url: 'https://deepmind.com/careers',
    postedAt: '3 days ago'
  },
  {
    id: '3',
    title: 'Prompt Engineer',
    company: 'Anthropic',
    location: 'San Francisco, CA',
    type: 'Full-time',
    salary: '$150k - $250k',
    level: 'Mid',
    tags: ['Prompting', 'LLM', 'Content', 'Writing'],
    description: 'Craft and optimize prompts for Claude to improve model capabilities. Work closely with ML engineers and product teams.',
    url: 'https://anthropic.com/careers',
    postedAt: '1 day ago'
  },
  {
    id: '4',
    title: 'AI/ML Product Manager',
    company: 'Microsoft',
    location: 'Seattle, WA',
    type: 'Full-time',
    salary: '$180k - $300k',
    level: 'Mid',
    tags: ['Product', 'AI', 'Strategy', 'Leadership'],
    description: 'Lead AI product initiatives for Copilot and Azure AI. Define strategy, drive adoption, and measure impact across enterprise customers.',
    url: 'https://microsoft.com/careers',
    postedAt: '5 days ago'
  },
  {
    id: '5',
    title: 'Computer Vision Engineer',
    company: 'Tesla',
    location: 'Palo Alto, CA',
    type: 'Full-time',
    salary: '$170k - $280k',
    level: 'Mid',
    tags: ['Computer Vision', 'Python', 'Real-time Systems', 'C++'],
    description: 'Build computer vision systems for autonomous vehicles. Work on detection, segmentation, and real-time inference optimization.',
    url: 'https://tesla.com/careers',
    postedAt: '1 week ago'
  },
  {
    id: '6',
    title: 'AI Safety Researcher',
    company: 'Center for AI Safety',
    location: 'Remote',
    type: 'Full-time',
    salary: '$120k - $200k',
    level: 'Entry',
    tags: ['AI Safety', 'Alignment', 'Research', 'Policy'],
    description: 'Research AI safety and alignment. Contribute to reducing risks from advanced AI systems through technical and policy research.',
    url: 'https://aisafety.org',
    postedAt: '3 days ago'
  }
];

export function Jobs() {
  const { user } = useAuthStore();
  const navigate = useNavigate();
  const [selectedLevel, setSelectedLevel] = useState<string | null>(null);
  const [selectedType, setSelectedType] = useState<string | null>(null);
  const [savedJobs, setSavedJobs] = useState<string[]>([]);

  if (!user) {
    return (
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center space-y-4">
          <h1 className="text-3xl font-bold text-primary">Sign in to view AI Jobs</h1>
          <p className="text-secondary">Access exclusive job listings in AI, ML, and emerging tech.</p>
          <button
            onClick={() => navigate('/')}
            className="inline-block mt-4 px-6 py-2 bg-accent text-white rounded-lg hover:bg-accent/90 transition-colors">
            Back to Home
          </button>
        </div>
      </main>
    );
  }

  const filteredJobs = SAMPLE_JOBS.filter(job => {
    if (selectedLevel && job.level !== selectedLevel) return false;
    if (selectedType && job.type !== selectedType) return false;
    return true;
  });

  const toggleSave = (jobId: string) => {
    setSavedJobs(prev =>
      prev.includes(jobId) ? prev.filter(id => id !== jobId) : [...prev, jobId]
    );
  };

  return (
    <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Header */}
      <div className="mb-12">
        <h1 className="text-4xl font-bold mb-4 text-primary">AI Jobs</h1>
        <p className="text-secondary text-lg">
          Discover the latest opportunities in AI, Machine Learning, and emerging tech.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Filters Sidebar */}
        <aside className="lg:col-span-1 space-y-6">
          <div className="bg-surface border border-border rounded-xl p-6">
            <h3 className="font-semibold text-primary mb-4">Filters</h3>

            {/* Level Filter */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-secondary mb-2">
                Experience Level
              </label>
              <div className="space-y-2">
                {['Entry', 'Mid', 'Senior'].map(level => (
                  <button
                    key={level}
                    onClick={() => setSelectedLevel(selectedLevel === level ? null : level)}
                    className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                      selectedLevel === level
                        ? 'bg-accent text-white'
                        : 'bg-base text-secondary hover:bg-surface'
                    }`}>
                    {level}
                  </button>
                ))}
              </div>
            </div>

            {/* Type Filter */}
            <div>
              <label className="block text-sm font-medium text-secondary mb-2">
                Job Type
              </label>
              <div className="space-y-2">
                {['Full-time', 'Contract', 'Freelance'].map(type => (
                  <button
                    key={type}
                    onClick={() => setSelectedType(selectedType === type ? null : type)}
                    className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                      selectedType === type
                        ? 'bg-accent text-white'
                        : 'bg-base text-secondary hover:bg-surface'
                    }`}>
                    {type}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Saved Jobs Card */}
          <div className="bg-surface border border-border rounded-xl p-6">
            <p className="text-sm font-semibold text-primary">
              Saved: {savedJobs.length}
            </p>
            <p className="text-xs text-secondary mt-1">jobs</p>
          </div>
        </aside>

        {/* Jobs List */}
        <div className="lg:col-span-3 space-y-4">
          {filteredJobs.length > 0 ? (
            filteredJobs.map((job, index) => (
              <motion.div
                key={job.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="bg-surface border border-border rounded-xl p-6 hover:border-accent transition-colors">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-primary mb-1">
                      {job.title}
                    </h3>
                    <p className="text-accent font-semibold text-sm">{job.company}</p>
                  </div>
                  <button
                    onClick={() => toggleSave(job.id)}
                    className={`p-2 rounded-lg transition-colors ${
                      savedJobs.includes(job.id)
                        ? 'bg-accent/10 text-accent'
                        : 'bg-base text-secondary hover:text-accent'
                    }`}>
                    <Heart
                      className="w-5 h-5"
                      fill={savedJobs.includes(job.id) ? 'currentColor' : 'none'}
                    />
                  </button>
                </div>

                <p className="text-secondary mb-4 line-clamp-2">
                  {job.description}
                </p>

                {/* Meta Info */}
                <div className="flex flex-wrap gap-4 mb-4 text-sm text-secondary">
                  <div className="flex items-center gap-1">
                    <MapPin className="w-4 h-4" />
                    {job.location}
                  </div>
                  <div className="flex items-center gap-1">
                    <Briefcase className="w-4 h-4" />
                    {job.type}
                  </div>
                  {job.salary && (
                    <div className="flex items-center gap-1">
                      <DollarSign className="w-4 h-4" />
                      {job.salary}
                    </div>
                  )}
                  <div className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    {job.postedAt}
                  </div>
                </div>

                {/* Tags */}
                <div className="flex flex-wrap gap-2 mb-4">
                  {job.tags.map(tag => (
                    <span
                      key={tag}
                      className="text-xs bg-accent/10 text-accent px-2 py-1 rounded-full">
                      {tag}
                    </span>
                  ))}
                </div>

                {/* CTA */}
                <a
                  href={job.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-accent hover:text-accent/80 transition-colors font-semibold text-sm">
                  View Job
                  <ExternalLink className="w-4 h-4" />
                </a>
              </motion.div>
            ))
          ) : (
            <div className="text-center py-12">
              <p className="text-secondary">No jobs match your filters.</p>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
