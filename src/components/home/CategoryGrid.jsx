import { Link } from "react-router-dom";
import { Laptop, Ticket, Gift, Heart, Plane, Shirt } from "lucide-react";
import { categories } from "@/data/mockData";
import { cn } from "../../lib/utils";

// Import category images
import electronicsImg from "@/assets/categories/electronics.jpg";
import couponsImg from "@/assets/categories/coupons.jpg";
import vouchersImg from "@/assets/categories/vouchers.jpg";
import lifestyleImg from "@/assets/categories/lifestyle.jpg";
import travelImg from "@/assets/categories/travel.jpg";
import fashionImg from "@/assets/categories/fashion.jpg";

// icon map (JSX version – removed TypeScript typing)
const iconMap = {
  Laptop,
  Ticket,
  Gift,
  Heart,
  Plane,
  Shirt,
};

const imageMap = {
  electronics: electronicsImg,
  coupons: couponsImg,
  vouchers: vouchersImg,
  lifestyle: lifestyleImg,
  travel: travelImg,
  fashion: fashionImg,
};

export function CategoryGrid() {
  return (
    <section className="py-12">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-2xl sm:text-3xl font-bold mb-2">Explore Categories</h2>
          <p className="text-muted-foreground">Find rewards that match your interests</p>
        </div>

        <Link
          to="/products"
          className="text-primary font-medium hover:underline hidden sm:block"
        >
          View All
        </Link>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
        {categories.map((category, index) => {
          const Icon = iconMap[category.icon] || Gift;
          const categoryImage = imageMap[category.slug];

          return (
            <Link
              key={category.id}
              to={`/products?category=${category.slug}`}
              className={cn(
                "group relative overflow-hidden rounded-xl aspect-[4/5]",
                "transition-all duration-500 hover:shadow-2xl hover:-translate-y-2",
                "animate-slide-up opacity-0",
                `stagger-${Math.min(index + 1, 5)}`
              )}
              style={{ animationFillMode: "forwards" }}
            >
              {/* Background Image */}
              <div className="absolute inset-0">
                <img
                  src={categoryImage}
                  alt={category.name}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
              </div>

              {/* Icon Badge */}
              <div className="absolute top-3 right-3 h-10 w-10 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center shadow-lg transition-all duration-300 group-hover:scale-110 group-hover:bg-primary">
                <Icon className="h-5 w-5 text-primary transition-colors group-hover:text-primary-foreground" />
              </div>

              {/* Content */}
              <div className="absolute bottom-0 left-0 right-0 p-4">
                <h3 className="font-bold text-white text-lg mb-1 drop-shadow-lg">
                  {category.name}
                </h3>

                <p className="text-white/80 text-sm drop-shadow-md">
                  {category.productCount} items
                </p>

                {/* Hover indicator */}
                <div className="mt-2 flex items-center gap-1 text-white/0 group-hover:text-white/90 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
                  <span className="text-xs font-medium">Browse</span>
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
