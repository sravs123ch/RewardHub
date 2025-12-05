import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Search, ShoppingCart, User, Menu, X, Coins, Heart } from "lucide-react";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Badge } from "../../components/ui/badge";
import { useCart } from "../../contexts/CartContext";
import { useWishlist } from "../../contexts/WishlistContext";
import { currentEmployee, products, categories } from "../../data/mockData";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../../components/ui/dropdown-menu";
import { Sheet, SheetContent, SheetTrigger } from "../../components/ui/sheet";

export function Header() {
  const [searchQuery, setSearchQuery] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const { itemCount } = useCart();
  const { itemCount: wishlistCount } = useWishlist();
  const navigate = useNavigate();

  const suggestions =
    searchQuery.length > 1
      ? [
          ...products
            .filter((p) => p.name.toLowerCase().includes(searchQuery.toLowerCase()))
            .slice(0, 3),
          ...categories
            .filter((c) => c.name.toLowerCase().includes(searchQuery.toLowerCase()))
            .slice(0, 2),
        ]
      : [];

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchQuery)}`);
      setShowSuggestions(false);
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between gap-4">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 shrink-0">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <Coins className="h-5 w-5" />
          </div>
          <span className="hidden font-bold text-lg sm:inline-block">RewardHub</span>
        </Link>

        {/* Search Bar - Desktop */}
        <form onSubmit={handleSearch} className="hidden md:flex flex-1 max-w-xl relative">
          <div className="relative w-full">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search products, categories, brands..."
              className="pl-10 pr-4 h-10 bg-secondary/50 border-0 focus-visible:ring-1"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setShowSuggestions(true);
              }}
              onFocus={() => setShowSuggestions(true)}
              onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
            />
          </div>

          {/* Autocomplete Suggestions */}
          {showSuggestions && suggestions.length > 0 && (
            <div className="absolute top-full left-0 right-0 mt-1 bg-card border border-border rounded-lg shadow-lg overflow-hidden z-50 animate-in">
              {suggestions.map((item, index) => (
                <button
                  key={`${"name" in item ? "product" : "category"}-${index}`}
                  type="button"
                  className="w-full px-4 py-2 text-left hover:bg-secondary/50 flex items-center gap-3 transition-colors"
                  onClick={() => {
                    if ("points" in item) {
                      navigate(`/products/${item.id}`);
                    } else {
                      navigate(`/products?category=${item.slug}`);
                    }
                    setShowSuggestions(false);
                    setSearchQuery("");
                  }}
                >
                  {"points" in item ? (
                    <>
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-8 h-8 rounded object-cover"
                      />
                      <div>
                        <p className="text-sm font-medium">{item.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {item.points.toLocaleString()} pts
                        </p>
                      </div>
                    </>
                  ) : (
                    <div>
                      <p className="text-sm font-medium">{item.name}</p>
                      <p className="text-xs text-muted-foreground">Category</p>
                    </div>
                  )}
                </button>
              ))}
            </div>
          )}
        </form>

        {/* Right Section */}
        <div className="flex items-center gap-2">
          {/* Points Badge */}
          <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-points/10 text-points">
            <Coins className="h-4 w-4" />
            <span className="font-semibold text-sm">
              {currentEmployee.points.toLocaleString()}
            </span>
          </div>

          {/* Wishlist */}
          <Button variant="ghost" size="icon" className="relative" asChild>
            <Link to="/wishlist">
              <Heart className="h-5 w-5" />
              {wishlistCount > 0 && (
                <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs bg-red-500 text-white">
                  {wishlistCount}
                </Badge>
              )}
            </Link>
          </Button>

          {/* Cart */}
          <Button variant="ghost" size="icon" className="relative" asChild>
            <Link to="/cart">
              <ShoppingCart className="h-5 w-5" />
              {itemCount > 0 && (
                <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs bg-accent text-accent-foreground">
                  {itemCount}
                </Badge>
              )}
            </Link>
          </Button>

          {/* User Menu - Desktop */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="hidden sm:flex">
                <img
                  src={currentEmployee.avatar}
                  alt={currentEmployee.name}
                  className="h-8 w-8 rounded-full object-cover"
                />
              </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent align="end" className="w-56">
              <div className="px-2 py-1.5">
                <p className="text-sm font-medium">{currentEmployee.name}</p>
                <p className="text-xs text-muted-foreground">{currentEmployee.email}</p>
              </div>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link to="/profile">Profile</Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link to="/wishlist">My Wishlist</Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link to="/orders">Order History</Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>Sign Out</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Mobile Menu */}
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="sm:hidden">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>

            <SheetContent side="right" className="w-80">
              <div className="flex flex-col gap-6 mt-6">
                {/* Mobile Search */}
                <form onSubmit={handleSearch}>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      type="search"
                      placeholder="Search..."
                      className="pl-10"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                </form>

                {/* User Info */}
                <div className="flex items-center gap-3 p-3 rounded-lg bg-secondary/50">
                  <img
                    src={currentEmployee.avatar}
                    alt={currentEmployee.name}
                    className="h-10 w-10 rounded-full object-cover"
                  />
                  <div>
                    <p className="font-medium">{currentEmployee.name}</p>
                    <div className="flex items-center gap-1 text-points">
                      <Coins className="h-3 w-3" />
                      <span className="text-sm font-semibold">
                        {currentEmployee.points.toLocaleString()} pts
                      </span>
                    </div>
                  </div>
                </div>

                {/* Navigation */}
                <nav className="flex flex-col gap-1">
                  <Link to="/" className="px-3 py-2 rounded-lg hover:bg-secondary/50 transition-colors">
                    Home
                  </Link>
                  <Link to="/products" className="px-3 py-2 rounded-lg hover:bg-secondary/50 transition-colors">
                    All Products
                  </Link>
                  <Link
                    to="/wishlist"
                    className="px-3 py-2 rounded-lg hover:bg-secondary/50 transition-colors flex items-center justify-between"
                  >
                    My Wishlist
                    {wishlistCount > 0 && <Badge variant="secondary">{wishlistCount}</Badge>}
                  </Link>
                  <Link to="/profile" className="px-3 py-2 rounded-lg hover:bg-secondary/50 transition-colors">
                    Profile
                  </Link>
                  <Link to="/orders" className="px-3 py-2 rounded-lg hover:bg-secondary/50 transition-colors">
                    Order History
                  </Link>
                </nav>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
