import { Star, User2 } from "lucide-react";
import { motion } from "framer-motion";

const reviews = [
  {
    id: 1,
    name: "Rahul Sharma",
    rating: 5,
    comment: "Amazing food quality! Super fast delivery. Highly recommended!",
  },
  {
    id: 2,
    name: "Priya Menon",
    rating: 4,
    comment: "Loved the taste and freshness. Packaging was neat.",
  },
  {
    id: 3,
    name: "Karthik Reddy",
    rating: 5,
    comment: "One of the best food ordering experiences! Will order again.",
  },
  {
    id: 4,
    name: "Ananya Singh",
    rating: 4,
    comment: "Good experience, delivery agent was polite and on time.",
  },
];

export const CustomerReviews = () => {
  return (
    <div className="py-16 bg-gradient-to-b from-orange-50/40 to-white">
      <h2 className="text-3xl font-bold text-center mb-10 text-gray-800">
        What Our Customers Say ❤️
      </h2>

      <div className="container mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 px-4">
        {reviews.map((review) => (
          <motion.div
            key={review.id}
            whileHover={{ scale: 1.04, y: -4 }}
            transition={{ duration: 0.3 }}
            className="
              p-6 
              rounded-2xl 
              bg-white/40 
              backdrop-blur-lg 
              border border-white/30 
              shadow-xl 
              hover:shadow-orange-300/40
              transition-all
            "
          >
            {/* User Row */}
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-white/60 backdrop-blur flex items-center justify-center shadow-sm">
                <User2 className="w-5 h-5 text-gray-700" />
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-800">
                  {review.name}
                </h3>

                {/* Rating */}
                <div className="flex items-center gap-1 mt-1">
                  {[...Array(review.rating)].map((_, index) => (
                    <Star
                      key={index}
                      className="w-4 h-4 text-yellow-500 fill-yellow-500"
                    />
                  ))}
                </div>
              </div>
            </div>

            {/* Comment */}
            <p className="mt-4 text-gray-700 leading-relaxed text-sm">
              {review.comment}
            </p>
          </motion.div>
        ))}
      </div>
    </div>
  );
};
