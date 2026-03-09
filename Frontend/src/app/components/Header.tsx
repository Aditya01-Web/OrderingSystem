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
        {categories.filter(cat => cat !== 'All').map((category) => {
          const items = getCategoryItems(category);

          return (
            <AccordionItem key={category} value={category} className="border-[#C9A227]/20">

              <AccordionTrigger className="text-lg font-bold text-[#C9A227] hover:text-[#E6C75A] hover:no-underline py-4 uppercase tracking-wide">
                {category}
              </AccordionTrigger>

              <AccordionContent>
                <div className="space-y-2 pl-2 pt-2">

                  {items.map((item) => (
                    <div
                      key={item.id}
                      className={`flex justify-between items-center py-3 px-4 rounded-lg cursor-pointer transition-all duration-300 group ${
                        selectedItemId === item.id
                          ? 'bg-[#151515] border-l-4 border-[#C9A227]'
                          : 'hover:bg-[#151515]'
                      }`}
                      onClick={() => handleItemClick(category, item.id)}
                    >

                      <span className={`${
                        selectedItemId === item.id
                          ? 'font-bold text-[#F5F5F5]'
                          : 'text-[#AFAFAF] group-hover:text-[#F5F5F5]'
                      }`}>
                        {item.name}
                      </span>

                      <span className="text-sm font-bold text-[#C9A227]">
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
    <header className="sticky top-0 z-50 w-full border-b border-[#C9A227]/20 bg-[#0F0F0F] backdrop-blur shadow-lg">

      <div className="container mx-auto px-4">

        <div className="flex h-20 items-center justify-between">

          {/* Logo */}

          <Link to="/" className="flex items-center gap-3 hover:opacity-90 transition-opacity">

            <div className="flex items-center justify-center w-12 h-12 rounded-full bg-gradient-to-br from-[#C9A227] to-[#E6C75A] shadow-lg">

              <Coffee className="w-7 h-7 text-black" />

            </div>

            <div className="flex flex-col">

              <span className="text-2xl font-bold text-[#C9A227] tracking-tight">
                The Coffee Nest
              </span>

              <span className="text-xs text-[#AFAFAF] tracking-wider uppercase">
                Scan & Sip
              </span>

            </div>

          </Link>


          {/* Desktop Navigation */}

          <nav className="hidden md:flex items-center gap-8">

            <Link
              to="/"
              className="text-sm font-medium text-[#F5F5F5] hover:text-[#C9A227] transition-colors uppercase tracking-wide"
            >
              Home
            </Link>

            <Link
              to="/order-history"
              className="text-sm font-medium text-[#F5F5F5] hover:text-[#C9A227] transition-colors uppercase tracking-wide"
            >
              Orders
            </Link>

            <Link
              to="/order-tracking"
              className="text-sm font-medium text-[#F5F5F5] hover:text-[#C9A227] transition-colors uppercase tracking-wide"
            >
              Track
            </Link>

          </nav>


          {/* Right Side */}

          <div className="flex items-center gap-4">

            {/* Cart */}

            <Button
              variant="outline"
              size="icon"
              className="relative border-[#C9A227]/30 bg-[#151515] hover:bg-[#C9A227] hover:text-black transition-all duration-300"
              onClick={() => navigate('/cart')}
            >

              <ShoppingCart className="w-5 h-5" />

              {cartItemCount > 0 && (

                <span className="absolute -top-2 -right-2 w-6 h-6 bg-[#C9A227] text-black text-xs font-bold rounded-full flex items-center justify-center shadow-md">
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
                  className="md:hidden border-[#C9A227]/30 bg-[#151515] hover:bg-[#C9A227] hover:text-black"
                >

                  <Menu className="w-5 h-5" />

                </Button>

              </SheetTrigger>

              <SheetContent className="bg-[#0F0F0F] border-l border-[#C9A227]/20">

                <SheetHeader>
                  <SheetTitle className="text-[#C9A227] text-xl">
                    Menu Categories
                  </SheetTitle>
                </SheetHeader>

                <MenuContent />

              </SheetContent>

            </Sheet>


            {/* Desktop Menu */}

            <Sheet open={desktopMenuOpen} onOpenChange={setDesktopMenuOpen}>

              <SheetTrigger asChild>

                <Button className="hidden md:flex bg-gradient-to-r from-[#C9A227] to-[#E6C75A] hover:opacity-90 text-black font-bold shadow-lg uppercase tracking-wide">

                  <Menu className="w-5 h-5 mr-2" />

                  Menu

                </Button>

              </SheetTrigger>

              <SheetContent className="w-[400px] bg-[#0F0F0F] border-l border-[#C9A227]/20">

                <SheetHeader>

                  <SheetTitle className="text-[#C9A227] text-xl">
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