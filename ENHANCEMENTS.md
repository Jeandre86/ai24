# AI//24 Enhancements — Complete Feature Set

## 🎯 Three New Core Features Implemented

### 1. **AI//24 Picks** ⭐
- **URL:** http://localhost:5173/picks
- **Backend:** `/api/picks` 
- **What it is:** Curated selection of the most impactful AI & tech stories
- **Data:** 5 curated picks from database (marked as `is_pick = 1`)
- **UI:** Grid layout with pick badge, category tags, read time, upvote count
- **Features:**
  - Searchable by keyword
  - Categorized articles
  - Click to read full story
  - Professional design with accent colors

---

### 2. **Community Uploads** 🚀
- **URL:** http://localhost:5173/community
- **Backend:** `/api/community` + `/api/community/upload`
- **What it is:** User-submitted content from the community
- **Data:** 4+ test uploads ready (upvote system included)
- **UI:** Card grid with upvote button and pagination
- **Features:**
  - Submit new articles via form
  - Fill in: Title, Description, Category, Your Name, Image URL, Article URL
  - Upvote system (👍 increments count)
  - Pagination support (12 per page)
  - Category filtering
  - Uploader attribution

**How to submit:**
```bash
curl -X POST http://localhost:3001/api/community/upload \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Your Article Title",
    "dek": "Description",
    "category": "AI Models|Research|Hardware|Business",
    "uploader_name": "Your Name",
    "readTime": "5 min read",
    "image": "https://image-url.jpg",
    "url": "https://article-url"
  }'
```

---

### 3. **Customize Your Feed (Preferences)** ⚙️
- **URL:** http://localhost:5173/preferences
- **Backend:** `/api/preferences` + `/api/sources`
- **What it is:** Control which sources appear in your feed with shortcuts & boosting
- **Data:** 7 news sources configured
  - Hacker News
  - TechCrunch
  - arXiv (AI/ML research)
  - Medium
  - Twitter/X
  - GitHub Trending
  - News API

**Features per Source:**
1. **Show in Feed Toggle** — Enable/disable a source
2. **Shortcut Toggle** — Boost that source (we give it priority)
3. **Boost Level** — None, Low, Medium, High (controls boost intensity)

**How it works:**
- Toggle sources on/off to customize content
- Enable shortcuts to give a source a small priority bump
- Control boost level to fine-tune visibility
- Preferences persist in database

---

## 📋 Additional Features

### Hide Article Feature
- **Endpoint:** `PUT /api/article/:id/hide`
- **UI:** Hover on any feed article → • menu button → click to hide
- **What happens:** Article removed from feed, marked as hidden in DB
- **Where used:** Feed component, Community uploads

### Database Schema (New Tables)
```sql
-- AI//24 Picks & hiding
ALTER TABLE articles ADD COLUMN is_pick BOOLEAN DEFAULT 0;
ALTER TABLE articles ADD COLUMN is_hidden BOOLEAN DEFAULT 0;

-- Community uploads
CREATE TABLE community_uploads (
  id, title, dek, category, uploader_name, readTime, 
  image, url, upvotes, published_at, created_at
)

-- News sources
CREATE TABLE news_sources (
  id, name, description, icon_url, enabled, boost_level, created_at
)

-- User preferences
CREATE TABLE user_preferences (
  id, source_id, enabled, shortcut_enabled, boost_level
)
```

---

## 🔌 API Endpoints

| Method | Endpoint | Purpose |
|--------|----------|---------|
| GET | `/api/picks` | Get AI//24 Picks (5 curated articles) |
| GET | `/api/community` | Get community uploads (paginated, 12/page) |
| POST | `/api/community/upload` | Submit new community content |
| POST | `/api/community/:id/upvote` | Upvote a community upload |
| GET | `/api/sources` | List all available news sources |
| GET | `/api/preferences` | Get user's source preferences |
| PUT | `/api/preferences/:sourceId` | Update source preferences (enable/boost) |
| PUT | `/api/article/:id/hide` | Hide an article from feed |

---

## 🎨 Frontend Pages

### New Routes Added to `/src/App.tsx`
- `/picks` → `<Picks />` component
- `/community` → `<Community />` component
- `/preferences` → `<Preferences />` component

### Navigation Updated
Header now includes:
- Explore
- **AI//24 Picks** (NEW) ⭐
- **Community** (NEW) 🚀
- Categories
- **Preferences** (NEW) ⚙️

---

## ✨ Component Features

### Picks Page (`Picks.tsx`)
- ⭐ Pick badge on each article
- Grid layout (responsive, 2 cols on mobile, 2 on tablet, auto on desktop)
- Category tags
- Time since published
- Source and read time info
- Click-through to full story

### Community Page (`Community.tsx`)
- Share button (toggles upload form)
- Form submission for new content
- Community upload grid (3 cols on desktop)
- Upvote button with count
- Pagination controls
- Empty state message

### Preferences Page (`Preferences.tsx`)
- Source card for each news source
- Three toggles per source:
  1. Show/Hide in feed
  2. Shortcut (boost) toggle
  3. Boost level selector (None/Low/Med/High)
- Real-time UI updates on toggle
- Help section explaining how boosting works
- Source description and active indicator

---

## 🚀 How to Use

### 1. View AI//24 Picks
```
Open http://localhost:5173/picks
```

### 2. Submit to Community
```
http://localhost:5173/community
→ Click "+ Share Content"
→ Fill form and submit
```

### 3. Customize Your Feed
```
http://localhost:5173/preferences
→ Enable/disable sources
→ Enable shortcuts to boost
→ Set boost level (Low/Med/High)
```

### 4. Hide Articles
```
Hover on any article in feed
→ Click • menu (top right)
→ Article hidden from feed
```

---

## 📊 Database Stats

- **Total Articles:** 89+
- **AI//24 Picks:** 5 (top recent articles)
- **Community Uploads:** 4+ (test data)
- **News Sources:** 7 configured
- **User Preferences:** Per-source tracking

---

## 🔄 Data Flow

```
Frontend (Picks/Community/Preferences pages)
    ↓
React Components with fetch()
    ↓
Backend Express APIs
    ↓
SQLite Database
    ↓
Real-time updates via UI state
```

---

## 🎯 What You Can Now Do

✅ **Personalize your news feed** by choosing which sources to see  
✅ **Boost your favorite sources** with shortcuts (small priority bump)  
✅ **Share your own content** with the community  
✅ **Discover curated picks** hand-selected for quality  
✅ **Hide unwanted articles** with one click  
✅ **Rate community content** with upvotes  
✅ **Track your preferences** persistently in the database  

---

## 🔧 Testing

All endpoints tested and working:
```bash
# View picks
curl http://localhost:3001/api/picks | jq

# Submit community content
curl -X POST http://localhost:3001/api/community/upload ...

# Get preferences
curl http://localhost:3001/api/preferences | jq

# Update a source preference
curl -X PUT http://localhost:3001/api/preferences/hacker-news ...

# Hide article
curl -X PUT http://localhost:3001/api/article/{id}/hide
```

---

**Status:** ✅ All features implemented, tested, and ready to use!
