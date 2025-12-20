



































// src/pages/admin/AdminDashboard.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { format } from 'date-fns';
import {
  Menu, X, Users, Wallet, ArrowUpDown, LogOut, BarChart3, TrendingUp, TrendingDown,
} from 'lucide-react';
import {
  LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell
} from 'recharts';

const SIDEBAR_COLOR = '#2E4F44'; // Your requested deep green

const AdminDashboard = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeView, setActiveView] = useState('overview');
  const [stats, setStats] = useState({ totalUsers: 0, totalBalance: 0, totalSpent: 0, totalCredited: 0 });
  const [users, setUsers] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    if (!token) return (window.location.href = '/admin/login');

    const fetchData = async () => {
      try {
        const headers = { Authorization: `Bearer ${token}` };
        const base = import.meta.env.VITE_BACKEND_URL;

        const [statsRes, usersRes, txRes] = await Promise.all([
          axios.get(`${base}/admin/stats`, { headers }),
          axios.get(`${base}/admin/users`, { headers }),
          axios.get(`${base}/admin/transactions`, { headers }),
        ]);

        setStats({
          totalUsers: statsRes.data.totalUsers,
          totalBalance: statsRes.data.totalBalance,
          totalSpent: statsRes.data.totalSpent,
          totalCredited: usersRes.data.reduce((sum, u) => {
            const credits = u.wallet?.transactions?.filter(t => t.type === 'credit') || [];
            return sum + credits.reduce((s, t) => s + (t.amount || 0), 0);
          }, 0),
        });

        setUsers(usersRes.data);
        setTransactions(txRes.data.filter(tx => tx.amount > 0));
      } catch (err) {
        if (err.response?.status === 401) {
          localStorage.removeItem('adminToken');
          window.location.href = '/admin/login';
        }
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    window.location.href = '/admin/login';
  };

  const balanceData = users.map(u => ({
    name: u.fullName.split(' ')[0],
    balance: u.wallet?.balance || 0,
  })).slice(0, 10);

  const transactionTypeData = [
    { name: 'Credit', value: stats.totalCredited, color: '#10b981' },
    { name: 'Debit', value: stats.totalSpent, color: '#ef4444' },
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-xl text-gray-600">Loading admin dashboard...</p>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar - Deep Green #2E4F44 */}
      <div
        className={`fixed md:relative inset-y-0 left-0 z-50 w-72 bg-[#0b6631] text-white shadow-2xl transform transition-transform duration-300 ease-in-out ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
      >
        <div className="p-6 border-b border-[#3a5f52]">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold">Fintech Admin</h1>
            <button onClick={() => setSidebarOpen(false)} className="md:hidden">
              <X className="h-6 w-6" />
            </button>
          </div>
        </div>

        <nav className="p-4 space-y-2">
          {[
            { id: 'overview', label: 'Overview', icon: BarChart3 },
            { id: 'users', label: 'Users', icon: Users },
            { id: 'transactions', label: 'Transactions', icon: ArrowUpDown },
          ].map(item => (
            <button
              key={item.id}
              onClick={() => {
                setActiveView(item.id);
                setSidebarOpen(false);
              }}
              className={`w-full flex items-center gap-4 px-4 py-3 rounded-xl transition-all ${
                activeView === item.id
                  ? 'bg-white text-[#2E4F44] shadow-lg'
                  : 'hover:bg-[#3a5f52]'
              }`}
            >
              <item.icon className="h-5 w-5" />
              <span className="font-medium">{item.label}</span>
            </button>
          ))}
        </nav>

        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-[#3a5f52]">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-4 px-4 py-3 rounded-xl hover:bg-[#3a5f52] transition"
          >
            <LogOut className="h-5 w-5" />
            <span>Logout</span>
          </button>
        </div>
      </div>

      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-60 z-40 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="bg-white shadow-sm px-6 py-4 flex items-center justify-between border-b">
          <button onClick={() => setSidebarOpen(true)} className="md:hidden">
            <Menu className="h-6 w-6 text-gray-700" />
          </button>
          <h2 className="text-2xl font-bold text-gray-900">
            {activeView === 'overview' ? 'Overview' : activeView === 'users' ? 'All Users' : 'Transactions'}
          </h2>
          <div className="flex items-center gap-3">
            <span className="text-sm font-medium">Admin</span>
            <div className="w-10 h-10 bg-[#2E4F44] rounded-full flex items-center justify-center text-white font-bold">A</div>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-6">
          {/* Same content as before — unchanged */}
          {activeView === 'overview' && (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
                <div className="bg-gradient-to-br from-[#2E4F44] to-[#3a5f52] rounded-2xl p-6 text-white shadow-xl">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-green-100">Total Users</p>
                      <p className="text-4xl font-bold mt-2">{stats.totalUsers}</p>
                    </div>
                    <Users className="h-12 w-12 opacity-50" />
                  </div>
                </div>

                <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-2xl p-6 text-white shadow-xl">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-green-100">Total Balance</p>
                      <p className="text-4xl font-bold mt-2">₦{stats.totalBalance.toLocaleString()}</p>
                    </div>
                    <Wallet className="h-12 w-12 opacity-50" />
                  </div>
                </div>

                <div className="bg-gradient-to-br from-amber-500 to-amber-600 rounded-2xl p-6 text-white shadow-xl">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-amber-100">Total Credited</p>
                      <p className="text-4xl font-bold mt-2">₦{stats.totalCredited.toLocaleString()}</p>
                    </div>
                    <TrendingUp className="h-12 w-12 opacity-50" />
                  </div>
                </div>

                <div className="bg-gradient-to-br from-red-500 to-red-600 rounded-2xl p-6 text-white shadow-xl">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-red-100">Total Spent</p>
                      <p className="text-4xl font-bold mt-2">₦{stats.totalSpent.toLocaleString()}</p>
                    </div>
                    <TrendingDown className="h-12 w-12 opacity-50" />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="bg-white rounded-2xl shadow-xl p-6">
                  <h3 className="text-xl font-bold mb-4">User Wallet Balances</h3>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={balanceData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip formatter={(value) => `₦${value.toLocaleString()}`} />
                      <Bar dataKey="balance" fill="#2E4F44" radius={[8, 8, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>

                <div className="bg-white rounded-2xl shadow-xl p-6">
                  <h3 className="text-xl font-bold mb-4">Credit vs Debit</h3>
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={transactionTypeData}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={100}
                        paddingAngle={5}
                        dataKey="value"
                      >
                        {transactionTypeData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value) => `₦${value.toLocaleString()}`} />
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="flex justify-center gap-8 mt-4">
                    {transactionTypeData.map((entry) => (
                      <div key={entry.name} className="flex items-center gap-2">
                        <div className="w-4 h-4 rounded" style={{ backgroundColor: entry.color }} />
                        <span className="text-sm">{entry.name}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </>
          )}

           {/* Users View */}
          {activeView === 'users' && (
            <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
              <div className="p-6 border-b">
                <h3 className="text-2xl font-bold">All Users</h3>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-4 text-left text-sm font-medium text-gray-700">Name</th>
                      <th className="px-6 py-4 text-left text-sm font-medium text-gray-700">Email</th>
                      <th className="px-6 py-4 text-left text-sm font-medium text-gray-700">Phone</th>
                      <th className="px-6 py-4 text-left text-sm font-medium text-gray-700">Balance</th>
                      <th className="px-6 py-4 text-left text-sm font-medium text-gray-700">Total Credit</th>
                      <th className="px-6 py-4 text-left text-sm font-medium text-gray-700">Total Debit</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {users.map((user) => {
                      const credits = user.wallet?.transactions?.filter(t => t.type === 'credit') || [];
                      const debits = user.wallet?.transactions?.filter(t => t.type === 'debit') || [];
                      const totalCredit = credits.reduce((s, t) => s + (t.amount || 0), 0);
                      const totalDebit = debits.reduce((s, t) => s + (t.amount || 0), 0);

                      return (
                        <tr key={user._id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 text-sm font-medium">{user.fullName}</td>
                          <td className="px-6 py-4 text-sm">{user.email}</td>
                          <td className="px-6 py-4 text-sm">{user.phone || '-'}</td>
                          <td className="px-6 py-4 text-sm font-bold text-green-600">
                            ₦{(user.wallet?.balance || 0).toLocaleString()}
                          </td>
                          <td className="px-6 py-4 text-sm text-green-600">
                            ₦{totalCredit.toLocaleString()}
                          </td>
                          <td className="px-6 py-4 text-sm text-red-600">
                            ₦{totalDebit.toLocaleString()}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Transactions View */}
          {activeView === 'transactions' && (
            <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
              <div className="p-6 border-b">
                <h3 className="text-2xl font-bold">All Transactions</h3>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-4 text-left text-sm font-medium text-gray-700">User</th>
                      <th className="px-6 py-4 text-left text-sm font-medium text-gray-700">Type</th>
                      <th className="px-6 py-4 text-left text-sm font-medium text-gray-700">Amount</th>
                      <th className="px-6 py-4 text-left text-sm font-medium text-gray-700">Provider</th>
                      <th className="px-6 py-4 text-left text-sm font-medium text-gray-700">Status</th>
                      <th className="px-6 py-4 text-left text-sm font-medium text-gray-700">Date</th>
                      <th className="px-6 py-4 text-left text-sm font-medium text-gray-700">Ref</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {transactions.map((tx) => (
                      <tr key={tx.reference} className="hover:bg-gray-50">
                        <td className="px-6 py-4 text-sm">{tx.userName || tx.userEmail}</td>
                        <td className="px-6 py-4">
                          <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                            tx.type === 'credit' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                          }`}>
                            {tx.type.toUpperCase()}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm font-bold">
                          ₦{tx.amount.toLocaleString()}
                        </td>
                        <td className="px-6 py-4 text-sm">{tx.provider || '-'}</td>
                        <td className="px-6 py-4">
                          <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                            tx.status === 'success' ? 'bg-blue-100 text-blue-800' : 'bg-yellow-100 text-yellow-800'
                          }`}>
                            {tx.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-500">
                          {format(new Date(tx.timestamp), 'dd MMM yyyy HH:mm')}
                        </td>
                        <td className="px-6 py-4 text-xs font-mono text-gray-500">{tx.reference}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;