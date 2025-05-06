import { useState } from 'react';
import { usePartners } from './PartnersContext';
import { useReports } from './ReportsContext';
import { Plus, Trash2, Pencil, X } from 'lucide-react';
import { Partner } from '../../Api/api';

// Create a local form state interface
interface PartnerFormState {
  name: string;
  logoPreview: string;
  ownerPhotoPreview: string;
  logo: File | null; // Changed from logoFile to logo
  ownerPhoto: File | null; // Changed from ownerPhotoFile to ownerPhoto
}

const AdminPartners = () => {
  const { partners, addPartner, removePartner, updatePartner } = usePartners();
  const { addReport } = useReports();
  const [modalType, setModalType] = useState<'add' | 'edit' | null>(null);
  const [formState, setFormState] = useState<PartnerFormState>({
    name: '',
    logoPreview: '',
    ownerPhotoPreview: '',
    logo: null,
    ownerPhoto: null
  });
  const [selectedPartnerId, setSelectedPartnerId] = useState<string | null>(null);

  const openAddModal = () => {
    setModalType('add');
    setFormState({
      name: '',
      logoPreview: '',
      ownerPhotoPreview: '',
      logo: null,
      ownerPhoto: null
    });
    setSelectedPartnerId(null);
  };

  const openEditModal = (partner: Partner) => {
    setModalType('edit');
    setFormState({
      name: partner.name,
      logoPreview: partner.logo || '',
      ownerPhotoPreview: partner.ownerPhoto || '',
      logo: null,
      ownerPhoto: null
    });
    setSelectedPartnerId(partner._id);
  };

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormState(prev => ({
          ...prev,
          logoPreview: reader.result as string,
          logo: file
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleOwnerPhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormState(prev => ({
          ...prev,
          ownerPhotoPreview: reader.result as string,
          ownerPhoto: file
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = async () => {
    try {
      if (modalType === 'add') {
        if (!formState.name) {
          alert('Please provide a partner name');
          return;
        }
        
        await addPartner({
          name: formState.name,
          logo: formState.logo,
          ownerPhoto: formState.ownerPhoto
        });
        addReport('Added new partner', 'Partners');
      } else if (modalType === 'edit' && selectedPartnerId) {
        await updatePartner(selectedPartnerId, {
          name: formState.name,
          logo: formState.logo,
          ownerPhoto: formState.ownerPhoto
        });
        addReport('Edited partner details', 'Partners');
      }
      setModalType(null);
    } catch (error) {
      console.error('Error saving partner:', error);
      alert('There was an error saving the partner. Please try again.');
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-neutral-800">Manage Partners</h1>
        <button
          onClick={openAddModal}
          className="flex items-center px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 transition-colors"
        >
          <Plus size={20} className="mr-2" />
          Add New Partner
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {partners.map((partner) => (
          <div key={partner._id} className="bg-white p-6 rounded-lg shadow-sm">
            <img
              src={partner.logo}
              alt={partner.name}
              className="w-full h-32 object-contain mb-4"
            />
            <div className="text-center">
              <h3 className="text-neutral-800 font-medium">{partner.name}</h3>
              <div className="flex justify-center space-x-4 mt-4">
                <button
                  onClick={() => openEditModal(partner)}
                  className="text-primary-600 hover:text-primary-700 flex items-center"
                >
                  <Pencil size={18} className="mr-2" />
                  Edit
                </button>
                <button
                  onClick={() => {
                    if (window.confirm(`Are you sure you want to remove ${partner.name}?`)) {
                      removePartner(partner._id);
                      addReport('Removed partner', 'Partners');
                    }
                  }}
                  className="text-red-600 hover:text-red-700 flex items-center"
                >
                  <Trash2 size={18} className="mr-2" />
                  Remove
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {modalType && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold">{modalType === 'add' ? 'Add Partner' : 'Edit Partner'}</h3>
              <button 
                onClick={() => setModalType(null)}
                className="text-neutral-500 hover:text-neutral-700"
              >
                <X size={24} />
              </button>
            </div>
            
            <form onSubmit={(e) => { e.preventDefault(); handleSave(); }}>
              <div className="mb-4">
                <label className="block text-sm font-medium text-neutral-700 mb-1">
                  Partner Name
                </label>
                <input
                  type="text"
                  value={formState.name}
                  onChange={(e) => setFormState(prev => ({ ...prev, name: e.target.value }))}
                  className="w-full p-2 border border-neutral-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                  placeholder="Enter partner name"
                  required
                />
              </div>
              
              <div className="mb-4">
                <label className="block text-sm font-medium text-neutral-700 mb-1">
                  Partner Logo (without bg & 1:1 ratio)
                </label>
                <div className="flex flex-col items-center">
                  {formState.logoPreview && (
                    <img
                      src={formState.logoPreview}
                      alt="Logo preview"
                      className="w-32 h-32 object-contain mb-2 border rounded-md"
                    />
                  )}
                  <input
                    type="file"
                    onChange={handleLogoChange}
                    className="w-full text-sm text-neutral-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-primary-50 file:text-primary-600 hover:file:bg-primary-100"
                    accept="image/*"
                  />
                </div>
              </div>
              
              <div className="mb-4">
                <label className="block text-sm font-medium text-neutral-700 mb-1">
                  Owner Photo (1:1 ratio)
                </label>
                <div className="flex flex-col items-center">
                  {formState.ownerPhotoPreview && (
                    <img
                      src={formState.ownerPhotoPreview}
                      alt="Owner photo preview"
                      className="w-32 h-32 object-cover mb-2 border rounded-md"
                    />
                  )}
                  <input
                    type="file"
                    onChange={handleOwnerPhotoChange}
                    className="w-full text-sm text-neutral-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-primary-50 file:text-primary-600 hover:file:bg-primary-100"
                    accept="image/*"
                  />
                </div>
              </div>
              
              <div className="flex justify-end space-x-3 mt-6">
                <button
                  type="button"
                  onClick={() => setModalType(null)}
                  className="px-4 py-2 text-neutral-700 border border-neutral-300 rounded-md hover:bg-neutral-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 transition-colors"
                >
                  {modalType === 'add' ? 'Add Partner' : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminPartners;