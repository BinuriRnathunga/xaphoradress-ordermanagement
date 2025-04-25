// src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';

// Seller Auth
import SellerLogin from './components/SellerLogin';
import SellerSignup from './components/SellerSignup';

// Seller Product Management
import AddProductPage from './pages/AddProductPage';
import ProductListPage from './pages/ProductListPage';
import EditProductPage from './pages/EditProductPage';
import SellerDashboard from './pages/SellerDashboard';
import AddDeliveryAgent from './pages/addDeliveryAgent';
import AdminDashboard from './pages/AdminDashboard';
import ViewDeliveOrderDetails from './pages/ViewDeliveOrderDetails';
import ViewAgents from './pages/ViewAgents';
import UpdateDeliveryAgent from './pages/UpdateDeliveryAgent';
import DeliveOrdersTable from './components/DeliveOrdersTable';
import UserOrderDetails from './pages/UserOrderDetails';

// Buyer / Auth / Admin
import Home from './pages/home';
import XaphoraChatbot from './pages/XaphoraChatbot'; 
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import BuyerSignup from "./pages/BuyerSignup";
import SuperAdminDashboard from './pages/SuperAdminDashboard';
import AdminsList from "./pages/AdminsList";
import AddAdmin from "./pages/AddAdmin";
import UpdateAdmin from "./pages/UpdateAdmin";
import BuyersList from './pages/BuyersList';
import UpdateBuyer from './pages/UpdateBuyer';
import AddBuyer from './pages/AddBuyer';
import SellersList from "./pages/SellersList";
import UpdateSeller from './pages/UpdateSeller';
import AddSeller from './pages/AddSeller';
import OrderDashboard from './pages/OrderDashboard';

// 🆕 E-Commerce Cart Flow Pages
import CartPage from './pages/CartPage';
import CheckoutPage from './pages/CheckoutPage';
import PaymentPage from './pages/PaymentPage';
// import OrderSummaryPage from './pages/OrderSummaryPage';

// Protected route
const ProtectedRoute = ({ children }) => {
  const isAuthenticated = localStorage.getItem('seller_token');
  if (!isAuthenticated) {
    return <Navigate to="/seller/login" replace />;
  }
  return children;
};

function App() {
  return (
    <Router>
      <div className="app-container">
        <div className="content-container">
          <Routes>
            {/* Home */}
            <Route path="/" element={<Home />} />
            {/* <Route path="/home" element={<Home />} /> */}
            <Route path="/chatbot" element={<XaphoraChatbot />} />

            {/* 🛒 Cart Flow */}
            <Route path="/cart" element={<CartPage />} />
            <Route path="/checkout" element={<CheckoutPage />} />
            <Route path="/payment" element={<PaymentPage />} />
            {/* <Route path="/order-summary" element={<OrderSummaryPage />} /> */}

            {/* Seller product routes */}
            <Route path="/add-product" element={<AddProductPage />} />
            <Route path="/products" element={<ProductListPage />} />
            <Route path="/edit-product/:id" element={<EditProductPage />} />
            <Route path="/seller-dashboard" element={<SellerDashboard />} />
            <Route path="/addDeliveryAgent" element={<AddDeliveryAgent />} />
            <Route path="/admin-dashboard" element={<AdminDashboard />} />
            <Route path="/vieworder/:orderId" element={<ViewDeliveOrderDetails />} />
            <Route path="/agents" element={<ViewAgents />} />
            <Route path="/UpdateDeliveryAgent/:agentId" element={<UpdateDeliveryAgent />} />
            <Route path="/Order/:orderId" element={<UserOrderDetails />} />
            <Route path="/orders" element={<OrderDashboard />} />

            {/* Seller login/signup */}
            <Route path="/seller/login" element={<SellerLogin />} />
            <Route path="/seller/signup" element={<SellerSignup />} />
            <Route path="/seller-login" element={<SellerLogin />} />

            {/* Protected Seller Route */}
            <Route 
              path="/seller/dashboard/*"
              element={
                <ProtectedRoute>
                  <div>Seller Dashboard Protected Content</div>
                </ProtectedRoute>
              }
            />

            {/* Buyer/Auth */}
            <Route path="/api/auth/login" element={<Login />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/signup" element={<BuyerSignup />} />

            {/* Super Admin */}
            <Route path="/superadmin" element={<SuperAdminDashboard />} />
            <Route path="/superadmin/admins" element={<AdminsList />} />
            <Route path="/superadmin/add-admin" element={<AddAdmin />} />
            <Route path="/superadmin/update-admin/:adminId" element={<UpdateAdmin />} />
            <Route path="/superadmin/buyers" element={<BuyersList />} />
            <Route path="/superadmin/update-buyer/:buyerId" element={<UpdateBuyer />} />
            <Route path="/superadmin/add-buyer" element={<AddBuyer />} />
            <Route path="/superadmin/sellers" element={<SellersList />} />
            <Route path="/superadmin/update-seller/:sellerId" element={<UpdateSeller />} />
            <Route path="/superadmin/add-seller" element={<AddSeller />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
