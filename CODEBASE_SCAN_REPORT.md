# 🔍 AI//24 Codebase Scan Report

**Date:** 2026-06-22  
**Project Location:** `/Users/cp366261capitecbank.co.za/Desktop/AI24/`  
**Servers:** ✅ Running (Frontend: 5173, Backend: 3001)

---

## Current Build Status

### Frontend (React + Vite + TypeScript)
**Pages Built (7):**
- ✅ `/` — Home (Hero + Feed + Sidebar with trending/deep dives/picks)
- ✅ `/explore` — Explore with grid pagination (24 per page, 3 columns)
- ✅ `/curated` — Curated content (page exists)
- ✅ `/categories` — Category filter page (page exists)
- ✅ `/picks` — AI//24 Picks (editor's picks with is_pick flag)
- ✅ `/community` — Community uploads (page exists)
- ✅ `/preferences` — User preferences (page exists)
- ✅ `/story/:id` — Story detail page

**Components Built (8):**
- ✅ Header — Sticky nav with mobile menu, search (Cmd/Ctrl+K), "Get AI//24" CTA
- ✅ SearchModal — Keyboard shortcut search
- ✅ Hero — Main story + 2 sub-stories carousel
- ✅ Feed — Card-based feed layout
- ✅ Sidebar — Trending, deep dives, curation picks
- ✅ Footer — Footer component
- ✅ StoryDetail — Individual story page
- ✅ Various others

