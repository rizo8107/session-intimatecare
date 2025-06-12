import React, { createContext, useContext, ReactNode } from 'react';
import { 
  profileService, 
  expertService, 
  serviceService, 
  bookingService, 
  reviewService, 
  categoryService,
  messageService,
  notificationService,
  paymentService
} from '../services/database';

interface DatabaseContextType {
  // Profile services
  profileService: typeof profileService;
  
  // Expert services
  expertService: typeof expertService;
  
  // Service services
  serviceService: typeof serviceService;
  
  // Booking services
  bookingService: typeof bookingService;
  
  // Payment services
  paymentService: typeof paymentService;
  
  // Review services
  reviewService: typeof reviewService;
  
  // Category services
  categoryService: typeof categoryService;
  
  // Message services
  messageService: typeof messageService;
  
  // Notification services
  notificationService: typeof notificationService;
  

}

const DatabaseContext = createContext<DatabaseContextType | undefined>(undefined);

export const useDatabase = () => {
  const context = useContext(DatabaseContext);
  if (context === undefined) {
    throw new Error('useDatabase must be used within a DatabaseProvider');
  }
  return context;
};

export const DatabaseProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const value: DatabaseContextType = {
    profileService,
    expertService,
    serviceService,
    bookingService,
    paymentService,
    reviewService,
    categoryService,
    messageService,
    notificationService,
  };

  return (
    <DatabaseContext.Provider value={value}>
      {children}
    </DatabaseContext.Provider>
  );
};