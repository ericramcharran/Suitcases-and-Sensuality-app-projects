// Trivia Questions Database for Spark It!
// Hundreds of questions across multiple categories

export interface TriviaCategory {
  name: string;
  description: string;
  icon: string; // Lucide React icon name
}

export interface TriviaQuestion {
  category: string;
  question: string;
  correctAnswer: string;
  wrongAnswers: [string, string, string];
  difficulty: 'easy' | 'medium' | 'hard';
  funFact?: string;
}

export const triviaCategories: TriviaCategory[] = [
  {
    name: "Pop Culture",
    description: "Movies, music, celebrities, and entertainment",
    icon: "Film"
  },
  {
    name: "History",
    description: "Historical events, figures, and eras",
    icon: "Book"
  },
  {
    name: "Science",
    description: "Biology, chemistry, physics, and nature",
    icon: "Atom"
  },
  {
    name: "Geography",
    description: "Countries, cities, and landmarks",
    icon: "Globe"
  },
  {
    name: "Sports",
    description: "Athletes, teams, and sporting events",
    icon: "Trophy"
  },
  {
    name: "Food & Drink",
    description: "Cuisine, cooking, and beverages",
    icon: "UtensilsCrossed"
  },
  {
    name: "Technology",
    description: "Computers, internet, and innovation",
    icon: "Laptop"
  },
  {
    name: "Music",
    description: "Artists, songs, and instruments",
    icon: "Music"
  },
  {
    name: "Art & Literature",
    description: "Books, authors, paintings, and artists",
    icon: "Palette"
  },
  {
    name: "General Knowledge",
    description: "A mix of everything",
    icon: "Brain"
  }
];

