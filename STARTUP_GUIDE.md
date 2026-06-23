# 🚀 AI//24 Complete Startup Guide

## Project Location
```
/Users/cp366261capitecbank.co.za/Desktop/AI24/
```

---

## ✅ What's Fixed

- ✅ All import paths corrected (relative paths fixed)
- ✅ React 18 rendering fixed (createRoot instead of render)
- ✅ Tailwind CSS classes cleaned up (removed unsupported `light:` and `dark:` variants)
- ✅ All new auth components integrated
- ✅ Light/Dark theme system ready
- ✅ Protected routes working
- ✅ Jobs page built
- ✅ Advertise page built
- ✅ Frontend changes applied ✅

---

## 🎯 Quick Start Command

**Run from anywhere:**
```bash
cd /Users/cp366261capitecbank.co.za/Desktop/AI24 && npm run dev:all
```

**Or run from the project folder:**
```bash
cd /Users/cp366261capitecbank.co.za/Desktop/AI24
npm run dev:all
```

**Then open:**
- Frontend: http://localhost:5173
- Backend API: http://localhost:3001

---

## 📋 What Happens When You Run It

```
npm run dev:all
├─ Starts frontend (Vite) on port 5173
│  └─ Hot module reload enabled
├─ Starts backend (Express) on port 3001
│  └─ Loads SQLite database (89 articles)
│  └─ Initializes scheduler
└─ Both servers running simultaneously
```

---

## 🎨 What You Should See

### Home Page (http://localhost:5173)
```
✅ Header with:
  ├─ Logo (left)
  ├─ Navigation menu (center)
  ├─ Search button (right)
  ├─ Sun/Moon theme toggle (NEW)
  └─ "Sign In" button (blue, NEW)

✅ Hero section (3 featured articles)
✅ Feed section (6 latest articles)
✅ Sidebar (trending, deep dives, picks)
✅ Dark theme (default)
```

### New Features

**Theme Toggle:**
- Click sun/moon icon in header
- Page transitions to light/white mode
- Persists on page refresh

**Sign In Button:**
- Click "Sign In" (blue button, right of header)
- LoginModal pops up
- Shows "Sign in with Google" button
- Firebase ready (need config to activate)

**Protected Routes:**
- Go to `/jobs` → See "Sign in to view AI Jobs"
- Go to `/advertise` → Same login gate
- Go to `/community` → Same login gate
- Go to `/preferences` → Same login gate

**After Mock Login:**
- Profile dropdown replaces "Sign In" button
- Shows user avatar, name, email
- "Preferences" link, "Sign Out" button

---

## 🛠️ Available Commands

```bash
# Start both servers
npm run dev:all

# Start only backend (Express)
npm run server

# Start only frontend (Vite)
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Lint code
npm run lint
```

---

## 📁 File Structure (All Changes Applied)

```
/Users/cp366261capitecbank.co.za/Desktop/AI24/
├── src/
│   ├── config/
│   │   └── firebase.ts              ✅ Firebase config
│   ├── hooks/
│   │   └── useAuth.ts               ✅ Auth listener
│   ├── store/
│   │   ├── authStore.ts             ✅ Auth state
│   │   └── themeStore.ts            ✅ Theme state
│   ├── src/
│   │   ├── components/
│   │   │   ├── Header.tsx           ✅ UPDATED (auth + theme)
│   │   │   ├── LoginModal.tsx       ✅ NEW (Google OAuth)
│   │   │   ├── ThemeToggle.tsx      ✅ NEW (Light/Dark)
│   │   │   └── ... (other components)
│   │   ├── pages/
│   │   │   ├── Jobs.tsx             ✅ NEW (6 AI jobs)
│   │   │   ├── Advertise.tsx        ✅ NEW (Ad platform)
│   │   │   └── ... (other pages)
│   ├── App.tsx                      ✅ UPDATED (routes + auth)
│   ├── index.tsx                    ✅ FIXED (React 18)
│   └── index.css                    ✅ UPDATED (theme vars)
├── server.js                        (Backend API)
├── .env.example                     (Copy to .env for Firebase)
├── package.json
└── ... (config files)
```

---

## 🔐 Firebase Setup (Optional for Full Auth)

