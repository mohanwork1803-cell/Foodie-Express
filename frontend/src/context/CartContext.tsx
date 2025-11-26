import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import api from "@/api/axios";
import { useAuth } from "./AuthContext";
import { toast } from "sonner";

interface CartItem {
  id: number;
  menu_item_id: number;
  name: string;
  price: number;
  qty: number;
  restaurant_id: number;
  restaurant_name: string;
  image?: string;
}

interface CartContextType {
  cart: CartItem[];
  loading: boolean;
  addToCart: (item: any, quantity: number) => Promise<void>;
  updateQuantity: (cartItemId: number, quantity: number) => Promise<void>;
  removeFromCart: (cartItemId: number) => Promise<void>;
  clearCart: () => void;
  totalAmount: number;
  itemCount: number;
  fetchCart: () => Promise<void>;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(false);
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    if (isAuthenticated) {
      fetchCart();
    } else {
      setCart([]);
    }
  }, [isAuthenticated]);

  const normalizeCart = (data: any): CartItem[] => {
  if (!data || !data.items) return [];

  return data.items.map((item: any) => {
    const m = item.menu_item_details; // short alias

    return {
      id: item.id,
      menu_item_id: m?.id || item.menu_item,
      name: m?.name || "Unnamed Item",
      price: parseFloat(item.price_snapshot), // convert "399.00" → 399
      qty: item.quantity,
      restaurant_id: m?.restaurant || null,
      restaurant_name: m?.restaurant_name || "",
      image: m?.image || null,
    };
  });
};

  const fetchCart = async () => {
    if (!isAuthenticated) return;

    try {
      setLoading(true);
      const res = await api.get("/cart/");
      setCart(normalizeCart(res.data));
    } catch (error) {
      console.error("Cart fetch failed", error);
    } finally {
      setLoading(false);
    }
  };

  const addToCart = async (item: any, quantity: number) => {
    if (!isAuthenticated) {
      toast.error("Please login to add items");
      return;
    }

    try {
      setLoading(true);
      await api.post("/cart/add/", {
        menu_item_id: item.id,
        quantity,
      });
      await fetchCart();
      toast.success("Added to cart");
    } catch (error: any) {
      toast.error(error.response?.data?.error || "Failed to add item");
    } finally {
      setLoading(false);
    }
  };

  const updateQuantity = async (cartItemId: number, quantity: number) => {
    try {
      setLoading(true);
      await api.post("/cart/update_quantity/", {
        cart_item_id: cartItemId,
        quantity,
      });
      await fetchCart();
      toast.success("Updated cart");
    } catch (error: any) {
      toast.error(error.response?.data?.error || "Failed to update cart");
    } finally {
      setLoading(false);
    }
  };

  const removeFromCart = async (cartItemId: number) => {
    try {
      setLoading(true);
      await api.post("/cart/remove/", {
        cart_item_id: cartItemId,
      });
      await fetchCart();
      toast.success("Item removed");
    } catch (error: any) {
      toast.error(error.response?.data?.error || "Failed to remove item");
    } finally {
      setLoading(false);
    }
  };

  const clearCart = () => setCart([]);

  const totalAmount = cart.reduce(
    (sum, item) => sum + item.price * item.qty,
    0
  );

  const itemCount = cart.reduce((sum, item) => sum + item.qty, 0);

  return (
    <CartContext.Provider
      value={{
        cart,
        loading,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
        totalAmount,
        itemCount,
        fetchCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within CartProvider");
  }
  return context;
};
