-- Allow authenticated users to insert their own profile (safety net in case trigger fails)
CREATE POLICY "profiles_insert_own" ON profiles
  FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = id);

-- Allow anon to insert profiles (needed if trigger runs before auth context is established)
CREATE POLICY "profiles_insert_anon" ON profiles
  FOR INSERT TO anon, authenticated
  WITH CHECK (true);
