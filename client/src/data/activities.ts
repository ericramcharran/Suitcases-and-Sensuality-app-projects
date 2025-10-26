export interface Activity {
  id: number;
  title: string;
  description?: string;
  duration: string;
  category: 'Playful' | 'Romantic' | 'Connection' | 'Silly' | 'Creative' | 'Adventure' | 'Flirty Physical' | 'Verbal Seduction' | 'Teasing' | 'Intimate Connection' | 'Role Play' | 'Video Call' | 'Async' | 'Text Games' | 'Romantic LDR' | 'Creative LDR' | 'Planning LDR' | 'Boredom Buster' | 'Polyamorous';
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
  },

  // VIDEO CALL (12 activities)
  {
    id: 71,
    title: "Synchronized movie night: Both start the same movie at the exact same time. Video call on mute. Unmute to react together.",
    duration: "2 hours",
    category: "Video Call",
    energyLevel: "Low",
    location: "Flexible",
    cost: "Free",
    spiceLevel: "G-Rated",
    tips: [
      "Pick a movie you've both been wanting to watch",
      "Count down 3-2-1 and press play together",
      "Keep video call open to see each other's reactions"
    ]
  },
  {
    id: 72,
    title: "Cook together remotely: Same recipe. Video call in kitchen. Cook together step-by-step. Eat 'together.'",
    duration: "60 minutes",
    category: "Video Call",
    energyLevel: "Medium",
    location: "Indoor",
    cost: "Under $20",
    spiceLevel: "G-Rated",
    tips: [
      "Share the recipe beforehand",
      "Shop for ingredients together",
      "Set up your phone so they can see you cook"
    ]
  },
  {
    id: 73,
    title: "Virtual museum tour: Pick a museum with online tours. Video call and explore together. Discuss art.",
    duration: "45 minutes",
    category: "Video Call",
    energyLevel: "Low",
    location: "Flexible",
    cost: "Free",
    spiceLevel: "G-Rated",
    tips: [
      "Try the Louvre, Smithsonian, or British Museum",
      "Take turns picking which exhibits to visit",
      "Share what catches your eye"
    ]
  },
  {
    id: 74,
    title: "Show and tell: Each person shows 5 objects from their day. Explain why each matters.",
    duration: "20 minutes",
    category: "Video Call",
    energyLevel: "Low",
    location: "Flexible",
    cost: "Free",
    spiceLevel: "G-Rated",
    tips: [
      "Pick meaningful or funny items",
      "Tell the story behind each one",
      "Learn about their daily life"
    ]
  },
  {
    id: 75,
    title: "Get ready together: Video call while getting ready for your day. Just exist in the same 'space.'",
    duration: "30 minutes",
    category: "Video Call",
    energyLevel: "Low",
    location: "Indoor",
    cost: "Free",
    spiceLevel: "G-Rated",
    tips: [
      "Set your phone up where they can see you",
      "Chat casually while doing your routine",
      "Makes the distance feel smaller"
    ]
  },
  {
    id: 76,
    title: "Virtual workout: Same workout video. Video call and do it together. Suffer together.",
    duration: "30 minutes",
    category: "Video Call",
    energyLevel: "High",
    location: "Indoor",
    cost: "Free",
    spiceLevel: "G-Rated",
    tips: [
      "Find a YouTube workout you both like",
      "Start at the same time",
      "Accountability makes it easier"
    ]
  },
  {
    id: 77,
    title: "Bedtime story: Take turns reading a book chapter to each other. Fall asleep on call.",
    duration: "30 minutes",
    category: "Video Call",
    energyLevel: "Low",
    location: "Flexible",
    cost: "Free",
    spiceLevel: "G-Rated",
    tips: [
      "Pick a book you both enjoy",
      "Take turns each night",
      "Great for different time zones"
    ]
  },
  {
    id: 78,
    title: "Coffee/tea date: Both make your drink. Video call and just talk. Like a real coffee date.",
    duration: "45 minutes",
    category: "Video Call",
    energyLevel: "Low",
    location: "Flexible",
    cost: "Free",
    spiceLevel: "G-Rated",
    tips: [
      "Get comfortable in your favorite spot",
      "No agenda, just conversation",
      "Low pressure, high intimacy"
    ]
  },
  {
    id: 79,
    title: "Virtual game night: Play online games together. Jackbox, Among Us, chess, whatever.",
    duration: "90 minutes",
    category: "Video Call",
    energyLevel: "Medium",
    location: "Flexible",
    cost: "Free",
    spiceLevel: "G-Rated",
    tips: [
      "Many free games available online",
      "Keep it lighthearted and fun",
      "Winner gets bragging rights"
    ]
  },
  {
    id: 80,
    title: "House tour update: Show them your space. What's new? What changed? Let them 'visit.'",
    duration: "15 minutes",
    category: "Video Call",
    energyLevel: "Low",
    location: "Indoor",
    cost: "Free",
    spiceLevel: "G-Rated",
    tips: [
      "Walk them through your place",
      "Show new decorations or changes",
      "Helps them picture where you are"
    ]
  },
  {
    id: 81,
    title: "Reaction video challenge: Both watch the same YouTube video. Film your reactions. Compare.",
    duration: "20 minutes",
    category: "Video Call",
    energyLevel: "Low",
    location: "Flexible",
    cost: "Free",
    spiceLevel: "G-Rated",
    tips: [
      "Pick something funny or surprising",
      "Record your genuine reactions",
      "Share and laugh together"
    ]
  },
  {
    id: 82,
    title: "Online shopping together: Browse same website on video call. Pick outfits for each other.",
    duration: "30 minutes",
    category: "Video Call",
    energyLevel: "Low",
    location: "Flexible",
    cost: "Free",
    spiceLevel: "G-Rated",
    tips: [
      "Share your screen or browse together",
      "See what they think looks good on you",
      "Learn each other's taste"
    ]
  },

  // ASYNC (10 activities)
  {
    id: 83,
    title: "Photo challenge: Both take a photo of the same thing (sunset, coffee, smile). Send at same time.",
    duration: "5 minutes",
    category: "Async",
    energyLevel: "Low",
    location: "Flexible",
    cost: "Free",
    spiceLevel: "G-Rated",
    tips: [
      "Pick a theme for the day",
      "Set a time to send photos",
      "Works great across time zones"
    ]
  },
  {
    id: 84,
    title: "Voice note story: Take turns adding to a story via voice notes. Build it together over days.",
    duration: "Ongoing",
    category: "Async",
    energyLevel: "Low",
    location: "Flexible",
    cost: "Free",
    spiceLevel: "G-Rated",
    tips: [
      "Start with 'Once upon a time...'",
      "Keep it playful and creative",
      "See where the story goes"
    ]
  },
  {
    id: 85,
    title: "Shared playlist building: Add one song per day that reminds you of them. Listen together later.",
    duration: "Ongoing",
    category: "Async",
    energyLevel: "Low",
    location: "Flexible",
    cost: "Free",
    spiceLevel: "G-Rated",
    tips: [
      "Use Spotify or Apple Music",
      "Explain why each song matters",
      "Creates your reunion soundtrack"
    ]
  },
  {
    id: 86,
    title: "Morning/night routine swap: Film your morning routine. Watch theirs. Feel closer to their day.",
    duration: "10 minutes",
    category: "Async",
    energyLevel: "Low",
    location: "Indoor",
    cost: "Free",
    spiceLevel: "G-Rated",
    tips: [
      "Keep it casual and real",
      "No need to make it perfect",
      "Helps you feel part of their life"
    ]
  },
  {
    id: 87,
    title: "Letter writing: Handwrite a letter. Mail it. Old school. Receive one back.",
    duration: "30 minutes",
    category: "Async",
    energyLevel: "Low",
    location: "Flexible",
    cost: "Under $5",
    spiceLevel: "G-Rated",
    tips: [
      "Handwriting makes it personal",
      "Include small drawings or stickers",
      "Something tangible to hold"
    ]
  },
  {
    id: 88,
    title: "Countdown calendar: Create shared digital countdown to reunion. Add daily reasons you're excited.",
    duration: "5 minutes",
    category: "Async",
    energyLevel: "Low",
    location: "Flexible",
    cost: "Free",
    spiceLevel: "G-Rated",
    tips: [
      "Use a shared calendar or app",
      "Add one reason each day",
      "Builds anticipation together"
    ]
  },
  {
    id: 89,
    title: "Book club for two: Read same book. Discuss chapters over text. Deep conversations.",
    duration: "Ongoing",
    category: "Async",
    energyLevel: "Low",
    location: "Flexible",
    cost: "Under $20",
    spiceLevel: "G-Rated",
    tips: [
      "Pick a book you're both interested in",
      "Set chapter goals together",
      "Discuss as you go"
    ]
  },
  {
    id: 90,
    title: "Instagram story takeover: Post to each other's stories for a day. Show your world.",
    duration: "24 hours",
    category: "Async",
    energyLevel: "Low",
    location: "Flexible",
    cost: "Free",
    spiceLevel: "G-Rated",
    tips: [
      "Share your login temporarily",
      "Post about your day from their account",
      "Public commitment is sweet"
    ]
  },
  {
    id: 91,
    title: "Recipe exchange: Each cook a meal from your culture/region. Send photos. Describe tastes.",
    duration: "60 minutes",
    category: "Async",
    energyLevel: "Medium",
    location: "Indoor",
    cost: "Under $20",
    spiceLevel: "G-Rated",
    tips: [
      "Share family recipes",
      "Explain the cultural significance",
      "Learn each other's backgrounds"
    ]
  },
  {
    id: 92,
    title: "Fitness challenge: Set a weekly goal (steps, workouts). Check in daily. Winner picks next activity.",
    duration: "1 week",
    category: "Async",
    energyLevel: "High",
    location: "Flexible",
    cost: "Free",
    spiceLevel: "G-Rated",
    tips: [
      "Use a fitness app to track",
      "Keep each other accountable",
      "Celebrate small wins together"
    ]
  },

  // TEXT GAMES (8 activities)
  {
    id: 93,
    title: "20 questions (intimate edition): Take turns asking deep questions. No holds barred. Be vulnerable.",
    duration: "30 minutes",
    category: "Text Games",
    energyLevel: "Low",
    location: "Flexible",
    cost: "Free",
    spiceLevel: "G-Rated",
    tips: [
      "Ask things you really want to know",
      "Answer honestly and fully",
      "Deepens your connection"
    ]
  },
  {
    id: 94,
    title: "Would you rather (relationship edition): Silly and serious. Learn each other's preferences.",
    duration: "20 minutes",
    category: "Text Games",
    energyLevel: "Low",
    location: "Flexible",
    cost: "Free",
    spiceLevel: "G-Rated",
    tips: [
      "Mix funny and serious questions",
      "Ask why they chose their answer",
      "Learn something new"
    ]
  },
  {
    id: 95,
    title: "Compliment tennis: Go back and forth with compliments. First to run out does the dishes (when reunited).",
    duration: "10 minutes",
    category: "Text Games",
    energyLevel: "Low",
    location: "Flexible",
    cost: "Free",
    spiceLevel: "G-Rated",
    tips: [
      "Be specific and genuine",
      "Go beyond just 'you're pretty'",
      "Everyone wins with compliments"
    ]
  },
  {
    id: 96,
    title: "Story building: 'Once upon a time...' Each person adds one sentence. Get weird.",
    duration: "20 minutes",
    category: "Text Games",
    energyLevel: "Low",
    location: "Flexible",
    cost: "Free",
    spiceLevel: "G-Rated",
    tips: [
      "Don't think too hard",
      "Let it get silly",
      "See where it goes"
    ]
  },
  {
    id: 97,
    title: "Memory lane: 'Remember when we...' Share favorite memories. One per day for a week.",
    duration: "5 minutes",
    category: "Text Games",
    energyLevel: "Low",
    location: "Flexible",
    cost: "Free",
    spiceLevel: "G-Rated",
    tips: [
      "Pick specific moments",
      "Relive the good times",
      "Strengthens your shared history"
    ]
  },
  {
    id: 98,
    title: "Future planning: Text each other one thing you want to do when reunited. Build anticipation.",
    duration: "5 minutes",
    category: "Text Games",
    energyLevel: "Low",
    location: "Flexible",
    cost: "Free",
    spiceLevel: "G-Rated",
    tips: [
      "Be specific about what you want",
      "Make concrete plans",
      "Creates excitement"
    ]
  },
  {
    id: 99,
    title: "Good morning/night ritual: First and last text of day must be specific (not just 'gm'). Make it meaningful.",
    duration: "2 minutes",
    category: "Text Games",
    energyLevel: "Low",
    location: "Flexible",
    cost: "Free",
    spiceLevel: "G-Rated",
    tips: [
      "Say something real each time",
      "Share one thing from your day",
      "Consistency builds connection"
    ]
  },
  {
    id: 100,
    title: "Two truths and a lie (relationship edition): Make them about your relationship. Guess which is fake.",
    duration: "15 minutes",
    category: "Text Games",
    energyLevel: "Low",
    location: "Flexible",
    cost: "Free",
    spiceLevel: "G-Rated",
    tips: [
      "Make them believable",
      "Test how well you know each other",
      "Learn new things"
    ]
  },

  // ROMANTIC LDR (8 activities)
  {
    id: 101,
    title: "Surprise delivery: Order food/flowers/gift to their location. Time it with a video call. Watch them receive it.",
    duration: "30 minutes",
    category: "Romantic LDR",
    energyLevel: "Low",
    location: "Flexible",
    cost: "$20+",
    spiceLevel: "G-Rated",
    tips: [
      "Use a delivery service in their area",
      "Time it so you're on call when it arrives",
      "High impact romantic gesture"
    ]
  },
  {
    id: 102,
    title: "Wear their shirt: If you have their clothing, wear it. Send photo. Makes them feel close.",
    duration: "5 minutes",
    category: "Romantic LDR",
    energyLevel: "Low",
    location: "Flexible",
    cost: "Free",
    spiceLevel: "PG-13",
    tips: [
      "Their scent makes it special",
      "Take a cute photo",
      "Sensory connection"
    ]
  },
  {
    id: 103,
    title: "Sunset/sunrise share: Both watch at your locations. Send photo. Different sky, same moment.",
    duration: "10 minutes",
    category: "Romantic LDR",
    energyLevel: "Low",
    location: "Outdoor",
    cost: "Free",
    spiceLevel: "G-Rated",
    tips: [
      "Check sunset times for both locations",
      "Share the moment together",
      "Poetic and connecting"
    ]
  },
  {
    id: 104,
    title: "Virtual date night: Both dress up. Set table nice. Video call 'dinner date.' Act like it's real.",
    duration: "90 minutes",
    category: "Romantic LDR",
    energyLevel: "Medium",
    location: "Indoor",
    cost: "Under $20",
    spiceLevel: "G-Rated",
    tips: [
      "Put effort into getting dressed up",
      "Set a nice table with candles",
      "Effort shows love"
    ]
  },
  {
    id: 105,
    title: "Love letter mailbox: Set up shared digital folder. Leave love notes throughout the week. Read Friday night.",
    duration: "Ongoing",
    category: "Romantic LDR",
    energyLevel: "Low",
    location: "Flexible",
    cost: "Free",
    spiceLevel: "G-Rated",
    tips: [
      "Use Google Drive or Dropbox",
      "Add notes when inspired",
      "Anticipation builds all week"
    ]
  },
  {
    id: 106,
    title: "Spotify DJ: Make them a 'what I wish I could say' playlist. Songs say it for you.",
    duration: "30 minutes",
    category: "Romantic LDR",
    energyLevel: "Low",
    location: "Flexible",
    cost: "Free",
    spiceLevel: "G-Rated",
    tips: [
      "Choose songs with meaningful lyrics",
      "Order matters - tell a story",
      "Let the music speak"
    ]
  },
  {
    id: 107,
    title: "Recreate first date: Both set up same scene (restaurant, park, etc). Video call and reminisce.",
    duration: "60 minutes",
    category: "Romantic LDR",
    energyLevel: "Medium",
    location: "Flexible",
    cost: "Under $20",
    spiceLevel: "G-Rated",
    tips: [
      "Recreate the setting as best you can",
      "Talk about that first date",
      "Relive the magic"
    ]
  },
  {
    id: 108,
    title: "Open when letters: Write letters for different occasions ('Open when sad,' 'Open when you miss me'). Mail them.",
    duration: "2 hours",
    category: "Romantic LDR",
    energyLevel: "Low",
    location: "Flexible",
    cost: "Under $5",
    spiceLevel: "G-Rated",
    tips: [
      "Write 5-10 different letters",
      "Be thoughtful about occasions",
      "Provides ongoing comfort"
    ]
  },

  // CREATIVE LDR (6 activities)
  {
    id: 109,
    title: "Collaborative art: Start a drawing. Send photo. Other person adds to it. Send back. Continue.",
    duration: "Ongoing",
    category: "Creative LDR",
    energyLevel: "Low",
    location: "Flexible",
    cost: "Free",
    spiceLevel: "G-Rated",
    tips: [
      "No artistic skill needed",
      "Let it evolve naturally",
      "Creates a shared artifact"
    ]
  },
  {
    id: 110,
    title: "Shared journal: Google Doc where you both write. Thoughts, poems, random. Check it daily.",
    duration: "Ongoing",
    category: "Creative LDR",
    energyLevel: "Low",
    location: "Flexible",
    cost: "Free",
    spiceLevel: "G-Rated",
    tips: [
      "No rules about what to write",
      "Respond to each other's entries",
      "Permanent record of your thoughts"
    ]
  },
  {
    id: 111,
    title: "Vision board together: Pinterest board of future together. Both add pins. Discuss on video call.",
    duration: "45 minutes",
    category: "Creative LDR",
    energyLevel: "Low",
    location: "Flexible",
    cost: "Free",
    spiceLevel: "G-Rated",
    tips: [
      "Create a shared Pinterest board",
      "Add travel, home, lifestyle ideas",
      "Dream together about the future"
    ]
  },
  {
    id: 112,
    title: "TikTok duet: One person makes a video. Other duets it. Make something silly together.",
    duration: "15 minutes",
    category: "Creative LDR",
    energyLevel: "Medium",
    location: "Flexible",
    cost: "Free",
    spiceLevel: "G-Rated",
    tips: [
      "Pick a fun trend or song",
      "Don't take it too seriously",
      "Public display of affection"
    ]
  },
  {
    id: 113,
    title: "Photo album collaboration: Shared album where both add favorite memories. Caption them together.",
    duration: "Ongoing",
    category: "Creative LDR",
    energyLevel: "Low",
    location: "Flexible",
    cost: "Free",
    spiceLevel: "G-Rated",
    tips: [
      "Use Google Photos or iCloud",
      "Add photos as you find them",
      "Your relationship archive"
    ]
  },
  {
    id: 114,
    title: "Plan reunion trip: Both research. Share links. Build itinerary together. Make it special.",
    duration: "90 minutes",
    category: "Creative LDR",
    energyLevel: "Low",
    location: "Flexible",
    cost: "Free",
    spiceLevel: "G-Rated",
    tips: [
      "Use a shared Google Doc",
      "Research fun activities together",
      "Gives you both something to look forward to"
    ]
  },

  // PLANNING LDR (6 activities)
  {
    id: 115,
    title: "Calendar sync: Block out next video call dates. Make them sacred. No canceling.",
    duration: "15 minutes",
    category: "Planning LDR",
    energyLevel: "Low",
    location: "Flexible",
    cost: "Free",
    spiceLevel: "G-Rated",
    tips: [
      "Use a shared calendar",
      "Commit to specific times",
      "Shows it's a priority"
    ]
  },
  {
    id: 116,
    title: "Communication check-in: How's our texting frequency? Too much? Too little? Adjust.",
    duration: "20 minutes",
    category: "Planning LDR",
    energyLevel: "Low",
    location: "Flexible",
    cost: "Free",
    spiceLevel: "G-Rated",
    tips: [
      "Be honest about what you need",
      "Find a balance that works",
      "Prevents resentment"
    ]
  },
  {
    id: 117,
    title: "Time zone coordinator: What times work for both? Create recurring slots. Make it automatic.",
    duration: "20 minutes",
    category: "Planning LDR",
    energyLevel: "Low",
    location: "Flexible",
    cost: "Free",
    spiceLevel: "G-Rated",
    tips: [
      "Find overlapping free time",
      "Set recurring video calls",
      "Reduces daily logistics"
    ]
  },
  {
    id: 118,
    title: "Visit planning: When's next visit? Who's traveling? Book it NOW. Put money down.",
    duration: "45 minutes",
    category: "Planning LDR",
    energyLevel: "Low",
    location: "Flexible",
    cost: "$20+",
    spiceLevel: "G-Rated",
    tips: [
      "Commit to actual dates",
      "Book flights or transportation",
      "Concrete plans create hope"
    ]
  },
  {
    id: 119,
    title: "Relationship state of union: How are we doing with distance? What do we need more/less of?",
    duration: "30 minutes",
    category: "Planning LDR",
    energyLevel: "Low",
    location: "Flexible",
    cost: "Free",
    spiceLevel: "G-Rated",
    tips: [
      "Schedule these regularly",
      "Be honest and constructive",
      "Preventive maintenance for your relationship"
    ]
  },
  {
    id: 120,
    title: "End date discussion: When does distance end? Is there a plan? Talk about it honestly.",
    duration: "60 minutes",
    category: "Planning LDR",
    energyLevel: "Low",
    location: "Flexible",
    cost: "Free",
    spiceLevel: "G-Rated",
    tips: [
      "Long-distance needs an end goal",
      "Be realistic about timelines",
      "Having direction gives hope"
    ]
  },

  // DEEP CONNECTION - ROMANTIC (40 activities)
  {
    id: 121,
    title: "Eye contact challenge: Look into each other's eyes for 2 minutes without talking or laughing.",
    duration: "2 minutes",
    category: "Connection",
    energyLevel: "Low",
    location: "Private",
    cost: "Free",
    spiceLevel: "G-Rated",
    tips: [
      "Set a timer so you don't have to count",
      "It's okay if it feels awkward at first",
      "This builds intimacy and trust"
    ]
  },
  {
    id: 122,
    title: "Share three things you've never told anyone else. Take turns.",
    duration: "15 minutes",
    category: "Connection",
    energyLevel: "Low",
    location: "Private",
    cost: "Free",
    spiceLevel: "G-Rated",
    tips: [
      "Create a safe, judgment-free space",
      "Listen without interrupting",
      "Keep these secrets sacred"
    ]
  },
  {
    id: 123,
    title: "Ask each other: 'What made you fall in love with me?' Answer honestly.",
    duration: "10 minutes",
    category: "Connection",
    energyLevel: "Low",
    location: "Private",
    cost: "Free",
    spiceLevel: "G-Rated",
    tips: [
      "Be specific with your answer",
      "Share the exact moment if you can",
      "This is a beautiful reminder of your bond"
    ]
  },
  {
    id: 124,
    title: "Describe your perfect day together, from waking up to falling asleep.",
    duration: "12 minutes",
    category: "Connection",
    energyLevel: "Low",
    location: "Flexible",
    cost: "Free",
    spiceLevel: "G-Rated",
    tips: [
      "Include all the little details",
      "See how your visions align",
      "Maybe try to make it happen soon"
    ]
  },
  {
    id: 125,
    title: "Take turns finishing: 'I feel most loved by you when you...' Say three things each.",
    duration: "8 minutes",
    category: "Connection",
    energyLevel: "Low",
    location: "Flexible",
    cost: "Free",
    spiceLevel: "G-Rated",
    tips: [
      "Be specific about actions",
      "Remember these - they're your partner's love language",
      "Try to do these more often"
    ]
  },
  {
    id: 126,
    title: "Share your biggest dream that scares you to say out loud. Support each other.",
    duration: "15 minutes",
    category: "Connection",
    energyLevel: "Low",
    location: "Private",
    cost: "Free",
    spiceLevel: "G-Rated",
    tips: [
      "This requires vulnerability",
      "Be each other's biggest cheerleader",
      "Dreams shared are dreams supported"
    ]
  },
  {
    id: 127,
    title: "Trade phones. Each person finds one thing that makes you smile about the other.",
    duration: "10 minutes",
    category: "Connection",
    energyLevel: "Low",
    location: "Flexible",
    cost: "Free",
    spiceLevel: "G-Rated",
    tips: [
      "Look at photos, notes, messages",
      "Share what made you smile",
      "Requires trust and openness"
    ]
  },
  {
    id: 128,
    title: "Tell the story of your relationship from your perspective. Compare notes.",
    duration: "20 minutes",
    category: "Connection",
    energyLevel: "Low",
    location: "Flexible",
    cost: "Free",
    spiceLevel: "G-Rated",
    tips: [
      "Notice what each person remembers",
      "Different perspectives are interesting",
      "You're writing your story together"
    ]
  },
  {
    id: 129,
    title: "What's one thing you wish I knew about you? Now's the time to share.",
    duration: "10 minutes",
    category: "Connection",
    energyLevel: "Low",
    location: "Private",
    cost: "Free",
    spiceLevel: "G-Rated",
    tips: [
      "Be brave and honest",
      "This deepens understanding",
      "Listen with an open heart"
    ]
  },
  {
    id: 130,
    title: "Write down what you love most about today, this moment, with them.",
    duration: "5 minutes",
    category: "Connection",
    energyLevel: "Low",
    location: "Flexible",
    cost: "Free",
    spiceLevel: "G-Rated",
    tips: [
      "Focus on the present moment",
      "Share what you wrote",
      "Keep these notes for hard days"
    ]
  },
  {
    id: 131,
    title: "Give each other a hand massage. No talking. Just be present.",
    duration: "10 minutes",
    category: "Romantic",
    energyLevel: "Low",
    location: "Private",
    cost: "Free",
    spiceLevel: "G-Rated",
    tips: [
      "Use lotion or oil if available",
      "5 minutes per person",
      "Focus on being gentle and caring"
    ]
  },
  {
    id: 132,
    title: "Take turns brushing each other's hair. Make it relaxing and gentle.",
    duration: "8 minutes",
    category: "Romantic",
    energyLevel: "Low",
    location: "Private",
    cost: "Free",
    spiceLevel: "G-Rated",
    tips: [
      "Go slowly and carefully",
      "This is intimate and calming",
      "Works for any hair length"
    ]
  },
  {
    id: 133,
    title: "One person sits. Other gives a 5-minute shoulder massage. Then switch.",
    duration: "10 minutes",
    category: "Romantic",
    energyLevel: "Low",
    location: "Private",
    cost: "Free",
    spiceLevel: "G-Rated",
    tips: [
      "Ask about pressure preference",
      "Focus on tension areas",
      "This is caring, not perfection"
    ]
  },
  {
    id: 134,
    title: "Make each other's favorite drink exactly how they like it. Serve with a kiss.",
    duration: "8 minutes",
    category: "Romantic",
    energyLevel: "Low",
    location: "Indoor",
    cost: "Under $5",
    spiceLevel: "G-Rated",
    tips: [
      "Get all the details right",
      "Present it with care",
      "Small acts of service matter"
    ]
  },
  {
    id: 135,
    title: "Pick out tomorrow's outfit for each other. Explain why you chose it.",
    duration: "10 minutes",
    category: "Romantic",
    energyLevel: "Low",
    location: "Indoor",
    cost: "Free",
    spiceLevel: "G-Rated",
    tips: [
      "Think about what looks good on them",
      "Consider their schedule tomorrow",
      "Have fun with this"
    ]
  },
  {
    id: 136,
    title: "Draw a bath for your partner. Add candles, music, whatever makes it special.",
    duration: "15 minutes",
    category: "Romantic",
    energyLevel: "Low",
    location: "Indoor",
    cost: "Under $5",
    spiceLevel: "G-Rated",
    tips: [
      "Set the perfect temperature",
      "Add bath salts or bubbles",
      "Create a spa atmosphere"
    ]
  },
  {
    id: 137,
    title: "Write three things you'll do this week to make their life easier. Do them.",
    duration: "5 minutes",
    category: "Romantic",
    energyLevel: "Low",
    location: "Flexible",
    cost: "Free",
    spiceLevel: "G-Rated",
    tips: [
      "Think about what they need help with",
      "Follow through is key",
      "Actions speak louder than words"
    ]
  },
  {
    id: 138,
    title: "Feed each other dessert blindfolded. Guess what it is.",
    duration: "10 minutes",
    category: "Romantic",
    energyLevel: "Low",
    location: "Indoor",
    cost: "Under $5",
    spiceLevel: "G-Rated",
    tips: [
      "Choose a variety of textures",
      "Go slowly and carefully",
      "This is playful and intimate"
    ]
  },
  {
    id: 139,
    title: "Take turns reading love quotes. After each one, say why it reminds you of them.",
    duration: "10 minutes",
    category: "Connection",
    energyLevel: "Low",
    location: "Flexible",
    cost: "Free",
    spiceLevel: "G-Rated",
    tips: [
      "Find quotes online or in books",
      "Make it personal with your explanations",
      "This sparks beautiful conversations"
    ]
  },
  {
    id: 140,
    title: "Text each other something you love about them. Read out loud when you get it.",
    duration: "5 minutes",
    category: "Connection",
    energyLevel: "Low",
    location: "Flexible",
    cost: "Free",
    spiceLevel: "G-Rated",
    tips: [
      "Be specific and heartfelt",
      "Read it out loud together",
      "Save these messages"
    ]
  },
  {
    id: 141,
    title: "List 10 reasons you're grateful they're in your life. Go back and forth.",
    duration: "10 minutes",
    category: "Connection",
    energyLevel: "Low",
    location: "Flexible",
    cost: "Free",
    spiceLevel: "G-Rated",
    tips: [
      "Dig deep beyond the obvious",
      "Include little things they do",
      "Gratitude strengthens bonds"
    ]
  },
  {
    id: 142,
    title: "Describe your partner to an imaginary person meeting them for the first time.",
    duration: "8 minutes",
    category: "Connection",
    energyLevel: "Low",
    location: "Flexible",
    cost: "Free",
    spiceLevel: "G-Rated",
    tips: [
      "Share what makes them unique",
      "Include their best qualities",
      "This shows how you see them"
    ]
  },
  {
    id: 143,
    title: "Each write 5 things you admire about the other. Exchange and read them.",
    duration: "12 minutes",
    category: "Connection",
    energyLevel: "Low",
    location: "Flexible",
    cost: "Free",
    spiceLevel: "G-Rated",
    tips: [
      "Write honestly and specifically",
      "Keep these notes",
      "Admiration fuels attraction"
    ]
  },
  {
    id: 144,
    title: "Say 'I love you because...' and finish it 10 different ways each.",
    duration: "10 minutes",
    category: "Connection",
    energyLevel: "Low",
    location: "Flexible",
    cost: "Free",
    spiceLevel: "G-Rated",
    tips: [
      "Go beyond surface reasons",
      "Include actions and qualities",
      "Take turns for each one"
    ]
  },
  {
    id: 145,
    title: "Dim the lights. Light candles. Just sit close and talk about your favorite memories.",
    duration: "20 minutes",
    category: "Romantic",
    energyLevel: "Low",
    location: "Indoor",
    cost: "Under $5",
    spiceLevel: "G-Rated",
    tips: [
      "Create a cozy atmosphere",
      "Share memories from your relationship",
      "No phones - just each other"
    ]
  },
  {
    id: 146,
    title: "Create a couples playlist. Each person adds 5 songs that remind you of them.",
    duration: "15 minutes",
    category: "Romantic",
    energyLevel: "Low",
    location: "Flexible",
    cost: "Free",
    spiceLevel: "G-Rated",
    tips: [
      "Explain why you chose each song",
      "Listen to it together later",
      "Add to it over time"
    ]
  },
  {
    id: 147,
    title: "Dance slowly to your song. If you don't have one, pick one right now.",
    duration: "5 minutes",
    category: "Romantic",
    energyLevel: "Low",
    location: "Indoor",
    cost: "Free",
    spiceLevel: "G-Rated",
    tips: [
      "Hold each other close",
      "Don't worry about dancing well",
      "Be present in the moment"
    ]
  },
  {
    id: 148,
    title: "Stargazing (or ceiling staring). Lie down together and dream out loud.",
    duration: "20 minutes",
    category: "Romantic",
    energyLevel: "Low",
    location: "Flexible",
    cost: "Free",
    spiceLevel: "G-Rated",
    tips: [
      "Get comfortable side by side",
      "Share hopes and dreams",
      "Outside or inside both work"
    ]
  },
  {
    id: 149,
    title: "Make a cozy nest of blankets and pillows. Cuddle and talk about your future.",
    duration: "30 minutes",
    category: "Romantic",
    energyLevel: "Low",
    location: "Indoor",
    cost: "Free",
    spiceLevel: "G-Rated",
    tips: [
      "Make it as comfortable as possible",
      "Talk about dreams and plans",
      "Physical closeness enhances connection"
    ]
  },
  {
    id: 150,
    title: "Turn off all screens. Light candles. Just exist in the same space quietly.",
    duration: "15 minutes",
    category: "Romantic",
    energyLevel: "Low",
    location: "Indoor",
    cost: "Under $5",
    spiceLevel: "G-Rated",
    tips: [
      "Silence can be beautiful",
      "Be comfortable with quiet",
      "Presence is a gift"
    ]
  },
  {
    id: 151,
    title: "Look through old photos together. Each pick your favorite and explain why.",
    duration: "20 minutes",
    category: "Romantic",
    energyLevel: "Low",
    location: "Flexible",
    cost: "Free",
    spiceLevel: "G-Rated",
    tips: [
      "Digital or physical photos both work",
      "Relive happy memories",
      "Notice what each person cherishes"
    ]
  },
  {
    id: 152,
    title: "Recreate your first photo together. Same pose, same energy.",
    duration: "5 minutes",
    category: "Romantic",
    energyLevel: "Low",
    location: "Flexible",
    cost: "Free",
    spiceLevel: "G-Rated",
    tips: [
      "Find that original photo",
      "Get the pose as close as possible",
      "See how you've grown together"
    ]
  },
  {
    id: 153,
    title: "Write a letter to your future selves. Open it on your next anniversary.",
    duration: "15 minutes",
    category: "Romantic",
    energyLevel: "Low",
    location: "Flexible",
    cost: "Free",
    spiceLevel: "G-Rated",
    tips: [
      "Write about today and your hopes",
      "Seal it and date it",
      "Set a reminder to open it"
    ]
  },
  {
    id: 154,
    title: "Plan your dream date night. No budget. Be creative. Then scale it to reality.",
    duration: "15 minutes",
    category: "Romantic",
    energyLevel: "Low",
    location: "Flexible",
    cost: "Free",
    spiceLevel: "G-Rated",
    tips: [
      "Dream big first",
      "Find the essence of the idea",
      "Make a scaled version happen soon"
    ]
  },
  {
    id: 155,
    title: "Share the moment you knew this was serious. Was it the same moment for both?",
    duration: "10 minutes",
    category: "Connection",
    energyLevel: "Low",
    location: "Flexible",
    cost: "Free",
    spiceLevel: "G-Rated",
    tips: [
      "Be specific about the moment",
      "Share what you felt",
      "Different moments are okay"
    ]
  },
  {
    id: 156,
    title: "Create a time capsule of today. Include something meaningful from right now.",
    duration: "15 minutes",
    category: "Romantic",
    energyLevel: "Low",
    location: "Indoor",
    cost: "Free",
    spiceLevel: "G-Rated",
    tips: [
      "Include tickets, notes, small objects",
      "Decide when to open it",
      "Make it special and intentional"
    ]
  },
  {
    id: 157,
    title: "Each share your favorite thing about the other's family. Be specific.",
    duration: "10 minutes",
    category: "Connection",
    energyLevel: "Low",
    location: "Flexible",
    cost: "Free",
    spiceLevel: "G-Rated",
    tips: [
      "This shows you pay attention",
      "Be genuine and thoughtful",
      "Family matters to most people"
    ]
  },
  {
    id: 158,
    title: "Describe the home you want to build together someday. Get detailed.",
    duration: "20 minutes",
    category: "Connection",
    energyLevel: "Low",
    location: "Flexible",
    cost: "Free",
    spiceLevel: "G-Rated",
    tips: [
      "Talk about style, location, features",
      "See where your visions align",
      "Planning together builds future"
    ]
  },
  {
    id: 159,
    title: "Take a selfie. Write on it why today mattered. Save it forever.",
    duration: "5 minutes",
    category: "Romantic",
    energyLevel: "Low",
    location: "Flexible",
    cost: "Free",
    spiceLevel: "G-Rated",
    tips: [
      "Capture the moment authentically",
      "Add a meaningful caption",
      "These become precious over time"
    ]
  },
  {
    id: 160,
    title: "Kiss for 10 seconds. No interruptions. Just be in the moment.",
    duration: "10 seconds",
    category: "Romantic",
    energyLevel: "Low",
    location: "Private",
    cost: "Free",
    spiceLevel: "G-Rated",
    tips: [
      "10 seconds is longer than you think",
      "Stay fully present",
      "Let everything else fade away"
    ]
  },

  // BOREDOM BUSTER - Anti-Doom Scrolling Activities (18 activities)
  {
    id: 161,
    title: "Phone stack: Both phones face down. First to check loses and has to do 10 pushups.",
    duration: "5 minutes",
    category: "Boredom Buster",
    energyLevel: "Low",
    location: "Flexible",
    cost: "Free",
    spiceLevel: "G-Rated",
    tips: [
      "Put phones out of reach",
      "Loser does the punishment immediately",
      "Talk to each other instead of scrolling"
    ]
  },
  {
    id: 162,
    title: "60 second compliment speed round. Take turns. Go!",
    duration: "2 minutes",
    category: "Boredom Buster",
    energyLevel: "Low",
    location: "Flexible",
    cost: "Free",
    spiceLevel: "G-Rated",
    tips: [
      "Set a timer for 1 minute each",
      "Say as many genuine compliments as possible",
      "No repeating - get creative"
    ]
  },
  {
    id: 163,
    title: "Make each other laugh in under 10 seconds. No words allowed. Just faces.",
    duration: "1 minute",
    category: "Boredom Buster",
    energyLevel: "Low",
    location: "Flexible",
    cost: "Free",
    spiceLevel: "G-Rated",
    tips: [
      "Silly faces only",
      "First to laugh loses",
      "Best 3 out of 5"
    ]
  },
  {
    id: 164,
    title: "Show each other the last photo in your camera roll. No skipping. Explain it.",
    duration: "3 minutes",
    category: "Boredom Buster",
    energyLevel: "Low",
    location: "Flexible",
    cost: "Free",
    spiceLevel: "G-Rated",
    tips: [
      "No cheating - last photo only",
      "Tell the story behind it",
      "This is always interesting"
    ]
  },
  {
    id: 165,
    title: "Rapid fire this or that: 20 questions, no thinking. Coffee or tea? Cats or dogs? GO!",
    duration: "2 minutes",
    category: "Boredom Buster",
    energyLevel: "Low",
    location: "Flexible",
    cost: "Free",
    spiceLevel: "G-Rated",
    tips: [
      "No pausing - instant answers",
      "Get silly with the questions",
      "Learn something new about each other"
    ]
  },
  {
    id: 166,
    title: "Mirror game: One person moves slowly, other copies exactly. 90 seconds then switch.",
    duration: "3 minutes",
    category: "Boredom Buster",
    energyLevel: "Low",
    location: "Flexible",
    cost: "Free",
    spiceLevel: "G-Rated",
    tips: [
      "Face each other",
      "Go slow so they can follow",
      "Try to trick them with sudden moves"
    ]
  },
  {
    id: 167,
    title: "Phones down. Eye contact. First to smile loses. What's the punishment? You decide.",
    duration: "2 minutes",
    category: "Boredom Buster",
    energyLevel: "Low",
    location: "Flexible",
    cost: "Free",
    spiceLevel: "G-Rated",
    tips: [
      "No talking",
      "Making faces is cheating (but funny)",
      "Agree on a silly punishment first"
    ]
  },
  {
    id: 168,
    title: "Word association rapid fire. Say the first word that comes to mind. 1 minute.",
    duration: "1 minute",
    category: "Boredom Buster",
    energyLevel: "Low",
    location: "Flexible",
    cost: "Free",
    spiceLevel: "G-Rated",
    tips: [
      "No thinking - just respond",
      "See where it goes",
      "The weirder the better"
    ]
  },
  {
    id: 169,
    title: "Delete one app from your phone right now. Tell them why. Then actually do it.",
    duration: "3 minutes",
    category: "Boredom Buster",
    energyLevel: "Low",
    location: "Flexible",
    cost: "Free",
    spiceLevel: "G-Rated",
    tips: [
      "Choose the most time-wasting app",
      "Support each other in this",
      "Notice how it feels"
    ]
  },
  {
    id: 170,
    title: "Impressions battle: Do your best impression of each other. 30 seconds each.",
    duration: "1 minute",
    category: "Boredom Buster",
    energyLevel: "Medium",
    location: "Flexible",
    cost: "Free",
    spiceLevel: "G-Rated",
    tips: [
      "Exaggerate their quirks lovingly",
      "Include their mannerisms",
      "Laugh together at yourselves"
    ]
  },
  {
    id: 171,
    title: "Phone camera roll roulette: Random number 1-50. Both open that photo and share.",
    duration: "3 minutes",
    category: "Boredom Buster",
    energyLevel: "Low",
    location: "Flexible",
    cost: "Free",
    spiceLevel: "G-Rated",
    tips: [
      "Count back from most recent",
      "Explain the context",
      "Random memories are the best"
    ]
  },
  {
    id: 172,
    title: "20-second dance party. Put on any song. Dance like nobody's watching. GO!",
    duration: "1 minute",
    category: "Boredom Buster",
    energyLevel: "High",
    location: "Flexible",
    cost: "Free",
    spiceLevel: "G-Rated",
    tips: [
      "Don't think - just move",
      "Silly is encouraged",
      "Instant mood boost"
    ]
  },
  {
    id: 173,
    title: "Thumb wrestling best of 5. Loser has to make the next meal or snack.",
    duration: "2 minutes",
    category: "Boredom Buster",
    energyLevel: "Low",
    location: "Flexible",
    cost: "Free",
    spiceLevel: "G-Rated",
    tips: [
      "Warm up those thumbs",
      "Best technique wins",
      "Claim your victory"
    ]
  },
  {
    id: 174,
    title: "Guess what I'm thinking in 20 questions. Yes or no answers only.",
    duration: "5 minutes",
    category: "Boredom Buster",
    energyLevel: "Low",
    location: "Flexible",
    cost: "Free",
    spiceLevel: "G-Rated",
    tips: [
      "Think of something specific",
      "Count the questions",
      "Strategic questions win"
    ]
  },
  {
    id: 175,
    title: "Both put phones in airplane mode for 15 minutes. Actually talk. See what happens.",
    duration: "15 minutes",
    category: "Boredom Buster",
    energyLevel: "Low",
    location: "Flexible",
    cost: "Free",
    spiceLevel: "G-Rated",
    tips: [
      "Actually do it - both phones",
      "Notice the urge to check",
      "Be present with each other"
    ]
  },
  {
    id: 176,
    title: "Screenshot your screen time from today. Compare. No judgment. Just awareness.",
    duration: "3 minutes",
    category: "Boredom Buster",
    energyLevel: "Low",
    location: "Flexible",
    cost: "Free",
    spiceLevel: "G-Rated",
    tips: [
      "Be honest about it",
      "Notice the patterns",
      "Decide together to do better"
    ]
  },
  {
    id: 177,
    title: "Right now: Drop phones and do 10 jumping jacks together. Get the blood moving.",
    duration: "1 minute",
    category: "Boredom Buster",
    energyLevel: "High",
    location: "Flexible",
    cost: "Free",
    spiceLevel: "G-Rated",
    tips: [
      "No excuses - just do it",
      "Count out loud together",
      "Feel immediately better"
    ]
  },
  {
    id: 178,
    title: "Confession time: What were you just scrolling? Be honest. Then put it away.",
    duration: "2 minutes",
    category: "Boredom Buster",
    energyLevel: "Low",
    location: "Flexible",
    cost: "Free",
    spiceLevel: "G-Rated",
    tips: [
      "Total honesty - no shame",
      "Laugh about the rabbit holes",
      "Choose connection over scrolling"
    ]
  },

  // POLYAMOROUS - Activities for ENM/Poly Relationships (40 activities)
  // Group Activities
  {
    id: 179,
    title: "Polycule check-in circle: Everyone shares one high and one low from their week. No interruptions.",
    duration: "15 minutes",
    category: "Polyamorous",
    energyLevel: "Low",
    location: "Flexible",
    cost: "Free",
    spiceLevel: "G-Rated",
    tips: [
      "Give each person equal time",
      "No advice unless asked",
      "Practice active listening"
    ]
  },
  {
    id: 180,
    title: "Relationship map drawing: Draw your polycule on a whiteboard. Lines show connections. Discuss.",
    duration: "20 minutes",
    category: "Polyamorous",
    energyLevel: "Low",
    location: "Indoor",
    cost: "Free",
    spiceLevel: "G-Rated",
    tips: [
      "Use different colors for different relationship types",
      "Include emotional connections",
      "See the web of support"
    ]
  },
  {
    id: 181,
    title: "Group schedule sync: Pull out calendars. Plan the next month's one-on-one time for everyone.",
    duration: "30 minutes",
    category: "Polyamorous",
    energyLevel: "Low",
    location: "Flexible",
    cost: "Free",
    spiceLevel: "G-Rated",
    tips: [
      "Use shared digital calendar",
      "Color code by partner",
      "Include buffer time for flexibility"
    ]
  },
  {
    id: 182,
    title: "Appreciation circle: Go around. Each person says what they love about the person to their left.",
    duration: "10 minutes",
    category: "Polyamorous",
    energyLevel: "Low",
    location: "Flexible",
    cost: "Free",
    spiceLevel: "G-Rated",
    tips: [
      "Be specific with compliments",
      "No 'buts' or qualifiers",
      "Let it sink in"
    ]
  },
  {
    id: 183,
    title: "Create household agreements: What are your shared values? Write them down together.",
    duration: "45 minutes",
    category: "Polyamorous",
    energyLevel: "Low",
    location: "Indoor",
    cost: "Free",
    spiceLevel: "G-Rated",
    tips: [
      "Start with values, not rules",
      "Everyone contributes ideas",
      "Review quarterly"
    ]
  },
  {
    id: 184,
    title: "Polycule game night: Each person picks one game. Winner gets to skip dishes tomorrow.",
    duration: "2 hours",
    category: "Polyamorous",
    energyLevel: "Medium",
    location: "Indoor",
    cost: "Free",
    spiceLevel: "G-Rated",
    tips: [
      "Rotate who picks first",
      "Keep games under 30 minutes each",
      "Friendly competition builds bonds"
    ]
  },
  {
    id: 185,
    title: "Group meal prep: Everyone cooks their signature dish. Family dinner together.",
    duration: "90 minutes",
    category: "Polyamorous",
    energyLevel: "Medium",
    location: "Indoor",
    cost: "Under $20",
    spiceLevel: "G-Rated",
    tips: [
      "Coordinate the menu beforehand",
      "Make it a weekly tradition",
      "Share cooking duties"
    ]
  },
  {
    id: 186,
    title: "Jealousy processing: Someone feeling jealous? Group support session. Listen, validate, problem-solve.",
    duration: "30 minutes",
    category: "Polyamorous",
    energyLevel: "Low",
    location: "Private",
    cost: "Free",
    spiceLevel: "G-Rated",
    tips: [
      "Create safe space for vulnerability",
      "No dismissing feelings",
      "Focus on needs underneath"
    ]
  },
  {
    id: 187,
    title: "Metamour date: Partners who share a partner go out together. Build your relationship.",
    duration: "2 hours",
    category: "Polyamorous",
    energyLevel: "Medium",
    location: "Outdoor",
    cost: "Under $20",
    spiceLevel: "G-Rated",
    tips: [
      "Find common interests",
      "Don't just talk about shared partner",
      "Building this bond strengthens everyone"
    ]
  },
  {
    id: 188,
    title: "Poly movie night: Watch a movie about relationships. Discuss what you'd do differently.",
    duration: "2.5 hours",
    category: "Polyamorous",
    energyLevel: "Low",
    location: "Indoor",
    cost: "Free",
    spiceLevel: "G-Rated",
    tips: [
      "Pick something that sparks discussion",
      "Pause to discuss key moments",
      "Learn from fictional scenarios"
    ]
  },

  // One-on-One Time
  {
    id: 189,
    title: "Protected date night: No phones. No metamour emergencies. Just you two for 3 hours.",
    duration: "3 hours",
    category: "Polyamorous",
    energyLevel: "Medium",
    location: "Flexible",
    cost: "Under $20",
    spiceLevel: "G-Rated",
    tips: [
      "Set boundaries with others beforehand",
      "Turn off notifications",
      "Be fully present"
    ]
  },
  {
    id: 190,
    title: "Relationship state of the union: How are WE doing? What do WE need more/less of?",
    duration: "45 minutes",
    category: "Polyamorous",
    energyLevel: "Low",
    location: "Private",
    cost: "Free",
    spiceLevel: "G-Rated",
    tips: [
      "Use 'I' statements",
      "Focus on this dyad specifically",
      "End with actionable next steps"
    ]
  },
  {
    id: 191,
    title: "Share your other relationships: What's going well with others? What support do you need?",
    duration: "30 minutes",
    category: "Polyamorous",
    energyLevel: "Low",
    location: "Flexible",
    cost: "Free",
    spiceLevel: "G-Rated",
    tips: [
      "Practice compersion",
      "Ask how you can support",
      "Celebrate their joys"
    ]
  },
  {
    id: 192,
    title: "Plan your next adventure: Just the two of you. Where do you want to go? When? Book it.",
    duration: "20 minutes",
    category: "Polyamorous",
    energyLevel: "Low",
    location: "Flexible",
    cost: "Free",
    spiceLevel: "G-Rated",
    tips: [
      "Check calendars for conflicts",
      "Make it special to this relationship",
      "Having plans builds anticipation"
    ]
  },
  {
    id: 193,
    title: "Love language check: How do YOU need love from ME? Has it changed?",
    duration: "20 minutes",
    category: "Polyamorous",
    energyLevel: "Low",
    location: "Flexible",
    cost: "Free",
    spiceLevel: "G-Rated",
    tips: [
      "Needs evolve over time",
      "Be specific about examples",
      "Listen without defensiveness"
    ]
  },
  {
    id: 194,
    title: "Early relationship nostalgia: Remember when we first met? What attracted you? Tell the story.",
    duration: "15 minutes",
    category: "Polyamorous",
    energyLevel: "Low",
    location: "Flexible",
    cost: "Free",
    spiceLevel: "G-Rated",
    tips: [
      "Share what drew you together",
      "Reminisce about early dates",
      "Reconnect with that spark"
    ]
  },
  {
    id: 195,
    title: "Boundaries review: Are our agreements still working? What needs updating?",
    duration: "30 minutes",
    category: "Polyamorous",
    energyLevel: "Low",
    location: "Private",
    cost: "Free",
    spiceLevel: "G-Rated",
    tips: [
      "Agreements should evolve",
      "What worked then may not work now",
      "Renegotiate as needed"
    ]
  },
  {
    id: 196,
    title: "Sensory date: Take turns being blindfolded. Other person creates sensory experiences.",
    duration: "20 minutes",
    category: "Polyamorous",
    energyLevel: "Low",
    location: "Private",
    cost: "Free",
    spiceLevel: "PG-13",
    tips: [
      "Use textures, scents, sounds",
      "Build trust and vulnerability",
      "Focus on presence and sensation"
    ]
  },

  // Communication Exercises
  {
    id: 197,
    title: "NVC practice: Use Non-Violent Communication. 'When you ___, I feel ___, I need ___, would you ___?'",
    duration: "20 minutes",
    category: "Polyamorous",
    energyLevel: "Low",
    location: "Flexible",
    cost: "Free",
    spiceLevel: "G-Rated",
    tips: [
      "Focus on observations not judgments",
      "Name the feeling specifically",
      "Make clear requests"
    ]
  },
  {
    id: 198,
    title: "Active listening drill: One person talks 5 min uninterrupted. Other repeats back what they heard.",
    duration: "10 minutes",
    category: "Polyamorous",
    energyLevel: "Low",
    location: "Flexible",
    cost: "Free",
    spiceLevel: "G-Rated",
    tips: [
      "No interrupting at all",
      "Reflect back emotions too",
      "Practice being heard"
    ]
  },
  {
    id: 199,
    title: "Needs vs. strategies: What's the underlying need? Brainstorm 5 ways to meet it.",
    duration: "25 minutes",
    category: "Polyamorous",
    energyLevel: "Low",
    location: "Flexible",
    cost: "Free",
    spiceLevel: "G-Rated",
    tips: [
      "Get to root need, not surface request",
      "Multiple strategies = flexibility",
      "Creative problem solving"
    ]
  },
  {
    id: 200,
    title: "Compersion practice: Share something good about your other relationships. Others celebrate with you.",
    duration: "15 minutes",
    category: "Polyamorous",
    energyLevel: "Low",
    location: "Flexible",
    cost: "Free",
    spiceLevel: "G-Rated",
    tips: [
      "Joy in partner's joy",
      "Celebrate without comparison",
      "This is advanced poly skill"
    ]
  },
  {
    id: 201,
    title: "Scheduling negotiation: Who gets holidays? Weekends? Practice fair time allocation.",
    duration: "30 minutes",
    category: "Polyamorous",
    energyLevel: "Low",
    location: "Flexible",
    cost: "Free",
    spiceLevel: "G-Rated",
    tips: [
      "Consider everyone's needs",
      "Rotate major holidays",
      "Document the agreements"
    ]
  },
  {
    id: 202,
    title: "Trigger identification: What situations make you feel insecure? Share without blame.",
    duration: "25 minutes",
    category: "Polyamorous",
    energyLevel: "Low",
    location: "Private",
    cost: "Free",
    spiceLevel: "G-Rated",
    tips: [
      "Own your triggers",
      "Share the why behind them",
      "Ask for what helps"
    ]
  },
  {
    id: 203,
    title: "Safer sex talk: When did you last get tested? What are current fluid bonds? Update.",
    duration: "20 minutes",
    category: "Polyamorous",
    energyLevel: "Low",
    location: "Private",
    cost: "Free",
    spiceLevel: "PG-13",
    tips: [
      "Regular testing is essential",
      "Transparency protects everyone",
      "Update when situations change"
    ]
  },

  // Personal Growth
  {
    id: 204,
    title: "Jealousy journal: Write down jealous feelings. What's the fear underneath? Share if ready.",
    duration: "20 minutes",
    category: "Polyamorous",
    energyLevel: "Low",
    location: "Flexible",
    cost: "Free",
    spiceLevel: "G-Rated",
    tips: [
      "Jealousy is information",
      "Dig deeper than surface feeling",
      "Share when you're ready"
    ]
  },
  {
    id: 205,
    title: "Attachment style discussion: What's your attachment? How does it show up in poly?",
    duration: "30 minutes",
    category: "Polyamorous",
    energyLevel: "Low",
    location: "Flexible",
    cost: "Free",
    spiceLevel: "G-Rated",
    tips: [
      "Understanding attachment helps",
      "Poly can trigger attachment wounds",
      "Awareness is first step"
    ]
  },
  {
    id: 206,
    title: "Read 'The Ethical Slut' chapter: Everyone reads one chapter. Discuss what resonated.",
    duration: "45 minutes",
    category: "Polyamorous",
    energyLevel: "Low",
    location: "Flexible",
    cost: "Free",
    spiceLevel: "G-Rated",
    tips: [
      "Pick a chapter together",
      "Share different takeaways",
      "Education strengthens practice"
    ]
  },
  {
    id: 207,
    title: "Personal boundaries check: What are YOUR boundaries (not just relationship agreements)?",
    duration: "15 minutes",
    category: "Polyamorous",
    energyLevel: "Low",
    location: "Flexible",
    cost: "Free",
    spiceLevel: "G-Rated",
    tips: [
      "Your boundaries are yours",
      "They're different from rules",
      "You can say no"
    ]
  },
  {
    id: 208,
    title: "Capacity assessment: On a scale 1-10, what's your relationship capacity right now? Be honest.",
    duration: "10 minutes",
    category: "Polyamorous",
    energyLevel: "Low",
    location: "Flexible",
    cost: "Free",
    spiceLevel: "G-Rated",
    tips: [
      "Capacity fluctuates",
      "Communicate current bandwidth",
      "It's okay to need less sometimes"
    ]
  },

  // Household/Nesting Partners
  {
    id: 209,
    title: "Chore chart creation: Who does what? Make it fair. Make it visible. Stick to it.",
    duration: "30 minutes",
    category: "Polyamorous",
    energyLevel: "Low",
    location: "Indoor",
    cost: "Free",
    spiceLevel: "G-Rated",
    tips: [
      "Equal doesn't mean identical",
      "Play to strengths",
      "Rotate unpleasant tasks"
    ]
  },
  {
    id: 210,
    title: "Quiet hours agreement: When does each person need alone time? Schedule it.",
    duration: "15 minutes",
    category: "Polyamorous",
    energyLevel: "Low",
    location: "Indoor",
    cost: "Free",
    spiceLevel: "G-Rated",
    tips: [
      "Alone time is not rejection",
      "Introverts need this especially",
      "Respect closed doors"
    ]
  },
  {
    id: 211,
    title: "Sleepover protocol: How do we handle overnight guests? Set clear expectations.",
    duration: "20 minutes",
    category: "Polyamorous",
    energyLevel: "Low",
    location: "Indoor",
    cost: "Free",
    spiceLevel: "G-Rated",
    tips: [
      "Discuss beforehand, not during",
      "Everyone's comfort matters",
      "Agree on communication method"
    ]
  },
  {
    id: 212,
    title: "Financial transparency: Who pays what? What's shared? Review quarterly.",
    duration: "45 minutes",
    category: "Polyamorous",
    energyLevel: "Low",
    location: "Indoor",
    cost: "Free",
    spiceLevel: "G-Rated",
    tips: [
      "Money talks prevent resentment",
      "Document the agreements",
      "Adjust as situations change"
    ]
  },
  {
    id: 213,
    title: "Morning routine mapping: Who needs the bathroom when? Who makes coffee? Coordinate.",
    duration: "15 minutes",
    category: "Polyamorous",
    energyLevel: "Low",
    location: "Indoor",
    cost: "Free",
    spiceLevel: "G-Rated",
    tips: [
      "Small logistics matter",
      "Create a flow chart",
      "Prevent morning conflicts"
    ]
  },
  {
    id: 214,
    title: "Conflict resolution protocol: When two people argue, what's the process? Agree now.",
    duration: "30 minutes",
    category: "Polyamorous",
    energyLevel: "Low",
    location: "Indoor",
    cost: "Free",
    spiceLevel: "G-Rated",
    tips: [
      "Decide when emotions are low",
      "Include mediation options",
      "Everyone feels safer with process"
    ]
  },
  {
    id: 215,
    title: "Space claiming: Each person designates one space as theirs. Others respect it.",
    duration: "10 minutes",
    category: "Polyamorous",
    energyLevel: "Low",
    location: "Indoor",
    cost: "Free",
    spiceLevel: "G-Rated",
    tips: [
      "Even small spaces matter",
      "Personal territory reduces stress",
      "Ask before using someone's space"
    ]
  },
  {
    id: 216,
    title: "Kitchen rotation: Who cooks when? Create a schedule. No one cooks 2 days in a row.",
    duration: "20 minutes",
    category: "Polyamorous",
    energyLevel: "Low",
    location: "Indoor",
    cost: "Free",
    spiceLevel: "G-Rated",
    tips: [
      "Fair distribution prevents burnout",
      "Account for work schedules",
      "Include cleanup in rotation"
    ]
  },
  {
    id: 217,
    title: "Guest comfort talk: What makes each person comfortable when someone brings a date home?",
    duration: "25 minutes",
    category: "Polyamorous",
    energyLevel: "Low",
    location: "Indoor",
    cost: "Free",
    spiceLevel: "G-Rated",
    tips: [
      "Discuss before it happens",
      "Be specific about needs",
      "Balance privacy and respect"
    ]
  },
  {
    id: 218,
    title: "House meeting: Weekly 30-min check-in. Celebrations, concerns, updates, scheduling.",
    duration: "30 minutes",
    category: "Polyamorous",
    energyLevel: "Low",
    location: "Indoor",
    cost: "Free",
    spiceLevel: "G-Rated",
    tips: [
      "Same time every week",
      "Start with celebrations",
      "End with action items"
    ]
  },

  // POLYAMOROUS PG-13 - GROUP INTIMACY (8 activities)
  {
    id: 219,
    title: "Cuddle pile: Everyone gets cozy on the couch. Set a timer for 15 minutes. Just be close.",
    duration: "15 minutes",
    category: "Polyamorous",
    energyLevel: "Low",
    location: "Indoor",
    cost: "Free",
    spiceLevel: "PG-13",
    tips: [
      "Discuss comfort levels first",
      "Respect personal boundaries",
      "No pressure to participate"
    ]
  },
  {
    id: 220,
    title: "Pass the kiss: Sit in a circle. First person kisses second, second kisses third, etc. Make each one count.",
    duration: "5 minutes",
    category: "Polyamorous",
    energyLevel: "Low",
    location: "Flexible",
    cost: "Free",
    spiceLevel: "PG-13",
    tips: [
      "Full consent required",
      "Be present with each kiss",
      "Light and playful approach"
    ]
  },
  {
    id: 221,
    title: "Group massage train: Sit in a line. Everyone massages the shoulders of person in front. Then switch.",
    duration: "20 minutes",
    category: "Polyamorous",
    energyLevel: "Medium",
    location: "Indoor",
    cost: "Free",
    spiceLevel: "PG-13",
    tips: [
      "Ask about pressure preferences",
      "Switch halfway through",
      "Creates physical connection"
    ]
  },
  {
    id: 222,
    title: "Strip poker (or any game): Loser removes one item. First naked does dishes for a week.",
    duration: "30 minutes",
    category: "Polyamorous",
    energyLevel: "Medium",
    location: "Indoor",
    cost: "Free",
    spiceLevel: "PG-13",
    tips: [
      "Set clear boundaries beforehand",
      "Stop if anyone uncomfortable",
      "Keep it playful"
    ]
  },
  {
    id: 223,
    title: "Compliment circle (physical edition): Go around. Each person says what they find physically attractive about the next person.",
    duration: "10 minutes",
    category: "Polyamorous",
    energyLevel: "Low",
    location: "Flexible",
    cost: "Free",
    spiceLevel: "PG-13",
    tips: [
      "Be specific and sincere",
      "Focus on what they like being noticed",
      "Celebrate different types of beauty"
    ]
  },
  {
    id: 224,
    title: "Slow dance rotation: Put on slow music. Every 2 minutes, switch partners. Feel the different energies.",
    duration: "15 minutes",
    category: "Polyamorous",
    energyLevel: "Medium",
    location: "Indoor",
    cost: "Free",
    spiceLevel: "PG-13",
    tips: [
      "Create romantic ambiance",
      "Notice each person's unique energy",
      "Be fully present with each partner"
    ]
  },
  {
    id: 225,
    title: "Truth or dare (poly edition): Only relationship/attraction questions. Be brave. Be honest.",
    duration: "20 minutes",
    category: "Polyamorous",
    energyLevel: "Medium",
    location: "Flexible",
    cost: "Free",
    spiceLevel: "PG-13",
    tips: [
      "Respect right to pass",
      "Keep questions thoughtful",
      "Process feelings that arise"
    ]
  },
  {
    id: 226,
    title: "Group bath/hot tub: If space allows, get in together. Talk, relax, be comfortable in bodies.",
    duration: "30 minutes",
    category: "Polyamorous",
    energyLevel: "Low",
    location: "Indoor",
    cost: "Free",
    spiceLevel: "PG-13",
    tips: [
      "Discuss comfort levels first",
      "Focus on relaxation and connection",
      "Not about performance"
    ]
  },

  // POLYAMOROUS PG-13 - JEALOUSY & COMPERSION (7 activities)
  {
    id: 227,
    title: "Compersion practice: One person describes attraction to someone else. Others celebrate, not compete.",
    duration: "15 minutes",
    category: "Polyamorous",
    energyLevel: "Low",
    location: "Flexible",
    cost: "Free",
    spiceLevel: "PG-13",
    tips: [
      "Start small and gentle",
      "Notice your emotional reactions",
      "Celebrate their joy"
    ]
  },
  {
    id: 228,
    title: "Jealousy role-play: Act out a jealous scenario. Practice responding with compassion, not defensiveness.",
    duration: "20 minutes",
    category: "Polyamorous",
    energyLevel: "Medium",
    location: "Flexible",
    cost: "Free",
    spiceLevel: "PG-13",
    tips: [
      "Use hypothetical scenarios",
      "Practice non-defensive responses",
      "Debrief afterwards"
    ]
  },
  {
    id: 229,
    title: "Watch partner flirt: One person flirts with another. Third watches and processes feelings afterwards.",
    duration: "20 minutes",
    category: "Polyamorous",
    energyLevel: "High",
    location: "Flexible",
    cost: "Free",
    spiceLevel: "PG-13",
    tips: [
      "Only if all comfortable",
      "Process emotions honestly",
      "Build jealousy resilience gradually"
    ]
  },
  {
    id: 230,
    title: "Sexy story sharing: Each person describes their hottest recent encounter. Others practice compersion.",
    duration: "15 minutes",
    category: "Polyamorous",
    energyLevel: "Medium",
    location: "Flexible",
    cost: "Free",
    spiceLevel: "PG-13",
    tips: [
      "Respect privacy boundaries",
      "Focus on your own joy",
      "Celebrate others' happiness"
    ]
  },
  {
    id: 231,
    title: "Physical reassurance: When someone feels jealous, everyone gives them physical affection and verbal affirmation.",
    duration: "10 minutes",
    category: "Polyamorous",
    energyLevel: "Low",
    location: "Flexible",
    cost: "Free",
    spiceLevel: "PG-13",
    tips: [
      "Ask what they need",
      "Provide comfort without dismissing feelings",
      "Validate the emotion"
    ]
  },
  {
    id: 232,
    title: "Compare turn-ons: What does each person do differently that you love? Celebrate the variety.",
    duration: "15 minutes",
    category: "Polyamorous",
    energyLevel: "Medium",
    location: "Flexible",
    cost: "Free",
    spiceLevel: "PG-13",
    tips: [
      "Avoid comparisons that hurt",
      "Emphasize uniqueness",
      "Appreciate different qualities"
    ]
  },
  {
    id: 233,
    title: "Jealousy trigger exploration: Share what makes you jealous. Others practice NOT doing it on purpose.",
    duration: "20 minutes",
    category: "Polyamorous",
    energyLevel: "Medium",
    location: "Flexible",
    cost: "Free",
    spiceLevel: "PG-13",
    tips: [
      "Be specific about triggers",
      "Not about controlling others",
      "Build awareness and compassion"
    ]
  },

  // POLYAMOROUS PG-13 - DYAD TIME (WITHIN POLY CONTEXT) (8 activities)
  {
    id: 234,
    title: "Reclaiming ritual: After one partner has been with someone else, reconnect physically. Cuddle, kiss, be present.",
    duration: "30 minutes",
    category: "Polyamorous",
    energyLevel: "Medium",
    location: "Indoor",
    cost: "Free",
    spiceLevel: "PG-13",
    tips: [
      "Focus on reconnection",
      "Be present with each other",
      "No performance pressure"
    ]
  },
  {
    id: 235,
    title: "Our unique connection: What do WE have that's special? What do I get from YOU that's different?",
    duration: "20 minutes",
    category: "Polyamorous",
    energyLevel: "Low",
    location: "Flexible",
    cost: "Free",
    spiceLevel: "PG-13",
    tips: [
      "Celebrate your unique bond",
      "Avoid comparing to other relationships",
      "Name specific qualities"
    ]
  },
  {
    id: 236,
    title: "Sexy confession: Tell them what you love about their body. Be specific. Be bold.",
    duration: "10 minutes",
    category: "Polyamorous",
    energyLevel: "Medium",
    location: "Flexible",
    cost: "Free",
    spiceLevel: "PG-13",
    tips: [
      "Be genuinely specific",
      "Focus on what you desire",
      "Make them feel seen"
    ]
  },
  {
    id: 237,
    title: "Make out like teenagers: 15 minutes of just kissing. Nothing else. Remember why you wanted each other.",
    duration: "15 minutes",
    category: "Polyamorous",
    energyLevel: "Medium",
    location: "Indoor",
    cost: "Free",
    spiceLevel: "PG-13",
    tips: [
      "No goal except kissing",
      "Be fully present",
      "Rediscover each other"
    ]
  },
  {
    id: 238,
    title: "Share fantasies: What do you want to try? What haven't we done yet? Plan it.",
    duration: "20 minutes",
    category: "Polyamorous",
    energyLevel: "Low",
    location: "Flexible",
    cost: "Free",
    spiceLevel: "PG-13",
    tips: [
      "No judgment zone",
      "Be open and honest",
      "Create exciting plans together"
    ]
  },
  {
    id: 239,
    title: "Morning after talk: After being with someone else, share details if wanted. Practice transparency.",
    duration: "15 minutes",
    category: "Polyamorous",
    energyLevel: "Low",
    location: "Flexible",
    cost: "Free",
    spiceLevel: "PG-13",
    tips: [
      "Only share if both want it",
      "Respect privacy of others",
      "Build trust through openness"
    ]
  },
  {
    id: 240,
    title: "Desire check-in: On a scale 1-10, how much do you want me right now? Why? What would make it higher?",
    duration: "10 minutes",
    category: "Polyamorous",
    energyLevel: "Low",
    location: "Flexible",
    cost: "Free",
    spiceLevel: "PG-13",
    tips: [
      "Be honest without cruelty",
      "Discuss what influences desire",
      "Non-defensive listening"
    ]
  },
  {
    id: 241,
    title: "Body worship: Take turns appreciating each other's body out loud. Touch is optional but encouraged.",
    duration: "15 minutes",
    category: "Polyamorous",
    energyLevel: "Medium",
    location: "Indoor",
    cost: "Free",
    spiceLevel: "PG-13",
    tips: [
      "Speak from genuine appreciation",
      "Notice what makes them glow",
      "Create safe vulnerability"
    ]
  },

  // POLYAMOROUS PG-13 - METAMOUR CONNECTION (4 activities)
  {
    id: 242,
    title: "Metamour massage exchange: You both love the same person. Give each other a back massage. Bond.",
    duration: "20 minutes",
    category: "Polyamorous",
    energyLevel: "Medium",
    location: "Indoor",
    cost: "Free",
    spiceLevel: "PG-13",
    tips: [
      "Build caring between metamours",
      "Respect comfort boundaries",
      "Create alliance, not rivalry"
    ]
  },
  {
    id: 243,
    title: "Compare notes (flirty edition): What does your shared partner like? Share tips. Get detailed.",
    duration: "15 minutes",
    category: "Polyamorous",
    energyLevel: "Low",
    location: "Flexible",
    cost: "Free",
    spiceLevel: "PG-13",
    tips: [
      "Respect their privacy boundaries",
      "Collaborate for their happiness",
      "Build metamour alliance"
    ]
  },
  {
    id: 244,
    title: "Process jealousy together: You're both dating them. Be honest about hard feelings. Support each other.",
    duration: "30 minutes",
    category: "Polyamorous",
    energyLevel: "High",
    location: "Flexible",
    cost: "Free",
    spiceLevel: "PG-13",
    tips: [
      "Vulnerability builds connection",
      "Support each other's struggles",
      "Shared challenges create bonds"
    ]
  },
  {
    id: 245,
    title: "Appreciation exchange: What do you appreciate about me being in their life? Say it directly.",
    duration: "10 minutes",
    category: "Polyamorous",
    energyLevel: "Low",
    location: "Flexible",
    cost: "Free",
    spiceLevel: "PG-13",
    tips: [
      "Name specific contributions",
      "Practice compersion",
      "Build positive metamour relationships"
    ]
  },

  // POLYAMOROUS PG-13 - SPICY GROUP DYNAMICS (3 activities)
  {
    id: 246,
    title: "Kissing booth: One person sits. Others take turns kissing them. Rate each kiss 1-10. Be playful.",
    duration: "10 minutes",
    category: "Polyamorous",
    energyLevel: "Medium",
    location: "Flexible",
    cost: "Free",
    spiceLevel: "PG-13",
    tips: [
      "Keep it light and fun",
      "Everyone consents first",
      "Celebrate different styles"
    ]
  },
  {
    id: 247,
    title: "Attraction ranking (consensual): Each person ranks who they're most physically attracted to right now. Discuss.",
    duration: "15 minutes",
    category: "Polyamorous",
    energyLevel: "High",
    location: "Flexible",
    cost: "Free",
    spiceLevel: "PG-13",
    tips: [
      "Requires high trust",
      "Attraction fluctuates",
      "Process feelings that arise"
    ]
  },
  {
    id: 248,
    title: "Group makeout: If everyone consents, set a timer for 10 minutes. Rotate kissing partners. Enjoy.",
    duration: "10 minutes",
    category: "Polyamorous",
    energyLevel: "Medium",
    location: "Indoor",
    cost: "Free",
    spiceLevel: "PG-13",
    tips: [
      "Full enthusiastic consent required",
      "Anyone can stop anytime",
      "Be present with each person"
    ]
  },

  // POLYAMOROUS PG-13 - BONUS ACTIVITIES (5 activities)
  {
    id: 249,
    title: "New relationship energy talk: Someone has NRE with someone new? Others practice being happy for them.",
    duration: "20 minutes",
    category: "Polyamorous",
    energyLevel: "Medium",
    location: "Flexible",
    cost: "Free",
    spiceLevel: "PG-13",
    tips: [
      "NRE is natural and temporary",
      "Practice compersion",
      "Maintain existing relationship care"
    ]
  },
  {
    id: 250,
    title: "Attention auction: Each person bids for one-on-one time. Winner gets their preferred activity. Others practice patience.",
    duration: "15 minutes",
    category: "Polyamorous",
    energyLevel: "Low",
    location: "Flexible",
    cost: "Free",
    spiceLevel: "PG-13",
    tips: [
      "Make it fair and fun",
      "Everyone gets turns",
      "Balance needs creatively"
    ]
  },
  {
    id: 251,
    title: "Sexy scheduling: Look at calendar. Block out intimate time with each person. Make it fair. Make it hot.",
    duration: "20 minutes",
    category: "Polyamorous",
    energyLevel: "Low",
    location: "Flexible",
    cost: "Free",
    spiceLevel: "PG-13",
    tips: [
      "Prioritize intimate connection",
      "Distribute fairly",
      "Build anticipation"
    ]
  },
  {
    id: 252,
    title: "Describe your type: What attracted you to each person? How are they different? Celebrate variety.",
    duration: "15 minutes",
    category: "Polyamorous",
    energyLevel: "Low",
    location: "Flexible",
    cost: "Free",
    spiceLevel: "PG-13",
    tips: [
      "Appreciate different qualities",
      "Avoid hurtful comparisons",
      "Celebrate uniqueness"
    ]
  },
  {
    id: 253,
    title: "Physical preference sharing: What kind of touch does each person like? Demonstrate. Take notes.",
    duration: "20 minutes",
    category: "Polyamorous",
    energyLevel: "Medium",
    location: "Flexible",
    cost: "Free",
    spiceLevel: "PG-13",
    tips: [
      "Be specific about preferences",
      "Demonstrate if comfortable",
      "Learn each other deeply"
    ]
  }
];

export function getRandomActivity(): Activity {
  const randomIndex = Math.floor(Math.random() * activities.length);
  return activities[randomIndex];
}
