import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';
import { ShoppingCart, Calendar, DollarSign, Mail } from 'lucide-react';

interface AbandonedCart {
  id: string;
  session_id: string;
  user_email: string | null;
  cart_data: any;
  cart_value: number;
  created_at: string;
  recovered: boolean;
  recovered_at: string | null;
}

export const AdminAbandonedCarts = () => {
  const [carts, setCarts] = useState<AbandonedCart[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'active' | 'recovered'>('active');

  useEffect(() => {
    loadAbandonedCarts();
  }, [filter]);

  const loadAbandonedCarts = async () => {
    setLoading(true);

    let query = supabase
      .from('abandoned_carts')
      .select('*')
      .order('created_at', { ascending: false });

    if (filter === 'active') {
      query = query.eq('recovered', false);
    } else if (filter === 'recovered') {
      query = query.eq('recovered', true);
    }

    const { data } = await query;

    if (data) {
      setCarts(data);
    }
    setLoading(false);
  };

  const markAsRecovered = async (cartId: string) => {
    const { error } = await supabase
      .from('abandoned_carts')
      .update({
        recovered: true,
        recovered_at: new Date().toISOString(),
      })
      .eq('id', cartId);

    if (!error) {
      loadAbandonedCarts();
    }
  };

  const totalValue = carts.reduce((sum, cart) => sum + Number(cart.cart_value), 0);
  const activeCartsCount = carts.filter(c => !c.recovered).length;

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-pink-500 border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Paniers abandonnés</h1>
        <div className="flex gap-2">
          <button
            onClick={() => setFilter('active')}
            className={`px-4 py-2 rounded-lg ${
              filter === 'active'
                ? 'bg-pink-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Actifs ({activeCartsCount})
          </button>
          <button
            onClick={() => setFilter('recovered')}
            className={`px-4 py-2 rounded-lg ${
              filter === 'recovered'
                ? 'bg-pink-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Récupérés
          </button>
          <button
            onClick={() => setFilter('all')}
            className={`px-4 py-2 rounded-lg ${
              filter === 'all'
                ? 'bg-pink-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Tous
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-gray-600 text-sm font-medium">Paniers actifs</h3>
            <ShoppingCart className="w-5 h-5 text-orange-500" />
          </div>
          <p className="text-3xl font-bold">{activeCartsCount}</p>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-gray-600 text-sm font-medium">Valeur totale</h3>
            <DollarSign className="w-5 h-5 text-green-500" />
          </div>
          <p className="text-3xl font-bold">{totalValue.toFixed(2)} MAD</p>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-gray-600 text-sm font-medium">Taux de récupération</h3>
            <Calendar className="w-5 h-5 text-blue-500" />
          </div>
          <p className="text-3xl font-bold">
            {carts.length > 0
              ? ((carts.filter(c => c.recovered).length / carts.length) * 100).toFixed(1)
              : 0}
            %
          </p>
        </div>
      </div>

      {carts.length === 0 ? (
        <div className="bg-white rounded-lg shadow p-12 text-center">
          <ShoppingCart className="w-16 h-16 mx-auto text-gray-300 mb-4" />
          <p className="text-gray-500 text-lg">Aucun panier abandonné</p>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Email
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Articles
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Valeur
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
              {carts.map((cart) => (
                <tr key={cart.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {new Date(cart.created_at).toLocaleDateString('fr-FR', {
                      day: '2-digit',
                      month: '2-digit',
                      year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {cart.user_email ? (
                      <div className="flex items-center gap-2">
                        <Mail className="w-4 h-4 text-gray-400" />
                        <span className="text-sm text-gray-900">{cart.user_email}</span>
                      </div>
                    ) : (
                      <span className="text-sm text-gray-400">Visiteur anonyme</span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {Array.isArray(cart.cart_data) ? cart.cart_data.length : 0} article(s)
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">
                    {Number(cart.cart_value).toFixed(2)} MAD
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {cart.recovered ? (
                      <span className="px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                        Récupéré
                      </span>
                    ) : (
                      <span className="px-2 py-1 text-xs font-semibold rounded-full bg-orange-100 text-orange-800">
                        Actif
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    {!cart.recovered && (
                      <button
                        onClick={() => markAsRecovered(cart.id)}
                        className="text-pink-600 hover:text-pink-700 font-medium"
                      >
                        Marquer comme récupéré
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};
