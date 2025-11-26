import { Link } from 'react-router-dom';
import { FaFacebookF, FaTwitter, FaInstagram, FaLinkedinIn } from 'react-icons/fa';

export const Footer = () => {
  return (
    <footer className="bg-gradient-to-t from-gray-900 to-gray-800 text-white mt-12">
      <div className="container mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          {/* Brand Section */}
          <div>
            <h3 className="font-bold text-2xl mb-4">FoodieExpress</h3>
            <p className="text-gray-300">
              Delicious food delivered straight to your doorstep.
            </p>
            <div className="flex space-x-4 mt-4">
              <a href="#" className="hover:text-primary transition-colors"><FaFacebookF /></a>
              <a href="#" className="hover:text-primary transition-colors"><FaTwitter /></a>
              <a href="#" className="hover:text-primary transition-colors"><FaInstagram /></a>
              <a href="#" className="hover:text-primary transition-colors"><FaLinkedinIn /></a>
            </div>
          </div>

          {/* Company Links */}
          <div>
            <h4 className="font-semibold text-lg mb-4">Company</h4>
            <ul className="space-y-2 text-gray-300">
              <li><Link to="/" className="hover:text-primary transition-colors">About Us</Link></li>
              <li><Link to="/" className="hover:text-primary transition-colors">Careers</Link></li>
              <li><Link to="/" className="hover:text-primary transition-colors">Contact</Link></li>
            </ul>
          </div>

          {/* User Links */}
          <div>
            <h4 className="font-semibold text-lg mb-4">For You</h4>
            <ul className="space-y-2 text-gray-300">
              <li><Link to="/restaurants" className="hover:text-primary transition-colors">Restaurants</Link></li>
              <li><Link to="/orders" className="hover:text-primary transition-colors">Track Order</Link></li>
              <li><Link to="/" className="hover:text-primary transition-colors">Help</Link></li>
            </ul>
          </div>

          {/* Legal Links */}
          <div>
            <h4 className="font-semibold text-lg mb-4">Legal</h4>
            <ul className="space-y-2 text-gray-300">
              <li><Link to="/" className="hover:text-primary transition-colors">Terms & Conditions</Link></li>
              <li><Link to="/" className="hover:text-primary transition-colors">Privacy Policy</Link></li>
              <li><Link to="/" className="hover:text-primary transition-colors">Cookie Policy</Link></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-700 mt-10 pt-6 text-center text-gray-400 text-sm">
          <p>&copy; 2024 FoodieExpress. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};
