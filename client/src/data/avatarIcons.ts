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
  // Additional romantic
  Gift,
  Cake,
  Wine,
  PartyPopper,
  // More food
  Croissant,
  IceCream,
  Candy,
  Cookie,
  Martini,
  Beer,
  // Sports & fitness
  Dumbbell,
  Trophy,
  Mountain,
  Waves,
  // Hobbies & activities
  Book,
  Palette,
  Brush,
  Pencil,
  Target,
  Dice1,
  Music2,
  Guitar,
  // Tech & gadgets
  Laptop,
  Smartphone,
  Rocket,
  Lightbulb,
  Code,
  Wifi,
  // Nature & weather
  Leaf,
  Snowflake,
  Droplets,
  Rainbow,
  Cloudy,
  Umbrella,
  // Travel & adventure
  Ship,
  Train,
  Car,
  Anchor,
  Globe,
  Luggage,
  // Symbols & expressions
  Smile,
  Laugh,
  Meh,
  ThumbsUp,
  Infinity,
  CircleDot,
  Fingerprint,
  type LucideIcon
} from "lucide-react";

export interface AvatarIcon {
  id: string;
  icon: LucideIcon;
  label: string;
  category: "romantic" | "food" | "adventure" | "entertainment" | "nature" | "animals" | "luxury" | "sports" | "hobbies" | "tech" | "travel" | "symbols";
}

export const AVATAR_ICONS: AvatarIcon[] = [
  // Romantic (10)
  { id: "heart", icon: Heart, label: "Heart", category: "romantic" },
  { id: "sparkles", icon: Sparkles, label: "Sparkles", category: "romantic" },
  { id: "flame", icon: Flame, label: "Flame", category: "romantic" },
  { id: "star", icon: Star, label: "Star", category: "romantic" },
  { id: "moon", icon: Moon, label: "Moon", category: "romantic" },
  { id: "sun", icon: Sun, label: "Sun", category: "romantic" },
  { id: "gift", icon: Gift, label: "Gift", category: "romantic" },
  { id: "cake", icon: Cake, label: "Cake", category: "romantic" },
  { id: "wine", icon: Wine, label: "Wine", category: "romantic" },
  { id: "party", icon: PartyPopper, label: "Party", category: "romantic" },

  // Food & Drinks (10)
  { id: "coffee", icon: Coffee, label: "Coffee", category: "food" },
  { id: "pizza", icon: Pizza, label: "Pizza", category: "food" },
  { id: "apple", icon: Apple, label: "Apple", category: "food" },
  { id: "croissant", icon: Croissant, label: "Croissant", category: "food" },
  { id: "ice-cream", icon: IceCream, label: "Ice Cream", category: "food" },
  { id: "candy", icon: Candy, label: "Candy", category: "food" },
  { id: "cookie", icon: Cookie, label: "Cookie", category: "food" },
  { id: "martini", icon: Martini, label: "Martini", category: "food" },
  { id: "beer", icon: Beer, label: "Beer", category: "food" },

  // Sports & Fitness (4)
  { id: "dumbbell", icon: Dumbbell, label: "Dumbbell", category: "sports" },
  { id: "trophy", icon: Trophy, label: "Trophy", category: "sports" },
  { id: "mountain", icon: Mountain, label: "Mountain", category: "sports" },
  { id: "waves", icon: Waves, label: "Waves", category: "sports" },

  // Hobbies & Creative (8)
  { id: "book", icon: Book, label: "Book", category: "hobbies" },
  { id: "palette", icon: Palette, label: "Palette", category: "hobbies" },
  { id: "brush", icon: Brush, label: "Brush", category: "hobbies" },
  { id: "pencil", icon: Pencil, label: "Pencil", category: "hobbies" },
  { id: "target", icon: Target, label: "Target", category: "hobbies" },
  { id: "dice", icon: Dice1, label: "Dice", category: "hobbies" },
  { id: "music2", icon: Music2, label: "Music Note", category: "hobbies" },
  { id: "guitar", icon: Guitar, label: "Guitar", category: "hobbies" },

  // Tech & Gadgets (6)
  { id: "laptop", icon: Laptop, label: "Laptop", category: "tech" },
  { id: "smartphone", icon: Smartphone, label: "Smartphone", category: "tech" },
  { id: "rocket", icon: Rocket, label: "Rocket", category: "tech" },
  { id: "lightbulb", icon: Lightbulb, label: "Lightbulb", category: "tech" },
  { id: "code", icon: Code, label: "Code", category: "tech" },
  { id: "wifi", icon: Wifi, label: "WiFi", category: "tech" },

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

  // Nature & Weather (9)
  { id: "trees", icon: Trees, label: "Trees", category: "nature" },
  { id: "flower", icon: Flower2, label: "Flower", category: "nature" },
  { id: "palmtree", icon: Palmtree, label: "Palm Tree", category: "nature" },
  { id: "leaf", icon: Leaf, label: "Leaf", category: "nature" },
  { id: "snowflake", icon: Snowflake, label: "Snowflake", category: "nature" },
  { id: "droplets", icon: Droplets, label: "Droplets", category: "nature" },
  { id: "rainbow", icon: Rainbow, label: "Rainbow", category: "nature" },
  { id: "cloudy", icon: Cloudy, label: "Cloudy", category: "nature" },
  { id: "umbrella", icon: Umbrella, label: "Umbrella", category: "nature" },

  // Travel & Exploration (6)
  { id: "ship", icon: Ship, label: "Ship", category: "travel" },
  { id: "train", icon: Train, label: "Train", category: "travel" },
  { id: "car", icon: Car, label: "Car", category: "travel" },
  { id: "anchor", icon: Anchor, label: "Anchor", category: "travel" },
  { id: "globe", icon: Globe, label: "Globe", category: "travel" },
  { id: "luggage", icon: Luggage, label: "Luggage", category: "travel" },

  // Animals (6)
  { id: "cat", icon: Cat, label: "Cat", category: "animals" },
  { id: "dog", icon: Dog, label: "Dog", category: "animals" },
  { id: "bird", icon: Bird, label: "Bird", category: "animals" },
  { id: "fish", icon: Fish, label: "Fish", category: "animals" },
  { id: "squirrel", icon: Squirrel, label: "Squirrel", category: "animals" },
  { id: "rabbit", icon: Rabbit, label: "Rabbit", category: "animals" },

  // Symbols & Expressions (7)
  { id: "smile", icon: Smile, label: "Smile", category: "symbols" },
  { id: "laugh", icon: Laugh, label: "Laugh", category: "symbols" },
  { id: "meh", icon: Meh, label: "Meh", category: "symbols" },
  { id: "thumbs-up", icon: ThumbsUp, label: "Thumbs Up", category: "symbols" },
  { id: "infinity", icon: Infinity, label: "Infinity", category: "symbols" },
  { id: "circle-dot", icon: CircleDot, label: "Circle", category: "symbols" },
  { id: "fingerprint", icon: Fingerprint, label: "Fingerprint", category: "symbols" },

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
