import React, { useState, useEffect, Suspense } from 'react';
import {
  Routes,
  Route,
  Navigate,
  useLocation,
  Outlet,
  useNavigate
} from 'react-router-dom';
import { AuthResponse } from './Api/api';

import Header from './components/Header';
import Footer from './components/Footer';

// Import core components immediately needed
import Home from './pages/Home';
import Login from './pages/Login';
import Signup from './pages/Signup';
import NotFound from './pages/NotFound';

// Lazy load less frequently used public pages
const About = React.lazy(() => import('./pages/About'));
const Services = React.lazy(() => import('./pages/Services'));
const Doctors = React.lazy(() => import('./pages/Doctors'));

// Lazy load admin layout
const AdminLayout = React.lazy(() => import('./layouts/AdminLayout'));

// Lazy load all admin pages
const AdminDashboard = React.lazy(() => import('./pages/admin/Dashboard'));
const AdminDoctors = React.lazy(() => import('./pages/admin/Doctors'));
const AdminServices = React.lazy(() => import('./pages/admin/Services'));
const AdminPartners = React.lazy(() => import('./pages/admin/Partners'));
const AdminGallery = React.lazy(() => import('./pages/admin/Gallery'));
const AdminBanners = React.lazy(() => import('./pages/admin/Banner'));
const AdminAbout = React.lazy(() => import('./pages/admin/About'));
const AdminUsers = React.lazy(() => import('./pages/admin/Users'));
const AdminReports = React.lazy(() => import('./pages/admin/Reports'));

// Context providers
import { StatisticsProvider } from './pages/admin/StatisticsContext';
import { ReportsProvider } from './pages/admin/ReportsContext';
import { ServicesProvider } from './pages/admin/ServicesContext';
import { PartnersProvider } from './pages/admin/PartnersContext';

import { isAdminAuthenticated } from './utils/auth';

// Loading fallback component
const LoadingFallback = () => (
  <div className="flex items-center justify-center min-h-screen">
    <div className="text-center">
      <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary-600 mb-2"></div>
      <p className="text-neutral-600">Loading...</p>
    </div>
  </div>
);

export interface User {
  _id: string;
  name: string;
  email: string;
  role: 'user' | 'admin';  // Update role to use specific union type
  lastLogin?: string;
  phone?: string;
}

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser) as User;
        setUser(parsedUser);
      } catch (error) {
        console.error('Error parsing user data:', error);
      }
    }
  }, []);

  const login = (data: AuthResponse) => {
    localStorage.setItem('token', data.token);
    localStorage.setItem('user', JSON.stringify(data.user));
    setUser(data.user as User);
    
    // Immediate redirect based on role
    if (data.user.role === 'admin') {
      navigate('/admin');
    } else {
      navigate('/');
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
  };

  // Define adapters for component props with different type signatures
  const loginAdapter = (data: { token: string; user: User }) => {
    login({
      token: data.token,
      user: {
        ...data.user,
        firstName: data.user.name.split(' ')[0] || '',
        lastName: data.user.name.split(' ').slice(1).join(' ') || ''
      }
    });
  };

  const PublicLayout: React.FC = () => (
    <ServicesProvider>
      <StatisticsProvider>
        <ReportsProvider>
          <div className="flex flex-col min-h-screen">
            <Header user={user} onLogout={logout} />
            <main className="flex-grow">
              <Suspense fallback={<LoadingFallback />}>
                <Outlet />
              </Suspense>
            </main>
            <Footer />
          </div>
        </ReportsProvider>
      </StatisticsProvider>
    </ServicesProvider>
  );

  const ProtectedAdminRoute: React.FC = () => {
    const location = useLocation();
  
    if (!isAdminAuthenticated()) {
      return <Navigate to="/login" state={{ from: location }} replace />;
    }
    return (
      <ServicesProvider>
        <StatisticsProvider>
          <ReportsProvider>
            <PartnersProvider>
              <Suspense fallback={<LoadingFallback />}>
                <AdminLayout />
              </Suspense>
            </PartnersProvider>
          </ReportsProvider>
        </StatisticsProvider>
      </ServicesProvider>
    );
  };

  return (
    <Routes>
      {/* Public routes */}
      <Route path="/" element={<PublicLayout />}>
        <Route index element={<Home />} />
        <Route path="about" element={<About />} />
        <Route path="services" element={<Services />} />
        <Route path="doctors" element={<Doctors />} />
        <Route path="login" element={<Login onLogin={loginAdapter} />} />
        <Route path="signup" element={<Signup onLogin={login} />} />
        <Route path="*" element={<NotFound />} />
      </Route>

      {/* Admin routes */}
      <Route path="/admin" element={<ProtectedAdminRoute />}>
        <Route index element={<AdminDashboard />} />
        <Route path="doctors" element={<AdminDoctors />} />
        <Route path="services" element={<AdminServices />} />
        <Route path="partners" element={<AdminPartners />} />
        <Route path="gallery" element={<AdminGallery />} />
        <Route path="banners" element={<AdminBanners />} />
        <Route path="about" element={<AdminAbout />} />
        <Route path="users" element={<AdminUsers />} />
        <Route path="reports" element={<AdminReports />} />
        <Route path="*" element={<div className="p-4">Admin page not found</div>} />
      </Route>
    </Routes>
  );
};

export default App;