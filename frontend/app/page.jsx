"use client";
import { useState, useContext } from "react";
import { ShopContext } from "../contexts/ShopContext";
import Hero from "../components/Hero";
import BannerCarousel from "../components/BannerCarousel";
import BestsellerSection from "../components/BestsellerSection";
import CategoryNav from "../components/CategoryNav";
import MenuPreview from "../components/MenuPreview";
import RestaurantStory from "../components/RestaurantStory";
import NewsLetter from "../components/NewsLetter";

export default function Home() {
  const [activeCategory, setActiveCategory] = useState("All");
  const { banners } = useContext(ShopContext);

  const handleSelectCategory = (catName) => {
    setActiveCategory(catName);
    const element = document.getElementById("homepage-menu-preview");
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  const activeBanners = Array.isArray(banners) ? banners.filter((b) => b.isActive !== false) : [];

  return (
    <div className="min-h-screen bg-[#FAF8F5]">
      <Hero onSelectCategory={handleSelectCategory} />

      {/* Prominent Promotional Banners Section */}
      {activeBanners.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <span className="text-[11px] font-bold uppercase tracking-widest text-[#C85A17]">
                Limited Time Promotions
              </span>
              <h2 className="font-heading text-xl sm:text-2xl font-extrabold text-[#11261B]">
                Special Offers
              </h2>
            </div>
            <a
              href="/orderanddine?filter=offer"
              className="text-xs font-bold text-[#1B3B2B] hover:text-[#C85A17] uppercase tracking-wider transition-colors"
            >
              View All Offers →
            </a>
          </div>

          <BannerCarousel banners={activeBanners} />
        </section>
      )}

      <BestsellerSection />

      <CategoryNav activeCategory={activeCategory} setActiveCategory={setActiveCategory} />

      {/* Secondary promotional strip near menu section if multiple banners exist */}
      {activeBanners.length > 1 && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4 pb-2">
          <BannerCarousel banners={activeBanners.slice(1)} className="shadow-2xs" />
        </div>
      )}

      <MenuPreview selectedCategory={activeCategory} />
      <RestaurantStory />
      <NewsLetter />
    </div>
  );
}
