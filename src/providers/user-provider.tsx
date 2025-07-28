'use client';

import { createContext, ReactNode, useContext } from 'react';

interface UserContextType {
  email?: string;
  name?: string;
  image?: string;
}

const UserContext = createContext<UserContextType | null>(null);

export const UserProvider = ({
  children,
  user,
}: {
  children: ReactNode;
  user?: UserContextType;
}) => {
  return (
    <UserContext.Provider value={user || {}}>{children}</UserContext.Provider>
  );
};

export function useUser() {
  const context = useContext(UserContext);
  if (context === null) {
    throw new Error('useUser must be used inside UserProvider');
  }
  return context;
}

export default UserProvider;
