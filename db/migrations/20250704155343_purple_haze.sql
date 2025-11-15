/*
  # Newsletter Subscribers Database

  1. New Tables
    - `newsletter_subscribers`
      - `id` (uuid, primary key)
      - `email` (text, unique)
      - `subscribed_at` (timestamp)
      - `is_active` (boolean, default true)
      - `source` (text, tracks where they signed up)

  2. Security
    - Enable RLS on `newsletter_subscribers` table
    - Add policy for public insert (newsletter signup)
    - Add policy for authenticated admin access
*/

CREATE TABLE IF NOT EXISTS newsletter_subscribers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text UNIQUE NOT NULL,
  subscribed_at timestamptz DEFAULT now(),
  is_active boolean DEFAULT true,
  source text DEFAULT 'website'
);

ALTER TABLE newsletter_subscribers ENABLE ROW LEVEL SECURITY;

-- Allow anyone to subscribe (insert only)
CREATE POLICY "Anyone can subscribe to newsletter"
  ON newsletter_subscribers
  FOR INSERT
  TO anon
  WITH CHECK (true);

-- Allow authenticated users to view all subscribers (for admin)
CREATE POLICY "Authenticated users can view subscribers"
  ON newsletter_subscribers
  FOR SELECT
  TO authenticated
  USING (true);

-- Allow authenticated users to update subscriber status
CREATE POLICY "Authenticated users can update subscribers"
  ON newsletter_subscribers
  FOR UPDATE
  TO authenticated
  USING (true);