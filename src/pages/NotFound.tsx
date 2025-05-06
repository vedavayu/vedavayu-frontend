import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';

const NotFound: React.FC = () => {
  useEffect(() => {
    document.title = 'Page Not Found | Vedavayu';
  }, []);

  return (
    <div className="pt-24">
      <div className="min-h-screen bg-gradient-to-r from-primary-50 to-primary-100 py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto text-center">
            <h1 className="text-6xl md:text-8xl font-bold text-primary-600 mb-6">404</h1>
            <h2 className="text-3xl font-bold text-primary-800 mb-6">Page Not Found</h2>
            <p className="text-xl text-neutral-700 mb-8">
              The page you are looking for doesn't exist or has been moved.
            </p>
            <Link 
              to="/" 
              className="btn btn-primary"
            >
              Return to Home
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotFound;