import React, { useState } from 'react';
import { User, Mail, Save, LogOut } from 'lucide-react';
import { useAuthStore } from '../../store/authStore';
import { useAuth } from '../../hooks/useAuth';
import { useNavigate } from 'react-router-dom';

const AVATARS = [
  'https://ui-avatars.com/api/?name=User&background=6366f1&color=fff',
  'https://ui-avatars.com/api/?name=User&background=ec4899&color=fff',
  'https://ui-avatars.com/api/?name=User&background=f59e0b&color=fff',
  'https://ui-avatars.com/api/?name=User&background=10b981&color=fff',
  'https://ui-avatars.com/api/?name=User&background=06b6d4&color=fff',
  'https://ui-avatars.com/api/?name=User&background=8b5cf6&color=fff',
  'https://ui-avatars.com/api/?name=User&background=ef4444&color=fff',
  'https://ui-avatars.com/api/?name=User&background=f97316&color=fff',
];

export function Profile() {
  const navigate = useNavigate();
  const { user, profile, setProfile } = useAuthStore();
  const { logout } = useAuth();
  const [displayName, setDisplayName] = useState(profile?.displayName || '');
  const [selectedAvatar, setSelectedAvatar] = useState(profile?.photoURL || AVATARS[0]);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  if (!user) {
    return (
      <main className="flex-1 max-w-4xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center text-secondary py-12">
          <p className="mb-4">Please sign in to access your profile.</p>
        </div>
      </main>
    );
  }

  const handleSaveProfile = async () => {
    if (!displayName.trim()) {
      setMessage('Please enter a display name');
      return;
    }

    setSaving(true);
    setMessage('');

    try {
      const profileData = {
        uid: user.uid,
        email: user.email || '',
        displayName: displayName.trim(),
        photoURL: selectedAvatar,
        createdAt: profile?.createdAt || new Date().toISOString(),
      };

      // Update Zustand store
      setProfile(profileData);

      // Save to localStorage as backup
      localStorage.setItem(`mosaic_profile_${user.uid}`, JSON.stringify(profileData));

      setMessage('✓ Profile saved successfully!');
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      console.error('Error saving profile:', error);
      setMessage('Failed to save profile');
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  return (
    <main className="flex-1 max-w-4xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2 flex items-center gap-2">
          <User className="w-8 h-8 text-accent" />
          My Profile
        </h1>
        <p className="text-secondary">
          Manage your profile and account settings
        </p>
      </div>

      {/* Message */}
      {message && (
        <div className={`mb-6 p-3 rounded-lg text-sm font-medium ${
          message.includes('✓')
            ? 'bg-green-500/10 border border-green-500/30 text-green-500'
            : 'bg-red-500/10 border border-red-500/30 text-red-500'
        }`}>
          {message}
        </div>
      )}

      {/* Profile Card */}
      <div className="bg-surface border border-border rounded-2xl p-8 mb-8">
        {/* Current Avatar Display */}
        <div className="mb-8">
          <p className="text-sm font-medium text-secondary mb-4">Current Avatar</p>
          <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-accent">
            <img src={selectedAvatar} alt="Avatar" className="w-full h-full object-cover" />
          </div>
        </div>

        {/* Display Name */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-secondary mb-2">
            Display Name
          </label>
          <input
            type="text"
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
            placeholder="Your display name"
            className="w-full px-4 py-3 bg-base border border-border rounded-lg text-primary placeholder-muted focus:outline-none focus:border-accent focus:ring-2 focus:ring-accent/20 transition-all"
          />
        </div>

        {/* Email (Read-only) */}
        <div className="mb-8 p-4 bg-base rounded-lg border border-border">
          <div className="flex items-center gap-3">
            <Mail className="w-5 h-5 text-secondary" />
            <div>
              <p className="text-sm text-secondary">Email Address</p>
              <p className="text-primary font-medium">{user.email}</p>
            </div>
          </div>
        </div>

        {/* Avatar Selection */}
        <div>
          <p className="text-sm font-medium text-secondary mb-4">Choose Avatar</p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {AVATARS.map((avatar, idx) => (
              <button
                key={idx}
                onClick={() => setSelectedAvatar(avatar)}
                className={`relative w-full aspect-square rounded-lg overflow-hidden border-2 transition-all ${
                  selectedAvatar === avatar
                    ? 'border-accent ring-2 ring-accent/30'
                    : 'border-border hover:border-accent/50'
                }`}>
                <img src={avatar} alt={`Avatar ${idx + 1}`} className="w-full h-full object-cover" />
                {selectedAvatar === avatar && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                    <div className="w-6 h-6 rounded-full border-2 border-white" />
                  </div>
                )}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-4 flex-col sm:flex-row">
        <button
          onClick={handleSaveProfile}
          disabled={saving}
          className="flex-1 flex items-center justify-center gap-2 bg-accent hover:bg-accent/90 text-white font-semibold py-3 px-6 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
          <Save className="w-5 h-5" />
          {saving ? 'Saving...' : 'Save Profile'}
        </button>

        <button
          onClick={handleLogout}
          className="flex-1 flex items-center justify-center gap-2 bg-red-500/10 hover:bg-red-500/20 text-red-500 font-semibold py-3 px-6 rounded-lg border border-red-500/20 transition-colors">
          <LogOut className="w-5 h-5" />
          Sign Out
        </button>
      </div>

      {/* Account Info */}
      <div className="mt-8 p-6 bg-accent/10 rounded-lg border border-accent/30">
        <h3 className="font-bold text-lg mb-2">Account Information</h3>
        <ul className="text-sm text-secondary space-y-2">
          <li>• <strong>Email:</strong> {user.email}</li>
          <li>• <strong>Display Name:</strong> {displayName || '(not set)'}</li>
          <li>• <strong>Account Created:</strong> {user.metadata?.creationTime ? new Date(user.metadata.creationTime).toLocaleDateString() : 'N/A'}</li>
        </ul>
      </div>
    </main>
  );
}
