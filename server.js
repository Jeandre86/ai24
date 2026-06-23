import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import cron from 'node-cron';
import axios from 'axios';
import Database from 'better-sqlite3';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import * as cheerio from 'cheerio';

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
    content TEXT,
    published_at DATETIME,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    is_featured BOOLEAN DEFAULT 0,
    is_pick BOOLEAN DEFAULT 0,
    is_hidden BOOLEAN DEFAULT 0,
    source_enabled BOOLEAN DEFAULT 1
  );

  CREATE TABLE IF NOT EXISTS community_uploads (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    dek TEXT,
    category TEXT,
    uploader_name TEXT,
    readTime TEXT,
    image TEXT,
    url TEXT,
    published_at DATETIME,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    upvotes INTEGER DEFAULT 0
  );

  CREATE TABLE IF NOT EXISTS news_sources (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL UNIQUE,
    description TEXT,
    icon_url TEXT,
    enabled BOOLEAN DEFAULT 1,
    boost_level INTEGER DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS user_preferences (
    id TEXT PRIMARY KEY,
    source_id TEXT,
    enabled BOOLEAN DEFAULT 1,
    shortcut_enabled BOOLEAN DEFAULT 0,
    boost_level INTEGER DEFAULT 0,
    FOREIGN KEY(source_id) REFERENCES news_sources(id)
  );
`);

app.use(cors());
app.use(express.json());

// Pool of diverse article images
const articleImages = [
  'https://images.unsplash.com/photo-1573164713988-8665fc963095?auto=format&fit=crop&q=80&w=400', // AI/tech
  'https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&q=80&w=400', // Digital/AI
  'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&q=80&w=400', // Creative/AI
  'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?auto=format&fit=crop&q=80&w=400', // Computing
  'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&q=80&w=400', // Hardware
  'https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?auto=format&fit=crop&q=80&w=400', // Innovation
  'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=400', // Tech
  'https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&q=80&w=400', // Business
  'https://images.unsplash.com/photo-1460925895917-adf4e565e6b1?auto=format&fit=crop&q=80&w=400', // Analytics
  'https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&q=80&w=400', // Meeting
  'https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&q=80&w=400', // Team
  'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&q=80&w=400', // Laptop
  'https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&q=80&w=400', // Tech team
  'https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&q=80&w=400', // Code
  'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&q=80&w=400', // Startup
  'https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&q=80&w=400', // Office
  'https://images.unsplash.com/photo-1489749798305-4fea3ba63d60?auto=format&fit=crop&q=80&w=400', // Startup pitch
  'https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&q=80&w=400', // Workspace
  'https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&q=80&w=400', // Entrepreneur
  'https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&q=80&w=400'  // Tech meeting
];

// Get random image from pool
function getRandomImage(index) {
  return articleImages[index % articleImages.length];
}

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

    // Get top stories for maximum coverage
    const storyIds = topStoriesRes.data.slice(0, 150); // Fetch top 150 stories
    const articles = [];

    console.log(`Checking ${storyIds.length} stories for relevance...`);

    // Fetch individual stories
    for (let i = 0; i < storyIds.length && articles.length < 100; i++) { // Get up to 100 articles
      try {
        const storyRes = await axios.get(`https://hacker-news.firebaseio.com/v0/item/${storyIds[i]}.json`, {
          timeout: 5000
        });

        const story = storyRes.data;

        // Only include stories with URLs (skip text posts)
        if (story && story.url && story.title && story.by) {
          const titleLower = story.title.toLowerCase();

          // Expanded keywords for broader tech/AI/business news coverage
          const isRelevant =
            // AI/ML keywords
            titleLower.includes('ai') || titleLower.includes('artificial') ||
            titleLower.includes('machine') || titleLower.includes('learning') ||
            titleLower.includes('gpt') || titleLower.includes('claude') ||
            titleLower.includes('model') || titleLower.includes('neural') ||
            titleLower.includes('deep') || titleLower.includes('llm') ||
            titleLower.includes('algorithm') || titleLower.includes('data') ||
            titleLower.includes('automation') || titleLower.includes('robot') ||
            // Business leaders & companies
            titleLower.includes('bezos') || titleLower.includes('musk') ||
            titleLower.includes('jobs') || titleLower.includes('gates') ||
            titleLower.includes('amazon') || titleLower.includes('google') ||
            titleLower.includes('microsoft') || titleLower.includes('apple') ||
            titleLower.includes('meta') || titleLower.includes('tesla') ||
            titleLower.includes('openai') || titleLower.includes('anthropic') ||
            titleLower.includes('stable') || titleLower.includes('midjourney') ||
            // Tech trends
            titleLower.includes('blockchain') || titleLower.includes('crypto') ||
            titleLower.includes('quantum') || titleLower.includes('chip') ||
            titleLower.includes('gpu') || titleLower.includes('nvidia') ||
            titleLower.includes('software') || titleLower.includes('startup') ||
            titleLower.includes('tech') || titleLower.includes('innovation') ||
            titleLower.includes('programming') || titleLower.includes('code') ||
            titleLower.includes('developer') || titleLower.includes('engineering') ||
            // Investment & funding
            titleLower.includes('funding') || titleLower.includes('investment') ||
            titleLower.includes('venture') || titleLower.includes('billion') ||
            titleLower.includes('acquisition') || titleLower.includes('ipo') ||
            // Research & breakthroughs
            titleLower.includes('research') || titleLower.includes('breakthrough') ||
            titleLower.includes('discovery') || titleLower.includes('study') ||
            titleLower.includes('paper') || titleLower.includes('science');

          if (isRelevant) {
            articles.push({
              id: `hn_${story.id}`,
              title: story.title,
              dek: 'Latest news from ' + extractDomain(story.url),
              category: categorizeArticle(story.title),
              source: extractDomain(story.url),
              readTime: `${Math.ceil(Math.random() * 10) + 2} min read`,
              time: formatTime(new Date(story.time * 1000)),
              image: getRandomImage(articles.length),
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
      throw new Error('No relevant articles found');
    }

    // Insert all articles into database
    try {
      const stmt = db.prepare(`
        INSERT OR IGNORE INTO articles
        (id, title, dek, category, source, readTime, time, image, url, published_at)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `);

      let insertedCount = 0;
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
          insertedCount++;
        } catch (e) {
          // Skip duplicates silently
        }
      }
      console.log(`Inserted ${insertedCount} articles into database from Hacker News`);
    } catch (dbError) {
      console.error('Database insertion error:', dbError.message);
    }

    console.log(`Found ${articles.length} relevant articles from Hacker News`);
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

  // AI Models
  if (lowerText.includes('model') || lowerText.includes('gpt') || lowerText.includes('claude') ||
      lowerText.includes('llm') || lowerText.includes('neural') || lowerText.includes('algorithm')) {
    return 'AI Models';
  }

  // Hardware & Infrastructure
  if (lowerText.includes('chip') || lowerText.includes('nvidia') || lowerText.includes('gpu') ||
      lowerText.includes('gpu') || lowerText.includes('quantum') || lowerText.includes('processor')) {
    return 'Hardware';
  }

  // Business & Investment
  if (lowerText.includes('bezos') || lowerText.includes('musk') || lowerText.includes('funding') ||
      lowerText.includes('investment') || lowerText.includes('venture') || lowerText.includes('billion') ||
      lowerText.includes('acquisition') || lowerText.includes('startup') || lowerText.includes('ipo') ||
      lowerText.includes('business') || lowerText.includes('deal') || lowerText.includes('partnership')) {
    return 'Business';
  }

  // Generative Art & Creative AI
  if (lowerText.includes('image') || lowerText.includes('generation') || lowerText.includes('midjourney') ||
      lowerText.includes('stable') || lowerText.includes('creative') || lowerText.includes('art')) {
    return 'Generative Art';
  }

  // Policy & Regulation
  if (lowerText.includes('regulation') || lowerText.includes('policy') || lowerText.includes('law') ||
      lowerText.includes('act') || lowerText.includes('compliance') || lowerText.includes('ethics')) {
    return 'Policy';
  }

  // Research & Science
  if (lowerText.includes('research') || lowerText.includes('breakthrough') || lowerText.includes('discovery') ||
      lowerText.includes('study') || lowerText.includes('paper') || lowerText.includes('science')) {
    return 'Research';
  }

  // General updates
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
      image: articleImages[0],
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
      image: articleImages[1],
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
      image: articleImages[2],
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
      image: articleImages[3],
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
      image: articleImages[4],
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
      image: articleImages[5],
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

// Extract first N paragraphs from HTML content
function extractParagraphs(html, count = 3) {
  try {
    const $ = cheerio.load(html);
    const paragraphs = [];

    // Try to find paragraphs in common article containers
    const selectors = [
      'article p',
      '[class*="content"] p',
      '[class*="body"] p',
      '[class*="post"] p',
      'main p',
      'p'
    ];

    for (const selector of selectors) {
      $(selector).each(function () {
        if (paragraphs.length >= count) return false;
        const text = $(this).text().trim();
        if (text.length > 50) {
          paragraphs.push(text);
        }
      });
      if (paragraphs.length >= count) break;
    }

    return paragraphs.slice(0, count);
  } catch (error) {
    console.error('Error extracting paragraphs:', error);
    return [];
  }
}

// Get article content from URL
async function fetchArticleContent(url) {
  try {
    const response = await axios.get(url, {
      timeout: 10000,
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; AI24-NewsBot/1.0)'
      }
    });

    const paragraphs = extractParagraphs(response.data, 3);
    return paragraphs.length > 0 ? paragraphs : null;
  } catch (error) {
    console.error(`Error fetching content from ${url}:`, error.message);
    return null;
  }
}

