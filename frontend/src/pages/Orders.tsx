import { useState, useEffect } from "react";
import { Package, Clock, CheckCircle, Truck } from "lucide-react";
import api from "@/api/axios";
import { Loader } from "@/components/Loader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface OrderItem {
  id: number;
  quantity: number;
  price: string;
  subtotal: string;
  menu_item_details?: {
    name: string;
    price: string;
  };
}

interface Order {
  id: number;
  restaurant_name: string;
  total_amount: string;
  payment_method: string;
  status: string;
  created_at: string;
  items: OrderItem[];
}

const statusConfig: any = {
  placed: { label: "Order Placed", icon: Package },
  accepted: { label: "Accepted", icon: CheckCircle },
  cooking: { label: "Cooking", icon: Clock },
  out_for_delivery: { label: "Out for Delivery", icon: Truck },
  delivered: { label: "Delivered", icon: CheckCircle },
};

// fallback icon
const safeIcon = (icon: any) => (typeof icon === "function" ? icon : Package);

const Orders = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const response = await api.get("/orders/");
      setOrders(response.data.results || response.data);
    } catch (err) {
      console.error("Error fetching orders:", err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <Loader />;

  if (orders.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <Package className="w-24 h-24 mx-auto mb-4 text-muted-foreground" />
          <h2 className="text-2xl font-bold mb-2">No Orders Yet</h2>
          <p className="text-muted-foreground">
            Start ordering your favourite food!
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">My Orders</h1>

        <div className="space-y-6">
          {orders.map((order) => {
            const statusInfo =
              statusConfig[order.status] || statusConfig["placed"];

            const StatusIcon = safeIcon(statusInfo.icon);

            return (
              <Card key={order.id}>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="mb-2">
                        {order.restaurant_name}
                      </CardTitle>
                      <p className="text-sm text-muted-foreground">
                        Order #{order.id} •{" "}
                        {new Date(order.created_at).toLocaleDateString()}
                      </p>
                    </div>

                    <Badge className="gap-2">
                      <StatusIcon className="w-4 h-4" />
                      {statusInfo.label}
                    </Badge>
                  </div>
                </CardHeader>

                <CardContent>
                  {/* Items */}
<div className="space-y-2 mb-4">
  {order.items?.map((item, index) => (
    <div key={index} className="flex justify-between text-sm">
      <span>
        {item.menu_item_details?.name} × {item.quantity}
      </span>

      {/* item subtotal (with tax included) */}
      <span>
        ₹{Number(item.subtotal || 0).toFixed(2)}
      </span>
    </div>
  ))}
</div>


                  {/* Payment + Total */}
                  <div className="flex justify-between items-center pt-4 border-t">
                    <div>
                      <p className="text-sm text-muted-foreground">
                        Payment Method
                      </p>
                      <p className="font-medium capitalize">
                        {order.payment_method}
                      </p>
                    </div>

                    <div className="text-right">
                      <p className="text-sm text-muted-foreground">
                        Total Amount
                      </p>
                      <p className="font-bold text-lg">
                        ₹{Number(order.total_amount).toFixed(2)}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Orders;
