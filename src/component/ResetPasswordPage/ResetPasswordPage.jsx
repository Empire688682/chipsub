"use client";
import React, { useState } from "react";
import styles from "./ResetPasswordPage.module.css";
import { useSearchParams } from "next/navigation";
import axios from "axios";
import { useGlobalContext } from "../Context";

const ResetPasswordPage = () => {
  const{setIsModalOpen} =useGlobalContext
  const searchParams = useSearchParams();
  const token = searchParams.get("Emailtoken");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const [data, setData] = useState({
    password: "",
    confirmPassword: "",
  });

  console.log("Token:", token);

  const handleOnchange = (e) => {
    const { name, value } = e.target;
    setData((prev) => ({ ...prev, [name]: value }));
  };

 const resetPassword = async () => {
  try {
    setLoading(true);
    const response = await axios.post("/api/auth/resetForgettingPassword", {
      password: data.password,
      confirmPassword: data.confirmPassword,
      token: token,
    });

    if (response.data.success) {
     setErrorMsg("");
      setSuccessMsg("Password changed redirecting to login page.........");
      setIsModalOpen(true);
      setData({ 
        password: "", 
        confirmPassword: "" 
      });
      setTimeout(() => {
        setShowSignup(true);
        setFormPhase("login");
      }, 2000);
    }
  } catch (error) {
    console.log("Error resetingPwd:", error);
    setErrorMsg(error.response?.data?.message || "Something went wrong");
  } finally {
    setLoading(false);
  }
};

  function handleFormSubmission(e) {
    e.preventDefault();
    if (data.password.length < 8) {
      alert("Password too short");
      return;
    }
    if (data.password !== data.confirmPassword) {
      alert("Password did not match");
      return;
    }
    resetPassword();
  }

  return (
    <div className={styles.resetPassword }>
        <div className={styles.card}>
          <h2 className={styles.title}>Reset Your Password</h2>
          <p className={styles.subtitle}>
            Please enter your new password below.
          </p>
          <form className={styles.form} onSubmit={handleFormSubmission}>
            <label htmlFor="password" className={styles.label}>
              New Password
            </label>
            <input
              type="password"
              name="password"
              className={styles.input}
              onChange={handleOnchange}
              placeholder="Enter new password"
              required
              value={data.password}
            />
            <label htmlFor="confirmPassword" className={styles.label}>
              Confirm Password
            </label>
            <input
              type="password"
              name="confirmPassword"
              onChange={handleOnchange}
              className={styles.input}
              placeholder="Confirm new password"
              required
              value={data.confirmPassword}
            />
            <button disabled={loading} type="submit" className={styles.button}>
              {loading ? "Loading..." : "Reset Password"}
            </button>
            {errorMsg && <p className={styles.errorMsg}>{errorMsg}</p>}
            {successMsg && <p className={styles.successMsg}>{successMsg}</p>}
          </form>
        </div>
    </div>
  );
};

export default ResetPasswordPage;
