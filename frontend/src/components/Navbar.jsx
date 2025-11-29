import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { logout } from '../store/authSlice';
import toast from 'react-hot-toast';

const Navbar = () => {
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logout());
    toast.success('Logged out successfully');
    navigate('/login');
  };

  const isManager = user?.role === 'manager';

  return (
    <nav className="bg-white shadow-md border-b border-gray-200">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to={isManager ? '/manager/dashboard' : '/employee/dashboard'} className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-accent-500 rounded-xl flex items-center justify-center shadow-lg">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-primary-600 to-accent-600 bg-clip-text text-transparent">
              LeaveFlow
            </span>
          </Link>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center space-x-1">
            {isManager ? (
              <>
                <Link to="/manager/dashboard" className="px-4 py-2 rounded-lg text-gray-700 hover:bg-primary-50 hover:text-primary-600 transition-colors font-medium">
                  Dashboard
                </Link>
                <Link to="/manager/pending-requests" className="px-4 py-2 rounded-lg text-gray-700 hover:bg-primary-50 hover:text-primary-600 transition-colors font-medium">
                  Pending
                </Link>
                <Link to="/manager/all-requests" className="px-4 py-2 rounded-lg text-gray-700 hover:bg-primary-50 hover:text-primary-600 transition-colors font-medium">
                  All Requests
                </Link>
              </>
            ) : (
              <>
                <Link to="/employee/dashboard" className="px-4 py-2 rounded-lg text-gray-700 hover:bg-primary-50 hover:text-primary-600 transition-colors font-medium">
                  Dashboard
                </Link>
                <Link to="/employee/apply-leave" className="px-4 py-2 rounded-lg text-gray-700 hover:bg-primary-50 hover:text-primary-600 transition-colors font-medium">
                  Apply Leave
                </Link>
                <Link to="/employee/my-requests" className="px-4 py-2 rounded-lg text-gray-700 hover:bg-primary-50 hover:text-primary-600 transition-colors font-medium">
                  My Requests
                </Link>
              </>
            )}
          </div>

          {/* User Info */}
          <div className="flex items-center space-x-4">
            <div className="hidden md:flex items-center space-x-3">
              <div className="text-right">
                <p className="text-sm font-semibold text-gray-800">{user?.name}</p>
                <p className="text-xs text-gray-500">{user?.role}</p>
              </div>
              <div className="w-10 h-10 bg-gradient-to-br from-primary-400 to-accent-400 rounded-full flex items-center justify-center text-white font-bold shadow-md">
                {user?.name?.charAt(0).toUpperCase()}
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg font-medium transition-all hover:shadow-lg"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;