/*
  # Ajouter table de configuration du magasin

  1. Nouvelle table
    - `store_settings`
      - `id` (uuid, primary key)
      - `paypal_client_id` (text) - ID client PayPal Business
      - `paypal_secret` (text) - Secret PayPal (crypté)
      - `paypal_mode` (text) - Mode sandbox ou production
      - `store_name` (text) - Nom du magasin
      - `store_email` (text) - Email du magasin
      - `store_phone` (text) - Téléphone du magasin
      - `updated_at` (timestamptz) - Date de mise à jour
      - `updated_by` (uuid) - Admin qui a fait la mise à jour

  2. Sécurité
    - Enable RLS sur `store_settings`
    - Seuls les admins peuvent lire et modifier les paramètres
*/

CREATE TABLE IF NOT EXISTS store_settings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  paypal_client_id text DEFAULT '',
  paypal_secret text DEFAULT '',
  paypal_mode text DEFAULT 'sandbox',
  store_name text DEFAULT 'Beauty&Home.ma',
  store_email text DEFAULT 'beauty.home.ma.212@gmail.com',
  store_phone text DEFAULT '+212 6456 750 92',
  updated_at timestamptz DEFAULT now(),
  updated_by uuid REFERENCES profiles(id)
);

ALTER TABLE store_settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can view store settings"
  ON store_settings
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

CREATE POLICY "Admins can update store settings"
  ON store_settings
  FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

CREATE POLICY "Admins can insert store settings"
  ON store_settings
  FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

-- Insérer une configuration par défaut si elle n'existe pas
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM store_settings LIMIT 1) THEN
    INSERT INTO store_settings (
      paypal_client_id,
      paypal_secret,
      paypal_mode,
      store_name,
      store_email,
      store_phone
    ) VALUES (
      '',
      '',
      'sandbox',
      'Beauty&Home.ma',
      'beauty.home.ma.212@gmail.com',
      '+212 6456 750 92'
    );
  END IF;
END $$;
