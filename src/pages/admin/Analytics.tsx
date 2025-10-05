import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Users, Eye, ShoppingCart, TrendingUp } from 'lucide-react';

interface AnalyticsStats {
  sessions: number;
  pageViews: number;
  conversions: number;
  revenue: number;
  conversionRate: number;
}

interface ChartData {
  date: string;
  sessions: number;
  pageViews: number;
  conversions: number;
}

export const AdminAnalytics = () => {
  const [stats, setStats] = useState<AnalyticsStats>({
    sessions: 0,
    pageViews: 0,
    conversions: 0,
    revenue: 0,
    conversionRate: 0,
  });
  const [chartData, setChartData] = useState<ChartData[]>([]);
  const [loading, setLoading] = useState(true);
  const [period, setPeriod] = useState<'7days' | '30days' | '90days'>('7days');

  useEffect(() => {
    loadAnalytics();
  }, [period]);

  const loadAnalytics = async () => {
    setLoading(true);

    const days = period === '7days' ? 7 : period === '30days' ? 30 : 90;
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    const { data: sessions } = await supabase
      .from('analytics_sessions')
      .select('*')
      .gte('started_at', startDate.toISOString());

    const { data: pageViews } = await supabase
      .from('analytics_page_views')
      .select('*')
      .gte('viewed_at', startDate.toISOString());

    const { data: conversions } = await supabase
      .from('analytics_conversions')
      .select('*')
      .gte('converted_at', startDate.toISOString());

    const totalSessions = sessions?.length || 0;
    const totalPageViews = pageViews?.length || 0;
    const totalConversions = conversions?.length || 0;
    const totalRevenue = conversions?.reduce((sum, c) => sum + Number(c.revenue), 0) || 0;
    const conversionRate = totalSessions > 0 ? (totalConversions / totalSessions) * 100 : 0;

    setStats({
      sessions: totalSessions,
      pageViews: totalPageViews,
      conversions: totalConversions,
      revenue: totalRevenue,
      conversionRate,
    });

    const dailyData: { [key: string]: ChartData } = {};
    for (let i = days - 1; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];
      dailyData[dateStr] = {
        date: dateStr,
        sessions: 0,
        pageViews: 0,
        conversions: 0,
      };
    }

    sessions?.forEach(session => {
      const date = new Date(session.started_at).toISOString().split('T')[0];
      if (dailyData[date]) {
        dailyData[date].sessions++;
      }
    });

    pageViews?.forEach(view => {
      const date = new Date(view.viewed_at).toISOString().split('T')[0];
      if (dailyData[date]) {
        dailyData[date].pageViews++;
      }
    });

    conversions?.forEach(conversion => {
      const date = new Date(conversion.converted_at).toISOString().split('T')[0];
      if (dailyData[date]) {
        dailyData[date].conversions++;
      }
    });

    setChartData(Object.values(dailyData));
    setLoading(false);
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
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Analytics</h1>
        <div className="flex gap-2">
          <button
            onClick={() => setPeriod('7days')}
            className={`px-4 py-2 rounded-lg ${
              period === '7days'
                ? 'bg-pink-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            7 jours
          </button>
          <button
            onClick={() => setPeriod('30days')}
            className={`px-4 py-2 rounded-lg ${
              period === '30days'
                ? 'bg-pink-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            30 jours
          </button>
          <button
            onClick={() => setPeriod('90days')}
            className={`px-4 py-2 rounded-lg ${
              period === '90days'
                ? 'bg-pink-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            90 jours
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-gray-600 text-sm font-medium">Sessions</h3>
            <Users className="w-5 h-5 text-blue-500" />
          </div>
          <p className="text-3xl font-bold">{stats.sessions}</p>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-gray-600 text-sm font-medium">Vues de pages</h3>
            <Eye className="w-5 h-5 text-green-500" />
          </div>
          <p className="text-3xl font-bold">{stats.pageViews}</p>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-gray-600 text-sm font-medium">Commandes</h3>
            <ShoppingCart className="w-5 h-5 text-orange-500" />
          </div>
          <p className="text-3xl font-bold">{stats.conversions}</p>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-gray-600 text-sm font-medium">Revenu</h3>
            <TrendingUp className="w-5 h-5 text-pink-500" />
          </div>
          <p className="text-3xl font-bold">{stats.revenue.toFixed(2)} MAD</p>
          <p className="text-sm text-gray-500 mt-1">
            Taux de conversion: {stats.conversionRate.toFixed(1)}%
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold mb-4">Sessions & Vues de pages</h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="sessions" stroke="#3b82f6" name="Sessions" />
              <Line type="monotone" dataKey="pageViews" stroke="#10b981" name="Vues" />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold mb-4">Conversions par jour</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="conversions" fill="#ec4899" name="Commandes" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};
