import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import api from "@/api/axios";
import { Loader } from "@/components/Loader";

export default function CategoryPage() {
  const { id } = useParams(); // category id
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const res = await api.get(`/menu/?category=${id}`);
        setItems(res.data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchItems();
  }, [id]);

  if (loading) return <Loader />;

  return (
    <div className="container mx-auto px-4 py-10">
      <h2 className="text-2xl font-bold mb-6">Items in this Category</h2>

      {items.length === 0 && (
        <p className="text-gray-500">No items found in this category.</p>
      )}

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {items.map(item => (
          <div key={item.id} className="border rounded-lg p-4 shadow-sm">
            <img
              src={item.image || "/assets/placeholder-food.jpg"}
              className="w-full h-32 object-cover rounded-md mb-3"
            />
            <h3 className="font-semibold">{item.name}</h3>
            <p className="text-sm text-gray-500">{item.description}</p>
            <p className="font-bold mt-2">₹{item.price}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
