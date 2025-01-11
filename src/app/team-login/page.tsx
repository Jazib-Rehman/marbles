"use client";

import React from "react";
import Login from "./../../components/Login";
import { useRouter } from "next/navigation";

const TeamLogin = () => {
  const router = useRouter();

  const handleLoginSuccess = async (data: any) => {
    await localStorage.clear();
    localStorage.setItem("token", data.token);
    localStorage.setItem("teamId", data.teamId);
    router.push("/team");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <Login
        apiEndpoint="/api/team/login"
        onLoginSuccess={handleLoginSuccess}
      />
    </div>
  );
};

export default TeamLogin;