export const triviaQuestions: TriviaQuestion[] = [
  // Pop Culture (30 questions)
  {
    category: "Pop Culture",
    question: "What year was the first Harry Potter book published?",
    correctAnswer: "1997",
    wrongAnswers: ["1995", "1999", "2000"],
    difficulty: "medium",
    funFact: "J.K. Rowling was rejected by 12 publishers before Bloomsbury accepted Harry Potter."
  },
  {
    category: "Pop Culture",
    question: "Who played Iron Man in the Marvel Cinematic Universe?",
    correctAnswer: "Robert Downey Jr.",
    wrongAnswers: ["Chris Evans", "Mark Ruffalo", "Chris Hemsworth"],
    difficulty: "easy"
  },
  {
    category: "Pop Culture",
    question: "What is the name of the coffee shop in Friends?",
    correctAnswer: "Central Perk",
    wrongAnswers: ["Java Junction", "The Grind", "Coffee Central"],
    difficulty: "medium"
  },
  {
    category: "Pop Culture",
    question: "Which singer's real name is Stefani Joanne Angelina Germanotta?",
    correctAnswer: "Lady Gaga",
    wrongAnswers: ["Madonna", "Pink", "Katy Perry"],
    difficulty: "medium"
  },
  {
    category: "Pop Culture",
    question: "What movie won the Best Picture Oscar in 2020?",
    correctAnswer: "Parasite",
    wrongAnswers: ["1917", "Joker", "Once Upon a Time in Hollywood"],
    difficulty: "hard"
  },
  {
    category: "Pop Culture",
    question: "What is Baby Yoda's real name in The Mandalorian?",
    correctAnswer: "Grogu",
    wrongAnswers: ["Yoda Jr.", "Yodaling", "Mini Yoda"],
    difficulty: "medium"
  },
  {
    category: "Pop Culture",
    question: "Who directed The Shawshank Redemption?",
    correctAnswer: "Frank Darabont",
    wrongAnswers: ["Steven Spielberg", "Martin Scorsese", "Christopher Nolan"],
    difficulty: "hard"
  },
  {
    category: "Pop Culture",
    question: "Which Kardashian sister is the oldest?",
    correctAnswer: "Kourtney",
    wrongAnswers: ["Kim", "Khloé", "Kylie"],
    difficulty: "easy"
  },
  {
    category: "Pop Culture",
    question: "What was the first Pixar movie?",
    correctAnswer: "Toy Story",
    wrongAnswers: ["A Bug's Life", "Finding Nemo", "Monsters, Inc."],
    difficulty: "easy"
  },
  {
    category: "Pop Culture",
    question: "Who played Jack in Titanic?",
    correctAnswer: "Leonardo DiCaprio",
    wrongAnswers: ["Brad Pitt", "Johnny Depp", "Matt Damon"],
    difficulty: "easy"
  },
  {
    category: "Pop Culture",
    question: "What is the highest-grossing film of all time?",
    correctAnswer: "Avatar",
    wrongAnswers: ["Avengers: Endgame", "Titanic", "Star Wars: The Force Awakens"],
    difficulty: "medium"
  },
  {
    category: "Pop Culture",
    question: "Who sang 'Thriller'?",
    correctAnswer: "Michael Jackson",
    wrongAnswers: ["Prince", "James Brown", "Stevie Wonder"],
    difficulty: "easy"
  },
  {
    category: "Pop Culture",
    question: "What Netflix series is set in the 1980s in Hawkins, Indiana?",
    correctAnswer: "Stranger Things",
    wrongAnswers: ["The Umbrella Academy", "Ozark", "Dark"],
    difficulty: "easy"
  },
  {
    category: "Pop Culture",
    question: "Which actress plays Hermione Granger in Harry Potter?",
    correctAnswer: "Emma Watson",
    wrongAnswers: ["Emma Stone", "Emma Roberts", "Emily Blunt"],
    difficulty: "easy"
  },
  {
    category: "Pop Culture",
    question: "What was the first Disney princess movie?",
    correctAnswer: "Snow White and the Seven Dwarfs",
    wrongAnswers: ["Cinderella", "Sleeping Beauty", "The Little Mermaid"],
    difficulty: "medium"
  },
  {
    category: "Pop Culture",
    question: "Who voices Elsa in Frozen?",
    correctAnswer: "Idina Menzel",
    wrongAnswers: ["Kristen Bell", "Mandy Moore", "Anna Kendrick"],
    difficulty: "medium"
  },
  {
    category: "Pop Culture",
    question: "What is the name of the kingdom in Tangled?",
    correctAnswer: "Corona",
    wrongAnswers: ["Arendelle", "DunBroch", "Agrabah"],
    difficulty: "hard"
  },
  {
    category: "Pop Culture",
    question: "Who won American Idol's first season?",
    correctAnswer: "Kelly Clarkson",
    wrongAnswers: ["Carrie Underwood", "Jennifer Hudson", "Clay Aiken"],
    difficulty: "medium"
  },
  {
    category: "Pop Culture",
    question: "What year did YouTube launch?",
    correctAnswer: "2005",
    wrongAnswers: ["2003", "2007", "2009"],
    difficulty: "medium"
  },
  {
    category: "Pop Culture",
    question: "Who created The Simpsons?",
    correctAnswer: "Matt Groening",
    wrongAnswers: ["Seth MacFarlane", "Mike Judge", "Trey Parker"],
    difficulty: "hard"
  },
  {
    category: "Pop Culture",
    question: "What is Superman's weakness?",
    correctAnswer: "Kryptonite",
    wrongAnswers: ["Magic", "Water", "Gold"],
    difficulty: "easy"
  },
  {
    category: "Pop Culture",
    question: "Who played Joker in The Dark Knight?",
    correctAnswer: "Heath Ledger",
    wrongAnswers: ["Joaquin Phoenix", "Jack Nicholson", "Jared Leto"],
    difficulty: "easy"
  },
  {
    category: "Pop Culture",
    question: "What is the name of Ross's monkey in Friends?",
    correctAnswer: "Marcel",
    wrongAnswers: ["Romeo", "Max", "Milo"],
    difficulty: "hard"
  },
  {
    category: "Pop Culture",
    question: "Who sang 'Rolling in the Deep'?",
    correctAnswer: "Adele",
    wrongAnswers: ["Amy Winehouse", "Sia", "Florence Welch"],
    difficulty: "easy"
  },
  {
    category: "Pop Culture",
    question: "What streaming service is 'The Crown' on?",
    correctAnswer: "Netflix",
    wrongAnswers: ["Amazon Prime", "Hulu", "Disney+"],
    difficulty: "easy"
  },
  {
    category: "Pop Culture",
    question: "Who plays Wonder Woman?",
    correctAnswer: "Gal Gadot",
    wrongAnswers: ["Margot Robbie", "Scarlett Johansson", "Charlize Theron"],
    difficulty: "easy"
  },
  {
    category: "Pop Culture",
    question: "What is the name of Jon Snow's direwolf in Game of Thrones?",
    correctAnswer: "Ghost",
    wrongAnswers: ["Grey Wind", "Shaggydog", "Summer"],
    difficulty: "medium"
  },
  {
    category: "Pop Culture",
    question: "Who voices Woody in Toy Story?",
    correctAnswer: "Tom Hanks",
    wrongAnswers: ["Tim Allen", "Billy Crystal", "Steve Buscemi"],
    difficulty: "easy"
  },
  {
    category: "Pop Culture",
    question: "What was the first song played on MTV?",
    correctAnswer: "Video Killed the Radio Star",
    wrongAnswers: ["Billie Jean", "Like a Virgin", "Sweet Child O' Mine"],
    difficulty: "hard",
    funFact: "MTV launched on August 1, 1981, and this Buggles song was the perfect choice."
  },
  {
    category: "Pop Culture",
    question: "Who directed Pulp Fiction?",
    correctAnswer: "Quentin Tarantino",
    wrongAnswers: ["Martin Scorsese", "Coen Brothers", "David Fincher"],
    difficulty: "medium"
  },

  // History (25 questions)
  {
    category: "History",
    question: "What year did World War II end?",
    correctAnswer: "1945",
    wrongAnswers: ["1944", "1946", "1943"],
    difficulty: "easy"
  },
  {
    category: "History",
    question: "Who was the first President of the United States?",
    correctAnswer: "George Washington",
    wrongAnswers: ["Thomas Jefferson", "John Adams", "Benjamin Franklin"],
    difficulty: "easy"
  },
  {
    category: "History",
    question: "In what year did the Titanic sink?",
    correctAnswer: "1912",
    wrongAnswers: ["1910", "1914", "1916"],
    difficulty: "medium"
  },
  {
    category: "History",
    question: "Who was the first person to walk on the moon?",
    correctAnswer: "Neil Armstrong",
    wrongAnswers: ["Buzz Aldrin", "John Glenn", "Yuri Gagarin"],
    difficulty: "easy"
  },
  {
    category: "History",
    question: "What ancient wonder of the world still exists today?",
    correctAnswer: "Great Pyramid of Giza",
    wrongAnswers: ["Hanging Gardens of Babylon", "Colossus of Rhodes", "Lighthouse of Alexandria"],
    difficulty: "medium"
  },
  {
    category: "History",
    question: "Who painted the Mona Lisa?",
    correctAnswer: "Leonardo da Vinci",
    wrongAnswers: ["Michelangelo", "Raphael", "Donatello"],
    difficulty: "easy"
  },
  {
    category: "History",
    question: "What year did the Berlin Wall fall?",
    correctAnswer: "1989",
    wrongAnswers: ["1987", "1991", "1985"],
    difficulty: "medium"
  },
  {
    category: "History",
    question: "Who was the longest-reigning British monarch before Elizabeth II?",
    correctAnswer: "Queen Victoria",
    wrongAnswers: ["King George III", "Queen Elizabeth I", "King Edward VII"],
    difficulty: "hard"
  },
  {
    category: "History",
    question: "In what year did Christopher Columbus first reach the Americas?",
    correctAnswer: "1492",
    wrongAnswers: ["1486", "1498", "1500"],
    difficulty: "easy"
  },
  {
    category: "History",
    question: "Who was known as the 'Maid of Orleans'?",
    correctAnswer: "Joan of Arc",
    wrongAnswers: ["Marie Antoinette", "Catherine the Great", "Cleopatra"],
    difficulty: "medium"
  },
  {
    category: "History",
    question: "What empire was ruled by Julius Caesar?",
    correctAnswer: "Roman Empire",
    wrongAnswers: ["Greek Empire", "Persian Empire", "Byzantine Empire"],
    difficulty: "easy"
  },
  {
    category: "History",
    question: "Who wrote the Declaration of Independence?",
    correctAnswer: "Thomas Jefferson",
    wrongAnswers: ["Benjamin Franklin", "John Adams", "George Washington"],
    difficulty: "medium"
  },
  {
    category: "History",
    question: "What year did the Great Fire of London occur?",
    correctAnswer: "1666",
    wrongAnswers: ["1656", "1676", "1686"],
    difficulty: "hard"
  },
  {
    category: "History",
    question: "Who was the first woman to win a Nobel Prize?",
    correctAnswer: "Marie Curie",
    wrongAnswers: ["Rosalind Franklin", "Dorothy Hodgkin", "Jane Goodall"],
    difficulty: "medium"
  },
  {
    category: "History",
    question: "What was the name of the ship Charles Darwin sailed on?",
    correctAnswer: "HMS Beagle",
    wrongAnswers: ["HMS Victory", "HMS Endeavour", "HMS Discovery"],
    difficulty: "hard"
  },
  {
    category: "History",
    question: "Who invented the telephone?",
    correctAnswer: "Alexander Graham Bell",
    wrongAnswers: ["Thomas Edison", "Nikola Tesla", "Samuel Morse"],
    difficulty: "easy"
  },
  {
    category: "History",
    question: "What ancient civilization built Machu Picchu?",
    correctAnswer: "Inca",
    wrongAnswers: ["Aztec", "Maya", "Olmec"],
    difficulty: "medium"
  },
  {
    category: "History",
    question: "Who was assassinated on June 28, 1914, triggering WWI?",
    correctAnswer: "Archduke Franz Ferdinand",
    wrongAnswers: ["Kaiser Wilhelm II", "Tsar Nicholas II", "King George V"],
    difficulty: "hard"
  },
  {
    category: "History",
    question: "What year did India gain independence from Britain?",
    correctAnswer: "1947",
    wrongAnswers: ["1945", "1949", "1952"],
    difficulty: "medium"
  },
  {
    category: "History",
    question: "Who led the Mongol Empire in the 13th century?",
    correctAnswer: "Genghis Khan",
    wrongAnswers: ["Kublai Khan", "Attila the Hun", "Tamerlane"],
    difficulty: "medium"
  },
  {
    category: "History",
    question: "What was the name of the first artificial satellite?",
    correctAnswer: "Sputnik",
    wrongAnswers: ["Explorer", "Vanguard", "Luna"],
    difficulty: "medium"
  },
  {
    category: "History",
    question: "Who discovered penicillin?",
    correctAnswer: "Alexander Fleming",
    wrongAnswers: ["Louis Pasteur", "Jonas Salk", "Edward Jenner"],
    difficulty: "medium"
  },
  {
    category: "History",
    question: "What year did the French Revolution begin?",
    correctAnswer: "1789",
    wrongAnswers: ["1776", "1792", "1801"],
    difficulty: "medium"
  },
  {
    category: "History",
    question: "Who was the first emperor of Rome?",
    correctAnswer: "Augustus",
    wrongAnswers: ["Julius Caesar", "Nero", "Caligula"],
    difficulty: "hard"
  },
  {
    category: "History",
    question: "What was the capital of the Byzantine Empire?",
    correctAnswer: "Constantinople",
    wrongAnswers: ["Rome", "Athens", "Alexandria"],
    difficulty: "medium"
  },

  // Science (30 questions)
  {
    category: "Science",
    question: "What is the chemical symbol for gold?",
    correctAnswer: "Au",
    wrongAnswers: ["Go", "Gd", "Ag"],
    difficulty: "medium"
  },
  {
    category: "Science",
    question: "What planet is closest to the Sun?",
    correctAnswer: "Mercury",
    wrongAnswers: ["Venus", "Mars", "Earth"],
    difficulty: "easy"
  },
  {
    category: "Science",
    question: "How many bones are in the adult human body?",
    correctAnswer: "206",
    wrongAnswers: ["198", "214", "220"],
    difficulty: "medium"
  },
  {
    category: "Science",
    question: "What is the powerhouse of the cell?",
    correctAnswer: "Mitochondria",
    wrongAnswers: ["Nucleus", "Ribosome", "Chloroplast"],
    difficulty: "easy"
  },
  {
    category: "Science",
    question: "What gas do plants absorb from the atmosphere?",
    correctAnswer: "Carbon Dioxide",
    wrongAnswers: ["Oxygen", "Nitrogen", "Hydrogen"],
    difficulty: "easy"
  },
  {
    category: "Science",
    question: "What is the speed of light?",
    correctAnswer: "299,792,458 m/s",
    wrongAnswers: ["150,000,000 m/s", "500,000,000 m/s", "1,000,000,000 m/s"],
    difficulty: "hard"
  },
  {
    category: "Science",
    question: "What is the largest organ in the human body?",
    correctAnswer: "Skin",
    wrongAnswers: ["Liver", "Brain", "Heart"],
    difficulty: "medium"
  },
  {
    category: "Science",
    question: "What is H2O commonly known as?",
    correctAnswer: "Water",
    wrongAnswers: ["Hydrogen Peroxide", "Heavy Water", "Hydroxide"],
    difficulty: "easy"
  },
  {
    category: "Science",
    question: "How many chromosomes do humans have?",
    correctAnswer: "46",
    wrongAnswers: ["42", "48", "50"],
    difficulty: "medium"
  },
  {
    category: "Science",
    question: "What is the hardest natural substance on Earth?",
    correctAnswer: "Diamond",
    wrongAnswers: ["Titanium", "Tungsten", "Graphene"],
    difficulty: "easy"
  },
  {
    category: "Science",
    question: "Who developed the theory of relativity?",
    correctAnswer: "Albert Einstein",
    wrongAnswers: ["Isaac Newton", "Stephen Hawking", "Niels Bohr"],
    difficulty: "easy"
  },
  {
    category: "Science",
    question: "What is the smallest unit of life?",
    correctAnswer: "Cell",
    wrongAnswers: ["Atom", "Molecule", "Organism"],
    difficulty: "easy"
  },
  {
    category: "Science",
    question: "What planet is known as the Red Planet?",
    correctAnswer: "Mars",
    wrongAnswers: ["Venus", "Jupiter", "Mercury"],
    difficulty: "easy"
  },
  {
    category: "Science",
    question: "What is the most abundant gas in Earth's atmosphere?",
    correctAnswer: "Nitrogen",
    wrongAnswers: ["Oxygen", "Carbon Dioxide", "Argon"],
    difficulty: "medium"
  },
  {
    category: "Science",
    question: "How long does it take for light from the Sun to reach Earth?",
    correctAnswer: "8 minutes",
    wrongAnswers: ["4 minutes", "12 minutes", "16 minutes"],
    difficulty: "medium"
  },
  {
    category: "Science",
    question: "What is the freezing point of water in Celsius?",
    correctAnswer: "0°C",
    wrongAnswers: ["32°C", "-10°C", "10°C"],
    difficulty: "easy"
  },
  {
    category: "Science",
    question: "What force keeps planets in orbit around the Sun?",
    correctAnswer: "Gravity",
    wrongAnswers: ["Magnetism", "Centrifugal Force", "Friction"],
    difficulty: "easy"
  },
  {
    category: "Science",
    question: "What is the study of weather called?",
    correctAnswer: "Meteorology",
    wrongAnswers: ["Climatology", "Geology", "Astronomy"],
    difficulty: "medium"
  },
  {
    category: "Science",
    question: "What particle has a negative charge?",
    correctAnswer: "Electron",
    wrongAnswers: ["Proton", "Neutron", "Photon"],
    difficulty: "easy"
  },
  {
    category: "Science",
    question: "What is the largest planet in our solar system?",
    correctAnswer: "Jupiter",
    wrongAnswers: ["Saturn", "Neptune", "Uranus"],
    difficulty: "easy"
  },
  {
    category: "Science",
    question: "What is the process by which plants make food?",
    correctAnswer: "Photosynthesis",
    wrongAnswers: ["Respiration", "Transpiration", "Fermentation"],
    difficulty: "easy"
  },
  {
    category: "Science",
    question: "What is the rarest blood type?",
    correctAnswer: "AB negative",
    wrongAnswers: ["O negative", "B negative", "A negative"],
    difficulty: "hard"
  },
  {
    category: "Science",
    question: "What does DNA stand for?",
    correctAnswer: "Deoxyribonucleic Acid",
    wrongAnswers: ["Dioxyribonucleic Acid", "Diribonucleic Acid", "Deoxy Ribose Nucleic Acid"],
    difficulty: "medium"
  },
  {
    category: "Science",
    question: "What is the boiling point of water in Fahrenheit?",
    correctAnswer: "212°F",
    wrongAnswers: ["200°F", "220°F", "100°F"],
    difficulty: "medium"
  },
  {
    category: "Science",
    question: "What is the center of an atom called?",
    correctAnswer: "Nucleus",
    wrongAnswers: ["Core", "Center", "Proton"],
    difficulty: "easy"
  },
  {
    category: "Science",
    question: "What vitamin does the Sun provide?",
    correctAnswer: "Vitamin D",
    wrongAnswers: ["Vitamin C", "Vitamin A", "Vitamin E"],
    difficulty: "easy"
  },
  {
    category: "Science",
    question: "What metal is liquid at room temperature?",
    correctAnswer: "Mercury",
    wrongAnswers: ["Gallium", "Lead", "Tin"],
    difficulty: "medium"
  },
  {
    category: "Science",
    question: "What is the study of fossils called?",
    correctAnswer: "Paleontology",
    wrongAnswers: ["Archaeology", "Geology", "Anthropology"],
    difficulty: "medium"
  },
  {
    category: "Science",
    question: "How many hearts does an octopus have?",
    correctAnswer: "3",
    wrongAnswers: ["1", "2", "4"],
    difficulty: "hard",
    funFact: "Octopuses have three hearts: two pump blood to the gills, one to the rest of the body!"
  },
  {
    category: "Science",
    question: "What is the closest star to Earth?",
    correctAnswer: "The Sun",
    wrongAnswers: ["Alpha Centauri", "Sirius", "Proxima Centauri"],
    difficulty: "easy"
  },

  // Geography (25 questions)
  {
    category: "Geography",
    question: "What is the capital of France?",
    correctAnswer: "Paris",
    wrongAnswers: ["London", "Berlin", "Madrid"],
    difficulty: "easy"
  },
  {
    category: "Geography",
    question: "What is the largest country by area?",
    correctAnswer: "Russia",
    wrongAnswers: ["Canada", "China", "United States"],
    difficulty: "easy"
  },
  {
    category: "Geography",
    question: "What is the longest river in the world?",
    correctAnswer: "Nile",
    wrongAnswers: ["Amazon", "Yangtze", "Mississippi"],
    difficulty: "medium"
  },
  {
    category: "Geography",
    question: "What ocean is on the west coast of the United States?",
    correctAnswer: "Pacific Ocean",
    wrongAnswers: ["Atlantic Ocean", "Indian Ocean", "Arctic Ocean"],
    difficulty: "easy"
  },
  {
    category: "Geography",
    question: "What is the smallest country in the world?",
    correctAnswer: "Vatican City",
    wrongAnswers: ["Monaco", "San Marino", "Liechtenstein"],
    difficulty: "medium"
  },
  {
    category: "Geography",
    question: "What continent is Egypt in?",
    correctAnswer: "Africa",
    wrongAnswers: ["Asia", "Europe", "Middle East"],
    difficulty: "easy"
  },
  {
    category: "Geography",
    question: "What is the tallest mountain in the world?",
    correctAnswer: "Mount Everest",
    wrongAnswers: ["K2", "Kilimanjaro", "Denali"],
    difficulty: "easy"
  },
  {
    category: "Geography",
    question: "What is the capital of Australia?",
    correctAnswer: "Canberra",
    wrongAnswers: ["Sydney", "Melbourne", "Brisbane"],
    difficulty: "medium"
  },
  {
    category: "Geography",
    question: "How many countries are in Africa?",
    correctAnswer: "54",
    wrongAnswers: ["48", "60", "51"],
    difficulty: "hard"
  },
  {
    category: "Geography",
    question: "What desert is the largest in the world?",
    correctAnswer: "Sahara",
    wrongAnswers: ["Gobi", "Arabian", "Kalahari"],
    difficulty: "medium"
  },
  {
    category: "Geography",
    question: "What is the capital of Japan?",
    correctAnswer: "Tokyo",
    wrongAnswers: ["Kyoto", "Osaka", "Hiroshima"],
    difficulty: "easy"
  },
  {
    category: "Geography",
    question: "What U.S. state is the Grand Canyon in?",
    correctAnswer: "Arizona",
    wrongAnswers: ["Utah", "Nevada", "New Mexico"],
    difficulty: "medium"
  },
  {
    category: "Geography",
    question: "What is the largest island in the world?",
    correctAnswer: "Greenland",
    wrongAnswers: ["New Guinea", "Borneo", "Madagascar"],
    difficulty: "medium"
  },
  {
    category: "Geography",
    question: "What strait separates Europe and Africa?",
    correctAnswer: "Strait of Gibraltar",
    wrongAnswers: ["Bosphorus Strait", "English Channel", "Strait of Messina"],
    difficulty: "hard"
  },
  {
    category: "Geography",
    question: "What is the capital of Canada?",
    correctAnswer: "Ottawa",
    wrongAnswers: ["Toronto", "Montreal", "Vancouver"],
    difficulty: "medium"
  },
  {
    category: "Geography",
    question: "What country has the most natural lakes?",
    correctAnswer: "Canada",
    wrongAnswers: ["Russia", "United States", "Finland"],
    difficulty: "hard"
  },
  {
    category: "Geography",
    question: "What is the deepest ocean trench?",
    correctAnswer: "Mariana Trench",
    wrongAnswers: ["Philippine Trench", "Tonga Trench", "Java Trench"],
    difficulty: "medium"
  },
  {
    category: "Geography",
    question: "What country is Angkor Wat in?",
    correctAnswer: "Cambodia",
    wrongAnswers: ["Thailand", "Vietnam", "Myanmar"],
    difficulty: "hard"
  },
  {
    category: "Geography",
    question: "What is the largest city in the world by population?",
    correctAnswer: "Tokyo",
    wrongAnswers: ["Shanghai", "Delhi", "São Paulo"],
    difficulty: "medium"
  },
  {
    category: "Geography",
    question: "What country has the most time zones?",
    correctAnswer: "France",
    wrongAnswers: ["Russia", "United States", "China"],
    difficulty: "hard",
    funFact: "France has 12 time zones due to its overseas territories!"
  },
  {
    category: "Geography",
    question: "What is the capital of Brazil?",
    correctAnswer: "Brasília",
    wrongAnswers: ["Rio de Janeiro", "São Paulo", "Salvador"],
    difficulty: "medium"
  },
  {
    category: "Geography",
    question: "What river runs through the Grand Canyon?",
    correctAnswer: "Colorado River",
    wrongAnswers: ["Mississippi River", "Rio Grande", "Snake River"],
    difficulty: "medium"
  },
  {
    category: "Geography",
    question: "What is the largest lake in Africa?",
    correctAnswer: "Lake Victoria",
    wrongAnswers: ["Lake Tanganyika", "Lake Malawi", "Lake Chad"],
    difficulty: "hard"
  },
  {
    category: "Geography",
    question: "What country is home to the Great Barrier Reef?",
    correctAnswer: "Australia",
    wrongAnswers: ["Indonesia", "Philippines", "Papua New Guinea"],
    difficulty: "easy"
  },
  {
    category: "Geography",
    question: "What is the capital of Spain?",
    correctAnswer: "Madrid",
    wrongAnswers: ["Barcelona", "Seville", "Valencia"],
    difficulty: "easy"
  },

  // Sports (25 questions)
  {
    category: "Sports",
    question: "How many players are on a basketball team on the court?",
    correctAnswer: "5",
    wrongAnswers: ["6", "7", "4"],
    difficulty: "easy"
  },
  {
    category: "Sports",
    question: "What sport is known as 'the beautiful game'?",
    correctAnswer: "Soccer (Football)",
    wrongAnswers: ["Basketball", "Tennis", "Cricket"],
    difficulty: "easy"
  },
  {
    category: "Sports",
    question: "How many Grand Slam tournaments are there in tennis?",
    correctAnswer: "4",
    wrongAnswers: ["3", "5", "6"],
    difficulty: "medium"
  },
  {
    category: "Sports",
    question: "What is the maximum score in 10-pin bowling?",
    correctAnswer: "300",
    wrongAnswers: ["250", "350", "200"],
    difficulty: "medium"
  },
  {
    category: "Sports",
    question: "How long is a marathon?",
    correctAnswer: "26.2 miles",
    wrongAnswers: ["20 miles", "30 miles", "24 miles"],
    difficulty: "medium"
  },
  {
    category: "Sports",
    question: "What sport uses a puck?",
    correctAnswer: "Hockey",
    wrongAnswers: ["Curling", "Lacrosse", "Field Hockey"],
    difficulty: "easy"
  },
  {
    category: "Sports",
    question: "Who has won the most Olympic gold medals?",
    correctAnswer: "Michael Phelps",
    wrongAnswers: ["Usain Bolt", "Carl Lewis", "Simone Biles"],
    difficulty: "medium"
  },
  {
    category: "Sports",
    question: "What is the diameter of a basketball hoop?",
    correctAnswer: "18 inches",
    wrongAnswers: ["16 inches", "20 inches", "22 inches"],
    difficulty: "hard"
  },
  {
    category: "Sports",
    question: "In what year were the first modern Olympics held?",
    correctAnswer: "1896",
    wrongAnswers: ["1900", "1888", "1892"],
    difficulty: "hard"
  },
  {
    category: "Sports",
    question: "How many holes are there on a standard golf course?",
    correctAnswer: "18",
    wrongAnswers: ["16", "20", "24"],
    difficulty: "easy"
  },
  {
    category: "Sports",
    question: "What country won the 2018 FIFA World Cup?",
    correctAnswer: "France",
    wrongAnswers: ["Croatia", "Germany", "Brazil"],
    difficulty: "medium"
  },
  {
    category: "Sports",
    question: "How many points is a touchdown in American football?",
    correctAnswer: "6",
    wrongAnswers: ["7", "5", "8"],
    difficulty: "easy"
  },
  {
    category: "Sports",
    question: "What NBA team has won the most championships?",
    correctAnswer: "Boston Celtics",
    wrongAnswers: ["Los Angeles Lakers", "Chicago Bulls", "Golden State Warriors"],
    difficulty: "medium"
  },
  {
    category: "Sports",
    question: "What is the national sport of Canada?",
    correctAnswer: "Lacrosse",
    wrongAnswers: ["Hockey", "Basketball", "Curling"],
    difficulty: "hard",
    funFact: "Canada has two national sports: lacrosse (summer) and ice hockey (winter)!"
  },
  {
    category: "Sports",
    question: "How many rings are on the Olympic flag?",
    correctAnswer: "5",
    wrongAnswers: ["4", "6", "7"],
    difficulty: "easy"
  },
  {
    category: "Sports",
    question: "What is the only sport to have been played on the moon?",
    correctAnswer: "Golf",
    wrongAnswers: ["Baseball", "Frisbee", "Javelin"],
    difficulty: "hard"
  },
  {
    category: "Sports",
    question: "How many bases are on a baseball field?",
    correctAnswer: "4",
    wrongAnswers: ["3", "5", "2"],
    difficulty: "easy"
  },
  {
    category: "Sports",
    question: "What boxer was known as 'The Greatest'?",
    correctAnswer: "Muhammad Ali",
    wrongAnswers: ["Mike Tyson", "Floyd Mayweather", "Sugar Ray Leonard"],
    difficulty: "easy"
  },
  {
    category: "Sports",
    question: "What is Tiger Woods' real first name?",
    correctAnswer: "Eldrick",
    wrongAnswers: ["Theodore", "Timothy", "Thomas"],
    difficulty: "hard"
  },
  {
    category: "Sports",
    question: "How many players are on a soccer team on the field?",
    correctAnswer: "11",
    wrongAnswers: ["10", "12", "9"],
    difficulty: "easy"
  },
  {
    category: "Sports",
    question: "What is the home stadium of the Dallas Cowboys?",
    correctAnswer: "AT&T Stadium",
    wrongAnswers: ["Cowboys Stadium", "Texas Stadium", "Dallas Arena"],
    difficulty: "medium"
  },
  {
    category: "Sports",
    question: "Who is known as 'His Airness'?",
    correctAnswer: "Michael Jordan",
    wrongAnswers: ["LeBron James", "Kobe Bryant", "Magic Johnson"],
    difficulty: "easy"
  },
  {
    category: "Sports",
    question: "What is the highest possible break in snooker?",
    correctAnswer: "147",
    wrongAnswers: ["155", "160", "140"],
    difficulty: "hard"
  },
  {
    category: "Sports",
    question: "How many minutes is a professional soccer match?",
    correctAnswer: "90 minutes",
    wrongAnswers: ["80 minutes", "100 minutes", "120 minutes"],
    difficulty: "easy"
  },
  {
    category: "Sports",
    question: "What is the name of the championship trophy in hockey?",
    correctAnswer: "Stanley Cup",
    wrongAnswers: ["Commissioner's Trophy", "Lombardi Trophy", "Larry O'Brien Trophy"],
    difficulty: "easy"
  },

  // Food & Drink (20 questions)
  {
    category: "Food & Drink",
    question: "What is the main ingredient in guacamole?",
    correctAnswer: "Avocado",
    wrongAnswers: ["Tomato", "Lime", "Onion"],
    difficulty: "easy"
  },
  {
    category: "Food & Drink",
    question: "What country is sushi from?",
    correctAnswer: "Japan",
    wrongAnswers: ["China", "Korea", "Thailand"],
    difficulty: "easy"
  },
  {
    category: "Food & Drink",
    question: "What is the most expensive spice by weight?",
    correctAnswer: "Saffron",
    wrongAnswers: ["Vanilla", "Cardamom", "Cinnamon"],
    difficulty: "medium"
  },
  {
    category: "Food & Drink",
    question: "What nut is used to make marzipan?",
    correctAnswer: "Almond",
    wrongAnswers: ["Cashew", "Pistachio", "Hazelnut"],
    difficulty: "medium"
  },
  {
    category: "Food & Drink",
    question: "What is the main ingredient in hummus?",
    correctAnswer: "Chickpeas",
    wrongAnswers: ["White Beans", "Lentils", "Peas"],
    difficulty: "easy"
  },
  {
    category: "Food & Drink",
    question: "What type of pasta is shaped like little ears?",
    correctAnswer: "Orecchiette",
    wrongAnswers: ["Farfalle", "Conchiglie", "Rotini"],
    difficulty: "hard"
  },
  {
    category: "Food & Drink",
    question: "What country does Gouda cheese come from?",
    correctAnswer: "Netherlands",
    wrongAnswers: ["Switzerland", "France", "Germany"],
    difficulty: "medium"
  },
  {
    category: "Food & Drink",
    question: "What is the main alcohol in a margarita?",
    correctAnswer: "Tequila",
    wrongAnswers: ["Rum", "Vodka", "Gin"],
    difficulty: "easy"
  },
  {
    category: "Food & Drink",
    question: "What fruit is wine made from?",
    correctAnswer: "Grapes",
    wrongAnswers: ["Berries", "Apples", "Plums"],
    difficulty: "easy"
  },
  {
    category: "Food & Drink",
    question: "What is the hottest part of a chili pepper?",
    correctAnswer: "The seeds and membranes",
    wrongAnswers: ["The skin", "The tip", "The stem"],
    difficulty: "medium"
  },
  {
    category: "Food & Drink",
    question: "What cheese is traditionally used on pizza?",
    correctAnswer: "Mozzarella",
    wrongAnswers: ["Cheddar", "Parmesan", "Provolone"],
    difficulty: "easy"
  },
  {
    category: "Food & Drink",
    question: "What is the most widely eaten fish in the world?",
    correctAnswer: "Herring",
    wrongAnswers: ["Tuna", "Salmon", "Cod"],
    difficulty: "hard"
  },
  {
    category: "Food & Drink",
    question: "What is espresso served with steamed milk called?",
    correctAnswer: "Latte",
    wrongAnswers: ["Cappuccino", "Macchiato", "Americano"],
    difficulty: "easy"
  },
  {
    category: "Food & Drink",
    question: "What fruit has its seeds on the outside?",
    correctAnswer: "Strawberry",
    wrongAnswers: ["Raspberry", "Kiwi", "Fig"],
    difficulty: "medium"
  },
  {
    category: "Food & Drink",
    question: "What is the main ingredient in traditional Japanese miso soup?",
    correctAnswer: "Soybean paste",
    wrongAnswers: ["Fish stock", "Rice", "Seaweed"],
    difficulty: "medium"
  },
  {
    category: "Food & Drink",
    question: "What vegetable is used to make sauerkraut?",
    correctAnswer: "Cabbage",
    wrongAnswers: ["Cucumber", "Radish", "Turnip"],
    difficulty: "easy"
  },
  {
    category: "Food & Drink",
    question: "What is the main ingredient in a traditional Caesar salad dressing?",
    correctAnswer: "Anchovies",
    wrongAnswers: ["Mayonnaise", "Yogurt", "Lemon"],
    difficulty: "medium"
  },
  {
    category: "Food & Drink",
    question: "What country is the origin of the croissant?",
    correctAnswer: "Austria",
    wrongAnswers: ["France", "Italy", "Belgium"],
    difficulty: "hard",
    funFact: "Croissants were actually invented in Austria, not France!"
  },
  {
    category: "Food & Drink",
    question: "What is the name of the Italian dessert made with coffee?",
    correctAnswer: "Tiramisu",
    wrongAnswers: ["Panna Cotta", "Gelato", "Cannoli"],
    difficulty: "easy"
  },
  {
    category: "Food & Drink",
    question: "What grain is used to make sake?",
    correctAnswer: "Rice",
    wrongAnswers: ["Barley", "Wheat", "Corn"],
    difficulty: "medium"
  },

  // Technology (20 questions)
  {
    category: "Technology",
    question: "Who co-founded Apple Inc. with Steve Jobs?",
    correctAnswer: "Steve Wozniak",
    wrongAnswers: ["Bill Gates", "Tim Cook", "Jeff Bezos"],
    difficulty: "medium"
  },
  {
    category: "Technology",
    question: "What does 'HTTP' stand for?",
    correctAnswer: "HyperText Transfer Protocol",
    wrongAnswers: ["HyperText Transmission Process", "High Transfer Text Protocol", "HyperText Transport Protocol"],
    difficulty: "medium"
  },
  {
    category: "Technology",
    question: "What year was the first iPhone released?",
    correctAnswer: "2007",
    wrongAnswers: ["2005", "2008", "2009"],
    difficulty: "medium"
  },
  {
    category: "Technology",
    question: "What does 'AI' stand for?",
    correctAnswer: "Artificial Intelligence",
    wrongAnswers: ["Automated Intelligence", "Advanced Intelligence", "Applied Intelligence"],
    difficulty: "easy"
  },
  {
    category: "Technology",
    question: "Who founded Microsoft?",
    correctAnswer: "Bill Gates and Paul Allen",
    wrongAnswers: ["Steve Jobs and Steve Wozniak", "Jeff Bezos", "Mark Zuckerberg"],
    difficulty: "easy"
  },
  {
    category: "Technology",
    question: "What was the first computer virus called?",
    correctAnswer: "Creeper",
    wrongAnswers: ["Melissa", "ILOVEYOU", "Morris Worm"],
    difficulty: "hard"
  },
  {
    category: "Technology",
    question: "What does 'USB' stand for?",
    correctAnswer: "Universal Serial Bus",
    wrongAnswers: ["Universal System Bus", "United Serial Bus", "Uniform Serial Bus"],
    difficulty: "medium"
  },
  {
    category: "Technology",
    question: "Who founded Facebook?",
    correctAnswer: "Mark Zuckerberg",
    wrongAnswers: ["Jack Dorsey", "Elon Musk", "Larry Page"],
    difficulty: "easy"
  },
  {
    category: "Technology",
    question: "What is the name of Amazon's voice assistant?",
    correctAnswer: "Alexa",
    wrongAnswers: ["Siri", "Cortana", "Google Assistant"],
    difficulty: "easy"
  },
  {
    category: "Technology",
    question: "What does 'VPN' stand for?",
    correctAnswer: "Virtual Private Network",
    wrongAnswers: ["Very Private Network", "Virtual Public Network", "Verified Private Network"],
    difficulty: "medium"
  },
  {
    category: "Technology",
    question: "What is the most popular programming language in 2023?",
    correctAnswer: "JavaScript",
    wrongAnswers: ["Python", "Java", "C++"],
    difficulty: "medium"
  },
  {
    category: "Technology",
    question: "What company developed the Android operating system?",
    correctAnswer: "Google",
    wrongAnswers: ["Apple", "Microsoft", "Samsung"],
    difficulty: "easy"
  },
  {
    category: "Technology",
    question: "What does 'RAM' stand for?",
    correctAnswer: "Random Access Memory",
    wrongAnswers: ["Read Access Memory", "Rapid Access Memory", "Random Allocated Memory"],
    difficulty: "medium"
  },
  {
    category: "Technology",
    question: "What year was Twitter (X) founded?",
    correctAnswer: "2006",
    wrongAnswers: ["2004", "2008", "2010"],
    difficulty: "hard"
  },
  {
    category: "Technology",
    question: "What is the name of Elon Musk's space exploration company?",
    correctAnswer: "SpaceX",
    wrongAnswers: ["Blue Origin", "Virgin Galactic", "Rocket Lab"],
    difficulty: "easy"
  },
  {
    category: "Technology",
    question: "What does 'GPU' stand for?",
    correctAnswer: "Graphics Processing Unit",
    wrongAnswers: ["General Processing Unit", "Graphical Performance Unit", "Gaming Processing Unit"],
    difficulty: "medium"
  },
  {
    category: "Technology",
    question: "What is the maximum character count for a tweet on Twitter/X?",
    correctAnswer: "280",
    wrongAnswers: ["140", "500", "160"],
    difficulty: "medium"
  },
  {
    category: "Technology",
    question: "What company owns Instagram?",
    correctAnswer: "Meta (Facebook)",
    wrongAnswers: ["Google", "Twitter", "Snapchat"],
    difficulty: "easy"
  },
  {
    category: "Technology",
    question: "What does 'SSD' stand for?",
    correctAnswer: "Solid State Drive",
    wrongAnswers: ["Super Speed Drive", "Solid Storage Device", "System State Drive"],
    difficulty: "medium"
  },
  {
    category: "Technology",
    question: "Who is known as the father of computers?",
    correctAnswer: "Charles Babbage",
    wrongAnswers: ["Alan Turing", "John von Neumann", "Bill Gates"],
    difficulty: "hard"
  },

  // Music (20 questions)
  {
    category: "Music",
    question: "Who is known as the 'King of Pop'?",
    correctAnswer: "Michael Jackson",
    wrongAnswers: ["Elvis Presley", "Prince", "Justin Timberlake"],
    difficulty: "easy"
  },
  {
    category: "Music",
    question: "What instrument has 88 keys?",
    correctAnswer: "Piano",
    wrongAnswers: ["Organ", "Harpsichord", "Synthesizer"],
    difficulty: "easy"
  },
  {
    category: "Music",
    question: "Who sang 'Bohemian Rhapsody'?",
    correctAnswer: "Queen",
    wrongAnswers: ["The Beatles", "Led Zeppelin", "Pink Floyd"],
    difficulty: "easy"
  },
  {
    category: "Music",
    question: "What is the best-selling album of all time?",
    correctAnswer: "Thriller by Michael Jackson",
    wrongAnswers: ["Back in Black by AC/DC", "The Dark Side of the Moon by Pink Floyd", "Abbey Road by The Beatles"],
    difficulty: "medium"
  },
  {
    category: "Music",
    question: "How many strings does a standard guitar have?",
    correctAnswer: "6",
    wrongAnswers: ["7", "5", "8"],
    difficulty: "easy"
  },
  {
    category: "Music",
    question: "Who is known as the 'Queen of Pop'?",
    correctAnswer: "Madonna",
    wrongAnswers: ["Beyoncé", "Lady Gaga", "Britney Spears"],
    difficulty: "easy"
  },
  {
    category: "Music",
    question: "What band was Freddie Mercury the lead singer of?",
    correctAnswer: "Queen",
    wrongAnswers: ["The Who", "The Rolling Stones", "Led Zeppelin"],
    difficulty: "easy"
  },
  {
    category: "Music",
    question: "What is the highest male singing voice?",
    correctAnswer: "Tenor",
    wrongAnswers: ["Baritone", "Bass", "Alto"],
    difficulty: "medium"
  },
  {
    category: "Music",
    question: "What year did The Beatles break up?",
    correctAnswer: "1970",
    wrongAnswers: ["1968", "1972", "1975"],
    difficulty: "medium"
  },
  {
    category: "Music",
    question: "Who sang 'Purple Rain'?",
    correctAnswer: "Prince",
    wrongAnswers: ["Michael Jackson", "Stevie Wonder", "James Brown"],
    difficulty: "medium"
  },
  {
    category: "Music",
    question: "What is the name of Elvis Presley's Memphis home?",
    correctAnswer: "Graceland",
    wrongAnswers: ["Neverland", "Heartbreak Hotel", "Paradise"],
    difficulty: "medium"
  },
  {
    category: "Music",
    question: "What is Beyoncé's fanbase called?",
    correctAnswer: "Beyhive",
    wrongAnswers: ["Bey Nation", "Beyoncé Army", "Queens"],
    difficulty: "medium"
  },
  {
    category: "Music",
    question: "What rapper's real name is Marshall Mathers?",
    correctAnswer: "Eminem",
    wrongAnswers: ["Dr. Dre", "50 Cent", "Snoop Dogg"],
    difficulty: "easy"
  },
  {
    category: "Music",
    question: "What country is AC/DC from?",
    correctAnswer: "Australia",
    wrongAnswers: ["United States", "United Kingdom", "Canada"],
    difficulty: "medium"
  },
  {
    category: "Music",
    question: "How many members were in One Direction?",
    correctAnswer: "5",
    wrongAnswers: ["4", "6", "3"],
    difficulty: "easy"
  },
  {
    category: "Music",
    question: "What music festival was held in 1969 in New York?",
    correctAnswer: "Woodstock",
    wrongAnswers: ["Monterey", "Isle of Wight", "Altamont"],
    difficulty: "medium"
  },
  {
    category: "Music",
    question: "Who sang 'Wonderwall'?",
    correctAnswer: "Oasis",
    wrongAnswers: ["Blur", "Radiohead", "The Verve"],
    difficulty: "medium"
  },
  {
    category: "Music",
    question: "What is Taylor Swift's lucky number?",
    correctAnswer: "13",
    wrongAnswers: ["7", "9", "11"],
    difficulty: "hard"
  },
  {
    category: "Music",
    question: "What instrument did Louis Armstrong play?",
    correctAnswer: "Trumpet",
    wrongAnswers: ["Saxophone", "Trombone", "Clarinet"],
    difficulty: "medium"
  },
  {
    category: "Music",
    question: "What band is known for the song 'Stairway to Heaven'?",
    correctAnswer: "Led Zeppelin",
    wrongAnswers: ["The Rolling Stones", "The Who", "Deep Purple"],
    difficulty: "easy"
  },

  // Art & Literature (15 questions)
  {
    category: "Art & Literature",
    question: "Who wrote 'Romeo and Juliet'?",
    correctAnswer: "William Shakespeare",
    wrongAnswers: ["Charles Dickens", "Jane Austen", "Mark Twain"],
    difficulty: "easy"
  },
  {
    category: "Art & Literature",
    question: "Who painted 'Starry Night'?",
    correctAnswer: "Vincent van Gogh",
    wrongAnswers: ["Pablo Picasso", "Claude Monet", "Salvador Dalí"],
    difficulty: "easy"
  },
  {
    category: "Art & Literature",
    question: "What is the first book of the Harry Potter series?",
    correctAnswer: "Harry Potter and the Philosopher's Stone",
    wrongAnswers: ["Harry Potter and the Chamber of Secrets", "Harry Potter and the Prisoner of Azkaban", "Harry Potter and the Goblet of Fire"],
    difficulty: "easy"
  },
  {
    category: "Art & Literature",
    question: "Who wrote '1984'?",
    correctAnswer: "George Orwell",
    wrongAnswers: ["Aldous Huxley", "Ray Bradbury", "Philip K. Dick"],
    difficulty: "medium"
  },
  {
    category: "Art & Literature",
    question: "What is the name of the ceiling painting in the Sistine Chapel?",
    correctAnswer: "The Creation of Adam",
    wrongAnswers: ["The Last Supper", "The Birth of Venus", "The School of Athens"],
    difficulty: "medium"
  },
  {
    category: "Art & Literature",
    question: "Who wrote 'Pride and Prejudice'?",
    correctAnswer: "Jane Austen",
    wrongAnswers: ["Charlotte Brontë", "Emily Brontë", "Mary Shelley"],
    difficulty: "easy"
  },
  {
    category: "Art & Literature",
    question: "What art movement was Salvador Dalí part of?",
    correctAnswer: "Surrealism",
    wrongAnswers: ["Cubism", "Impressionism", "Expressionism"],
    difficulty: "medium"
  },
  {
    category: "Art & Literature",
    question: "Who wrote 'To Kill a Mockingbird'?",
    correctAnswer: "Harper Lee",
    wrongAnswers: ["Mark Twain", "Ernest Hemingway", "F. Scott Fitzgerald"],
    difficulty: "medium"
  },
  {
    category: "Art & Literature",
    question: "What museum is the Mona Lisa displayed in?",
    correctAnswer: "The Louvre",
    wrongAnswers: ["The Met", "The Uffizi", "The Prado"],
    difficulty: "medium"
  },
  {
    category: "Art & Literature",
    question: "Who wrote 'The Great Gatsby'?",
    correctAnswer: "F. Scott Fitzgerald",
    wrongAnswers: ["Ernest Hemingway", "John Steinbeck", "William Faulkner"],
    difficulty: "medium"
  },
  {
    category: "Art & Literature",
    question: "What nationality was Pablo Picasso?",
    correctAnswer: "Spanish",
    wrongAnswers: ["French", "Italian", "Portuguese"],
    difficulty: "medium"
  },
  {
    category: "Art & Literature",
    question: "Who wrote 'The Catcher in the Rye'?",
    correctAnswer: "J.D. Salinger",
    wrongAnswers: ["Jack Kerouac", "Allen Ginsberg", "Kurt Vonnegut"],
    difficulty: "medium"
  },
  {
    category: "Art & Literature",
    question: "What artistic technique uses small dots of color?",
    correctAnswer: "Pointillism",
    wrongAnswers: ["Cubism", "Impressionism", "Fauvism"],
    difficulty: "hard"
  },
  {
    category: "Art & Literature",
    question: "Who painted 'The Scream'?",
    correctAnswer: "Edvard Munch",
    wrongAnswers: ["Vincent van Gogh", "Pablo Picasso", "Salvador Dalí"],
    difficulty: "medium"
  },
  {
    category: "Art & Literature",
    question: "What dystopian novel features 'Big Brother'?",
    correctAnswer: "1984",
    wrongAnswers: ["Brave New World", "Fahrenheit 451", "The Handmaid's Tale"],
    difficulty: "easy"
  },

  // General Knowledge (15 questions)
  {
    category: "General Knowledge",
    question: "How many days are in a leap year?",
    correctAnswer: "366",
    wrongAnswers: ["365", "367", "364"],
    difficulty: "easy"
  },
  {
    category: "General Knowledge",
    question: "What is the largest mammal in the world?",
    correctAnswer: "Blue Whale",
    wrongAnswers: ["Elephant", "Giraffe", "Whale Shark"],
    difficulty: "easy"
  },
  {
    category: "General Knowledge",
    question: "What color is a ruby?",
    correctAnswer: "Red",
    wrongAnswers: ["Blue", "Green", "Purple"],
    difficulty: "easy"
  },
  {
    category: "General Knowledge",
    question: "How many continents are there?",
    correctAnswer: "7",
    wrongAnswers: ["6", "8", "5"],
    difficulty: "easy"
  },
  {
    category: "General Knowledge",
    question: "What is the smallest bone in the human body?",
    correctAnswer: "Stapes (in the ear)",
    wrongAnswers: ["Femur", "Radius", "Patella"],
    difficulty: "hard"
  },
  {
    category: "General Knowledge",
    question: "How many sides does a hexagon have?",
    correctAnswer: "6",
    wrongAnswers: ["5", "7", "8"],
    difficulty: "easy"
  },
  {
    category: "General Knowledge",
    question: "What is the fastest land animal?",
    correctAnswer: "Cheetah",
    wrongAnswers: ["Lion", "Leopard", "Gazelle"],
    difficulty: "easy"
  },
  {
    category: "General Knowledge",
    question: "What is the largest organ inside the human body?",
    correctAnswer: "Liver",
    wrongAnswers: ["Brain", "Heart", "Lungs"],
    difficulty: "medium"
  },
  {
    category: "General Knowledge",
    question: "What is the tallest building in the world?",
    correctAnswer: "Burj Khalifa",
    wrongAnswers: ["Shanghai Tower", "Empire State Building", "One World Trade Center"],
    difficulty: "medium"
  },
  {
    category: "General Knowledge",
    question: "What is the currency of Japan?",
    correctAnswer: "Yen",
    wrongAnswers: ["Yuan", "Won", "Ringgit"],
    difficulty: "easy"
  },
  {
    category: "General Knowledge",
    question: "How many teeth does an adult human have?",
    correctAnswer: "32",
    wrongAnswers: ["28", "30", "36"],
    difficulty: "medium"
  },
  {
    category: "General Knowledge",
    question: "What is the world's most spoken language?",
    correctAnswer: "Mandarin Chinese",
    wrongAnswers: ["English", "Spanish", "Hindi"],
    difficulty: "medium"
  },
  {
    category: "General Knowledge",
    question: "What is the largest desert in the world?",
    correctAnswer: "Antarctic Desert",
    wrongAnswers: ["Sahara", "Arabian", "Gobi"],
    difficulty: "hard",
    funFact: "Antarctica is technically the largest desert—it gets very little precipitation!"
  },
  {
    category: "General Knowledge",
    question: "What is the rarest blood type?",
    correctAnswer: "AB negative",
    wrongAnswers: ["O negative", "B negative", "A negative"],
    difficulty: "hard"
  },
  {
    category: "General Knowledge",
    question: "How many zeros are in one million?",
    correctAnswer: "6",
    wrongAnswers: ["5", "7", "8"],
    difficulty: "easy"
  }
];
