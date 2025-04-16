"use client";
import { useRouter } from 'next/navigation';
import React, { useContext, useEffect, useState } from 'react';

const AppContext = React.createContext();

export const AppProvider = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [authType, setAuthType] = useState('register');
  const [data, setData] = useState({
    name: "",
    email: "",
    password: ""
  });
  const [userData, setUserData] = useState("");
  const route = useRouter();

  const openModal = (type) => {
    if(userData){
      route.push("/dashboard");
    }
    else{
      setAuthType(type);
    setIsModalOpen(true);
    setData({
      name: "",
      email: "",
      password: ""
    });
    }
  };

  useEffect(() => {
    if (isModalOpen) {
      document.body.style.overflow = "hidden";
    }
    else {
      document.body.style.overflow = "auto";
    }
  }, [isModalOpen]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const SavedUser = localStorage.getItem("userData") || null;
      const retrieveData = SavedUser ? JSON.parse(SavedUser) : "";
      setUserData(retrieveData);
    }
  }, []);

  console.log("userData:", userData);

  const toggleMenu = () => setIsOpen(!isOpen);
  return <AppContext.Provider value={{
    isOpen,
    toggleMenu,
    setIsOpen,
    isModalOpen,
    setIsModalOpen,
    authType,
    openModal,
    userData,
    data,
    setData,
    route
  }}>
    {children}
  </AppContext.Provider>
}

export const useGlobalContext = () => {
  return useContext(AppContext);
}
