import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';

export const ProductDetail = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <h1 className="text-2xl font-bold">Détails du produit</h1>
        </div>
      </main>
      <Footer />
    </div>
  );
};
