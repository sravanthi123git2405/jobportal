import { Navigate } from 'react-router-dom';
import Cookies from 'js-cookie';

const ProtectedRoute = ({ children }) => {
  const jwtToken = Cookies.get('token'); // must match cookie set in login
  return jwtToken ? children : <Navigate to="/login" replace />;
};

export default ProtectedRoute;