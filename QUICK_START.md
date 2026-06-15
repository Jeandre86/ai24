# AI//24 Quick Start

## Start the App (One Command)
```bash
npm run dev:all
```

**That's it!** Both servers start automatically:
- **Frontend:** http://localhost:5173
- **Backend:** http://localhost:3001

---

## What You Get

✅ **Home Page** — Shows 3 hero articles + 6 feed articles  
✅ **Explore Page** — All articles with pagination  
✅ **Story Pages** — Full article with "Read Original" link  
✅ **Auto Updates** — Fresh AI news every 24 hours at midnight UTC  
✅ **Persistent Database** — All articles saved in SQLite  

---

## Customization

### Change text color to something else
Edit `src/src/components/Feed.tsx` line 43 or 93:
```jsx
style={{ color: '#yourcolor' }}
```

### Change update schedule
Edit `server.js` line ~230:
```javascript
cron.schedule('0 0 * * *', async () => {  // Change this
  await fetchAINews();
});
```
Examples: `0 6 * * *` (6 AM), `0 */6 * * *` (every 6 hours)

### Use real NewsAPI
1. Get free key: https://newsapi.org/register
2. Update `.env`: `NEWS_API_KEY=your_key_here`
3. Restart backend

---

## API Routes

```
GET  http://localhost:3001/api/featured           → 3 latest
GET  http://localhost:3001/api/feed               → 6 latest
GET  http://localhost:3001/api/explore            → all with pagination
GET  http://localhost:3001/api/article/:id        → single article
POST http://localhost:3001/api/fetch-news         → force update now
```

---

## Troubleshooting

**Articles not showing?**  
→ Wait 5 seconds, then refresh page

**API 401 error?**  
→ That's OK! Uses mock data. Add real NewsAPI key to fix.

**Database empty?**  
→ Restart backend. It initializes with 6 mock articles.

**Need more articles?**  
→ `curl -X POST http://localhost:3001/api/fetch-news`

---

## Files to Know

- `server.js` — Backend with API + cron scheduler
- `src/pages/Home.tsx` — Home page (fetches API)
- `src/pages/Explore.tsx` — Explore page (fetches API + pagination)
- `src/pages/StoryDetail.tsx` — Article page (fetches API)
- `.env` — Configuration (NewsAPI key, port, etc.)
- `articles.db` — SQLite database (auto-created)

---

## Next?

- Read `SETUP_GUIDE.md` for detailed setup
- Read `IMPLEMENTATION_SUMMARY.md` for full technical details
- Deploy backend for production use

Enjoy! 🎉
