// src/components/AdminUsers.tsx
import React, { useState, useEffect } from 'react';
import { Pencil, Trash2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useReports } from './ReportsContext';
import {
  fetchUsers,
  createUser,
  deleteUser,
  updateUser,
  User,
} from '../../Api/api';
import { isAdminAuthenticated, adminLogout } from '../../utils/auth';
import { AxiosError } from 'axios';

interface UserFormData {
  name: string;
  email: string;
  phone: string;
  role: 'user' | 'admin';
  password: string;
}

const AdminUsers: React.FC = () => {
  const navigate = useNavigate();
  const { addReport } = useReports();
  const [users, setUsers] = useState<User[]>([]);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [newUser, setNewUser] = useState<UserFormData>({
    name: '',
    email: '',
    phone: '',
    role: 'user',
    password: 'TempPass123',
  });

  // Redirect non-admins
  useEffect(() => {
    if (!isAdminAuthenticated()) {
      adminLogout();
      navigate('/login', { replace: true });
    }
  }, [navigate]);

  // Load users once
  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      const res = await fetchUsers();
      setUsers(res);
    } catch (err) {
      console.error('User fetch error:', err);
      alert('Failed to load users: ' + ((err as AxiosError<{ message?: string }>).response?.data?.message || 'Unknown error'));
      setUsers([]);
    }
  };
  
  const handleAddUser = async () => {
    if (!newUser.name || !newUser.email || !newUser.phone) {
      alert('Please fill all fields');
      return;
    }
    try {
      await createUser(newUser);
      await loadUsers();
      setNewUser({ 
        name: '', 
        email: '', 
        phone: '', 
        role: 'user',
        password: 'TempPass123'
      });
      addReport('Added new user', 'Users');
    } catch (error) {
      const err = error as AxiosError<{ message?: string }>;
      alert(err.response?.data?.message || 'Failed to create user');
    }
  };

  const handleDeleteUser = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this user?')) return;
    try {
      await deleteUser(id);
      addReport('Deleted user', 'Users');
      setUsers((prev) => prev.filter((u) => u._id !== id));
    } catch (error: unknown) {
      let msg = 'Error deleting user';
      if ((error as AxiosError<{ message?: string }>).response?.data?.message) {
        msg = (error as AxiosError<{ message: string }>).response!.data.message;
      } else if ((error as Error).message) {
        msg = (error as Error).message;
      }
      alert(msg);
    }
  };

  const handleUpdateUser = async () => {
    if (!editingUser) return;
    try {
      await updateUser(editingUser._id, {
        name: editingUser.name,
        email: editingUser.email,
        phone: editingUser.phone,
        role: editingUser.role
      });
      await loadUsers();
      setEditingUser(null);
      addReport('Updated user', 'Users');
    } catch (error) {
      alert(error instanceof Error ? error.message : 'Failed to update user');
    }
  };

  return (
    <div className="p-6 space-y-8">
      {/* Add User */}
      <div className="bg-white p-4 rounded shadow space-y-4">
        <h3 className="text-lg font-bold">Add User</h3>
        {(['name','email','phone'] as const).map((field) => (
          <input
            key={field}
            className="w-full border p-2 rounded"
            placeholder={field.charAt(0).toUpperCase()+field.slice(1)}
            value={(newUser as any)[field]}
            onChange={(e) =>
              setNewUser({ ...newUser, [field]: e.target.value })
            }
          />
        ))}
        <select
          className="w-full border p-2 rounded"
          value={newUser.role}
          onChange={(e) =>
            setNewUser({ ...newUser, role: e.target.value as any })
          }
        >
          <option value="user">User</option>
          <option value="admin">Admin</option>
        </select>
        <button
          onClick={handleAddUser}
          className="px-4 py-2 bg-primary-600 text-white rounded hover:bg-primary-700"
        >
          + Add User
        </button>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded shadow overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              {['Name','Email','Phone','Role'].map((h) => (
                <th key={h} className="px-4 py-3 text-left">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {users?.map((u) => (
              <tr key={u._id}>
                <td className="px-4 py-3">{u.email}</td>
                <td className="px-4 py-3">{u.phone}</td>
                <td className="px-4 py-3 capitalize">{u.role}</td>
                <td className="px-4 py-3 space-x-2">
                  <button onClick={() => setEditingUser(u)}>
                    <Pencil size={18} className="text-primary-600 hover:text-primary-900" />
                  </button>
                  <button onClick={() => handleDeleteUser(u._id)}>
                    <Trash2 size={18} className="text-red-600 hover:text-red-900" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Edit Modal */}
      {editingUser && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg w-96">
            <h3 className="text-lg font-bold mb-4">Edit User</h3>
            {(['name','email','phone'] as const).map((field) => (
              <input
                key={field}
                className="w-full border p-2 rounded mb-3"
                placeholder={field.charAt(0).toUpperCase()+field.slice(1)}
                value={(editingUser as any)[field]}
                onChange={(e) =>
                  setEditingUser({ ...editingUser, [field]: e.target.value } as User)
                }
              />
            ))}
            <select
              className="w-full border p-2 rounded mb-4"
              value={editingUser.role}
              onChange={(e) =>
                setEditingUser({ ...editingUser, role: e.target.value as any } as User)
              }
            >
              <option value="user">User</option>
              <option value="admin">Admin</option>
            </select>
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setEditingUser(null)}
                className="px-4 py-2 text-gray-500"
              >
                Cancel
              </button>
              <button
                onClick={handleUpdateUser}
                className="px-4 py-2 bg-primary-600 text-white rounded hover:bg-primary-700"
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

export default AdminUsers;