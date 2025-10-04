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
} from 'lucide-react';

export const AdminLayout = () => {
  const { signOut } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut();
    navigate('/admin/login');
  };

  const navigation = [
    { name: 'Dashboard', href: '/admin', icon: LayoutDashboard },
    { name: 'Produits', href: '/admin/products', icon: Package },
    { name: 'Commandes', href: '/admin/orders', icon: ShoppingCart },
    { name: 'Clients', href: '/admin/customers', icon: Users },
    { name: 'Remises', href: '/admin/discounts', icon: Tag },
    { name: 'Bannières', href: '/admin/banners', icon: Image },
    { name: 'Paramètres', href: '/admin/settings', icon: Settings },
  ];

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
            {navigation.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`flex items-center gap-3 px-3 py-2 rounded-lg transition ${
                    isActive(item.href)
                      ? 'bg-primary-50 text-primary-600 font-medium'
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  {item.name}
                </Link>
              );
            })}

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
