"use client";
import React from "react";
import { MdPeople, MdInventory, MdPayments, MdLocalShipping } from "react-icons/md";
import { Line, Column } from '@ant-design/plots';

const DashboardCard = ({ title, value, icon, trend }: {
  title: string;
  value: string;
  icon: React.ReactNode;
  trend?: string;
}) => (
  <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
    <div className="flex justify-between items-center">
      <div>
        <p className="text-gray-500 text-sm">{title}</p>
        <h3 className="text-2xl font-bold mt-2">{value}</h3>
        {trend && <p className="text-green-500 text-sm mt-1">↑ {trend}</p>}
      </div>
      <div className="text-[#FF914D]">{icon}</div>
    </div>
  </div>
);

export default function AdminDashboard() {
  // Sample data for charts
  const revenueData = [
    { month: 'Jan', revenue: 350000 },
    { month: 'Feb', revenue: 420000 },
    { month: 'Mar', revenue: 380000 },
    { month: 'Apr', revenue: 450000 },
    { month: 'May', revenue: 520000 },
    { month: 'Jun', revenue: 480000 },
  ];

  const revenueConfig = {
    data: revenueData,
    xField: 'month',
    yField: 'revenue',
    point: {
      size: 5,
      shape: 'diamond',
    },
    color: '#FF914D',
  };

  const ordersData = [
    { date: '2024-01', orders: 12 },
    { date: '2024-02', orders: 19 },
    { date: '2024-03', orders: 15 },
    { date: '2024-04', orders: 23 },
    { date: '2024-05', orders: 28 },
    { date: '2024-06', orders: 25 },
  ];

  const ordersConfig = {
    data: ordersData,
    xField: 'date',
    yField: 'orders',
    color: '#FF914D',
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Dashboard Overview</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        <DashboardCard
          title="Total Customers"
          value="256"
          icon={<MdPeople size={24} />}
          trend="12% this month"
        />
        <DashboardCard
          title="Inventory Items"
          value="1,234"
          icon={<MdInventory size={24} />}
        />
        <DashboardCard
          title="Pending Orders"
          value="23"
          icon={<MdLocalShipping size={24} />}
        />
        <DashboardCard
          title="Revenue (This Month)"
          value="₨ 845,000"
          icon={<MdPayments size={24} />}
          trend="8% vs last month"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h2 className="text-lg font-semibold mb-4">Revenue Trends</h2>
          <Line {...revenueConfig} />
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h2 className="text-lg font-semibold mb-4">Monthly Orders</h2>
          <Column {...ordersConfig} />
        </div>
      </div>
    </div>
  );
}
