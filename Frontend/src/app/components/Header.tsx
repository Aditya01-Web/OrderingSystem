import { Coffee, Menu, ShoppingCart } from 'lucide-react';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router';
import { useCart } from '../context/CartContext';
import { Button } from './ui/button';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from './ui/sheet';
import { menuItems, categories } from '../data/menuData';
import { ScrollArea } from './ui/scroll-area';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from './ui/accordion';

export const Header = () => {
  const { cart } = useCart();
  const navigate = useNavigate();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [desktopMenuOpen, setDesktopMenuOpen] = useState(false);
  const [selectedItemId, setSelectedItemId] = useState<string | null>(null);

  const cartItemCount = cart.reduce((total, item) => total + item.quantity, 0);

  const getCategoryItems = (category: string) => {
    return menuItems.filter((item) => item.category === category);
  };

  const handleCategoryClick = (category: string) => {
    setMobileMenuOpen(false);
    setDesktopMenuOpen(false);
    navigate('/', { state: { selectedCategory: category } });
    setTimeout(() => {
      window.dispatchEvent(new CustomEvent('selectCategory', { detail: category }));
    }, 100);
  };

  const handleItemClick = (category: string, itemId: string) => {
    setSelectedItemId(itemId);
    setMobileMenuOpen(false);
    setDesktopMenuOpen(false);
    navigate('/', { state: { selectedCategory: category, selectedItemId: itemId } });
    setTimeout(() => {
      window.dispatchEvent(new CustomEvent('selectItem', { detail: { category, itemId } }));
    }, 100);
  };

  const MenuContent = () => (
    <ScrollArea className="h-[calc(100vh-8rem)] mt-6">
      <Accordion type="multiple" className="w-full space-y-2">
        {categories.filter((cat) => cat !== 'All').map((category) => {
          const items = getCategoryItems(category);
          return (
            <AccordionItem
              key={category}
              value={category}
              className="rounded-xl overflow-hidden border-0 mb-2"
              style={{ backgroundColor: '#EDE8E0', border: '1px solid #C8BAA8' }}
            >
              <AccordionTrigger
                className="px-4 py-3 text-base font-bold uppercase tracking-wide hover:no-underline transition-colors duration-200"
                style={{ color: '#1C2B1A' }}
                onMouseEnter={(e) => (e.currentTarget.style.color = '#3A6B35')}
                onMouseLeave={(e) => (e.currentTarget.style.color = '#1C2B1A')}
              >
                {category}
              </AccordionTrigger>

              <AccordionContent>
                <div className="space-y-1 px-2 pb-3">
                  {items.map((item) => (
                    <div
                      key={item.id}
                      className="flex justify-between items-center py-2.5 px-3 rounded-lg cursor-pointer transition-all duration-200 group"
                      style={
                        selectedItemId === item.id
                          ? {
                              backgroundColor: '#D6E9D0',
                              borderLeft: '3px solid #3A6B35',
                            }
                          : { borderLeft: '3px solid transparent' }
                      }
                      onMouseEnter={(e) => {
                        if (selectedItemId !== item.id) {
                          (e.currentTarget as HTMLDivElement).style.backgroundColor = '#E2EDD9';
                          (e.currentTarget as HTMLDivElement).style.borderLeft = '3px solid #7EB67A';
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (selectedItemId !== item.id) {
                          (e.currentTarget as HTMLDivElement).style.backgroundColor = 'transparent';
                          (e.currentTarget as HTMLDivElement).style.borderLeft = '3px solid transparent';
                        }
                      }}
                      onClick={() => handleItemClick(category, item.id)}
                    >
                      <span
                        className="text-sm font-medium transition-colors duration-200"
                        style={{
                          color: selectedItemId === item.id ? '#1C2B1A' : '#4A5E47',
                          fontWeight: selectedItemId === item.id ? 700 : 500,
                        }}
                      >
                        {item.name}
                      </span>
                      <span
                        className="text-sm font-bold"
                        style={{ color: '#3A6B35' }}
                      >
                        ₹{item.price.toFixed(2)}
                      </span>
                    </div>
                  ))}
                </div>
              </AccordionContent>
            </AccordionItem>
          );
        })}
      </Accordion>
    </ScrollArea>
  );

  return (
    <header
      className="sticky top-0 z-50 w-full border-b backdrop-blur-md shadow-sm transition-all duration-300"
      style={{ backgroundColor: 'rgba(247, 243, 237, 0.92)', borderColor: '#C8BAA8' }}
    >
      <div className="container mx-auto px-4">
        <div className="flex h-20 items-center justify-between">

          {/* Logo */}
          <Link
            to="/"
            className="flex items-center gap-3 transition-opacity duration-200 hover:opacity-80"
          >
            <div
              className="flex items-center justify-center w-12 h-12 rounded-full shadow-md transition-transform duration-300 hover:scale-105"
              style={{ backgroundColor: '#3A6B35' }}
            >
              <Coffee className="w-7 h-7" style={{ color: '#F7F3ED' }} />
            </div>

            <div className="flex flex-col">
              <span
                className="text-2xl font-bold tracking-tight"
                style={{
                  fontFamily: '"Playfair Display", Georgia, serif',
                  color: '#1C2B1A',
                }}
              >
                The Coffee{' '}
                <span style={{ color: '#3A6B35' }}>Nest</span>
              </span>
              <span
                className="text-xs tracking-wider uppercase"
                style={{ color: '#6B7F68' }}
              >
                Scan & Sip
              </span>
            </div>
          </Link>

          {/* Desktop Nav Links */}
          <nav className="hidden md:flex items-center gap-8">
            {[
              { to: '/', label: 'Home' },
              { to: '/order-history', label: 'Orders' },
              { to: '/order-tracking', label: 'Track' },
            ].map(({ to, label }) => (
              <Link
                key={to}
                to={to}
                className="relative text-sm font-bold uppercase tracking-wide transition-colors duration-200 group"
                style={{ color: '#4A5E47' }}
                onMouseEnter={(e) => (e.currentTarget.style.color = '#3A6B35')}
                onMouseLeave={(e) => (e.currentTarget.style.color = '#4A5E47')}
              >
                {label}
                {/* Underline hover effect */}
                <span
                  className="absolute -bottom-1 left-0 w-0 h-[2px] rounded-full transition-all duration-300 group-hover:w-full"
                  style={{ backgroundColor: '#7EB67A' }}
                />
              </Link>
            ))}
          </nav>

          {/* Right Side */}
          <div className="flex items-center gap-3">

            {/* Cart Button */}
            <Button
              variant="outline"
              size="icon"
              className="relative transition-all duration-300 rounded-xl"
              style={{
                borderColor: '#A8C9A0',
                backgroundColor: '#EDE8E0',
                color: '#3A6B35',
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLButtonElement).style.backgroundColor = '#3A6B35';
                (e.currentTarget as HTMLButtonElement).style.color = '#F7F3ED';
                (e.currentTarget as HTMLButtonElement).style.borderColor = '#3A6B35';
                (e.currentTarget as HTMLButtonElement).style.transform = 'scale(1.08)';
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLButtonElement).style.backgroundColor = '#EDE8E0';
                (e.currentTarget as HTMLButtonElement).style.color = '#3A6B35';
                (e.currentTarget as HTMLButtonElement).style.borderColor = '#A8C9A0';
                (e.currentTarget as HTMLButtonElement).style.transform = 'scale(1)';
              }}
              onClick={() => navigate('/cart')}
            >
              <ShoppingCart className="w-5 h-5" />
              {cartItemCount > 0 && (
                <span
                  className="absolute -top-2 -right-2 w-6 h-6 text-xs font-bold rounded-full flex items-center justify-center shadow-md"
                  style={{ backgroundColor: '#3A6B35', color: '#F7F3ED' }}
                >
                  {cartItemCount}
                </span>
              )}
            </Button>

            {/* Mobile Menu */}
            <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button
                  variant="outline"
                  size="icon"
                  className="md:hidden rounded-xl transition-all duration-300"
                  style={{
                    borderColor: '#A8C9A0',
                    backgroundColor: '#EDE8E0',
                    color: '#3A6B35',
                  }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLButtonElement).style.backgroundColor = '#3A6B35';
                    (e.currentTarget as HTMLButtonElement).style.color = '#F7F3ED';
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLButtonElement).style.backgroundColor = '#EDE8E0';
                    (e.currentTarget as HTMLButtonElement).style.color = '#3A6B35';
                  }}
                >
                  <Menu className="w-5 h-5" />
                </Button>
              </SheetTrigger>

              <SheetContent
                className="border-l"
                style={{ backgroundColor: '#F7F3ED', borderColor: '#C8BAA8' }}
              >
                <SheetHeader>
                  <SheetTitle
                    className="text-xl font-bold"
                    style={{
                      fontFamily: '"Playfair Display", Georgia, serif',
                      color: '#1C2B1A',
                    }}
                  >
                    Menu Categories
                  </SheetTitle>
                </SheetHeader>
                <MenuContent />
              </SheetContent>
            </Sheet>

            {/* Desktop Menu Button */}
            <Sheet open={desktopMenuOpen} onOpenChange={setDesktopMenuOpen}>
              <SheetTrigger asChild>
                <Button
                  className="hidden md:flex font-bold shadow-md uppercase tracking-wide rounded-xl transition-all duration-300 hover:scale-105 hover:shadow-lg"
                  style={{ backgroundColor: '#3A6B35', color: '#F7F3ED' }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLButtonElement).style.backgroundColor = '#2E5529';
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLButtonElement).style.backgroundColor = '#3A6B35';
                  }}
                >
                  <Menu className="w-5 h-5 mr-2" />
                  Menu
                </Button>
              </SheetTrigger>

              <SheetContent
                className="w-[400px] border-l"
                style={{ backgroundColor: '#F7F3ED', borderColor: '#C8BAA8' }}
              >
                <SheetHeader>
                  <SheetTitle
                    className="text-xl font-bold"
                    style={{
                      fontFamily: '"Playfair Display", Georgia, serif',
                      color: '#1C2B1A',
                    }}
                  >
                    Menu Categories
                  </SheetTitle>
                </SheetHeader>
                <MenuContent />
              </SheetContent>
            </Sheet>

          </div>
        </div>
      </div>
    </header>
  );
};