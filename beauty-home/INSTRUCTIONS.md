# Beauty&Home.ma - Instructions de configuration

## 🎯 Configuration de Supabase

### 1. Créer votre projet Supabase
1. Allez sur [supabase.com](https://supabase.com)
2. Créez un nouveau projet
3. Récupérez votre `URL` et `anon key` dans les paramètres du projet

### 2. Configurer les variables d'environnement
Modifiez le fichier `.env` à la racine du projet :

```env
VITE_SUPABASE_URL=votre_url_supabase
VITE_SUPABASE_ANON_KEY=votre_cle_anon_supabase
```

### 3. Exécuter le script SQL de création de schéma
Dans l'interface Supabase, allez dans **SQL Editor** et exécutez le contenu du fichier `database-setup.sql` qui se trouve à la racine du projet.

Ce script va créer :
- Toutes les tables nécessaires (produits, commandes, clients, etc.)
- Les politiques de sécurité (RLS)
- Les fonctions et triggers
- Les index pour les performances

### 4. Créer votre compte administrateur

#### Option A : Via l'interface Supabase
1. Allez dans **Authentication** > **Users**
2. Créez un nouvel utilisateur avec votre email et mot de passe
3. Notez l'ID de l'utilisateur créé
4. Allez dans **Table Editor** > **profiles**
5. Trouvez votre utilisateur et changez le champ `role` de `customer` à `admin`

#### Option B : Via SQL
Exécutez ce script SQL en remplaçant les valeurs :

```sql
-- 1. D'abord, créez un utilisateur via l'interface Supabase Auth
-- 2. Ensuite, mettez à jour son rôle :

UPDATE profiles
SET role = 'admin'
WHERE email = 'votre@email.com';
```

### 5. Données de test (Optionnel)
Pour ajouter des catégories et produits de test, exécutez le fichier `seed-data.sql` dans le SQL Editor.

## 🚀 Lancement du projet

```bash
npm install
npm run dev
```

Le site sera accessible sur `http://localhost:5173`

## 📱 Accès

### Interface publique
- Accueil : `/`
- Boutique : `/shop`
- Connexion : `/login`
- Inscription : `/register`

### Panel administrateur
- URL : `/admin`
- Connexion requise avec un compte ayant le rôle `admin`

## 🛠️ Fonctionnalités du panel admin

- **Dashboard** : Statistiques (revenus, commandes, clients, produits)
- **Produits** : CRUD complet, gestion des images, variantes, SEO
- **Commandes** : Gestion des statuts, suivi
- **Clients** : Liste des utilisateurs
- **Remises** : Création de codes promo (%, montant fixe)
- **Bannières** : Gestion des bannières de la page d'accueil
- **Paramètres** : Configuration générale

## 🔒 Sécurité

- Authentification via Supabase Auth
- RLS (Row Level Security) activé sur toutes les tables
- Les clients ne peuvent voir que leurs propres données
- Les admins ont accès complet via des policies dédiées

## 📊 Structure de la base de données

Tables principales :
- `profiles` : Utilisateurs (clients + admins)
- `products` : Produits
- `product_variants` : Variantes de produits
- `categories` : Catégories
- `orders` : Commandes
- `order_items` : Articles commandés
- `discount_codes` : Codes promo
- `banners` : Bannières marketing
- `reviews` : Avis produits

## 🎨 Stack technique

- **Frontend** : React + TypeScript + Vite
- **Styling** : Tailwind CSS
- **Base de données** : Supabase (PostgreSQL)
- **Auth** : Supabase Auth
- **Routing** : React Router
- **Icons** : Lucide React
