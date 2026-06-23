# 🔐 AI//24 Authentication Setup Guide

## What Was Built

✅ **Google OAuth Integration** — Sign in with Google  
✅ **Light/Dark Theme Toggle** — User preference storage  
✅ **Protected Routes** — Community, Preferences, Jobs, Advertise require login  
✅ **User Profile System** — Dropdown with avatar, name, email  
✅ **AI Jobs Page** — 6 sample AI/ML job listings  
✅ **Advertise Page** — 3 pricing tiers + submission form  
✅ **Zustand State Management** — Auth + Theme stores  

---

## Step 1: Firebase Setup (5 minutes)

### Create Firebase Project

1. Go to https://console.firebase.google.com/
2. Click "Create a new project"
   - Project name: `ai24`
   - Accept defaults, click "Create Project"
3. Wait for project to initialize (~30 seconds)

### Enable Google OAuth

1. In Firebase console, go to **Authentication** → **Sign-in method**
2. Click **Google** provider
3. Toggle **Enable**
4. Set project support email
5. Save

### Get Firebase Config

1. In Firebase console, go to **Project Settings** (gear icon)
2. Click **Your apps** section
3. Create new web app (if not exists):
   - App nickname: `AI24 Web`
   - Click "Register app"
4. Copy the Firebase configuration object

Example config will look like:
```javascript
const firebaseConfig = {
  apiKey: "AIzaSyD...",
  authDomain: "ai24-xyz.firebaseapp.com",
  projectId: "ai24-xyz",
  storageBucket: "ai24-xyz.appspot.com",
  messagingSenderId: "123456789012",
  appId: "1:123456789012:web:abcdef"
};
```

---

## Step 2: Configure Environment Variables (2 minutes)

1. Open `/Users/cp366261capitecbank.co.za/Desktop/AI24/.env`
2. Add your Firebase config values:

```bash
REACT_APP_FIREBASE_API_KEY=AIzaSyD...
REACT_APP_FIREBASE_AUTH_DOMAIN=ai24-xyz.firebaseapp.com
REACT_APP_FIREBASE_PROJECT_ID=ai24-xyz
REACT_APP_FIREBASE_STORAGE_BUCKET=ai24-xyz.appspot.com
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=123456789012
REACT_APP_FIREBASE_APP_ID=1:123456789012:web:abcdef

VITE_API_URL=http://localhost:3001
```

3. Save file

**Note:** Never commit `.env` to git — it's in `.gitignore`

---

## Step 3: Add OAuth Redirect URL (3 minutes)

1. In Firebase console, go to **Authentication** → **Sign-in method** → **Google**
2. Go to **Authorized JavaScript origins**
3. Add: `http://localhost:5173` (development)
4. Save

Later, add production domain:
```
https://your-domain.com
```

---

## Step 4: Test Everything (5 minutes)

1. Kill current dev servers: `pkill -f "npm run dev:all"`
2. Start fresh:
   ```bash
   cd /Users/cp366261capitecbank.co.za/Desktop/AI24
   npm run dev:all
   ```

3. Open http://localhost:5173

4. **Test scenarios:**

   a. **Sign In Flow**
   - Click "Sign In" button
   - Click "Sign in with Google"
   - Complete Google OAuth flow
   - See profile dropdown appear

   b. **Protected Routes**
   - Try accessing `/jobs` or `/advertise`
   - Should show login prompt
   - After login, pages unlock

   c. **Theme Toggle**
   - Click sun/moon icon in header
   - Theme switches light ↔ dark
   - Persists on page reload

   d. **Logout**
   - Click profile dropdown
   - Click "Sign Out"
   - Redirected to home, protected pages locked

---

## Component Architecture

### Firebase Config
**File:** `src/config/firebase.ts`
- Initializes Firebase app
- Exports `auth` and `db` instances
- Uses environment variables

### Auth Store (Zustand)
**File:** `src/store/authStore.ts`
- Global state: `user`, `profile`, `loading`
- Accessible from any component
- Persists during session

### Auth Hook
**File:** `src/hooks/useAuth.ts`
- Listens to Firebase auth state changes
- Auto-syncs user to store
- Provides `logout()` function

### Updated Components
- **Header.tsx** — Login button, profile dropdown, theme toggle
- **LoginModal.tsx** — Google OAuth modal
- **ThemeToggle.tsx** — Light/dark mode button

### New Pages
- **Jobs.tsx** — AI/ML job listings (auth-required)
- **Advertise.tsx** — Advertising platform (auth-required)

---

## Usage in Components

