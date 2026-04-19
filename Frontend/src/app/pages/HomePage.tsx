import { useState, useEffect, useRef } from 'react';
import { Header } from '../components/Header';
import { Footer } from '../components/Footer';
import { FoodCard } from '../components/FoodCard';
import { useCart } from '../context/CartContext';
import { useTable } from '../context/TableContext';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Leaf } from 'lucide-react';
import { motion } from 'framer-motion';
import { fetchMenuByTable, categoryMap } from '../services/menuApi';
import { FoodItem } from '../context/CartContext';

export const HomePage = () => {
  const { addToCart } = useCart();
  const { currentTableId } = useTable();
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [hoveredTab, setHoveredTab] = useState<string | null>(null);
  const [highlightedItemId, setHighlightedItemId] = useState<string | null>(null);
  const [apiMenuItems, setApiMenuItems] = useState<FoodItem[]>([]);
  const [loadingMenu, setLoadingMenu] = useState(false);
  const [menuError, setMenuError] = useState(false);
  const itemRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});

  // Derive categories dynamically from API data + 'All'
  const categories = [
    'All',
    ...Array.from(new Set(apiMenuItems.map((item) => item.category))),
  ];

  // Fetch menu from API on mount
  useEffect(() => {
    const loadMenu = async () => {
      setLoadingMenu(true);
      setMenuError(false);
      try {
        const data = await fetchMenuByTable(currentTableId);
        const mapped: FoodItem[] = data.menu_items
          .filter((item: any) => item.availability)
          .map((item: any) => ({
            id: `api-${item.item_id}`,
            name: item.item_name,
            price: parseFloat(item.price),
            category: categoryMap[item.category_id] ?? 'Other',
            image: item.image_url || 'https://images.unsplash.com/photo-1510591509098-f4fdc6d0ff04?w=400&h=300&fit=crop',
            description: '',
          }));
        setApiMenuItems(mapped);
      } catch (err) {
        console.error('API menu load failed:', err);
        setMenuError(true);
      } finally {
        setLoadingMenu(false);
      }
    };
    loadMenu();
  }, [currentTableId]);

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
      ? apiMenuItems
      : apiMenuItems.filter((item) => item.category === selectedCategory);

  return (
    <div className="min-h-screen text-[#1C2B1A]" style={{ backgroundColor: '#F7F3ED' }}>
      <Header />
      <main className="container mx-auto px-4 py-12">

        {/* Hero Section */}
        <div className="text-center mb-16 relative overflow-hidden">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 30, repeat: Infinity, ease: 'linear' }}
            className="absolute inset-0 flex items-center justify-center opacity-5 pointer-events-none"
          >
            <Leaf className="w-72 h-72 text-[#3A6B35]" />
          </motion.div>
          <div
            className="absolute -top-10 left-1/2 -translate-x-1/2 w-[600px] h-[300px] rounded-full opacity-20 pointer-events-none"
            style={{ background: 'radial-gradient(ellipse, #7EB67A 0%, transparent 70%)', filter: 'blur(48px)' }}
          />
          <div className="relative z-10">
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6 }}
              className="inline-flex items-center gap-2 mb-6 px-4 py-1.5 rounded-full border text-sm font-medium tracking-widest uppercase"
              style={{ backgroundColor: '#E8F0E5', borderColor: '#A8C9A0', color: '#3A6B35' }}
            >
              <Leaf className="w-3.5 h-3.5" />
              Farm to Table · Est. 2019
            </motion.div>
            <motion.h1
              initial={{ opacity: 0, y: -40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.1 }}
              className="text-5xl md:text-7xl font-bold mb-5 tracking-tight leading-tight"
              style={{ color: '#1C2B1A', fontFamily: '"Playfair Display", Georgia, serif' }}
            >
              The Coffee <span style={{ color: '#3A6B35' }}>Nest</span>
            </motion.h1>
            <div className="w-24 h-[3px] mx-auto mb-6 rounded-full" style={{ backgroundColor: '#7EB67A' }} />
            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.8 }}
              className="text-lg md:text-xl max-w-2xl mx-auto leading-relaxed"
              style={{ color: '#4A5E47' }}
            >
              Sip the finest coffee and enjoy delicious pizzas and burgers.
              <br />
              <span className="font-semibold" style={{ color: '#3A6B35' }}>Crafted with passion, served with love.</span>
            </motion.p>
          </div>
        </div>

        {/* Loading state */}
        {loadingMenu && (
          <div className="text-center mb-6">
            <span
              className="inline-flex items-center gap-2 text-sm font-medium px-4 py-2 rounded-full"
              style={{ backgroundColor: '#E8F0E5', color: '#3A6B35' }}
            >
              <span className="w-4 h-4 border-2 rounded-full animate-spin" style={{ borderColor: '#A8C9A0', borderTopColor: '#3A6B35' }} />
              Loading menu from server...
            </span>
          </div>
        )}

        {/* Error state */}
        {menuError && !loadingMenu && (
          <div className="text-center mb-6">
            <span
              className="inline-flex items-center gap-2 text-sm font-medium px-4 py-2 rounded-full border"
              style={{ backgroundColor: '#FEF2F2', borderColor: '#FECACA', color: '#DC2626' }}
            >
              Failed to load menu. Please refresh the page.
            </span>
          </div>
        )}

        {/* Category Tabs — only shown when data is loaded */}
        {!loadingMenu && !menuError && apiMenuItems.length > 0 && (
          <Tabs value={selectedCategory} onValueChange={setSelectedCategory} className="mb-12">
            <TabsList
              className="w-full justify-center flex-wrap h-auto gap-2 p-3 rounded-2xl border"
              style={{ backgroundColor: '#EDE8E0', borderColor: '#C8BAA8' }}
            >
              {categories.map((category) => {
                const isActive  = selectedCategory === category;
                const isHovered = hoveredTab === category;
                return (
                  <TabsTrigger
                    key={category}
                    value={category}
                    onMouseEnter={() => setHoveredTab(category)}
                    onMouseLeave={() => setHoveredTab(null)}
                    className="relative font-bold uppercase tracking-wide px-5 py-2.5 text-sm"
                    style={{
                      backgroundColor: 'transparent',
                      color: isActive ? '#3A6B35' : isHovered ? '#3A6B35' : '#4A5E47',
                      border: 'none',
                      boxShadow: 'none',
                      transition: 'color 0.25s ease',
                    }}
                  >
                    {category}
                    <span
                      style={{
                        position: 'absolute', bottom: 4, left: '50%',
                        transform: 'translateX(-50%)', height: '2px',
                        borderRadius: '99px', backgroundColor: '#7EB67A',
                        transition: 'width 0.3s ease',
                        width: isActive || isHovered ? '65%' : '0%',
                      }}
                    />
                  </TabsTrigger>
                );
              })}
            </TabsList>

            {categories.map((category) => (
              <TabsContent key={category} value={category} className="mt-10">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                  {filteredItems.map((item, index) => (
                    <motion.div
                      key={item.id}
                      ref={(el) => (itemRefs.current[item.id] = el)}
                      initial={{ opacity: 0, y: 30 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.4, delay: index * 0.05 }}
                      className={`transition-all duration-300 ${
                        highlightedItemId === item.id ? 'ring-4 ring-offset-4 rounded-xl scale-105' : 'hover:scale-105'
                      }`}
                      style={highlightedItemId === item.id ? { '--tw-ring-color': '#7EB67A', '--tw-ring-offset-color': '#F7F3ED' } as React.CSSProperties : {}}
                    >
                      <FoodCard item={item} onAddToCart={addToCart} />
                    </motion.div>
                  ))}
                </div>
                {filteredItems.length === 0 && (
                  <div className="text-center py-20">
                    <div className="inline-block py-8 px-12 rounded-2xl border" style={{ backgroundColor: '#EDE8E0', borderColor: '#C8BAA8', color: '#3A6B35' }}>
                      <p className="text-xl">No items found in this category.</p>
                    </div>
                  </div>
                )}
              </TabsContent>
            ))}
          </Tabs>
        )}

      </main>
      <Footer />
    </div>
  );
};