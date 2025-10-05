import { createClient } from '@supabase/supabase-js';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const envFile = readFileSync(join(__dirname, '.env'), 'utf8');
const envVars = {};
envFile.split('\n').forEach(line => {
  const [key, ...values] = line.split('=');
  if (key && values.length) {
    envVars[key.trim()] = values.join('=').trim();
  }
});

const supabaseUrl = envVars.VITE_SUPABASE_URL;
const supabaseKey = envVars.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Variables d\'environnement Supabase manquantes');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function setupPaymentSettings() {
  console.log('🔧 Configuration des paramètres de paiement...\n');

  try {
    console.log('1️⃣ Création de la table store_settings...');
    const sqlFile = readFileSync(join(__dirname, 'add-store-settings.sql'), 'utf8');

    const sqlStatements = sqlFile
      .split(';')
      .map(s => s.trim())
      .filter(s => s.length > 0 && !s.startsWith('/*') && !s.startsWith('--'));

    for (const statement of sqlStatements) {
      if (statement.includes('CREATE TABLE') ||
          statement.includes('ALTER TABLE') ||
          statement.includes('CREATE POLICY') ||
          statement.includes('DO $$')) {
        try {
          const { error } = await supabase.rpc('exec_sql', {
            sql_query: statement
          });

          if (error && !error.message.includes('already exists')) {
            console.log('⚠️  Avertissement:', error.message);
          }
        } catch (e) {
          console.log('⚠️  Passage à l\'étape suivante...');
        }
      }
    }

    console.log('✅ Table store_settings configurée\n');

    console.log('2️⃣ Vérification de la configuration existante...');
    const { data: existing, error: checkError } = await supabase
      .from('store_settings')
      .select('*')
      .maybeSingle();

    if (checkError) {
      console.error('❌ Erreur lors de la vérification:', checkError.message);
      console.log('\n📝 Action requise:');
      console.log('Allez dans votre dashboard Supabase et exécutez le fichier add-store-settings.sql manuellement');
      console.log('Ensuite, réexécutez ce script.');
      process.exit(1);
    }

    if (existing) {
      console.log('✅ Configuration existante trouvée\n');

      console.log('3️⃣ Mise à jour avec vos identifiants PayPal...');
      const { error: updateError } = await supabase
        .from('store_settings')
        .update({
          paypal_client_id: 'AZm4z6JoKQ0wU4lO90l9kmjnmuBBzGJKyLBCtPsp_nnH0Rhl-_41nJfbnYF9Ax2nAPZzPS_XoowU1T7Y',
          paypal_secret: 'EBLU4ivvfxCh4PUod4Nn38tyhDBM4dcBTqLAYnmpTlts8mTarc6Bi5ANGRYFflIDa6jeb6frmc4a6N9t',
          paypal_mode: 'production',
          updated_at: new Date().toISOString()
        })
        .eq('id', existing.id);

      if (updateError) {
        console.error('❌ Erreur lors de la mise à jour:', updateError.message);
        process.exit(1);
      }

      console.log('✅ Identifiants PayPal configurés avec succès!\n');
    } else {
      console.log('3️⃣ Création de la configuration initiale...');
      const { error: insertError } = await supabase
        .from('store_settings')
        .insert([{
          paypal_client_id: 'AZm4z6JoKQ0wU4lO90l9kmjnmuBBzGJKyLBCtPsp_nnH0Rhl-_41nJfbnYF9Ax2nAPZzPS_XoowU1T7Y',
          paypal_secret: 'EBLU4ivvfxCh4PUod4Nn38tyhDBM4dcBTqLAYnmpTlts8mTarc6Bi5ANGRYFflIDa6jeb6frmc4a6N9t',
          paypal_mode: 'production',
          store_name: 'Beauty&Home.ma',
          store_email: 'beauty.home.ma.212@gmail.com',
          store_phone: '+212 6456 750 92'
        }]);

      if (insertError) {
        console.error('❌ Erreur lors de l\'insertion:', insertError.message);
        process.exit(1);
      }

      console.log('✅ Configuration initiale créée avec succès!\n');
    }

    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('✨ Configuration PayPal terminée avec succès!');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('');
    console.log('📋 Paramètres configurés:');
    console.log('   • Mode: Production');
    console.log('   • Client ID: AZm4z6...T7Y (configuré)');
    console.log('   • Secret: EBLU4i...N9t (configuré)');
    console.log('');
    console.log('🚀 Vous pouvez maintenant accepter des paiements PayPal!');
    console.log('');

  } catch (error) {
    console.error('❌ Erreur:', error.message);
    process.exit(1);
  }
}

setupPaymentSettings();
