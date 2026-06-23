import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Check, Send } from 'lucide-react';
import { useAuthStore } from '../../store/authStore';
import { useNavigate } from 'react-router-dom';

interface AdPackage {
  id: string;
  name: string;
  price: string;
  period: string;
  impressions: string;
  clicks: string;
  features: string[];
  highlight?: boolean;
}

const AD_PACKAGES: AdPackage[] = [
  {
    id: '1',
    name: 'Starter',
    price: '$499',
    period: 'per month',
    impressions: '50k+',
    clicks: '~500',
    features: [
      'Feed placement',
      'Basic targeting',
      'Monthly reporting',
      'Email support',
      'CTR optimization'
    ]
  },
  {
    id: '2',
    name: 'Professional',
    price: '$1,499',
    period: 'per month',
    impressions: '250k+',
    clicks: '~2500',
    features: [
      'Feed + homepage placement',
      'Advanced targeting',
      'Weekly reporting',
      'Priority support',
      'A/B testing',
      'Audience insights'
    ],
    highlight: true
  },
  {
    id: '3',
    name: 'Enterprise',
    price: 'Custom',
    period: 'flexible',
    impressions: '1m+',
    clicks: '~10k+',
    features: [
      'All placements',
      'Custom campaigns',
      'Real-time analytics',
      'Dedicated manager',
      'API access',
      'Custom integrations',
      'Multi-currency'
    ]
  }
];

