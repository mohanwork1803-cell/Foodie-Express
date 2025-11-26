import { useState, useEffect } from 'react';
import api from '@/api/axios';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { Loader } from '@/components/Loader';
import { Badge } from '@/components/ui/badge';

interface Order {
  id: number;
  user_name: string;
  restaurant_name: string;
  total_amount: number;
  payment_method: string;
  status: string;
  created_at: string;
}

const statusOptions = [
  { value: 'placed', label: 'Placed' },
  { value: 'accepted', label: 'Accepted' },
  { value: 'cooking', label: 'Cooking' },
  { value: 'out_for_delivery', label: 'Out for Delivery' },
  { value: 'delivered', label: 'Delivered' },
];

export const OrderManagement = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const response = await api.get('/admin/orders/');
      setOrders(response.data.results || response.data);
    } catch (error) {
      toast.error('Failed to fetch orders');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (orderId: number, newStatus: string) => {
    try {
      await api.post(`/orders/${orderId}/status/`, { status: newStatus });
      toast.success('Order status updated successfully');
      fetchOrders();
    } catch (error) {
      toast.error('Failed to update order status');
    }
  };

  if (loading) return <Loader />;

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Order Management</h2>

      <div className="grid gap-4">
        {orders.length > 0 ? (
          orders.map((order) => (
            <Card key={order.id}>
              <CardContent className="p-4">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="font-semibold text-lg">Order #{order.id}</h3>
                      <Badge>{order.status.replace('_', ' ')}</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Customer: {order.user_name}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Restaurant: {order.restaurant_name}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Payment: {order.payment_method} • Amount: ₹{order.total_amount.toFixed(2)}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Date: {new Date(order.created_at).toLocaleString()}
                    </p>
                  </div>

                  <div className="w-48">
                    <Select
                      value={order.status}
                      onValueChange={(value) => handleStatusUpdate(order.id, value)}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {statusOptions.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No orders found</p>
          </div>
        )}
      </div>
    </div>
  );
};
