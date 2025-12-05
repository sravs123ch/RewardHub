import { Link } from "react-router-dom";
import { Package, Truck, CheckCircle2, Clock, Coins, ChevronRight } from "lucide-react";
import { Header } from "../components/layout/Header";
import { Footer } from "../components/layout/Footer";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import { products } from "../data/mockData";

const mockOrders = [
  {
    id: "ORD-001",
    date: "2024-01-15",
    status: "delivered",
    items: [{ productId: "1", quantity: 1, points: 2500 }],
    totalPoints: 2500,
  },
  {
    id: "ORD-002",
    date: "2024-01-10",
    status: "shipped",
    items: [
      { productId: "2", quantity: 2, points: 2000 },
      { productId: "3", quantity: 1, points: 150 },
    ],
    totalPoints: 2150,
  },
  {
    id: "ORD-003",
    date: "2024-01-05",
    status: "processing",
    items: [{ productId: "4", quantity: 1, points: 1800 }],
    totalPoints: 1800,
  },
];

const statusConfig = {
  pending: { label: "Pending", icon: Clock, color: "bg-muted text-muted-foreground" },
  processing: { label: "Processing", icon: Package, color: "bg-primary/10 text-primary" },
  shipped: { label: "Shipped", icon: Truck, color: "bg-accent/10 text-accent" },
  delivered: { label: "Delivered", icon: CheckCircle2, color: "bg-points/10 text-points" },
};

const Orders = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 container py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">Order History</h1>
            <p className="text-muted-foreground">Track your redemptions and deliveries</p>
          </div>
          <Button asChild>
            <Link to="/products">Continue Shopping</Link>
          </Button>
        </div>

        {mockOrders.length > 0 ? (
          <div className="space-y-4">
            {mockOrders.map((order) => {
              const status = statusConfig[order.status]; // ← FIXED
              const StatusIcon = status.icon;

              return (
                <div
                  key={order.id}
                  className="bg-card rounded-xl border border-border/50 overflow-hidden"
                >
                  {/* Order Header */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 sm:p-6 border-b border-border/50 bg-secondary/30">
                    <div className="flex flex-wrap items-center gap-4">
                      <div>
                        <p className="text-sm text-muted-foreground">Order ID</p>
                        <p className="font-semibold">{order.id}</p>
                      </div>
                      <div className="hidden sm:block h-8 w-px bg-border" />
                      <div>
                        <p className="text-sm text-muted-foreground">Date</p>
                        <p className="font-medium">
                          {new Date(order.date).toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                          })}
                        </p>
                      </div>
                      <div className="hidden sm:block h-8 w-px bg-border" />
                      <div>
                        <p className="text-sm text-muted-foreground">Total</p>
                        <div className="flex items-center gap-1 font-semibold text-points">
                          <Coins className="h-4 w-4" />
                          {order.totalPoints.toLocaleString()}
                        </div>
                      </div>
                    </div>

                    <Badge className={status.color}>
                      <StatusIcon className="h-3 w-3 mr-1.5" />
                      {status.label}
                    </Badge>
                  </div>

                  {/* Order Items */}
                  <div className="p-4 sm:p-6">
                    <div className="space-y-4">
                      {order.items.map((item, index) => {
                        const product = products.find((p) => p.id === item.productId);
                        if (!product) return null;

                        return (
                          <div key={index} className="flex items-center gap-4">
                            <Link to={`/products/${product.id}`}>
                              <img
                                src={product.image}
                                alt={product.name}
                                className="h-16 w-16 rounded-lg object-cover"
                              />
                            </Link>

                            <div className="flex-1 min-w-0">
                              <Link
                                to={`/products/${product.id}`}
                                className="font-medium hover:text-primary transition-colors line-clamp-1"
                              >
                                {product.name}
                              </Link>
                              <p className="text-sm text-muted-foreground">
                                Qty: {item.quantity}
                              </p>
                            </div>

                            <div className="flex items-center gap-1 text-sm font-medium">
                              <Coins className="h-4 w-4 text-points" />
                              {item.points.toLocaleString()}
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    {/* Order Actions */}
                    <div className="flex items-center justify-end mt-6 pt-4 border-t border-border/50">
                      <Button variant="ghost" size="sm" className="gap-1">
                        View Details
                        <ChevronRight className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-16">
            <div className="h-20 w-20 rounded-full bg-secondary/50 flex items-center justify-center mx-auto mb-6">
              <Package className="h-10 w-10 text-muted-foreground" />
            </div>
            <h2 className="text-2xl font-bold mb-2">No orders yet</h2>
            <p className="text-muted-foreground mb-8">
              Start redeeming your points for amazing rewards
            </p>
            <Button asChild size="lg">
              <Link to="/products">Browse Products</Link>
            </Button>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default Orders;