export function Advertise() {
  const { user, profile } = useAuthStore();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    companyName: '',
    website: '',
    message: '',
    package: '',
    email: profile?.email || ''
  });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  if (!user) {
    return (
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center space-y-4">
          <h1 className="text-3xl font-bold text-primary">Sign in to advertise</h1>
          <p className="text-secondary">
            Reach thousands of AI builders and tech enthusiasts.
          </p>
          <button
            onClick={() => navigate('/')}
            className="inline-block mt-4 px-6 py-2 bg-accent text-white rounded-lg hover:bg-accent/90 transition-colors">
            Back to Home
          </button>
        </div>
      </main>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // Simulate submission
    setTimeout(() => {
      setSubmitted(true);
      setLoading(false);
      setTimeout(() => {
        setFormData({ companyName: '', website: '', message: '', package: '', email: profile?.email || '' });
        setSubmitted(false);
      }, 3000);
    }, 1000);
  };

  return (
    <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Header */}
      <div className="mb-12 text-center">
        <h1 className="text-4xl font-bold mb-4 text-primary">Advertise on Mosaic</h1>
        <p className="text-secondary text-lg max-w-2xl mx-auto">
          Reach 10,000+ AI builders, founders, and tech enthusiasts daily. Get your product in front of the right audience.
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        {[
          { label: 'Monthly Readers', value: '10k+' },
          { label: 'Avg. Engagement', value: '4.2 min' },
          { label: 'Industries Covered', value: '50+' }
        ].map((stat, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            className="bg-surface border border-border rounded-xl p-6 text-center">
            <p className="text-3xl font-bold text-accent mb-1">{stat.value}</p>
            <p className="text-secondary">{stat.label}</p>
          </motion.div>
        ))}
      </div>

      {/* Pricing */}
      <div className="mb-12">
        <h2 className="text-2xl font-bold text-center mb-8 text-primary">
          Advertising Packages
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {AD_PACKAGES.map((pkg, idx) => (
            <motion.div
              key={pkg.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              className={`relative rounded-xl border p-8 transition-all ${
                pkg.highlight
                  ? 'border-accent bg-accent/5 dark:bg-accent/10 ring-2 ring-accent'
                  : 'border-border bg-surface'
              }`}>
              {pkg.highlight && (
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                  <span className="bg-accent text-white px-3 py-1 rounded-full text-xs font-semibold">
                    MOST POPULAR
                  </span>
                </div>
              )}

              <h3 className="text-xl font-bold text-primary mb-2">{pkg.name}</h3>
              <div className="mb-6">
                <span className="text-3xl font-bold text-accent">{pkg.price}</span>
                <span className="text-secondary text-sm ml-2">/{pkg.period}</span>
              </div>

              <div className="space-y-3 mb-6">
                <div>
                  <p className="text-sm text-secondary">Impressions</p>
                  <p className="font-semibold text-primary">{pkg.impressions}</p>
                </div>
                <div>
                  <p className="text-sm text-secondary">Est. Clicks</p>
                  <p className="font-semibold text-primary">{pkg.clicks}</p>
                </div>
              </div>

              <div className="space-y-3 mb-6">
                {pkg.features.map((feature, fidx) => (
                  <div key={fidx} className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-accent" />
                    <span className="text-sm text-secondary">{feature}</span>
                  </div>
                ))}
              </div>

              <button
                onClick={() => setFormData({ ...formData, package: pkg.name })}
                className={`w-full py-2 rounded-lg font-semibold transition-colors ${
                  pkg.highlight
                    ? 'bg-accent text-white hover:bg-accent/90'
                    : 'bg-base text-primary hover:bg-surface'
                }`}>
                Select Plan
              </button>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Form */}
      <div className="max-w-2xl mx-auto">
        <div className="bg-surface border border-border rounded-xl p-8">
          <h2 className="text-2xl font-bold mb-6 text-primary">Get Started</h2>

          {submitted ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-12">
              <div className="w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Check className="w-8 h-8 text-accent" />
              </div>
              <h3 className="text-lg font-bold text-primary mb-2">Request Submitted!</h3>
              <p className="text-secondary">
                We'll review your request and contact you within 24 hours.
              </p>
            </motion.div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-primary mb-2">
                  Company Name
                </label>
                <input
                  type="text"
                  required
                  value={formData.companyName}
                  onChange={(e) =>
                    setFormData({ ...formData, companyName: e.target.value })
                  }
                  className="w-full px-4 py-2 bg-base border border-border rounded-lg text-primary placeholder-secondary focus:outline-none focus:border-accent transition-colors"
                  placeholder="Your company name"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-primary mb-2">
                  Website
                </label>
                <input
                  type="url"
                  value={formData.website}
                  onChange={(e) =>
                    setFormData({ ...formData, website: e.target.value })
                  }
                  className="w-full px-4 py-2 bg-base border border-border rounded-lg text-primary placeholder-secondary focus:outline-none focus:border-accent transition-colors"
                  placeholder="https://yourcompany.com"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-primary mb-2">
                  Advertising Package
                </label>
                <select
                  value={formData.package}
                  onChange={(e) =>
                    setFormData({ ...formData, package: e.target.value })
                  }
                  className="w-full px-4 py-2 bg-base border border-border rounded-lg text-primary focus:outline-none focus:border-accent transition-colors">
                  <option value="">Select a package</option>
                  {AD_PACKAGES.map(pkg => (
                    <option key={pkg.id} value={pkg.name}>
                      {pkg.name} - {pkg.price}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-primary mb-2">
                  Message
                </label>
                <textarea
                  value={formData.message}
                  onChange={(e) =>
                    setFormData({ ...formData, message: e.target.value })
                  }
                  className="w-full px-4 py-2 bg-base border border-border rounded-lg text-primary placeholder-secondary focus:outline-none focus:border-accent transition-colors resize-none"
                  placeholder="Tell us about your product and target audience..."
                  rows={4}
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-accent hover:bg-accent/90 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold py-3 rounded-lg transition-colors flex items-center justify-center gap-2">
                {loading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Submitting...
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    Submit Advertising Request
                  </>
                )}
              </button>
            </form>
          )}
        </div>
      </div>

      {/* FAQ */}
      <div className="max-w-2xl mx-auto mt-12">
        <h2 className="text-2xl font-bold mb-6 text-primary">FAQ</h2>
        <div className="space-y-4">
          {[
            {
              q: 'How long does approval take?',
              a: 'Most requests are reviewed within 24 hours. We ensure all advertisers align with our community values.'
            },
            {
              q: 'Can I track performance?',
              a: 'Yes! All packages include detailed analytics dashboard with impressions, clicks, conversions, and ROI tracking.'
            },
            {
              q: 'What payment methods do you accept?',
              a: 'We accept all major credit cards, wire transfer, and annual billing discounts available.'
            },
            {
              q: 'Can I customize my campaign?',
              a: 'Absolutely! Enterprise customers get dedicated support for custom campaigns and integrations.'
            }
          ].map((faq, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              className="bg-surface border border-border rounded-xl p-4">
              <p className="font-semibold text-primary mb-2">{faq.q}</p>
              <p className="text-secondary text-sm">{faq.a}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </main>
  );
}
