// Seed script to populate trivia categories and questions
import { db } from "./db";
import { sparkitTriviaCategories, sparkitTriviaQuestions } from "@shared/schema";
import { triviaCategories, triviaQuestions } from "./data/triviaQuestions";
import { eq } from "drizzle-orm";

async function seedTrivia() {
  console.log("🌱 Seeding trivia data...");

  try {
    // Check if trivia data already exists
    const existingCategories = await db.select().from(sparkitTriviaCategories).limit(1);
    
    if (existingCategories.length > 0) {
      console.log("✓ Trivia data already seeded, skipping...");
      return;
    }
    
    console.log("Seeding trivia categories and questions...");

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

// Export the seed function so it can be called from server startup
export { seedTrivia };
