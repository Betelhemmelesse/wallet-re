import { neon } from "@neondatabase/serverless";
import "dotenv/config";

// Validate DATABASE_URL but don't exit if missing
if (!process.env.DATABASE_URL) {
  console.error("WARNING: DATABASE_URL environment variable is not set!");
  console.error("Database features will not work until DATABASE_URL is configured");
  // Don't exit - allow server to start for testing
}

export const sql = process.env.DATABASE_URL ? neon(process.env.DATABASE_URL) : null;

export async function initDB() {
  if (!process.env.DATABASE_URL) {
    console.log("Skipping database initialization - DATABASE_URL not set");
    return;
  }
  
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
    // Don't exit - allow server to continue
  }
}
