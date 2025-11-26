import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Search, ChevronRight } from "lucide-react";
import api from "@/api/axios";
import { RestaurantCard } from "@/components/RestaurantCard";
import { Loader } from "@/components/Loader";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { CustomerReviews } from "@/components/CustomerReviews";

interface Restaurant {
  id: number;
  name: string;
  address: string;
  rating: number;
  image?: string;
  is_active: boolean;
  menu_items?: {
    id: number;
    name: string;
    category: number;
  }[];
}

interface Category {
  id: number;
  name: string;
}

const Home = () => {
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);

      // Fetch restaurants and categories
      const [restaurantsRes, categoriesRes] = await Promise.all([
        api.get("restaurants/?include=menu_items"), // Ensure menu items are included
        api.get("menu/categories/"),
      ]);

      setRestaurants(restaurantsRes.data.results || restaurantsRes.data);
      setCategories(categoriesRes.data.results || categoriesRes.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  // Filter restaurants based on name or menu items category match
  const filteredRestaurants = restaurants.filter((restaurant) => {
    const nameMatch = restaurant.name.toLowerCase().includes(searchTerm.toLowerCase());
    const menuMatch = restaurant.menu_items?.some(
      (item) =>
        item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        categories.find((cat) => cat.id === item.category)?.name
          .toLowerCase()
          .includes(searchTerm.toLowerCase())
    );
    return nameMatch || menuMatch;
  });

  if (loading) return <Loader />;

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative h-[420px] flex items-center overflow-hidden">
        {/* Animated Background Image */}
        <motion.img
          src="/assets/hero/Slide2.png"
          className="absolute inset-0 w-full h-full object-cover opacity-40"
          initial={{ scale: 1 }}
          animate={{ scale: 1.1 }}
          transition={{
            duration: 5,
            repeat: Infinity,
            repeatType: "mirror",
            ease: "easeInOut",
          }}
        />

        {/* Overlay */}
        <div className="absolute inset-0 bg-black/60" />

        {/* Hero Content */}
        <div className="container mx-auto text-center relative z-10 px-4">
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-4xl md:text-6xl font-extrabold text-white drop-shadow-[0_4px_12px_rgba(0,0,0,0.6)] tracking-tight leading-snug"
          >
            Hungry?{" "}
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-yellow-300 via-orange-400 to-yellow-200">
              Order Your Favourite Food Now!
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.8 }}
            className="text-lg md:text-lg text-gray-200 mt-3 drop-shadow-[0_2px_6px_rgba(0,0,0,0.5)] tracking-wide"
          >
            Fast delivery • Fresh food • Best offers near you
          </motion.p>

          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.4, type: "spring", stiffness: 100 }}
            className="mt-6"
          >
            <Link to="/restaurants">
              <button className="px-8 py-3 rounded-full text-lg bg-yellow-400 hover:bg-yellow-500 shadow-lg transition-transform transform hover:scale-105 font-semibold tracking-wide">
                Order Now
              </button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Search Bar outside Hero */}
      <div className="relative max-w-xl mx-auto -mt-20 z-20 px-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <div className="relative">
            {/* Frosted Glass Background */}
            <div className="absolute inset-0 rounded-3xl bg-white/10 backdrop-blur-xl border border-white/20 shadow-2xl pointer-events-none" />

            <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-white/70 z-20 pointer-events-none" />

            {searchTerm && (
              <motion.button
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.2 }}
                onClick={() => setSearchTerm("")}
                className="absolute right-3 top-3.5 -translate-y-1/2 w-7 h-7 flex items-center justify-center rounded-full bg-white/20 backdrop-blur-md border border-white/30 shadow-md hover:bg-white/30 hover:scale-110 transition-all z-30"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-4 h-4 text-white"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </motion.button>
            )}

            <Input
              type="text"
              placeholder="Search for restaurants or cuisines..."
              className="pl-14 pr-14 h-14 text-lg bg-white/20 backdrop-blur-md text-white placeholder:text-white focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 transition-all rounded-3xl shadow-xl"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </motion.div>

        {/* Live Search Suggestions */}
        {searchTerm && filteredRestaurants.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25 }}
            className="mt-3 rounded-3xl p-3 bg-white/10 backdrop-blur-xl border border-white/20 shadow-2xl max-h-60 overflow-y-auto"
          >
            {filteredRestaurants.slice(0, 5).map((restaurant) => (
              <Link key={restaurant.id} to={`/restaurants/${restaurant.id}`}>
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  className="flex items-center gap-3 p-3 mb-2 rounded-xl bg-white/20 hover:bg-white/30 transition cursor-pointer"
                >
                  <img
                    src={restaurant.image || `/assets/restaurants/${restaurant.name}.png`}
                    className="w-12 h-12 rounded-lg object-cover shadow-md"
                  />
                  <div>
                    <p className="font-semibold text-black">{restaurant.name}</p>
                    <p className="text-xs text-black/70">{restaurant.address}</p>
                  </div>
                </motion.div>
              </Link>
            ))}
          </motion.div>
        )}
      </div>

      {/* Categories and Restaurants */}
      <div className="container mx-auto px-4 py-12">
        {/* Categories */}
        {categories.length > 0 && (
          <section className="mb-12">
            <h2 className="text-2xl font-bold mb-6">Popular Categories</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {categories.map((category) => (
                <motion.div
                  key={category.id}
                  onClick={() => setSearchTerm(category.name.toLowerCase())}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4 }}
                  className="p-4 rounded-lg border bg-card transition-all cursor-pointer text-center hover:-translate-y-1 hover:border-orange-500 hover:shadow-orange-500/40 hover:shadow-md"
                >
                  <div className="w-20 h-20 mx-auto mb-2 rounded-full bg-white shadow-sm flex items-center justify-center overflow-hidden">
                    <img
                      src={`/assets/categories/${category.name}.png`}
                      alt={category.name}
                      className="w-full h-full object-contain"
                    />
                  </div>
                  <p className="font-medium text-sm">{category.name}</p>
                </motion.div>
              ))}
            </div>
          </section>
        )}

        {/* Restaurants */}
        <section>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold">{searchTerm ? "Search Results" : "Popular Restaurants"}</h2>
            <Link to="/restaurants">
              <Button variant="ghost" className="gap-2">
                View All <ChevronRight className="w-4 h-4" />
              </Button>
            </Link>
          </div>

          {filteredRestaurants.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredRestaurants.slice(0, 12).map((restaurant) => (
                <motion.div
                  key={restaurant.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.4 }}
                  whileHover={{ scale: 1.03 }}
                  className="hover:shadow-orange-500/40 hover:shadow-lg transition-all rounded-xl"
                >
                  <RestaurantCard
                    restaurant={{
                      ...restaurant,
                      image: restaurant.image || `/assets/restaurants/${restaurant.name}.png`,
                    }}
                  />
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No restaurants found</p>
            </div>
          )}
        </section>
      </div>

      {/* Customer Reviews */}
      <div>
        <CustomerReviews />
      </div>
    </div>
  );
};

export default Home;
