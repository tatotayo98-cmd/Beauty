-- 1. D'abord, vérifions tous les utilisateurs dans auth.users
SELECT id, email, created_at, email_confirmed_at
FROM auth.users
ORDER BY created_at DESC;

-- 2. Vérifions tous les profils existants
SELECT id, email, role, created_at
FROM profiles
ORDER BY created_at DESC;

-- 3. Trouvons les utilisateurs sans profil
SELECT u.id, u.email, 'Pas de profil' as status
FROM auth.users u
LEFT JOIN profiles p ON u.id = p.id
WHERE p.id IS NULL;

-- 4. Créons les profils manquants pour TOUS les utilisateurs
INSERT INTO profiles (id, email, full_name, role)
SELECT
  u.id,
  u.email,
  COALESCE(u.raw_user_meta_data->>'full_name', 'Utilisateur'),
  'customer'
FROM auth.users u
LEFT JOIN profiles p ON u.id = p.id
WHERE p.id IS NULL
ON CONFLICT (id) DO NOTHING;

-- 5. Si tatotayo98@gmail.com existe, le mettre en admin
UPDATE profiles
SET role = 'admin'
WHERE email = 'tatotayo98@gmail.com';

-- 6. Afficher le résultat final
SELECT id, email, role, full_name, created_at
FROM profiles
ORDER BY created_at DESC;
