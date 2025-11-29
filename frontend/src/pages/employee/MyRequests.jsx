import { useState, useEffect } from 'react';
import Navbar from '../../components/Navbar';
import { getMyRequests, cancelRequest } from '../../services/api';
import toast from 'react-hot-toast';

const MyRequests = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    try {
      const { data } = await getMyRequests();
      setRequests(data);
    } catch (error) {
      toast.error('Failed to fetch requests');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = async (id) => {
    if (!window.confirm('Are you sure you want to cancel this request?')) return;

    try {
      await cancelRequest(id);
      toast.success('Request cancelled successfully');
      fetchRequests();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to cancel request');
    }
  };

  const getStatusBadge = (status) => {
    const badges = {
      pending: { bg: 'bg-yellow-100', text: 'text-yellow-800', icon: '⏳' },
      approved: { bg: 'bg-green-100', text: 'text-green-800', icon: '✅' },
      rejected: { bg: 'bg-red-100', text: 'text-red-800', icon: '❌' },
    };
    return badges[status] || badges.pending;
  };

  const getLeaveTypeIcon = (type) => {
    const icons = {
      sick: '🏥',
      casual: '☕',
      vacation: '✈️',
    };
    return icons[type] || '📄';
  };

  const filteredRequests = requests.filter((req) => 
    filter === 'all' ? true : req.status === filter
  );

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="flex flex-col items-center space-y-4">
          <div className="w-16 h-16 border-4 border-primary-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-gray-600 font-medium">Loading your requests...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8 animate-fade-in">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">
            My Leave Requests 📋
          </h1>
          <p className="text-gray-600">Track and manage your leave applications</p>
        </div>

        {/* Filter Tabs */}
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

        {/* Requests List */}
        {filteredRequests.length === 0 ? (
          <div className="bg-white rounded-3xl shadow-md p-12 text-center">
            <div className="text-6xl mb-4">📭</div>
            <h3 className="text-2xl font-bold text-gray-800 mb-2">No Requests Found</h3>
            <p className="text-gray-600 mb-6">You haven't submitted any leave requests yet</p>
            <a
              href="/employee/apply-leave"
              className="inline-block bg-gradient-to-r from-primary-500 to-accent-500 text-white px-6 py-3 rounded-xl font-semibold hover:shadow-lg transition-all"
            >
              Apply for Leave
            </a>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredRequests.map((request) => {
              const statusBadge = getStatusBadge(request.status);
              return (
                <div
                  key={request._id}
                  className="bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 p-6 animate-slide-up"
                >
                  <div className="flex flex-col md:flex-row md:items-center justify-between mb-4">
                    <div className="flex items-center space-x-3 mb-4 md:mb-0">
                      <span className="text-4xl">{getLeaveTypeIcon(request.leaveType)}</span>
                      <div>
                        <h3 className="text-xl font-bold text-gray-800 capitalize">
                          {request.leaveType} Leave
                        </h3>
                        <p className="text-sm text-gray-600">
                          Applied on {new Date(request.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <span
                      className={`${statusBadge.bg} ${statusBadge.text} px-4 py-2 rounded-full text-sm font-semibold inline-flex items-center space-x-2`}
                    >
                      <span>{statusBadge.icon}</span>
                      <span>{request.status.toUpperCase()}</span>
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4 p-4 bg-gray-50 rounded-xl">
                    <div>
                      <p className="text-xs text-gray-500 font-medium mb-1">START DATE</p>
                      <p className="text-sm font-semibold text-gray-800">
                        {new Date(request.startDate).toLocaleDateString('en-US', {
                          weekday: 'short',
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric',
                        })}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 font-medium mb-1">END DATE</p>
                      <p className="text-sm font-semibold text-gray-800">
                        {new Date(request.endDate).toLocaleDateString('en-US', {
                          weekday: 'short',
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric',
                        })}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 font-medium mb-1">DURATION</p>
                      <p className="text-sm font-semibold text-gray-800">
                        {request.totalDays} {request.totalDays === 1 ? 'day' : 'days'}
                      </p>
                    </div>
                  </div>

                  <div className="mb-4">
                    <p className="text-sm text-gray-500 font-medium mb-2">REASON</p>
                    <p className="text-gray-700 bg-gray-50 p-3 rounded-lg">{request.reason}</p>
                  </div>

                  {request.managerComment && (
                    <div className="mb-4 border-l-4 border-primary-500 pl-4 bg-primary-50 p-3 rounded-r-lg">
                      <p className="text-sm text-gray-500 font-medium mb-1">MANAGER COMMENT</p>
                      <p className="text-gray-700 font-medium">{request.managerComment}</p>
                    </div>
                  )}

                  {request.status === 'pending' && (
                    <button
                      onClick={() => handleCancel(request._id)}
                      className="px-6 py-2 bg-red-500 hover:bg-red-600 text-white rounded-xl font-medium transition-all hover:shadow-lg"
                    >
                      Cancel Request
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyRequests;