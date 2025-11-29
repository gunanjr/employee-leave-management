import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Provider } from 'react-redux';
import { Toaster } from 'react-hot-toast';
import { store } from './store/store';
import PrivateRoute from './components/PrivateRoute';

// Pages
import Login from './pages/Login';
import Register from './pages/Register';
import EmployeeDashboard from './pages/employee/Dashboard';
import ApplyLeave from './pages/employee/ApplyLeave';
import MyRequests from './pages/employee/MyRequests';
import ManagerDashboard from './pages/manager/Dashboard';
import PendingRequests from './pages/manager/PendingRequests';
import AllRequests from './pages/manager/AllRequests';

function App() {
  return (
    <Provider store={store}>
      <BrowserRouter>
        <Toaster position="top-right" />
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Employee Routes */}
          <Route
            path="/employee/dashboard"
            element={
              <PrivateRoute role="employee">
                <EmployeeDashboard />
              </PrivateRoute>
            }
          />
          <Route
            path="/employee/apply-leave"
            element={
              <PrivateRoute role="employee">
                <ApplyLeave />
              </PrivateRoute>
            }
          />
          <Route
            path="/employee/my-requests"
            element={
              <PrivateRoute role="employee">
                <MyRequests />
              </PrivateRoute>
            }
          />

          {/* Manager Routes */}
          <Route
            path="/manager/dashboard"
            element={
              <PrivateRoute role="manager">
                <ManagerDashboard />
              </PrivateRoute>
            }
          />
          <Route
            path="/manager/pending-requests"
            element={
              <PrivateRoute role="manager">
                <PendingRequests />
              </PrivateRoute>
            }
          />
          <Route
            path="/manager/all-requests"
            element={
              <PrivateRoute role="manager">
                <AllRequests />
              </PrivateRoute>
            }
          />

          <Route path="/" element={<Navigate to="/login" />} />
        </Routes>
      </BrowserRouter>
    </Provider>
  );
}

export default App;