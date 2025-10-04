-- Script pour créer un utilisateur admin par défaut
-- À exécuter dans l'éditeur SQL de Supabase

-- 1. Vérifier la structure des tables
SELECT
  table_name,
  column_name,
  data_type
FROM information_schema.columns
WHERE table_name = 'profiles'
ORDER BY ordinal_position;

-- 2. Vérifier si l'utilisateur tatotayo98@gmail.com existe
SELECT id, email, role, created_at
FROM profiles
WHERE email = 'tatotayo98@gmail.com';

-- 3. Mettre à jour tatotayo98@gmail.com en admin (si existe)
UPDATE profiles
SET role = 'admin'
WHERE email = 'tatotayo98@gmail.com';

-- 4. Vérifier tous les utilisateurs dans auth.users
SELECT id, email, created_at
FROM auth.users
ORDER BY created_at DESC;

-- 5. Pour chaque utilisateur auth.users, vérifier s'il a un profil
SELECT
  u.id,
  u.email,
  p.role,
  CASE
    WHEN p.id IS NULL THEN 'Pas de profil'
    ELSE 'Profil existe'
  END as status
FROM auth.users u
LEFT JOIN profiles p ON u.id = p.id
ORDER BY u.created_at DESC;

-- 6. Créer les profils manquants pour les utilisateurs auth.users
INSERT INTO profiles (id, email, full_name, role)
SELECT
  u.id,
  u.email,
  'Utilisateur',
  'customer'
FROM auth.users u
LEFT JOIN profiles p ON u.id = p.id
WHERE p.id IS NULL
ON CONFLICT (id) DO NOTHING;

-- 7. Afficher le résultat final
SELECT id, email, role, created_at
FROM profiles
ORDER BY created_at DESC;