// Get single article by ID
app.get('/api/article/:id', async (req, res) => {
  try {
    const article = db.prepare('SELECT * FROM articles WHERE id = ?').get(req.params.id);
    if (article) {
      // Try to fetch full content if not already cached
      if (!article.content && article.url) {
        const content = await fetchArticleContent(article.url);
        if (content) {
          // Cache the content in database
          db.prepare('UPDATE articles SET content = ? WHERE id = ?').run(
            JSON.stringify(content),
            req.params.id
          );
          article.content = content;
        }
      } else if (article.content) {
        article.content = JSON.parse(article.content);
      }

      res.json(article);
    } else {
      res.status(404).json({ error: 'Article not found' });
    }
  } catch (error) {
    console.error('Error fetching article:', error);
    res.status(500).json({ error: 'Error fetching article' });
  }
});

// Get categories with counts
app.get('/api/categories', (req, res) => {
  try {
    const categories = db.prepare(`
      SELECT category, COUNT(*) as count
      FROM articles
      GROUP BY category
      ORDER BY count DESC
    `).all();

    res.json(categories || []);
  } catch (error) {
    console.error('Error fetching categories:', error);
    res.status(500).json({ error: 'Error fetching categories' });
  }
});

// Get articles by category
app.get('/api/category/:category', (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 24;
    const offset = (page - 1) * limit;
    const category = req.params.category;

    const articles = db.prepare(`
      SELECT * FROM articles
      WHERE category = ?
      ORDER BY published_at DESC
      LIMIT ? OFFSET ?
    `).all(category, limit, offset);

    const total = db.prepare('SELECT COUNT(*) as count FROM articles WHERE category = ?').get(category);

    res.json({
      articles: articles || [],
      total: total.count,
      category,
      page,
      limit,
      pages: Math.ceil(total.count / limit)
    });
  } catch (error) {
    console.error('Error fetching category articles:', error);
    res.status(500).json({ error: 'Error fetching category articles' });
  }
});

