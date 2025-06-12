import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { useExperts, Expert } from '../hooks/useDatabase';

interface ExpertContextType {
  experts: Expert[];
  loading: boolean;
  error: string | null;
  getExpertById: (id: string) => Expert | undefined;
  searchExperts: (query: string) => Expert[];
}

const ExpertContext = createContext<ExpertContextType>({
  experts: [],
  loading: true,
  error: null,
  getExpertById: () => undefined,
  searchExperts: () => [],
});

export const useExpert = () => {
  const context = useContext(ExpertContext);
  if (context === undefined) {
    throw new Error('useExpert must be used within an ExpertProvider');
  }
  return context;
};

export const ExpertProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { data: experts = [], loading, error } = useExperts();
  const [filteredExperts, setFilteredExperts] = useState<Expert[]>([]);

  useEffect(() => {
    setFilteredExperts(experts);
  }, [experts]);

  const getExpertById = (id: string): Expert | undefined => {
    return experts?.find(expert => expert.id === id);
  };

  const searchExperts = (query: string): Expert[] => {
    const lowercasedQuery = query.toLowerCase();
    const results = experts?.filter(
      expert =>
        expert.profile?.full_name?.toLowerCase().includes(lowercasedQuery)
    ) || [];
    setFilteredExperts(results);
    return results;
  };

  const value = {
    experts: filteredExperts,
    loading,
    error,
    getExpertById,
    searchExperts,
  };

  return (
    <ExpertContext.Provider value={value}>
      {children}
    </ExpertContext.Provider>
  );
};