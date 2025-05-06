import React, { createContext, useState, useContext, useEffect } from 'react';
import api from '../../Api/api';

export interface StatisticsData {
  _id?: string;
  patientsTreated: number;
  testReports: number;
  hoursSupport: number;
  recoveryRate: number;
  updatedAt?: string;
}

interface StatisticsContextType {
  statistics: StatisticsData | null;
  loading: boolean;
  error: string | null;
  fetchStatistics: () => Promise<void>;
  updateStatistics: (data: Partial<StatisticsData>) => Promise<boolean>;
}

const defaultStatistics: StatisticsData = {
  patientsTreated: 0,
  testReports: 0,
  hoursSupport: 0,
  recoveryRate: 0
};

// Export StatisticsContext as a named export as well
export const StatisticsContext = createContext<StatisticsContextType>({
  statistics: defaultStatistics,
  loading: false,
  error: null,
  fetchStatistics: async () => {},
  updateStatistics: async () => false
});

export const useStatistics = () => useContext(StatisticsContext);

export const StatisticsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [statistics, setStatistics] = useState<StatisticsData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchStatistics = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await api.get('/statistics');
      setStatistics(response.data);
    } catch (err) {
      console.error('Error fetching statistics:', err);
      setError('Failed to load statistics data');
    } finally {
      setLoading(false);
    }
  };

  const updateStatistics = async (data: Partial<StatisticsData>) => {
    try {
      setLoading(true);
      setError(null);
      const response = await api.put('/statistics', data);
      if (response.data.success) {
        setStatistics(response.data.statistics);
        return true;
      }
      return false;
    } catch (err) {
      console.error('Error updating statistics:', err);
      setError('Failed to update statistics data');
      return false;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStatistics();
  }, []);

  return (
    <StatisticsContext.Provider value={{ statistics, loading, error, fetchStatistics, updateStatistics }}>
      {children}
    </StatisticsContext.Provider>
  );
};

export default StatisticsContext;