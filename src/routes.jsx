import { Outlet, Route, createBrowserRouter, createRoutesFromElements, Navigate } from 'react-router-dom';
import CheckLoggedIn from './global/CheckLoggedIn';
import ErrorPage from './global/ErrorPage';
import AnalyticsPage from './pages/AnalyticsPage';
import UsersPage from './pages/user/UsersPage';
import LoginPage from './pages/auth/LoginPage';
import ForgotPasswordPage from './pages/auth/ForgotPasswordPage';
import ResetPasswordPage from './pages/auth/ResetPasswordPage';
import StoresPage from './pages/store/StoresPage';
import ProductsPage from './pages/product/ProductsPage';
import SalesPage from './pages/sale/SalesPage';
import TransactionsPage from './pages/transaction/TransactionsPage';
import DashboardPage from './pages/DashboardPage';
import CreateProductPage from './pages/product/CreateProductPage';
import UpdateProductPage from './pages/product/UpdateProductPage';
import CreateStorePage from './pages/store/CreateStorePage';
import UpdateStorePage from './pages/store/UpdateStorePage';
import ViewStorePage from './pages/store/ViewStorePage';
import StoreAddProductPage from './pages/store/StoreAddProductPage';

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route errorElement={<ErrorPage />}>
      <Route
        path="/"
        element={
          <CheckLoggedIn>
            {/* Add  here all other validation or action to be taken before the children routes loads. */}
            <Outlet />
          </CheckLoggedIn>
        }
      >
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="login" element={<LoginPage />} />
        <Route path="forgot-password" element={<ForgotPasswordPage />} />
        <Route path="reset-password/:token" element={<ResetPasswordPage />} />

        <Route path="dashboard" element={<DashboardPage />}>
          <Route path="" element={<AnalyticsPage />} />
          <Route path="stores" element={<Outlet />}>
            <Route path="" element={<StoresPage />} />
            <Route path=":id" element={<ViewStorePage />} />
            <Route path=":id/add-product" element={<StoreAddProductPage />} />
            <Route path=":id/update" element={<UpdateStorePage />} />
            <Route path="create" element={<CreateStorePage />} />
          </Route>
          <Route path="products" element={<Outlet />}>
            <Route path="" element={<ProductsPage />} />
            <Route path=":id/update" element={<UpdateProductPage />} />
            <Route path="create" element={<CreateProductPage />} />
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
