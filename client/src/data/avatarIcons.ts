import { 
  Heart, 
  Sparkles, 
  Coffee, 
  Pizza, 
  Apple,
  Flame, 
  Star, 
  Moon, 
  Sun, 
  Cloud, 
  Zap,
  Music,
  Headphones,
  Camera,
  Gamepad2,
  Film,
  Bike,
  Plane,
  MapPin,
  Compass,
  Tent,
  Trees,
  Flower2,
  Palmtree,
  Cat,
  Dog,
  Bird,
  Fish,
  Squirrel,
  Rabbit,
  Crown,
  Gem,
  type LucideIcon
} from "lucide-react";

export interface AvatarIcon {
  id: string;
  icon: LucideIcon;
  label: string;
  category: "romantic" | "food" | "adventure" | "entertainment" | "nature" | "animals" | "luxury";
}

export const AVATAR_ICONS: AvatarIcon[] = [
  // Romantic (6)
  { id: "heart", icon: Heart, label: "Heart", category: "romantic" },
  { id: "sparkles", icon: Sparkles, label: "Sparkles", category: "romantic" },
  { id: "flame", icon: Flame, label: "Flame", category: "romantic" },
  { id: "star", icon: Star, label: "Star", category: "romantic" },
  { id: "moon", icon: Moon, label: "Moon", category: "romantic" },
  { id: "sun", icon: Sun, label: "Sun", category: "romantic" },

  // Food & Drinks (3)
  { id: "coffee", icon: Coffee, label: "Coffee", category: "food" },
  { id: "pizza", icon: Pizza, label: "Pizza", category: "food" },
  { id: "apple", icon: Apple, label: "Apple", category: "food" },

  // Adventure (7)
  { id: "bike", icon: Bike, label: "Bike", category: "adventure" },
  { id: "plane", icon: Plane, label: "Plane", category: "adventure" },
  { id: "map-pin", icon: MapPin, label: "Map Pin", category: "adventure" },
  { id: "compass", icon: Compass, label: "Compass", category: "adventure" },
  { id: "tent", icon: Tent, label: "Tent", category: "adventure" },
  { id: "cloud", icon: Cloud, label: "Cloud", category: "adventure" },
  { id: "zap", icon: Zap, label: "Lightning", category: "adventure" },

  // Entertainment (5)
  { id: "music", icon: Music, label: "Music", category: "entertainment" },
  { id: "headphones", icon: Headphones, label: "Headphones", category: "entertainment" },
  { id: "camera", icon: Camera, label: "Camera", category: "entertainment" },
  { id: "gamepad", icon: Gamepad2, label: "Gamepad", category: "entertainment" },
  { id: "film", icon: Film, label: "Film", category: "entertainment" },

  // Nature (3)
  { id: "trees", icon: Trees, label: "Trees", category: "nature" },
  { id: "flower", icon: Flower2, label: "Flower", category: "nature" },
  { id: "palmtree", icon: Palmtree, label: "Palm Tree", category: "nature" },

  // Animals (6)
  { id: "cat", icon: Cat, label: "Cat", category: "animals" },
  { id: "dog", icon: Dog, label: "Dog", category: "animals" },
  { id: "bird", icon: Bird, label: "Bird", category: "animals" },
  { id: "fish", icon: Fish, label: "Fish", category: "animals" },
  { id: "squirrel", icon: Squirrel, label: "Squirrel", category: "animals" },
  { id: "rabbit", icon: Rabbit, label: "Rabbit", category: "animals" },

  // Luxury (2)
  { id: "crown", icon: Crown, label: "Crown", category: "luxury" },
  { id: "gem", icon: Gem, label: "Gem", category: "luxury" },
];

// Helper function to get icon by ID
export function getAvatarIconById(id: string): AvatarIcon | undefined {
  return AVATAR_ICONS.find(icon => icon.id === id);
}

// Helper function to get icon URL for pre-made icons
export function getIconAvatarUrl(iconId: string): string {
  return `icon:${iconId}`;
}

// Helper function to check if an avatar URL is an icon
export function isIconAvatar(avatarUrl: string | null): boolean {
  return avatarUrl?.startsWith("icon:") ?? false;
}

// Helper function to extract icon ID from avatar URL
export function getIconIdFromUrl(avatarUrl: string): string | null {
  if (isIconAvatar(avatarUrl)) {
    return avatarUrl.replace("icon:", "");
  }
  return null;
}
