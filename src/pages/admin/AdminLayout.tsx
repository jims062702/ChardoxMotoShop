import { Outlet } from "react-router-dom"
import AdminSidebar from "../components/AdminSidebar"

const AdminLayout = () => {
  return (
    <div className="d-flex">
      {/* Sidebar - Reduced width from 250px to 220px */}
      <div
        style={{
          width: "220px", // Reduced from 250px
          backgroundColor: "#f8f9fa",
          padding: "20px",
          display: "flex",
          flexDirection: "column",
          position: "fixed",
          height: "100%",
          top: 0,
          left: 0,
          boxShadow: "2px 0 10px rgba(0,0,0,0.1)",
        }}
      >
        <AdminSidebar />
      </div>

      {/* Main Content - Reduced left margin from 270px to 240px */}
      <div
        className="container-fluid"
        style={{
          marginLeft: "40px", // Reduced from 270px
          paddingRight: "20px",
          paddingLeft: "15px", // Added left padding
          paddingTop: "20px",
          maxWidth: "calc(100% - 240px)", // Adjusted to match new margin
        }}
      >
        <Outlet /> {/* This is required for child routes to appear */}
      </div>
    </div>
  )
}

export default AdminLayout

