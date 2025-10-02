import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';
import { Plus, Trash2 } from 'lucide-react';

export const AdminDiscounts = () => {
  const [discounts, setDiscounts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    code: '',
    type: 'percentage',
    value: '',
    min_purchase: '',
    usage_limit: '',
    starts_at: '',
    ends_at: '',
    is_active: true,
  });

  useEffect(() => {
    loadDiscounts();
  }, []);

  const loadDiscounts = async () => {
    setLoading(true);
    const { data } = await supabase
      .from('discount_codes')
      .select('*')
      .order('created_at', { ascending: false });

    if (data) setDiscounts(data);
    setLoading(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const discountData = {
      code: formData.code.toUpperCase(),
      type: formData.type,
      value: parseFloat(formData.value),
      min_purchase: formData.min_purchase ? parseFloat(formData.min_purchase) : 0,
      usage_limit: formData.usage_limit ? parseInt(formData.usage_limit) : null,
      starts_at: formData.starts_at || null,
      ends_at: formData.ends_at || null,
      is_active: formData.is_active,
    };

    const { error } = await supabase.from('discount_codes').insert(discountData);

    if (error) {
      alert('Erreur lors de la création');
    } else {
      setShowForm(false);
      setFormData({
        code: '',
        type: 'percentage',
        value: '',
        min_purchase: '',
        usage_limit: '',
        starts_at: '',
        ends_at: '',
        is_active: true,
      });
      loadDiscounts();
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer ce code promo ?')) return;

    const { error } = await supabase.from('discount_codes').delete().eq('id', id);

    if (error) {
      alert('Erreur lors de la suppression');
    } else {
      loadDiscounts();
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Codes promo</h1>
        <button
          onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-2 bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition"
        >
          <Plus className="w-5 h-5" />
          Nouveau code
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-xl font-bold mb-4">Créer un code promo</h2>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Code *
              </label>
              <input
                type="text"
                required
                value={formData.code}
                onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Type *
              </label>
              <select
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                <option value="percentage">Pourcentage</option>
                <option value="fixed">Montant fixe</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Valeur * {formData.type === 'percentage' ? '(%)' : '(MAD)'}
              </label>
              <input
                type="number"
                step="0.01"
                required
                value={formData.value}
                onChange={(e) => setFormData({ ...formData, value: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Achat minimum (MAD)
              </label>
              <input
                type="number"
                step="0.01"
                value={formData.min_purchase}
                onChange={(e) => setFormData({ ...formData, min_purchase: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Limite d'utilisation
              </label>
              <input
                type="number"
                value={formData.usage_limit}
                onChange={(e) => setFormData({ ...formData, usage_limit: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Actif
              </label>
              <input
                type="checkbox"
                checked={formData.is_active}
                onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                className="w-4 h-4 text-primary-600 rounded focus:ring-primary-500"
              />
            </div>
          </div>

          <div className="mt-6 flex gap-3">
            <button
              type="submit"
              className="px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition"
            >
              Créer
            </button>
            <button
              type="button"
              onClick={() => setShowForm(false)}
              className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition"
            >
              Annuler
            </button>
          </div>
        </form>
      )}

      <div className="bg-white rounded-lg shadow">
        {loading ? (
          <div className="p-8 text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-4 border-primary-500 border-t-transparent mx-auto"></div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Code
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Type
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Valeur
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Utilisations
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Statut
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {discounts.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-8 text-center text-gray-500">
                      Aucun code promo
                    </td>
                  </tr>
                ) : (
                  discounts.map((discount) => (
                    <tr key={discount.id}>
                      <td className="px-6 py-4 whitespace-nowrap font-medium">
                        {discount.code}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-gray-600">
                        {discount.type === 'percentage' ? 'Pourcentage' : 'Fixe'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap font-semibold">
                        {discount.type === 'percentage' ? `${discount.value}%` : `${discount.value} MAD`}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-gray-600">
                        {discount.usage_count} / {discount.usage_limit || '∞'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`px-2 py-1 text-xs rounded-full ${
                            discount.is_active
                              ? 'bg-green-100 text-green-800'
                              : 'bg-gray-100 text-gray-800'
                          }`}
                        >
                          {discount.is_active ? 'Actif' : 'Inactif'}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <button
                          onClick={() => handleDelete(discount.id)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded transition"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
