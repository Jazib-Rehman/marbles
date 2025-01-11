"use client";
import React from "react";
import { 
  MdTrendingUp, 
  MdInventory, 
  MdPeople, 
  MdPayments,
  MdDownload
} from "react-icons/md";
import { Line, Pie } from '@ant-design/plots';

const ReportCard = ({ title, description, icon }: {
  title: string;
  description: string;
  icon: React.ReactNode;
}) => (
  <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:border-[#FF914D] transition-colors cursor-pointer">
    <div className="flex items-start justify-between">
      <div>
        <h3 className="text-lg font-semibold">{title}</h3>
        <p className="text-gray-500 mt-1 text-sm">{description}</p>
      </div>
      <div className="text-[#FF914D]">{icon}</div>
    </div>
    <button className="mt-4 text-[#FF914D] flex items-center gap-2 text-sm hover:text-[#b16f46]">
      <MdDownload size={16} />
      Download Report
    </button>
  </div>
);

export default function ReportsPage() {
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

  const productData = [
    { type: 'Sunny Gray', value: 27 },
    { type: 'Badal Gray', value: 25 },
    { type: 'Sunny White', value: 18 },
    { type: 'Ziarat White', value: 15 },
    { type: 'Others', value: 15 },
  ];

  const pieConfig = {
    data: productData,
    angleField: 'value',
    colorField: 'type',
    radius: 0.8,
    label: {
      type: 'outer',
    },
    color: ['#FF914D', '#b16f46', '#ffa366', '#ffb380', '#ffc299'],
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">Reports & Analytics</h1>
          <p className="text-gray-500 mt-1">View and download business reports</p>
        </div>
        <div className="flex gap-2">
          <select className="px-4 py-2 border rounded-lg">
            <option>Last 30 Days</option>
            <option>Last 7 Days</option>
            <option>This Month</option>
            <option>Last Month</option>
            <option>Custom Range</option>
          </select>
        </div>
      </div>

      {/* Reports Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <ReportCard
          title="Sales Analytics"
          description="Revenue, orders, and sales trends over time"
          icon={<MdTrendingUp size={24} />}
        />
        <ReportCard
          title="Inventory Report"
          description="Stock levels, popular items, and low stock alerts"
          icon={<MdInventory size={24} />}
        />
        <ReportCard
          title="Customer Analysis"
          description="Customer behavior, top customers, and demographics"
          icon={<MdPeople size={24} />}
        />
        <ReportCard
          title="Financial Summary"
          description="Profit margins, expenses, and payment analytics"
          icon={<MdPayments size={24} />}
        />
      </div>

      {/* Charts Section */}
      <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h2 className="text-lg font-semibold mb-4">Revenue Trends</h2>
          <Line {...revenueConfig} />
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h2 className="text-lg font-semibold mb-4">Top Selling Products</h2>
          <Pie {...pieConfig} />
        </div>
      </div>
    </div>
  );
} 