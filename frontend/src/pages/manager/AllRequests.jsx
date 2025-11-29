import { useState, useEffect } from 'react';
import Navbar from '../../components/Navbar';
import { getAllRequests } from '../../services/api';
import toast from 'react-hot-toast';

const AllRequests = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    try {
      const { data } = await getAllRequests();
      setRequests(data);
    } catch (error) {
      toast.error('Failed to fetch requests');
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status) => {
    const badges = {
      pending: { bg: 'bg-yellow-500', text: 'text-white', label: 'PENDING' },
      approved: { bg: 'bg-green-500', text: 'text-white', label: 'APPROVED' },
      rejected: { bg: 'bg-red-500', text: 'text-white', label: 'REJECTED' },
    };
    return badges[status];
  };

  const filteredRequests = requests.filter(req => 
    filter === 'all' ? true : req.status === filter
  );

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="flex flex-col items-center space-y-4">
          <div className="w-16 h-16 border-4 border-primary-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-gray-600 font-medium">Loading requests...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">
            All Leave Requests 📊
          </h1>
          <p className="text-gray-600">Complete history of employee leave requests</p>
        </div>

        <div className="mb-6 flex flex-wrap gap-2">
          {['all', 'pending', 'approved', 'rejected'].map((status) => (
            <button
              key={status}
              onClick={() => setFilter(status)}
              className={`px-6 py-2 rounded-xl font-semibold transition-all ${
                filter === status
                  ? 'bg-gradient-to-r from-primary-500 to-accent-500 text-white shadow-lg scale-105'
                  : 'bg-white text-gray-700 hover:shadow-md'
              }`}
            >
              {status.charAt(0).toUpperCase() + status.slice(1)}
            </button>
          ))}
        </div>

        {filteredRequests.length === 0 ? (
          <div className="bg-white rounded-3xl shadow-md p-12 text-center">
            <div className="text-6xl mb-4">📭</div>
            <h3 className="text-2xl font-bold text-gray-800 mb-2">No Requests Found</h3>
            <p className="text-gray-600">No leave requests match your filter</p>
          </div>
        ) : (
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gradient-to-r from-primary-500 to-accent-500 text-white">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-bold uppercase">Employee</th>
                    <th className="px-6 py-4 text-left text-sm font-bold uppercase">Leave Type</th>
                    <th className="px-6 py-4 text-left text-sm font-bold uppercase">Duration</th>
                    <th className="px-6 py-4 text-left text-sm font-bold uppercase">Days</th>
                    <th className="px-6 py-4 text-left text-sm font-bold uppercase">Status</th>
                    <th className="px-6 py-4 text-left text-sm font-bold uppercase">Applied On</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredRequests.map((request) => {
                    const badge = getStatusBadge(request.status);
                    return (
                      <tr key={request._id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4">
                          <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 bg-gradient-to-br from-primary-400 to-accent-400 rounded-full flex items-center justify-center text-white font-bold">
                              {request.userId.name.charAt(0).toUpperCase()}
                            </div>
                            <div>
                              <div className="text-sm font-semibold text-gray-900">{request.userId.name}</div>
                              <div className="text-xs text-gray-500">{request.userId.email}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className="text-sm font-medium text-gray-900 capitalize">{request.leaveType}</span>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-600">
                          {new Date(request.startDate).toLocaleDateString()} - {new Date(request.endDate).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4">
                          <span className="text-sm font-semibold text-gray-900">{request.totalDays} days</span>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`${badge.bg} ${badge.text} px-3 py-1 rounded-full text-xs font-bold`}>
                            {badge.label}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-600">
                          {new Date(request.createdAt).toLocaleDateString()}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AllRequests;