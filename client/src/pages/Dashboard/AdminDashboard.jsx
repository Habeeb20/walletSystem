/* eslint-disable no-unused-vars */
// components/AdminDashboard.jsx
import React, { useState, useEffect } from 'react';
import { format } from 'date-fns';
import axios from 'axios';

const AdminDashboard = () => {
  const [users, setUsers] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [usersRes, transRes] = await Promise.all([
          axios.get('/api/admin/users', { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }),
          axios.get('/api/admin/transactions', { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }),
        ]);
        setUsers(usersRes.data);
        setTransactions(transRes.data);
        setLoading(false);
      } catch (err) {
        console.error(err);
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) return <div className="p-8 text-center">Loading dashboard...</div>;

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold text-gray-900 mb-8">Admin Dashboard</h1>

        {/* Users Summary */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h3 className="text-lg font-semibold text-gray-700">Total Users</h3>
            <p className="text-3xl font-bold text-[#09a353] mt-2">{users.length}</p>
          </div>
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h3 className="text-lg font-semibold text-gray-700">Total Transactions</h3>
            <p className="text-3xl font-bold text-[#09a353] mt-2">{transactions.length}</p>
          </div>
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h3 className="text-lg font-semibold text-gray-700">Total Volume</h3>
            <p className="text-3xl font-bold text-[#09a353] mt-2">
              ₦{transactions.reduce((sum, t) => sum + t.amount, 0).toLocaleString()}
            </p>
          </div>
        </div>

        {/* All Transactions Table */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="p-6 border-b">
            <h2 className="text-2xl font-bold text-gray-900">All Transactions</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-700">User</th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-700">Type</th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-700">Amount</th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-700">Status</th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-700">Date</th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-700">Reference</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {transactions.map((tx) => {
                  const user = users.find(u => u._id === tx.userId) || {};
                  return (
                    <tr key={tx._id} className="hover:bg-gray-50 transition">
                      <td className="px-6 py-4 text-sm">{user.fullName || user.email}</td>
                      <td className="px-6 py-4 text-sm capitalize">{tx.type}</td>
                      <td className="px-6 py-4 text-sm font-semibold text-gray-900">
                        {tx.type === 'debit' ? '-' : ''}₦{tx.amount.toLocaleString()}
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                          tx.status === 'success' ? 'bg-green-100 text-green-800' :
                          tx.status === 'failed' ? 'bg-red-100 text-red-800' :
                          'bg-yellow-100 text-yellow-800'
                        }`}>
                          {tx.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {format(new Date(tx.timestamp), 'dd MMM yyyy, HH:mm')}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500 font-mono">{tx.reference}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;