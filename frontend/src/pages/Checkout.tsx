import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '@/context/CartContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { toast } from 'sonner';
import api from '@/api/axios';

const Checkout = () => {
  const { cart, totalAmount, clearCart } = useCart();
  const navigate = useNavigate();
  const [paymentMethod, setPaymentMethod] = useState('cod');
  const [loading, setLoading] = useState(false);

  const deliveryFee = 40;
  const taxAmount = totalAmount * 0.05;
  const finalTotal = totalAmount + deliveryFee + taxAmount;

  useEffect(() => {
    if (cart.length === 0) {
      navigate('/cart');
    }
  }, [cart, navigate]);

  const handlePlaceOrder = async () => {
    try {
      setLoading(true);

      // 🔥 Only these 3 fields — backend needs ONLY this
      const orderData = {
        payment_method: paymentMethod,
        delivery_address: "Home",
        notes: "",
      };

      // 🔥 Correct API endpoint
      await api.post('/orders/create_order/', orderData);

      toast.success('Order placed successfully!');
      clearCart();
      navigate('/orders');
    } catch (error: any) {
      console.log(error);
      toast.error(
        error.response?.data?.error ||
        error.response?.data?.message ||
        'Failed to place order'
      );
    } finally {
      setLoading(false);
    }
  };

  if (cart.length === 0) return null;

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Checkout</h1>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* ORDER SUMMARY */}
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Order Summary</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {cart.map((item) => (
                    <div key={item.id} className="flex justify-between text-sm">
                      <span>{item.name} x {item.qty}</span>
                      <span>₹{(item.price * item.qty).toFixed(2)}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* PAYMENT */}
            <Card>
              <CardHeader>
                <CardTitle>Payment Method</CardTitle>
              </CardHeader>
              <CardContent>
                <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod}>
                  <div className="flex items-center space-x-2 p-4 border rounded-lg cursor-pointer hover:bg-muted/50">
                    <RadioGroupItem value="cod" id="cod" />
                    <Label htmlFor="cod" className="flex-1 cursor-pointer">
                      Cash on Delivery
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2 p-4 border rounded-lg cursor-pointer hover:bg-muted/50">
                    <RadioGroupItem value="online" id="online" />
                    <Label htmlFor="online" className="flex-1 cursor-pointer">
                      Online Payment
                    </Label>
                  </div>
                </RadioGroup>
              </CardContent>
            </Card>
          </div>

          {/* BILL DETAILS */}
          <div className="lg:col-span-1">
            <Card className="sticky top-20">
              <CardHeader>
                <CardTitle>Bill Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span>Item Total</span>
                  <span>₹{totalAmount.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Delivery Fee</span>
                  <span>₹{deliveryFee.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Taxes & Charges (5%)</span>
                  <span>₹{taxAmount.toFixed(2)}</span>
                </div>

                <div className="border-t pt-3">
                  <div className="flex justify-between font-bold text-lg mb-6">
                    <span>Total Amount</span>
                    <span>₹{finalTotal.toFixed(2)}</span>
                  </div>

                  <Button
                    className="w-full"
                    size="lg"
                    onClick={handlePlaceOrder}
                    disabled={loading}
                  >
                    {loading ? 'Placing Order...' : 'Place Order'}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
