// import { Link } from "react-router-dom";
// import { Trash2, Plus, Minus, Coins, ShoppingBag, ArrowRight, AlertCircle } from "lucide-react";
// import { Header } from "../components/layout/Header";
// import { Footer } from "../components/layout/Footer";
// import { Button } from "../components/ui/button";
// import { useCart } from "../contexts/CartContext";
// import { currentEmployee } from "../data/mockData";
// import { toast } from "sonner";

// const Cart = () => {
//   const { items, removeFromCart, updateQuantity, clearCart, totalPoints } = useCart();
//   const canAfford = currentEmployee.points >= totalPoints;
//   const remainingPoints = currentEmployee.points - totalPoints;

//   const handleCheckout = () => {
//     if (!canAfford) {
//       toast.error("Insufficient points for this order");
//       return;
//     }
//     toast.success("Order placed successfully! Check your email for confirmation.");
//     clearCart();
//   };

//   if (items.length === 0) {
//     return (
//       <div className="min-h-screen flex flex-col">
//         <Header />
//         <main className="flex-1 container py-16 flex flex-col items-center justify-center text-center">
//           <div className="h-20 w-20 rounded-full bg-secondary/50 flex items-center justify-center mb-6">
//             <ShoppingBag className="h-10 w-10 text-muted-foreground" />
//           </div>
//           <h1 className="text-2xl font-bold mb-2">Your cart is empty</h1>
//           <p className="text-muted-foreground mb-8">
//             Start exploring rewards and add items to your cart
//           </p>
//           <Button asChild size="lg">
//             <Link to="/products">
//               Browse Products
//               <ArrowRight className="ml-2 h-4 w-4" />
//             </Link>
//           </Button>
//         </main>
//         <Footer />
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen flex flex-col">
//       <Header />
//       <main className="flex-1 container py-8">
//         <h1 className="text-3xl font-bold mb-8">Shopping Cart</h1>

//         <div className="grid lg:grid-cols-3 gap-8">
//           {/* Cart Items */}
//           <div className="lg:col-span-2 space-y-4">
//             {items.map(({ product, quantity }) => (
//               <div
//                 key={product.id}
//                 className="flex gap-4 p-4 bg-card rounded-xl border border-border/50"
//               >
//                 <Link to={`/products/${product.id}`} className="shrink-0">
//                   <img
//                     src={product.image}
//                     alt={product.name}
//                     className="h-24 w-24 rounded-lg object-cover"
//                   />
//                 </Link>

//                 <div className="flex-1 min-w-0">
//                   <Link
//                     to={`/products/${product.id}`}
//                     className="font-semibold hover:text-primary transition-colors line-clamp-1"
//                   >
//                     {product.name}
//                   </Link>
//                   <p className="text-sm text-muted-foreground mb-2">{product.brand}</p>
//                   <div className="flex items-center gap-1.5 text-points font-semibold">
//                     <Coins className="h-4 w-4" />
//                     {product.points.toLocaleString()} pts
//                   </div>
//                 </div>

//                 <div className="flex flex-col items-end gap-2">
//                   <Button
//                     variant="ghost"
//                     size="icon"
//                     className="h-8 w-8 text-muted-foreground hover:text-destructive"
//                     onClick={() => removeFromCart(product.id)}
//                   >
//                     <Trash2 className="h-4 w-4" />
//                   </Button>

//                   <div className="flex items-center gap-2 border border-border rounded-lg">
//                     <Button
//                       variant="ghost"
//                       size="icon"
//                       className="h-8 w-8"
//                       onClick={() => updateQuantity(product.id, quantity - 1)}
//                     >
//                       <Minus className="h-4 w-4" />
//                     </Button>

//                     <span className="w-8 text-center font-medium">{quantity}</span>

//                     <Button
//                       variant="ghost"
//                       size="icon"
//                       className="h-8 w-8"
//                       onClick={() => updateQuantity(product.id, quantity + 1)}
//                     >
//                       <Plus className="h-4 w-4" />
//                     </Button>
//                   </div>
//                 </div>
//               </div>
//             ))}

//             <Button variant="ghost" className="text-muted-foreground" onClick={clearCart}>
//               Clear Cart
//             </Button>
//           </div>

