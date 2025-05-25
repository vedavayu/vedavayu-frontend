import React, { useEffect, useState, createContext, useContext } from 'react';

interface ApiStatusContextType {
  isServerHealthy: boolean;
  checkServerHealth: () => Promise<boolean>;
  usingFallback: boolean;
}

const ApiStatusContext = createContext<ApiStatusContextType>({
  isServerHealthy: true,
  checkServerHealth: async () => true,
  usingFallback: false,
});

export function useApiStatus() {
  return useContext(ApiStatusContext);
}

interface ApiStatusProviderProps {
  children: React.ReactNode;
}

export function ApiStatusProvider({ children }: ApiStatusProviderProps) {
  const [isServerHealthy, setIsServerHealthy] = useState<boolean>(true);
  const [usingFallback, setUsingFallback] = useState<boolean>(false);

  const checkServerHealth = async (): Promise<boolean> => {
    try {
      // First try the main API URL
      const mainApiUrl = import.meta.env.VITE_API_BASE_URL;
      const response = await fetch(`${mainApiUrl}/api/health`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      });
      
      if (response.ok) {
        setIsServerHealthy(true);
        setUsingFallback(false);
        return true;
      }
      
      throw new Error('Main API not responding');
    } catch (error) {
      console.warn('Main API health check failed, trying fallback...', error);
      
      try {
        // Try the fallback API URL
        const fallbackApiUrl = import.meta.env.VITE_API_FALLBACK_URL;
        if (!fallbackApiUrl) {
          setIsServerHealthy(false);
          return false;
        }
        
        const fallbackResponse = await fetch(`${fallbackApiUrl}/api/health`, {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
        });
        
        if (fallbackResponse.ok) {
          setIsServerHealthy(true);
          setUsingFallback(true);
          return true;
        }
        
        setIsServerHealthy(false);
        return false;
      } catch (fallbackError) {
        console.error('Fallback API health check also failed', fallbackError);
        setIsServerHealthy(false);
        return false;
      }
    }
  };

  useEffect(() => {
    // Check server health on component mount
    checkServerHealth();
    
    // Set up periodic health checks every 5 minutes
    const healthCheckInterval = setInterval(() => {
      checkServerHealth();
    }, 5 * 60 * 1000);
    
    return () => {
      clearInterval(healthCheckInterval);
    };
  }, []);

  return (
    <ApiStatusContext.Provider value={{ isServerHealthy, checkServerHealth, usingFallback }}>
      {children}
    </ApiStatusContext.Provider>
  );
}
