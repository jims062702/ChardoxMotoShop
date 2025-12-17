"use client"

import type React from "react"
import { useNavigate } from "react-router-dom"
import { FaChartBar, FaShoppingCart, FaFileAlt } from "react-icons/fa"
import styles from "./AdminSidebar.module.css"
import { NavLink } from "react-router-dom"

const AdminSidebar: React.FC = () => {
  const navigate = useNavigate()

  const handleLogout = () => {
    sessionStorage.removeItem("adminToken")
    navigate("/")
  }

  return (
    <div className={styles.adminSidebar}>
      <div className={styles.sidebarHeader}>
        <h2 style={{ color: "black" }}>CHARDOX MOTO PARTS & SERVICES</h2>
      </div>

      <ul className={styles.sidebarMenu}>
        <li>
          <NavLink
            to="/admin/dashboard"
            className={({ isActive }) => `${styles.menuItem} ${isActive ? styles.active : ""}`}
          >
            <FaChartBar className={styles.icon} />
            Inventory Dashboard
          </NavLink>
        </li>
        <li>
          <NavLink
            to="/admin/sales-records"
            className={({ isActive }) => `${styles.menuItem} ${isActive ? styles.active : ""}`}
          >
            <FaShoppingCart className={styles.icon} />
            Sales Records
          </NavLink>
        </li>
        <li>
          <NavLink
            to="/admin/stock-reports"
            className={({ isActive }) => `${styles.menuItem} ${isActive ? styles.active : ""}`}
          >
            <FaFileAlt className={styles.icon} />
            Stock Reports
          </NavLink>
        </li>
      </ul>
    </div>
  )
}

export default AdminSidebar
