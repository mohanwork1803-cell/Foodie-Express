import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Star, MapPin, Clock } from 'lucide-react';
import api from '@/api/axios';
import { ItemCard } from '@/components/ItemCard';
import { Loader } from '@/components/Loader';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface Restaurant {
  id: number;
  name: string;
  address: string;
  rating: number;
  image?: string;
  is_active: boolean;
}

interface MenuItem {
  id: number;
  name: string;
  description: string;
  price: number;
  image?: string;
  is_available: boolean;
  category_id: number;
  category_name: string;
  restaurant_id: number;
}

const RestaurantDetails = () => {
  const { id } = useParams();
  const [restaurant, setRestaurant] = useState<Restaurant | null>(null);
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  useEffect(() => {
    fetchRestaurantDetails();
  }, [id]);

  const fetchRestaurantDetails = async () => {
    try {
      setLoading(true);
      const [restaurantRes, menuRes] = await Promise.all([
        api.get(`/restaurants/${id}/`),
        api.get(`/restaurants/${id}/menu/`),
      ]);

      const restaurantData = restaurantRes.data;

      // 🔥 Attach your local asset image exactly like Home.jsx & RestaurantCard.jsx
      restaurantData.image =
        restaurantData.image ||
        `/assets/restaurants/${restaurantData.name}.png`;

      setRestaurant(restaurantData);

      setMenuItems(menuRes.data.results || menuRes.data);
    } catch (error) {
      console.error('Error fetching restaurant details:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <Loader />;
  if (!restaurant) return <div className="container mx-auto px-4 py-8">Restaurant not found</div>;

  const categories = ['all', ...Array.from(new Set(menuItems.map(item => item.category_name)))];
  const filteredItems =
    selectedCategory === 'all'
      ? menuItems
      : menuItems.filter(item => item.category_name === selectedCategory);

  return (
    <div className="min-h-screen bg-background">
      {/* Restaurant Header */}
      <div className="bg-gradient-to-r from-primary/10 to-background border-b">
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col md:flex-row gap-6">

            {/* Restaurant Image */}
            <img
              src={restaurant.image}
              alt={restaurant.name}
              onError={(e) => (e.currentTarget.src = `/assets/restaurants/default.png`)}
              className="w-full md:w-64 h-48 object-cover rounded-lg shadow-md"
            />

            <div className="flex-1">
              <h1 className="text-3xl font-bold mb-2">{restaurant.name}</h1>

              <div className="flex items-center gap-1 mb-2">
                <Star className="w-5 h-5 fill-primary text-primary" />
                <span className="font-semibold text-lg">{(Number(restaurant.rating) || 0).toFixed(1)}</span>
              </div>

              <div className="flex items-start gap-2 text-muted-foreground mb-2">
                <MapPin className="w-5 h-5 mt-0.5" />
                <span>{restaurant.address}</span>
              </div>

              <div className="flex items-center gap-2 text-muted-foreground">
                <Clock className="w-5 h-5" />
                <span>30-40 mins delivery</span>
              </div>

              {!restaurant.is_active && (
                <div className="mt-4 text-destructive font-medium">Currently closed</div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Menu */}
      <div className="container mx-auto px-4 py-8">
        <h2 className="text-2xl font-bold mb-6">Menu</h2>

        <Tabs value={selectedCategory} onValueChange={setSelectedCategory}>
          <TabsList className="mb-6 flex-wrap h-auto">
            {categories.map((category) => (
              <TabsTrigger key={category} value={category} className="capitalize">
                {category}
              </TabsTrigger>
            ))}
          </TabsList>

          <div className="space-y-4">
            {filteredItems.length > 0 ? (
              filteredItems.map((item) => (
                <ItemCard key={item.id} item={item} />
              ))
            ) : (
              <div className="text-center py-12">
                <p className="text-muted-foreground">No items available in this category</p>
              </div>
            )}
          </div>
        </Tabs>
      </div>
    </div>
  );
};

export default RestaurantDetails;
