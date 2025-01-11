"use client";

import React from "react";
import { useRouter } from "next/navigation";
import Login from "@/components/Login";

const LoginPage = () => {
  const router = useRouter();

  const handleLoginSuccess = async (data: any) => {
    await localStorage.clear();
    localStorage.setItem("token", data.token);
    localStorage.setItem("talentId", data.talentId);
    router.push("/talent");
  };


  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <Login
        apiEndpoint="/api/talents/login"
        onLoginSuccess={handleLoginSuccess}
      />
    </div>
  );
};

export default LoginPage;