// Manually trigger news fetch (for testing / manual refresh)
app.post('/api/fetch-news', async (req, res) => {
  try {
    console.log('Manual news fetch triggered');
    const articles = await fetchAINews();
    const count = db.prepare('SELECT COUNT(*) as count FROM articles').get();
    res.json({
      success: true,
      fetched: articles.length,
      totalInDatabase: count.count
    });
  } catch (error) {
    console.error('Error in manual fetch:', error);
    res.status(500).json({ error: 'Error fetching news' });
  }
});

// Get database statistics
app.get('/api/stats', (req, res) => {
  try {
    const articles = db.prepare('SELECT COUNT(*) as count FROM articles').get();
    const oldestArticle = db.prepare('SELECT published_at FROM articles ORDER BY published_at ASC LIMIT 1').get();
    const newestArticle = db.prepare('SELECT published_at FROM articles ORDER BY published_at DESC LIMIT 1').get();

    res.json({
      totalArticles: articles.count,
      oldestArticle: oldestArticle?.published_at || null,
      newestArticle: newestArticle?.published_at || null
    });
  } catch (error) {
    console.error('Error fetching stats:', error);
    res.status(500).json({ error: 'Error fetching stats' });
  }
});

// AI//24 Picks - Curated articles
app.get('/api/picks', (req, res) => {
  try {
    const picks = db.prepare(`
      SELECT * FROM articles
      WHERE is_pick = 1 AND is_hidden = 0
      ORDER BY published_at DESC
      LIMIT 10
    `).all();
    res.json(picks || []);
  } catch (error) {
    console.error('Error fetching picks:', error);
    res.status(500).json({ error: 'Error fetching picks' });
  }
});

