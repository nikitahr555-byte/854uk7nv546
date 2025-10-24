
import { Request, Response } from 'express';
import { db } from '../server/db';
import { users } from '../shared/schema';
import bcrypt from 'bcryptjs';
import { eq } from 'drizzle-orm';

export default async function handler(req: Request, res: Response) {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Credentials', 'true');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const path = req.url?.replace('/api', '') || '/';

  try {
    // Health check
    if (path === '/health') {
      return res.json({ status: 'ok', timestamp: new Date().toISOString() });
    }

    // Registration endpoint
    if (path === '/register' && req.method === 'POST') {
      const { username, password } = req.body;

      if (!username || !password) {
        return res.status(400).json({ error: 'Username and password are required' });
      }

      // Check if user exists
      const existingUser = await db.select().from(users).where(eq(users.username, username)).limit(1);
      
      if (existingUser.length > 0) {
        return res.status(400).json({ error: 'Username already exists' });
      }

      // Hash password
      const hashedPassword = await bcrypt.hash(password, 10);

      // Create user
      const newUser = await db.insert(users).values({
        username,
        password: hashedPassword,
        is_regulator: false,
        regulator_balance: '0',
        nft_generation_count: 0,
        usd_balance: '10000.00',
        eur_balance: '0.00',
        rub_balance: '0.00',
        btc_balance: '0.00000000',
        eth_balance: '0.00000000',
        usdt_balance: '0.00',
        ltc_balance: '0.00000000',
        doge_balance: '0.00000000',
        xrp_balance: '0.00000000',
        bnb_balance: '0.00000000',
        ada_balance: '0.00000000',
        sol_balance: '0.00000000',
        trx_balance: '0.00000000',
      }).returning();

      return res.json(newUser[0]);
    }

    // Login endpoint
    if (path === '/login' && req.method === 'POST') {
      const { username, password } = req.body;

      if (!username || !password) {
        return res.status(400).json({ error: 'Username and password are required' });
      }

      const user = await db.select().from(users).where(eq(users.username, username)).limit(1);

      if (user.length === 0) {
        return res.status(401).json({ error: 'Invalid credentials' });
      }

      const validPassword = await bcrypt.compare(password, user[0].password);

      if (!validPassword) {
        return res.status(401).json({ error: 'Invalid credentials' });
      }

      return res.json(user[0]);
    }

    // User info endpoint
    if (path === '/user' && req.method === 'GET') {
      return res.status(401).json({ error: 'Not authenticated' });
    }

    return res.status(404).json({ error: 'Endpoint not found' });

  } catch (error: any) {
    console.error('API Error:', error);
    return res.status(500).json({ 
      error: 'Internal server error',
      message: error.message 
    });
  }
}
