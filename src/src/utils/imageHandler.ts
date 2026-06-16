// Default fallback image for broken images
export const DEFAULT_IMAGE = 'https://images.unsplash.com/photo-1573164713988-8665fc963095?auto=format&fit=crop&q=80&w=400';

// List of reliable fallback images
export const FALLBACK_IMAGES = [
  'https://images.unsplash.com/photo-1573164713988-8665fc963095?auto=format&fit=crop&q=80&w=400', // AI/tech
  'https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&q=80&w=400', // Digital/AI
  'https://images.unsplash.com/photo-1686191128892-3b37013f14ed?auto=format&fit=crop&q=80&w=400', // Creative/AI
  'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?auto=format&fit=crop&q=80&w=400', // Computing
  'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&q=80&w=400', // Hardware
];

// Get a fallback image (rotates through list for variety)
export const getFallbackImage = (index: number = 0): string => {
  return FALLBACK_IMAGES[index % FALLBACK_IMAGES.length];
};

// Get article image URL - always try article's own image first
// Fallback only happens if image fails to load (via onError handler)
export const getValidImageUrl = (url: string | undefined): string => {
  // If article has an image URL, use it (try to load article's own image)
  if (url && typeof url === 'string' && url.length > 0) {
    return url;
  }
  // Only use fallback if no article image exists
  return DEFAULT_IMAGE;
};
