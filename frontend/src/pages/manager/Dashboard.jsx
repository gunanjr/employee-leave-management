import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../../components/Navbar';
import { getManagerStats } from '../../services/api';
import toast from 'react-hot-toast';

const ManagerDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const { data } = await getManagerStats();
      setStats(data);
    } catch (error) {
      toast.error('Failed to fetch stats');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="flex flex-col items-center space-y-4">
          <div className="w-16 h-16 border-4 border-primary-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-gray-600 font-medium">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  const StatCard = ({ title, value, icon, gradient }) => (
    <div className={`bg-gradient-to-br ${gradient} rounded-2xl shadow-xl p-6 text-white transform hover:scale-105 transition-all duration-300`}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-white/80 mb-1">{title}</p>
          <p className="text-4xl font-bold">{value}</p>
        </div>
        <div className="w-14 h-14 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
          {icon}
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8">
        {/* Welcome Header */}
        <div className="mb-8 animate-fade-in">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">
            Manager Dashboard 👔
          </h1>
          <p className="text-gray-600">Manage your team's leave requests</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8 animate-slide-up">
          <StatCard
            title="Total Employees"
            value={stats.totalEmployees}
            gradient="from-indigo-500 to-indigo-600"
            icon={
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            }
          />
          <StatCard
            title="Total Requests"
            value={stats.totalRequests}
            gradient="from-blue-500 to-blue-600"
            icon={
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            }
          />
          <StatCard
            title="Pending"
            value={stats.pendingRequests}
            gradient="from-yellow-500 to-orange-500"
            icon={
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            }
          />
          <StatCard
            title="Approved"
            value={stats.approvedRequests}
            gradient="from-green-500 to-green-600"
            icon={
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            }
          />
          <StatCard
            title="Rejected"
            value={stats.rejectedRequests}
            gradient="from-red-500 to-red-600"
            icon={
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            }
          />
        </div>

        {/* Quick Actions */}
        <div>
          <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
            <span className="w-1 h-8 bg-gradient-to-b from-primary-500 to-accent-500 rounded-full mr-3"></span>
            Quick Actions
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Link
              to="/manager/pending-requests"
              className="group relative overflow-hidden bg-gradient-to-br from-yellow-500 to-orange-500 rounded-2xl shadow-xl p-8 text-white transform hover:scale-105 transition-all duration-300"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-white opacity-10 rounded-full -mr-16 -mt-16 group-hover:scale-150 transition-transform duration-500"></div>
              <div className="relative z-10">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-2xl font-bold">Pending Requests</h3>
                  <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
                    <span className="text-2xl font-bold">{stats.pendingRequests}</span>
                  </div>
                </div>
                <p className="text-yellow-100">Review and approve pending leaves</p>
              </div>
            </Link>

            <Link
              to="/manager/all-requests"
              className="group relative overflow-hidden bg-white border-2 border-gray-200 rounded-2xl shadow-md p-8 transform hover:scale-105 hover:shadow-xl transition-all duration-300"
            >
              <div className="relative z-10">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-2xl font-bold text-gray-800">All Requests</h3>
                  <svg className="w-10 h-10 text-primary-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                </div>
                <p className="text-gray-600">View complete leave history</p>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ManagerDashboard;