import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';
import { supabase } from '../lib/supabase';
import { Sparkles, Truck, CreditCard, Headphones as HeadphonesIcon } from 'lucide-react';

export const Home = () => {
  const [featuredProducts, setFeaturedProducts] = useState<any[]>([]);
  const [banners, setBanners] = useState<any[]>([]);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    const { data: products } = await supabase
      .from('products')
      .select('*')
      .eq('is_featured', true)
      .eq('is_active', true)
      .limit(8);

    const { data: bannerData } = await supabase
      .from('banners')
      .select('*')
      .eq('is_active', true)
      .order('display_order');

    if (products) setFeaturedProducts(products);
    if (bannerData) setBanners(bannerData);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-grow">
        {banners.length > 0 && (
          <div className="relative h-96 bg-gradient-to-r from-primary-500 to-primary-600">
            <div className="absolute inset-0 flex items-center justify-center text-white">
              <div className="text-center">
                <h1 className="text-5xl font-bold mb-4">Beauty&Home.ma</h1>
                <p className="text-xl mb-8">Livraison gratuite partout au Maroc</p>
                <Link
                  to="/shop"
                  className="inline-block bg-white text-primary-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition"
                >
                  Découvrir la boutique
                </Link>
              </div>
            </div>
          </div>
        )}

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-16">
            <div className="text-center">
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Truck className="w-8 h-8 text-primary-600" />
              </div>
              <h3 className="font-semibold mb-2">Livraison gratuite</h3>
              <p className="text-sm text-gray-600">Partout au Maroc</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CreditCard className="w-8 h-8 text-primary-600" />
              </div>
              <h3 className="font-semibold mb-2">Paiement sécurisé</h3>
              <p className="text-sm text-gray-600">CB, PayPal, COD</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Sparkles className="w-8 h-8 text-primary-600" />
              </div>
              <h3 className="font-semibold mb-2">Produits tendance</h3>
              <p className="text-sm text-gray-600">Nouveautés régulières</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <HeadphonesIcon className="w-8 h-8 text-primary-600" />
              </div>
              <h3 className="font-semibold mb-2">Support client</h3>
              <p className="text-sm text-gray-600">7j/7 disponible</p>
            </div>
          </div>

          <section className="mb-16">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-3xl font-bold">Produits vedettes</h2>
              <Link to="/shop" className="text-primary-600 hover:text-primary-700 font-semibold">
                Voir tout →
              </Link>
            </div>

            {featuredProducts.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-500">Aucun produit vedette pour le moment</p>
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                {featuredProducts.map((product) => (
                  <Link
                    key={product.id}
                    to={`/product/${product.slug}`}
                    className="group"
                  >
                    <div className="aspect-square bg-gray-100 rounded-lg mb-3 overflow-hidden">
                      {product.images && product.images.length > 0 ? (
                        <img
                          src={product.images[0]}
                          alt={product.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-400">
                          Pas d'image
                        </div>
                      )}
                    </div>
                    <h3 className="font-medium mb-1 group-hover:text-primary-600 transition">
                      {product.title}
                    </h3>
                    <div className="flex items-center gap-2">
                      <span className="text-lg font-bold text-primary-600">
                        {product.base_price} MAD
                      </span>
                      {product.compare_price && product.compare_price > product.base_price && (
                        <span className="text-sm text-gray-400 line-through">
                          {product.compare_price} MAD
                        </span>
                      )}
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </section>

          <section className="bg-gradient-to-r from-primary-50 to-primary-100 rounded-2xl p-12 text-center">
            <h2 className="text-3xl font-bold mb-4">Rejoignez notre communauté</h2>
            <p className="text-gray-700 mb-6 max-w-2xl mx-auto">
              Recevez -10 DH sur votre première commande et restez informé de nos offres exclusives
            </p>
            <div className="flex gap-2 max-w-md mx-auto">
              <input
                type="email"
                placeholder="Votre email"
                className="flex-1 px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
              <button className="bg-primary-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-primary-700 transition">
                S'inscrire
              </button>
            </div>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
};
