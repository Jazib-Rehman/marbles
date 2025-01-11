"use client";
import Link from "next/link";
import React from "react";

export const Header = (): React.JSX.Element => {
  return (
    <header className="bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex justify-between items-center py-6">
          <div className="flex justify-start">
            <Link href="/">
              <span className="text-2xl font-bold">Logo</span>
            </Link>
          </div>
          <nav className="flex space-x-8">
            <Link href="/login" className="text-gray-600 hover:text-gray-900">
              Login
            </Link>
          </nav>
        </div>
      </div>
    </header>
  );
};
