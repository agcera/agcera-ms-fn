import { Outlet, Route, createBrowserRouter, createRoutesFromElements, Navigate } from 'react-router-dom';
import CheckLoggedIn from './global/CheckLoggedIn';
import ErrorPage from './global/ErrorPage';
import DashboardPage from './pages/DashboardPage';
import LoginPage from './pages/LoginPage';

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
        <Route path="dashboard" element={<DashboardPage />} />
        <Route path="*" element={<Navigate to="/" />} />
      </Route>
    </Route>
  )
);

export default router;
