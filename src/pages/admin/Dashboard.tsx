import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Users, FileText, Image as ImageIcon, Stethoscope } from 'lucide-react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { useStatistics } from './StatisticsContext';
import { useReports } from './ReportsContext';
import { isAdminAuthenticated, adminLogout } from '../../utils/auth';
import { getBanners, getDoctors, fetchUsers } from '../../Api/api';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const [banners, setBanners] = useState<any[]>([]);
  const [doctors, setDoctors] = useState<any[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  const { reports } = useReports();

  useEffect(() => {
    if (!isAdminAuthenticated()) {
      navigate('/login');
      return;
    }
    
    const raw = localStorage.getItem('user');
    try {
      const user = raw ? JSON.parse(raw) : null;
      if (!user || user.role !== 'admin') {
        adminLogout();
        navigate('/login');
      }
    } catch {
      adminLogout();
      navigate('/login');
    }

    const fetchData = async () => {
      try {
        const [bannersData, doctorsData, usersData] = await Promise.all([
          getBanners(),
          getDoctors(),
          fetchUsers()
        ]);
        setBanners(bannersData);
        setDoctors(doctorsData);
        setUsers(usersData);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    fetchData();
  }, [navigate]);

  const { statistics, loading, updateStatistics } = useStatistics();
  const { addReport } = useReports();

  const defaultStats = {
    patientsTreated: 0,
    testReports: 0,
    hoursSupport: 0,
    recoveryRate: 0
  };

  const [localStats, setLocalStats] = useState(defaultStats);

  useEffect(() => {
    if (statistics) {
      setLocalStats(statistics);
    }
  }, [statistics]);

  const handleUpdate = () => {
    if (!statistics) return;
    
    const changes: Partial<typeof defaultStats> = {};
    const messages: string[] = [];

    (Object.keys(localStats) as Array<keyof typeof localStats>).forEach((key) => {
      if (statistics && localStats[key] !== statistics[key]) {
        changes[key] = localStats[key];
        messages.push(
          `${key.replace(/([A-Z])/g, ' $1')} to ${localStats[key]}`
        );
      }
    });

    if (Object.keys(changes).length > 0) {
      updateStatistics(changes);
      addReport(`Updated statistics: ${messages.join(', ')}`, 'Statistics');
    }
  };

  const statsOverview = [
    {
      title: 'Total Banners',
      value: banners.length.toString(),
      icon: <ImageIcon size={24} className="text-primary-600" />,
    },
    { 
      title: 'Total Doctors',
      value: doctors.length.toString(),
      icon: <Stethoscope size={24} className="text-primary-600" />,
    },
    { 
      title: 'Total Users',
      value: users.length.toString(),
      icon: <Users size={24} className="text-primary-600" />,
    },
    { 
      title: 'Reports',
      value: reports.length.toString(),
      icon: <FileText size={24} className="text-primary-600" />,
    },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary-600 mb-2"></div>
          <p className="text-neutral-600">Loading dashboard data...</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-2xl font-semibold text-neutral-800 mb-6">Dashboard</h1>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {statsOverview.map((stat, idx) => (
          <div key={idx} className="bg-white p-6 rounded-lg shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-neutral-600">{stat.title}</p>
                <h3 className="text-2xl font-semibold text-neutral-800 mt-1">{stat.value}</h3>
              </div>
              {stat.icon}
            </div>
          </div>
        ))}
      </div>

      {/* Batch Update Statistics Section */}
      <div className="bg-white p-6 rounded-lg shadow-sm">
        <h2 className="text-lg font-semibold text-neutral-800 mb-4">Update Home Page Statistics</h2>
        {!localStats ? (
          <p className="text-neutral-600">No statistics data available</p>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-1">Patients Treated</label>
                <input
                  type="number"
                  value={localStats.patientsTreated ?? 0}
                  onChange={(e) =>
                    setLocalStats((prev) => ({ ...prev, patientsTreated: Number(e.target.value) }))
                  }
                  className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-1">Test Reports</label>
                <input
                  type="number"
                  value={localStats.testReports ?? 0}
                  onChange={(e) =>
                    setLocalStats((prev) => ({ ...prev, testReports: Number(e.target.value) }))
                  }
                  className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-1">Hours Support</label>
                <input
                  type="number"
                  value={localStats.hoursSupport ?? 0}
                  onChange={(e) =>
                    setLocalStats((prev) => ({ ...prev, hoursSupport: Number(e.target.value) }))
                  }
                  className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-1">Recovery Rate (%)</label>
                <input
                  type="number"
                  value={localStats.recoveryRate ?? 0}
                  onChange={(e) =>
                    setLocalStats((prev) => ({ ...prev, recoveryRate: Number(e.target.value) }))
                  }
                  className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>
            </div>
            <div className="mt-6 flex justify-end">
              <button
                onClick={handleUpdate}
                className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 transition-colors"
              >
                Update Statistics
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Dashboard;