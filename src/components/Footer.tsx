import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Phone, 
  Mail, 
  MapPin, 
  Facebook, 
  Instagram, 
  Linkedin, 
  Heart,
  Leaf,
  Flower2,
  Home
} from 'lucide-react';
import VedavayuLogo from '/vedavayu-logo.png';

const Footer: React.FC = () => {
  return (
    <footer className="bg-gradient-to-br from-primary-900 via-primary-800 to-primary-900 text-white relative overflow-hidden">

      <div className="container mx-auto px-4 py-16 relative">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Column 1 - Logo & About */}
          <div className="lg:col-span-2">
            <div className="flex items-center mb-6 p-4 rounded-lg bg-transparent">
              <img src={VedavayuLogo} alt="Vedavayu Logo" className="h-20 w-auto mr-4" />
              <div>
                <h2 className="text-2xl font-bold text-white">
                  Vedavayu
                </h2>
                <p className="text-sm text-white">Healing Beyond Medicine</p>
              </div>
            </div>
            <div className="relative">
              <div className="absolute left-0 top-0 w-1 h-full bg-gradient-to-b from-secondary-400 via-transparent to-transparent"></div>
              <p className="text-neutral-200 text-sm leading-relaxed mb-6 pl-4">
                At Vedavāyu, we believe true wellness goes beyond prescriptions. We are a holistic healthcare and wellness platform offering natural, preventive, and science-backed services—right at your doorstep or online.
              </p>
            </div>
            <div className="flex space-x-3">
              {[
                { icon: <Facebook size={18} />, link: "https://www.facebook.com/share/15j6iBGCDG/" },
                { icon: <Instagram size={18} />, link: "https://instagram.com/vedavayuofficial" },
                { icon: <Linkedin size={18} />, link: "https://www.linkedin.com/company/vedavayuofficial" },
              ].map((social, index) => (
                <a
                  key={index}
                  href={social.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-full bg-gradient-to-br from-primary-700 to-primary-600 hover:from-primary-600 hover:to-primary-500 flex items-center justify-center transition-all duration-300 transform hover:scale-110"
                >
                  {social.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Column 2 - Quick Links */}
          <div>
            <h3 className="text-lg font-medium mb-6 relative inline-block group">
              Quick Links
              <span className="absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-secondary-400 to-transparent transform origin-left transition-transform group-hover:scale-x-100"></span>
            </h3>
            <ul className="space-y-3">
              {[
                { path: "/", label: "Home", icon: <Home size={14} /> },
                { path: "/about", label: "About Us", icon: <Leaf size={14} /> },
                { path: "/services", label: "Services", icon: <Flower2 size={14} /> },
                { path: "/doctors", label: "Our Doctors", icon: <Heart size={14} /> },
              ].map((link, index) => (
                <li key={index}>
                  <Link
                    to={link.path}
                    className="text-neutral-200 hover:text-secondary-400 transition-colors flex items-center group"
                  >
                    <span className="w-6 h-6 flex items-center justify-center mr-2 text-secondary-400 group-hover:text-secondary-300 transition-colors">
                      {link.icon}
                    </span>
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3 - Contact Info */}
          <div>
            <h3 className="text-lg font-medium mb-6 relative inline-block group">
              Contact Us
              <span className="absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-secondary-400 to-transparent"></span>
            </h3>
            <ul className="space-y-4">
              {[
                { icon: <MapPin size={20} />, text: "Gandhinagar, Railgate Panikhaiti, Guwahati, Assam 781026" },
                { icon: <Phone size={20} />, text: "+91 9401986069" },
                { icon: <Mail size={20} />, text: "contact@vedavayu.com" },
              ].map((contact, index) => (
                <li key={index} className="flex items-start group">
                  <span className="mr-3 text-secondary-400 group-hover:text-secondary-300 transition-colors flex-shrink-0 mt-1">
                    {contact.icon}
                  </span>
                  <span className="text-neutral-200 group-hover:text-white transition-colors">
                    {contact.text}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-16 pt-8 border-t border-primary-700">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-neutral-300 text-sm">
              &copy; {new Date().getFullYear()} Vedavayu. All rights reserved.
            </p>
            <div className="mt-4 md:mt-0">
              <ul className="flex space-x-6">
                {["Privacy Policy", "Terms of Service", "Cookie Policy"].map((item, index) => (
                  <li key={index}>
                    <Link
                      to={`/${item.toLowerCase().replace(/\s+/g, '-')}`}
                      className="text-neutral-300 hover:text-white text-sm transition-colors relative group"
                    >
                      {item}
                      <span className="absolute bottom-0 left-0 w-full h-0.5 bg-secondary-400 transform scale-x-0 group-hover:scale-x-100 transition-transform"></span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
