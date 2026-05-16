import { useContext } from 'react';
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate
} from 'react-router-dom';

import { AuthProvider } from './context/AuthContext';
import { AuthContext } from './context/auth';
import { CartProvider } from './context/CartContext';

import Navbar from './components/navbar/Navbar';

import AuthPage from './components/auth/AuthPage';

// USER
import RestaurantList from './components/restaurants/RestaurantList';
import MenuPage from './components/menu/MenuPage';
import CartPage from './components/cart/CartPage';
import OrdersPage from './components/orders/OrdersPage';

// ADMIN
import AdminDashboard from './components/admin/AdminDashboard';

// OWNER
import OwnerPage from './components/restaurants/OwnerPage';


// ✅ PRIVATE ROUTE
function PrivateRoute({
  children,
  adminOnly = false,
  ownerOnly = false
}) {

  const { user } =
    useContext(AuthContext);

  // NOT LOGGED IN
  if (!user) {
    return <Navigate to="/auth" />;
  }

  // ADMIN ONLY
  if (
    adminOnly &&
    user.role !== 'ADMIN'
  ) {
    return <Navigate to="/" />;
  }

  // OWNER ONLY
  if (
    ownerOnly &&
    user.role !== 'RESTAURANT_OWNER'
  ) {
    return <Navigate to="/" />;
  }

  return children;
}


// ✅ ROUTES
function AppRoutes() {

  const { user } =
    useContext(AuthContext);

  return (

    <BrowserRouter>

      {/* NAVBAR */}
      {user && <Navbar />}

      <Routes>

        {/* AUTH */}
        <Route
          path="/auth"
          element={
            user
              ? <Navigate to="/" />
              : <AuthPage />
          }
        />

        {/* HOME */}
        <Route
          path="/"
          element={
            <PrivateRoute>

              {/* OWNER */}
              {
                user?.role ===
                  'RESTAURANT_OWNER'
                  ? (
                    <Navigate to="/owner" />
                  )

                  /* ADMIN */
                  : user?.role ===
                    'ADMIN'
                    ? (
                      <Navigate to="/admin" />
                    )

                    /* USER */
                    : (
                      <RestaurantList />
                    )
              }

            </PrivateRoute>
          }
        />

        {/* USER ROUTES */}
        <Route
          path="/restaurant/:id"
          element={
            <PrivateRoute>
              <MenuPage />
            </PrivateRoute>
          }
        />

        <Route
          path="/cart"
          element={
            <PrivateRoute>
              <CartPage />
            </PrivateRoute>
          }
        />

        <Route
          path="/orders"
          element={
            <PrivateRoute>
              <OrdersPage />
            </PrivateRoute>
          }
        />

        {/* ADMIN */}
        <Route
          path="/admin"
          element={
            <PrivateRoute adminOnly>
              <AdminDashboard />
            </PrivateRoute>
          }
        />

        {/* OWNER */}
        <Route
          path="/owner"
          element={
            <PrivateRoute ownerOnly>
              <OwnerPage />
            </PrivateRoute>
          }
        />

        {/* FALLBACK */}
        <Route
          path="*"
          element={<Navigate to="/" />}
        />

      </Routes>

    </BrowserRouter>
  );
}


// ✅ APP
export default function App() {

  return (

    <AuthProvider>

      <CartProvider>

        <div
          style={{
            minHeight: '100vh',
            background: '#F9F7F4',
            fontFamily:
              '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif'
          }}
        >

          <AppRoutes />

        </div>

      </CartProvider>

    </AuthProvider>
  );
}