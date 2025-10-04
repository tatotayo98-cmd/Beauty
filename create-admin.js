import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://yhjmhzvuwdmmchbjlrrj.supabase.co';
const supabaseServiceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inloam1oenZ1d2RtbWNoYmpscnJqIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1OTQwMzk2MCwiZXhwIjoyMDc0OTc5OTYwfQ.u_QUUJGfwwcH0YYQZVRpSwXkpN-vxTRnGDnG2ndjhQ0';

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

async function createAdminUser() {
  try {
    console.log('🔍 Vérification de la structure de la base de données...');

    // Vérifier si la table profiles existe
    const { data: profiles, error: profilesError } = await supabase
      .from('profiles')
      .select('*')
      .limit(1);

    if (profilesError) {
      console.error('❌ Erreur avec la table profiles:', profilesError.message);
      console.log('⚠️  La table profiles n\'existe pas. Exécute le fichier database-setup.sql dans Supabase.');
      return;
    }

    console.log('✅ Table profiles existe');

    // Vérifier l'utilisateur tatotayo98@gmail.com
    console.log('\n🔍 Vérification de l\'utilisateur tatotayo98@gmail.com...');
    const { data: existingUser, error: userError } = await supabase
      .from('profiles')
      .select('*')
      .eq('email', 'tatotayo98@gmail.com')
      .maybeSingle();

    if (existingUser) {
      console.log('👤 Utilisateur trouvé:', existingUser);

      if (existingUser.role !== 'admin') {
        console.log('🔄 Mise à jour du rôle en admin...');
        const { error: updateError } = await supabase
          .from('profiles')
          .update({ role: 'admin' })
          .eq('email', 'tatotayo98@gmail.com');

        if (updateError) {
          console.error('❌ Erreur lors de la mise à jour:', updateError.message);
        } else {
          console.log('✅ Utilisateur mis à jour en admin');
        }
      } else {
        console.log('✅ Utilisateur est déjà admin');
      }
    } else {
      console.log('⚠️  Utilisateur tatotayo98@gmail.com n\'existe pas dans profiles');
    }

    // Créer l'utilisateur admin par défaut
    console.log('\n🔍 Création de l\'utilisateur admin par défaut...');

    // Vérifier si admin@gmail.com existe déjà
    const { data: adminExists } = await supabase
      .from('profiles')
      .select('*')
      .eq('email', 'admin@gmail.com')
      .maybeSingle();

    if (adminExists) {
      console.log('✅ L\'utilisateur admin@gmail.com existe déjà');

      if (adminExists.role !== 'admin') {
        console.log('🔄 Mise à jour du rôle en admin...');
        await supabase
          .from('profiles')
          .update({ role: 'admin' })
          .eq('email', 'admin@gmail.com');
        console.log('✅ Rôle mis à jour');
      }
    } else {
      console.log('📝 Création du compte admin@gmail.com...');

      // Créer l'utilisateur dans auth.users
      const { data: authData, error: authError } = await supabase.auth.admin.createUser({
        email: 'admin@gmail.com',
        password: 'admin',
        email_confirm: true
      });

      if (authError) {
        console.error('❌ Erreur lors de la création de l\'utilisateur:', authError.message);
        return;
      }

      console.log('✅ Utilisateur créé dans auth.users');

      // Créer le profil
      const { error: profileError } = await supabase
        .from('profiles')
        .insert({
          id: authData.user.id,
          email: 'admin@gmail.com',
          full_name: 'Admin',
          role: 'admin'
        });

      if (profileError) {
        console.error('❌ Erreur lors de la création du profil:', profileError.message);
      } else {
        console.log('✅ Profil admin créé avec succès');
      }
    }

    console.log('\n✅ Configuration terminée!');
    console.log('📌 Identifiants admin: admin@gmail.com / admin');

  } catch (error) {
    console.error('❌ Erreur:', error.message);
  }
}

createAdminUser();
