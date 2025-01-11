"use client";

import Link from "next/link";
import React, { useState, useEffect } from "react";
import { BiChevronLeft } from "react-icons/bi";
import Modal from './Modal';

interface LoginProps {
  apiEndpoint: string; // API endpoint for login (e.g., "/api/agency/login" or "/api/team/login")
  onLoginSuccess: (data: any) => void; // Callback for successful login
}

const Login: React.FC<LoginProps> = ({ apiEndpoint, onLoginSuccess }) => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [resetEmailSent, setResetEmailSent] = useState<boolean>(false);
  const [isResetting, setIsResetting] = useState<boolean>(false);
  const [pathname, setPathname] = useState<string>('');
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [resetEmail, setResetEmail] = useState<string>('');

  useEffect(() => {
    setPathname(window.location.pathname);
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(apiEndpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        const { error } = await response.json();
        throw new Error(error || "Login failed");
      }

      const data = await response.json();
      console.log({ data });
      onLoginSuccess(data); // Call the success handler (e.g., save token, redirect)
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgotPassword = async () => {
    setIsResetting(true);
    setError(null);

    try {
      let userType = 'talent';
      if (pathname === '/team-login') {
        userType = 'team';
      } else if (pathname === '/agency-login') {
        userType = 'agency';
      }

      const response = await fetch('/api/request-password-reset', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: resetEmail, userType }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to send reset email');
      }

      setResetEmailSent(true);
      setIsModalOpen(false);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setIsResetting(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto bg-white shadow-md rounded-md p-6">
      <Link href="/">
        <div className="flex items-center text-blue-600">
          <BiChevronLeft size={28} /> home
        </div>
      </Link>
      <h2 className="text-xl font-bold text-center mb-6">Login</h2>

      {error && <p className="text-red-500 text-center mb-4">{error}</p>}

      <form onSubmit={handleLogin}>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">
            Email
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full px-4 py-2 border rounded-md focus:ring focus:ring-purple-500"
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">
            Password
          </label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full px-4 py-2 border rounded-md focus:ring focus:ring-purple-500"
          />
          <button
            type="button"
            onClick={() => setIsModalOpen(true)}
            className="mt-1 text-sm text-purple-600 hover:text-purple-700"
          >
            Forgot Password?
          </button>
        </div>

        <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
          <h2 className="text-lg font-bold mb-4">Reset Password</h2>
          <input
            type="email"
            value={resetEmail}
            onChange={(e) => setResetEmail(e.target.value)}
            placeholder="Enter your email"
            className="w-full px-4 py-2 border rounded-md mb-4"
          />
          <button
            onClick={handleForgotPassword}
            disabled={!resetEmail || isResetting}
            className="w-full px-4 py-2 text-white font-semibold rounded-md bg-purple-600 hover:bg-purple-700"
          >
            {isResetting ? "Sending..." : "Send Reset Email"}
          </button>
          {resetEmailSent && (
            <p className="mt-2 text-sm text-green-600">
              Password reset instructions have been sent to your email.
            </p>
          )}
        </Modal>

        <button
          type="submit"
          disabled={isLoading}
          className={`w-full px-4 py-2 text-white font-semibold rounded-md ${isLoading
            ? "bg-purple-400 cursor-not-allowed"
            : "bg-purple-600 hover:bg-purple-700"
            }`}
        >
          {isLoading ? "Logging in..." : "Login"}
        </button>

        <div className="mt-4 text-center text-sm text-gray-600">
          {pathname === "/login" && (
            <p>
              Want to login as{" "}
              <Link href="/team-login" className="text-purple-600 hover:underline">
                Team
              </Link>{" "}
              or{" "}
              <Link href="/agency-login" className="text-purple-600 hover:underline">
                Agency
              </Link>
              ?
            </p>
          )}
          {pathname === "/team-login" && (
            <p>
              Want to login as{" "}
              <Link href="/login" className="text-purple-600 hover:underline">
                Talent
              </Link>{" "}
              or{" "}
              <Link href="/agency-login" className="text-purple-600 hover:underline">
                Agency
              </Link>
              ?
            </p>
          )}
          {pathname === "/agency-login" && (
            <p>
              Want to login as{" "}
              <Link href="/login" className="text-purple-600 hover:underline">
                Talent
              </Link>{" "}
              or{" "}
              <Link href="/team-login" className="text-purple-600 hover:underline">
                Team
              </Link>
              ?
            </p>
          )}
        </div>
      </form>
    </div>
  );
};

export default Login;