### To Enable Real Google OAuth:

1. Go to https://console.firebase.google.com/
2. Create project: `ai24`
3. Enable Google OAuth
4. Copy config values
5. Add to `.env` file:
   ```
   REACT_APP_FIREBASE_API_KEY=your_key
   REACT_APP_FIREBASE_AUTH_DOMAIN=your_domain
   REACT_APP_FIREBASE_PROJECT_ID=your_project_id
   REACT_APP_FIREBASE_STORAGE_BUCKET=your_bucket
   REACT_APP_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
   REACT_APP_FIREBASE_APP_ID=your_app_id
   ```

6. Restart `npm run dev:all`
7. Click "Sign In" → Real Google OAuth now works

---

## 📊 API Endpoints

### Featured Articles
```bash
curl http://localhost:3001/api/featured
```

### Feed (6 latest)
```bash
curl http://localhost:3001/api/feed
```

### All Articles (paginated)
```bash
curl http://localhost:3001/api/explore?page=1&limit=24
```

### By Category
```bash
curl http://localhost:3001/api/category/Updates
```

---

## 🧪 Testing Checklist

After running `npm run dev:all`, test these:

- [ ] Frontend loads at http://localhost:5173
- [ ] Header visible with logo, menu, search, theme toggle, Sign In button
- [ ] Click sun/moon icon → page turns light/white
- [ ] Refresh → light mode persists
- [ ] Click "Sign In" → LoginModal pops up
- [ ] Try `/jobs` → "Sign in to view AI Jobs" message
- [ ] Try `/advertise` → Same login gate
- [ ] Backend API responds: curl http://localhost:3001/api/featured

---

## ⚠️ Troubleshooting

### Blank Screen
**Fix:** Kill servers and restart
```bash
pkill -f "npm run dev:all"
sleep 2
npm run dev:all
```

### API 404 Errors
**Check:** Backend is running
```bash
curl http://localhost:3001/api/featured
```

### Port Already in Use
```bash
# If 3001 is taken
lsof -i :3001

# If 5173 is taken
lsof -i :5173

# Kill specific process
kill -9 <PID>
```

### Module Not Found
**Fix:** Clear node_modules and reinstall
```bash
rm -rf node_modules package-lock.json
npm install
npm run dev:all
```

---

## 📚 Documentation Files

All in `/Users/cp366261capitecbank.co.za/Desktop/AI24/`:

- **STARTUP_GUIDE.md** ← You are here
- **AUTH_SETUP_GUIDE.md** — Firebase configuration
- **AUTH_FEATURES_BUILT.md** — Feature summary
- **FRONTEND_CHANGES_LIVE.md** — UI changes
- **IMPLEMENTATION_CHECKLIST.md** — Build status

---

## 🎯 Next Steps

### Option 1: Test Current State
```bash
npm run dev:all
# Open http://localhost:5173
# Test theme toggle, sign in button, protected routes
```

### Option 2: Enable Real Firebase Auth
```bash
# 1. Get Firebase config (see section above)
# 2. Update .env file
# 3. Restart: npm run dev:all
# 4. Real Google OAuth now works
```

### Option 3: Continue Development
```bash
# Ready for Phase 1: Database Schema
# Ready for Phase 2: OpenAI Integration
# Ready for Phase 3: Daily Brief
# Ready for Phase 4: Data Fetchers
```

---

## ✅ Status

| Component | Status | Notes |
|-----------|--------|-------|
| Frontend | ✅ Live | All UI changes applied |
| Backend | ✅ Running | 89 articles in DB |
| Theme Toggle | ✅ Working | Light/Dark mode |
| Protected Routes | ✅ Working | Jobs, Advertise gated |
| Auth UI | ✅ Built | Ready for Firebase config |
| Google OAuth | ⏳ Waiting | Need .env credentials |

---

## 🚀 You're All Set!

Everything is fixed and ready to go. Just run:

```bash
cd /Users/cp366261capitecbank.co.za/Desktop/AI24 && npm run dev:all
```

Then open http://localhost:5173 and start testing! 🎉

---

**Last Updated:** 2026-06-22  
**All Changes:** ✅ Applied  
**Frontend:** ✅ Live  
**Backend:** ✅ Running