// Community Uploads
app.get('/api/community', (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 12;
    const offset = (page - 1) * limit;

    const uploads = db.prepare(`
      SELECT * FROM community_uploads
      ORDER BY upvotes DESC, published_at DESC
      LIMIT ? OFFSET ?
    `).all(limit, offset);

    const total = db.prepare('SELECT COUNT(*) as count FROM community_uploads').get();

    res.json({
      uploads: uploads || [],
      total: total.count,
      page,
      limit,
      pages: Math.ceil(total.count / limit)
    });
  } catch (error) {
    console.error('Error fetching community uploads:', error);
    res.status(500).json({ error: 'Error fetching community uploads' });
  }
});

// Submit community upload
app.post('/api/community/upload', (req, res) => {
  try {
    const { title, dek, category, uploader_name, readTime, image, url } = req.body;
    const id = `community_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    db.prepare(`
      INSERT INTO community_uploads
      (id, title, dek, category, uploader_name, readTime, image, url, published_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      id,
      title,
      dek,
      category,
      uploader_name,
      readTime,
      image,
      url,
      new Date().toISOString()
    );

    res.json({ success: true, id });
  } catch (error) {
    console.error('Error uploading community content:', error);
    res.status(500).json({ error: 'Error uploading content' });
  }
});

// News sources - Get all available sources
app.get('/api/sources', (req, res) => {
  try {
    const sources = db.prepare('SELECT * FROM news_sources ORDER BY name').all();
    res.json(sources || []);
  } catch (error) {
    console.error('Error fetching sources:', error);
    res.status(500).json({ error: 'Error fetching sources' });
  }
});

// User preferences - Get user's source preferences
app.get('/api/preferences', (req, res) => {
  try {
    const prefs = db.prepare(`
      SELECT
        ns.id, ns.name, ns.description, ns.icon_url,
        COALESCE(up.enabled, 1) as enabled,
        COALESCE(up.shortcut_enabled, 0) as shortcut_enabled,
        COALESCE(up.boost_level, 0) as boost_level
      FROM news_sources ns
      LEFT JOIN user_preferences up ON ns.id = up.source_id
      ORDER BY ns.name
    `).all();
    res.json(prefs || []);
  } catch (error) {
    console.error('Error fetching preferences:', error);
    res.status(500).json({ error: 'Error fetching preferences' });
  }
});

// Update source preference
app.put('/api/preferences/:sourceId', (req, res) => {
  try {
    const { sourceId } = req.params;
    const { enabled, shortcut_enabled, boost_level } = req.body;

    const existing = db.prepare('SELECT id FROM user_preferences WHERE source_id = ?').get(sourceId);

    if (existing) {
      db.prepare(`
        UPDATE user_preferences
        SET enabled = ?, shortcut_enabled = ?, boost_level = ?
        WHERE source_id = ?
      `).run(enabled ? 1 : 0, shortcut_enabled ? 1 : 0, boost_level || 0, sourceId);
    } else {
      const prefId = `pref_${sourceId}_${Date.now()}`;
      db.prepare(`
        INSERT INTO user_preferences
        (id, source_id, enabled, shortcut_enabled, boost_level)
        VALUES (?, ?, ?, ?, ?)
      `).run(prefId, sourceId, enabled ? 1 : 0, shortcut_enabled ? 1 : 0, boost_level || 0);
    }

    res.json({ success: true });
  } catch (error) {
    console.error('Error updating preference:', error);
    res.status(500).json({ error: 'Error updating preference' });
  }
});

// Hide article
app.put('/api/article/:id/hide', (req, res) => {
  try {
    const { id } = req.params;
    db.prepare('UPDATE articles SET is_hidden = 1 WHERE id = ?').run(id);
    res.json({ success: true });
  } catch (error) {
    console.error('Error hiding article:', error);
    res.status(500).json({ error: 'Error hiding article' });
  }
});

// Upvote community upload
app.post('/api/community/:id/upvote', (req, res) => {
  try {
    const { id } = req.params;
    db.prepare('UPDATE community_uploads SET upvotes = upvotes + 1 WHERE id = ?').run(id);
    const updated = db.prepare('SELECT upvotes FROM community_uploads WHERE id = ?').get(id);
    res.json({ success: true, upvotes: updated.upvotes });
  } catch (error) {
    console.error('Error upvoting:', error);
    res.status(500).json({ error: 'Error upvoting' });
  }
});

