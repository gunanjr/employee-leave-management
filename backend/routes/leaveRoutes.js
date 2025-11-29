const express = require('express');
const router = express.Router();
const {
  applyLeave,
  getMyRequests,
  cancelRequest,
  getBalance,
  getAllRequests,
  getPendingRequests,
  approveLeave,
  rejectLeave,
} = require('../controllers/leaveController');
const { protect, manager } = require('../middleware/auth');

// Employee routes
router.post('/', protect, applyLeave);
router.get('/my-requests', protect, getMyRequests);
router.delete('/:id', protect, cancelRequest);
router.get('/balance', protect, getBalance);

// Manager routes
router.get('/all', protect, manager, getAllRequests);
router.get('/pending', protect, manager, getPendingRequests);
router.put('/:id/approve', protect, manager, approveLeave);
router.put('/:id/reject', protect, manager, rejectLeave);

module.exports = router;