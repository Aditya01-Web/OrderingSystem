import { MenuItem } from '../types';
import { Button } from './ui/button';
import { Card, CardContent, CardFooter } from './ui/card';
import { Plus } from 'lucide-react';
import { toast } from 'sonner';

interface FoodCardProps {
  item: MenuItem;
  onAddToCart: (item: MenuItem) => void;
}

export const FoodCard = ({ item, onAddToCart }: FoodCardProps) => {

  const handleAddToCart = () => {
    onAddToCart(item);
    toast.success(`${item.name} added to cart!`, {
      duration: 2000,
    });
  };

  return (
    <Card className="overflow-hidden border border-[#C9A227]/20 bg-[#151515] hover:border-[#C9A227]/60 hover:shadow-[0_0_20px_rgba(201,162,39,0.25)] transition-all duration-300 group hover:-translate-y-1">

      {/* Image */}
      <div className="relative overflow-hidden h-44">

        <img
          src={item.image}
          alt={item.name}
          className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500"
        />

        <div className="absolute inset-0 bg-gradient-to-t from-[#0F0F0F] via-transparent to-transparent opacity-70" />

      </div>

      {/* Content */}
      <CardContent className="p-4 space-y-2">

        <h3 className="text-lg font-bold text-[#F5F5F5] group-hover:text-[#C9A227] transition-colors">
          {item.name}
        </h3>

        {item.description && (
          <p className="text-xs text-[#AFAFAF] leading-relaxed line-clamp-2">
            {item.description}
          </p>
        )}

        <div className="flex items-baseline gap-2">
          <span className="text-lg font-bold text-[#C9A227]">
            ₹{item.price.toFixed(2)}
          </span>
        </div>

      </CardContent>

      {/* Button */}
      <CardFooter className="p-4 pt-0">

        <Button
          onClick={handleAddToCart}
          className="w-full h-9 bg-gradient-to-r from-[#C9A227] to-[#E6C75A] hover:opacity-90 text-black font-semibold shadow-md transition-all duration-300 flex items-center justify-center gap-1"
        >

          <Plus className="w-4 h-4 transition-transform duration-300 group-hover:rotate-90" />

          Add

        </Button>

      </CardFooter>

    </Card>
  );
};