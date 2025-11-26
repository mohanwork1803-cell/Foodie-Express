import { useState } from 'react';
import { Plus, Minus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import { useNavigate } from 'react-router-dom';

interface MenuItem {
  id: number;
  name: string;
  description: string;
  price: number;
  image?: string;
  is_available: boolean;
  restaurant_id: number;
}

interface ItemCardProps {
  item: MenuItem;
}

export const ItemCard = ({ item }: ItemCardProps) => {
  const [quantity, setQuantity] = useState(1);
  const [adding, setAdding] = useState(false);
  const { addToCart } = useCart();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const handleAddToCart = async () => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    try {
      setAdding(true);
      await addToCart(item, quantity);
      setQuantity(1);
    } catch (error) {
      console.error('Error adding to cart:', error);
    } finally {
      setAdding(false);
    }
  };

  return (
    <Card className="overflow-hidden hover:shadow-md transition-shadow">
      <CardContent className="p-0">
        <div className="flex gap-4 p-4">
          <div className="flex-1">
            <h3 className="font-semibold text-lg mb-1">{item.name}</h3>
            <p className="text-sm text-muted-foreground mb-2 line-clamp-2">
              {item.description}
            </p>
            <p className="text-lg font-bold text-primary">₹{item.price}</p>
            {!item.is_available && (
              <p className="text-sm text-destructive mt-1">Currently unavailable</p>
            )}
          </div>
          
          <div className="relative flex flex-col items-center gap-2">
            {item.image ? (
              <img
                src={item.image}
                alt={item.name}
                className="w-28 h-28 object-cover rounded-lg"
              />
            ) : (
              <div className="w-28 h-28 bg-gradient-to-br from-primary/20 to-primary/5 rounded-lg flex items-center justify-center">
                <span className="text-3xl font-bold text-primary/30">{item.name[0]}</span>
              </div>
            )}
            
            {item.is_available && (
              <div className="flex items-center gap-2 bg-background border rounded-lg p-1">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  disabled={quantity <= 1}
                >
                  <Minus className="h-3 w-3" />
                </Button>
                <span className="text-sm font-medium w-6 text-center">{quantity}</span>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6"
                  onClick={() => setQuantity(quantity + 1)}
                  disabled={quantity >= 10}
                >
                  <Plus className="h-3 w-3" />
                </Button>
              </div>
            )}
            
            <Button
              size="sm"
              className="w-full"
              onClick={handleAddToCart}
              disabled={!item.is_available || adding}
            >
              {adding ? 'Adding...' : 'Add'}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
