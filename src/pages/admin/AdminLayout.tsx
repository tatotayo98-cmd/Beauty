import { useState } from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../lib/auth';
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Users,
  Tag,
  Image,
  Settings,
  LogOut,
  BarChart3,
  TrendingUp,
  Boxes,
  ChevronDown,
  ChevronRight,
} from 'lucide-react';

export const AdminLayout = () => {
  const { signOut } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [expandedSections, setExpandedSections] = useState<{ [key: string]: boolean }>({
    orders: false,
    marketing: false,
  });

  const handleSignOut = async () => {
    await signOut();
    navigate('/admin/login');
  };

  const toggleSection = (section: string) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  const isActive = (href: string) => {
    if (href === '/admin') {
      return location.pathname === '/admin';
    }
    return location.pathname.startsWith(href);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex">
        <aside className="w-64 bg-white shadow-sm min-h-screen sticky top-0">
          <div className="p-6">
            <Link to="/" className="text-xl font-bold text-primary-600">
              Beauty&Home.ma
            </Link>
            <p className="text-sm text-gray-500 mt-1">Panneau Admin</p>
          </div>

          <nav className="px-3 space-y-1">
            <Link
              to="/admin"
              className={`flex items-center gap-3 px-3 py-2 rounded-lg transition ${
                isActive('/admin') && location.pathname === '/admin'
                  ? 'bg-primary-50 text-primary-600 font-medium'
                  : 'text-gray-700 hover:bg-gray-50'
              }`}
            >
              <LayoutDashboard className="w-5 h-5" />
              Dashboard
            </Link>

            <Link
              to="/admin/analytics"
              className={`flex items-center gap-3 px-3 py-2 rounded-lg transition ${
                isActive('/admin/analytics')
                  ? 'bg-primary-50 text-primary-600 font-medium'
                  : 'text-gray-700 hover:bg-gray-50'
              }`}
            >
              <BarChart3 className="w-5 h-5" />
              Analytics
            </Link>

            <Link
              to="/admin/products"
              className={`flex items-center gap-3 px-3 py-2 rounded-lg transition ${
                isActive('/admin/products')
                  ? 'bg-primary-50 text-primary-600 font-medium'
                  : 'text-gray-700 hover:bg-gray-50'
              }`}
            >
              <Package className="w-5 h-5" />
              Produits
            </Link>

            <Link
              to="/admin/inventory"
              className={`flex items-center gap-3 px-3 py-2 rounded-lg transition ${
                isActive('/admin/inventory')
                  ? 'bg-primary-50 text-primary-600 font-medium'
                  : 'text-gray-700 hover:bg-gray-50'
              }`}
            >
              <Boxes className="w-5 h-5" />
              Inventaire
            </Link>

            <div>
              <button
                onClick={() => toggleSection('orders')}
                className={`flex items-center justify-between w-full px-3 py-2 rounded-lg transition ${
                  isActive('/admin/orders')
                    ? 'bg-primary-50 text-primary-600 font-medium'
                    : 'text-gray-700 hover:bg-gray-50'
                }`}
              >
                <div className="flex items-center gap-3">
                  <ShoppingCart className="w-5 h-5" />
                  Commandes
                </div>
                {expandedSections.orders ? (
                  <ChevronDown className="w-4 h-4" />
                ) : (
                  <ChevronRight className="w-4 h-4" />
                )}
              </button>
              {expandedSections.orders && (
                <div className="ml-8 mt-1 space-y-1">
                  <Link
                    to="/admin/orders"
                    className={`block px-3 py-2 rounded-lg text-sm transition ${
                      location.pathname === '/admin/orders'
                        ? 'bg-primary-50 text-primary-600 font-medium'
                        : 'text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    Toutes les commandes
                  </Link>
                  <Link
                    to="/admin/orders/abandoned"
                    className={`block px-3 py-2 rounded-lg text-sm transition ${
                      location.pathname === '/admin/orders/abandoned'
                        ? 'bg-primary-50 text-primary-600 font-medium'
                        : 'text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    Paniers abandonnés
                  </Link>
                </div>
              )}
            </div>

            <Link
              to="/admin/customers"
              className={`flex items-center gap-3 px-3 py-2 rounded-lg transition ${
                isActive('/admin/customers')
                  ? 'bg-primary-50 text-primary-600 font-medium'
                  : 'text-gray-700 hover:bg-gray-50'
              }`}
            >
              <Users className="w-5 h-5" />
              Clients
            </Link>

            <div>
              <button
                onClick={() => toggleSection('marketing')}
                className={`flex items-center justify-between w-full px-3 py-2 rounded-lg transition ${
                  isActive('/admin/marketing')
                    ? 'bg-primary-50 text-primary-600 font-medium'
                    : 'text-gray-700 hover:bg-gray-50'
                }`}
              >
                <div className="flex items-center gap-3">
                  <TrendingUp className="w-5 h-5" />
                  Marketing
                </div>
                {expandedSections.marketing ? (
                  <ChevronDown className="w-4 h-4" />
                ) : (
                  <ChevronRight className="w-4 h-4" />
                )}
              </button>
              {expandedSections.marketing && (
                <div className="ml-8 mt-1 space-y-1">
                  <Link
                    to="/admin/marketing"
                    className={`block px-3 py-2 rounded-lg text-sm transition ${
                      location.pathname === '/admin/marketing'
                        ? 'bg-primary-50 text-primary-600 font-medium'
                        : 'text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    Vue d'ensemble
                  </Link>
                  <Link
                    to="/admin/marketing/campaigns"
                    className={`block px-3 py-2 rounded-lg text-sm transition ${
                      location.pathname === '/admin/marketing/campaigns'
                        ? 'bg-primary-50 text-primary-600 font-medium'
                        : 'text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    Campagnes de marketing
                  </Link>
                  <Link
                    to="/admin/marketing/attribution"
                    className={`block px-3 py-2 rounded-lg text-sm transition ${
                      location.pathname === '/admin/marketing/attribution'
                        ? 'bg-primary-50 text-primary-600 font-medium'
                        : 'text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    Attribution
                  </Link>
                </div>
              )}
            </div>

            <Link
              to="/admin/discounts"
              className={`flex items-center gap-3 px-3 py-2 rounded-lg transition ${
                isActive('/admin/discounts')
                  ? 'bg-primary-50 text-primary-600 font-medium'
                  : 'text-gray-700 hover:bg-gray-50'
              }`}
            >
              <Tag className="w-5 h-5" />
              Remises
            </Link>

            <Link
              to="/admin/banners"
              className={`flex items-center gap-3 px-3 py-2 rounded-lg transition ${
                isActive('/admin/banners')
                  ? 'bg-primary-50 text-primary-600 font-medium'
                  : 'text-gray-700 hover:bg-gray-50'
              }`}
            >
              <Image className="w-5 h-5" />
              Bannières
            </Link>

            <Link
              to="/admin/settings"
              className={`flex items-center gap-3 px-3 py-2 rounded-lg transition ${
                isActive('/admin/settings')
                  ? 'bg-primary-50 text-primary-600 font-medium'
                  : 'text-gray-700 hover:bg-gray-50'
              }`}
            >
              <Settings className="w-5 h-5" />
              Paramètres
            </Link>

            <button
              onClick={handleSignOut}
              className="flex items-center gap-3 px-3 py-2 rounded-lg text-gray-700 hover:bg-gray-50 transition w-full"
            >
              <LogOut className="w-5 h-5" />
              Déconnexion
            </button>
          </nav>
        </aside>

        <main className="flex-1 p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
};
