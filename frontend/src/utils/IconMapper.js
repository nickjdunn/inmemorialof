import { Music, Book, Film, Tv, Palette, Coffee, Plane, Dumbbell, MessageCircle, Star } from 'lucide-react';

// Map category names to Lucide icon components
export const iconMapper = {
  'Music': Music,
  'Books': Book,
  'Movies': Film,
  'TV Shows': Tv,
  'Hobbies': Palette,
  'Food': Coffee,
  'Travel': Plane,
  'Art': Palette,
  'Sports': Dumbbell,
  'Quotes': MessageCircle,
  'Other': Star
};

// Function to get icon component by category
export const getCategoryIcon = (category) => {
  return iconMapper[category] || Star;
};

// Default export
export default getCategoryIcon;