import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import Home from "./pages/Home"
import AdminLayout from "./pages/admin/AdminLayout"
import ManageParts from "./pages/admin/ManageParts"
import SalesRecords from "./pages/admin/SalesRecords"
import AdminDashboard from "./pages/admin/AdminDashboard"
import AdminLogin from "./pages/AdminLogin"
import AdminRegister from "./pages/AdminRegister"
import ClientRegister from "./pages/client/ClientRegister"
import ClientLogin from "./pages/client/ClientLogin"
import ClientDashboard from "./pages/ClientDashboard"
import Cart from "./pages/client/Cart"
import Checkout from "./pages/client/Checkout"
import ProductDetails from "./pages/product-details"
import Wishlist from "./pages/wishlist"
import MyOrders from "./pages/my-orders"
import Profile from "./pages/profile"
import "./styles/toast.css"
import { CartProvider } from "./context/cart-context"
import { WishlistProvider } from "./context/wishlist-context"
import Imissyou from "./pages/imissyou"
import ClientStore from "./pages/ClientStore"

const App = () => {
  return (
    <Router>
      <CartProvider>
        <WishlistProvider>
          <Routes>
            {/* Admin Routes */}
            <Route path="/admin" element={<AdminLayout />}>
              <Route index element={<AdminDashboard />} />
              <Route path="dashboard" element={<AdminDashboard />} />
              <Route path="manage-parts" element={<ManageParts />} />
              <Route path="sales-records" element={<SalesRecords />} />
            </Route>

            {/* Admin Auth Routes - Outside of AdminLayout */}
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route path="/admin/register" element={<AdminRegister />} />

            {/* Client store */}
            <Route path="/client-store" element={<ClientStore />} />

            {/* Client Routes */}
            <Route path="/" element={<Home />} />
            <Route path="/client-dashboard" element={<ClientDashboard />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/product/:id" element={<ProductDetails />} />
            <Route path="/wishlist" element={<Wishlist />} />
            <Route path="/my-orders" element={<MyOrders />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/client-login" element={<ClientLogin />} />
            <Route path="/client-register" element={<ClientRegister />} />
            <Route path="/imissyou" element={<Imissyou />} />
            {/* Redirect unknown routes */}
            <Route path="*" element={<ClientLogin />} />
          </Routes>
        </WishlistProvider>
      </CartProvider>
    </Router>
  )
}

export default App

