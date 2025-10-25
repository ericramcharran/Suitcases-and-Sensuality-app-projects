export interface Activity {
  id: number;
  title: string;
  description?: string;
  duration: string;
  category: 'Playful' | 'Romantic' | 'Connection' | 'Silly' | 'Creative' | 'Adventure' | 'Flirty Physical' | 'Verbal Seduction' | 'Teasing' | 'Intimate Connection' | 'Role Play';
  energyLevel: 'Low' | 'Medium' | 'High';
  location: 'Indoor' | 'Outdoor' | 'Flexible' | 'Private';
  cost: 'Free' | 'Under $5' | 'Under $20' | '$20+';
  spiceLevel: 'G-Rated' | 'PG-13';
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
    spiceLevel: "G-Rated",
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
    spiceLevel: "G-Rated",
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
    spiceLevel: "G-Rated",
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
    spiceLevel: "G-Rated",
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
    spiceLevel: "G-Rated",
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
    spiceLevel: "G-Rated",
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
    spiceLevel: "G-Rated",
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
    spiceLevel: "G-Rated",
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
    spiceLevel: "G-Rated",
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
    spiceLevel: "G-Rated",
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
    spiceLevel: "G-Rated",
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
    spiceLevel: "G-Rated",
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
    spiceLevel: "G-Rated",
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
    spiceLevel: "G-Rated",
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
    spiceLevel: "G-Rated",
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
    spiceLevel: "G-Rated",
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
    spiceLevel: "G-Rated",
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
    spiceLevel: "G-Rated",
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
    spiceLevel: "G-Rated",
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
    spiceLevel: "G-Rated",
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
    spiceLevel: "G-Rated",
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
    spiceLevel: "G-Rated",
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
    spiceLevel: "G-Rated",
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
    spiceLevel: "G-Rated",
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
    spiceLevel: "G-Rated",
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
    spiceLevel: "G-Rated",
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
    spiceLevel: "G-Rated",
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
    spiceLevel: "G-Rated",
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
    spiceLevel: "G-Rated",
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
    spiceLevel: "G-Rated",
    tips: [
      "Pick something you've never made",
      "Work as a team - one chops, one stirs",
      "Dance while you wait for things to cook"
    ]
  },

  // 🔥 FLIRTY PHYSICAL (10 activities) - PG-13
  {
    id: 31,
    title: "Kissing challenge: Kiss everywhere EXCEPT the lips for 3 minutes. Get creative.",
    duration: "3 minutes",
    category: "Flirty Physical",
    energyLevel: "Medium",
    location: "Private",
    cost: "Free",
    spiceLevel: "PG-13",
    tips: [
      "Neck, shoulders, hands - all fair game",
      "Take your time and build anticipation",
      "Save the lips for after the timer goes off"
    ]
  },
  {
    id: 32,
    title: "Slow undress: Take turns removing one piece of each other's clothing. Talk about what you love about what you see.",
    duration: "10 minutes",
    category: "Flirty Physical",
    energyLevel: "Low",
    location: "Private",
    cost: "Free",
    spiceLevel: "PG-13",
    tips: [
      "Go slow - this isn't a race",
      "Give genuine compliments",
      "Eye contact is everything"
    ]
  },
  {
    id: 33,
    title: "Body paint: Use chocolate sauce or whipped cream. Draw on each other. Lick it off.",
    duration: "15 minutes",
    category: "Flirty Physical",
    energyLevel: "Medium",
    location: "Private",
    cost: "Under $5",
    spiceLevel: "PG-13",
    tips: [
      "Lay down towels first",
      "Get creative with your canvas",
      "Clean-up can be half the fun"
    ]
  },
  {
    id: 34,
    title: "Massage train: One person gives a full body massage. Use oil. Take your time.",
    duration: "20 minutes",
    category: "Flirty Physical",
    energyLevel: "Low",
    location: "Private",
    cost: "Free",
    spiceLevel: "PG-13",
    tips: [
      "Warm the oil in your hands first",
      "Ask what pressure they like",
      "Don't rush - enjoy the connection"
    ]
  },
  {
    id: 35,
    title: "Make out like teenagers: Set a timer for 10 minutes. Just kiss. Nothing else. Go.",
    duration: "10 minutes",
    category: "Flirty Physical",
    energyLevel: "Medium",
    location: "Private",
    cost: "Free",
    spiceLevel: "PG-13",
    tips: [
      "Remember when this was exciting?",
      "Keep your hands busy but appropriate",
      "No checking your phone"
    ]
  },
  {
    id: 36,
    title: "Trace each other's body with your fingertips. No talking. Just touch. Eyes closed.",
    duration: "12 minutes",
    category: "Flirty Physical",
    energyLevel: "Low",
    location: "Private",
    cost: "Free",
    spiceLevel: "PG-13",
    tips: [
      "Use feather-light touches",
      "Focus on the sensation",
      "Take turns - 6 minutes each"
    ]
  },
  {
    id: 37,
    title: "Dance battle but make it sexy. Take turns showing your moves. Winner picks the prize.",
    duration: "8 minutes",
    category: "Flirty Physical",
    energyLevel: "High",
    location: "Private",
    cost: "Free",
    spiceLevel: "PG-13",
    tips: [
      "Choose slow, sultry music",
      "Confidence is sexier than skill",
      "Make eye contact while you move"
    ]
  },
  {
    id: 38,
    title: "Give each other a lap dance. Yes, seriously. Put on music and commit to it.",
    duration: "6 minutes",
    category: "Flirty Physical",
    energyLevel: "Medium",
    location: "Private",
    cost: "Free",
    spiceLevel: "PG-13",
    tips: [
      "3 minutes each - set a timer",
      "Laugh if you need to, then get back into it",
      "This is about fun, not perfection"
    ]
  },
  {
    id: 39,
    title: "Blindfold one person. Other person kisses them in 10 different places. Guess where.",
    duration: "8 minutes",
    category: "Flirty Physical",
    energyLevel: "Low",
    location: "Private",
    cost: "Free",
    spiceLevel: "PG-13",
    tips: [
      "Use a soft scarf or sleep mask",
      "Mix obvious and surprising spots",
      "Switch roles halfway through"
    ]
  },
  {
    id: 40,
    title: "Wrestling match on the bed. First to pin the other for 5 seconds wins. Prize: their choice.",
    duration: "5 minutes",
    category: "Flirty Physical",
    energyLevel: "High",
    location: "Private",
    cost: "Free",
    spiceLevel: "PG-13",
    tips: [
      "Clear the bed of pillows first",
      "No actual wrestling moves - keep it playful",
      "Let the winner collect their prize immediately"
    ]
  },

  // 💋 VERBAL SEDUCTION (8 activities) - PG-13
  {
    id: 41,
    title: "Describe in detail what you find most physically attractive about them right now.",
    duration: "8 minutes",
    category: "Verbal Seduction",
    energyLevel: "Low",
    location: "Private",
    cost: "Free",
    spiceLevel: "PG-13",
    tips: [
      "Be specific - details matter",
      "Make eye contact while you speak",
      "Don't hold back on the compliments"
    ]
  },
  {
    id: 42,
    title: "Truth game: 'What's something about my body that drives you crazy?' Take turns.",
    duration: "10 minutes",
    category: "Verbal Seduction",
    energyLevel: "Low",
    location: "Private",
    cost: "Free",
    spiceLevel: "PG-13",
    tips: [
      "Answer honestly and enthusiastically",
      "This isn't the time to be shy",
      "Show them what you mean after"
    ]
  },
  {
    id: 43,
    title: "Whisper game: Take turns whispering fantasies in each other's ears. Keep it hot.",
    duration: "12 minutes",
    category: "Verbal Seduction",
    energyLevel: "Low",
    location: "Private",
    cost: "Free",
    spiceLevel: "PG-13",
    tips: [
      "Get close - breath on their neck",
      "Use vivid, sensory details",
      "Take turns back and forth"
    ]
  },
  {
    id: 44,
    title: "Complete this: 'I love it when you...' Get specific. Get honest. Get flirty.",
    duration: "10 minutes",
    category: "Verbal Seduction",
    energyLevel: "Low",
    location: "Private",
    cost: "Free",
    spiceLevel: "PG-13",
    tips: [
      "Each person shares 3-5 things",
      "Include physical and emotional",
      "Take notes - literally or mentally"
    ]
  },
  {
    id: 45,
    title: "Sexting practice: Text each other something flirty. Read them out loud.",
    duration: "5 minutes",
    category: "Verbal Seduction",
    energyLevel: "Low",
    location: "Flexible",
    cost: "Free",
    spiceLevel: "PG-13",
    tips: [
      "Actually send the texts",
      "Use appropriate level of spice",
      "Save the best ones for later"
    ]
  },
  {
    id: 46,
    title: "Describe your most memorable kiss with them. Every. Single. Detail.",
    duration: "8 minutes",
    category: "Verbal Seduction",
    energyLevel: "Low",
    location: "Private",
    cost: "Free",
    spiceLevel: "PG-13",
    tips: [
      "Close your eyes and relive it",
      "Describe what you felt physically",
      "Then recreate it"
    ]
  },
  {
    id: 47,
    title: "Play 'Never Have I Ever' but only romantic/intimate questions. Be honest.",
    duration: "15 minutes",
    category: "Verbal Seduction",
    energyLevel: "Low",
    location: "Private",
    cost: "Free",
    spiceLevel: "PG-13",
    tips: [
      "Keep it between you two",
      "No judgment - just honesty",
      "Some answers might surprise you"
    ]
  },
  {
    id: 48,
    title: "Rate each other's best features 1-10. Explain your ratings. Be generous.",
    duration: "10 minutes",
    category: "Verbal Seduction",
    energyLevel: "Low",
    location: "Private",
    cost: "Free",
    spiceLevel: "PG-13",
    tips: [
      "Pick 5 features each",
      "Everything should be an 8 or higher",
      "Explain WHY you rated it that way"
    ]
  },

  // 🌶️ TEASING & TENSION (7 activities) - PG-13
  {
    id: 49,
    title: "Strip game: Play rock-paper-scissors. Loser removes one item. First naked loses (or wins?).",
    duration: "10 minutes",
    category: "Teasing",
    energyLevel: "Medium",
    location: "Private",
    cost: "Free",
    spiceLevel: "PG-13",
    tips: [
      "Count socks separately",
      "Build the anticipation",
      "What happens after is up to you"
    ]
  },
  {
    id: 50,
    title: "No-kiss challenge: Spend 5 minutes as close as possible without kissing. Build the tension.",
    duration: "5 minutes",
    category: "Teasing",
    energyLevel: "Low",
    location: "Private",
    cost: "Free",
    spiceLevel: "PG-13",
    tips: [
      "Get as close as you can",
      "Breathe on their lips",
      "The payoff is worth it"
    ]
  },
  {
    id: 51,
    title: "Staring contest but sit in each other's lap. First to look away does what the winner says.",
    duration: "3 minutes",
    category: "Teasing",
    energyLevel: "Low",
    location: "Private",
    cost: "Free",
    spiceLevel: "PG-13",
    tips: [
      "Get comfortable first",
      "No talking or smiling",
      "Winner should be creative"
    ]
  },
  {
    id: 52,
    title: "Dress up sexy for each other. Give a little fashion show. Rate the looks.",
    duration: "20 minutes",
    category: "Teasing",
    energyLevel: "Medium",
    location: "Private",
    cost: "Free",
    spiceLevel: "PG-13",
    tips: [
      "Use what you have or go shopping",
      "Walk with confidence",
      "Take photos for later"
    ]
  },
  {
    id: 53,
    title: "Truth or dare but only romantic dares. No backing out. Take turns.",
    duration: "15 minutes",
    category: "Teasing",
    energyLevel: "Medium",
    location: "Private",
    cost: "Free",
    spiceLevel: "PG-13",
    tips: [
      "Start mild, build intensity",
      "Be creative with dares",
      "Truth questions should be revealing"
    ]
  },
  {
    id: 54,
    title: "Recreate your first kiss. Then improve it. Then improve it again.",
    duration: "8 minutes",
    category: "Teasing",
    energyLevel: "Medium",
    location: "Private",
    cost: "Free",
    spiceLevel: "PG-13",
    tips: [
      "Remember where and how it happened",
      "Each version should get better",
      "The third one should be unforgettable"
    ]
  },
  {
    id: 55,
    title: "Take turns being in control. One person directs the other for 5 minutes. Then switch.",
    duration: "10 minutes",
    category: "Teasing",
    energyLevel: "Medium",
    location: "Private",
    cost: "Free",
    spiceLevel: "PG-13",
    tips: [
      "Be clear with instructions",
      "Stay within comfort zones",
      "Communication is key"
    ]
  },

  // 💕 INTIMATE CONNECTION (5 activities) - PG-13
  {
    id: 56,
    title: "Share your favorite physical memory of them. What did they smell like? Feel like? Be detailed.",
    duration: "10 minutes",
    category: "Intimate Connection",
    energyLevel: "Low",
    location: "Private",
    cost: "Free",
    spiceLevel: "PG-13",
    tips: [
      "Engage all five senses",
      "Don't rush through it",
      "Let them respond before moving on"
    ]
  },
  {
    id: 57,
    title: "Teach each other what you like. Show, don't tell. Hands-on demonstration.",
    duration: "15 minutes",
    category: "Intimate Connection",
    energyLevel: "Medium",
    location: "Private",
    cost: "Free",
    spiceLevel: "PG-13",
    tips: [
      "This is about communication",
      "Be patient and receptive",
      "Practice makes perfect"
    ]
  },
  {
    id: 58,
    title: "Slow dance in your underwear. Stay close. Let the tension build.",
    duration: "8 minutes",
    category: "Intimate Connection",
    energyLevel: "Low",
    location: "Private",
    cost: "Free",
    spiceLevel: "PG-13",
    tips: [
      "Pick a slow, romantic song",
      "Skin-to-skin contact is the point",
      "Let your bodies do the talking"
    ]
  },
  {
    id: 59,
    title: "Take a shower or bath together. Just be together. Wash each other's hair.",
    duration: "20 minutes",
    category: "Intimate Connection",
    energyLevel: "Low",
    location: "Private",
    cost: "Free",
    spiceLevel: "PG-13",
    tips: [
      "This is about intimacy, not efficiency",
      "Take turns caring for each other",
      "Enjoy the warmth and closeness"
    ]
  },
  {
    id: 60,
    title: "Cuddle naked for 15 minutes. Just talk. Just touch. Just be close.",
    duration: "15 minutes",
    category: "Intimate Connection",
    energyLevel: "Low",
    location: "Private",
    cost: "Free",
    spiceLevel: "PG-13",
    tips: [
      "No pressure for anything else",
      "Focus on the connection",
      "This builds real intimacy"
    ]
  },

  // 🎭 ROLE PLAY & FANTASY (10 activities) - PG-13
  {
    id: 61,
    title: "Pretend you just met. Flirt like it's your first time. Pick each other up.",
    duration: "15 minutes",
    category: "Role Play",
    energyLevel: "Medium",
    location: "Private",
    cost: "Free",
    spiceLevel: "PG-13",
    tips: [
      "Give yourself fake names",
      "Use cheesy pickup lines",
      "See where it leads"
    ]
  },
  {
    id: 62,
    title: "Act out a scene from a romantic movie. Make it your own. Make it hot.",
    duration: "10 minutes",
    category: "Role Play",
    energyLevel: "Medium",
    location: "Private",
    cost: "Free",
    spiceLevel: "PG-13",
    tips: [
      "Pick an iconic romantic scene",
      "Add your own twist",
      "Commit to the characters"
    ]
  },
  {
    id: 63,
    title: "Describe your dream romantic encounter. Where? When? What happens? Get detailed.",
    duration: "12 minutes",
    category: "Role Play",
    energyLevel: "Low",
    location: "Private",
    cost: "Free",
    spiceLevel: "PG-13",
    tips: [
      "Paint the full picture",
      "Include sensory details",
      "Maybe make it happen later"
    ]
  },
  {
    id: 64,
    title: "Play 'Would You Rather' but only romantic scenarios. Answer honestly.",
    duration: "10 minutes",
    category: "Role Play",
    energyLevel: "Low",
    location: "Private",
    cost: "Free",
    spiceLevel: "PG-13",
    tips: [
      "Get creative with scenarios",
      "Explain your choices",
      "Learn something new about each other"
    ]
  },
  {
    id: 65,
    title: "Create couple code words. One for 'I want you.' One for 'later.' One for 'right now.'",
    duration: "5 minutes",
    category: "Role Play",
    energyLevel: "Low",
    location: "Flexible",
    cost: "Free",
    spiceLevel: "PG-13",
    tips: [
      "Make them subtle for public use",
      "Test them out throughout the week",
      "Add more as needed"
    ]
  },
  {
    id: 66,
    title: "Take turns posing for each other. Make it flirty. Make it hot. Take photos (optional).",
    duration: "10 minutes",
    category: "Role Play",
    energyLevel: "Medium",
    location: "Private",
    cost: "Free",
    spiceLevel: "PG-13",
    tips: [
      "Channel your inner model",
      "Give direction to your photographer",
      "Keep the photos private"
    ]
  },
  {
    id: 67,
    title: "Blindfold each other and feed them something delicious. Make it sensual.",
    duration: "10 minutes",
    category: "Role Play",
    energyLevel: "Low",
    location: "Private",
    cost: "Under $5",
    spiceLevel: "PG-13",
    tips: [
      "Choose foods with different textures",
      "Take your time with each bite",
      "Make them guess what it is"
    ]
  },
  {
    id: 68,
    title: "Set a romantic scene: lights, music, candles. Then just make out for 15 minutes.",
    duration: "15 minutes",
    category: "Role Play",
    energyLevel: "Medium",
    location: "Private",
    cost: "Free",
    spiceLevel: "PG-13",
    tips: [
      "Spend 5 minutes setting the mood",
      "Put phones away completely",
      "Lose yourself in the moment"
    ]
  },
  {
    id: 69,
    title: "Share your biggest turn-on about them. The thing that always gets you.",
    duration: "5 minutes",
    category: "Role Play",
    energyLevel: "Low",
    location: "Private",
    cost: "Free",
    spiceLevel: "PG-13",
    tips: [
      "Be specific and honest",
      "This is valuable information",
      "Use it wisely going forward"
    ]
  },
  {
    id: 70,
    title: "Write down something you want to try together. Exchange notes. Discuss (or do it).",
    duration: "10 minutes",
    category: "Role Play",
    energyLevel: "Low",
    location: "Private",
    cost: "Free",
    spiceLevel: "PG-13",
    tips: [
      "Be adventurous but respectful",
      "No judgment on what's written",
      "Decide together what to try"
    ]
  }
];

export function getRandomActivity(): Activity {
  const randomIndex = Math.floor(Math.random() * activities.length);
  return activities[randomIndex];
}
