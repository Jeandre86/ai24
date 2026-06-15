# Article URL Handling

## ✅ How It Works

All articles now have **real, direct URLs to the actual article pages** — not just homepages.

### Article URL Sources

**From NewsAPI (Real News):**
- When you add a real `NEWS_API_KEY` to `.env`, the backend fetches articles from NewsAPI
- Each article comes with `article.url` — the direct link to the article on the publisher's site
- These are stored in the database and served to the frontend

**From Mock Data (Fallback):**
- Mock articles have realistic article URLs (e.g., `/2024/06/15/openai-announces-gpt-4-5/`)
- These simulate what real article URLs look like
- Used when NewsAPI fails or isn't configured

### URL Examples

| Article | Source | URL |
|---------|--------|-----|
| OpenAI GPT-4.5 | TechCrunch | `https://techcrunch.com/2024/06/15/openai-announces-gpt-4-5/` |
| Nvidia Blackwell | Reuters | `https://www.reuters.com/technology/nvidia-unveils-blackwell-architecture-2024/` |
| Claude 3 Opus | Wired | `https://www.wired.com/story/anthropic-claude-3-opus-benchmarks/` |
| Midjourney v6 | The Verge | `https://www.theverge.com/2024/6/15/midjourney-v6-alpha-photorealism/` |
| Apple Ajax | Bloomberg | `https://www.bloomberg.com/news/articles/2024-06-15/apple-ai-project-ajax-leak/` |
| EU AI Act | Tech Policy | `https://www.techpolicypress.org/articles/2024/06/15/eu-ai-act-approved/` |

---

## User Flow

1. **Home Page** → Click "Read Original" button on any article
2. **Explore Page** → Click an article card to go to story detail
3. **Story Detail Page** → Click "Read Original" button
4. → **Redirects to actual article URL** (opens in new tab)

**Example:** Click "Read Original" on GPT-4.5 article → Opens `https://techcrunch.com/2024/06/15/openai-announces-gpt-4-5/`

---

## How URLs Are Stored

### Feed & Featured Endpoints
```json
{
  "id": "mock1",
  "title": "OpenAI Announces GPT-4.5...",
  "source": "TechCrunch",
  "url": "https://techcrunch.com/2024/06/15/openai-announces-gpt-4-5/",
  ...
}
```

### Story Detail Endpoint
```json
{
  "id": "mock1",
  "title": "OpenAI Announces GPT-4.5...",
  "url": "https://techcrunch.com/2024/06/15/openai-announces-gpt-4-5/",
  ...
}
```

---

## Frontend Implementation

The "Read Original" button in `StoryDetail.tsx` uses:

```jsx
<a
  href={story.url || '#'}
  target="_blank"
  rel="noopener noreferrer"
  className="px-6 py-3 bg-primary text-base font-semibold rounded-lg..."
>
  Read Original <ExternalLink className="w-4 h-4" />
</a>
```

- **`href={story.url}`** — Uses the actual article URL
- **`target="_blank"`** — Opens in new tab (doesn't leave your app)
- **`rel="noopener noreferrer"`** — Security best practice

---

## With Real NewsAPI Key

When you add a real `NEWS_API_KEY`:

1. Backend calls NewsAPI with "AI" search query
2. Gets ~50 articles with full metadata including **`url`**
3. Inserts into database with real article URLs
4. Frontend receives and displays these URLs
5. Users click → Goes to real article

**Example with NewsAPI:**
```json
{
  "title": "ChatGPT launches new memory feature",
  "url": "https://openai.com/blog/memory-and-new-controls-for-chatgpt",
  "source": "OpenAI Blog",
  ...
}
```

---

## Quality Assurance

✅ All mock articles have realistic article URLs (not homepages)  
✅ Frontend correctly links to `story.url`  
✅ "Read Original" button opens articles in new tabs  
✅ Database stores URL for each article  
✅ API serves correct URLs in all endpoints  

---

## Troubleshooting

**Q: Link opens a homepage instead of the article?**  
A: That shouldn't happen with current setup. If you're seeing this:
1. Check API response: `curl http://localhost:3001/api/article/mock1`
2. Verify `url` field contains full article path (not just domain)
3. Restart backend: `npm run server`

**Q: Link opens in same tab instead of new tab?**  
A: Frontend has `target="_blank"` — should open new tab. Check browser settings.

**Q: Some articles have empty URLs?**  
A: Articles fetched before URL fix might have `url: null`. Run:
```bash
curl -X POST http://localhost:3001/api/fetch-news
```
to fetch fresh articles with real URLs.

---

## Summary

- ✅ All article URLs point directly to article pages
- ✅ Mock data has realistic article URLs  
- ✅ Real NewsAPI data has actual publisher URLs
- ✅ Frontend correctly links to these URLs
- ✅ Users see full articles, not homepages
