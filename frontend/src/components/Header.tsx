import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { useCart } from "@/context/CartContext";
import {
  ShoppingCart,
  User,
  LogOut,
  LayoutDashboard,
  Package,
  ChevronDown,
  Home,
  UtensilsCrossed,
  ClipboardList,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export const Header = () => {
  const { isAuthenticated, user, logout, isAdmin } = useAuth();
  const { itemCount } = useCart();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <header className="sticky top-0 z-50 w-full bg-white shadow-sm border-b">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-orange-500 flex items-center justify-center shadow-md">
            <UtensilsCrossed className="text-white w-6 h-6" />
          </div>
          <span className="text-xl font-bold text-gray-900 tracking-wide">
            Foodie<span className="text-primary">Express</span>
          </span>
        </Link>

        {/* Nav */}
        <nav className="hidden md:flex items-center gap-6 text-gray-700 font-medium">
          <Link to="/" className="flex items-center gap-1 hover:text-primary duration-200">
            <Home size={20} />
            Home
          </Link>

          <Link to="/restaurants" className="flex items-center gap-1 hover:text-primary duration-200">
            <UtensilsCrossed size={20} />
            Restaurants
          </Link>

          {isAuthenticated && (
            <Link
              to="/orders"
              className="flex items-center gap-1 hover:text-primary duration-200"
            >
              <ClipboardList size={20} />
              Orders
            </Link>
          )}
        </nav>

        {/* Right section */}
        <div className="flex items-center gap-4">

          {/* Cart */}
          {isAuthenticated && (
            <Link to="/cart" className="relative group">
              <Button variant="ghost" size="icon" className="hover:bg-gray-100">
                <ShoppingCart className="h-5 w-5 text-gray-700 group-hover:text-primary duration-200" />
                {itemCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-primary text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {itemCount}
                  </span>
                )}
              </Button>
            </Link>
          )}

          {/* Profile */}
          {isAuthenticated ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                {/* Hover: text + icons turn orange */}
                <button className="flex items-center gap-2 px-3 py-2 rounded-lg border bg-gray-50 hover:bg-gray-100 duration-200 shadow-sm group">
                  <User className="h-5 w-5 text-gray-700 group-hover:text-primary duration-200" />

                  <span className="text-sm font-medium text-gray-700 group-hover:text-primary duration-200">
                    {user?.name}
                  </span>

                  <ChevronDown className="h-4 w-4 text-gray-600 group-hover:text-primary duration-200" />
                </button>
              </DropdownMenuTrigger>

              <DropdownMenuContent
                align="end"
                className="w-48 bg-white border shadow-lg rounded-lg"
              >
                <div className="px-3 py-2">
                  <p className="text-sm font-semibold">{user?.name}</p>
                  <p className="text-xs text-gray-500">{user?.email}</p>
                </div>

                <DropdownMenuSeparator />

                <DropdownMenuItem onClick={() => navigate("/orders")}>
                  <Package className="mr-2 h-4 w-4" /> My Orders
                </DropdownMenuItem>

                {isAdmin && (
                  <DropdownMenuItem onClick={() => navigate("/admin")}>
                    <LayoutDashboard className="mr-2 h-4 w-4" /> Admin Dashboard
                  </DropdownMenuItem>
                )}

                <DropdownMenuSeparator />

                <DropdownMenuItem onClick={handleLogout}>
                  <LogOut className="mr-2 h-4 w-4" /> Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <div className="flex items-center gap-2">

              {/* Login turns orange on hover */}
              <Button
                variant="ghost"
                onClick={() => navigate("/login")}
                className="hover:bg-gray-100 hover:text-primary duration-200"
              >
                Login
              </Button>

              <Button
                onClick={() => navigate("/register")}
                className="bg-primary text-white hover:bg-primary/90 shadow-md"
              >
                Sign Up
              </Button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
