import React from 'react';
import { useApiStatus } from '../utils/apiStatus';

const ApiStatusAlert: React.FC = () => {
  const { isServerHealthy, usingFallback } = useApiStatus();

  if (isServerHealthy && !usingFallback) {
    // Everything is working normally, don't show anything
    return null;
  }

  if (isServerHealthy && usingFallback) {
    // Using fallback server but it's working
    return (
      <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 fixed bottom-4 right-4 max-w-md z-50 shadow-lg rounded">
        <div className="flex">
          <div className="flex-shrink-0">
            <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="ml-3">
            <p className="text-sm text-yellow-700">
              Using backup server. Some features might be limited.
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Server is not healthy
  return (
    <div className="bg-red-50 border-l-4 border-red-400 p-4 fixed bottom-4 right-4 max-w-md z-50 shadow-lg rounded">
      <div className="flex">
        <div className="flex-shrink-0">
          <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
          </svg>
        </div>
        <div className="ml-3">
          <p className="text-sm text-red-700">
            Server connection issues. Please try again later.
          </p>
        </div>
      </div>
    </div>
  );
};

export default ApiStatusAlert;
