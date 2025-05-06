// src/context/ServicesContext.tsx
import React, { createContext, useContext, ReactNode, useEffect, useState } from 'react';
import { getServices, Service } from '../../Api/api';

interface ServicesContextType {
  services: Service[];
  refreshServices: () => Promise<void>;
}

const ServicesContext = createContext<ServicesContextType | undefined>(undefined);

export const ServicesProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [services, setServices] = useState<Service[]>([]);

  const refreshServices = async () => {
    try {
      const res = await getServices(); // res is already Service[]
      setServices(res); // Remove .data access
    } catch (err) {
      console.error('Error fetching services:', err);
      setServices([]);
    }
  };

  useEffect(() => {
    refreshServices();
  }, []);

  return (
    <ServicesContext.Provider value={{ services, refreshServices }}>
      {children}
    </ServicesContext.Provider>
  );
};

export const useServices = () => {
  const ctx = useContext(ServicesContext);
  if (!ctx) throw new Error('useServices must be used within ServicesProvider');
  return ctx;
};