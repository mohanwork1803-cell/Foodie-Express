import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Store, Utensils, Package } from 'lucide-react';
import api from '@/api/axios';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { RestaurantManagement } from './RestaurantManagement';
import { MenuManagement } from './MenuManagement';
import { OrderManagement } from './OrderManagement';

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalRestaurants: 0,
    totalMenuItems: 0,
    totalOrders: 0,
  });

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const [restaurantsRes, ordersRes] = await Promise.all([
        api.get('/restaurants/'),
        api.get('/admin/orders/'),
      ]);
      
      setStats({
        totalRestaurants: (restaurantsRes.data.results || restaurantsRes.data).length,
        totalMenuItems: 0, // Would need separate endpoint
        totalOrders: (ordersRes.data.results || ordersRes.data).length,
      });
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold">Admin Dashboard</h1>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Restaurants</CardTitle>
              <Store className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalRestaurants}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Menu Items</CardTitle>
              <Utensils className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalMenuItems}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
              <Package className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalOrders}</div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="restaurants" className="space-y-6">
          <TabsList>
            <TabsTrigger value="restaurants">Restaurants</TabsTrigger>
            <TabsTrigger value="menu">Menu Items</TabsTrigger>
            <TabsTrigger value="orders">Orders</TabsTrigger>
          </TabsList>

          <TabsContent value="restaurants">
            <RestaurantManagement />
          </TabsContent>

          <TabsContent value="menu">
            <MenuManagement />
          </TabsContent>

          <TabsContent value="orders">
            <OrderManagement />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AdminDashboard;
