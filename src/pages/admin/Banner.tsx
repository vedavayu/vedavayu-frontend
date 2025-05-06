import React, { useState, useEffect } from 'react';
import { Plus, Pencil, Trash2, Link as LinkIcon } from 'lucide-react';
import { useReports } from './ReportsContext';
import {
  getBanners,
  createBanner,
  updateBanner,
  deleteBanner,
  Banner,
} from '../../Api/api';

const AdminBanners: React.FC = () => {
  const { addReport } = useReports();
  const [banners, setBanners] = useState<Banner[]>([]);
  const [editingBanner, setEditingBanner] = useState<Banner | null>(null);

  // Load all banners on mount
  useEffect(() => {
    (async () => {
      try {
        const data = await getBanners();
        setBanners(data);
      } catch (err) {
        console.error('Error loading banners:', err);
      }
    })();
  }, []);

  // Add a placeholder banner, then open it for editing
  const handleAddBanner = async () => {
    try {
      // Check if we have a token for authentication
      const token = localStorage.getItem('token');
      if (!token) {
        alert("You must be logged in as an admin to create banners");
        return;
      }
      
      // Ensure we're sending data that matches the server's expected format
      const newBanner = await createBanner({
        title: 'New Banner',
        date: new Date().toISOString().split('T')[0], // Format as YYYY-MM-DD
        time: '09:00 AM',
        registrationLink: 'https://example.com/register',
      });
      
      setBanners((prev) => [...prev, newBanner]);
      setEditingBanner(newBanner);
      addReport('Added new banner', 'Banners');
    } catch (err: any) {
      console.error('Failed to add banner:', err);
      // Show helpful error message based on error type
      if (err.response?.status === 401) {
        alert("Authentication error: Please login again with admin privileges");
      } else if (err.response?.status === 400) {
        alert("Invalid banner data: " + (err.response?.data?.message || "Please check your input"));
      } else {
        alert("Error creating banner: " + (err.message || "Unknown error occurred"));
      }
    }
  };

  // Delete by _id
  const handleDeleteBanner = async (_id: string) => {
    try {
      await deleteBanner(_id);
      setBanners((prev) => prev.filter((b) => b._id !== _id));
      addReport('Deleted banner', 'Banners');
    } catch (err) {
      console.error('Failed to delete banner:', err);
    }
  };

  // Save edits back to the server
  const handleSaveBanner = async (banner: Banner) => {
    try {
      const saved = await updateBanner(banner._id, banner);
      setBanners((prev) =>
        prev.map((b) => (b._id === saved._id ? saved : b))
      );
      setEditingBanner(null);
      addReport('Edited banner details', 'Banners');
    } catch (err) {
      console.error('Failed to update banner:', err);
    }
  };

  return (
    <div>
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-neutral-800">
          Manage Banners
        </h1>
        <button
          onClick={handleAddBanner}
          className="flex items-center px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 transition-colors"
        >
          <Plus size={20} className="mr-2" />
          Add New Banner
        </button>
      </div>

      {/* Banners Table */}
      <div className="bg-white rounded-lg shadow-sm overflow-x-auto">
        <table className="w-full">
          <thead className="bg-neutral-50 border-y border-neutral-200">
            <tr>
              <th className="px-6 py-3 text-left text-sm font-medium text-neutral-500">
                Title
              </th>
              <th className="px-6 py-3 text-left text-sm font-medium text-neutral-500">
                Date
              </th>
              <th className="px-6 py-3 text-left text-sm font-medium text-neutral-500">
                Time
              </th>
              <th className="px-6 py-3 text-left text-sm font-medium text-neutral-500">
                Registration Link
              </th>
              <th className="px-6 py-3 text-left text-sm font-medium text-neutral-500">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-200">
            {banners.map((banner) => (
              <tr key={banner._id}>
                <td className="px-6 py-4 text-sm text-neutral-800">
                  {banner.title}
                </td>
                <td className="px-6 py-4 text-sm text-neutral-600">
                  {new Date(banner.date).toLocaleDateString()}
                </td>
                <td className="px-6 py-4 text-sm text-neutral-600">
                  {banner.time}
                </td>
                <td className="px-6 py-4 text-sm text-neutral-600">
                  <a
                    href={banner.registrationLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center text-primary-600 hover:text-primary-700"
                  >
                    <LinkIcon size={16} className="mr-1" />
                    Open Link
                  </a>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center space-x-3">
                    <button
                      onClick={() => setEditingBanner(banner)}
                      className="text-neutral-600 hover:text-primary-600"
                    >
                      <Pencil size={18} />
                    </button>
                    <button
                      onClick={() => handleDeleteBanner(banner._id)}
                      className="text-neutral-600 hover:text-red-600"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Edit / Create Modal */}
      {editingBanner && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg w-full max-w-md">
            <h3 className="text-lg font-bold mb-4">
              {editingBanner._id ? 'Edit Banner' : 'Create Banner'}
            </h3>
            {['title', 'date', 'time', 'registrationLink'].map((field) => (
              <input
                key={field}
                type="text"
                placeholder={field.charAt(0).toUpperCase() + field.slice(1)}
                value={(editingBanner as any)[field]}
                onChange={(e) =>
                  setEditingBanner((prev) =>
                    prev ? { ...prev, [field]: e.target.value } : prev
                  )
                }
                className="w-full mb-4 p-2 border rounded"
              />
            ))}
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setEditingBanner(null)}
                className="px-4 py-2 text-gray-500"
              >
                Cancel
              </button>
              <button
                onClick={() => handleSaveBanner(editingBanner!)}
                className="px-4 py-2 bg-primary-600 text-white rounded"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminBanners;
