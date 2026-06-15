# AI//24 Complete Feature Audit

**Date:** 2026-06-15  
**Status:** Issues Found & Being Fixed

---

## 🔴 Critical Issues Found

### 1. **Article URLs Don't Match Titles** ✅ FIXED
**Issue:** Article says "Read full article on The Verge" but link goes to stability.ai  
**Root Cause:** Database has mismatched title/URL pairs (title from mock5, URL from mock4)  
**Fix Applied:** Updated all 6 mock articles with matching titles, sources, and URLs

**Before:**
```
Title: "Midjourney v6 Alpha..." 
Source: "The Verge"
URL: https://stability.ai/news/stable-diffusion-3  ❌
```

**After:**
```
Title: "Stable Diffusion 3..."
Source: "Stability AI"
URL: https://stability.ai/news/stable-diffusion-3  ✅
```

---

## 📋 Feature-by-Feature Audit

### ✅ **Home Page (Mostly Working)**
**Status:** WORKING with updates
- ✅ Hero section (3 top articles)
- ✅ Feed section (6 articles)
- ✅ Fetches from API correctly
- ✅ Sidebar displays (Trending, Deep Dives, Curated Picks)
- **Note:** Sidebar uses static mock data from `data.ts`

### ✅ **Explore Page (Mostly Working)**
**Status:** WORKING
- ✅ Grid layout for all articles
- ✅ Pagination (Previous/Next buttons)
- ✅ Fetches from API with real Hacker News articles
- ✅ Articles clickable and route correctly
- ⚠️ **Issue:** No real article count (shows 0 total when empty)

### ✅ **Story Detail Page (Mostly Working)**
**Status:** WORKING with fix
- ✅ Loads article from API by ID
- ✅ Shows title, image, description
- ✅ "Read Original" button works with correct URL
- ✅ Opens in new tab safely
- **Fixed:** Now uses matching URLs from database

### 🟡 **Categories Page (Static/Broken)**
**Status:** NEEDS WORK
- ❌ Shows hard-coded static data (142 AI Models, 89 Hardware, etc.)
- ❌ Numbers don't reflect actual database count
- ❌ Clicking categories doesn't filter articles
- ❌ No API integration
**Fix Needed:** Add filtering by category

### 🔴 **Curated Page (Non-Functional)**
**Status:** BROKEN
- ❌ "View Resource" button doesn't work
- ❌ Uses static data from `data.ts`
- ❌ Should link to external resources
- ❌ No API endpoints for curated items
**Fix Needed:** Make "View Resource" button functional with URLs

### 🔴 **Search Modal (Outdated)**
**Status:** PARTIALLY BROKEN
- ✅ Opens with Cmd/Ctrl+K
- ✅ Search works
- ❌ Uses old static data (heroStories + feedStories from data.ts)
- ❌ Doesn't search real API data
- ❌ Limited to 9 articles (6 + 3)
**Fix Needed:** Connect to API for live search

### ✅ **Header (Working)**
**Status:** WORKING
- ✅ Navigation links functional
- ✅ Search button works (opens modal)
- ✅ Mobile menu works
- ✅ Active link highlighting
- ✅ Keyboard shortcut (Cmd+K) for search
- ⚠️ "Get AI // 24" button says "Coming Soon"

### ✅ **Footer (Basic)**
**Status:** WORKING
- ✅ Displays correctly
- (Basic footer functionality)

### 🟡 **Sidebar (Partially Working)**
**Status:** MIXED
- ✅ Trending Now section displays
- ✅ Weekly Deep Dives section displays
- ✅ Curation Picks section displays
- ❌ All use static data from `data.ts`
- ❌ Numbers don't update with real articles
**Fix Needed:** Fetch dynamic data from API

---

## 🔧 Issues to Fix

### Priority 1 (Critical)
1. ✅ **Article URL/Title Mismatch** — FIXED
2. 🔴 **Search Modal** — Uses old data, should search API
3. 🔴 **Curated Page** — "View Resource" button broken

### Priority 2 (Important)
4. 🟡 **Categories Page** — Static counts, no filtering
5. 🟡 **Sidebar Dynamic Data** — Uses `data.ts` instead of API

