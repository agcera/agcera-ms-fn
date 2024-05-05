import { Outlet, Route, createBrowserRouter, createRoutesFromElements, Navigate } from 'react-router-dom';
import CheckLoggedIn from './global/CheckLoggedIn';
import ErrorPage from './global/ErrorPage';
import AnalyticsPage from './pages/AnalyticsPage';
import UsersPage from './pages/UsersPage';
import LoginPage from './pages/LoginPage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import ResetPasswordPage from './pages/ResetPasswordPage';
import StoresPage from './pages/StoresPage';
import ProductsPage from './pages/ProductsPage';
import SalesPage from './pages/SalesPage';
import TransactionsPage from './pages/TransactionsPage';
import DashboardPage from './pages/DashboardPage';
import CreateProductPage from './pages/CreateProductPage';
import UpdateProductPage from './pages/UpdateProductPage';

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

        <Route path="dashboard" element={<DashboardPage />}>
          <Route path="" element={<AnalyticsPage />} />
          <Route path="stores" element={<StoresPage />} />
          <Route path="products" element={<Outlet />}>
            <Route path="" element={<ProductsPage />} />
            <Route path="create" element={<CreateProductPage />} />
            <Route path="update/:id" element={<UpdateProductPage />} />
          </Route>
          <Route path="sales" element={<SalesPage />} />
          <Route path="transactions" element={<TransactionsPage />} />
          <Route path="users" element={<UsersPage />} />
        </Route>

        <Route path="*" element={<Navigate to="/" />} />
      </Route>
    </Route>
  )
);

export default router;
