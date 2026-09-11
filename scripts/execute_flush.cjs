const { Client } = require('pg');
const fs = require('fs');

const envContent = fs.readFileSync('.env.local', 'utf8');
const dbUrl = envContent.match(/DATABASE_URL=(.+)/)[1].trim();
const sql = fs.readFileSync('supabase_flush_and_seed.sql', 'utf8');

async function runFlush() {
  console.log('Connecting to PostgreSQL to run 1-Click Flush & Seed...');
  const client = new Client({
    connectionString: dbUrl,
    ssl: { rejectUnauthorized: false }
  });
  await client.connect();
  console.log('Connected! Executing supabase_flush_and_seed.sql...');
  
  await client.query(sql);
  
  console.log('✅ FLUSH AND SEED COMPLETED SUCCESSFULLY!');
  
  // Verify rows
  const profiles = await client.query('SELECT count(*) FROM public.profiles;');
  const listings = await client.query('SELECT count(*) FROM public.produce_listings;');
  const orders = await client.query('SELECT count(*) FROM public.orders;');
  const authUsers = await client.query('SELECT count(*) FROM auth.users;');
  
  console.log('--- Verification Counts ---');
  console.log('Profiles:', profiles.rows[0].count);
  console.log('Produce Listings:', listings.rows[0].count);
  console.log('Orders:', orders.rows[0].count);
  console.log('Auth Users (with confirmed emails):', authUsers.rows[0].count);
  
  await client.end();
}

runFlush().catch(err => {
  console.error('Flush Error:', err);
  process.exit(1);
});