### Check if User is Logged In
```typescript
import { useAuthStore } from '../store/authStore';

export function MyComponent() {
  const { user, profile } = useAuthStore();

  if (!user) {
    return <div>Please sign in</div>;
  }

  return <div>Welcome, {profile?.displayName}!</div>;
}
```

### Use Auth Hook
```typescript
import { useAuth } from '../hooks/useAuth';

export function ProfileComponent() {
  const { logout } = useAuth();

  return (
    <button onClick={logout}>
      Sign Out
    </button>
  );
}
```

### Check Theme
```typescript
import { useThemeStore } from '../store/themeStore';

export function MyComponent() {
  const { theme, toggleTheme } = useThemeStore();

  return (
    <button onClick={toggleTheme}>
      Current: {theme} mode
    </button>
  );
}
```

---

## Protected Routes

### Current Protected Pages
- `/community` — Community uploads (requires auth)
- `/preferences` — User settings (requires auth)
- `/jobs` — AI Jobs board (requires auth)
- `/advertise` — Advertising platform (requires auth)

### How It Works
In each page component:
```typescript
const { user } = useAuthStore();

if (!user) {
  return <LoginPrompt />;
}
// Show protected content
```

---

## Database Integration (Next Phase)

To persist user data to backend:

1. Create `users` table in SQLite:
```sql
CREATE TABLE users (
  uid TEXT PRIMARY KEY,
  email TEXT,
  displayName TEXT,
  photoURL TEXT,
  createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
  isPremium BOOLEAN DEFAULT 0,
  role TEXT DEFAULT 'user'
);
```

2. Create API endpoint: `POST /api/users`
```typescript
app.post('/api/users', async (req, res) => {
  const { uid, email, displayName, photoURL } = req.body;
  // Insert/update user in DB
});
```

3. Call after Firebase auth in Hook:
```typescript
// In useAuth.ts
const syncUserToBackend = async (firebaseUser) => {
  await fetch('http://localhost:3001/api/users', {
    method: 'POST',
    body: JSON.stringify({
      uid: firebaseUser.uid,
      email: firebaseUser.email,
      displayName: firebaseUser.displayName,
      photoURL: firebaseUser.photoURL
    })
  });
};
```

---

## Troubleshooting

### "Auth Config is Empty"
- Verify `.env` file exists and has Firebase keys
- Run `npm run dev:all` again after updating `.env`

### Google OAuth Shows Error
- Check Firebase OAuth redirect URLs (must include `http://localhost:5173`)
- Verify `.env` variables match Firebase console exactly

### Light Mode Not Working
- Check browser cache (hard refresh: Cmd+Shift+R)
- Check `localStorage` → `theme` should be `light`
- Verify `data-theme="light"` is on `<html>` element

### Profile Picture Not Showing
- Google OAuth sometimes doesn't return photoURL
- Fallback: `https://ui-avatars.com/api/?name=User`
- Already implemented in LoginModal + Header

---

## Next Steps

### Phase 2 (User Profiles)
- [ ] Add user profile page `/profile`
- [ ] Store saved jobs (bookmarks)
- [ ] User notification preferences

### Phase 3 (Premium Features)
- [ ] Implement `isPremium` flag
- [ ] Stripe payment integration
- [ ] Premium job listings + advertising deals

### Phase 4 (Social Features)
- [ ] User-to-user messaging
- [ ] Community comments on jobs
- [ ] Share job listings

---

## File Structure

```
src/
├── config/
│   └── firebase.ts           # Firebase initialization
├── hooks/
│   └── useAuth.ts            # Auth state management hook
├── store/
│   ├── authStore.ts          # Auth state (Zustand)
│   └── themeStore.ts         # Theme state (Zustand)
├── components/
│   ├── Header.tsx            # Updated with auth + theme
│   ├── LoginModal.tsx        # Google OAuth modal
│   ├── ThemeToggle.tsx       # Light/dark toggle
│   └── ...
└── pages/
    ├── Jobs.tsx              # AI Jobs board (protected)
    ├── Advertise.tsx         # Advertising platform (protected)
    └── ...
```

---

## Security Notes

✅ **Firebase Handles Auth** — Google handles credential security  
✅ **No Passwords Stored** — OAuth-only, safer  
✅ **Protected Routes** — Client-side checks (add backend checks later)  
⚠️ **Sensitive Routes** — Add backend validation before processing user data  

---

## Support

**Firebase Docs:** https://firebase.google.com/docs/auth  
**Google OAuth:** https://developers.google.com/identity/protocols/oauth2

---

**Setup Time:** ~15 minutes total  
**Status:** Ready to test! 🚀
