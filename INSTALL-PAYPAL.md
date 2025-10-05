# Installation des paramètres PayPal

## Étape 1 : Créer la table store_settings

1. Connectez-vous à votre **Supabase Dashboard** : https://supabase.com/dashboard
2. Sélectionnez votre projet
3. Dans le menu latéral, allez dans **SQL Editor**
4. Cliquez sur **New Query**
5. Copiez et collez le SQL ci-dessous :

```sql
-- Créer la table store_settings
CREATE TABLE IF NOT EXISTS store_settings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  paypal_client_id text DEFAULT '',
  paypal_secret text DEFAULT '',
  paypal_mode text DEFAULT 'production',
  store_name text DEFAULT 'Beauty&Home.ma',
  store_email text DEFAULT 'beauty.home.ma.212@gmail.com',
  store_phone text DEFAULT '+212 6456 750 92',
  updated_at timestamptz DEFAULT now(),
  updated_by uuid REFERENCES profiles(id)
);

-- Activer RLS
ALTER TABLE store_settings ENABLE ROW LEVEL SECURITY;

-- Politique pour que les admins puissent voir les paramètres
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

-- Politique pour que les admins puissent modifier les paramètres
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

-- Politique pour que les admins puissent insérer des paramètres
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
```

6. Cliquez sur **RUN** pour exécuter

## Étape 2 : Insérer vos identifiants PayPal

Dans le même **SQL Editor**, exécutez cette requête :

```sql
-- Insérer la configuration PayPal
INSERT INTO store_settings (
  paypal_client_id,
  paypal_secret,
  paypal_mode,
  store_name,
  store_email,
  store_phone
) VALUES (
  'AZm4z6JoKQ0wU4lO90l9kmjnmuBBzGJKyLBCtPsp_nnH0Rhl-_41nJfbnYF9Ax2nAPZzPS_XoowU1T7Y',
  'EBLU4ivvfxCh4PUod4Nn38tyhDBM4dcBTqLAYnmpTlts8mTarc6Bi5ANGRYFflIDa6jeb6frmc4a6N9t',
  'production',
  'Beauty&Home.ma',
  'beauty.home.ma.212@gmail.com',
  '+212 6456 750 92'
);
```

## Étape 3 : Vérifier l'installation

Exécutez cette requête pour vérifier :

```sql
SELECT * FROM store_settings;
```

Vous devriez voir votre configuration avec vos identifiants PayPal.

## ✅ Terminé !

Votre configuration PayPal est maintenant installée et fonctionnelle.

Vous pouvez :
- ✅ Accepter des paiements via PayPal
- ✅ Modifier les paramètres depuis l'interface admin (Paramètres)
- ✅ Les clients peuvent payer par carte bancaire via PayPal
- ✅ Les clients de Casablanca peuvent payer à la livraison

## 🔒 Sécurité

Vos identifiants PayPal sont stockés de manière sécurisée avec :
- Row Level Security (RLS) activé
- Accès réservé aux administrateurs uniquement
- Connexion SSL/TLS avec Supabase
