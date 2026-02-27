import { neon } from "@neondatabase/serverless";
import "dotenv/config";

// Validate DATABASE_URL
if (!process.env.DATABASE_URL) {
  console.error("ERROR: DATABASE_URL environment variable is not set!");
  console.error("Please set DATABASE_URL in your Render environment variables");
  process.exit(1);
}

export const sql = neon(process.env.DATABASE_URL);

export async function initDB() {
  try {
    console.log("Initializing database...");
    await sql`CREATE TABLE IF NOT EXISTS transactions(
    id SERIAL PRIMARY KEY,
    user_id VARCHAR(255) NOT NULL,
    title VARCHAR(255) NOT NULL,
    amount DECIMAL(10,2) NOT NULL,
    catagory VARCHAR(255) NOT NULL,
    create_at DATE NOT NULL DEFAULT CURRENT_DATE
     )`;
    console.log("Database initialized successfully");
    
    // Test the connection
    const test = await sql`SELECT 1 as test`;
    console.log("Database connection test successful:", test);
    
  } catch (error) {
    console.error("Error initializing DB:", error);
    console.error("Database connection failed. Please check your DATABASE_URL");
    process.exit(1);
  }
}