//           {/* Order Summary */}
//           <div className="lg:col-span-1">
//             <div className="bg-card rounded-xl border border-border/50 p-6 sticky top-24">
//               <h2 className="text-xl font-semibold mb-6">Order Summary</h2>

//               <div className="space-y-4 mb-6">
//                 <div className="flex justify-between text-sm">
//                   <span className="text-muted-foreground">
//                     Items ({items.length})
//                   </span>
//                   <span>{totalPoints.toLocaleString()} pts</span>
//                 </div>

//                 <div className="flex justify-between font-semibold text-lg pt-4 border-t border-border">
//                   <span>Total</span>
//                   <div className="flex items-center gap-1.5 text-points">
//                     <Coins className="h-5 w-5" />
//                     {totalPoints.toLocaleString()}
//                   </div>
//                 </div>
//               </div>

//               {/* Points Balance */}
//               <div
//                 className={`p-4 rounded-lg mb-6 ${
//                   canAfford ? "bg-points/10 text-points" : "bg-destructive/10 text-destructive"
//                 }`}
//               >
//                 <div className="flex items-center gap-2 mb-2">
//                   {canAfford ? (
//                     <Coins className="h-5 w-5" />
//                   ) : (
//                     <AlertCircle className="h-5 w-5" />
//                   )}

//                   <span className="font-medium">
//                     {canAfford ? "Points Available" : "Insufficient Points"}
//                   </span>
//                 </div>

//                 <div className="text-sm">
//                   <p>Your balance: {currentEmployee.points.toLocaleString()} pts</p>

//                   {canAfford ? (
//                     <p>After purchase: {remainingPoints.toLocaleString()} pts</p>
//                   ) : (
//                     <p>Need {Math.abs(remainingPoints).toLocaleString()} more pts</p>
//                   )}
//                 </div>
//               </div>

//               <Button
//                 className="w-full gap-2"
//                 size="lg"
//                 onClick={handleCheckout}
//                 disabled={!canAfford}
//               >
//                 <Coins className="h-5 w-5" />
//                 Complete Redemption
//               </Button>

//               <p className="text-xs text-center text-muted-foreground mt-4">
//                 Points will be deducted from your account upon confirmation
//               </p>
//             </div>
//           </div>
//         </div>
//       </main>

//       <Footer />
//     </div>
//   );
// };

// export default Cart;


import { Link } from "react-router-dom";
import { Trash2, Plus, Minus, Coins, ShoppingBag, ArrowRight, AlertCircle } from "lucide-react";
import { Header } from "../components/layout/Header";
import { Footer } from "../components/layout/Footer";
import { Button } from "../components/ui/button";
import { useCart } from "../contexts/CartContext";
import { toast } from "sonner";
import { useEffect, useState } from "react";