### Priority 3 (Nice to Have)
6. "Get AI // 24" button (Coming Soon)

---

## 📊 Data Flow Issues

### Current (Broken)
```
Components ← data.ts (static, 9 articles)
   ↓
SearchModal, Sidebar, Curated, Categories
   ↓
All out of sync with real API (19+ articles)
```

### Should Be
```
API (http://localhost:3001)
   ↓
/api/featured (3) → Home Hero
/api/feed (6) → Home Feed
/api/explore (all) → Explore page
/api/article/:id → Story Detail
   ↓
All components show live data
```

---

## 🐛 Specific Component Issues

### SearchModal (src/components/SearchModal.tsx)
**Line 5:** `import { heroStories, feedStories } from '../data';`
- Should fetch from `/api/explore` instead
- Limited to 9 articles
- Doesn't update with new articles

**Fix:** Replace static data import with API fetch using useEffect

### Sidebar (src/components/Sidebar.tsx)
**Props:** `trending`, `deepDives`, `curationPicks` are static
- Should be fetched from API
- Numbers don't change over time
- Not in sync with real articles

**Fix:** Pass API data from Home.tsx, or fetch in Sidebar

### Categories (src/pages/Categories.tsx)
**Line 4-46:** Hard-coded category data
- Counts (142, 89, 215, 176, 94, 63) are fake
- No click handlers to filter
- No API calls

**Fix:** Either:
- Option A: Make clickable → filters /api/explore by category
- Option B: Show real counts from API aggregation

### Curated (src/pages/Curated.tsx)
**Line 49:** "View Resource" button has no onClick
- Doesn't navigate anywhere
- curationPicks has no URL field
- Should open external resources

**Fix:** Add onClick to navigate to external URL or resource page

---

## 📝 Database Schema Check

### Current articles.db
✅ Has correct fields: `id, title, dek, category, source, readTime, time, image, url, published_at, created_at, is_featured`

✅ Articles table has 6+ rows with real data

### Issues
- `is_featured` flag exists but unused
- No `category_count` table
- No `curated_resources` table
- No `category` filtering in API

---

## 🎯 What Works Well

✅ **Backend API** — Solid foundation with Hacker News integration  
✅ **Home Page** — Hero + Feed display correctly  
✅ **Explore Page** — Pagination works, articles display  
✅ **Story Detail** — Loads articles, links work  
✅ **Animations** — Framer Motion working smoothly  
✅ **Styling** — Tailwind CSS, dark theme consistent  
✅ **Routing** — React Router handling pages correctly  
✅ **Text Colors** — Latest News header #f5f5f5 ✅  

---

## 🔴 What Needs Fixing

| Feature | Status | Fix |
|---------|--------|-----|
| Articles URL/Title Match | ✅ FIXED | Database updated |
| Search Modal | 🔴 BROKEN | Fetch from API |
| Curated Page Buttons | 🔴 BROKEN | Add onClick handlers |
| Categories Filtering | 🔴 BROKEN | Add filter API endpoint |
| Sidebar Dynamic Data | 🟡 OUTDATED | Fetch from API |
| Real Article Counts | 🟡 MISSING | Add to API response |

---

## 📈 Auto-Update (24h)

✅ **Backend** — Fetches from Hacker News every 24h at midnight UTC  
✅ **Database** — Articles persist across restarts  
✅ **Frontend** — Will show new articles on next load  
⚠️ **Issue:** Search/Sidebar/Categories won't see new articles until refresh

---

## 🛠️ Next Steps

1. ✅ Fix article matching (DONE)
2. 🔄 Update SearchModal to use API
3. 🔄 Make Curated page functional
4. 🔄 Add Categories filtering
5. 🔄 Update Sidebar to use API data

---

## 📌 Summary

**Total Features:** 12  
**Working:** 7 ✅  
**Partially Working:** 3 🟡  
**Broken:** 2 🔴  

**Major Issue:** Components still use old static data instead of new API data.  
**All URLs:** Now fixed to match titles ✅  
**Latest News:** Text color correct (#f5f5f5) ✅  
