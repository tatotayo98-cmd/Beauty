import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AuthProvider, useAuth } from './lib/auth';
import { useEffect } from 'react';
import { initSession, trackPageView } from './lib/analytics';
import { Home } from './pages/Home';
import { Shop } from './pages/Shop';
import { ProductDetail } from './pages/ProductDetail';
import { Cart } from './pages/Cart';
import { Checkout } from './pages/Checkout';
import { Login } from './pages/Login';
import { Register } from './pages/Register';
import { OrderTracking } from './pages/OrderTracking';
import AdminLogin from './pages/admin/AdminLogin';
import { AdminLayout } from './pages/admin/AdminLayout';
import { AdminDashboard } from './pages/admin/Dashboard';
import { AdminProducts } from './pages/admin/Products';
import { AdminProductForm } from './pages/admin/ProductForm';
import { AdminOrders } from './pages/admin/Orders';
import { AdminCustomers } from './pages/admin/Customers';
import { AdminDiscounts } from './pages/admin/Discounts';
import { AdminBanners } from './pages/admin/Banners';
import { AdminSettings } from './pages/admin/Settings';
import { AdminAnalytics } from './pages/admin/Analytics';
import { AdminAbandonedCarts } from './pages/admin/AbandonedCarts';
import { AdminMarketing } from './pages/admin/Marketing';
import { AdminCampaigns } from './pages/admin/Campaigns';
import { AdminAttribution } from './pages/admin/Attribution';
import { AdminInventory } from './pages/admin/Inventory';

function AnalyticsTracker() {
  const location = useLocation();

  useEffect(() => {
    initSession();
  }, []);

  useEffect(() => {
    trackPageView(location.pathname);
  }, [location]);

  return null;
}

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAdmin, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-pink-500 border-t-transparent"></div>
      </div>
    );
  }

  if (!isAdmin) {
    return <Navigate to="/admin/login" replace />;
  }

  return <>{children}</>;
};

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <AnalyticsTracker />
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/shop" element={<Shop />} />
          <Route path="/product/:slug" element={<ProductDetail />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/track-order" element={<OrderTracking />} />

          {/* Admin Routes */}
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route
            path="/admin"
            element={
              <ProtectedRoute>
                <AdminLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<AdminDashboard />} />
            <Route path="products" element={<AdminProducts />} />
            <Route path="products/new" element={<AdminProductForm />} />
            <Route path="products/:id/edit" element={<AdminProductForm />} />
            <Route path="orders" element={<AdminOrders />} />
            <Route path="orders/abandoned" element={<AdminAbandonedCarts />} />
            <Route path="customers" element={<AdminCustomers />} />
            <Route path="discounts" element={<AdminDiscounts />} />
            <Route path="banners" element={<AdminBanners />} />
            <Route path="analytics" element={<AdminAnalytics />} />
            <Route path="marketing" element={<AdminMarketing />} />
            <Route path="marketing/campaigns" element={<AdminCampaigns />} />
            <Route path="marketing/attribution" element={<AdminAttribution />} />
            <Route path="inventory" element={<AdminInventory />} />
            <Route path="settings" element={<AdminSettings />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
