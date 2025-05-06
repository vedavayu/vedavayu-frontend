import React, { useState } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Users,
  Stethoscope,
  Handshake,
  Image,
  Images,
  FileText,
  UserCog,
  Menu,
  X,
  LogOut,
  User,
} from 'lucide-react';
import VedavayuLogo from '/vedavayu-logo.png';

const AdminLayout: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const currentPath = location.pathname.split('/')[2] || '';
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const admin = JSON.parse(localStorage.getItem('user') || '{}'); // Fetch admin details from localStorage

  const menuItems = [
    { path: '', icon: <LayoutDashboard size={20} />, label: 'Dashboard' },
    { path: 'doctors', icon: <Users size={20} />, label: 'Doctors' },
    { path: 'services', icon: <Stethoscope size={20} />, label: 'Services' },
    { path: 'partners', icon: <Handshake size={20} />, label: 'Partners' },
    { path: 'gallery', icon: <Image size={20} />, label: 'Gallery' },
    { path: 'banners', icon: <Images size={20} />, label: 'Banner' },
    { path: 'about', icon: <FileText size={20} />, label: 'About' },
    { path: 'users', icon: <UserCog size={20} />, label: 'Users' },
    { path: 'reports', icon: <FileText size={20} />, label: 'Reports' },
  ];

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login', { replace: true });
  };

  return (
    <div className="min-h-screen bg-neutral-50">
      {/* Sidebar */}
      <aside
        className={`fixed left-0 top-0 h-screen w-64 bg-primary-800 text-white transition-transform duration-300 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
          } md:translate-x-0 z-20`}
      >
        <div className="p-4 flex items-center justify-between">
          <Link to="/" className="flex items-center space-x-2">
            <img src={VedavayuLogo} alt="Vedavayu Logo" className="h-12 w-auto" />
            <div className="flex flex-col">
              <span className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-primary-600 to-secondary-500">
                Vedavayu
              </span>
              <span className="text-sm font-bold text-transparent bg-clip-text bg-gradient-to-r from-primary-600 to-secondary-500">
                Admin Panel
              </span>
            </div>
          </Link>
          <button onClick={() => setIsSidebarOpen(false)} className="md:hidden text-white">
            <X size={24} />
          </button>
        </div>

        <nav className="mt-8">
          {menuItems.map((item) => (
            <Link
              key={item.path}
              to={`/admin/${item.path}`}
              className={`flex items-center space-x-3 px-6 py-3 text-sm font-medium transition-colors ${currentPath === item.path
                  ? 'bg-primary-700 text-white'
                  : 'text-white/80 hover:bg-primary-700 hover:text-white'
                }`}
              onClick={() => setIsSidebarOpen(false)}
            >
              {item.icon}
              <span>{item.label}</span>
            </Link>
          ))}
        </nav>

        {/* Logout Button */}
        <div className="absolute bottom-0 left-0 right-0 p-4">
          <button
            onClick={handleLogout}
            className="flex items-center space-x-3 px-6 py-3 text-sm font-medium text-red-400 hover:bg-primary-700 hover:text-red-300 transition-colors w-full"
          >
            <LogOut size={20} />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="md:ml-64">
        {/* Header */}
        <header className="bg-white h-16 fixed right-0 left-0 md:left-64 top-0 border-b border-neutral-200 z-10">
          <div className="px-6 h-full flex items-center justify-between">
            <button
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="md:hidden text-neutral-600 hover:text-primary-600"
            >
              <Menu size={24} />
            </button>
            <div className="flex-1"></div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <div className="w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center text-primary-600 font-medium">
                  {admin.name?.charAt(0).toUpperCase() || <User size={20} />}
                </div>
                <div className="text-sm">
                  <p className="font-medium text-neutral-800">{admin.name || 'Admin'}</p>
                  <p className="text-neutral-500 text-xs">{admin.email || 'admin@example.com'}</p>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="pt-16 min-h-screen">
          <div className="p-6">
            <Outlet /> {/* Render nested routes */}
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;