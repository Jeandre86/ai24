# AI//24 Setup Guide

## ✅ What's Been Done

Your AI//24 news digest now has:

### Backend (Node.js + Express + SQLite)
- **server.js** — Express API with auto-generated SQLite database
- **Scheduled updates** — Cron job runs every 24 hours at midnight (configurable)
- **NewsAPI integration** — Fetches ~50 AI news articles per update
- **Smart categorization** — Auto-categorizes articles (AI Models, Hardware, Policy, etc.)
- **Fallback mock data** — Uses dummy articles if NewsAPI fails
- **Manual trigger** — Endpoint to fetch immediately for testing: `POST /api/fetch-news`

### Frontend (React updates)
- **Home page** — Fetches `/api/featured` (3 latest) + `/api/feed` (6 latest) 
- **Explore page** — Fetches `/api/explore` with pagination (24 articles per page)
- **Story detail** — Fetches individual articles by ID with external link
- **All articles persist** — Old + new articles stay in SQLite for browsing

### Database
- **articles.db** — Auto-created SQLite database
- **Stores:** title, description, category, source, image, URL, publish date, etc.
- **Survives** server restarts (persistent storage)

---

## 🚀 Getting Started

### 1. Add Your NewsAPI Key (Optional)

To fetch real AI news instead of mock data:

1. Get free API key: https://newsapi.org/register (2 min signup)
2. Open `.env` in the project root
3. Replace `NEWS_API_KEY=demo` with your actual key:
   ```
   NEWS_API_KEY=your_actual_key_here
   ```
4. Restart backend: `npm run server`

### 2. Start the App

**Both servers (recommended):**
```bash
npm run dev:all
```
- Backend on: http://localhost:3001
- Frontend on: http://localhost:5173

**Or separately:**
```bash
npm run server   # Backend only (http://localhost:3001)
npm run dev      # Frontend only (http://localhost:5173)
```

### 3. Test It Out

- **Home page:** Shows latest articles
- **Explore:** Browse all articles with "Previous/Next" pagination
- **Click any article:** View full story with "Read Original" button

---

## 🔧 API Endpoints

All requests go to `http://localhost:3001`:

| Method | Endpoint | Returns |
|--------|----------|---------|
| GET | `/api/featured` | 3 latest articles (for home hero) |
| GET | `/api/feed` | 6 latest articles (for home feed) |
| GET | `/api/explore?page=1&limit=24` | All articles with pagination |
| GET | `/api/article/:id` | Single article details |
| POST | `/api/fetch-news` | Trigger news fetch immediately |

**Example:** Fetch articles immediately for testing:
```bash
curl -X POST http://localhost:3001/api/fetch-news
```

---

## 📅 Automatic Updates

The backend automatically fetches fresh AI news **every 24 hours at midnight UTC**.

To change the schedule, edit `server.js` and modify this line:
```javascript
cron.schedule('0 0 * * *', async () => {  // 0 0 = midnight UTC
  console.log('Running scheduled news fetch at', new Date().toISOString());
  await fetchAINews();
});
```

**Cron syntax:** `minute hour day month weekday`
- `0 0 * * *` = Every day at midnight
- `0 6 * * *` = Every day at 6 AM
- `0 */6 * * *` = Every 6 hours

---

## 📦 Tech Stack

- **Frontend:** React 18 + TypeScript + Tailwind CSS + Vite
- **Backend:** Node.js + Express + SQLite (better-sqlite3)
- **Scheduling:** node-cron
- **Data fetching:** axios + NewsAPI
- **Styling:** Framer Motion animations

---

## 🗄️ Database

SQLite database auto-created at `articles.db`.

**View articles in database:**
```bash
sqlite3 articles.db "SELECT COUNT(*) as total_articles FROM articles;"
sqlite3 articles.db "SELECT title, source, time FROM articles LIMIT 5;"
```

**Reset database (clear all articles):**
```bash
rm articles.db
npm run server  # Creates fresh database
```

---

## 🎨 Text Colors (Already Set)

- **"Latest News" header:** #f5f5f5 (light gray)
- **Story titles on hover:** rgb(99 102 241) (accent indigo)

---

## 📝 Environment Variables (.env)

```env
PORT=3001                    # Backend port
NEWS_API_KEY=demo           # Replace with your NewsAPI key
NODE_ENV=development        # development or production
```

---

## 🆘 Troubleshooting

**Q: Backend not fetching real news**
- A: Add your NewsAPI key to `.env` and restart backend

**Q: Articles not showing on home page**
- A: Wait 5 seconds, then refresh. Backend might be fetching on startup.

**Q: "Cannot GET /api/featured" error**
- A: Make sure backend is running on port 3001: `npm run server`

**Q: Database is empty**
- A: Restart backend—it fetches articles on startup

---

## 🎯 Next Steps

1. ✅ Get your NewsAPI key (https://newsapi.org)
2. ✅ Add it to `.env`
3. ✅ Run `npm run dev:all`
4. ✅ Check http://localhost:5173 to see live AI news
5. ✅ Articles auto-update every 24h

Enjoy your AI news digest! 🎉
