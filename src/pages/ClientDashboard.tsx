"use client"

import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { ShoppingCart, Bell } from "lucide-react"
import { useCart } from "../context/cart-context"
import { useWishlist } from "../context/wishlist-context"
import ProductCard from "./components/product-card"
import "../styles/ClientDashboard.css"

const ClientDashboard = () => {
  const navigate = useNavigate()
  const { getCartCount } = useCart()
  const { getWishlistCount } = useWishlist()

  const [items, setItems] = useState([])
  const [filteredItems, setFilteredItems] = useState([])
  const [selectedCategory, setSelectedCategory] = useState("All")
  const [user, setUser] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [isSidebarOpen, setIsSidebarOpen] = useState(true)

  useEffect(() => {
    checkUser()
    fetchParts()
  }, [])

  useEffect(() => {
    if (searchQuery.trim() === "") {
      setFilteredItems(items)
    } else {
      const filtered = items.filter(
        (item) =>
          item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.description?.toLowerCase().includes(searchQuery.toLowerCase()),
      )
      setFilteredItems(filtered)
    }
  }, [searchQuery, items])

  // Check if user is logged in
  const checkUser = async () => {
    try {
      const res = await fetch("http://localhost:5010/api/auth/client-session", {
        credentials: "include",
      })
      const data = await res.json()
      if (data.success) {
        setUser(data.user)
      } else {
        navigate("/client-login")
      }
    } catch (error) {
      console.error("❌ Error fetching user session:", error)
      navigate("/client-login")
    } finally {
      setIsLoading(false)
    }
  }

  const fetchParts = async () => {
    setIsLoading(true)
    try {
      const res = await fetch("http://localhost:5010/api/parts/get-parts")
      const data = await res.json()
      setItems(data)
      setFilteredItems(data)
    } catch (error) {
      console.error("❌ Error fetching parts:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const fetchItemsByCategory = async (category) => {
    setSelectedCategory(category)
    setIsLoading(true)

    if (category === "All") {
      fetchParts()
      return
    }

    try {
      const res = await fetch(`http://localhost:5010/api/parts/category/${category}`)
      const data = await res.json()
      setItems(data)
      setFilteredItems(data)
    } catch (error) {
      console.error("❌ Error fetching category:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleLogout = async () => {
    try {
      await fetch("http://localhost:5010/api/auth/logout", {
        method: "POST",
        credentials: "include",
      })
      // para sa logout (/ kana ang para pa adto sa home)
      navigate("/imissyou")
    } catch (error) {
      console.error("❌ Error logging out:", error)
    }
  }

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen)
  }

  return (
    <div className="dashboard-wrapper">
      {/* Sidebar */}
      <div className={`dashboard-sidebar ${isSidebarOpen ? "open" : "closed"}`}>
        <div className="sidebar-header">
          <h3 className="mb-0 text-white">
            <i className="bi bi-motorcycle me-2"></i>
            MotoShop
          </h3>
          <button className="btn-close-sidebar d-md-none" onClick={toggleSidebar}>
            <i className="bi bi-x-lg"></i>
          </button>
        </div>

        <div className="sidebar-user">
          <div className="avatar">{user?.name?.charAt(0) || "U"}</div>
          <div className="user-info">
            <h6 className="mb-0 text-white">{user?.name || "User"}</h6>
            <small className="text-white-50">{user?.email || "user@example.com"}</small>
          </div>
        </div>

        <div className="sidebar-menu">
          <div className="menu-category">MAIN MENU</div>
          <ul className="nav flex-column">
            <li className="nav-item">
              <a className="nav-link active" href="/client-dashboard">
                <i className="bi bi-grid-1x2-fill"></i>
                <span>Dashboard</span>
              </a>
            </li>
            <li className="nav-item">
              <a
                className="nav-link"
                href="/my-orders"
                onClick={(e) => {
                  e.preventDefault()
                  navigate("/my-orders")
                }}
              >
                <i className="bi bi-bag-fill"></i>
                <span>My Orders</span>
              </a>
            </li>
            <li className="nav-item">
              <a
                className="nav-link"
                href="/wishlist"
                onClick={(e) => {
                  e.preventDefault()
                  navigate("/wishlist")
                }}
              >
                <i className="bi bi-heart-fill"></i>
                <span>Wishlist</span>
                {getWishlistCount() > 0 && (
                  <span className="badge rounded-pill bg-danger ms-2">{getWishlistCount()}</span>
                )}
              </a>
            </li>
            <li className="nav-item">
              <a
                className="nav-link"
                href="/profile"
                onClick={(e) => {
                  e.preventDefault()
                  navigate("/profile")
                }}
              >
                <i className="bi bi-person-fill"></i>
                <span>Profile</span>
              </a>
            </li>
          </ul>

          <div className="menu-category mt-4">CATEGORIES</div>
          <ul className="nav flex-column">
            <li className="nav-item">
              <a
                className={`nav-link ${selectedCategory === "All" ? "active" : ""}`}
                href="#"
                onClick={(e) => {
                  e.preventDefault()
                  fetchItemsByCategory("All")
                }}
              >
                <i className="bi bi-grid-3x3-gap-fill"></i>
                <span>All Products</span>
              </a>
            </li>
            <li className="nav-item">
              <a
                className={`nav-link ${selectedCategory === "Engine" ? "active" : ""}`}
                href="#"
                onClick={(e) => {
                  e.preventDefault()
                  fetchItemsByCategory("Engine")
                }}
              >
                <i className="bi bi-gear-fill"></i>
                <span>Engine Parts</span>
              </a>
            </li>
            <li className="nav-item">
              <a
                className={`nav-link ${selectedCategory === "Body Parts" ? "active" : ""}`}
                href="#"
                onClick={(e) => {
                  e.preventDefault()
                  fetchItemsByCategory("Body Parts")
                }}
              >
                <i className="bi bi-shield-fill"></i>
                <span>Body Parts</span>
              </a>
            </li>
            <li className="nav-item">
              <a
                className={`nav-link ${selectedCategory === "Accessories" ? "active" : ""}`}
                href="#"
                onClick={(e) => {
                  e.preventDefault()
                  fetchItemsByCategory("Accessories")
                }}
              >
                <i className="bi bi-tools"></i>
                <span>Accessories</span>
              </a>
            </li>
          </ul>

          <div className="sidebar-footer">
            <button className="btn btn-outline-light w-100" onClick={handleLogout}>
              <i className="bi bi-box-arrow-right me-2"></i>
              Logout
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="dashboard-main">
        {/* Top Navigation */}
        <nav className="navbar navbar-expand-lg navbar-light bg-white">
          <div className="container-fluid">
            <button className="navbar-toggler border-0 sidebar-toggle" onClick={toggleSidebar}>
              <i className="bi bi-list"></i>
            </button>

            <div className="search-bar">
              <div className="input-group">
                <span className="input-group-text bg-light border-0">
                  <i className="bi bi-search"></i>
                </span>
                <input
                  type="search"
                  className="form-control border-0 bg-light"
                  placeholder="Search products..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>

            <ul className="navbar-nav ms-auto">
              <li className="nav-item">
                <a
                  className="nav-link position-relative"
                  href="/cart"
                  onClick={(e) => {
                    e.preventDefault()
                    navigate("/cart")
                  }}
                >
                  <ShoppingCart className="icon" />
                  {getCartCount() > 0 && (
                    <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                      {getCartCount()}
                      <span className="visually-hidden">items in cart</span>
                    </span>
                  )}
                </a>
              </li>
              <li className="nav-item">
                <a className="nav-link" href="#">
                  <Bell className="icon" />
                </a>
              </li>
            </ul>
          </div>
        </nav>

        {/* Content Area */}
        <div className="content-area">
          <div className="container-fluid">
            {/* Welcome Banner */}
            <div className="welcome-banner mb-4">
              <div className="row align-items-center">
                <div className="col-md-8">
                  <h2 className="mb-1">Welcome back, {user?.name || "User"}!</h2>
                  <p className="text-muted mb-0">Browse our collection of high-quality motorcycle parts</p>
                </div>
                <div className="col-md-4 text-md-end mt-3 mt-md-0">
                  <button className="btn btn-primary" onClick={() => navigate("/cart")}>
                    <i className="bi bi-cart me-2"></i>
                    View Cart
                  </button>
                </div>
              </div>
            </div>

            {/* Category Pills - Mobile Only */}
            <div className="d-md-none mb-4">
              <div className="scrolling-wrapper">
                <button
                  className={`category-pill ${selectedCategory === "All" ? "active" : ""}`}
                  onClick={() => fetchItemsByCategory("All")}
                >
                  All
                </button>
                <button
                  className={`category-pill ${selectedCategory === "Engine" ? "active" : ""}`}
                  onClick={() => fetchItemsByCategory("Engine")}
                >
                  Engine
                </button>
                <button
                  className={`category-pill ${selectedCategory === "Body Parts" ? "active" : ""}`}
                  onClick={() => fetchItemsByCategory("Body Parts")}
                >
                  Body
                </button>
                <button
                  className={`category-pill ${selectedCategory === "Accessories" ? "active" : ""}`}
                  onClick={() => fetchItemsByCategory("Accessories")}
                >
                  Accessories
                </button>
              </div>
            </div>

            {/* Products Grid */}
            {isLoading ? (
              <div className="row">
                {Array.from({ length: 8 }).map((_, index) => (
                  <div className="col-sm-6 col-md-4 col-lg-3 mb-4" key={index}>
                    <div className="product-card loading">
                      <div className="product-image-placeholder"></div>
                      <div className="product-content">
                        <div className="title-placeholder"></div>
                        <div className="price-placeholder"></div>
                        <div className="button-placeholder"></div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : filteredItems.length === 0 ? (
              <div className="empty-state">
                <div className="empty-state-icon">
                  <i className="bi bi-search"></i>
                </div>
                <h3>No products found</h3>
                <p>We couldn't find any products matching your search or filter.</p>
                <button className="btn btn-primary" onClick={() => fetchItemsByCategory("All")}>
                  View All Products
                </button>
              </div>
            ) : (
              <div className="row">
                {filteredItems.map((item) => (
                  <div className="col-sm-6 col-md-4 col-lg-3 mb-4" key={item.id}>
                    <ProductCard item={item} />
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default ClientDashboard

