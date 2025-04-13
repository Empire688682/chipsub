"use client";
import React, { useContext, useState } from 'react';

const AppContext = React.createContext();

export const AppProvider = ({children}) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => setIsOpen(!isOpen);
  return <AppContext.Provider value={{
    isOpen,
    toggleMenu,
    setIsOpen
  }}>
    {children}
    </AppContext.Provider>
}

export const useGlobalContext = () =>{
    return useContext(AppContext);
}
