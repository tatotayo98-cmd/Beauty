# 🚀 Démarrage rapide - Beauty&Home.ma

## ⚡ En 5 minutes

### 1️⃣ Créer votre compte Supabase (GRATUIT)
👉 Allez sur [supabase.com](https://supabase.com)
- Cliquez sur "Start your project"
- Créez un compte gratuit
- Créez un nouveau projet
- **IMPORTANT** : Notez bien votre **mot de passe de base de données** (vous en aurez besoin !)

### 2️⃣ Récupérer vos clés
Dans votre projet Supabase :
1. Cliquez sur ⚙️ **Settings** (en bas à gauche)
2. Allez dans **API**
3. Copiez ces 2 valeurs :
   - `Project URL`
   - `anon public` (sous "Project API keys")

### 3️⃣ Configurer le projet
Ouvrez le fichier `.env` et remplacez :
```env
VITE_SUPABASE_URL=votre_project_url_ici
VITE_SUPABASE_ANON_KEY=votre_anon_key_ici
```

### 4️⃣ Créer la base de données
Dans Supabase :
1. Cliquez sur 🔍 **SQL Editor** (menu de gauche)
2. Cliquez sur **New query**
3. Copiez TOUT le contenu du fichier `database-setup.sql`
4. Collez-le dans l'éditeur
5. Cliquez sur **RUN** ▶️
6. ✅ Vous devriez voir "Success. No rows returned"

### 5️⃣ Ajouter des données de test (optionnel)
Répétez l'opération avec le fichier `seed-data.sql`
- Ça va créer des catégories, produits, et codes promo d'exemple

### 6️⃣ Lancer le site
Dans le terminal, dans le dossier du projet :
```bash
npm install
npm run dev
```

Ouvrez votre navigateur sur : `http://localhost:5173`

### 7️⃣ Créer votre compte admin
1. Sur le site, cliquez sur **Connexion** > **Créer un compte**
2. Inscrivez-vous avec votre email
3. Retournez dans Supabase > **SQL Editor**
4. Exécutez cette commande en remplaçant par votre email :
   ```sql
   UPDATE profiles
   SET role = 'admin'
   WHERE email = 'votre@email.com';
   ```
5. Reconnectez-vous sur le site
6. Vous avez maintenant accès à `/admin` 🎉

## 🎯 Accès rapide

| Page | URL | Description |
|------|-----|-------------|
| 🏠 Accueil | `/` | Page publique |
| 🛍️ Boutique | `/shop` | Catalogue produits |
| 🔐 Admin | `/admin` | Panel administrateur |

## 🆘 Problèmes courants

### "Missing Supabase environment variables"
➡️ Vérifiez que le fichier `.env` contient bien vos clés Supabase

### "No rows returned" après le SQL
✅ C'est normal ! Ça veut dire que tout s'est bien passé

### Je n'ai pas accès à /admin
➡️ Vérifiez que vous avez bien exécuté la requête SQL pour passer admin :
```sql
UPDATE profiles SET role = 'admin' WHERE email = 'votre@email.com';
```

### Erreur "Cannot connect to Supabase"
➡️ Vérifiez que :
1. Votre projet Supabase est bien démarré
2. Les clés dans `.env` sont correctes
3. Vous avez bien exécuté `database-setup.sql`

## 📚 Prochaines étapes

Une fois tout configuré :
- ✅ Connectez-vous à `/admin`
- ✅ Ajoutez vos propres produits
- ✅ Créez des catégories
- ✅ Configurez des bannières
- ✅ Créez des codes promo

Pour plus de détails, consultez [INSTRUCTIONS.md](./INSTRUCTIONS.md)

---

**Besoin d'aide ?** Consultez la [documentation Supabase](https://supabase.com/docs)
