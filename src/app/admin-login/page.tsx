"use client";

import React from "react";
import Login from "./../../components/Login";
import { useRouter } from "next/navigation";

const AdminLogin = () => {
  const router = useRouter();

  const handleLoginSuccess = async (data: any) => {
    await localStorage.clear()
    localStorage.setItem("token", data.token);
    router.push("/admin");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <Login
        apiEndpoint="/api/admin/login"
        onLoginSuccess={handleLoginSuccess}
      />
    </div>
  );
};

export default AdminLogin;
