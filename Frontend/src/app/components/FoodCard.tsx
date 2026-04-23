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
    <Card
      className="overflow-hidden border transition-all duration-300 group hover:-translate-y-1 hover:shadow-lg"
      style={{
        backgroundColor: '#EDE8E0',
        borderColor: '#C8BAA8',
      }}
      onMouseEnter={(e) => {
        (e.currentTarget as HTMLDivElement).style.borderColor = '#7EB67A';
        (e.currentTarget as HTMLDivElement).style.boxShadow = '0 8px 30px rgba(58,107,53,0.15)';
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLDivElement).style.borderColor = '#C8BAA8';
        (e.currentTarget as HTMLDivElement).style.boxShadow = 'none';
      }}
    >

      {/* Image */}
      <div className="relative overflow-hidden h-44">

        <img
          src={item.image}
          alt={item.name}
          className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500"
        />

        {/* Overlay */}
        <div



          className="absolute inset-0"
          style={{
            background: 'linear-gradient(to top, rgba(28,43,26,0.55) 0%, transparent 60%)',
          }}
        />

        {/* Category badge — flips to solid green on card hover */}
        {item.category && (
          <span
            className="absolute top-3 left-3 text-xs font-bold uppercase tracking-wider px-2.5 py-1 rounded-full cursor-default
              transition-all duration-300
              group-hover:shadow-md group-hover:scale-105"
            style={{
              backgroundColor: '#E8F0E5',
              color: '#3A6B35',
              border: '1px solid #A8C9A0',
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLSpanElement).style.backgroundColor = '#3A6B35';
              (e.currentTarget as HTMLSpanElement).style.color = '#F7F3ED';
              (e.currentTarget as HTMLSpanElement).style.borderColor = '#3A6B35';
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLSpanElement).style.backgroundColor = '#E8F0E5';
              (e.currentTarget as HTMLSpanElement).style.color = '#3A6B35';
              (e.currentTarget as HTMLSpanElement).style.borderColor = '#A8C9A0';
            }}
          >
            {item.category}
          </span>
        )}

      </div>

      {/* Content */}
      <CardContent className="p-4 space-y-2">

        {/* Title with animated underline on card hover */}
        <div className="relative pb-1">
          <h3
            className="text-lg font-bold transition-colors duration-200 group-hover:text-[#3A6B35]"
            style={{ color: '#1C2B1A', fontFamily: '"Playfair Display", Georgia, serif' }}
          >
            {item.name}
          </h3>
          {/* Green underline slides in from left on hover */}
          <span
            className="absolute bottom-0 left-0 h-[2px] w-0 rounded-full transition-all duration-500 ease-out group-hover:w-3/4"
            style={{ backgroundColor: '#7EB67A' }}
          />
        </div>

        {item.description && (
          <p
            className="text-xs leading-relaxed line-clamp-2"
            style={{ color: '#6B7F68' }}
          >
            {item.description}
          </p>
        )}

        {/* Price subtly scales on hover */}
        <div className="flex items-baseline gap-2 pt-1">
          <span
            className="text-lg font-bold transition-transform duration-300 inline-block group-hover:scale-110 origin-left"
            style={{ color: '#3A6B35' }}
          >
            ₹{item.price.toFixed(2)}
          </span>
        </div>

      </CardContent>

      {/* Button */}
      <CardFooter className="p-4 pt-0">

        <Button
          onClick={handleAddToCart}
          className="w-full h-9 font-semibold transition-all duration-300 flex items-center justify-center gap-1 rounded-xl
            hover:opacity-90 hover:shadow-md hover:scale-[1.02] active:scale-[0.98]"
          style={{
            backgroundColor: '#3A6B35',
            color: '#F7F3ED',
          }}
        >
          <Plus className="w-4 h-4 transition-transform duration-300 group-hover:rotate-90" />
          Add to Cart
        </Button>

      </CardFooter>

    </Card>
  );
};