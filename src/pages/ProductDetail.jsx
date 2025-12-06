import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Coins, ShoppingCart, Heart, Share2, Check, AlertCircle } from 'lucide-react';
import { Header } from '../components/layout/Header';
import { Footer } from '../components/layout/Footer';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { products, currentEmployee, categories } from '../data/mockData';
import { useCart } from '../contexts/CartContext';
import { toast } from 'sonner';

const ProductDetail = () => {
  const { id } = useParams();
  const { addToCart } = useCart();

  const product = products.find((p) => p.id === id);

  if (!product) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 container py-8 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">Product Not Found</h1>
            <Button asChild>
              <Link to="/products">Browse Products</Link>
            </Button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const canAfford = currentEmployee.points >= product.points;
  const category = categories.find((c) => c.slug === product.category);

  const handleAddToCart = () => {
    addToCart(product);
    toast.success(`${product.name} added to cart`);
  };

  const handleRedeemNow = () => {
    if (!canAfford) {
      toast.error('Insufficient points for this product');
      return;
    }
    addToCart(product);
    toast.success('Added to cart! Proceed to checkout to complete redemption.');
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 container py-8">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm mb-8">
          <Link to="/" className="text-muted-foreground hover:text-foreground">Home</Link>
          <span className="text-muted-foreground">/</span>
          <Link to="/products" className="text-muted-foreground hover:text-foreground">Products</Link>

          {category && (
            <>
              <span className="text-muted-foreground">/</span>
              <Link to={`/products?category=${category.slug}`} className="text-muted-foreground hover:text-foreground">
                {category.name}
              </Link>
            </>
          )}

          <span className="text-muted-foreground">/</span>
          <span className="text-foreground font-medium truncate">{product.name}</span>
        </nav>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Product Image */}
          <div className="relative">
            <div className="aspect-square rounded-2xl overflow-hidden bg-secondary/30">
              <img src={product.image} alt={product.name} className="h-full w-full object-cover" />
            </div>

            {product.trending && (
              <Badge className="absolute top-4 left-4 bg-accent text-accent-foreground">
                Trending
              </Badge>
            )}
          </div>

          {/* Product Info */}
          <div className="flex flex-col">
            <div className="mb-2">
              <span className="text-sm text-muted-foreground uppercase tracking-wide">
                {product.brand}
              </span>
            </div>

            <h1 className="text-3xl lg:text-4xl font-bold mb-4">{product.name}</h1>

            <p className="text-muted-foreground text-lg mb-6">{product.description}</p>

            {/* Points */}
            <div className="flex items-center gap-4 mb-6">
              <div className="flex items-center gap-2 text-3xl font-bold text-points">
                <Coins className="h-8 w-8" />
                {product.points.toLocaleString()}
                <span className="text-base font-normal text-muted-foreground">points</span>
              </div>
            </div>

            {/* Affordability */}
            <div
              className={`flex items-center gap-2 p-4 rounded-lg mb-6 ${
                canAfford ? 'bg-points/10 text-points' : 'bg-destructive/10 text-destructive'
              }`}
            >
              {canAfford ? (
                <>
                  <Check className="h-5 w-5" />
                  <span>You have enough points to redeem this item!</span>
                </>
              ) : (
                <>
                  <AlertCircle className="h-5 w-5" />
                  <span>You need {(product.points - currentEmployee.points).toLocaleString()} more points</span>
                </>
              )}
            </div>

            {/* Stock */}
            <p className="text-sm text-muted-foreground mb-6">
              {product.stock > 10 ? (
                <span className="text-points">In Stock</span>
              ) : product.stock > 0 ? (
                <span className="text-accent">Only {product.stock} left</span>
              ) : (
                <span className="text-destructive">Out of Stock</span>
              )}
            </p>

            {/* Buttons */}
            {/* <div className="flex flex-col sm:flex-row gap-4 mb-8">
              <Button size="lg" className="flex-1 gap-2 max-sm:text-base" onClick={handleRedeemNow} disabled={!canAfford || product.stock === 0}>
                <Coins className="h-5 w-5" />
                Redeem Now
              </Button>

              <Button size="lg" variant="outline" className="flex-1 gap-2 max-sm:text-base" onClick={handleAddToCart} disabled={product.stock === 0}>
                <ShoppingCart className="h-5 w-5" />
                Add to Cart
              </Button>
            </div> */}

            <div className="flex flex-col sm:flex-row gap-4 mb-8">
  <Button
    size="lg"
    className="flex-1 gap-2 
               max-sm:h-14 
               max-sm:text-base 
               max-sm:leading-[2.5rem]"
    onClick={handleRedeemNow}
    disabled={!canAfford || product.stock === 0}
  >
    <Coins className="h-5 w-5" />
    Redeem Now
  </Button>

  <Button
    size="lg"
    variant="outline"
    className="flex-1 gap-2 
               max-sm:h-14 
               max-sm:text-base 
               max-sm:leading-[2.5rem]"
    onClick={handleAddToCart}
    disabled={product.stock === 0}
  >
    <ShoppingCart className="h-5 w-5" />
    Add to Cart
  </Button>
</div>


            {/* Secondary Actions */}
            <div className="flex items-center gap-4 pt-6 border-t border-border">
              <Button variant="ghost" size="sm" className="gap-2">
                <Heart className="h-4 w-4" />
                Save
              </Button>
              <Button variant="ghost" size="sm" className="gap-2">
                <Share2 className="h-4 w-4" />
                Share
              </Button>
            </div>

            {/* Additional Info */}
            <div className="mt-8 space-y-4">
              <div className="flex items-start gap-3">
                <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                  <Check className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h4 className="font-medium">Instant Delivery</h4>
                  <p className="text-sm text-muted-foreground">Digital items delivered instantly to your email</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                  <Check className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h4 className="font-medium">Corporate Verified</h4>
                  <p className="text-sm text-muted-foreground">All rewards verified and authorized by your company</p>
                </div>
              </div>
            </div>

          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default ProductDetail;
