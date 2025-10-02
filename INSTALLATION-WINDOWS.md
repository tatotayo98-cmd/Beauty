# 🪟 Installation Windows - Beauty&Home.ma

## 📥 Télécharger le projet

### Option 1 : Via GitHub (recommandé)
Le projet sera bientôt disponible sur GitHub. Sinon, utilise l'option 2.

### Option 2 : Création manuelle (15 minutes)

#### Étape 1 : Créer le dossier
```powershell
mkdir C:\Users\ralph\beauty-home
cd C:\Users\ralph\beauty-home
```

#### Étape 2 : Initialiser le projet Node.js
```powershell
npm init -y
```

#### Étape 3 : Installer Vite + React
```powershell
npm create vite@latest . -- --template react-ts
```
Répondre "yes" si demandé d'écraser package.json

#### Étape 4 : Installer les dépendances
```powershell
npm install @supabase/supabase-js react-router-dom lucide-react recharts
npm install -D @tailwindcss/postcss tailwindcss@latest autoprefixer
```

#### Étape 5 : Configurer Tailwind
Créer `tailwind.config.js` :
```js
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#fdf2f8',
          100: '#fce7f3',
          200: '#fbcfe8',
          300: '#f9a8d4',
          400: '#f472b6',
          500: '#ec4899',
          600: '#db2777',
          700: '#be185d',
          800: '#9d174d',
          900: '#831843',
        },
      },
    },
  },
  plugins: [],
}
```

Créer `postcss.config.js` :
```js
export default {
  plugins: {
    '@tailwindcss/postcss': {},
  },
}
```

#### Étape 6 : Créer le fichier .env
```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_key
```

#### Étape 7 : Les fichiers sources

Je vais te donner les fichiers un par un. Crée chaque fichier avec son contenu.

---

## 🚀 Ou utilise cette commande PowerShell pour tout automatiser :

Copie ce script complet dans PowerShell (exécuter en tant qu'admin) :

```powershell
# Créer le projet
$projectPath = "C:\Users\ralph\beauty-home"
New-Item -ItemType Directory -Path $projectPath -Force
Set-Location $projectPath

# Initialiser avec Vite
npm create vite@latest . -- --template react-ts -y

# Installer dépendances
npm install
npm install @supabase/supabase-js react-router-dom lucide-react recharts
npm install -D @tailwindcss/postcss tailwindcss@latest autoprefixer

Write-Host "✅ Projet créé ! Maintenant, suis les instructions dans le fichier README.md"
Write-Host "📝 N'oublie pas de configurer Supabase dans le fichier .env"
```

---

## ⚠️ IMPORTANT : Après installation

1. Configure Supabase (voir guide dans README.md)
2. Exécute database-setup.sql dans Supabase
3. Lance : `npm run dev`
4. Ouvre http://localhost:5173

---

## 📞 Besoin d'aide ?

Si cette méthode ne fonctionne pas, demande-moi de t'envoyer les fichiers source un par un et tu les copieras manuellement.
