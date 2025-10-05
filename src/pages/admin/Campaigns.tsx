import { Mail, MessageSquare, Image } from 'lucide-react';

export const AdminCampaigns = () => {
  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Campagnes</h1>
      </div>

      <div className="bg-white rounded-lg shadow p-8 text-center mb-6">
        <div className="w-24 h-24 mx-auto mb-4 bg-blue-100 rounded-full flex items-center justify-center">
          <Mail className="w-12 h-12 text-blue-600" />
        </div>
        <h2 className="text-xl font-bold mb-3">Centralisez le suivi de vos campagnes</h2>
        <p className="text-gray-600 text-sm mb-4 max-w-2xl mx-auto">
          Créez des campagnes de marketing pour évaluer comment les initiatives marketing contribuent
          aux objectifs commerciaux. Capturez les points de contact en ligne et hors ligne, ajoutez
          des activités de campagne provenant de plusieurs canaux de marketing et suivez les résultats.
        </p>
      </div>

      <div className="bg-white rounded-lg shadow p-8">
        <h3 className="text-lg font-semibold mb-4">Générez du trafic avec des apps de marketing</h3>
        <p className="text-gray-600 mb-6">
          Développez votre audience sur les réseaux sociaux, capturez de nouveaux clients potentiels
          grâce aux inscriptions à la newsletter, augmentez la conversion avec le chat, et plus encore.
        </p>

        <div className="grid md:grid-cols-3 gap-4">
          <div className="border rounded-lg p-6 hover:border-pink-500 transition cursor-pointer">
            <div className="w-12 h-12 bg-pink-100 rounded-lg flex items-center justify-center mb-4">
              <Mail className="w-6 h-6 text-pink-600" />
            </div>
            <h4 className="font-semibold mb-2">Email Marketing</h4>
            <p className="text-sm text-gray-600">
              Créez et envoyez des campagnes email personnalisées
            </p>
          </div>

          <div className="border rounded-lg p-6 hover:border-pink-500 transition cursor-pointer">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
              <MessageSquare className="w-6 h-6 text-blue-600" />
            </div>
            <h4 className="font-semibold mb-2">SMS Marketing</h4>
            <p className="text-sm text-gray-600">
              Envoyez des messages SMS promotionnels à vos clients
            </p>
          </div>

          <div className="border rounded-lg p-6 hover:border-pink-500 transition cursor-pointer">
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
              <Image className="w-6 h-6 text-purple-600" />
            </div>
            <h4 className="font-semibold mb-2">Réseaux sociaux</h4>
            <p className="text-sm text-gray-600">
              Gérez vos publications sur les réseaux sociaux
            </p>
          </div>
        </div>
      </div>

    </div>
  );
};
