import { Link } from 'react-router-dom';
import { Facebook, Instagram, Mail, Phone } from 'lucide-react';

export const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-xl font-bold mb-4">Beauty&Home.ma</h3>
            <p className="text-gray-400 text-sm">
              Votre destination beauté et maison au Maroc. Livraison gratuite partout au pays.
            </p>
            <div className="flex gap-4 mt-4">
              <a href="#" className="text-gray-400 hover:text-white transition">
                <Facebook className="w-5 h-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition">
                <Instagram className="w-5 h-5" />
              </a>
            </div>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Boutique</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li><Link to="/shop?category=beaute" className="hover:text-white transition">Beauté & Maquillage</Link></li>
              <li><Link to="/shop?category=maison" className="hover:text-white transition">Maison & Salle de bain</Link></li>
              <li><Link to="/shop?category=bien-etre" className="hover:text-white transition">Bien-être & Ambiance</Link></li>
              <li><Link to="/shop?featured=true" className="hover:text-white transition">Nouveautés</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Informations</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li><Link to="/about" className="hover:text-white transition">À propos</Link></li>
              <li><Link to="/track-order" className="hover:text-white transition">Suivi de commande</Link></li>
              <li><Link to="/faq" className="hover:text-white transition">FAQ</Link></li>
              <li><Link to="/cgv" className="hover:text-white transition">CGV</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Contact</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li className="flex items-center gap-2">
                <Phone className="w-4 h-4" />
                <span>+212 6XX XX XX XX</span>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="w-4 h-4" />
                <span>contact@beautyhome.ma</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-sm text-gray-400">
          <p>&copy; {new Date().getFullYear()} Beauty&Home.ma - Tous droits réservés</p>
        </div>
      </div>
    </footer>
  );
};