**Features Working:**
- ✅ Dark theme (#0B0B0B base)
- ✅ Responsive design (mobile-first, md/lg breakpoints)
- ✅ Image handling with fallback system
- ✅ Animations (Framer Motion)
- ✅ Search modal with Cmd/Ctrl+K shortcut
- ✅ Category badges
- ✅ Read time estimates
- ✅ Published time formatting
- ✅ Router-based navigation

### Backend (Express + SQLite + Node-Cron)
**API Endpoints (Implemented):**
- ✅ `GET /api/featured` — Top 3 articles for hero
- ✅ `GET /api/feed` — Latest 6 articles for home
- ✅ `GET /api/explore` — All articles paginated (limit=24)
- ✅ `GET /api/picks` — Articles marked as picks
- ✅ `GET /api/article/:id` — Single article detail
- ✅ `GET /api/categories` — Category list with counts
- ✅ `GET /api/category/:cat` — Filter by category
- ✅ `POST /api/fetch-news` — Manual trigger fetch

**Database (4 Tables):**
1. **articles** (89 total records)
   - Columns: id, title, dek, category, source, readTime, time, image, url, published_at, created_at, is_featured, is_pick, is_hidden, source_enabled
   - Data: Hacker News articles, Figma blog entries

2. **community_uploads** (4 total records)
   - Columns: id, title, dek, category, uploader_name, readTime, image, url, published_at, created_at, upvotes
   - Designed for user-generated content

3. **news_sources** (structure)
   - Columns: id, name, description, icon_url, enabled, boost_level, created_at
   - Tracks data sources and their boost levels

4. **user_preferences** (structure)
   - Columns: id, source_id, enabled, shortcut_enabled, boost_level
   - Designed for user preference tracking

**Data Pipeline:**
- ✅ Hacker News fetcher (reads top 150 stories daily)
- ✅ Figma blog fetcher (RSS-style)
- ✅ NewsAPI integration (demo key, limited)
- ✅ Deduplication logic
- ✅ Image pooling system (20 fallback images)
- ✅ Scheduler: 24h cycle at midnight UTC
- ✅ Article categorization system

---

## What's Partially Built / Needs Refinement

| Feature | Status | Notes |
|---------|--------|-------|
| Community uploads | Structure only | UI exists but manual data entry needed |
| Preferences page | Structure only | Page exists, backend ready |
| Deep dives section | Hardcoded | Uses explore slice, needs real logic |
| Curation picks | Backend ready | Frontend needs connection |
| Category filtering | Basic | Works but needs visual polish |
| Trending section | Hardcoded | Uses recent articles |
| Source boost levels | Schema ready | Not implemented in API |
| User source preferences | Schema ready | Not implemented |

---

## What's Missing (NOT YET BUILT)

### High Priority (For Evolution Plan)

| Feature | Priority | Effort | Impact |
|---------|----------|--------|--------|
| **AI Summaries** | 🔴 High | 2h | Quality multiplier |
| **"Why it matters" field** | 🔴 High | 1h | UX enhancement |
| **Daily Brief** | 🔴 High | 2h | New feature |
| **Importance Scoring** | 🔴 High | 1h | Smart ranking |
| **User Radar/Personalization** | 🟡 Medium | 2h | Engagement |
| **Reddit fetcher** | 🟡 Medium | 2h | Content volume |
| **Product Hunt fetcher** | 🟡 Medium | 1.5h | Content diversity |
| **GitHub trending** | 🟡 Medium | 1.5h | Dev community |
| **RSS feed parser** | 🟡 Medium | 1h | Broader coverage |
| **Tags system** | 🟡 Medium | 1h | Better filtering |

### Lower Priority

- Newsletter signup
- Email notifications / push notifications
- User accounts / login
- Admin dashboard
- Analytics tracking
- Social sharing
- Related articles
- Comments system
- Bookmarks/favorites
- Dark mode toggle (already default)

---

## Code Quality & Architecture

### Strengths ✅
- **Clean component structure** — Modular, reusable components
- **Type safety** — TypeScript throughout
- **Responsive design** — Mobile-first, all breakpoints covered
- **Error handling** — Try/catch in fetches, image fallbacks
- **Performance** — Pagination, lazy loading images
- **Styling** — Consistent Tailwind + CSS variables
- **Animation** — Smooth Framer Motion transitions
- **Database schema** — Well-designed for future features

### Areas for Improvement 🟡
- **API error handling** — Some 401 NewsAPI errors not handled
- **Loading states** — Basic "Loading..." text, could be spinners
- **Empty states** — No empty state UI for no results
- **Caching** — No caching layer for API calls
- **Rate limiting** — No rate limit protection
- **Logging** — Console logs for debugging

---

## Database State

```
Total Articles: 89
- Hacker News: 58
- Figma Blog: 15
- Other: 16

Community Uploads: 4
Categories:
  - Updates (45 articles)
  - Policy (1 article)
  - Tools (2 articles)
  - Trends (1 article)
  - Other (40 articles)

Featured: 3 (marked as is_featured=1)
Picks: 4 (marked as is_pick=1)
```

---

## My Recommendations: Next Build Steps

### 🎯 IMMEDIATE (Start Now - 1-2 Days)

**Phase 1: Schema Expansion** (1 hour)
- Add `why_it_matters` column to articles table
- Add `tags` (JSON) column to articles table
- Add `importance_score` (INT) column to articles table
- Add `source_type` column to track fetcher source
- Create `daily_briefs` table

**Why:** Foundation for AI summaries and smart ranking

---

### 🚀 QUICK WINS (1-2 Days)

**Phase 2: OpenAI Integration** (2 hours)
```typescript
// Create /services/summarizer.ts
- Call OpenAI API on new articles
- Transform raw content → structured JSON:
  - title (AI-generated headline)
  - why_it_matters (1-line insight)
  - tags (structured array)
  - category (AI classification)
- Add to env: OPENAI_API_KEY
```

**Why:** Massive quality improvement, users see "Why it matters" instantly

**Phase 3: Daily Brief** (2 hours)
- Scheduler job: midnight UTC
- Endpoint: `GET /api/brief`
- New page: `/brief` showing top 5 today

**Why:** New feature that drives daily engagement

---

### 📈 CONTENT EXPANSION (2-3 Days)

**Phase 4: More Data Sources** (4-5 hours total)

Build fetchers for:
1. **Reddit** (r/MachineLearning, r/artificial, r/OpenAI)
   - ~2h, ~80 lines of code
   - 20-50 new articles/day
   - High engagement metrics

2. **Product Hunt API** (daily AI launches)
   - ~1.5h, ~50 lines
   - 5-10 quality articles/day
   - Early access to new tools

3. **GitHub Trending** (trending repos)
   - ~1.5h, ~60 lines (HTML scrape)
   - 10-20 articles/day
   - Dev-focused content

**Why:** Move from 89 articles → 200+ articles, more diverse sources

---

### 🎯 PERSONALIZATION (Optional, 2 Hours)

**Phase 5: User Preferences + AI Radar** (2 hours)
- Interest selector: SaaS, Design, Marketing, Coding, Ecommerce, etc.
- Radar matching engine
- Boost scores for matching items
- "Recommended for You" section

**Why:** Increase engagement, repeat visits

---

## My Strong Recommendation 🚀

**Start with Phase 1 + 2 + 3 (Evolution Plan):**

```
TODAY:
├─ Phase 1: Schema (1h)      → foundation ready
├─ Phase 2: OpenAI (2h)      → AI summaries live
├─ Phase 3: Brief (2h)       → new engagement feature
└─ TOTAL: 5 hours → MVP COMPLETE ✅

NEXT:
├─ Phase 4: Data sources (4h) → 3x articles
└─ Content refresh complete

RESULT: Transform from "News Aggregator" → "AI Opportunity Engine"
```

---

## Files Ready to Create

**New files to add (~850 lines total):**

```
/services/summarizer.ts         (100 lines)
/lib/dailyBrief.ts              (80 lines)
/lib/radar.ts                   (60 lines)
/pages/Brief.tsx                (150 lines)
/pages/InterestSelector.tsx     (100 lines)
/services/ingest/reddit.ts      (80 lines)
/services/ingest/productHunt.ts (50 lines)
/services/ingest/github.ts      (60 lines)
/services/ingest/rss.ts         (70 lines)
server.js updates               (200 lines)
```

---

## Current API Request Examples

```bash
# Get featured (hero)
curl http://localhost:3001/api/featured

# Get feed (home)
curl http://localhost:3001/api/feed

# Get all articles (paginated)
curl http://localhost:3001/api/explore?page=1&limit=24

# Get picks
curl http://localhost:3001/api/picks

# Get categories
curl http://localhost:3001/api/categories

# Get by category
curl http://localhost:3001/api/category/Updates

# Get single article
curl http://localhost:3001/api/article/hn_48550693
```

---

## Tech Stack (Confirmed)

**Frontend:**
- React 18 + TypeScript
- Vite (build tool)
- Tailwind CSS (styling)
- Framer Motion (animations)
- React Router (navigation)
- Lucide React (icons)

**Backend:**
- Express.js
- SQLite (better-sqlite3)
- Node-Cron (scheduling)
- Axios (HTTP)
- CORS enabled

**External APIs:**
- Hacker News (working ✅)
- NewsAPI (limited, demo key)
- Figma blog (working ✅)
- OpenAI (ready to integrate)

---

## Questions for You

1. **Start with Phase 1 now?** (Schema migration, 1 hour)
2. **Have OpenAI API key?** (Get from https://platform.openai.com/api-keys)
3. **Prefer more articles FIRST** (Phase 4 fetchers) or **AI summaries FIRST** (Phase 2)?
4. **Want to build Daily Brief** or **skip to data sources**?

---

## Next Action

**I recommend starting Phase 1 immediately:**

```bash
cd /Users/cp366261capitecbank.co.za/Desktop/AI24
# Phase 1: Run schema migration (SQL script)
# Then Phase 2: Add OpenAI integration
```

**Result:** By tomorrow, you'll have:
- ✅ AI-generated summaries
- ✅ "Why it matters" on every article
- ✅ Daily brief page
- ✅ Smart importance scoring

Ready? Let me know! 🚀
