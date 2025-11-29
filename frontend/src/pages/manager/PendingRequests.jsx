import { useState, useEffect } from 'react';
import Navbar from '../../components/Navbar';
import { getPendingRequests, approveLeave, rejectLeave } from '../../services/api';
import toast from 'react-hot-toast';

const PendingRequests = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(null);

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    try {
      const { data } = await getPendingRequests();
      setRequests(data);
    } catch (error) {
      toast.error('Failed to fetch requests');
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (id) => {
    const comment = prompt('Add comment (optional):');
    setActionLoading(id);

    try {
      await approveLeave(id, comment || '');
      toast.success('Leave approved successfully! ✅');
      fetchRequests();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to approve leave');
    } finally {
      setActionLoading(null);
    }
  };

  const handleReject = async (id) => {
    const comment = prompt('Add rejection reason (required):');
    if (!comment) {
      toast.error('Rejection reason is required');
      return;
    }

    setActionLoading(id);

    try {
      await rejectLeave(id, comment);
      toast.success('Leave rejected');
      fetchRequests();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to reject leave');
    } finally {
      setActionLoading(null);
    }
  };

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
            Pending Requests ⏳
          </h1>
          <p className="text-gray-600">Review and approve employee leave requests</p>
        </div>

        {requests.length === 0 ? (
          <div className="bg-white rounded-3xl shadow-md p-12 text-center">
            <div className="text-6xl mb-4">✨</div>
            <h3 className="text-2xl font-bold text-gray-800 mb-2">All Caught Up!</h3>
            <p className="text-gray-600">No pending requests at the moment</p>
          </div>
        ) : (
          <div className="space-y-6">
            {requests.map((request) => (
              <div
                key={request._id}
                className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 p-6 border-l-4 border-yellow-500"
              >
                <div className="flex flex-col lg:flex-row lg:items-center justify-between mb-6">
                  <div className="flex items-center space-x-4 mb-4 lg:mb-0">
                    <div className="w-16 h-16 bg-gradient-to-br from-primary-400 to-accent-400 rounded-full flex items-center justify-center text-white font-bold text-xl shadow-lg">
                      {request.userId.name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-gray-800">{request.userId.name}</h3>
                      <p className="text-gray-600">{request.userId.email}</p>
                    </div>
                  </div>
                  <span className="px-6 py-2 bg-yellow-100 text-yellow-800 rounded-full text-sm font-bold inline-flex items-center">
                    ⏳ PENDING APPROVAL
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6 p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl">
                  <div>
                    <p className="text-xs text-gray-600 font-semibold mb-1">LEAVE TYPE</p>
                    <p className="text-sm font-bold text-gray-800 capitalize">{request.leaveType}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-600 font-semibold mb-1">START DATE</p>
                    <p className="text-sm font-bold text-gray-800">
                      {new Date(request.startDate).toLocaleDateString()}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-600 font-semibold mb-1">END DATE</p>
                    <p className="text-sm font-bold text-gray-800">
                      {new Date(request.endDate).toLocaleDateString()}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-600 font-semibold mb-1">DURATION</p>
                    <p className="text-sm font-bold text-gray-800">{request.totalDays} days</p>
                  </div>
                </div>

                <div className="mb-6 p-4 bg-gray-50 rounded-xl">
                  <p className="text-sm text-gray-600 font-semibold mb-2">REASON</p>
                  <p className="text-gray-800">{request.reason}</p>
                </div>

                <div className="flex gap-4">
                  <button
                    onClick={() => handleApprove(request._id)}
                    disabled={actionLoading === request._id}
                    className="flex-1 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white px-6 py-3 rounded-xl font-semibold transition-all hover:shadow-lg disabled:opacity-50"
                  >
                    ✅ Approve
                  </button>
                  <button
                    onClick={() => handleReject(request._id)}
                    disabled={actionLoading === request._id}
                    className="flex-1 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white px-6 py-3 rounded-xl font-semibold transition-all hover:shadow-lg disabled:opacity-50"
                  >
                    ❌ Reject
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default PendingRequests;