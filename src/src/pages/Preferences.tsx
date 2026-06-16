import React, { useState, useEffect } from 'react';
import { Settings, Toggle2 } from 'lucide-react';

interface Source {
  id: string;
  name: string;
  description: string;
  icon_url?: string;
  enabled: boolean;
  shortcut_enabled: boolean;
  boost_level: number;
}

export function Preferences() {
  const [sources, setSources] = useState<Source[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchPreferences();
  }, []);

  const fetchPreferences = async () => {
    try {
      const res = await fetch('http://localhost:3001/api/preferences');
      const data = await res.json();
      setSources(data);
    } catch (error) {
      console.error('Error fetching preferences:', error);
    } finally {
      setLoading(false);
    }
  };

  const updatePreference = async (sourceId: string, updates: Partial<Source>) => {
    setSaving(true);
    try {
      const source = sources.find(s => s.id === sourceId);
      if (!source) return;

      const res = await fetch(`http://localhost:3001/api/preferences/${sourceId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          enabled: updates.enabled !== undefined ? updates.enabled : source.enabled,
          shortcut_enabled: updates.shortcut_enabled !== undefined ? updates.shortcut_enabled : source.shortcut_enabled,
          boost_level: updates.boost_level !== undefined ? updates.boost_level : source.boost_level
        })
      });

      if (res.ok) {
        setSources(sources.map(s =>
          s.id === sourceId
            ? { ...s, ...updates }
            : s
        ));
      }
    } catch (error) {
      console.error('Error updating preference:', error);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center text-secondary">Loading preferences...</div>
      </main>
    );
  }

  return (
    <main className="flex-1 max-w-4xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2 flex items-center gap-2">
          <Settings className="w-8 h-8 text-accent" />
          Customize Your Feed
        </h1>
        <p className="text-secondary">
          Choose which news sources you want to see. Enable shortcuts to boost that feed, or hide content you don't want.
        </p>
      </div>

      <div className="space-y-4">
        {sources.map((source) => (
          <div
            key={source.id}
            className="bg-card p-6 rounded-lg border border-secondary/20 hover:border-accent/50 transition-colors"
          >
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="font-bold text-lg text-primary">{source.name}</h3>
                <p className="text-sm text-secondary">{source.description}</p>
              </div>
              <div className="flex items-center gap-2">
                {source.enabled && (
                  <span className="text-xs font-bold bg-accent/20 text-accent px-2 py-1 rounded">
                    Active
                  </span>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Enable/Disable Toggle */}
              <div className="flex items-center justify-between p-3 bg-secondary/10 rounded">
                <label className="flex items-center gap-2 text-sm">
                  <span>Show in Feed</span>
                </label>
                <button
                  onClick={() => updatePreference(source.id, { enabled: !source.enabled })}
                  disabled={saving}
                  className={`relative w-10 h-6 rounded-full transition-colors ${
                    source.enabled ? 'bg-accent' : 'bg-secondary/30'
                  }`}
                >
                  <div
                    className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform ${
                      source.enabled ? 'translate-x-5' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>

              {/* Shortcut Toggle */}
              <div className="flex items-center justify-between p-3 bg-secondary/10 rounded">
                <label className="flex items-center gap-2 text-sm">
                  <span>Shortcut</span>
                  <span className="text-xs text-secondary">(Boost)</span>
                </label>
                <button
                  onClick={() => updatePreference(source.id, { shortcut_enabled: !source.shortcut_enabled })}
                  disabled={saving || !source.enabled}
                  className={`relative w-10 h-6 rounded-full transition-colors ${
                    source.shortcut_enabled && source.enabled
                      ? 'bg-accent'
                      : 'bg-secondary/30'
                  } ${!source.enabled ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  <div
                    className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform ${
                      source.shortcut_enabled && source.enabled ? 'translate-x-5' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>

              {/* Boost Level */}
              <div className="flex items-center justify-between p-3 bg-secondary/10 rounded">
                <label className="flex items-center gap-2 text-sm">
                  <span>Boost Level</span>
                </label>
                <select
                  value={source.boost_level}
                  onChange={(e) => updatePreference(source.id, { boost_level: parseInt(e.target.value) })}
                  disabled={saving || !source.shortcut_enabled}
                  className="bg-secondary/30 rounded px-2 py-1 text-sm text-primary outline-none focus:ring-2 focus:ring-accent disabled:opacity-50"
                >
                  <option value="0">None</option>
                  <option value="1">Low</option>
                  <option value="2">Medium</option>
                  <option value="3">High</option>
                </select>
              </div>
            </div>

            <p className="text-xs text-secondary mt-3">
              {source.enabled
                ? source.shortcut_enabled
                  ? '✓ This source is boosted and will appear more frequently in your feed.'
                  : '✓ This source is enabled and appears in your feed normally.'
                : '✗ This source is hidden from your feed.'}
            </p>
          </div>
        ))}
      </div>

      <div className="mt-12 p-6 bg-accent/10 rounded-lg border border-accent/30">
        <h3 className="font-bold text-lg mb-2">💡 How it works</h3>
        <ul className="text-sm text-secondary space-y-2">
          <li>• <strong>Show in Feed:</strong> Toggle sources on/off to customize your content.</li>
          <li>• <strong>Shortcut:</strong> Enable a shortcut to boost that source—we give it a small priority bump on your Highlights feed.</li>
          <li>• <strong>Boost Level:</strong> Control how much that source is boosted (Low, Medium, or High).</li>
          <li>• You can always hide individual articles by clicking the • icon while hovering.</li>
        </ul>
      </div>
    </main>
  );
}
