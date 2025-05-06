import { createContext, useState, useContext, ReactNode, useEffect } from 'react';
import { Partner, getPartners, createPartner, updatePartner as updatePartnerAPI, deletePartner } from '../../Api/api';

interface PartnerFormData {
  name: string;
  logo: File | null;
  ownerPhoto: File | null;
}

interface PartnersContextType {
  partners: Partner[];
  loading: boolean;
  error: string | null;
  fetchPartners: () => Promise<void>;
  addPartner: (partnerData: PartnerFormData) => Promise<void>;
  removePartner: (id: string) => Promise<void>;
  updatePartner: (id: string, partnerData: PartnerFormData) => Promise<void>;
}

const PartnersContext = createContext<PartnersContextType | undefined>(undefined);

export const PartnersProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [partners, setPartners] = useState<Partner[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchPartners = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getPartners();
      setPartners(data);
    } catch (err) {
      console.error('Error fetching partners:', err);
      setError('Failed to load partners. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPartners();
  }, []);

  const addPartner = async (partnerData: PartnerFormData) => {
    setLoading(true);
    setError(null);
    try {
      const formData = new FormData();
      formData.append('name', partnerData.name);
      if (partnerData.logo) {
        formData.append('logo', partnerData.logo);
      }
      if (partnerData.ownerPhoto) {
        formData.append('ownerPhoto', partnerData.ownerPhoto);
      }

      const newPartner = await createPartner(formData);
      setPartners([...partners, newPartner]);
    } catch (err) {
      console.error('Error adding partner:', err);
      setError('Failed to add partner. Please try again.');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const removePartner = async (id: string) => {
    setLoading(true);
    setError(null);
    try {
      await deletePartner(id);
      setPartners(partners.filter(partner => partner._id !== id));
    } catch (err) {
      console.error('Error removing partner:', err);
      setError('Failed to remove partner. Please try again.');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updatePartner = async (id: string, partnerData: PartnerFormData) => {
    setLoading(true);
    setError(null);
    try {
      const formData = new FormData();
      formData.append('name', partnerData.name);
      if (partnerData.logo) {
        formData.append('logo', partnerData.logo);
      }
      if (partnerData.ownerPhoto) {
        formData.append('ownerPhoto', partnerData.ownerPhoto);
      }

      const updated = await updatePartnerAPI(id, formData);
      setPartners(partners.map(partner => partner._id === id ? updated : partner));
    } catch (err) {
      console.error('Error updating partner:', err);
      setError('Failed to update partner. Please try again.');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return (
    <PartnersContext.Provider value={{ 
      partners, 
      loading, 
      error, 
      fetchPartners, 
      addPartner, 
      removePartner, 
      updatePartner 
    }}>
      {children}
    </PartnersContext.Provider>
  );
};

export const usePartners = () => {
  const context = useContext(PartnersContext);
  if (!context) {
    throw new Error('usePartners must be used within a PartnersProvider');
  }
  return context;
};