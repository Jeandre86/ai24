import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import cron from 'node-cron';
import axios from 'axios';
import Database from 'better-sqlite3';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();
const PORT = process.env.PORT || 3001;

// Initialize SQLite database
const dbPath = path.join(__dirname, 'articles.db');
const db = new Database(dbPath);

// Create articles table if it doesn't exist
db.exec(`
  CREATE TABLE IF NOT EXISTS articles (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    dek TEXT,
    category TEXT,
    source TEXT,
    readTime TEXT,
    time TEXT,
    image TEXT,
    url TEXT,
    published_at DATETIME,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    is_featured BOOLEAN DEFAULT 0
  );
`);

app.use(cors());
app.use(express.json());

// Function to fetch AI news from NewsAPI
async function fetchAINews() {
  try {
    const apiKey = process.env.NEWS_API_KEY || 'demo'; // Using demo key for now
    const query = 'AI OR artificial intelligence OR machine learning OR deep learning';

    // Using NewsAPI (free tier available)
    const url = `https://newsapi.org/v2/everything?q=${encodeURIComponent(query)}&sortBy=publishedAt&language=en&pageSize=50`;

    console.log('Fetching AI news...');

    try {
      const response = await axios.get(url, {
        headers: { 'X-Api-Key': apiKey },
        timeout: 10000
      });

      if (response.data.articles) {
        const articles = response.data.articles.map((article, index) => {
          const id = `article_${Date.now()}_${index}`;
          const title = article.title || 'Untitled';
          const dek = article.description || '';
          const source = article.source?.name || 'Unknown Source';
          const image = article.urlToImage || 'https://images.unsplash.com/photo-1573164713988-8665fc963095?auto=format&fit=crop&q=80&w=400';
          const publishedAt = article.publishedAt || new Date().toISOString();
          const readTime = `${Math.ceil(article.content?.length / 200 || 5)} min read`;
          const category = categorizeArticle(title + ' ' + dek);
          const time = formatTime(new Date(publishedAt));

          return {
            id,
            title,
            dek,
            category,
            source,
            readTime,
            time,
            image,
            url: article.url,
            published_at: publishedAt
          };
        });

        // Insert articles into database
        const stmt = db.prepare(`
          INSERT OR IGNORE INTO articles
          (id, title, dek, category, source, readTime, time, image, url, published_at)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `);

        let inserted = 0;
        for (const article of articles) {
          try {
            stmt.run(
              article.id,
              article.title,
              article.dek,
              article.category,
              article.source,
              article.readTime,
              article.time,
              article.image,
              article.url,
              article.published_at
            );
            inserted++;
          } catch (e) {
            console.error('Error inserting article:', e.message);
          }
        }

        console.log(`Successfully inserted ${inserted} new articles`);
        return articles;
      }
    } catch (apiError) {
      console.error('NewsAPI Error:', apiError.message);
      // Try Hacker News fallback
      try {
        return await fetchFromHackerNews();
      } catch (hnError) {
        console.error('Hacker News Error:', hnError.message);
        return getMockArticles();
      }
    }
  } catch (error) {
    console.error('Error fetching AI news:', error.message);
    return getMockArticles();
  }
}

// Fetch AI news from Hacker News API
async function fetchFromHackerNews() {
  try {
    console.log('Fetching from Hacker News API...');

    // Get top stories IDs
    const topStoriesRes = await axios.get('https://hacker-news.firebaseio.com/v0/topstories.json', {
      timeout: 10000
    });

    const storyIds = topStoriesRes.data.slice(0, 100);
    const articles = [];

    // Fetch individual stories
    for (let i = 0; i < storyIds.length && articles.length < 50; i++) {
      try {
        const storyRes = await axios.get(`https://hacker-news.firebaseio.com/v0/item/${storyIds[i]}.json`, {
          timeout: 5000
        });

        const story = storyRes.data;

        // Only include stories with URLs (skip text posts)
        if (story && story.url && story.title && story.by) {
          // Filter for AI-related stories
          const titleLower = story.title.toLowerCase();
          const isAIRelated = titleLower.includes('ai') || titleLower.includes('artificial') ||
                             titleLower.includes('machine') || titleLower.includes('learning') ||
                             titleLower.includes('gpt') || titleLower.includes('claude') ||
                             titleLower.includes('model') || titleLower.includes('neural') ||
                             titleLower.includes('deep') || titleLower.includes('llm') ||
                             titleLower.includes('algorithm') || titleLower.includes('data');

          if (isAIRelated) {
            articles.push({
              id: `hn_${story.id}`,
              title: story.title,
              dek: `${story.score || 0} points, ${story.descendants || 0} comments on Hacker News`,
              category: categorizeArticle(story.title),
              source: extractDomain(story.url),
              readTime: `${Math.ceil(Math.random() * 10) + 2} min read`,
              time: formatTime(new Date(story.time * 1000)),
              image: 'https://images.unsplash.com/photo-1573164713988-8665fc963095?auto=format&fit=crop&q=80&w=400',
              url: story.url,
              published_at: new Date(story.time * 1000).toISOString()
            });
          }
        }
      } catch (e) {
        continue; // Skip errors, try next story
      }
    }

    if (articles.length === 0) {
      throw new Error('No AI articles found');
    }

    console.log(`Found ${articles.length} AI articles from Hacker News`);
    return articles;
  } catch (error) {
    console.error('Hacker News fetch error:', error.message);
    throw error;
  }
}

