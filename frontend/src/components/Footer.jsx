import { Facebook, Twitter, Instagram, Youtube } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white py-6">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm">
          {/* INFO */}
          <div>
            <h3 className="text-base font-semibold mb-2">INFO</h3>
            <p>#########</p>
            <p>######@gmail.com</p>
            <p>Colombo, Sri Lanka 00100</p>
          </div>

          {/* COMPANY INFORMATION */}
          <div>
            <h3 className="text-base font-semibold mb-2">
              COMPANY INFORMATION
            </h3>
            <ul className="space-y-1">
              <li>
                <a href="/" className="hover:text-gray-300">
                  About Us
                </a>
              </li>
              <li>
                <a href="/" className="hover:text-gray-300">
                  Our Mission
                </a>
              </li>
              <li>
                <a href="/" className="hover:text-gray-300">
                  News & Education
                </a>
              </li>
              <li>
                <a href="/createtickets" className="hover:text-gray-300">
                  Contact Us
                </a>
              </li>
            </ul>
          </div>

          {/* SUPPORT */}
          <div>
            <h3 className="text-base font-semibold mb-2">SUPPORT</h3>
            <ul className="space-y-1">
              <li>
                <a href="#" className="hover:text-gray-300">
                  Shipping & Returns
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-gray-300">
                  Terms of Service
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-gray-300">
                  Privacy Policy
                </a>
              </li>
            </ul>
          </div>

          {/* FOLLOW US */}
          <div>
            <h3 className="text-base font-semibold mb-2">FOLLOW US</h3>
            <div className="flex space-x-3">
              <a href="#" className="hover:text-gray-300">
                <Facebook size={20} />
              </a>
              <a href="#" className="hover:text-gray-300">
                <Twitter size={20} />
              </a>
              <a href="#" className="hover:text-gray-300">
                <Instagram size={20} />
              </a>
              <a href="#" className="hover:text-gray-300">
                <Youtube size={20} />
              </a>
            </div>
          </div>
        </div>

        <div className="mt-4 pt-4 border-t border-gray-800 text-center text-xs">
          <p>All rights reserved ITP24R_B1_W16</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
