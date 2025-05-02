import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import AdminDashboard from "./pages/admin/Dashboard";
import ManageParts from "./pages/admin/ManageParts";
import SalesRecords from "./pages/admin/SalesRecords";
import Shop from "./pages/client/Shop";
import Cart from "./pages/client/Cart";
import Checkout from "./pages/client/Checkout";

function App() {
  return (
    <Router>
      <Routes>
        {/* Admin Routes */}
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="/admin/manage-parts" element={<ManageParts />} />
        <Route path="/admin/sales-records" element={<SalesRecords />} />

        {/* Default Route */}
        <Route path="*" element={<h1>Page Not Found</h1>} />

        {/* Client Routes */}
        <Route path="/shop" element={<Shop />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/checkout" element={<Checkout />} />
      </Routes>
    </Router>
  );
}

export default App;
