import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { TrendingUp, Users, ShoppingCart, Eye } from 'lucide-react';

interface MarketingStats {
  sessions: number;
  attributedSales: number;
  attributedOrders: number;
  conversionRate: number;
}

interface ChannelData {
  channel: string;
  visits: number;
  revenue: number;
  orders: number;
  conversionRate: number;
}

export const AdminMarketing = () => {
  const [stats, setStats] = useState<MarketingStats>({
    sessions: 0,
    attributedSales: 0,
    attributedOrders: 0,
    conversionRate: 0,
  });
  const [channels, setChannels] = useState<ChannelData[]>([]);
  const [loading, setLoading] = useState(true);
  const [period, setPeriod] = useState<'7days' | '30days' | '90days'>('30days');
  const [chartData, setChartData] = useState<any[]>([]);

  useEffect(() => {
    loadMarketingData();
  }, [period]);

  const loadMarketingData = async () => {
    setLoading(true);

    const days = period === '7days' ? 7 : period === '30days' ? 30 : 90;
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    const { data: sessions } = await supabase
      .from('analytics_sessions')
      .select('*')
      .gte('started_at', startDate.toISOString());

    const { data: conversions } = await supabase
      .from('analytics_conversions')
      .select('*')
      .gte('converted_at', startDate.toISOString());

    const totalSessions = sessions?.length || 0;
    const totalOrders = conversions?.length || 0;
    const totalRevenue = conversions?.reduce((sum, c) => sum + Number(c.revenue), 0) || 0;
    const conversionRate = totalSessions > 0 ? (totalOrders / totalSessions) * 100 : 0;

    setStats({
      sessions: totalSessions,
      attributedSales: totalRevenue,
      attributedOrders: totalOrders,
      conversionRate,
    });

    const channelMap: { [key: string]: ChannelData } = {
      Direct: { channel: 'Direct', visits: 0, revenue: 0, orders: 0, conversionRate: 0 },
    };

    sessions?.forEach(session => {
      const channel = session.referrer ? 'Référé' : 'Direct';
      if (!channelMap[channel]) {
        channelMap[channel] = { channel, visits: 0, revenue: 0, orders: 0, conversionRate: 0 };
      }
      channelMap[channel].visits++;
    });

    conversions?.forEach(conversion => {
      const channel = 'Direct';
      if (channelMap[channel]) {
        channelMap[channel].orders++;
        channelMap[channel].revenue += Number(conversion.revenue);
      }
    });

    Object.values(channelMap).forEach(channel => {
      if (channel.visits > 0) {
        channel.conversionRate = (channel.orders / channel.visits) * 100;
      }
    });

    setChannels(Object.values(channelMap));

    const dailyData: { [key: string]: any } = {};
    for (let i = days - 1; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];
      dailyData[dateStr] = {
        date: dateStr,
        visits: 0,
      };
    }

    sessions?.forEach(session => {
      const date = new Date(session.started_at).toISOString().split('T')[0];
      if (dailyData[date]) {
        dailyData[date].visits++;
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
        <h1 className="text-2xl font-bold">Marketing</h1>
        <div className="flex gap-2">
          <button
            onClick={() => setPeriod('7days')}
            className={`px-4 py-2 rounded-lg ${
              period === '7days'
                ? 'bg-pink-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            7 derniers jours
          </button>
          <button
            onClick={() => setPeriod('30days')}
            className={`px-4 py-2 rounded-lg ${
              period === '30days'
                ? 'bg-pink-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            30 derniers jours
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-gray-600 text-sm font-medium">Sessions</h3>
            <Eye className="w-5 h-5 text-blue-500" />
          </div>
          <p className="text-3xl font-bold">{stats.sessions}</p>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-gray-600 text-sm font-medium">Ventes attribuées au Marketing</h3>
            <TrendingUp className="w-5 h-5 text-green-500" />
          </div>
          <p className="text-3xl font-bold">{stats.attributedSales.toFixed(2)} MAD</p>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-gray-600 text-sm font-medium">Commandes attribuées au Marketing</h3>
            <ShoppingCart className="w-5 h-5 text-orange-500" />
          </div>
          <p className="text-3xl font-bold">{stats.attributedOrders}</p>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-gray-600 text-sm font-medium">Taux de conversion</h3>
            <Users className="w-5 h-5 text-pink-500" />
          </div>
          <p className="text-3xl font-bold">{stats.conversionRate.toFixed(1)}%</p>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <h2 className="text-lg font-semibold mb-4">Visites des 5 principaux canaux au fil du temps</h2>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="visits" stroke="#3b82f6" name="Direct" />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="bg-white rounded-lg shadow">
        <div className="p-6 border-b">
          <h2 className="text-lg font-semibold">Principaux canaux de marketing</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Canal
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Type
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Visites
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Revenus
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Commandes
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Taux de conversion
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {channels.map((channel) => (
                <tr key={channel.channel} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="w-8 h-8 rounded bg-gray-100 flex items-center justify-center mr-3">
                        <TrendingUp className="w-4 h-4 text-gray-600" />
                      </div>
                      <span className="text-sm font-medium text-gray-900">{channel.channel}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    direct
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {channel.visits}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {channel.revenue.toFixed(2)} MAD
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {channel.orders}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {channel.conversionRate.toFixed(1)} %
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
