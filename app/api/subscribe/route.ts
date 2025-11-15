import { NextResponse } from 'next/server';
import { neon } from '@neondatabase/serverless';

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  console.warn('DATABASE_URL is not configured. Subscribe route will fail.');
}

const sql = connectionString ? neon(connectionString) : null;

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(request: Request) {
  if (!sql) {
    return NextResponse.json(
      { error: 'Database not configured', success: false },
      { status: 500 }
    );
  }

  try {
    const { email, source } = await request.json();

    if (!email || !emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Valid email required', success: false },
        { status: 400 }
      );
    }

    const trackingSource = source || 'unknown';

    const result = await sql`
      INSERT INTO early_access (email, source)
      VALUES (${email}, ${trackingSource})
      ON CONFLICT (email) DO UPDATE
        SET source = EXCLUDED.source,
            updated_at = NOW()
      RETURNING id, email, source, created_at;
    `;

    return NextResponse.json(
      {
        success: true,
        message: 'Successfully subscribed to early access',
        data: result[0],
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Subscription error:', error);
    return NextResponse.json(
      { error: 'Failed to subscribe', success: false },
      { status: 500 }
    );
  }
}

