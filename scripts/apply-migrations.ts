import fs from 'fs';
import path from 'path';
import process from 'process';
import { neon } from '@neondatabase/serverless';

const migrationsDir = path.resolve(process.cwd(), 'db', 'migrations');

async function applyMigrations() {
  const connectionString = process.env.DATABASE_URL;

  if (!connectionString) {
    console.error('DATABASE_URL is not set. Unable to run migrations.');
    process.exit(1);
  }

  if (!fs.existsSync(migrationsDir)) {
    console.error(`Migrations directory not found at ${migrationsDir}`);
    process.exit(1);
  }

  const migrationFiles = fs
    .readdirSync(migrationsDir)
    .filter((file) => file.endsWith('.sql'))
    .sort();

  if (migrationFiles.length === 0) {
    console.log('No SQL migrations found.');
    return;
  }

  const sql = neon(connectionString);

  for (const file of migrationFiles) {
    const filePath = path.join(migrationsDir, file);
    const statements = fs.readFileSync(filePath, 'utf8');

    if (!statements.trim()) {
      console.log(`Skipping empty migration ${file}`);
      continue;
    }

    console.log(`Applying migration: ${file}`);
    await sql.unsafe(statements);
  }

  console.log('All migrations applied successfully.');
}

applyMigrations().catch((error) => {
  console.error('Migration failed:', error);
  process.exit(1);
});

