-- Fix Registration Policy
-- Execute this in your Supabase SQL Editor: https://supabase.com/dashboard/project/yhjmhzvuwdmmchbjlrrj/sql

-- Allow users to insert their own profile during registration
CREATE POLICY IF NOT EXISTS "Users can insert own profile"
  ON profiles FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);
