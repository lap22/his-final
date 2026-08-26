import { useEffect, useState } from 'react';
import { subscribeDepartments } from '../services/department.service';
import type { Department } from '../types/department.types';
    

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