// Schedule news fetching every 24 hours at midnight UTC
cron.schedule('0 0 * * *', async () => {
  console.log('Running scheduled news fetch at', new Date().toISOString());
  try {
    // Remove articles older than 7 days to prevent database bloat
    const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString();
    const deleted = db.prepare('DELETE FROM articles WHERE published_at < ?').run(sevenDaysAgo);
    console.log(`Cleaned up ${deleted.changes} old articles`);

    // Fetch new articles
    await fetchAINews();

    const count = db.prepare('SELECT COUNT(*) as count FROM articles').get();
    console.log(`Database now has ${count.count} articles`);
  } catch (error) {
    console.error('Error in scheduled news fetch:', error.message);
  }
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

    // Initialize news sources
    const sourcesCount = db.prepare('SELECT COUNT(*) as count FROM news_sources').get();
    if (sourcesCount.count === 0) {
      console.log('Initializing default news sources...');
      const defaultSources = [
        { id: 'hacker-news', name: 'Hacker News', description: 'Tech & startup news', enabled: 1 },
        { id: 'techcrunch', name: 'TechCrunch', description: 'Technology trends', enabled: 1 },
        { id: 'arxiv', name: 'arXiv', description: 'AI & ML research papers', enabled: 1 },
        { id: 'medium', name: 'Medium', description: 'Tech & AI articles', enabled: 1 },
        { id: 'twitter-x', name: 'Twitter/X', description: 'Real-time tech news', enabled: 1 },
        { id: 'github-trending', name: 'GitHub Trending', description: 'Popular open-source projects', enabled: 1 },
        { id: 'news-api', name: 'News API', description: 'General AI & tech news', enabled: 1 },
        { id: 'vaibhav-sisinty', name: 'Vaibhav Sisinty (YouTube)', description: 'AI & tech insights from Vaibhav Sisinty YouTube channel', enabled: 1 },
        { id: 'staying-ahead-ai', name: 'Staying Ahead AI', description: 'Premium AI insights & analysis from stayingahead.ai', enabled: 1 }
      ];

      const stmt = db.prepare(`
        INSERT OR IGNORE INTO news_sources
        (id, name, description, enabled)
        VALUES (?, ?, ?, ?)
      `);

      for (const source of defaultSources) {
        stmt.run(source.id, source.name, source.description, source.enabled);
      }
      console.log(`Initialized ${defaultSources.length} news sources`);
    }

    // Mark top 5 articles as AI//24 Picks if none exist
    const picksCount = db.prepare('SELECT COUNT(*) as count FROM articles WHERE is_pick = 1').get();
    if (picksCount.count === 0) {
      console.log('Creating AI//24 Picks from top articles...');
      db.prepare(`
        UPDATE articles SET is_pick = 1
        WHERE id IN (
          SELECT id FROM articles
          ORDER BY published_at DESC
          LIMIT 5
        )
      `).run();
    }
  } catch (error) {
    console.error('Error initializing database:', error.message);
  }
}

console.log('Initializing database...');
await initializeDatabase();

// Check if we need fresh articles
const articleCount = db.prepare('SELECT COUNT(*) as count FROM articles').get();
const newestArticle = db.prepare('SELECT published_at FROM articles ORDER BY published_at DESC LIMIT 1').get();

// Fetch fresh articles if:
// 1. Database is empty (less than 10 articles)
// 2. OR newest article is older than 24 hours
const needsFreshArticles = articleCount.count < 10;
const lastArticleTime = newestArticle ? new Date(newestArticle.published_at).getTime() : 0;
const hoursSinceLastArticle = (Date.now() - lastArticleTime) / (1000 * 60 * 60);
const isStale = hoursSinceLastArticle > 24;

if (needsFreshArticles || isStale) {
  console.log(`Fetching fresh articles (count: ${articleCount.count}, hours since last: ${hoursSinceLastArticle.toFixed(1)})...`);
  await fetchAINews();
} else {
  console.log(`Database has ${articleCount.count} articles, newest from ${hoursSinceLastArticle.toFixed(1)} hours ago`);
}

app.listen(PORT, () => {
  console.log(`Backend server running on http://localhost:${PORT}`);
  console.log('API endpoints:');
  console.log(`  GET  /api/featured  - Latest 3 articles for home hero`);
  console.log(`  GET  /api/feed      - Latest 6 articles for home feed`);
  console.log(`  GET  /api/explore   - All articles with pagination`);
  console.log(`  GET  /api/article/:id - Single article details`);
  console.log(`  POST /api/fetch-news - Manually trigger news fetch`);
});
