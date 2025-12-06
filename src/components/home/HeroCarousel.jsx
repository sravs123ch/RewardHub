import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight, ArrowRight } from "lucide-react";
import { Button } from "../ui/button";
import { carouselSlides } from "../../data/mockData";
import { cn } from "../../lib/utils";

// Import banner images
import heroBanner1 from "../../assets/banners/hero-banner-1.jpg";
import heroBanner2 from "../../assets/banners/hero-banner-2.jpg";
import heroBanner3 from "../../assets/banners/hero-banner-3.jpg";
import heroBanner4 from "../../assets/banners/hero-banner-4.jpg";
import heroBanner5 from "../../assets/banners/hero-banner-5.jpg";
import heroBanner6 from "../../assets/banners/hero-banner-6.jpg";
import heroBanner7 from "../../assets/banners/hero-banner-7.jpg";
const bannerImages = {
  "/banners/hero-banner-1.jpg": heroBanner1,
  "/banners/hero-banner-2.jpg": heroBanner2,
  "/banners/hero-banner-3.jpg": heroBanner3,
  "/banners/hero-banner-4.jpg": heroBanner4,
  "/banners/hero-banner-5.jpg": heroBanner5,
  "/banners/hero-banner-6.jpg": heroBanner6,
  "/banners/hero-banner-7.jpg": heroBanner7,
};

export function HeroCarousel() {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % carouselSlides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const goToSlide = (index) => setCurrentSlide(index);
  const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % carouselSlides.length);
  const prevSlide = () =>
    setCurrentSlide((prev) => (prev - 1 + carouselSlides.length) % carouselSlides.length);

  return (
    <section className="relative overflow-hidden rounded-2xl mx-4 lg:mx-0">
      <div className="relative h-[320px] sm:h-[400px] lg:h-[480px]">
        {carouselSlides.map((slide, index) => (
          <div
            key={slide.id}
            className={cn(
              "absolute inset-0 transition-all duration-700 ease-out",
              index === currentSlide
                ? "opacity-100 translate-x-0"
                : index < currentSlide
                ? "opacity-0 -translate-x-full"
                : "opacity-0 translate-x-full"
            )}
          >
            {/* Background Image */}
            <div className="absolute inset-0">
              <img
                src={bannerImages[slide.image] || slide.image}
                alt={slide.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-transparent" />
            </div>

            {/* Content */}
            <div className="relative z-10 h-full flex items-center px-8 sm:px-12 lg:px-16">
              <div className="max-w-2xl">
                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4 leading-tight drop-shadow-lg">
                  {slide.title}
                </h1>
                <p className="text-lg sm:text-xl text-white/90 mb-8 drop-shadow-md">
                  {slide.subtitle}
                </p>
                <Button
                  size="lg"
                  className="group gap-2 font-semibold bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg"
                >
                  {slide.cta}
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Navigation Arrows */}
      <button
        onClick={prevSlide}
        className="absolute left-4 top-1/2 -translate-y-1/2 h-10 w-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center text-white hover:bg-white/30 transition-colors"
      >
        <ChevronLeft className="h-5 w-5" />
      </button>

      <button
        onClick={nextSlide}
        className="absolute right-4 top-1/2 -translate-y-1/2 h-10 w-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center text-white hover:bg-white/30 transition-colors"
      >
        <ChevronRight className="h-5 w-5" />
      </button>

      {/* Dots */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
        {carouselSlides.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={cn(
              "h-2 rounded-full transition-all duration-300",
              index === currentSlide ? "w-8 bg-white" : "w-2 bg-white/40 hover:bg-white/60"
            )}
          />
        ))}
      </div>
    </section>
  );
}
