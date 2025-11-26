import { Link } from 'react-router-dom';
import { Star, MapPin, Clock } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

interface Restaurant {
  id: number;
  name: string;
  address: string;
  rating: number;
  image?: string;
  is_active: boolean;
}

interface RestaurantCardProps {
  restaurant: Restaurant;
}

export const RestaurantCard = ({ restaurant }: RestaurantCardProps) => {

  // 👇 Fallback image logic (same as Home.jsx)
  const finalImage =
    restaurant.image && restaurant.image.trim() !== ""
      ? restaurant.image
      : `/assets/restaurants/${restaurant.name}.png`;

  return (
    <Link to={`/restaurants/${restaurant.id}`}>
      <Card className="overflow-hidden hover:shadow-lg transition-shadow duration-300 h-full">
        <div className="aspect-video overflow-hidden bg-muted">
          <img
            src={finalImage}
            alt={restaurant.name}
            className="w-full h-full object-cover"
            onError={(e) => {
              // If image not found → fallback to initial letter
              e.currentTarget.style.display = "none";
            }}
          />
        </div>

        <CardContent className="p-4">
          <h3 className="font-semibold text-lg mb-2 line-clamp-1">
            {restaurant.name}
          </h3>

          <div className="flex items-center gap-1 text-sm mb-2">
            <Star className="w-4 h-4 fill-primary text-primary" />
            <span className="font-medium">
              {(Number(restaurant.rating) || 0).toFixed(1)}
            </span>
          </div>

          <div className="flex items-start gap-1 text-sm text-muted-foreground mb-2">
            <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0" />
            <span className="line-clamp-1">{restaurant.address}</span>
          </div>

          <div className="flex items-center gap-1 text-sm text-muted-foreground">
            <Clock className="w-4 h-4" />
            <span>30-40 mins</span>
          </div>

          {!restaurant.is_active && (
            <div className="mt-2 text-sm text-destructive">Currently closed</div>
          )}
        </CardContent>
      </Card>
    </Link>
  );
};
