"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { HiMenu, HiX } from "react-icons/hi";
import { FiLogOut } from "react-icons/fi";
import { 
  MdDashboard,
  MdPeople,
  MdPayments,
  MdInventory,
  MdLocalShipping,
  MdBarChart,
  MdSettings
} from "react-icons/md";

export default function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const router = useRouter();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const handleLogout = async () => {
    try {
      localStorage.clear();
      const response = await fetch("/api/logout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        router.push("/");
      }
    } catch (error) {
      console.error("An error occurred during logout:", error);
    }
  };

  const navItems = [
    { 
      href: "/admin", 
      label: "Dashboard", 
      icon: <MdDashboard size={20} /> 
    },
    { 
      href: "/admin/customers", 
      label: "Customers", 
      icon: <MdPeople size={20} /> 
    },
    { 
      href: "/admin/inventory", 
      label: "Inventory", 
      icon: <MdInventory size={20} /> 
    },
    { 
      href: "/admin/orders", 
      label: "Orders & Shipping", 
      icon: <MdLocalShipping size={20} /> 
    },
    { 
      href: "/admin/payments", 
      label: "Payments", 
      icon: <MdPayments size={20} /> 
    },
    { 
      href: "/admin/reports", 
      label: "Reports & Analytics", 
      icon: <MdBarChart size={20} /> 
    },
    { 
      href: "/admin/settings", 
      label: "Settings", 
      icon: <MdSettings size={20} /> 
    },
    {
      href: '/admin/supplier-dashboard',
      icon: <MdLocalShipping size={20} />,
      label: 'Supplier Dashboard'
    }
  ];

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      {/* Header */}
      <header className="fixed w-full bg-gradient-to-r from-[#FF914D] to-[#b16f46] text-white py-4 px-6 shadow-lg z-50">
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="lg:hidden"
            >
              {isSidebarOpen ? <HiX size={24} /> : <HiMenu size={24} />}
            </button>
            <h1 className="text-2xl font-bold">Jehangira Marble</h1>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center space-x-2 bg-white/10 hover:bg-white/20 px-4 py-2 rounded-lg transition-colors duration-200"
          >
            <FiLogOut size={20} />
            <span>Logout</span>
          </button>
        </div>
      </header>

      <div className="flex pt-16">
        {/* Sidebar */}
        <aside
          className={`fixed lg:static lg:translate-x-0 inset-y-0 left-0 transform ${
            isSidebarOpen ? "translate-x-0" : "-translate-x-full"
          } lg:w-64 w-64 bg-white border-r border-gray-200 pt-16 lg:pt-0 transition-transform duration-200 ease-in-out z-40`}
        >
          <nav className="mt-8 px-4">
            {navItems.map((item, index) => (
              <Link
                key={index}
                href={item.href}
                className="flex items-center space-x-3 px-4 py-3 text-gray-700 hover:bg-[#FF914D]/10 hover:text-[#FF914D] rounded-lg mb-1 transition-colors duration-200"
                onClick={() => setIsSidebarOpen(false)}
              >
                {item.icon}
                <span>{item.label}</span>
              </Link>
            ))}
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 lg:p-8 p-4 min-h-screen">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </div>

      {/* Overlay */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}
    </div>
  );
}
