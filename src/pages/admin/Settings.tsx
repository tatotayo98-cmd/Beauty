import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { Save, CircleAlert as AlertCircle, CircleCheck as CheckCircle, CreditCard } from 'lucide-react';

interface StoreSettings {
  id: string;
  paypal_client_id: string;
  paypal_secret: string;
  paypal_mode: 'sandbox' | 'production';
  store_name: string;
  store_email: string;
  store_phone: string;
}

export const AdminSettings = () => {
  const [settings, setSettings] = useState<StoreSettings>({
    id: '',
    paypal_client_id: '',
    paypal_secret: '',
    paypal_mode: 'sandbox',
    store_name: 'Beauty&Home.ma',
    store_email: 'beauty.home.ma.212@gmail.com',
    store_phone: '+212 6456 750 92',
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [showSecret, setShowSecret] = useState(false);

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      const { data, error } = await supabase
        .from('store_settings')
        .select('*')
        .maybeSingle();

      if (error) throw error;

      if (data) {
        setSettings(data);
      }
    } catch (error) {
      console.error('Error loading settings:', error);
      setMessage({ type: 'error', text: 'Erreur lors du chargement des paramètres' });
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    setMessage(null);

    try {
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) {
        throw new Error('Non authentifié');
      }

      const updateData = {
        paypal_client_id: settings.paypal_client_id,
        paypal_secret: settings.paypal_secret,
        paypal_mode: settings.paypal_mode,
        store_name: settings.store_name,
        store_email: settings.store_email,
        store_phone: settings.store_phone,
        updated_at: new Date().toISOString(),
        updated_by: user.id,
      };

      if (settings.id) {
        const { error } = await supabase
          .from('store_settings')
          .update(updateData)
          .eq('id', settings.id);

        if (error) throw error;
      } else {
        const { data, error } = await supabase
          .from('store_settings')
          .insert([updateData])
          .select()
          .single();

        if (error) throw error;
        if (data) {
          setSettings({ ...settings, id: data.id });
        }
      }

      setMessage({ type: 'success', text: 'Paramètres enregistrés avec succès !' });

      setTimeout(() => setMessage(null), 3000);
    } catch (error: any) {
      console.error('Error saving settings:', error);
      setMessage({
        type: 'error',
        text: `Erreur: ${error.message || 'Veuillez créer la table store_settings d\'abord'}`
      });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-pink-500 border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">Paramètres</h1>

      {message && (
        <div
          className={`mb-6 p-4 rounded-lg flex items-center gap-2 ${
            message.type === 'success'
              ? 'bg-green-50 border border-green-200 text-green-800'
              : 'bg-red-50 border border-red-200 text-red-800'
          }`}
        >
          {message.type === 'success' ? (
            <CheckCircle className="w-5 h-5" />
          ) : (
            <AlertCircle className="w-5 h-5" />
          )}
          <span>{message.text}</span>
        </div>
      )}

      <div className="space-y-6">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center gap-3 mb-6">
            <CreditCard className="w-6 h-6 text-pink-600" />
            <h2 className="text-xl font-semibold">Configuration PayPal Business</h2>
          </div>

          <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <h3 className="font-semibold text-blue-900 mb-2">Comment obtenir vos identifiants PayPal Business :</h3>
            <ol className="list-decimal list-inside space-y-1 text-sm text-blue-800">
              <li>Créez un compte PayPal Business sur <a href="https://www.paypal.com/ma/business" target="_blank" rel="noopener noreferrer" className="underline">paypal.com/ma/business</a></li>
              <li>Connectez-vous à votre compte PayPal Business</li>
              <li>Accédez à <a href="https://developer.paypal.com/dashboard" target="_blank" rel="noopener noreferrer" className="underline">developer.paypal.com</a></li>
              <li>Créez une application dans "My Apps & Credentials"</li>
              <li>Copiez votre Client ID et Secret Key</li>
              <li>Collez-les dans les champs ci-dessous</li>
            </ol>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Mode PayPal *
              </label>
              <select
                value={settings.paypal_mode}
                onChange={(e) =>
                  setSettings({ ...settings, paypal_mode: e.target.value as 'sandbox' | 'production' })
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
              >
                <option value="sandbox">Sandbox (Test)</option>
                <option value="production">Production (En ligne)</option>
              </select>
              <p className="text-xs text-gray-500 mt-1">
                Utilisez "Sandbox" pour les tests, "Production" pour les vrais paiements
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Client ID PayPal *
              </label>
              <input
                type="text"
                value={settings.paypal_client_id}
                onChange={(e) => setSettings({ ...settings, paypal_client_id: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent font-mono text-sm"
                placeholder="AeB1234567890..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Secret Key PayPal *
              </label>
              <div className="relative">
                <input
                  type={showSecret ? 'text' : 'password'}
                  value={settings.paypal_secret}
                  onChange={(e) => setSettings({ ...settings, paypal_secret: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent font-mono text-sm"
                  placeholder="ENC1234567890..."
                />
                <button
                  type="button"
                  onClick={() => setShowSecret(!showSecret)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-gray-600 hover:text-gray-800"
                >
                  {showSecret ? 'Masquer' : 'Afficher'}
                </button>
              </div>
              <p className="text-xs text-gray-500 mt-1">
                Votre clé secrète est stockée de manière sécurisée
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Informations du magasin</h2>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nom du magasin *
              </label>
              <input
                type="text"
                value={settings.store_name}
                onChange={(e) => setSettings({ ...settings, store_name: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email du magasin *
              </label>
              <input
                type="email"
                value={settings.store_email}
                onChange={(e) => setSettings({ ...settings, store_email: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Téléphone du magasin *
              </label>
              <input
                type="tel"
                value={settings.store_phone}
                onChange={(e) => setSettings({ ...settings, store_phone: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
              />
            </div>
          </div>
        </div>

        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <div className="flex items-start gap-2">
            <AlertCircle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
            <div className="text-sm text-yellow-800">
              <p className="font-semibold mb-1">Important :</p>
              <ul className="list-disc list-inside space-y-1">
                <li>Assurez-vous d'avoir un compte PayPal Business vérifié</li>
                <li>Les identifiants Sandbox sont différents des identifiants Production</li>
                <li>Testez toujours en mode Sandbox avant de passer en Production</li>
                <li>Ne partagez jamais votre Secret Key avec qui que ce soit</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="flex justify-end">
          <button
            onClick={handleSave}
            disabled={saving}
            className="flex items-center gap-2 bg-pink-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-pink-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Save className="w-5 h-5" />
            {saving ? 'Enregistrement...' : 'Enregistrer les paramètres'}
          </button>
        </div>
      </div>
    </div>
  );
};
