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
import Redirect from './global/Redirect';
import Protected from './components/route/Protected';
import RegisterPage from './pages/auth/RegisterPage';

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
        <Route path="register" element={<RegisterPage />} />
        <Route path="forgot-password" element={<ForgotPasswordPage />} />
        <Route path="reset-password/:token" element={<ResetPasswordPage />} />

        <Route path="dashboard" element={<DashboardPage />}>
          <Route path="" element={<Redirect />} />
          <Route path="analytics" element={<Protected Component={AnalyticsPage} denied={['user']} />} />
          <Route path="profile" element={<ViewUserPage />} />

          <Route path="stores" element={<Outlet />}>
            <Route path="" element={<StoresPage />} />
            <Route path=":id" element={<Protected Component={ViewStorePage} denied={['user']} />} />
            <Route path=":id/add-product" element={<Protected Component={StoreAddProductPage} denied={['user']} />} />
            <Route path=":id/update" element={<Protected Component={UpdateStorePage} denied={['user']} />} />
            <Route path="create" element={<Protected Component={CreateStorePage} allowed={['admin']} />} />
            <Route path="add-product" element={<Protected Component={StoreAddProductPage} allowed={['admin']} />} />
          </Route>

          <Route path="products" element={<Outlet />}>
            <Route path="" element={<ProductsPage />} />
            <Route path=":id/update" element={<Protected Component={UpdateProductPage} allowed={['admin']} />} />
            <Route path="create" element={<Protected Component={CreateProductPage} allowed={['admin']} />} />
          </Route>
          <Route path="sales" element={<Outlet />}>
            <Route path="" element={<SalesPage />} />
            <Route path=":id" element={<ViewSalePage />} />
            <Route path="create" element={<Protected Component={CreateSalePage} allowed={['keeper']} />} />
          </Route>
          <Route path="transactions" element={<Protected Component={Outlet} denied={['user']} />}>
            <Route path="" element={<TransactionsPage />} />
            <Route path="create" element={<CreateTransactionPage />} />
          </Route>
          <Route path="users" element={<Protected Component={Outlet} denied={['user']} />}>
            <Route path="" element={<UsersPage />} />
            <Route path=":id" element={<ViewUserPage />} />
            <Route path=":id/update" element={<Protected Component={UpdateUserPage} allowed={['admin']} />} />
            <Route path="create" element={<RegisterUserPage />} />
          </Route>
          <Route path="report" element={<Protected Component={GenerateReportPage} denied={['user']} />} />
        </Route>

        <Route path="*" element={<Navigate to="/" />} />
      </Route>
    </Route>
  )
);

export default router;
