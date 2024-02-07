import { useState } from 'react';

export default function useApiCall(apiFunc) {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const execute = async (...args) => {
    setIsLoading(true);
    try {
      const result = await apiFunc(...args);
      setData(result);
      setError(null);
    } catch (err) {
      setError(err);
      setData(null);
    } finally {
      setIsLoading(false);
    }
  };

  return { execute, data, isLoading, error };
}


