import { Routes, Route, Navigate } from 'react-router-dom';
import Home from './Component/Home';
import LoginPage from './Component/LoginPage';
import SignupPage from './Component/SignupPage';
import Jobs from './Component/Jobs';
import JobItemDetails from './Component/JobItemDetails';
import ProtectedRoute from './Component/ProtectedRoute'; 
import AppliedJobs from './Component/AppliedJobs';
import './App.css';


const App = () => (
  <Routes>
    <Route path="/login" element={<LoginPage />} />
    <Route path="/signup" element={<SignupPage />} />
    <Route exact path="/applied-jobs" element={<AppliedJobs />} />


    <Route
      path="/home"
      element={
        <ProtectedRoute>
          <Home />
        </ProtectedRoute>
      }
    />
    <Route
      path="/jobs"
      element={
        <ProtectedRoute>
          <Jobs />
        </ProtectedRoute>
      }
    />
    <Route
      path="/jobs/:id"
      element={
        <ProtectedRoute>
          <JobItemDetails />
        </ProtectedRoute>
      }
    />

    <Route path="*" element={<Navigate to="/login" replace />} />
  </Routes>
);

export default App;