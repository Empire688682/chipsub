"use client";
import React, { useContext, useEffect, useState } from 'react';

const AppContext = React.createContext();

export const AppProvider = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [authType, setAuthType] = useState('register');

  const openModal = (type) => {
    setAuthType(type);
    setIsModalOpen(true);
  };

  useEffect (()=>{
    if(isModalOpen){
      document.body.style.overflow = "hidden";
    }
    else{
      document.body.style.overflow = "auto";
    }
  }, [isModalOpen])

  const toggleMenu = () => setIsOpen(!isOpen);
  return <AppContext.Provider value={{
    isOpen,
    toggleMenu,
    setIsOpen,
    isModalOpen,
    setIsModalOpen,
    authType,
    openModal
  }}>
    {children}
  </AppContext.Provider>
}

export const useGlobalContext = () => {
  return useContext(AppContext);
}
