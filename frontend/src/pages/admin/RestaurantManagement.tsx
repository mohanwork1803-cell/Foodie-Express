import { useState, useEffect } from 'react';
import { Plus, Edit, Trash2 } from 'lucide-react';
import api from '@/api/axios';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { Loader } from '@/components/Loader';

interface Restaurant {
  id: number;
  name: string;
  address: string;
  rating: number;
  is_active: boolean;
}

export const RestaurantManagement = () => {
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingRestaurant, setEditingRestaurant] = useState<Restaurant | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    address: '',
    rating: 4.0,
  });

  useEffect(() => {
    fetchRestaurants();
  }, []);

  const fetchRestaurants = async () => {
    try {
      setLoading(true);
      const response = await api.get('/restaurants/');
      setRestaurants(response.data.results || response.data);
    } catch (error) {
      toast.error('Failed to fetch restaurants');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      if (editingRestaurant) {
        await api.put(`/restaurants/${editingRestaurant.id}/`, formData);
        toast.success('Restaurant updated successfully');
      } else {
        await api.post('/restaurants/', formData);
        toast.success('Restaurant created successfully');
      }
      
      setDialogOpen(false);
      setEditingRestaurant(null);
      setFormData({ name: '', address: '', rating: 4.0 });
      fetchRestaurants();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Operation failed');
    }
  };

  const handleEdit = (restaurant: Restaurant) => {
    setEditingRestaurant(restaurant);
    setFormData({
      name: restaurant.name,
      address: restaurant.address,
      rating: restaurant.rating,
    });
    setDialogOpen(true);
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this restaurant?')) return;
    
    try {
      await api.delete(`/restaurants/${id}/`);
      toast.success('Restaurant deleted successfully');
      fetchRestaurants();
    } catch (error) {
      toast.error('Failed to delete restaurant');
    }
  };

  if (loading) return <Loader />;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Restaurant Management</h2>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => {
              setEditingRestaurant(null);
              setFormData({ name: '', address: '', rating: 4.0 });
            }}>
              <Plus className="w-4 h-4 mr-2" />
              Add Restaurant
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {editingRestaurant ? 'Edit Restaurant' : 'Add New Restaurant'}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Restaurant Name</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="address">Address</Label>
                <Input
                  id="address"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="rating">Rating</Label>
                <Input
                  id="rating"
                  type="number"
                  step="0.1"
                  min="0"
                  max="5"
                  value={formData.rating}
                  onChange={(e) => setFormData({ ...formData, rating: parseFloat(e.target.value) })}
                  required
                />
              </div>
              <Button type="submit" className="w-full">
                {editingRestaurant ? 'Update' : 'Create'}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4">
        {restaurants.map((restaurant) => (
          <Card key={restaurant.id}>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <h3 className="font-semibold text-lg">{restaurant.name}</h3>
                  <p className="text-sm text-muted-foreground">{restaurant.address}</p>
                  <p className="text-sm mt-1">Rating: {restaurant.rating}</p>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="icon" onClick={() => handleEdit(restaurant)}>
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button variant="destructive" size="icon" onClick={() => handleDelete(restaurant.id)}>
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};
