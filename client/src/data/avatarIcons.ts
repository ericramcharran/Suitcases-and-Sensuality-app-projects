import { type LucideIcon } from "lucide-react";

export interface AvatarIcon {
  id: string;
  icon?: LucideIcon;  // Optional Lucide icon
  imagePath?: string;  // Optional image path for 3D avatars
  label: string;
  category: "romantic" | "food" | "adventure" | "entertainment" | "nature" | "animals" | "luxury" | "sports" | "hobbies" | "tech" | "travel" | "symbols";
}

export const AVATAR_ICONS: AvatarIcon[] = [
  // Romantic (9) - 3D Images
  { id: "heart", imagePath: "/avatars/heart.png", label: "Heart", category: "romantic" },
  { id: "sparkles", imagePath: "/avatars/sparkles.png", label: "Sparkles", category: "romantic" },
  { id: "moon", imagePath: "/avatars/moon.png", label: "Moon", category: "romantic" },
  { id: "sun", imagePath: "/avatars/sun.png", label: "Sun", category: "romantic" },
  { id: "gift", imagePath: "/avatars/gift.png", label: "Gift", category: "romantic" },
  { id: "cake", imagePath: "/avatars/cake.png", label: "Cake", category: "romantic" },

  // Food & Drinks (3) - 3D Images
  { id: "coffee", imagePath: "/avatars/coffee.png", label: "Coffee", category: "food" },
  { id: "pizza", imagePath: "/avatars/pizza.png", label: "Pizza", category: "food" },
  { id: "ice-cream", imagePath: "/avatars/ice-cream.png", label: "Ice Cream", category: "food" },

  // Animals (2) - 3D Images
  { id: "cat", imagePath: "/avatars/cat.png", label: "Cat", category: "animals" },
  { id: "dog", imagePath: "/avatars/dog.png", label: "Dog", category: "animals" },

  // Entertainment (2) - 3D Images
  { id: "camera", imagePath: "/avatars/camera.png", label: "Camera", category: "entertainment" },
  { id: "gamepad", imagePath: "/avatars/gamepad.png", label: "Gamepad", category: "entertainment" },

  // Nature & Travel (2) - 3D Images
  { id: "palmtree", imagePath: "/avatars/palmtree.png", label: "Palm Tree", category: "nature" },
  { id: "plane", imagePath: "/avatars/plane.png", label: "Airplane", category: "travel" },

  // Tech & Luxury (3) - 3D Images
  { id: "rocket", imagePath: "/avatars/rocket.png", label: "Rocket", category: "tech" },
  { id: "crown", imagePath: "/avatars/crown.png", label: "Crown", category: "luxury" },
  { id: "music", imagePath: "/avatars/music.png", label: "Music", category: "entertainment" },
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
