import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';
import { useCart } from '../lib/cart';
import { useAuth } from '../lib/auth';
import { supabase } from '../lib/supabase';
import { CreditCard, Truck, MapPin, Star } from 'lucide-react';

interface ShippingInfo {
  fullName: string;
  phone: string;
  address: string;
  city: string;
  postalCode: string;
}

const MOROCCAN_CITIES = [
  'Casablanca',
  'Rabat',
  'Marrakech',
  'Fès',
  'Tanger',
  'Agadir',
  'Meknès',
  'Oujda',
  'Kenitra',
  'Tétouan',
  'Safi',
  'Salé',
  'Temara',
  'Mohammedia',
  'Khouribga',
  'El Jadida',
  'Béni Mellal',
  'Nador',
  'Khemisset',
  'Berkane',
];

export const Checkout = () => {
  const navigate = useNavigate();
  const { items, totalPrice, clearCart } = useCart();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState<'city' | 'details'>('city');
  const [paymentMethod, setPaymentMethod] = useState<'cash' | 'paypal'>('paypal');
  const [shippingInfo, setShippingInfo] = useState<ShippingInfo>({
    fullName: '',
    phone: '',
    address: '',
    city: '',
    postalCode: '',
  });

  useEffect(() => {
    if (items.length === 0) {
      navigate('/cart');
    }
  }, [items, navigate]);

  const isCasablanca = shippingInfo.city === 'Casablanca';

  useEffect(() => {
    if (shippingInfo.city && !isCasablanca) {
      setPaymentMethod('paypal');
    }
  }, [shippingInfo.city, isCasablanca]);

  const handleCitySelect = (city: string) => {
    setShippingInfo({ ...shippingInfo, city });
    setStep('details');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user) {
      alert('Veuillez vous connecter pour continuer');
      navigate('/login');
      return;
    }

    setLoading(true);

    try {
      const orderData = {
        user_id: user.id,
        total_amount: totalPrice,
        shipping_address: `${shippingInfo.address}, ${shippingInfo.city}, ${shippingInfo.postalCode}`,
        customer_name: shippingInfo.fullName,
        customer_phone: shippingInfo.phone,
        customer_city: shippingInfo.city,
        payment_method: paymentMethod === 'cash' ? 'Paiement à la livraison' : 'PayPal',
        payment_status: paymentMethod === 'cash' ? 'pending' : 'pending',
        status: 'pending',
      };

      const { data: order, error: orderError } = await supabase
        .from('orders')
        .insert([orderData])
        .select()
        .single();

      if (orderError) throw orderError;

      const orderItems = items.map(item => ({
        order_id: order.id,
        product_id: item.id,
        quantity: item.quantity,
        price: item.price,
      }));

      const { error: itemsError } = await supabase
        .from('order_items')
        .insert(orderItems);

      if (itemsError) throw itemsError;

      clearCart();

      if (paymentMethod === 'paypal') {
        alert('Redirection vers PayPal... (À configurer dans les paramètres administrateur)');
      } else {
        alert('Commande confirmée ! Paiement à la livraison.');
      }

      navigate('/track-order');
    } catch (error) {
      console.error('Error creating order:', error);
      alert('Une erreur est survenue. Veuillez réessayer.');
    } finally {
      setLoading(false);
    }
  };

  if (items.length === 0) {
    return null;
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <h1 className="text-3xl font-bold mb-8">Finaliser la commande</h1>

          {step === 'city' ? (
            <div className="max-w-4xl mx-auto">
              <div className="bg-white rounded-lg shadow p-8">
                <div className="flex items-center gap-3 mb-6">
                  <MapPin className="w-8 h-8 text-pink-600" />
                  <h2 className="text-2xl font-semibold">Sélectionnez votre ville</h2>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                  {MOROCCAN_CITIES.map((city) => (
                    <button
                      key={city}
                      onClick={() => handleCitySelect(city)}
                      className="p-4 border-2 border-gray-300 rounded-lg hover:border-pink-500 hover:bg-pink-50 transition font-medium text-center"
                    >
                      {city}
                    </button>
                  ))}
                </div>

                <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <p className="text-sm text-blue-800">
                    <strong>Livraison gratuite partout au Maroc !</strong><br />
                    Casablanca : 24h | Autres villes : 24h-48h
                  </p>
                </div>
              </div>

              <div className="mt-6">
                <div className="bg-white rounded-lg shadow p-6">
                  <h3 className="text-lg font-semibold mb-4">Résumé de la commande</h3>
                  <div className="space-y-3">
                    {items.map((item) => (
                      <div key={item.id} className="flex gap-3">
                        <img
                          src={item.image_url}
                          alt={item.name}
                          className="w-16 h-16 object-cover rounded"
                        />
                        <div className="flex-1">
                          <p className="text-sm font-medium">{item.name}</p>
                          <p className="text-sm text-gray-600">Qté: {item.quantity}</p>
                        </div>
                        <p className="text-sm font-semibold">{item.price * item.quantity} MAD</p>
                      </div>
                    ))}
                  </div>
                  <div className="border-t mt-4 pt-4">
                    <div className="flex justify-between text-lg font-bold">
                      <span>Total</span>
                      <span>{totalPrice} MAD</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="grid lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2">
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="bg-white rounded-lg shadow p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h2 className="text-xl font-semibold">Informations de livraison</h2>
                      <button
                        type="button"
                        onClick={() => setStep('city')}
                        className="text-pink-600 text-sm hover:underline"
                      >
                        Changer la ville ({shippingInfo.city})
                      </button>
                    </div>

                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Nom complet *
                        </label>
                        <input
                          type="text"
                          required
                          value={shippingInfo.fullName}
                          onChange={(e) => setShippingInfo({ ...shippingInfo, fullName: e.target.value })}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Téléphone *
                        </label>
                        <input
                          type="tel"
                          required
                          value={shippingInfo.phone}
                          onChange={(e) => setShippingInfo({ ...shippingInfo, phone: e.target.value })}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                          placeholder="+212 6XX XX XX XX"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Adresse complète *
                        </label>
                        <input
                          type="text"
                          required
                          value={shippingInfo.address}
                          onChange={(e) => setShippingInfo({ ...shippingInfo, address: e.target.value })}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                          placeholder="Numéro, rue, quartier..."
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Code postal (optionnel)
                        </label>
                        <input
                          type="text"
                          value={shippingInfo.postalCode}
                          onChange={(e) => setShippingInfo({ ...shippingInfo, postalCode: e.target.value })}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="bg-white rounded-lg shadow p-6">
                    <h2 className="text-xl font-semibold mb-4">Mode de paiement</h2>

                    <div className="space-y-3">
                      <div
                        className={`border-2 rounded-lg p-4 cursor-pointer transition relative ${
                          paymentMethod === 'paypal' ? 'border-pink-500 bg-pink-50' : 'border-gray-300'
                        }`}
                        onClick={() => setPaymentMethod('paypal')}
                      >
                        <div className="flex items-center gap-3">
                          <input
                            type="radio"
                            name="payment"
                            value="paypal"
                            checked={paymentMethod === 'paypal'}
                            onChange={() => setPaymentMethod('paypal')}
                            className="w-4 h-4 text-pink-600"
                          />
                          <CreditCard className="w-6 h-6 text-gray-700" />
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              <h3 className="font-semibold">Carte bancaire via PayPal</h3>
                              {isCasablanca && (
                                <span className="flex items-center gap-1 bg-green-100 text-green-700 text-xs px-2 py-1 rounded-full">
                                  <Star className="w-3 h-3" />
                                  Recommandé
                                </span>
                              )}
                            </div>
                            <p className="text-sm text-gray-600">
                              Paiement sécurisé par carte bancaire
                            </p>
                          </div>
                        </div>
                      </div>

                      {isCasablanca && (
                        <div
                          className={`border-2 rounded-lg p-4 cursor-pointer transition ${
                            paymentMethod === 'cash' ? 'border-pink-500 bg-pink-50' : 'border-gray-300'
                          }`}
                          onClick={() => setPaymentMethod('cash')}
                        >
                          <div className="flex items-center gap-3">
                            <input
                              type="radio"
                              name="payment"
                              value="cash"
                              checked={paymentMethod === 'cash'}
                              onChange={() => setPaymentMethod('cash')}
                              className="w-4 h-4 text-pink-600"
                            />
                            <Truck className="w-6 h-6 text-gray-700" />
                            <div className="flex-1">
                              <h3 className="font-semibold">Paiement à la livraison</h3>
                              <p className="text-sm text-gray-600">Disponible uniquement à Casablanca</p>
                            </div>
                          </div>
                        </div>
                      )}

                      {!isCasablanca && (
                        <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                          <p className="text-sm text-blue-800">
                            Pour les livraisons hors Casablanca, le paiement par carte bancaire est obligatoire.
                          </p>
                        </div>
                      )}
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-pink-600 text-white py-3 rounded-lg font-semibold hover:bg-pink-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? 'Traitement...' : 'Confirmer la commande'}
                  </button>
                </form>
              </div>

              <div className="lg:col-span-1">
                <div className="bg-white rounded-lg shadow p-6 sticky top-6">
                  <h2 className="text-xl font-semibold mb-4">Résumé de la commande</h2>

                  <div className="space-y-3 mb-4">
                    {items.map((item) => (
                      <div key={item.id} className="flex gap-3">
                        <img
                          src={item.image_url}
                          alt={item.name}
                          className="w-16 h-16 object-cover rounded"
                        />
                        <div className="flex-1">
                          <p className="text-sm font-medium">{item.name}</p>
                          <p className="text-sm text-gray-600">Qté: {item.quantity}</p>
                          <p className="text-sm font-semibold">{item.price * item.quantity} MAD</p>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="border-t pt-4 space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Sous-total</span>
                      <span className="font-semibold">{totalPrice} MAD</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Livraison</span>
                      <span className="font-semibold text-green-600">Gratuite</span>
                    </div>
                    <div className="flex justify-between text-lg font-bold border-t pt-2">
                      <span>Total</span>
                      <span>{totalPrice} MAD</span>
                    </div>
                  </div>

                  <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                    <p className="text-sm text-blue-800">
                      <strong>Livraison à {shippingInfo.city}:</strong><br />
                      {isCasablanca ? '24h' : '24h-48h'}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};
