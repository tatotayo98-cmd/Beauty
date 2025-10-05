import { LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export const AdminInventory = () => {

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">Analyses de données</h1>
          <div className="flex items-center gap-4 mt-2 text-sm text-gray-600">
            <span>Aujourd'hui</span>
            <span>•</span>
            <span>{new Date().toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
            <span>•</span>
            <span>MAD</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-gray-600 text-sm font-medium mb-2">Ventes brutes</h3>
          <p className="text-3xl font-bold">0 MAD</p>
          <div className="mt-2 text-sm text-gray-500">
            <span className="text-blue-500">—</span>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-gray-600 text-sm font-medium mb-2">Taux de clients récurrents</h3>
          <p className="text-3xl font-bold">0 %</p>
          <div className="mt-2 text-sm text-gray-500">
            <span className="text-blue-500">—</span>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-gray-600 text-sm font-medium mb-2">Commandes traitées</h3>
          <p className="text-3xl font-bold">0</p>
          <div className="mt-2 text-sm text-gray-500">
            <span className="text-blue-500">—</span>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-gray-600 text-sm font-medium mb-2">Commandes</h3>
          <p className="text-3xl font-bold">0</p>
          <div className="mt-2 text-sm text-gray-500">
            <span className="text-blue-500">—</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold mb-4">Ventes totales dans le temps</h3>
          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={[{ date: '00 h', value: 0 }, { date: '04 h', value: 0 }, { date: '08 h', value: 0 }, { date: '12 h', value: 0 }, { date: '16 h', value: 0 }, { date: '20 h', value: 0 }]}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="date" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip />
                <Line type="monotone" dataKey="value" stroke="#3b82f6" strokeDasharray="5 5" dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
          <p className="text-3xl font-bold mt-4">0 MAD <span className="text-gray-400 text-sm">—</span></p>
          <p className="text-sm text-gray-500">10 MAD</p>
          <div className="mt-2 flex items-center gap-2 text-xs">
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 rounded-full bg-blue-500"></div>
              <span>5 oct. 2025</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 rounded-full bg-blue-300"></div>
              <span>4 oct. 2025</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold mb-4">Répartition des ventes totales</h3>
          <div className="space-y-3">
            {[
              { label: 'Ventes brutes', value: '0,00 MAD' },
              { label: 'Réductions', value: '0,00 MAD' },
              { label: 'Retours', value: '0,00 MAD' },
              { label: 'Ventes nettes', value: '0,00 MAD' },
              { label: 'Frais d\'expédition', value: '0,00 MAD' },
              { label: 'Frais de retour', value: '0,00 MAD' },
              { label: 'Taxes', value: '0,00 MAD' },
            ].map((item, index) => (
              <div key={index} className="flex justify-between items-center">
                <span className="text-sm text-blue-600">{item.label}</span>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-semibold">{item.value}</span>
                  <span className="text-gray-400">—</span>
                </div>
              </div>
            ))}
            <div className="flex justify-between items-center border-t pt-3">
              <span className="text-sm text-blue-600 font-semibold">Ventes totales</span>
              <div className="flex items-center gap-2">
                <span className="text-sm font-semibold">0,00 MAD</span>
                <span className="text-gray-400">—</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-sm font-semibold mb-4">Ventes totales par canal de vente</h3>
          <div className="flex items-center justify-center h-32">
            <p className="text-gray-400 text-sm text-center">Aucune donnée trouvée pour cette plage de dates</p>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-sm font-semibold mb-4">Historique de la valeur moyenne des commandes</h3>
          <div className="h-32">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={[{ date: '00 h', value: 0 }, { date: '12 h', value: 0 }]}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="date" tick={{ fontSize: 10 }} />
                <YAxis tick={{ fontSize: 10 }} />
                <Line type="monotone" dataKey="value" stroke="#3b82f6" strokeDasharray="5 5" dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
          <p className="text-2xl font-bold mt-2">0 MAD <span className="text-gray-400 text-sm">—</span></p>
          <p className="text-xs text-gray-500">10 MAD</p>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-sm font-semibold mb-4">Ventes totales par produit</h3>
          <div className="flex items-center justify-center h-32">
            <p className="text-gray-400 text-sm text-center">Aucune donnée trouvée pour cette plage de dates</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-sm font-semibold mb-4">Historique des visites</h3>
          <div className="h-32">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={[{ date: '00 h', value: 1 }, { date: '12 h', value: 15 }]}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="date" tick={{ fontSize: 10 }} />
                <YAxis tick={{ fontSize: 10 }} />
                <Line type="monotone" dataKey="value" stroke="#06b6d4" />
              </LineChart>
            </ResponsiveContainer>
          </div>
          <p className="text-2xl font-bold mt-2">1 <span className="text-gray-400 text-sm">—</span></p>
          <p className="text-xs text-gray-500">15</p>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-sm font-semibold mb-4">Taux de conversion dans le temps</h3>
          <div className="h-32">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={[{ date: '00 h', value: 0 }, { date: '12 h', value: 0 }]}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="date" tick={{ fontSize: 10 }} />
                <YAxis tick={{ fontSize: 10 }} />
                <Line type="monotone" dataKey="value" stroke="#3b82f6" strokeDasharray="5 5" dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
          <p className="text-2xl font-bold mt-2">0 % <span className="text-gray-400 text-sm">—</span></p>
          <p className="text-xs text-gray-500">100 %</p>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-sm font-semibold mb-4">Ventilation du taux de conversion</h3>
          <div className="mt-2">
            <div className="grid grid-cols-4 gap-1 text-xs text-gray-600 mb-2">
              <div>Visites</div>
              <div>Ajou...</div>
              <div>Étape...</div>
              <div>Payé</div>
            </div>
            <div className="grid grid-cols-4 gap-1 text-xs font-semibold mb-1">
              <div>100%<br/>1</div>
              <div>0%<br/>0</div>
              <div>0%<br/>0</div>
              <div>0%<br/>0</div>
            </div>
            <div className="grid grid-cols-4 gap-1 text-xs text-gray-500 mb-3">
              <div>↓ 0 %</div>
              <div>↓ 0 %</div>
              <div>↓ 0 %</div>
              <div>↓ 0 %</div>
            </div>
            <div className="relative h-20">
              <div className="absolute bottom-0 left-0 w-1/4 bg-blue-600 rounded-t" style={{ height: '100%' }}></div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-sm font-semibold mb-4">Visites par type d'appareil</h3>
          <div className="flex flex-col items-center justify-center h-40">
            <div className="relative w-32 h-32">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={[{ name: 'Bureau', value: 1 }]}
                    cx="50%"
                    cy="50%"
                    innerRadius={40}
                    outerRadius={60}
                    fill="#06b6d4"
                    dataKey="value"
                  >
                    <Cell fill="#06b6d4" />
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <p className="text-2xl font-bold">1</p>
                  <p className="text-xs text-gray-500">—</p>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2 text-xs mt-3">
              <div className="w-2 h-2 rounded-full bg-blue-400"></div>
              <span>Bureau</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-sm font-semibold mb-4">Visites par emplacement</h3>
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <div className="w-1 h-6 bg-blue-600 rounded"></div>
              <span className="text-xs flex-1">United States · Iowa · Council Bluffs</span>
              <span className="text-xs font-semibold">1</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-1 h-16 bg-blue-300 rounded"></div>
              <span className="text-xs flex-1">Morocco · Casablanca-Settat · Casa...</span>
              <span className="text-xs font-semibold">21</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-sm font-semibold mb-4">Ventes totales par référent social</h3>
          <div className="flex items-center justify-center h-32">
            <p className="text-gray-400 text-sm text-center">Aucune donnée trouvée pour cette plage de dates</p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <h3 className="text-sm font-semibold mb-4">Analyse des cohortes de clients</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">Cohorte</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">Clients</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">Taux de rét...</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">Mois 0</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              <tr>
                <td className="px-4 py-2 text-xs">Toutes les cohortes</td>
                <td className="px-4 py-2 text-xs">0</td>
                <td className="px-4 py-2 text-xs">0,0 %</td>
                <td className="px-4 py-2 text-xs">0,0 %</td>
              </tr>
              <tr>
                <td className="px-4 py-2 text-xs">oct. 2024</td>
                <td className="px-4 py-2 text-xs">0</td>
                <td className="px-4 py-2 text-xs">0,0 %</td>
                <td className="px-4 py-2 text-xs">0,0 %</td>
              </tr>
              <tr>
                <td className="px-4 py-2 text-xs">nov. 2024</td>
                <td className="px-4 py-2 text-xs">0</td>
                <td className="px-4 py-2 text-xs">0,0 %</td>
                <td className="px-4 py-2 text-xs">0,0 %</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-sm font-semibold mb-4">Visites par page de destination</h3>
        <div className="text-center py-8">
          <p className="text-gray-400 text-sm">Aucune donnée disponible</p>
        </div>
      </div>
    </div>
  );
};
