import { useEffect, useState } from 'react';
import type { Department } from './types/types';
import { subscribeDepartments } from './services/department.service';
    

export function useDepartments() {
  const [departments, setDepartments] = useState<Department[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const unsubscribe = subscribeDepartments(data => {
      setDepartments(data);
      setIsLoading(false);
      setError(null);
    });

    return unsubscribe;
  }, []);

  return {
    departments,
    isLoading,
    error,
  };
}