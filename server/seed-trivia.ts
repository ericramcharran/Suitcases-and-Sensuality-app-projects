// Seed script to populate trivia categories and questions
import { db } from "./db";
import { sparkitTriviaCategories, sparkitTriviaQuestions } from "@shared/schema";
import { triviaCategories, triviaQuestions } from "./data/triviaQuestions";
import { eq } from "drizzle-orm";

async function seedTrivia() {
  console.log("🌱 Seeding trivia data...");

  try {
    // Clear existing data
    console.log("Clearing existing trivia data...");
    await db.delete(sparkitTriviaQuestions);
    await db.delete(sparkitTriviaCategories);

    // Insert categories
    console.log("Inserting trivia categories...");
    const categoryMap = new Map<string, string>();
    
    for (const category of triviaCategories) {
      const [inserted] = await db.insert(sparkitTriviaCategories).values({
        name: category.name,
        description: category.description,
        icon: category.icon
      }).returning();
      
      categoryMap.set(category.name, inserted.id);
      console.log(`✓ Added category: ${category.name}`);
    }

    // Insert questions
    console.log("\nInserting trivia questions...");
    let questionCount = 0;
    
    for (const question of triviaQuestions) {
      const categoryId = categoryMap.get(question.category);
      if (!categoryId) {
        console.error(`❌ Category not found: ${question.category}`);
        continue;
      }

      await db.insert(sparkitTriviaQuestions).values({
        categoryId,
        question: question.question,
        correctAnswer: question.correctAnswer,
        wrongAnswer1: question.wrongAnswers[0],
        wrongAnswer2: question.wrongAnswers[1],
        wrongAnswer3: question.wrongAnswers[2],
        difficulty: question.difficulty,
        funFact: question.funFact || null
      });
      
      questionCount++;
    }

    console.log(`\n✅ Successfully seeded ${triviaCategories.length} categories and ${questionCount} questions!`);
    
    // Print summary
    console.log("\n📊 Summary:");
    for (const category of triviaCategories) {
      const count = triviaQuestions.filter(q => q.category === category.name).length;
      console.log(`  ${category.name}: ${count} questions`);
    }

  } catch (error) {
    console.error("❌ Error seeding trivia data:", error);
    throw error;
  }
}

// Run the seed function
seedTrivia()
  .then(() => {
    console.log("\n✅ Trivia seeding complete!");
    process.exit(0);
  })
  .catch((error) => {
    console.error("❌ Seed failed:", error);
    process.exit(1);
  });
