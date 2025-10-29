import { type LucideIcon } from "lucide-react";

export interface AvatarIcon {
  id: string;
  icon?: LucideIcon;
  imagePath?: string;
  label: string;
  category: "romantic" | "food" | "adventure" | "entertainment" | "nature" | "animals" | "luxury" | "sports" | "hobbies" | "tech" | "travel" | "symbols";
}

export const AVATAR_ICONS: AvatarIcon[] = [
  // Romantic (12 total)
  { id: "heart", imagePath: "/avatars/3D_glossy_heart_avatar_9ccef243.png", label: "Heart", category: "romantic" },
  { id: "sparkles", imagePath: "/avatars/3D_sparkle_star_avatar_0bbdd79d.png", label: "Sparkles", category: "romantic" },
  { id: "moon", imagePath: "/avatars/3D_moon_avatar_8d52f3f2.png", label: "Moon", category: "romantic" },
  { id: "sun", imagePath: "/avatars/3D_sun_avatar_753ed143.png", label: "Sun", category: "romantic" },
  { id: "gift", imagePath: "/avatars/3D_gift_box_avatar_6844f334.png", label: "Gift", category: "romantic" },
  { id: "cake", imagePath: "/avatars/3D_cake_avatar_9275df32.png", label: "Cake", category: "romantic" },
  { id: "rose", imagePath: "/avatars/3D_rose_avatar_99a57f4f.png", label: "Rose", category: "romantic" },
  { id: "ring", imagePath: "/avatars/3D_ring_avatar_79d2cc4a.png", label: "Diamond Ring", category: "romantic" },
  { id: "balloons", imagePath: "/avatars/3D_balloons_avatar_ca375ed3.png", label: "Balloons", category: "romantic" },
  { id: "fireworks", imagePath: "/avatars/3D_fireworks_avatar_b36a5f5b.png", label: "Fireworks", category: "romantic" },
  { id: "chocolate-box", imagePath: "/avatars/3D_chocolate_box_avatar_77f4fd9a.png", label: "Chocolate Box", category: "romantic" },
  { id: "love-letter", imagePath: "/avatars/3D_love_letter_avatar_5d1b1cc5.png", label: "Love Letter", category: "romantic" },

  // Food & Drinks (10 total)
  { id: "coffee", imagePath: "/avatars/3D_coffee_cup_avatar_ea68df01.png", label: "Coffee", category: "food" },
  { id: "pizza", imagePath: "/avatars/3D_pizza_slice_avatar_bac8212f.png", label: "Pizza", category: "food" },
  { id: "ice-cream", imagePath: "/avatars/3D_ice_cream_avatar_c040ba54.png", label: "Ice Cream", category: "food" },
  { id: "sushi", imagePath: "/avatars/3D_sushi_avatar_e52a126e.png", label: "Sushi", category: "food" },
  { id: "burger", imagePath: "/avatars/3D_burger_avatar_2fb6c5a5.png", label: "Burger", category: "food" },
  { id: "donut", imagePath: "/avatars/3D_donut_avatar_0d4d167d.png", label: "Donut", category: "food" },
  { id: "cupcake", imagePath: "/avatars/3D_cupcake_avatar_6560638f.png", label: "Cupcake", category: "food" },
  { id: "taco", imagePath: "/avatars/3D_taco_avatar_85af666a.png", label: "Taco", category: "food" },
  { id: "popcorn", imagePath: "/avatars/3D_popcorn_avatar_d513df55.png", label: "Popcorn", category: "food" },
  { id: "sundae", imagePath: "/avatars/3D_sundae_avatar_be83a2a4.png", label: "Ice Cream Sundae", category: "food" },

  // Animals (8 total)
  { id: "cat", imagePath: "/avatars/3D_cute_cat_avatar_8d921e25.png", label: "Cat", category: "animals" },
  { id: "dog", imagePath: "/avatars/3D_cute_dog_avatar_aa8865b3.png", label: "Dog", category: "animals" },
  { id: "penguin", imagePath: "/avatars/3D_penguin_avatar_8a02eec0.png", label: "Penguin", category: "animals" },
  { id: "owl", imagePath: "/avatars/3D_owl_avatar_88a026e7.png", label: "Owl", category: "animals" },
  { id: "fox", imagePath: "/avatars/3D_fox_avatar_4fe9c165.png", label: "Fox", category: "animals" },
  { id: "panda", imagePath: "/avatars/3D_panda_avatar_59141725.png", label: "Panda", category: "animals" },
  { id: "teddy-bear", imagePath: "/avatars/3D_teddy_bear_avatar_9d1591cf.png", label: "Teddy Bear", category: "animals" },
  { id: "butterfly", imagePath: "/avatars/3D_butterfly_avatar_089a59e1.png", label: "Butterfly", category: "animals" },

  // Nature (7 total)
  { id: "palmtree", imagePath: "/avatars/3D_palm_tree_avatar_eb2f5b3a.png", label: "Palm Tree", category: "nature" },
  { id: "rainbow", imagePath: "/avatars/3D_rainbow_avatar_ffeb1005.png", label: "Rainbow", category: "nature" },
  { id: "cactus", imagePath: "/avatars/3D_cactus_avatar_7f34a572.png", label: "Cactus", category: "nature" },
  { id: "mountains", imagePath: "/avatars/3D_mountains_avatar_9420cfd1.png", label: "Mountains", category: "nature" },
  { id: "ocean-wave", imagePath: "/avatars/3D_ocean_wave_avatar_3d39ba7a.png", label: "Ocean Wave", category: "nature" },
  { id: "sunflower", imagePath: "/avatars/3D_sunflower_avatar_0bac8f71.png", label: "Sunflower", category: "nature" },
  { id: "cherry-blossom", imagePath: "/avatars/3D_cherry_blossom_avatar_bb72fafe.png", label: "Cherry Blossom", category: "nature" },

  // Hobbies (7 total)
  { id: "music", imagePath: "/avatars/3D_music_note_avatar_7964b87c.png", label: "Music", category: "hobbies" },
  { id: "guitar", imagePath: "/avatars/3D_guitar_avatar_abce9dc5.png", label: "Electric Guitar", category: "hobbies" },
  { id: "microphone", imagePath: "/avatars/3D_microphone_avatar_db8fc2c3.png", label: "Microphone", category: "hobbies" },
  { id: "palette", imagePath: "/avatars/3D_palette_avatar_807d974d.png", label: "Paint Palette", category: "hobbies" },
  { id: "book", imagePath: "/avatars/3D_book_avatar_29cc105f.png", label: "Book", category: "hobbies" },
  { id: "headphones", imagePath: "/avatars/3D_headphones_avatar_8f2d0dca.png", label: "Headphones", category: "hobbies" },
  { id: "vinyl", imagePath: "/avatars/3D_vinyl_record_avatar_469f2eeb.png", label: "Vinyl Record", category: "hobbies" },

  // Sports (6 total)
  { id: "basketball", imagePath: "/avatars/3D_basketball_avatar_1690a4cf.png", label: "Basketball", category: "sports" },
  { id: "soccer", imagePath: "/avatars/3D_soccer_ball_avatar_44cc6d1c.png", label: "Soccer Ball", category: "sports" },
  { id: "tennis", imagePath: "/avatars/3D_tennis_racket_avatar_e0a77575.png", label: "Tennis Racket", category: "sports" },
  { id: "skateboard", imagePath: "/avatars/3D_skateboard_avatar_e0b36196.png", label: "Skateboard", category: "sports" },
  { id: "surfboard", imagePath: "/avatars/3D_surfboard_avatar_0cc7c285.png", label: "Surfboard", category: "sports" },
  { id: "bowling", imagePath: "/avatars/3D_bowling_ball_avatar_0f189e05.png", label: "Bowling Ball", category: "sports" },

  // Travel (7 total)
  { id: "plane", imagePath: "/avatars/3D_airplane_avatar_53117d9a.png", label: "Airplane", category: "travel" },
  { id: "hot-air-balloon", imagePath: "/avatars/3D_hot_air_balloon_avatar_920b1b08.png", label: "Hot Air Balloon", category: "travel" },
  { id: "suitcase", imagePath: "/avatars/3D_suitcase_avatar_e2b5e834.png", label: "Suitcase", category: "travel" },
  { id: "passport", imagePath: "/avatars/3D_passport_avatar_8a4306e0.png", label: "Passport", category: "travel" },
  { id: "compass", imagePath: "/avatars/3D_compass_avatar_4b5e9860.png", label: "Compass", category: "travel" },
  { id: "bicycle", imagePath: "/avatars/3D_bicycle_avatar_e7f2e371.png", label: "Bicycle", category: "travel" },
  { id: "tent", imagePath: "/avatars/3D_tent_avatar_3e575e74.png", label: "Camping Tent", category: "travel" },

  // Tech (4 total)
  { id: "rocket", imagePath: "/avatars/3D_rocket_avatar_869ae183.png", label: "Rocket", category: "tech" },
  { id: "smartphone", imagePath: "/avatars/3D_smartphone_avatar_dc4b2ebe.png", label: "Smartphone", category: "tech" },
  { id: "laptop", imagePath: "/avatars/3D_laptop_avatar_b52817d2.png", label: "Laptop", category: "tech" },
  { id: "lightbulb", imagePath: "/avatars/3D_lightbulb_avatar_68813e37.png", label: "Light Bulb", category: "tech" },

  // Entertainment (5 total)
  { id: "camera", imagePath: "/avatars/3D_camera_avatar_ce12c66e.png", label: "Camera", category: "entertainment" },
  { id: "gamepad", imagePath: "/avatars/3D_game_controller_avatar_78f33446.png", label: "Gamepad", category: "entertainment" },
  { id: "movie-popcorn", imagePath: "/avatars/3D_movie_popcorn_avatar_8c723043.png", label: "Movie Popcorn", category: "entertainment" },
  { id: "clapperboard", imagePath: "/avatars/3D_clapperboard_avatar_a1301cd7.png", label: "Clapperboard", category: "entertainment" },
  { id: "dice", imagePath: "/avatars/3D_dice_avatar_95dcaad2.png", label: "Dice", category: "entertainment" },

  // Luxury (1 total)
  { id: "crown", imagePath: "/avatars/3D_crown_avatar_f7a7716a.png", label: "Crown", category: "luxury" },

  // Symbols (5 total)
  { id: "peace", imagePath: "/avatars/3D_peace_sign_avatar_91cd1114.png", label: "Peace Sign", category: "symbols" },
  { id: "anchor", imagePath: "/avatars/3D_anchor_avatar_27cb35e3.png", label: "Anchor", category: "symbols" },
  { id: "globe", imagePath: "/avatars/3D_globe_avatar_9c82a11d.png", label: "Globe", category: "symbols" },
  { id: "gem", imagePath: "/avatars/3D_gem_avatar_1e7211ae.png", label: "Gem", category: "symbols" },
  { id: "sailboat", imagePath: "/avatars/3D_sailboat_avatar_26e1e7f3.png", label: "Sailboat", category: "symbols" },
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
