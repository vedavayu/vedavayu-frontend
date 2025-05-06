import React, { useState } from 'react';
import { Pencil, Trash2, Plus } from 'lucide-react';
import { useReports } from './ReportsContext';
import { createService, updateService, deleteService } from '../../Api/api';
import { useServices } from './ServicesContext';
import * as LucideIcons from 'lucide-react';

interface Service {
  _id: string;
  name: string;
  description: string;
  icon: string;
}

const availableIcons = [
  'Stethoscope', 'Brain', 'HeartPulse', 'Thermometer', 'Salad',
  'Activity', 'Pill', 'Apple', 'Droplet', 'Flame', 'Leaf', 'Moon', 'Sun',
  'Users', 'Zap'
];

const AdminServices = () => {
  const { services = [], refreshServices } = useServices();
  const { addReport } = useReports();
  const [editingService, setEditingService] = useState<Service | null>(null);

  const handleAddService = async () => {
    try {
      await createService({
        name: 'New Service',
        description: 'Description TBD',
        icon: 'HeartPulse'
      });
      await refreshServices();
      addReport('Added new service', 'Services');
    } catch (error) {
      alert(error instanceof Error ? error.message : 'Failed to add service');
    }
  };

  const handleDeleteService = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this service?')) return;
    try {
      await deleteService(id);
      await refreshServices();
      addReport('Deleted service', 'Services');
    } catch (error) {
      console.error('Error deleting service:', error);
      alert('Failed to delete service. Please try again.');
    }
  };
  
  const handleSaveService = async (updatedService: Service) => {
    try {
      await updateService(updatedService._id, updatedService);
      await refreshServices();
      setEditingService(null);
      addReport('Updated service', 'Services');
    } catch (error) {
      alert(error instanceof Error ? error.message : 'Failed to update service');
    }
  };
  
  const handleIconSelect = (icon: string) => {
    if (editingService) {
      setEditingService({ ...editingService, icon });
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-neutral-800">Manage Services</h1>
        <button
          onClick={handleAddService}
          className="flex items-center px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 transition-colors"
        >
          <Plus size={20} className="mr-2" />
          Add New Service
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {services?.map((service) => (
          <div key={service._id} className="bg-white rounded-lg shadow-sm overflow-hidden">
            <div className="p-4">
              <h3 className="text-lg font-medium text-neutral-800">{service.name}</h3>
              <p className="text-sm text-neutral-600 mt-1">{service.description}</p>
              <div className="flex items-center space-x-3 mt-4">
                <button
                  onClick={() => setEditingService(service)}
                  className="text-neutral-600 hover:text-primary-600"
                >
                  <Pencil size={18} />
                </button>
                <button
                  onClick={() => handleDeleteService(service._id)}
                  className="text-neutral-600 hover:text-red-600"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {editingService && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg w-full max-w-md">
            <h3 className="text-lg font-bold mb-4">Edit Service</h3>
            <input
              value={editingService.name}
              onChange={(e) =>
                setEditingService({ ...editingService, name: e.target.value })
              }
              className="w-full mb-4 p-2 border rounded"
              placeholder="Service Name"
            />
            <textarea
              value={editingService.description}
              onChange={(e) =>
                setEditingService({ ...editingService, description: e.target.value })
              }
              className="w-full mb-4 p-2 border rounded"
              placeholder="Service Description"
              rows={4}
            />
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">Select Icon</label>
              <div className="grid grid-cols-3 gap-2">
                {availableIcons.map((iconName) => {
                  const IconComponent = LucideIcons[iconName as keyof typeof LucideIcons] as React.ElementType;
                  return (
                    <button
                      key={iconName}
                      onClick={() => handleIconSelect(iconName)}
                      className={`p-2 border rounded ${
                        editingService.icon === iconName ? 'border-primary-600' : 'border-gray-300'
                      }`}
                    >
                      {IconComponent && <IconComponent size={24} />}
                    </button>
                  );
                })}
              </div>
            </div>
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setEditingService(null)}
                className="px-4 py-2 text-gray-500"
              >
                Cancel
              </button>
              <button
                onClick={() => handleSaveService(editingService)}
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

export default AdminServices;