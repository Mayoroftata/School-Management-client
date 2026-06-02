"use client";

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function ToastProvider() {
  return (
    <ToastContainer
      newestOnTop
      position="top-right"
      autoClose={3500}
      hideProgressBar={false}
      closeOnClick
      pauseOnHover
      theme="colored"
    />
  );
}