const Cart = () => {
  const { items, removeFromCart, updateQuantity, clearCart, totalPoints } = useCart();
  
  // State for user points from localStorage
  const [userPoints, setUserPoints] = useState(0);
  const [userName, setUserName] = useState("");
  
  // Get user data from localStorage on component mount
  useEffect(() => {
    const storedPoints = localStorage.getItem("userPoints");
    const storedName = localStorage.getItem("userName");
    
    if (storedPoints) {
      setUserPoints(parseInt(storedPoints, 10) || 0);
    }
    
    if (storedName) {
      setUserName(storedName);
    }
  }, []);

  const canAfford = userPoints >= totalPoints;
  const remainingPoints = userPoints - totalPoints;

  const handleCheckout = () => {
    if (!canAfford) {
      toast.error("Insufficient points for this order");
      return;
    }
    
    // Update points in localStorage after successful purchase
    const newPoints = remainingPoints;
    localStorage.setItem("userPoints", newPoints.toString());
    setUserPoints(newPoints);
    
    toast.success("Order placed successfully! Check your email for confirmation.");
    clearCart();
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 container py-16 flex flex-col items-center justify-center text-center">
          <div className="h-20 w-20 rounded-full bg-secondary/50 flex items-center justify-center mb-6">
            <ShoppingBag className="h-10 w-10 text-muted-foreground" />
          </div>
          <h1 className="text-2xl font-bold mb-2">Your cart is empty</h1>
          <p className="text-muted-foreground mb-8">
            Start exploring rewards and add items to your cart
          </p>
          <Button asChild size="lg">
            <Link to="/products">
              Browse Products
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 container py-8">
        <h1 className="text-3xl font-bold mb-8">Shopping Cart</h1>
        
        {/* Welcome message for logged-in user */}
        {userName && (
          <div className="mb-6 p-4 bg-primary/10 rounded-lg border border-primary/20">
            <p className="text-primary font-medium">
              Welcome back, {userName}! You have{" "}
              <span className="font-bold">{userPoints.toLocaleString()}</span> points available.
            </p>
          </div>
        )}

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {items.map(({ product, quantity }) => (
              <div
                key={product.id}
                className="flex gap-4 p-4 bg-card rounded-xl border border-border/50"
              >
                <Link to={`/products/${product.id}`} className="shrink-0">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="h-24 w-24 rounded-lg object-cover"
                  />
                </Link>

                <div className="flex-1 min-w-0">
                  <Link
                    to={`/products/${product.id}`}
                    className="font-semibold hover:text-primary transition-colors line-clamp-1"
                  >
                    {product.name}
                  </Link>
                  <p className="text-sm text-muted-foreground mb-2">{product.brand}</p>
                  <div className="flex items-center gap-1.5 text-points font-semibold">
                    <Coins className="h-4 w-4" />
                    {product.points.toLocaleString()} pts
                  </div>
                </div>

                <div className="flex flex-col items-end gap-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-muted-foreground hover:text-destructive"
                    onClick={() => removeFromCart(product.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>

                  <div className="flex items-center gap-2 border border-border rounded-lg">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => updateQuantity(product.id, quantity - 1)}
                    >
                      <Minus className="h-4 w-4" />
                    </Button>

                    <span className="w-8 text-center font-medium">{quantity}</span>

                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => updateQuantity(product.id, quantity + 1)}
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}

            <Button variant="ghost" className="text-muted-foreground" onClick={clearCart}>
              Clear Cart
            </Button>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-card rounded-xl border border-border/50 p-6 sticky top-24">
              <h2 className="text-xl font-semibold mb-6">Order Summary</h2>

              <div className="space-y-4 mb-6">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">
                    Items ({items.length})
                  </span>
                  <span>{totalPoints.toLocaleString()} pts</span>
                </div>

                <div className="flex justify-between font-semibold text-lg pt-4 border-t border-border">
                  <span>Total</span>
                  <div className="flex items-center gap-1.5 text-points">
                    <Coins className="h-5 w-5" />
                    {totalPoints.toLocaleString()} pts
                  </div>
                </div>
              </div>

              {/* Points Balance */}
              <div
                className={`p-4 rounded-lg mb-6 ${
                  canAfford ? "bg-points/10 text-points" : "bg-destructive/10 text-destructive"
                }`}
              >
                <div className="flex items-center gap-2 mb-2">
                  {canAfford ? (
                    <Coins className="h-5 w-5" />
                  ) : (
                    <AlertCircle className="h-5 w-5" />
                  )}

                  <span className="font-medium">
                    {canAfford ? "Points Available" : "Insufficient Points"}
                  </span>
                </div>

                <div className="text-sm">
                  <p>Your balance: {userPoints.toLocaleString()} pts</p>

                  {canAfford ? (
                    <p>After purchase: {remainingPoints.toLocaleString()} pts</p>
                  ) : (
                    <p>Need {Math.abs(remainingPoints).toLocaleString()} more pts</p>
                  )}
                </div>
              </div>

              <Button
                className="w-full gap-2"
                size="lg"
                onClick={handleCheckout}
                disabled={!canAfford}
              >
                <Coins className="h-5 w-5" />
                Complete Redemption
              </Button>

              <p className="text-xs text-center text-muted-foreground mt-4">
                Points will be deducted from your account upon confirmation
              </p>
              
              {/* Not logged in warning */}
              {!userName && (
                <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <p className="text-sm text-yellow-700 text-center">
                    Please <Link to="/login" className="font-semibold underline">login</Link> to use your points
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Cart;