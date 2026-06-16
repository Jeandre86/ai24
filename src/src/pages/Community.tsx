import React, { useState, useEffect } from 'react';
import { Upload, ThumbsUp } from 'lucide-react';
import { Link } from 'react-router-dom';
import { DEFAULT_IMAGE, getFallbackImage } from '../utils/imageHandler';

interface Upload {
  id: string;
  title: string;
  dek: string;
  category: string;
  uploader_name: string;
  readTime: string;
  image: string;
  url: string;
  upvotes: number;
  published_at: string;
}

export function Community() {
  const [uploads, setUploads] = useState<Upload[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [showUploadForm, setShowUploadForm] = useState(false);
  const [brokenImages, setBrokenImages] = useState<Map<string, string>>(new Map());

  const handleImageError = (originalUrl: string, index: number) => {
    setBrokenImages(prev => {
      const updated = new Map(prev);
      updated.set(originalUrl, getFallbackImage(index));
      return updated;
    });
  };

  const getImageUrl = (url: string | undefined): string => {
    if (!url) return DEFAULT_IMAGE;
    if (brokenImages.has(url)) {
      return brokenImages.get(url) || DEFAULT_IMAGE;
    }
    return url;
  };
  const [formData, setFormData] = useState({
    title: '',
    dek: '',
    category: 'Updates',
    uploader_name: '',
    readTime: '5 min read',
    image: '',
    url: ''
  });

  useEffect(() => {
    fetchUploads();
  }, [page]);

  const fetchUploads = async () => {
    try {
      const res = await fetch(`http://localhost:3001/api/community?page=${page}&limit=12`);
      const data = await res.json();
      setUploads(data.uploads);
      setTotalPages(data.pages);
    } catch (error) {
      console.error('Error fetching uploads:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('http://localhost:3001/api/community/upload', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      if (res.ok) {
        setFormData({
          title: '',
          dek: '',
          category: 'Updates',
          uploader_name: '',
          readTime: '5 min read',
          image: '',
          url: ''
        });
        setShowUploadForm(false);
        setPage(1);
        fetchUploads();
      }
    } catch (error) {
      console.error('Error uploading:', error);
    }
  };

  const handleUpvote = async (id: string) => {
    try {
      const res = await fetch(`http://localhost:3001/api/community/${id}/upvote`, {
        method: 'POST'
      });
      if (res.ok) {
        fetchUploads();
      }
    } catch (error) {
      console.error('Error upvoting:', error);
    }
  };

  if (loading) {
    return (
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center text-secondary">Loading community uploads...</div>
      </main>
    );
  }

  return (
    <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8 flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold mb-2 flex items-center gap-2">
            <Upload className="w-8 h-8 text-accent" />
            Community Uploads
          </h1>
          <p className="text-secondary">Share your favorite AI & tech content with our community</p>
        </div>
        <button
          onClick={() => setShowUploadForm(!showUploadForm)}
          className="bg-accent text-white px-4 py-2 rounded-lg hover:bg-accent/90 transition-colors"
        >
          {showUploadForm ? 'Cancel' : '+ Share Content'}
        </button>
      </div>

      {showUploadForm && (
        <form onSubmit={handleSubmit} className="bg-card p-6 rounded-lg mb-8 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              type="text"
              placeholder="Article Title"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="bg-secondary/20 rounded px-3 py-2 text-primary placeholder:text-secondary outline-none focus:ring-2 focus:ring-accent"
              required
            />
            <input
              type="text"
              placeholder="Your Name"
              value={formData.uploader_name}
              onChange={(e) => setFormData({ ...formData, uploader_name: e.target.value })}
              className="bg-secondary/20 rounded px-3 py-2 text-primary placeholder:text-secondary outline-none focus:ring-2 focus:ring-accent"
              required
            />
          </div>
          <textarea
            placeholder="Brief description"
            value={formData.dek}
            onChange={(e) => setFormData({ ...formData, dek: e.target.value })}
            className="w-full bg-secondary/20 rounded px-3 py-2 text-primary placeholder:text-secondary outline-none focus:ring-2 focus:ring-accent"
            rows={3}
            required
          />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <select
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              className="bg-secondary/20 rounded px-3 py-2 text-primary outline-none focus:ring-2 focus:ring-accent"
            >
              <option>Updates</option>
              <option>AI Models</option>
              <option>Hardware</option>
              <option>Business</option>
              <option>Research</option>
              <option>Generative Art</option>
              <option>Policy</option>
            </select>
            <input
              type="url"
              placeholder="Article URL"
              value={formData.url}
              onChange={(e) => setFormData({ ...formData, url: e.target.value })}
              className="bg-secondary/20 rounded px-3 py-2 text-primary placeholder:text-secondary outline-none focus:ring-2 focus:ring-accent"
              required
            />
          </div>
          <input
            type="url"
            placeholder="Image URL"
            value={formData.image}
            onChange={(e) => setFormData({ ...formData, image: e.target.value })}
            className="w-full bg-secondary/20 rounded px-3 py-2 text-primary placeholder:text-secondary outline-none focus:ring-2 focus:ring-accent"
            required
          />
          <button
            type="submit"
            className="w-full bg-accent text-white py-2 rounded-lg hover:bg-accent/90 transition-colors font-bold"
          >
            Share
          </button>
        </form>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {uploads.map((upload, index) => (
          <article key={upload.id} className="bg-card rounded-lg overflow-hidden hover:shadow-lg transition-shadow flex flex-col h-full">
            <div className="aspect-video bg-secondary/30 relative overflow-hidden">
              <img
                src={getImageUrl(upload.image)}
                alt={upload.title}
                onError={() => handleImageError(upload.image, index)}
                className="w-full h-full object-cover"
                loading="lazy"
              />
            </div>
            <div className="p-4 flex flex-col flex-1">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xs font-medium text-accent bg-accent/10 px-2 py-1 rounded">
                  {upload.category}
                </span>
                <span className="text-xs text-secondary">By {upload.uploader_name}</span>
              </div>
              <h3 className="font-bold line-clamp-2 mb-2">
                {upload.title}
              </h3>
              <p className="text-sm text-secondary line-clamp-2 mb-4 flex-1">
                {upload.dek}
              </p>
              <div className="flex justify-between items-center">
                <a
                  href={upload.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-accent text-sm hover:underline"
                >
                  Read →
                </a>
                <button
                  onClick={() => handleUpvote(upload.id)}
                  className="flex items-center gap-1 text-sm text-secondary hover:text-accent transition-colors"
                >
                  <ThumbsUp className="w-4 h-4" />
                  {upload.upvotes}
                </button>
              </div>
            </div>
          </article>
        ))}
      </div>

      {totalPages > 1 && (
        <div className="flex justify-center gap-2 mt-8">
          {Array.from({ length: totalPages }).map((_, i) => (
            <button
              key={i + 1}
              onClick={() => setPage(i + 1)}
              className={`px-3 py-1 rounded ${
                page === i + 1
                  ? 'bg-accent text-white'
                  : 'bg-secondary/20 text-primary hover:bg-secondary/40'
              }`}
            >
              {i + 1}
            </button>
          ))}
        </div>
      )}

      {uploads.length === 0 && (
        <div className="text-center py-12 text-secondary">
          No community uploads yet. Be the first to share!
        </div>
      )}
    </main>
  );
}
