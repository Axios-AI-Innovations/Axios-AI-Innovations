import { NextResponse } from 'next/server';
import Stripe from 'stripe';

const stripeSecretKey = process.env.STRIPE_SECRET_KEY;

if (!stripeSecretKey) {
  console.warn('STRIPE_SECRET_KEY is not configured. Checkout route will fail.');
}

const stripe = stripeSecretKey
  ? new Stripe(stripeSecretKey, { apiVersion: '2025-10-29.clover' })
  : null;

const getBaseUrl = () => {
  if (process.env.NEXT_PUBLIC_SITE_URL) {
    return process.env.NEXT_PUBLIC_SITE_URL;
  }

  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`;
  }

  return 'http://localhost:3000';
};

export async function POST(request: Request) {
  if (!stripe) {
    return NextResponse.json(
      { error: 'Stripe is not configured' },
      { status: 500 }
    );
  }

  try {
    const { name, email, projectDetails, budget } = await request.json();

    if (!email || !budget) {
      return NextResponse.json(
        { error: 'Email and budget are required' },
        { status: 400 }
      );
    }

    const unitAmount = Math.max(Math.floor(Number(budget) * 100), 99900);

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'subscription',
      customer_email: email,
      metadata: {
        projectDetails: projectDetails || 'Custom project inquiry',
        name: name || 'Unknown',
      },
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: 'Custom Project Subscription',
              description:
                'Monthly subscription for custom project development',
            },
            unit_amount: unitAmount,
            recurring: {
              interval: 'month',
            },
          },
          quantity: 1,
        },
      ],
      success_url: `${getBaseUrl()}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${getBaseUrl()}/custom-project`,
    });

    return NextResponse.json({ sessionId: session.id });
  } catch (error) {
    console.error('Stripe checkout error:', error);
    return NextResponse.json(
      { error: 'Failed to create checkout session' },
      { status: 500 }
    );
  }
}

