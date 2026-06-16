# AI//24 Sidebar — Complete Implementation

## Overview
The Home page sidebar now dynamically displays three featured sections that update from your article database in real-time.

---

## 📊 1. Trending Now (Top 5 Articles)

**What it shows:** The 5 most recent tech & AI articles  
**Data source:** `/api/explore` endpoint (first 5 articles)  
**Update frequency:** Real-time on page load  
**UI Design:** Numbered list (01-05) with article title and source

### Data Structure
```json
{
  "id": "hn_48550693",
  "title": "The time the x86 emulator team found code so bad they fixed it during emulation",
  "source": "Devblogs.microsoft.com"
}
```

### Features
- ✅ Click any trending item → opens full article
- ✅ Hover effect: title color changes to accent
- ✅ Number counter (01, 02, 03, 04, 05)
- ✅ Source attribution below each title
- ✅ Responsive on mobile/tablet/desktop

**Live Example:**
```
01  The time the x86 emulator team found...
    Devblogs.microsoft.com

02  The rise of machine writing is a great opportunity...
    Theatlantic.com

03  Firefox 152 Now Available with JPEG-XL Support
    Phoronix.com
```

---

## 📚 2. Weekly Deep Dives (4 Articles)

**What it shows:** 4 in-depth articles with longer read times  
**Data source:** `/api/explore` endpoint (articles 6-9)  
**Update frequency:** Real-time on page load  
**UI Design:** Card grid with thumbnail images and read time

### Data Structure
```json
{
  "id": "hn_48550432",
  "title": "Australia to probe assault claims by Gaza flotilla activists...",
  "readTime": "9 min read",
  "image": "https://images.unsplash.com/photo-..."
}
```

### Features
- ✅ Thumbnail image for each article
- ✅ Read time indicator (helps users choose)
- ✅ Hover animation: card lifts up (-2px)
- ✅ Click article → opens full story
- ✅ Line-clamp to prevent overflow
- ✅ Responsive grid layout (1-4 columns)

**Live Example:**
```
[Image] Australia to probe assault claims...
        9 min read

[Image] Microsoft Teams introduces office...
        5 min read

[Image] Amazon Announces Multibillion-Dollar...
        9 min read

[Image] Show HN: Claude Code for VS...
        3 min read
```

---

## ⭐ 3. Curation Picks (AI//24 Team's Top 3)

**What it shows:** Your curated AI//24 Picks (top 3)  
**Data source:** `/api/picks` endpoint  
**Update frequency:** Real-time on page load  
**UI Design:** Simple list with title and curator attribution

### Data Structure
```json
{
  "id": "hn_48550693",
  "title": "The time the x86 emulator team found code so bad...",
  "is_pick": true,
  "curator": "AI//24 Team"
}
```

### Features
- ✅ Shows top picks marked in database (is_pick = 1)
- ✅ Curator attribution ("via AI//24 Team")
- ✅ Click any pick → goes to full picks page
- ✅ Hover effect: title changes to accent color
- ✅ Line-clamp title for consistency

**Live Example:**
```
The time the x86 emulator team found code...
via AI//24 Team

The rise of machine writing is a great opportunity...
via AI//24 Team

Firefox 152 Now Available with JPEG-XL Support
via AI//24 Team
```

---

## 🔄 Data Flow

```
Home.tsx Page Load
    ↓
useEffect Hook Triggers
    ↓
Parallel Fetch:
├── /api/featured (Hero stories)
├── /api/feed (Latest news feed)
├── /api/explore?limit=12 (All articles)
└── /api/picks (Curated picks)
    ↓
State Updates:
├── trendingStories = explore[0:5]
├── deepDives = explore[5:9] with images
└── curationPicks = picks[0:3]
    ↓
Sidebar Component Renders
    ↓
Three sections display live data
```

---

## 📱 Responsive Behavior

### Desktop (lg and above)
- Sidebar fixed width: 320px
- Sticky position (sticks to viewport as you scroll)
- All three sections visible together
- 2x2 grid for deep dives thumbnails

### Tablet (md)
- Full width sidebar
- Below main content
- Sections stack vertically
- 1 column layout for deep dives

### Mobile (sm and below)
- Full width
- Sections collapse if needed
- Numbered trending still shows
- Deep dives use horizontal scroll if needed

---

## 🔌 API Endpoints Used

| Endpoint | Data Used | Count |
|----------|-----------|-------|
| `/api/explore?limit=12` | Trending + Deep Dives | 9 items |
| `/api/picks` | Curation Picks | 5 picks (top 3 shown) |
| `/api/featured` | Hero section | 3 items |
| `/api/feed` | Latest news feed | 6 items |

---

## ✨ Navigation Integration

### Click Behavior
- **Trending Now** → Clicks go to `/story/:id` (full article view)
- **Weekly Deep Dives** → Clicks go to `/story/:id` (full article view)
- **Curation Picks** → Clicks go to `/picks` (all picks page)

### Mobile Menu
Sidebar items clickable from mobile menu if sidebar is collapsed

---

## 🎨 Styling Details

### Colors Used
- **Section Headers:** `text-secondary` with `uppercase tracking-widest`
- **Trending Numbers:** `text-border` → `text-accent` on hover
- **Titles:** `text-primary/90` → `text-accent` on hover
- **Metadata:** `text-muted` (sources, read times, curators)
- **Icons:** `TrendingUp`, `BookOpen`, `Star` in accent color

### Spacing
- Gap between sections: `gap-10`
- Sticky top offset: `top-24` (below header)
- Internal gaps: `gap-4` to `gap-5`
- Padding on hover areas: `p-2 -mx-2` (negative margin for full-width hover)

---

## 🧪 Testing the Sidebar

### Test 1: Data Loads on Page Load
```bash
curl http://localhost:3001/api/explore?limit=12 | jq '.articles | length'
# Should return 12+
```

### Test 2: Trending Shows First 5
```bash
curl http://localhost:3001/api/explore?limit=12 | jq '.articles[0:5] | map(.title)'
# Should show 5 articles
```

### Test 3: Deep Dives Show Articles 5-9
```bash
curl http://localhost:3001/api/explore?limit=12 | jq '.articles[5:9] | map({title, readTime})'
# Should show 4 articles with read times
```

### Test 4: Picks Load
```bash
curl http://localhost:3001/api/picks | jq '. | map(.title)'
# Should show all picks with top 3 displayed
```

---

## 📊 Current Data

- **Trending Now:** 5 recent articles (Microsoft, Atlantic, Phoronix, etc.)
- **Weekly Deep Dives:** 4 in-depth reads (9min, 5min, 9min, 3min)
- **Curation Picks:** 5 total picks, top 3 shown (AI//24 Team curated)

---

## 🚀 How It Works

1. **Page Load:** Home component mounts
2. **Data Fetch:** 4 API calls fire in parallel
3. **State Update:** Each data set populates sidebar sections
4. **Render:** Sidebar displays:
   - Trending Now (sorted by recency, numbered)
   - Weekly Deep Dives (with thumbnails and read time)
   - Curation Picks (from AI//24 Picks)
5. **Interactions:** Click any item to navigate
6. **Sticky:** Sidebar stays visible as user scrolls

---

## ✅ Status

All three sidebar sections are **fully functional** and **production-ready**:
- ✅ Data fetching working
- ✅ Navigation implemented
- ✅ Responsive design verified
- ✅ Hover effects active
- ✅ Real-time updates from database

**You can now see trending articles, deep dives, and curated picks live on the Home page!**
