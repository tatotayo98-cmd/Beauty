import { createClient } from '@supabase/supabase-js';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Variables d\'environnement manquantes');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function setupDatabase() {
  try {
    console.log('📦 Lecture du fichier SQL...');
    const sql = readFileSync(join(__dirname, 'database-setup.sql'), 'utf-8');

    console.log('🔨 Création des tables...');

    // Exécuter le SQL via l'API REST de Supabase
    const response = await fetch(`${supabaseUrl}/rest/v1/rpc/exec_sql`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': supabaseKey,
        'Authorization': `Bearer ${supabaseKey}`
      },
      body: JSON.stringify({ query: sql })
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Erreur HTTP: ${response.status} - ${error}`);
    }

    console.log('✅ Tables créées avec succès!');

    // Charger les données de test
    console.log('📝 Chargement des données de test...');
    const seedSql = readFileSync(join(__dirname, 'seed-data.sql'), 'utf-8');

    const seedResponse = await fetch(`${supabaseUrl}/rest/v1/rpc/exec_sql`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': supabaseKey,
        'Authorization': `Bearer ${supabaseKey}`
      },
      body: JSON.stringify({ query: seedSql })
    });

    if (!seedResponse.ok) {
      const error = await seedResponse.text();
      console.warn('⚠️  Attention avec les données de test:', error);
    } else {
      console.log('✅ Données de test chargées!');
    }

  } catch (error) {
    console.error('❌ Erreur:', error.message);
    process.exit(1);
  }
}

setupDatabase();
