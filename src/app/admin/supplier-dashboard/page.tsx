"use client";
import { useEffect, useState } from 'react';
import { supplierDashboardApi } from '@/services/api/supplierDashboard';
import { MdPendingActions, MdDone, MdWarning, MdPeople, MdAdd, MdVisibility } from 'react-icons/md';
import { FaMoneyBillWave } from 'react-icons/fa';
import Link from 'next/link';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

interface StatCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  color: string;
}

function StatCard({ title, value, icon, color }: StatCardProps) {
  const colorClasses = {
    blue: 'bg-blue-50 text-blue-500',
    green: 'bg-green-50 text-green-500',
    yellow: 'bg-yellow-50 text-yellow-500',
    red: 'bg-red-50 text-red-500',
    purple: 'bg-purple-50 text-purple-500',
    orange: 'bg-orange-50 text-orange-500',
  }[color];

  return (
    <div className="bg-white rounded-xl shadow p-6">
      <div className="flex items-center gap-4">
        <div className={`p-3 rounded-lg ${colorClasses}`}>
          {icon}
        </div>
        <div>
          <div className="text-sm text-gray-500">{title}</div>
          <div className="text-2xl font-bold">{value}</div>
        </div>
      </div>
    </div>
  );
}

export default function SupplierDashboard() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await supplierDashboardApi.getStats();
        setData(response);
      } catch (err) {
        setError('Error fetching supplier dashboard data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!data) return null;

  const { stats, recentOrders, topSuppliers, expenseData } = data;

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Supplier Dashboard</h1>
        
        <div className="flex gap-4">
          <Link 
            href="/admin/supply-orders"
            className="flex items-center gap-2 bg-white text-gray-600 px-4 py-2 rounded-lg border hover:bg-gray-50"
          >
            <MdVisibility size={20} />
            <span>View Orders</span>
          </Link>
          
          <Link
            href="/admin/supply-orders/create"
            className="flex items-center gap-2 bg-[#FF914D] text-white px-4 py-2 rounded-lg hover:bg-[#b16f46]"
          >
            <MdAdd size={20} />
            <span>Create Order</span>
          </Link>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <StatCard
          title="Total Orders"
          value={stats.totalOrders}
          icon={<MdPendingActions size={24} />}
          color="blue"
        />
        <StatCard
          title="Completed Orders"
          value={stats.completedOrders}
          icon={<MdDone size={24} />}
          color="green"
        />
        <StatCard
          title="Total Expense"
          value={`₨ ${stats?.totalExpense?.toLocaleString()}`}
        //   value={`₨  00`}
          icon={<FaMoneyBillWave size={24} />}
          color="yellow"
        />
        <StatCard
          title="Unpaid Amount"
          value={`₨ ${stats.unpaidAmount ? stats.unpaidAmount.toLocaleString() : '0'}`}
        //   value={`₨  00`}
          icon={<FaMoneyBillWave size={24} />}
          color="red"
        />
        <StatCard
          title="Total Suppliers"
          value={stats.totalSuppliers}
          icon={<MdPeople size={24} />}
          color="purple"
        />
        <StatCard
          title="Pending Orders"
          value={stats.pendingOrders}
          icon={<MdWarning size={24} />}
          color="orange"
        />
      </div>

      {/* Expense Trend Chart */}
      <div className="bg-white rounded-xl shadow p-6 mb-8">
        <h2 className="text-xl font-bold mb-4">Expense Trend</h2>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={expenseData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis tickFormatter={(value) => `₨ ${(value / 1000).toFixed(0)}K`} />
              <Tooltip 
                formatter={(value: number) => [`₨ ${value.toLocaleString()}`, 'Expense']}
                labelFormatter={(label) => `Month: ${label}`}
              />
              <Line 
                type="monotone" 
                dataKey="expense" 
                stroke="#FF914D"
                dot={{ r: 4 }}
                activeDot={{ r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Recent Orders and Top Suppliers Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Orders */}
        <div className="bg-white rounded-xl shadow p-6">
          <h2 className="text-xl font-bold mb-4">Recent Orders</h2>
          <div className="space-y-4">
            {/* {recentOrders.map((order: any, i: number) => (
              <div key={i} className="flex justify-between items-center">
                <div>
                  <div className="font-medium">{order.orderNumber}</div>
                  <div className="text-sm text-gray-500">{order.supplier.businessName}</div>
                </div>
                <div className="text-right">
                  <div className="font-medium">₨ {order.totalAmount.toLocaleString()}</div>
                  <div className={`text-sm ${
                    order.status === "Completed" ? "text-green-500" :
                    order.status === "Pending" ? "text-yellow-500" :
                    "text-blue-500"
                  }`}>{order.status}</div>
                </div>
              </div>
            ))} */}
          </div>
        </div>

        {/* Top Suppliers */}
        <div className="bg-white rounded-xl shadow p-6">
          <h2 className="text-xl font-bold mb-4">Top Suppliers</h2>
          <div className="space-y-4">
            {/* {topSuppliers.map((supplier: any, i: number) => (
              <div key={i} className="flex justify-between items-center">
                <div>
                  <div className="font-medium">{supplier.supplierInfo.businessName}</div>
                  <div className="text-sm text-gray-500">{supplier.orderCount} orders</div>
                </div>
                <div className="text-right">
                  <div className="font-medium">₨ {supplier.totalAmount.toLocaleString()}</div>
                </div>
              </div>
            ))} */}
          </div>
        </div>
      </div>
    </div>
  );
} 