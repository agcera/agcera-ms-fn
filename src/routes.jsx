import { Navigate, Outlet, Route, createBrowserRouter, createRoutesFromElements } from 'react-router-dom';
import CheckLoggedIn from './global/CheckLoggedIn';
import ErrorPage from './global/ErrorPage';
import AnalyticsPage from './pages/AnalyticsPage';
import DashboardPage from './pages/DashboardPage';
import ForgotPasswordPage from './pages/auth/ForgotPasswordPage';
import LoginPage from './pages/auth/LoginPage';
import ResetPasswordPage from './pages/auth/ResetPasswordPage';
import CreateProductPage from './pages/product/CreateProductPage';
import ProductsPage from './pages/product/ProductsPage';
import UpdateProductPage from './pages/product/UpdateProductPage';
import CreateSalePage from './pages/sale/CreateSalePage';
import SalesPage from './pages/sale/SalesPage';
import ViewSalePage from './pages/sale/ViewSalePage';
import CreateStorePage from './pages/store/CreateStorePage';
import StoreAddProductPage from './pages/store/StoreAddProductPage';
import StoresPage from './pages/store/StoresPage';
import UpdateStorePage from './pages/store/UpdateStorePage';
import ViewStorePage from './pages/store/ViewStorePage';
import TransactionsPage from './pages/transaction/TransactionsPage';
import RegisterUserPage from './pages/user/RegisterUserPage';
import UpdateUserPage from './pages/user/UpdateUserPage';
import UsersPage from './pages/user/UsersPage';
import ViewUserPage from './pages/user/ViewUserPage';
import GenerateReportPage from './pages/report/GenerateReportPage';
import CreateTransactionPage from './pages/transaction/CreateTransactionPage';

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
          <Route path="profile" element={<ViewUserPage />} />
          <Route path="stores" element={<Outlet />}>
            <Route path="" element={<StoresPage />} />
            <Route path=":id" element={<ViewStorePage />} />
            <Route path=":id/add-product" element={<StoreAddProductPage />} />
            <Route path=":id/update" element={<UpdateStorePage />} />
            <Route path="create" element={<CreateStorePage />} />
            <Route path="add-product" element={<StoreAddProductPage />} />
          </Route>
          <Route path="products" element={<Outlet />}>
            <Route path="" element={<ProductsPage />} />
            <Route path=":id/update" element={<UpdateProductPage />} />
            <Route path="create" element={<CreateProductPage />} />
          </Route>
          <Route path="sales" element={<Outlet />}>
            <Route path="" element={<SalesPage />} />
            <Route path=":id" element={<ViewSalePage />} />
            <Route path="create" element={<CreateSalePage />} />
          </Route>
          <Route path="transactions" element={<Outlet />}>
            <Route path="" element={<TransactionsPage />} />
            <Route path="create" element={<CreateTransactionPage />} />
          </Route>
          <Route path="users" element={<Outlet />}>
            <Route path="" element={<UsersPage />} />
            <Route path=":id" element={<ViewUserPage />} />
            <Route path=":id/update" element={<UpdateUserPage />} />
            <Route path="create" element={<RegisterUserPage />} />
          </Route>
          <Route path="report" element={<GenerateReportPage />} />
        </Route>

        <Route path="*" element={<Navigate to="/" />} />
      </Route>
    </Route>
  )
);

export default router;
