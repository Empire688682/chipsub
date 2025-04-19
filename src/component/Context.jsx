"use client";
import { useRouter } from 'next/navigation';
import React, { useContext, useEffect, useState } from 'react';
import axios from "axios";
import { toast } from "react-toastify";

const AppContext = React.createContext();

export const AppProvider = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [authType, setAuthType] = useState('register');
  const [data, setData] = useState({
    name: "",
    email: "",
    number: "",
    password: ""
  });
  const [userData, setUserData] = useState("");
  const route = useRouter();
  const [pinModal, setPinModal] = useState(false);
  const [transactionHistory, setTransactionHistory] = useState([]);
  const [loading, setLoading] = useState(true);

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
      number: "",
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

  const toggleMenu = () => setIsOpen(!isOpen);

  const logoutUser = async () => {
    try {
      await axios.get("/api/auth/logout");
      toast.success("Logged out successfully");
      clearLocalStorage();
      setIsOpen(false);
      window.location.reload();
    } catch (error) {
      console.log("Logout Error:", error);
      toast.error("Something went wrong logging out"); 
    }
  };

  const getUserTransactionHistory = async () =>{
  setLoading(true)
    try {
      const res = await axios.get("/api/transaction-history")
      if(res.data.success){
        setTransactionHistory(res.data.transactions)
      }
    } catch (error) {
      console.log("ERROR:", error);
    }
    finally{
      setLoading(false)
    }
  }

  const clearLocalStorage = () =>{
    if(typeof window !== "undefined"){
      localStorage.clear("Username")
    }
  }

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
    route,
    logoutUser,
    pinModal, 
    setPinModal,
    getUserTransactionHistory,
    transactionHistory,
    loading
  }}>
    {children}
  </AppContext.Provider>
}

export const useGlobalContext = () => {
  return useContext(AppContext);
}
