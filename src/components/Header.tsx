import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Menu, X, ChevronDown } from 'lucide-react';
import VedavayuLogo from '/vedavayu-logo.png';
import { User } from '../App';
import { adminLogout } from '../utils/auth';

interface HeaderProps {
  user: User | null;
  onLogout: () => void;
}

const Header: React.FC<HeaderProps> = ({ user, onLogout }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Clear any residual user data on component mount
  useEffect(() => {
    if (!localStorage.getItem('token')) {
      onLogout();
    }
  }, [onLogout]);

  // Shrink header on scroll
  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 10);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu on navigation
  useEffect(() => {
    setIsMenuOpen(false);
  }, [location]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Display name logic - Updated to use name instead of firstName/lastName
  const fullName = user?.name || '';
  const displayName = fullName || user?.email?.split('@')[0] || '';

  const handleLogout = () => {
    if (user) {
      if (user.role === 'admin') {
        adminLogout();
      } else {
        onLogout();
      }
    }
    localStorage.removeItem('token'); // Ensure token is cleared
    localStorage.removeItem('user'); // Ensure user data is cleared
    navigate('/');
  };

  return (
    <header
      className={`fixed w-full top-0 z-50 transition-all duration-300 ${
        isScrolled ? 'bg-white shadow-md py-2' : ''
      }`}
    >
      <div className="container mx-auto px-4 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center">
          <img src={VedavayuLogo} alt="Logo" className="h-16 w-auto" />
          <div className="ml-2">
            <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary-600 to-secondary-500">
              Vedavayu
            </span>
            <div className="text-sm text-gray-600">Healing Beyond Medicine</div>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-8">
          <Link
            to="/"
            className={`font-medium hover:text-primary-600 transition-colors ${
              location.pathname === '/' ? 'text-primary-600' : 'text-neutral-700'
            }`}
          >
            Home
          </Link>
          <Link
            to="/about"
            className={`font-medium hover:text-primary-600 transition-colors ${
              location.pathname === '/about' ? 'text-primary-600' : 'text-neutral-700'
            }`}
          >
            About
          </Link>
          <Link
            to="/services"
            className={`font-medium hover:text-primary-600 transition-colors ${
              location.pathname.startsWith('/services') ? 'text-primary-600' : 'text-neutral-700'
            }`}
          >
            Services
          </Link>
          <Link
            to="/doctors"
            className={`font-medium hover:text-primary-600 transition-colors ${
              location.pathname === '/doctors' ? 'text-primary-600' : 'text-neutral-700'
            }`}
          >
            Doctors
          </Link>
        </nav>

        {/* Desktop Auth Section */}
        <div className="hidden md:flex items-center space-x-4">
          {user ? (
            <div
              ref={dropdownRef}
              className="relative"
              onMouseEnter={() => setIsDropdownOpen(true)}
              onMouseLeave={() => setIsDropdownOpen(false)}
            >
              <button
                onClick={() => setIsDropdownOpen(true)}
                className="flex items-center space-x-2 text-neutral-700 hover:text-primary-600 hover:bg-primary-50 rounded-md p-2 transition-all duration-200"
              >
                <div className="w-8 h-8 rounded-full bg-primary-100 flex items-center justify-center text-primary-600 font-medium">
                  {displayName.charAt(0).toUpperCase()}
                </div>
                <span className="font-medium">{displayName}</span>
                <ChevronDown size={16} className="text-neutral-500" />
              </button>
              {isDropdownOpen && (
                <div
                  className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 border border-gray-200 transition-all duration-200 ease-in-out transform scale-100 opacity-100"
                  style={{ transformOrigin: 'top right' }}
                >
                <button onClick={handleLogout} className="block w-full text-left px-4 py-3 text-neutral-700 hover:bg-primary-50 transition-colors">
                  Logout
                </button>
                </div>
              )}
            </div>
          ) : (
            <>
              <Link to="/login" className="text-primary-600 hover:text-primary-700 transition-colors">
                Login
              </Link>
              <Link
                to="/signup"
                className="bg-primary-600 text-white px-4 py-2 rounded-md hover:bg-primary-700 transition-colors"
              >
                Sign Up
              </Link>
            </>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button className="md:hidden" onClick={() => setIsMenuOpen((prev) => !prev)}>
          {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div className="md:hidden bg-white shadow-lg">
          <div className="px-4 py-4 space-y-4">
            <Link to="/" className="block text-neutral-700 hover:text-primary-600">
              Home
            </Link>
            <Link to="/about" className="block text-neutral-700 hover:text-primary-600">
              About
            </Link>
            <Link to="/services" className="block text-neutral-700 hover:text-primary-600">
              Services
            </Link>
            <Link to="/doctors" className="block text-neutral-700 hover:text-primary-600">
              Doctors
            </Link>
            {user ? (
              <>
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 rounded-full bg-primary-100 flex items-center justify-center text-primary-600 font-medium">
                    {displayName.charAt(0).toUpperCase()}
                  </div>
                  <span className="text-neutral-700 font-medium">Welcome, {displayName}</span>
                </div>
                <button
                  onClick={handleLogout}
                  className="w-full py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 transition-colors"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="block text-neutral-700 hover:text-primary-600">
                  Login
                </Link>
                <Link
                  to="/signup"
                  className="block bg-primary-600 text-white py-2 rounded-md hover:bg-primary-700 transition-colors text-center"
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;