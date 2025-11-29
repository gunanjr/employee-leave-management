const LeaveRequest = require('../models/LeaveRequest');
const User = require('../models/User');

// @desc    Get employee dashboard stats
// @route   GET /api/dashboard/employee
exports.getEmployeeStats = async (req, res) => {
  try {
    const totalRequests = await LeaveRequest.countDocuments({
      userId: req.user._id,
    });
    const pendingRequests = await LeaveRequest.countDocuments({
      userId: req.user._id,
      status: 'pending',
    });
    const approvedRequests = await LeaveRequest.countDocuments({
      userId: req.user._id,
      status: 'approved',
    });
    const rejectedRequests = await LeaveRequest.countDocuments({
      userId: req.user._id,
      status: 'rejected',
    });

    const user = await User.findById(req.user._id);

    res.json({
      totalRequests,
      pendingRequests,
      approvedRequests,
      rejectedRequests,
      leaveBalance: user.leaveBalance,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get manager dashboard stats
// @route   GET /api/dashboard/manager
exports.getManagerStats = async (req, res) => {
  try {
    const totalEmployees = await User.countDocuments({ role: 'employee' });
    const totalRequests = await LeaveRequest.countDocuments();
    const pendingRequests = await LeaveRequest.countDocuments({
      status: 'pending',
    });
    const approvedRequests = await LeaveRequest.countDocuments({
      status: 'approved',
    });
    const rejectedRequests = await LeaveRequest.countDocuments({
      status: 'rejected',
    });

    res.json({
      totalEmployees,
      totalRequests,
      pendingRequests,
      approvedRequests,
      rejectedRequests,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};