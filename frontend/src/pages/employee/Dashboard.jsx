import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../../components/Navbar';
import { getEmployeeStats } from '../../services/api';
import toast from 'react-hot-toast';

const EmployeeDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const { data } = await getEmployeeStats();
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
          <p className="text-gray-600 font-medium">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  const StatCard = ({ title, value, icon, color, bgColor }) => (
    <div className={`${bgColor} rounded-2xl shadow-lg p-6 transform hover:scale-105 transition-all duration-300 cursor-pointer`}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600 mb-1">{title}</p>
          <p className={`text-4xl font-bold ${color}`}>{value}</p>
        </div>
        <div className={`w-14 h-14 ${color} bg-opacity-10 rounded-xl flex items-center justify-center`}>
          {icon}
        </div>
      </div>
    </div>
  );

  const LeaveBalanceCard = ({ type, days, color, icon }) => (
    <div className="bg-white rounded-2xl shadow-md p-6 hover:shadow-xl transition-all duration-300">
      <div className="flex items-center space-x-4">
        <div className={`w-12 h-12 ${color} bg-opacity-10 rounded-xl flex items-center justify-center`}>
          {icon}
        </div>
        <div className="flex-1">
          <p className="text-sm text-gray-600 font-medium">{type}</p>
          <p className={`text-3xl font-bold ${color}`}>{days} <span className="text-lg text-gray-500">days</span></p>
        </div>
      </div>
      <div className="mt-4 bg-gray-100 rounded-full h-2 overflow-hidden">
        <div className={`h-full ${color.replace('text', 'bg')} transition-all duration-500`} style={{ width: `${(days / 10) * 100}%` }}></div>
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
            Welcome Back! 👋
          </h1>
          <p className="text-gray-600">Here's what's happening with your leaves today</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8 animate-slide-up">
          <StatCard
            title="Total Requests"
            value={stats.totalRequests}
            color="text-primary-600"
            bgColor="bg-white"
            icon={
              <svg className="w-8 h-8 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            }
          />
          <StatCard
            title="Pending"
            value={stats.pendingRequests}
            color="text-yellow-600"
            bgColor="bg-white"
            icon={
              <svg className="w-8 h-8 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            }
          />
          <StatCard
            title="Approved"
            value={stats.approvedRequests}
            color="text-green-600"
            bgColor="bg-white"
            icon={
              <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            }
          />
          <StatCard
            title="Rejected"
            value={stats.rejectedRequests}
            color="text-red-600"
            bgColor="bg-white"
            icon={
              <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            }
          />
        </div>

        {/* Leave Balance Section */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
            <span className="w-1 h-8 bg-gradient-to-b from-primary-500 to-accent-500 rounded-full mr-3"></span>
            Your Leave Balance
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <LeaveBalanceCard
              type="Sick Leave"
              days={stats.leaveBalance.sickLeave}
              color="text-blue-600"
              icon={
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              }
            />
            <LeaveBalanceCard
              type="Casual Leave"
              days={stats.leaveBalance.casualLeave}
              color="text-green-600"
              icon={
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              }
            />
            <LeaveBalanceCard
              type="Vacation"
              days={stats.leaveBalance.vacation}
              color="text-purple-600"
              icon={
                <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              }
            />
          </div>
        </div>

        {/* Quick Actions */}
        <div>
          <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
            <span className="w-1 h-8 bg-gradient-to-b from-primary-500 to-accent-500 rounded-full mr-3"></span>
            Quick Actions
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Link
              to="/employee/apply-leave"
              className="group relative overflow-hidden bg-gradient-to-br from-primary-500 to-accent-500 rounded-2xl shadow-xl p-8 text-white transform hover:scale-105 transition-all duration-300"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-white opacity-10 rounded-full -mr-16 -mt-16 group-hover:scale-150 transition-transform duration-500"></div>
              <div className="relative z-10">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-2xl font-bold">Apply for Leave</h3>
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                </div>
                <p className="text-blue-100">Submit a new leave request</p>
              </div>
            </Link>

            <Link
              to="/employee/my-requests"
              className="group relative overflow-hidden bg-white border-2 border-gray-200 rounded-2xl shadow-md p-8 transform hover:scale-105 hover:shadow-xl transition-all duration-300"
            >
              <div className="relative z-10">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-2xl font-bold text-gray-800">My Requests</h3>
                  <svg className="w-8 h-8 text-primary-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                </div>
                <p className="text-gray-600">View all your leave requests</p>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmployeeDashboard;