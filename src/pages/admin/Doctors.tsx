// src/components/AdminDoctors.tsx
import React, { useState, useEffect } from 'react';
import { Pencil, Trash2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useReports } from './ReportsContext';
import {
  getDoctors,
  createDoctor,
  updateDoctor,
  deleteDoctor,
  Doctor,
} from '../../Api/api';
import { isAdminAuthenticated, adminLogout } from '../../utils/auth';
import { AxiosError } from 'axios';

interface DoctorFormData {
  name: string;
  specialty: string;
  image?: File;
  imagePreview?: string;
  status?: string;
}

const readFileAsDataURL = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};

const AdminDoctors: React.FC = () => {
  const navigate = useNavigate();
  const { addReport } = useReports();
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [editingDoctor, setEditingDoctor] = useState<Doctor | null>(null);
  const [editingImage, setEditingImage] = useState<File | null>(null);
  const [editingImagePreview, setEditingImagePreview] = useState<string>('');
  const [newDoctor, setNewDoctor] = useState<DoctorFormData>({
    name: '',
    specialty: '',
    imagePreview: '',
    status: 'active',
  });

  // Authentication guard
  useEffect(() => {
    if (!isAdminAuthenticated()) {
      adminLogout();
      navigate('/login', { replace: true });
    }
  }, [navigate]);

  // Initial data load
  useEffect(() => {
    loadDoctors();
  }, []);

  // When editing a doctor, reset the editing image state
  useEffect(() => {
    if (editingDoctor) {
      setEditingImage(null);
      setEditingImagePreview(editingDoctor.image || '');
    } else {
      setEditingImage(null);
      setEditingImagePreview('');
    }
  }, [editingDoctor]);

  const loadDoctors = async () => {
    try {
      console.log('Loading doctors...');
      const res = await getDoctors(); // res is already Doctor[]
      console.log('Doctors loaded:', res);
      setDoctors(res); // Remove .data access
    } catch (err) {
      console.error('Doctors fetch error:', err);
      setDoctors([]);
    }
  };


  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        const previewUrl = await readFileAsDataURL(file);
        setNewDoctor({
          ...newDoctor,
          image: file,
          imagePreview: previewUrl
        });
      } catch (error) {
        console.error('Error reading file:', error);
      }
    }
  };

  const handleEditFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && editingDoctor) {
      try {
        const previewUrl = await readFileAsDataURL(file);
        setEditingImage(file);
        setEditingImagePreview(previewUrl);
      } catch (error) {
        console.error('Error reading file for edit:', error);
      }
    }
  };

  const handleAddDoctor = async () => {
    if (!newDoctor.name || !newDoctor.specialty) {
      return alert('Please fill all required fields');
    }
    
    const formData = new FormData();
    formData.append('name', newDoctor.name);
    formData.append('specialty', newDoctor.specialty);
    formData.append('status', newDoctor.status || 'active');
    if (newDoctor.image) {
      formData.append('image', newDoctor.image);
    }

    try {
      await createDoctor(formData);
      addReport('Added new doctor', 'Doctors');
      setNewDoctor({
        name: '',
        specialty: '',
        imagePreview: '',
        status: 'active'
      });
      await loadDoctors();
    } catch (error: unknown) {
      handleApiError(error, 'Error creating doctor');
    }
  };

  const handleUpdateDoctor = async () => {
    if (!editingDoctor) return;
    
    const formData = new FormData();
    formData.append('name', editingDoctor.name);
    formData.append('specialty', editingDoctor.specialty);
    formData.append('status', editingDoctor.status || 'active');
    
    // Use the editingImage state if an image was selected
    if (editingImage) {
      console.log('Uploading new image for doctor update');
      formData.append('image', editingImage);
    }

    try {
      console.log('Updating doctor with data:', {
        name: editingDoctor.name,
        specialty: editingDoctor.specialty,
        status: editingDoctor.status,
        hasImage: !!editingImage
      });
      
      const result = await updateDoctor(editingDoctor._id, formData);
      console.log('Doctor update response:', result);
      
      addReport('Updated doctor', 'Doctors');
      setEditingDoctor(null);
      setEditingImage(null);
      setEditingImagePreview('');
      await loadDoctors();
    } catch (error: unknown) {
      handleApiError(error, 'Error updating doctor');
    }
  };

  const handleDeleteDoctor = async (id: string) => {
    if (!window.confirm('Delete this doctor?')) return;
    try {
      await deleteDoctor(id);
      addReport('Deleted doctor', 'Doctors');
      setDoctors(prev => prev.filter(d => d._id !== id));
    } catch (error: unknown) {
      handleApiError(error, 'Error deleting doctor');
    }
  };

  const handleApiError = (error: unknown, defaultMsg: string) => {
    let msg = defaultMsg;
    const axiosError = error as AxiosError<{ message?: string }>;
    if (axiosError.response?.data?.message) {
      msg = axiosError.response.data.message;
    } else if ((error as Error).message) {
      msg = (error as Error).message;
    }
    alert(msg);
  };

  return (
    <div className="p-6 space-y-8">
      {/* Add Doctor Form */}
      <div className="bg-white p-4 rounded shadow space-y-4">
        <h3 className="text-lg font-bold">Add Doctor</h3>
        <input
          type="file"
          onChange={handleFileChange}
          className="w-full border p-2 rounded"
          accept="image/*"
        />
        {newDoctor.imagePreview && (
          <img 
            src={newDoctor.imagePreview} 
            alt="Preview" 
            className="w-32 h-32 object-cover rounded mb-2"
          />
        )}
        <input
          className="w-full border p-2 rounded"
          placeholder="Name"
          value={newDoctor.name}
          onChange={(e) => setNewDoctor({ ...newDoctor, name: e.target.value })}
        />
        <input
          className="w-full border p-2 rounded"
          placeholder="Specialty"
          value={newDoctor.specialty}
          onChange={(e) => setNewDoctor({ ...newDoctor, specialty: e.target.value })}
        />
        <select
          className="w-full border p-2 rounded"
          value={newDoctor.status}
          onChange={(e) => setNewDoctor({ ...newDoctor, status: e.target.value })}
        >
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
        </select>
        <button
          onClick={handleAddDoctor}
          className="px-4 py-2 bg-primary-600 text-white rounded hover:bg-primary-700"
        >
          + Add Doctor
        </button>
      </div>

      {/* Doctors Table */}
      <div className="bg-white rounded shadow overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              {['Name', 'Specialty', 'Status', 'Image', 'Actions'].map((h) => (
                <th key={h} className="px-4 py-3 text-left">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {doctors?.map((d) => (
              <tr key={d._id}>
                <td className="px-4 py-3">{d.name}</td>
                <td className="px-4 py-3 capitalize">{d.specialty}</td>
                <td className="px-4 py-3">
                  <span className={`px-2 py-1 rounded ${d.status === 'inactive' ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'}`}>
                    {d.status || 'active'}
                  </span>
                </td>
                <td className="px-4 py-3">
                  {d.image && (
                    <img 
                      src={d.image} 
                      alt="Doctor" 
                      className="w-16 h-16 object-cover rounded"
                    />
                  )}
                </td>
                <td className="px-4 py-3 space-x-2">
                  <button onClick={() => setEditingDoctor(d)}>
                    <Pencil size={18} className="text-primary-600 hover:text-primary-900" />
                  </button>
                  <button onClick={() => handleDeleteDoctor(d._id)}>
                    <Trash2 size={18} className="text-red-600 hover:text-red-900" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Edit Modal */}
      {editingDoctor && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg w-96">
            <h3 className="text-lg font-bold mb-4">Edit Doctor</h3>
            <input
              type="file"
              onChange={handleEditFileChange}
              className="w-full border p-2 rounded mb-3"
              accept="image/*"
            />
            {editingImagePreview ? (
              <img 
                src={editingImagePreview} 
                alt="Preview" 
                className="w-32 h-32 object-cover rounded mb-2"
              />
            ) : editingDoctor.image ? (
              <img 
                src={editingDoctor.image} 
                alt="Preview" 
                className="w-32 h-32 object-cover rounded mb-2"
              />
            ) : (
              <div className="w-32 h-32 bg-gray-200 rounded mb-2 flex items-center justify-center">
                <span className="text-gray-500">No image</span>
              </div>
            )}
            <input
              className="w-full border p-2 rounded mb-3"
              placeholder="Name"
              value={editingDoctor.name}
              onChange={(e) => setEditingDoctor({ ...editingDoctor, name: e.target.value })}
            />
            <input
              className="w-full border p-2 rounded mb-3"
              placeholder="Specialty"
              value={editingDoctor.specialty}
              onChange={(e) => setEditingDoctor({ ...editingDoctor, specialty: e.target.value })}
            />
            <select
              className="w-full border p-2 rounded mb-4"
              value={editingDoctor.status || 'active'}
              onChange={(e) => setEditingDoctor({ ...editingDoctor, status: e.target.value })}
            >
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
            <div className="flex justify-end gap-2">
              <button onClick={() => setEditingDoctor(null)} className="px-4 py-2 text-gray-500">
                Cancel
              </button>
              <button onClick={handleUpdateDoctor} className="px-4 py-2 bg-primary-600 text-white rounded hover:bg-primary-700">
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDoctors;