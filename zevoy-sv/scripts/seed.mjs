import pkg from "pg";
const { Pool } = pkg;
import bcrypt from "bcrypt";
import dotenv from "dotenv";
dotenv.config();

async function seedUsers(client) {
  await client.query(`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`);
  console.log('Creating "users" table...');
  await client.query(`
    CREATE TABLE IF NOT EXISTS users (
      id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
      email TEXT NOT NULL UNIQUE,
      password TEXT NOT NULL
    );
  `);

  const usersCount = await client.query(`SELECT * FROM users LIMIT 1`);

  if (usersCount.rows.length > 0) {
    console.log("Users table already seeded");
    return;
  }

  const users = [
    {
      email: "admin1@example.com",
      password: bcrypt.hashSync("123456", 10),
    },
    {
      email: "admin2@example.com",
      password: bcrypt.hashSync("123456", 10),
    },
  ];

  console.log("Seeding users...");
  for (const user of users) {
    await client.query(`INSERT INTO users (email, password) VALUES ($1, $2)`, [
      user.email,
      user.password,
    ]);
  }
}

async function seedBudgets(client) {
  const budgetsTables = `
CREATE TABLE IF NOT EXISTS budgets (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL,
    description VARCHAR(255),
    month DATE,
    start DECIMAL(10, 2) DEFAULT 0.00,
    currency SMALLINT NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id)
);
  `;

  const budgetsItemsTable = `
  
  CREATE TABLE budgetEntries (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  budget_id UUID NOT NULL,
  description VARCHAR(255),
  amount DECIMAL(10, 2) NOT NULL,
  type SMALLINT NOT NULL,
  group_type SMALLINT NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (budget_id) REFERENCES Budgets(id)
);
  
  `;
  console.log('Creating "budgets" table...');
  await client.query(budgetsTables);
  console.log('Creating "budgetsItems" table...');
  await client.query(budgetsItemsTable);
}

async function main() {
  console.log(`Connecting to the database at ${process.env.POSTGRES_HOST}...`);
  console.log({
    connectionTimeoutMillis: 5000,
    host: process.env.POSTGRES_HOST,
    user: process.env.POSTGRES_USER,
    password: process.env.POSTGRES_PASSWORD || "",
    database: process.env.POSTGRES_DATABASE,
    port: Number(process.env.POSTGRES_PORT || 5432),
    idleTimeoutMillis: 5000,
  });
  const pool = new Pool({
    connectionTimeoutMillis: 5000,
    host: process.env.POSTGRES_HOST,
    user: process.env.POSTGRES_USER,
    password: process.env.POSTGRES_PASSWORD || "",
    database: process.env.POSTGRES_DATABASE,
    port: Number(process.env.POSTGRES_PORT || 5432),
    idleTimeoutMillis: 5000,
  });
  const client = await pool.connect();
  console.log("Seeding the database...");
  await seedUsers(client);
  await seedBudgets(client);

  client.release();

  console.log("Database seeding complete");
}

main().catch((err) => {
  console.error(
    "An error occurred while attempting to seed the database:",
    err
  );
});
