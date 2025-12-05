import { Link } from "react-router-dom";
import { ArrowRight, TrendingUp, Coins } from "lucide-react";
import { Button } from "@/components/ui/button";
import { products } from "@/data/mockData";
import { useCart } from "@/contexts/CartContext";
import { cn } from "../../lib/utils";
import { toast } from "sonner";

export function TrendingProducts() {
  const trendingProducts = products.filter((p) => p.trending).slice(0, 5);
  const { addToCart } = useCart();

  const handleAddToCart = (product) => {
    addToCart(product);
    toast.success(`${product.name} added to cart`);
  };

  return (
    <section className="py-12">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-lg bg-accent/10 flex items-center justify-center">
            <TrendingUp className="h-5 w-5 text-accent" />
          </div>
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold">Trending Now</h2>
            <p className="text-muted-foreground text-sm">Most popular rewards this month</p>
          </div>
        </div>

        <Button variant="ghost" asChild className="hidden sm:flex gap-2">
          <Link to="/products">
            View All <ArrowRight className="h-4 w-4" />
          </Link>
        </Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
        {trendingProducts.map((product, index) => (
          <Link
            key={product.id}
            to={`/products/${product.id}`}
            className={cn(
              "group relative bg-card rounded-xl border border-border/50 overflow-hidden",
              "transition-all duration-300 hover:shadow-xl hover:-translate-y-2 hover:border-primary/20",
              "animate-slide-up opacity-0",
              `stagger-${Math.min(index + 1, 5)}`
            )}
            style={{ animationFillMode: "forwards" }}
          >
            {/* Trending Badge */}
            <div className="absolute top-3 left-3 z-10 px-2 py-1 rounded-full bg-accent text-accent-foreground text-xs font-semibold">
              Trending
            </div>

            {/* Image */}
            <div className="relative aspect-square overflow-hidden bg-secondary/30">
              <img
                src={product.image}
                alt={product.name}
                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>

            {/* Content */}
            <div className="p-4">
              <p className="text-xs text-muted-foreground mb-1">{product.brand}</p>
              <h3 className="font-semibold mb-2 line-clamp-2 group-hover:text-primary transition-colors">
                {product.name}
              </h3>
              <p className="text-xs text-muted-foreground mb-3 line-clamp-2">
                {product.description}
              </p>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5 text-points font-bold">
                  <Coins className="h-4 w-4" />
                  {product.points.toLocaleString()}
                </div>

                <Button
                  size="sm"
                  variant="secondary"
                  className="opacity-0 group-hover:opacity-100 transition-opacity"
                  onClick={(e) => {
                    e.preventDefault();
                    handleAddToCart(product);
                  }}
                >
                  Add
                </Button>
              </div>
            </div>
          </Link>
        ))}
      </div>

      <div className="mt-6 text-center sm:hidden">
        <Button variant="outline" asChild>
          <Link to="/products">View All Products</Link>
        </Button>
      </div>
    </section>
  );
}
