export interface Activity {
  id: number;
  title: string;
  description?: string;
  duration: string;
  category: 'Playful' | 'Romantic' | 'Connection' | 'Silly' | 'Creative' | 'Adventure';
  energyLevel: 'Low' | 'Medium' | 'High';
  location: 'Indoor' | 'Outdoor' | 'Flexible';
  cost: 'Free' | 'Under $5' | 'Under $20' | '$20+';
  tips?: string[];
}

export const activities: Activity[] = [
  // PLAYFUL (10 activities)
  {
    id: 1,
    title: "Dance battle in the kitchen. Loser does dishes tonight.",
    duration: "3 minutes",
    category: "Playful",
    energyLevel: "High",
    location: "Indoor",
    cost: "Free",
    tips: [
      "Pick a high-energy song you both love",
      "Go all out - silly moves count double",
      "Record it and watch it back together"
    ]
  },
  {
    id: 2,
    title: "Teach each other a random skill. You have 5 minutes each.",
    duration: "10 minutes",
    category: "Playful",
    energyLevel: "Medium",
    location: "Indoor",
    cost: "Free",
    tips: [
      "Choose something completely unexpected",
      "Use a timer to keep it fair",
      "The weirder the skill, the better"
    ]
  },
  {
    id: 3,
    title: "Rock paper scissors tournament. Best of 7. Winner gets a foot massage.",
    duration: "3 minutes",
    category: "Playful",
    energyLevel: "Low",
    location: "Flexible",
    cost: "Free",
    tips: [
      "Add dramatic commentary",
      "Try to read each other's tells",
      "Winner claims their prize immediately"
    ]
  },
  {
    id: 4,
    title: "Build the tallest tower possible using household items. 10 minutes on the clock.",
    duration: "10 minutes",
    category: "Playful",
    energyLevel: "Medium",
    location: "Indoor",
    cost: "Free",
    tips: [
      "Books, cups, and cushions all count",
      "Get creative with balance",
      "Take a victory photo of the winner's tower"
    ]
  },
  {
    id: 5,
    title: "Play hide and seek in your home. Yes, seriously. Loser makes breakfast tomorrow.",
    duration: "10 minutes",
    category: "Playful",
    energyLevel: "High",
    location: "Indoor",
    cost: "Free",
    tips: [
      "Set boundaries on hiding spots",
      "Count to 30 slowly",
      "Get creative - under blankets counts"
    ]
  },
  {
    id: 6,
    title: "Thumb war championship. Best of 5. Winner picks the movie tonight.",
    duration: "2 minutes",
    category: "Playful",
    energyLevel: "Low",
    location: "Flexible",
    cost: "Free",
    tips: [
      "Warm up those thumbs first",
      "No mercy - play to win",
      "Loser has to watch without complaining"
    ]
  },
  {
    id: 7,
    title: "Throw paper airplanes. Whoever's goes farthest picks dinner tonight.",
    duration: "5 minutes",
    category: "Playful",
    energyLevel: "Medium",
    location: "Indoor",
    cost: "Free",
    tips: [
      "Each person makes their own plane",
      "Test different designs",
      "Measure from the same starting point"
    ]
  },
  {
    id: 8,
    title: "Have a staring contest. First to laugh does 20 pushups.",
    duration: "2 minutes",
    category: "Playful",
    energyLevel: "Low",
    location: "Flexible",
    cost: "Free",
    tips: [
      "Making faces is allowed",
      "No touching allowed",
      "If you both laugh at once, do 10 each"
    ]
  },
  {
    id: 9,
    title: "Pillow fight. 3 minutes. Winner claims the good pillow tonight.",
    duration: "3 minutes",
    category: "Playful",
    energyLevel: "High",
    location: "Indoor",
    cost: "Free",
    tips: [
      "Move breakables first",
      "Soft pillows only - no decorative ones",
      "Set a timer and go all out"
    ]
  },
  {
    id: 10,
    title: "Challenge: Keep a balloon in the air for 5 minutes without using hands.",
    duration: "5 minutes",
    category: "Playful",
    energyLevel: "High",
    location: "Indoor",
    cost: "Free",
    tips: [
      "Heads, feet, elbows all count",
      "Work together or compete",
      "If it hits the ground, start over"
    ]
  },

  // ROMANTIC/CONNECTION (8 activities)
  {
    id: 11,
    title: "Slow dance to the cheesiest love song you can find. No laughing allowed.",
    duration: "4 minutes",
    category: "Romantic",
    energyLevel: "Low",
    location: "Indoor",
    cost: "Free",
    tips: [
      "Dim the lights first",
      "Hold each other close",
      "Let yourself get swept up in the cheese"
    ]
  },
  {
    id: 12,
    title: "Take turns giving compliments. No repeating. First to run out loses.",
    duration: "5 minutes",
    category: "Romantic",
    energyLevel: "Low",
    location: "Flexible",
    cost: "Free",
    tips: [
      "Be specific - details matter",
      "Don't overthink it",
      "Save some for later and surprise them"
    ]
  },
  {
    id: 13,
    title: "Share your favorite photo of the two of you and explain why.",
    duration: "5 minutes",
    category: "Connection",
    energyLevel: "Low",
    location: "Flexible",
    cost: "Free",
    tips: [
      "Don't filter your answer",
      "Talk about the memory, not just the photo",
      "Listen without interrupting"
    ]
  },
  {
    id: 14,
    title: "Each person: Share one thing you're grateful for about the other.",
    duration: "5 minutes",
    category: "Connection",
    energyLevel: "Low",
    location: "Flexible",
    cost: "Free",
    tips: [
      "Be sincere - this isn't the time for jokes",
      "Make eye contact",
      "It's okay to get emotional"
    ]
  },
  {
    id: 15,
    title: "Tell a story from your childhood the other hasn't heard yet.",
    duration: "8 minutes",
    category: "Connection",
    energyLevel: "Low",
    location: "Flexible",
    cost: "Free",
    tips: [
      "Pick something funny or meaningful",
      "Add details to paint the picture",
      "Ask questions about theirs"
    ]
  },
  {
    id: 16,
    title: "Show each other the last thing you saved on your phone and explain why.",
    duration: "5 minutes",
    category: "Connection",
    energyLevel: "Low",
    location: "Flexible",
    cost: "Free",
    tips: [
      "No cheating - show the actual last thing",
      "Be honest about why you saved it",
      "This reveals more than you think"
    ]
  },
  {
    id: 17,
    title: "Write each other a compliment note. Read them out loud.",
    duration: "10 minutes",
    category: "Romantic",
    energyLevel: "Low",
    location: "Indoor",
    cost: "Free",
    tips: [
      "Write it by hand if possible",
      "Be specific about what you appreciate",
      "Keep the notes somewhere special"
    ]
  },
  {
    id: 18,
    title: "Plan your dream vacation together. Pick a date and location right now.",
    duration: "15 minutes",
    category: "Connection",
    energyLevel: "Low",
    location: "Flexible",
    cost: "Free",
    tips: [
      "Dream big - money is no object",
      "Actually look at calendars",
      "Start a shared wishlist"
    ]
  },

  // SILLY/CREATIVE (7 activities)
  {
    id: 19,
    title: "Reenact your first date using only items in this room.",
    duration: "5 minutes",
    category: "Silly",
    energyLevel: "Medium",
    location: "Indoor",
    cost: "Free",
    tips: [
      "Get into character",
      "Use props creatively",
      "Exaggerate the awkward moments"
    ]
  },
  {
    id: 20,
    title: "Make up a song about your day. Perform it with full commitment.",
    duration: "5 minutes",
    category: "Silly",
    energyLevel: "Medium",
    location: "Flexible",
    cost: "Free",
    tips: [
      "Rhyming is optional",
      "Add dance moves",
      "The worse it is, the better"
    ]
  },
  {
    id: 21,
    title: "Do impressions of each other for 2 minutes straight. No laughing.",
    duration: "2 minutes",
    category: "Silly",
    energyLevel: "Medium",
    location: "Flexible",
    cost: "Free",
    tips: [
      "Exaggerate their quirks",
      "Impersonate their catchphrases",
      "Take it as a compliment"
    ]
  },
  {
    id: 22,
    title: "Make a blanket fort. You have 10 minutes. Judge each other's architecture.",
    duration: "10 minutes",
    category: "Silly",
    energyLevel: "Medium",
    location: "Indoor",
    cost: "Free",
    tips: [
      "Use couch cushions as supports",
      "Structural integrity counts",
      "Bonus points for interior decorating"
    ]
  },
  {
    id: 23,
    title: "Act out a scene from your favorite movie using terrible accents.",
    duration: "5 minutes",
    category: "Silly",
    energyLevel: "Medium",
    location: "Flexible",
    cost: "Free",
    tips: [
      "The worse the accent, the better",
      "Commit fully to the character",
      "Film it for a good laugh later"
    ]
  },
  {
    id: 24,
    title: "Create a secret handshake. Must have at least 7 moves.",
    duration: "10 minutes",
    category: "Creative",
    energyLevel: "Medium",
    location: "Flexible",
    cost: "Free",
    tips: [
      "Include snaps, claps, and fist bumps",
      "Practice until it's smooth",
      "Use it as your official couple greeting"
    ]
  },
  {
    id: 25,
    title: "Draw portraits of each other. No peeking until done. 5 minutes each.",
    duration: "10 minutes",
    category: "Creative",
    energyLevel: "Low",
    location: "Indoor",
    cost: "Free",
    tips: [
      "Artistic skill not required",
      "Focus on their best features",
      "Hang them on the fridge"
    ]
  },

  // ADVENTURE/EXPLORATION (5 activities)
  {
    id: 26,
    title: "Walk to the weirdest store within 10 minutes. Buy the strangest thing under $5.",
    duration: "25 minutes",
    category: "Adventure",
    energyLevel: "Medium",
    location: "Outdoor",
    cost: "Under $5",
    tips: [
      "Set a phone timer",
      "Debate what counts as 'weirdest'",
      "Display your purchase somewhere visible"
    ]
  },
  {
    id: 27,
    title: "Order something you've never tried before from a cuisine you've never had.",
    duration: "15 minutes",
    category: "Adventure",
    energyLevel: "Low",
    location: "Flexible",
    cost: "$20+",
    tips: [
      "Close your eyes and point at the menu",
      "No looking up reviews first",
      "Share everything you order"
    ]
  },
  {
    id: 28,
    title: "Go to the best view within 5 blocks. Take a selfie there.",
    duration: "20 minutes",
    category: "Adventure",
    energyLevel: "Medium",
    location: "Outdoor",
    cost: "Free",
    tips: [
      "Look up - rooftop access counts",
      "Golden hour makes everything better",
      "Make it your new phone wallpaper"
    ]
  },
  {
    id: 29,
    title: "Go for a walk with no destination. First interesting thing you see, stop and explore it.",
    duration: "30 minutes",
    category: "Adventure",
    energyLevel: "Medium",
    location: "Outdoor",
    cost: "Free",
    tips: [
      "Turn off navigation",
      "Take random turns",
      "Talk to people you meet"
    ]
  },
  {
    id: 30,
    title: "Find a new recipe together online. Cook it tonight. No takeout allowed.",
    duration: "60 minutes",
    category: "Adventure",
    energyLevel: "High",
    location: "Indoor",
    cost: "Under $20",
    tips: [
      "Pick something you've never made",
      "Work as a team - one chops, one stirs",
      "Dance while you wait for things to cook"
    ]
  }
];

export function getRandomActivity(): Activity {
  const randomIndex = Math.floor(Math.random() * activities.length);
  return activities[randomIndex];
}
