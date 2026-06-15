import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Share2, Bookmark, ExternalLink } from 'lucide-react';

export function StoryDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [story, setStory] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStory = async () => {
      try {
        const response = await fetch(`http://localhost:3001/api/article/${id}`);
        if (response.ok) {
          const data = await response.json();
          setStory(data);
        } else {
          setStory(null);
        }
      } catch (error) {
        console.error('Error fetching story:', error);
        setStory(null);
      } finally {
        setLoading(false);
      }
    };

    fetchStory();
  }, [id]);

  if (loading) {
    return (
      <main className="flex-1 max-w-4xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        <div className="text-center text-secondary">Loading article...</div>
      </main>
    );
  }

  if (!story) {
    return (
      <main className="flex-1 max-w-4xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-secondary hover:text-primary transition-colors mb-8 group">
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          Back
        </button>
        <div className="text-center text-secondary">Article not found</div>
      </main>
    );
  }
  return (
    <main className="flex-1 max-w-4xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-secondary hover:text-primary transition-colors mb-8 group">
        
        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
        Back
      </button>

      <article>
        <div className="mb-8">
          <span className="inline-block px-3 py-1 bg-accent/10 text-accent text-xs font-bold rounded-full mb-4 uppercase tracking-wider">
            {story.category || 'News'}
          </span>
          <h1 className="text-3xl md:text-5xl font-sora font-bold leading-tight mb-6">
            {story.title}
          </h1>
          <div className="flex flex-wrap items-center justify-between gap-4 border-y border-border py-4">
            <div className="flex items-center gap-3 text-sm text-secondary">
              <span className="font-medium text-primary">{story.source}</span>
              <span>&middot;</span>
              <span>{story.time}</span>
              {/* @ts-ignore */}
              {story.readTime &&
              <>
                  <span>&middot;</span>
                  <span>{story.readTime}</span>
                </>
              }
            </div>
            <div className="flex items-center gap-3">
              <button className="p-2 rounded-full hover:bg-surface text-secondary hover:text-primary transition-colors">
                <Share2 className="w-5 h-5" />
              </button>
              <button className="p-2 rounded-full hover:bg-surface text-secondary hover:text-primary transition-colors">
                <Bookmark className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        <div className="w-full h-[300px] md:h-[500px] rounded-2xl overflow-hidden mb-10 bg-surface border border-border">
          <img
            src={story.image}
            alt={story.title}
            className="w-full h-full object-cover" />
          
        </div>

        <div className="prose prose-invert prose-lg max-w-none font-inter text-secondary">
          <p className="text-xl text-primary font-medium leading-relaxed mb-8">
            {/* @ts-ignore */}
            {story.dek ||
            "This is a placeholder for the article's main content. In a real application, this would contain the full text of the news story, fetched from a backend API or CMS."}
          </p>
          <p className="mb-6">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do
            eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim
            ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut
            aliquip ex ea commodo consequat.
          </p>
          <p className="mb-6">
            Duis aute irure dolor in reprehenderit in voluptate velit esse
            cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat
            cupidatat non proident, sunt in culpa qui officia deserunt mollit
            anim id est laborum.
          </p>

          <div className="mt-12 p-6 bg-surface border border-border rounded-xl flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <h3 className="text-primary font-sora font-bold mb-1">
                Read full article on {story.source}
              </h3>
              <p className="text-sm text-secondary">
                Support the original publisher by reading on their site.
              </p>
            </div>
            <a
              href={story.url || '#'}
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 py-3 bg-primary text-base font-semibold rounded-lg hover:bg-primary/90 transition-colors flex items-center gap-2 whitespace-nowrap">

              Read Original <ExternalLink className="w-4 h-4" />
            </a>
          </div>
        </div>
      </article>
    </main>);

}