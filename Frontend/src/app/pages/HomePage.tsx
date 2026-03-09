import { useState, useEffect, useRef } from 'react';
import { Header } from '../components/Header';
import { Footer } from '../components/Footer';
import { FoodCard } from '../components/FoodCard';
import { useCart } from '../context/CartContext';
import { menuItems, categories } from '../data/menuData';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';

export const HomePage = () => {
  const { addToCart } = useCart();
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [highlightedItemId, setHighlightedItemId] = useState<string | null>(null);
  const itemRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});

  useEffect(() => {
    const handleCategorySelect = (event: CustomEvent) => {
      setSelectedCategory(event.detail);
      setHighlightedItemId(null);
    };

    const handleItemSelect = (event: CustomEvent) => {
      const { category, itemId } = event.detail;
      setSelectedCategory(category);
      setHighlightedItemId(itemId);

      setTimeout(() => {
        const itemElement = itemRefs.current[itemId];
        if (itemElement) {
          itemElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      }, 200);

      setTimeout(() => {
        setHighlightedItemId(null);
      }, 3000);
    };

    window.addEventListener('selectCategory', handleCategorySelect as EventListener);
    window.addEventListener('selectItem', handleItemSelect as EventListener);

    return () => {
      window.removeEventListener('selectCategory', handleCategorySelect as EventListener);
      window.removeEventListener('selectItem', handleItemSelect as EventListener);
    };
  }, []);

  const filteredItems =
    selectedCategory === 'All'
      ? menuItems
      : menuItems.filter((item) => item.category === selectedCategory);

  return (
    <div className="min-h-screen bg-[#0F0F0F] text-[#F5F5F5]">
      <Header />

      <main className="container mx-auto px-4 py-12">

        {/* Hero Section */}
        <div className="text-center mb-16 relative">

          {/* Animated Sparkle */}
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            className="absolute inset-0 flex items-center justify-center opacity-10"
          >
            <Sparkles className="w-64 h-64 text-[#C9A227]" />
          </motion.div>

          <div className="relative">

            {/* Animated Title */}
            <motion.h1
              initial={{ opacity: 0, y: -60 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            className="text-5xl md:text-7xl font-bold mb-4 tracking-tight text-[#C9A227]">
              Welcome to The Coffee Nest
            </motion.h1>

            <div className="w-32 h-[2px] bg-gradient-to-r from-transparent via-[#C9A227] to-transparent mx-auto mb-6" />

            {/* Animated Description */}
            <motion.p
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.8 }}
              className="text-lg md:text-xl text-[#AFAFAF] max-w-3xl mx-auto leading-relaxed"
            >
            Sip the finest coffee and enjoy delicious pizzas and burgers. A taste that keeps you coming back.
              <br />
              <span className="text-[#C9A227] font-semibold">
                Crafted with passion, served with excellence.
              </span>
            </motion.p>

          </div>
        </div>

        {/* Category Tabs */}
        <Tabs value={selectedCategory} onValueChange={setSelectedCategory} className="mb-12">

          <TabsList className="w-full justify-center flex-wrap h-auto gap-3 bg-[#151515] p-3 rounded-xl border border-[#C9A227]/20">

            {categories.map((category) => (
              <TabsTrigger
                key={category}
                value={category}
                className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-[#C9A227] data-[state=active]:to-[#E6C75A] data-[state=active]:text-black text-[#F5F5F5] font-bold uppercase tracking-wide px-6 py-3 rounded-lg transition-all duration-300 hover:scale-105 hover:text-[#C9A227]"
              >
                {category}
              </TabsTrigger>
            ))}

          </TabsList>

          {categories.map((category) => (
            <TabsContent key={category} value={category} className="mt-10">

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">

                {filteredItems.map((item) => (
                  <motion.div
                    key={item.id}
                    ref={(el) => (itemRefs.current[item.id] = el)}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4 }}
                    className={`transition-all duration-300 ${
                      highlightedItemId === item.id
                        ? 'ring-4 ring-[#C9A227] ring-offset-4 ring-offset-[#0F0F0F] rounded-lg scale-105'
                        : 'hover:scale-105'
                    }`}
                  >
                    <FoodCard item={item} onAddToCart={addToCart} />
                  </motion.div>
                ))}

              </div>

              {filteredItems.length === 0 && (
                <div className="text-center py-20">

                  <div className="bg-[#151515] border border-[#C9A227]/20 text-[#C9A227] py-8 px-12 rounded-xl inline-block">
                    <p className="text-xl">No items found in this category.</p>
                  </div>

                </div>
              )}

            </TabsContent>
          ))}

        </Tabs>

      </main>

      <Footer />
    </div>
  );
};