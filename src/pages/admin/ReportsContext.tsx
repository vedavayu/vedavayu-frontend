import React, { createContext, useContext, useState, useEffect } from 'react';
import { StatisticsContext } from './StatisticsContext';

interface Report {
  id: number;
  action: string;
  user: string;
  timestamp: string;
  section: string;
}

interface Statistics {
  patientsTreated: number;
  testReports: number;
  hoursSupport: number;
  recoveryRate: number;
}

interface ReportsContextType {
  reports: Report[];
  addReport: (action: string, section: string, statType?: keyof Statistics) => void;
}

const ReportsContext = createContext<ReportsContextType>({} as ReportsContextType);

export const ReportsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const statisticsContext = useContext(StatisticsContext);

  if (!statisticsContext) {
    throw new Error('ReportsProvider must be used within a StatisticsProvider');
  }

  const { statistics, updateStatistics } = statisticsContext;

  const [reports, setReports] = useState<Report[]>(() => {
    const saved = localStorage.getItem('reports');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem('reports', JSON.stringify(reports));
  }, [reports]);

  const addReport = (action: string, section: string, statType?: keyof Statistics) => {
    const newReport: Report = {
      id: Date.now(),
      action,
      user: 'Admin',
      timestamp: new Date().toLocaleString(),
      section,
    };
    setReports((prev) => [newReport, ...prev]);

    if (statType && statistics && updateStatistics) {
      const currentValue = statistics[statType];
      updateStatistics({ [statType]: currentValue + 1 });
    }
  };

  return (
    <ReportsContext.Provider value={{ reports, addReport }}>
      {children}
    </ReportsContext.Provider>
  );
};

export const useReports = () => useContext(ReportsContext);