import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../../components/Navbar';
import { applyLeave } from '../../services/api';
import toast from 'react-hot-toast';

const ApplyLeave = () => {
  const [formData, setFormData] = useState({
    leaveType: 'sick',
    startDate: '',
    endDate: '',
    reason: '',
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate dates
    const start = new Date(formData.startDate);
    const end = new Date(formData.endDate);
    if (end < start) {
      toast.error('End date must be after start date');
      return;
    }

    setLoading(true);

    try {
      await applyLeave(formData);
      toast.success('Leave request submitted successfully! 🎉');
      navigate('/employee/my-requests');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to apply leave');
    } finally {
      setLoading(false);
    }
  };

  const leaveTypes = [
    { value: 'sick', label: 'Sick Leave', icon: '🏥', color: 'from-blue-500 to-blue-600' },
    { value: 'casual', label: 'Casual Leave', icon: '☕', color: 'from-green-500 to-green-600' },
    { value: 'vacation', label: 'Vacation', icon: '✈️', color: 'from-purple-500 to-purple-600' },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8 max-w-3xl">
        {/* Header */}
        <div className="mb-8 animate-fade-in">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">
            Apply for Leave 📝
          </h1>
          <p className="text-gray-600">Fill in the details to submit your leave request</p>
        </div>

        <div className="bg-white rounded-3xl shadow-xl p-8 animate-slide-up">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Leave Type Selection */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-3">
                Select Leave Type
              </label>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {leaveTypes.map((type) => (
                  <button
                    key={type.value}
                    type="button"
                    onClick={() => setFormData({ ...formData, leaveType: type.value })}
                    className={`p-4 rounded-xl border-2 transition-all duration-300 ${
                      formData.leaveType === type.value
                        ? `bg-gradient-to-br ${type.color} text-white border-transparent shadow-lg scale-105`
                        : 'border-gray-200 hover:border-primary-300 hover:shadow-md'
                    }`}
                  >
                    <div className="text-3xl mb-2">{type.icon}</div>
                    <div className={`font-semibold ${formData.leaveType === type.value ? 'text-white' : 'text-gray-700'}`}>
                      {type.label}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Date Range */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Start Date
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <input
                    type="date"
                    required
                    className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all outline-none"
                    value={formData.startDate}
                    onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  End Date
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <input
                    type="date"
                    required
                    className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all outline-none"
                    value={formData.endDate}
                    onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                  />
                </div>
              </div>
            </div>

            {/* Reason */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Reason for Leave
              </label>
              <textarea
                required
                rows="5"
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all outline-none resize-none"
                placeholder="Please provide a detailed reason for your leave request..."
                value={formData.reason}
                onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
              />
            </div>

            {/* Submit Button */}
            <div className="flex gap-4">
              <button
                type="button"
                onClick={() => navigate('/employee/dashboard')}
                className="flex-1 px-6 py-3 border-2 border-gray-300 rounded-xl font-semibold text-gray-700 hover:bg-gray-50 transition-all"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="flex-1 bg-gradient-to-r from-primary-500 to-accent-500 text-white px-6 py-3 rounded-xl font-semibold hover:shadow-lg hover:scale-105 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
              >
                {loading ? (
                  <span className="flex items-center justify-center">
                    <svg className="animate-spin h-5 w-5 mr-3" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Submitting...
                  </span>
                ) : (
                  'Submit Request'
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ApplyLeave;