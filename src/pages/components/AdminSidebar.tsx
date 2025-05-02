"use client"

import type React from "react"
import { Link, useNavigate } from "react-router-dom"
import { FaChartBar, FaUsers, FaShoppingCart, FaSignOutAlt, FaStore } from "react-icons/fa"
import styles from "./AdminSidebar.module.css"

const AdminSidebar: React.FC = () => {
  const navigate = useNavigate()

  const handleLogout = () => {
    sessionStorage.removeItem("adminToken")
    navigate("/")
  }

  return (
    <div className={styles.adminSidebar}>
      <div className={styles.sidebarHeader}>
        <h2>CHARDOX MOTO PARTS & SERVICES</h2>
      </div>

      <ul className={styles.sidebarMenu}>
        <li>
          <Link to="/admin/dashboard" className={styles.menuItem}>
            <FaChartBar className={styles.icon} />
            Dashboard
          </Link>
        </li>
        <li>
          <Link to="/admin/sales-records" className={styles.menuItem}>
            <FaShoppingCart className={styles.icon} />
            Sales Records
          </Link>
        </li>
       
       
      </ul>

      
    </div>
  )
}

export default AdminSidebar