// Extract domain name from URL
function extractDomain(url) {
  try {
    const urlObj = new URL(url);
    let domain = urlObj.hostname.replace('www.', '');
    // Capitalize first letter
    return domain.charAt(0).toUpperCase() + domain.slice(1);
  } catch (e) {
    return 'Article';
  }
}

// Categorize articles based on keywords
function categorizeArticle(text) {
  const lowerText = text.toLowerCase();
  if (lowerText.includes('model') || lowerText.includes('gpt') || lowerText.includes('claude')) return 'AI Models';
  if (lowerText.includes('chip') || lowerText.includes('nvidia') || lowerText.includes('gpu')) return 'Hardware';
  if (lowerText.includes('regulation') || lowerText.includes('policy') || lowerText.includes('law')) return 'Policy';
  if (lowerText.includes('image') || lowerText.includes('generation') || lowerText.includes('midjourney')) return 'Generative Art';
  if (lowerText.includes('business') || lowerText.includes('deal') || lowerText.includes('partnership')) return 'Business';
  return 'Updates';
}

// Format time as "Xh ago", "Xm ago", etc.
function formatTime(date) {
  const now = new Date();
  const diff = now - date;
  const seconds = Math.floor(diff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (seconds < 60) return 'now';
  if (minutes < 60) return `${minutes}m ago`;
  if (hours < 24) return `${hours}h ago`;
  return `${days}d ago`;
}

// Get mock articles for fallback
function getMockArticles() {
  return [
    {
      id: 'mock1',
      title: 'What is GPT-4? | OpenAI',
      dek: 'GPT-4 is a large multimodal model that can accept image and text inputs and emit text outputs. Learn about its capabilities and research.',
      category: 'AI Models',
      source: 'OpenAI',
      readTime: '5 min read',
      time: '2h ago',
      image: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&q=80&w=1600',
      url: 'https://openai.com/research/gpt-4',
      published_at: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString()
    },
    {
      id: 'mock2',
      title: 'Introduction to Machine Learning - Google Developers',
      dek: 'Get started with machine learning and learn the fundamental concepts from Google. Comprehensive guide for beginners.',
      category: 'Updates',
      source: 'Google',
      readTime: '8 min read',
      time: '5h ago',
      image: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&q=80&w=400',
      url: 'https://developers.google.com/machine-learning/intro-to-ml',
      published_at: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString()
    },
    {
      id: 'mock3',
      title: 'LLaMA: Open and Efficient Foundation Language Models',
      dek: 'Meta releases LLaMA, a collection of foundation language models ranging from 7B to 65B parameters.',
      category: 'AI Models',
      source: 'Meta',
      readTime: '6 min read',
      time: '6h ago',
      image: 'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?auto=format&fit=crop&q=80&w=800',
      url: 'https://research.facebook.com/publications/llama-open-and-efficient-foundation-language-models/',
      published_at: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString()
    },
    {
      id: 'mock4',
      title: 'Stable Diffusion 3 - Stability AI',
      dek: 'State-of-the-art text-to-image generation model with improved performance, efficiency and understanding.',
      category: 'Generative Art',
      source: 'Stability AI',
      readTime: '5 min read',
      time: '4h ago',
      image: 'https://images.unsplash.com/photo-1686191128892-3b37013f14ed?auto=format&fit=crop&q=80&w=800',
      url: 'https://stability.ai/news/stable-diffusion-3',
      published_at: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString()
    },
    {
      id: 'mock5',
      title: 'Claude - An AI Assistant Made by Anthropic',
      dek: 'Learn about Claude, a state-of-the-art AI assistant optimized for helpfulness, harmlessness, and honesty.',
      category: 'AI Models',
      source: 'Anthropic',
      readTime: '6 min read',
      time: '3h ago',
      image: 'https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?auto=format&fit=crop&q=80&w=400',
      url: 'https://www.anthropic.com/claude',
      published_at: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString()
    },
    {
      id: 'mock6',
      title: 'Artificial Intelligence - Wikipedia',
      dek: 'Comprehensive overview of artificial intelligence, its history, applications, branches, research areas and future implications.',
      category: 'Policy',
      source: 'Wikipedia',
      readTime: '15 min read',
      time: '14h ago',
      image: 'https://images.unsplash.com/photo-1589829085413-56de8ae18c73?auto=format&fit=crop&q=80&w=400',
      url: 'https://en.wikipedia.org/wiki/Artificial_intelligence',
      published_at: new Date(Date.now() - 14 * 60 * 60 * 1000).toISOString()
    }
  ];
}

// API Routes

// Get featured articles for home page (latest 3)
app.get('/api/featured', (req, res) => {
  try {
    const articles = db.prepare(`
      SELECT * FROM articles
      ORDER BY published_at DESC
      LIMIT 3
    `).all();
    res.json(articles || getMockArticles().slice(0, 3));
  } catch (error) {
    console.error('Error fetching featured articles:', error);
    res.json(getMockArticles().slice(0, 3));
  }
});

// Get feed articles for home page (latest 6)
app.get('/api/feed', (req, res) => {
  try {
    const articles = db.prepare(`
      SELECT * FROM articles
      ORDER BY published_at DESC
      LIMIT 6
    `).all();
    res.json(articles || getMockArticles());
  } catch (error) {
    console.error('Error fetching feed articles:', error);
    res.json(getMockArticles());
  }
});

// Get all articles for explore page with pagination
app.get('/api/explore', (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 24;
    const offset = (page - 1) * limit;

    const articles = db.prepare(`
      SELECT * FROM articles
      ORDER BY published_at DESC
      LIMIT ? OFFSET ?
    `).all(limit, offset);

    const total = db.prepare('SELECT COUNT(*) as count FROM articles').get();

    res.json({
      articles: articles || getMockArticles(),
      total: total.count,
      page,
      limit,
      pages: Math.ceil(total.count / limit)
    });
  } catch (error) {
    console.error('Error fetching explore articles:', error);
    res.json({
      articles: getMockArticles(),
      total: 2,
      page: 1,
      limit: 24,
      pages: 1
    });
  }
});

