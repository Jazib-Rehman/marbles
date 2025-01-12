"use client";
import { useEffect, useState } from 'react';
import { dashboardApi } from '@/services/api/dashboard';
import { MdPendingActions, MdDone, MdWarning, MdPeople } from 'react-icons/md';
import { FaMoneyBillWave, FaBoxes } from 'react-icons/fa';

export default function DashboardPage() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await dashboardApi.getStats();
        setData(response);
      } catch (err) {
        setError('Error fetching dashboard data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!data) return null;

  const { stats, recentOrders, topCustomers } = data;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Dashboard</h1>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
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
          title="Total Revenue"
          value={`₨${stats.totalRevenue.toLocaleString()}`}
          icon={<FaMoneyBillWave size={24} />}
          color="yellow"
        />
        <StatCard
          title="Unpaid Amount"
          value={`₨${stats.unpaidAmount.toLocaleString()}`}
          icon={<FaMoneyBillWave size={24} />}
          color="red"
        />
        <StatCard
          title="B2B Customers"
          value={stats.totalB2BCustomers}
          icon={<MdPeople size={24} />}
          color="purple"
        />
        <StatCard
          title="B2C Customers"
          value={stats.totalB2CCustomers}
          icon={<MdPeople size={24} />}
          color="indigo"
        />
        <StatCard
          title="Low Stock Items"
          value={stats.lowStockItems}
          icon={<FaBoxes size={24} />}
          color="orange"
        />
        <StatCard
          title="Pending Orders"
          value={stats.pendingOrders}
          icon={<MdWarning size={24} />}
          color="pink"
        />
      </div>

      {/* Recent Orders */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow p-6">
          <h2 className="text-xl font-bold mb-4">Recent Orders</h2>
          <div className="space-y-4">
            {recentOrders.map((order: any, i:number) => (
              <div key={i} className="flex justify-between items-center">
                <div>
                  <div className="font-medium">{order.orderNumber}</div>
                  <div className="text-sm text-gray-500">{order.customerName}</div>
                </div>
                <div className="text-right">
                  <div className="font-medium">₨{order.totalAmount.toLocaleString()}</div>
                  <div className={`text-sm ${
                    order.status === "Completed" ? "text-green-500" :
                    order.status === "Pending" ? "text-yellow-500" :
                    "text-blue-500"
                  }`}>{order.status}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Top Customers */}
        <div className="bg-white rounded-xl shadow p-6">
          <h2 className="text-xl font-bold mb-4">Top Customers</h2>
          <div className="space-y-4">
            {topCustomers.map((customer: any,i:number) => (
              <div key={i} className="flex justify-between items-center">
                <div>
                  <div className="font-medium">{customer.customerName}</div>
                  <div className="text-sm text-gray-500">{customer.orderCount} orders</div>
                </div>
                <div className="text-right">
                  <div className="font-medium">₨{customer.totalSpent.toLocaleString()}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

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
    indigo: 'bg-indigo-50 text-indigo-500',
    orange: 'bg-orange-50 text-orange-500',
    pink: 'bg-pink-50 text-pink-500',
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