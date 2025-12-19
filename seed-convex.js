import { ConvexHttpClient } from "convex/browser";

// Prefer environment variable if available
const convexUrl = process.env.VITE_CONVEX_URL || "https://next-octopus-627.convex.cloud";

if (!convexUrl) {
  console.error("❌ Missing Convex URL. Please set VITE_CONVEX_URL or update script.");
  process.exit(1);
}

const client = new ConvexHttpClient(convexUrl);

async function main() {
  try {
    const result = await client.mutation("seed:seedData", {});
    console.log("✓ Seed result:", result);
    process.exit(0);
  } catch (err) {
    console.error("✗ Seed error:", err.message);
    process.exit(1);
  }
}

main();
