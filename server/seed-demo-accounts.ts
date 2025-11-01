import { db } from "./db";
import { sparkitCouples } from "@shared/schema";
import { eq, or } from "drizzle-orm";
import bcrypt from "bcrypt";

const DEMO_ACCOUNTS = [
  // Premium accounts (999 sparks)
  {
    coupleCode: "DEVST1",
    partner1Name: "Devin",
    partner2Name: "Stephanie",
    partner1Email: "devin@demo.com",
    partner2Email: "stephanie@demo.com",
    subscriptionPlan: "monthly",
    sparksRemaining: 999,
  },
  {
    coupleCode: "PREMM1",
    partner1Name: "Sam",
    partner2Name: "Riley",
    partner1Email: "sam@demo.com",
    partner2Email: "riley@demo.com",
    subscriptionPlan: "monthly",
    sparksRemaining: 999,
  },
  {
    coupleCode: "PREM02",
    partner1Name: "Cliff",
    partner2Name: "Christi",
    partner1Email: "cliff@demo.com",
    partner2Email: "christi@demo.com",
    subscriptionPlan: "monthly",
    sparksRemaining: 999,
  },
  {
    coupleCode: "PREM03",
    partner1Name: "Keith",
    partner2Name: "Dawn",
    partner1Email: "keith@demo.com",
    partner2Email: "dawn@demo.com",
    subscriptionPlan: "yearly",
    sparksRemaining: 999,
  },
  {
    coupleCode: "DREW01",
    partner1Name: "Drew",
    partner2Name: "Blake",
    partner1Email: "drew@demo.com",
    partner2Email: "blake@demo.com",
    subscriptionPlan: "monthly",
    sparksRemaining: 999,
  },
  // Trial accounts (10-20 sparks)
  {
    coupleCode: "DEMO01",
    partner1Name: "Alex",
    partner2Name: "Jordan",
    partner1Email: "alex@demo.com",
    partner2Email: "jordan@demo.com",
    subscriptionPlan: "trial",
    sparksRemaining: 20,
  },
  {
    coupleCode: "DEMO02",
    partner1Name: "Taylor",
    partner2Name: "Morgan",
    partner1Email: "taylor@demo.com",
    partner2Email: "morgan@demo.com",
    subscriptionPlan: "trial",
    sparksRemaining: 20,
  },
  {
    coupleCode: "DEMO03",
    partner1Name: "Casey",
    partner2Name: "Jamie",
    partner1Email: "casey@demo.com",
    partner2Email: "jamie@demo.com",
    subscriptionPlan: "trial",
    sparksRemaining: 20,
  },
  {
    coupleCode: "DEMO04",
    partner1Name: "Quinn",
    partner2Name: "Sage",
    partner1Email: "quinn@demo.com",
    partner2Email: "sage@demo.com",
    subscriptionPlan: "trial",
    sparksRemaining: 20,
  },
];

export async function seedDemoAccounts() {
  console.log("🌱 Seeding demo accounts...");
  
  const hashedPassword = await bcrypt.hash("demo123", 10);
  
  for (const account of DEMO_ACCOUNTS) {
    try {
      // Check if account exists by email
      const existing = await db
        .select()
        .from(sparkitCouples)
        .where(
          or(
            eq(sparkitCouples.partner1Email, account.partner1Email),
            eq(sparkitCouples.partner2Email, account.partner2Email)
          )
        )
        .limit(1);

      if (existing.length > 0) {
        // Update existing account with correct couple code and sparks
        await db
          .update(sparkitCouples)
          .set({
            coupleCode: account.coupleCode,
            partner1Name: account.partner1Name,
            partner2Name: account.partner2Name,
            partner1Password: hashedPassword,
            partner2Password: hashedPassword,
            subscriptionPlan: account.subscriptionPlan as any,
            sparksRemaining: account.sparksRemaining,
            subscriptionStatus: "active",
            relationshipType: "monogamous",
            partner2JoinedAt: new Date(),
          })
          .where(eq(sparkitCouples.id, existing[0].id));
        
        console.log(`  ✅ Updated ${account.coupleCode} (${account.partner1Email})`);
      } else {
        // Create new account
        await db.insert(sparkitCouples).values({
          coupleCode: account.coupleCode,
          partner1Name: account.partner1Name,
          partner2Name: account.partner2Name,
          partner1Email: account.partner1Email,
          partner2Email: account.partner2Email,
          partner1Password: hashedPassword,
          partner2Password: hashedPassword,
          subscriptionPlan: account.subscriptionPlan as any,
          subscriptionStatus: "active",
          sparksRemaining: account.sparksRemaining,
          lastSparkReset: new Date(),
          partner2JoinedAt: new Date(),
          relationshipType: "monogamous",
        });
        
        console.log(`  ✅ Created ${account.coupleCode} (${account.partner1Email})`);
      }
    } catch (error) {
      console.error(`  ❌ Failed to seed ${account.coupleCode}:`, error);
    }
  }
  
  console.log("✅ Demo account seeding complete");
}
