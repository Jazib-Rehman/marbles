"use client";

import React, { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { BiChevronLeft } from 'react-icons/bi';

// Create a separate component for the form
const ResetPasswordForm = () => {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [token, setToken] = useState<string | null>(null);
    const [userType, setUserType] = useState<string | null>(null);
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');

    useEffect(() => {
        setToken(searchParams.get('token'));
        setUserType(searchParams.get('userType'));
    }, [searchParams]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (password !== confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        try {
            const response = await fetch('/api/reset-password', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ token, userType, password }),
            });

            if (!response.ok) {
                throw new Error('Failed to reset password');
            }

            alert('Password reset successfully');
            router.push('/login');
        } catch (err) {
            setError((err as Error).message);
        }
    };

    return (
        <div className="w-full max-w-md mx-auto bg-white shadow-md rounded-md p-6">
            <Link href="/">
                <div className="flex items-center text-blue-600">
                    <BiChevronLeft size={28} /> home
                </div>
            </Link>
            <h2 className="text-xl font-bold text-center mb-6">Reset Password</h2>

            {error && <p className="text-red-500 text-center mb-4">{error}</p>}

            <form onSubmit={handleSubmit}>
                <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700">
                        New Password
                    </label>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        className="w-full px-4 py-2 border rounded-md focus:ring focus:ring-purple-500"
                    />
                </div>

                <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700">
                        Confirm Password
                    </label>
                    <input
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required
                        className="w-full px-4 py-2 border rounded-md focus:ring focus:ring-purple-500"
                    />
                </div>

                <button
                    type="submit"
                    className="w-full px-4 py-2 text-white font-semibold rounded-md bg-purple-600 hover:bg-purple-700"
                >
                    Reset Password
                </button>

                <div className="mt-4 text-center text-sm text-gray-600">
                    <Link href="/login" className="text-purple-600 hover:underline">
                        Back to Login
                    </Link>
                </div>
            </form>
        </div>
    );
};

// Main component wrapped in Suspense
const ResetPassword: React.FC = () => {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <div className="min-h-screen flex items-center justify-center bg-gray-100">
                <ResetPasswordForm />
            </div>
        </Suspense>
    );
};

export const dynamic = 'force-dynamic';
export default ResetPassword; 