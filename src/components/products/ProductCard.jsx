import { Link } from "react-router-dom";
import { Coins, ShoppingCart, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCart } from "@/contexts/CartContext";
import { useWishlist } from "@/contexts/WishlistContext";
import { toast } from "sonner";
import { cn } from "../../lib/utils";

export function ProductCard({ product, className }) {
  const { addToCart } = useCart();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();

  const inWishlist = isInWishlist(product.id);

  const handleAddToCart = (e) => {
    e.preventDefault();
    addToCart(product);
    toast.success(`${product.name} added to cart`);
  };

  const handleToggleWishlist = (e) => {
    e.preventDefault();
    if (inWishlist) {
      removeFromWishlist(product.id);
      toast.success(`${product.name} removed from wishlist`);
    } else {
      addToWishlist(product);
      toast.success(`${product.name} added to wishlist`);
    }
  };

  return (
    <Link
      to={`/products/${product.id}`}
      className={cn(
        "group relative bg-card rounded-xl border border-border/50 overflow-hidden",
        "transition-all duration-300 hover:shadow-lg hover:-translate-y-1 hover:border-primary/20",
        className
      )}
    >
      {product.trending && (
        <div className="absolute top-3 left-3 z-10 px-2 py-1 rounded-full bg-accent text-accent-foreground text-xs font-semibold">
          Trending
        </div>
      )}

      {product.stock < 10 && (
        <div className="absolute top-3 right-12 z-10 px-2 py-1 rounded-full bg-destructive/10 text-destructive text-xs font-semibold">
          Low Stock
        </div>
      )}

      {/* Wishlist Button */}
      <button
        onClick={handleToggleWishlist}
        className={cn(
          "absolute top-3 right-3 z-10 p-2 rounded-full transition-all duration-200",
          "bg-background/80 backdrop-blur-sm hover:bg-background",
          inWishlist ? "text-red-500" : "text-muted-foreground hover:text-red-500"
        )}
      >
        <Heart className={cn("h-4 w-4", inWishlist && "fill-current")} />
      </button>

      <div className="relative aspect-square overflow-hidden bg-secondary/30">
        <img
          src={product.image}
          alt={product.name}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
      </div>

      <div className="p-4">
        <p className="text-xs text-muted-foreground mb-1 uppercase tracking-wide">
          {product.brand}
        </p>
        <h3 className="font-semibold mb-2 line-clamp-2 group-hover:text-primary transition-colors">
          {product.name}
        </h3>
        <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
          {product.description}
        </p>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-points font-bold">
            <Coins className="h-4 w-4" />
            <span>{product.points.toLocaleString()}</span>
            <span className="text-xs font-normal text-muted-foreground">pts</span>
          </div>

          <Button size="sm" onClick={handleAddToCart} className="gap-1.5">
            <ShoppingCart className="h-4 w-4" /> Add
          </Button>
        </div>
      </div>
    </Link>
  );
}
