# 🛍️ Beauty&Home.ma

Site e-commerce complet pour le Maroc avec panel administrateur Shopify-like.

## ✨ Fonctionnalités

### Front-office (Public)
- 🏠 Page d'accueil avec bannières et produits vedettes
- 🛒 Catalogue de produits avec filtres
- 📦 Fiches produits détaillées
- 💳 Panier et checkout
- 👤 Authentification (inscription/connexion)
- 📱 Design mobile-first responsive

### Back-office (Admin)
- 📊 **Dashboard** : Statistiques temps réel (CA, commandes, clients)
- 📦 **Produits** : CRUD complet avec images, variantes, SEO
- 🛍️ **Commandes** : Gestion des statuts, suivi
- 👥 **Clients** : Gestion des utilisateurs
- 🎫 **Codes promo** : Création de remises (%, montant fixe)
- 🎨 **Bannières** : Gestion marketing de la page d'accueil
- ⚙️ **Paramètres** : Configuration générale

## 🚀 Installation rapide

### 1. Cloner et installer
```bash
cd beauty-home
npm install
```

### 2. Configurer Supabase
Créez un projet sur [supabase.com](https://supabase.com), puis :

**Fichier `.env`** :
```env
VITE_SUPABASE_URL=votre_url_supabase
VITE_SUPABASE_ANON_KEY=votre_cle_anon
```

### 3. Base de données
Dans Supabase SQL Editor, exécutez dans l'ordre :
1. `database-setup.sql` (structure)
2. `seed-data.sql` (données de test - optionnel)

### 4. Créer un admin
Après inscription dans l'app, exécutez :
```sql
UPDATE profiles SET role = 'admin' WHERE email = 'votre@email.com';
```

### 5. Lancer
```bash
npm run dev
```

Accédez au panel admin : `http://localhost:5173/admin`

## 📚 Documentation complète
Voir [INSTRUCTIONS.md](./INSTRUCTIONS.md) pour le guide détaillé.

## 🛠️ Stack
- **Frontend** : React + TypeScript + Vite
- **UI** : Tailwind CSS
- **Backend** : Supabase (PostgreSQL + Auth)
- **Routing** : React Router
- **Icons** : Lucide React

## 📦 Structure
```
beauty-home/
├── src/
│   ├── pages/
│   │   ├── admin/          # Panel admin complet
│   │   ├── Home.tsx        # Page d'accueil
│   │   ├── Shop.tsx        # Catalogue
│   │   └── ...
│   ├── components/         # Composants réutilisables
│   ├── lib/
│   │   ├── supabase.ts    # Client Supabase
│   │   └── auth.tsx       # Contexte auth
│   └── ...
├── database-setup.sql     # Script SQL complet
├── seed-data.sql          # Données de test
└── INSTRUCTIONS.md        # Guide détaillé
```

## 🔒 Sécurité
- ✅ RLS (Row Level Security) activé sur toutes les tables
- ✅ Authentification Supabase Auth
- ✅ Policies strictes admin/client
- ✅ Protection CSRF et injection SQL

## 💎 Cahier des charges
Conforme au cahier des charges Beauty&Home.ma :
- ✅ MVP complet fonctionnel
- ✅ Mobile-first design
- ✅ Panel admin Shopify-like
- ✅ Multi-devises (MAD + EUR frontend)
- ✅ Gestion codes promo
- ✅ Statuts commandes (SLA Maroc)
- ✅ Base de données PostgreSQL réelle
- ✅ Prêt pour scale (marketplace, points relais en phase 2)
