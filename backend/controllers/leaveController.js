const LeaveRequest = require('../models/LeaveRequest');
const User = require('../models/User');

exports.applyLeave = async (req, res) => {
  try {
    const { leaveType, startDate, endDate, reason } = req.body;

    const start = new Date(startDate);
    const end = new Date(endDate);
    const totalDays = Math.ceil((end - start) / (1000 * 60 * 60 * 24)) + 1;

    const user = await User.findById(req.user._id);
    let balanceField;
    
    if (leaveType === 'sick') balanceField = 'sickLeave';
    else if (leaveType === 'casual') balanceField = 'casualLeave';
    else if (leaveType === 'vacation') balanceField = 'vacation';

    if (user.leaveBalance[balanceField] < totalDays) {
      return res.status(400).json({ message: 'Insufficient leave balance' });
    }

    const leaveRequest = await LeaveRequest.create({
      userId: req.user._id,
      leaveType,
      startDate,
      endDate,
      totalDays,
      reason,
    });

    const populatedRequest = await LeaveRequest.findById(leaveRequest._id)
      .populate('userId', 'name email');

    res.status(201).json(populatedRequest);
  } catch (error) {
    console.error('Apply Leave Error:', error);
    res.status(500).json({ message: error.message });
  }
};

exports.getMyRequests = async (req, res) => {
  try {
    const requests = await LeaveRequest.find({ userId: req.user._id })
      .populate('userId', 'name email')
      .sort({ createdAt: -1 });
    res.json(requests);
  } catch (error) {
    console.error('Get My Requests Error:', error);
    res.status(500).json({ message: error.message });
  }
};

exports.cancelRequest = async (req, res) => {
  try {
    const request = await LeaveRequest.findById(req.params.id);

    if (!request) {
      return res.status(404).json({ message: 'Leave request not found' });
    }

    if (request.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    if (request.status !== 'pending') {
      return res.status(400).json({ message: 'Can only cancel pending requests' });
    }

    await LeaveRequest.findByIdAndDelete(req.params.id);
    res.json({ message: 'Leave request cancelled' });
  } catch (error) {
    console.error('Cancel Request Error:', error);
    res.status(500).json({ message: error.message });
  }
};

exports.getBalance = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    res.json(user.leaveBalance);
  } catch (error) {
    console.error('Get Balance Error:', error);
    res.status(500).json({ message: error.message });
  }
};

exports.getAllRequests = async (req, res) => {
  try {
    const requests = await LeaveRequest.find()
      .populate('userId', 'name email')
      .sort({ createdAt: -1 });
    
    console.log('All Requests Found:', requests.length);
    res.json(requests);
  } catch (error) {
    console.error('Get All Requests Error:', error);
    res.status(500).json({ message: error.message });
  }
};

exports.getPendingRequests = async (req, res) => {
  try {
    const requests = await LeaveRequest.find({ status: 'pending' })
      .populate('userId', 'name email')
      .sort({ createdAt: -1 });
    
    console.log('Pending Requests Found:', requests.length);
    res.json(requests);
  } catch (error) {
    console.error('Get Pending Requests Error:', error);
    res.status(500).json({ message: error.message });
  }
};

// Updated approveLeave with extensive logging
exports.approveLeave = async (req, res) => {
  try {
    const { managerComment } = req.body;
    const requestId = req.params.id;

    console.log('=== APPROVE LEAVE DEBUG ===');
    console.log('Request ID:', requestId);
    console.log('Manager Comment:', managerComment);

    const request = await LeaveRequest.findById(requestId);

    if (!request) {
      console.log('❌ Leave request not found');
      return res.status(404).json({ message: 'Leave request not found' });
    }

    console.log('✅ Request found:', { status: request.status, leaveType: request.leaveType });

    if (request.status !== 'pending') {
      console.log('❌ Already processed:', request.status);
      return res.status(400).json({ message: 'Request already processed' });
    }

    const user = await User.findById(request.userId);
    
    if (!user) {
      console.log('❌ User not found');
      return res.status(404).json({ message: 'User not found' });
    }

    console.log('✅ User found:', user.name);

    let balanceField;
    if (request.leaveType === 'sick') balanceField = 'sickLeave';
    else if (request.leaveType === 'casual') balanceField = 'casualLeave';
    else if (request.leaveType === 'vacation') balanceField = 'vacation';

    console.log('Balance check:', {
      field: balanceField,
      current: user.leaveBalance[balanceField],
      needed: request.totalDays
    });

    if (user.leaveBalance[balanceField] < request.totalDays) {
      console.log('❌ Insufficient balance');
      return res.status(400).json({ message: 'Insufficient leave balance' });
    }

    user.leaveBalance[balanceField] -= request.totalDays;
    await user.save();

    request.status = 'approved';
    request.managerComment = managerComment || 'Approved';
    await request.save();

    const populatedRequest = await LeaveRequest.findById(request._id)
      .populate('userId', 'name email');

    console.log('✅ APPROVED SUCCESSFULLY');
    res.json(populatedRequest);
  } catch (error) {
    console.error('❌ ERROR:', error.message);
    console.error('Stack:', error.stack);
    res.status(500).json({ message: error.message });
  }
};

exports.rejectLeave = async (req, res) => {
  try {
    const { managerComment } = req.body;
    const request = await LeaveRequest.findById(req.params.id);

    console.log('Rejecting request:', req.params.id);

    if (!request) {
      return res.status(404).json({ message: 'Leave request not found' });
    }

    if (request.status !== 'pending') {
      return res.status(400).json({ message: 'Request already processed' });
    }

    request.status = 'rejected';
    request.managerComment = managerComment || 'Rejected';
    await request.save();

    const populatedRequest = await LeaveRequest.findById(request._id)
      .populate('userId', 'name email');

    console.log('Leave rejected successfully');
    res.json(populatedRequest);
  } catch (error) {
    console.error('Reject Leave Error:', error);
    res.status(500).json({ message: error.message });
  }
};
