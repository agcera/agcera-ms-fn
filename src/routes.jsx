import { Outlet, Route, createBrowserRouter, createRoutesFromElements, Navigate } from 'react-router-dom';
import CheckLoggedIn from './global/CheckLoggedIn';
import ErrorPage from './global/ErrorPage';
import DashAnalyticsPage from './pages/DashAnalyticsPage';
import UsersPage from './pages/UsersPage';
import LoginPage from './pages/LoginPage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import ResetPasswordPage from './pages/ResetPasswordPage';

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route
      path="/"
      element={
        <CheckLoggedIn>
          {/* Add  here all other validation or action to be taken before the children routes loads. */}
          <Outlet />
        </CheckLoggedIn>
      }
    >
      <Route errorElement={<ErrorPage />}>
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="login" element={<LoginPage />} />
        <Route path="forgot-password" element={<ForgotPasswordPage />} />
        <Route path="reset-password/:token" element={<ResetPasswordPage />} />
        <Route path="dashboard" element={<DashAnalyticsPage />} />
        <Route path="users" element={<UsersPage />} />
        <Route path="*" element={<Navigate to="/" />} />
      </Route>
    </Route>
  )
);

export default router;
