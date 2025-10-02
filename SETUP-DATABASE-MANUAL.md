# Instructions pour créer la base de données

Les outils automatiques ne fonctionnent pas actuellement. Voici comment créer les tables manuellement :

## Méthode 1 : Via l'interface Supabase (RECOMMANDÉ)

1. Va sur https://0ec90c'zeb57d6e95fcbda19832f.supabase.co
2. Connecte-toi à ton compte Supabase
3. Dans le menu de gauche, clique sur **"SQL Editor"**
4. Copie tout le contenu du fichier `database-setup.sql`
5. Colle-le dans l'éditeur SQL
6. Clique sur **"Run"** ou **"Execute"**
7. Répète avec le fichier `seed-data.sql` pour les données de test

## Méthode 2 : Via curl et l'API Supabase

```bash
# Créer les tables
curl -X POST 'https://0ec90b57d6e95fcbda19832f.supabase.co/rest/v1/rpc/exec_sql' \
  -H "apikey: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJib2x0IiwicmVmIjoiMGVjOTBiNTdkNmU5NWZjYmRhMTk4MzJmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTg4ODE1NzQsImV4cCI6MTc1ODg4MTU3NH0.9I8-U0x86Ak8t2DGaIk0HfvTSLsAyzdnz-Nw00mMkKw" \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJib2x0IiwicmVmIjoiMGVjOTBiNTdkNmU5NWZjYmRhMTk4MzJmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTg4ODE1NzQsImV4cCI6MTc1ODg4MTU3NH0.9I8-U0x86Ak8t2DGaIk0HfvTSLsAyzdnz-Nw00mMkKw" \
  -H "Content-Type: application/json" \
  -d @database-setup.sql
```

## Vérification

Une fois les tables créées, tu devrais avoir :
- ✅ 13 tables créées
- ✅ Politiques RLS activées
- ✅ Index créés
- ✅ Triggers configurés

Pour vérifier, retourne dans l'interface Supabase et vérifie la section "Table Editor".