// Get single article by ID
app.get('/api/article/:id', (req, res) => {
  try {
    const article = db.prepare('SELECT * FROM articles WHERE id = ?').get(req.params.id);
    if (article) {
      res.json(article);
    } else {
      res.status(404).json({ error: 'Article not found' });
    }
  } catch (error) {
    console.error('Error fetching article:', error);
    res.status(500).json({ error: 'Error fetching article' });
  }
});

// Manually trigger news fetch (for testing)
app.post('/api/fetch-news', async (req, res) => {
  try {
    const articles = await fetchAINews();
    res.json({ success: true, count: articles.length });
  } catch (error) {
    console.error('Error in manual fetch:', error);
    res.status(500).json({ error: 'Error fetching news' });
  }
});

// Schedule news fetching every 24 hours
cron.schedule('0 0 * * *', async () => {
  console.log('Running scheduled news fetch at', new Date().toISOString());
  await fetchAINews();
});

// Initial setup on server start
async function initializeDatabase() {
  try {
    const count = db.prepare('SELECT COUNT(*) as count FROM articles').get();
    if (count.count === 0) {
      console.log('Database is empty, inserting initial mock articles...');
      const mockArticles = getMockArticles();
      const stmt = db.prepare(`
        INSERT OR IGNORE INTO articles
        (id, title, dek, category, source, readTime, time, image, url, published_at)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `);

      for (const article of mockArticles) {
        stmt.run(
          article.id,
          article.title,
          article.dek,
          article.category,
          article.source,
          article.readTime,
          article.time,
          article.image,
          article.url,
          article.published_at
        );
      }
      console.log(`Inserted ${mockArticles.length} initial articles`);
    }
  } catch (error) {
    console.error('Error initializing database:', error.message);
  }
}

console.log('Initializing database...');
await initializeDatabase();

console.log('Fetching fresh articles...');
await fetchAINews();

app.listen(PORT, () => {
  console.log(`Backend server running on http://localhost:${PORT}`);
  console.log('API endpoints:');
  console.log(`  GET  /api/featured  - Latest 3 articles for home hero`);
  console.log(`  GET  /api/feed      - Latest 6 articles for home feed`);
  console.log(`  GET  /api/explore   - All articles with pagination`);
  console.log(`  GET  /api/article/:id - Single article details`);
  console.log(`  POST /api/fetch-news - Manually trigger news fetch`);
});
