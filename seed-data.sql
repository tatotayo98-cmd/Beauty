-- Beauty&Home.ma - Sample Data
-- Execute this after database-setup.sql

-- Insert Categories
INSERT INTO categories (name, slug, description, display_order) VALUES
('Beauté & Maquillage', 'beaute', 'Tous vos accessoires de beauté et maquillage', 1),
('Maison & Salle de bain', 'maison', 'Équipements et accessoires pour la maison', 2),
('Bien-être & Ambiance', 'bien-etre', 'Diffuseurs, humidificateurs et lampes d''ambiance', 3);

-- Insert Sample Products
INSERT INTO products (title, slug, description, category_id, base_price, compare_price, images, is_active, is_featured, sku) VALUES
(
  'Éponge de maquillage professionnelle',
  'eponge-maquillage-pro',
  'Éponge douce et lisse pour une application parfaite du fond de teint',
  (SELECT id FROM categories WHERE slug = 'beaute' LIMIT 1),
  49.00,
  79.00,
  '["https://images.pexels.com/photos/3762879/pexels-photo-3762879.jpeg"]'::jsonb,
  true,
  true,
  'BEAUTY001'
),
(
  'Set de pinceaux maquillage (12 pièces)',
  'set-pinceaux-12',
  'Ensemble complet de pinceaux professionnels pour tous types de maquillage',
  (SELECT id FROM categories WHERE slug = 'beaute' LIMIT 1),
  199.00,
  299.00,
  '["https://images.pexels.com/photos/3373736/pexels-photo-3373736.jpeg"]'::jsonb,
  true,
  true,
  'BEAUTY002'
),
(
  'Organisateur de maquillage rotatif',
  'organisateur-maquillage',
  'Organisateur 360° avec plusieurs compartiments pour ranger vos cosmétiques',
  (SELECT id FROM categories WHERE slug = 'beaute' LIMIT 1),
  149.00,
  199.00,
  '["https://images.pexels.com/photos/3373731/pexels-photo-3373731.jpeg"]'::jsonb,
  true,
  false,
  'BEAUTY003'
),
(
  'Filtre de douche purifiant',
  'filtre-douche',
  'Filtre pour pomme de douche qui élimine le chlore et les impuretés',
  (SELECT id FROM categories WHERE slug = 'maison' LIMIT 1),
  129.00,
  179.00,
  '["https://images.pexels.com/photos/6585759/pexels-photo-6585759.jpeg"]'::jsonb,
  true,
  true,
  'HOME001'
),
(
  'Organisateur de salle de bain mural',
  'organisateur-sdb',
  'Étagère adhésive sans perçage pour optimiser l''espace',
  (SELECT id FROM categories WHERE slug = 'maison' LIMIT 1),
  89.00,
  129.00,
  '["https://images.pexels.com/photos/4041392/pexels-photo-4041392.jpeg"]'::jsonb,
  true,
  false,
  'HOME002'
),
(
  'Diffuseur d''huiles essentielles',
  'diffuseur-huiles',
  'Diffuseur ultrasonique avec LED multicolores pour aromathérapie',
  (SELECT id FROM categories WHERE slug = 'bien-etre' LIMIT 1),
  179.00,
  249.00,
  '["https://images.pexels.com/photos/4207892/pexels-photo-4207892.jpeg"]'::jsonb,
  true,
  true,
  'WELL001'
),
(
  'Humidificateur d''air LED',
  'humidificateur-led',
  'Humidificateur silencieux avec lumière d''ambiance pour chambre',
  (SELECT id FROM categories WHERE slug = 'bien-etre' LIMIT 1),
  249.00,
  349.00,
  '["https://images.pexels.com/photos/4210373/pexels-photo-4210373.jpeg"]'::jsonb,
  true,
  true,
  'WELL002'
),
(
  'Lampe sel de l''Himalaya',
  'lampe-sel-himalaya',
  'Lampe décorative en cristal de sel naturel pour ambiance relaxante',
  (SELECT id FROM categories WHERE slug = 'bien-etre' LIMIT 1),
  159.00,
  219.00,
  '["https://images.pexels.com/photos/1183266/pexels-photo-1183266.jpeg"]'::jsonb,
  true,
  false,
  'WELL003'
);

-- Insert Sample Discount Codes
INSERT INTO discount_codes (code, type, value, min_purchase, usage_limit, is_active) VALUES
('BIENVENUE10', 'fixed', 10, 100, NULL, true),
('PROMO20', 'percentage', 20, 200, 100, true),
('VIP30', 'percentage', 30, 500, 50, true);

-- Insert Sample Banner
INSERT INTO banners (title, image_url, link_url, is_active, display_order) VALUES
('Soldes d''été - Jusqu''à -50%', 'https://images.pexels.com/photos/5632402/pexels-photo-5632402.jpeg', '/shop', true, 1);

-- Note: To create an admin user, you need to:
-- 1. Sign up through the app or Supabase Auth interface
-- 2. Then run this query with your user's email:
--
-- UPDATE profiles SET role = 'admin' WHERE email = 'your@email.com';
