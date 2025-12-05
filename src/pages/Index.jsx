import { Header } from '../components/layout/Header';
import { Footer } from '../components/layout/Footer';
import { HeroCarousel } from '../components/home/HeroCarousel';
import { CategoryGrid } from '../components/home/CategoryGrid';
import { TrendingProducts } from '../components/home/TrendingProducts';

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1">
        <div className="container py-6 lg:py-8">
          <HeroCarousel />
          <CategoryGrid />
          <TrendingProducts />
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Index;
