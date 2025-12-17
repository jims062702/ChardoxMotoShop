"use client"

import { useState, useEffect } from "react"
import { Card, Row, Col, Table, Form, Button, InputGroup, Pagination, Modal, Badge, Alert } from "react-bootstrap"
import {
  FaSearch,
  FaCalendar,
  FaDownload,
  FaFileAlt,
  FaSignOutAlt,
  FaFilter,
  FaSync,
  FaPlus,
  FaMinus,
  FaExchangeAlt,
} from "react-icons/fa"
import { useNavigate } from "react-router-dom"
import AdminSidebar from "../components/AdminSidebar"
import "bootstrap/dist/css/bootstrap.min.css"
import "../admin/AdminDashboard.css"
import { FileText, Tag, Package, Eye, TrendingUp, TrendingDown } from "lucide-react"
import {
  fetchProducts,
  fetchCategories,
  fetchItemAddedReports,
  fetchItemRemovedReports,
  invalidateCache,
  type StockReport,
  type ItemAddedReport,
  type ItemRemovedReport,
} from "./StockReportsService"

const StockReports = () => {
  const navigate = useNavigate()
  const [reports, setReports] = useState<StockReport[]>([])
  const [itemAddedReports, setItemAddedReports] = useState<ItemAddedReport[]>([])
  const [itemRemovedReports, setItemRemovedReports] = useState<ItemRemovedReport[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [startDate, setStartDate] = useState("")
  const [endDate, setEndDate] = useState("")
  const [apiError, setApiError] = useState<string | null>(null)
  const [showProfileDropdown, setShowProfileDropdown] = useState(false)
  const [showLogoutModal, setShowLogoutModal] = useState(false)
  const [selectedReport, setSelectedReport] = useState<any>(null)
  const [showReportModal, setShowReportModal] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState<string>("all")
  const [categories, setCategories] = useState<string[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [selectedReportType, setSelectedReportType] = useState<string>("all")
  const [debugInfo, setDebugInfo] = useState<any>(null)

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage] = useState(10)

  // Fetch data on component mount
  useEffect(() => {
    loadData()
    testTables() // Add this to check if tables exist

    // Check if screen is mobile
    const checkIfMobile = () => {
      // Implementation would go here
    }

    // Initial check
    checkIfMobile()

    // Add event listener for window resize
    window.addEventListener("resize", checkIfMobile)

    // Cleanup
    return () => window.removeEventListener("resize", checkIfMobile)
  }, [])

  // Test if tables exist
  const testTables = async () => {
    try {
      const response = await fetch("http://localhost:5010/api/reports/test-tables", { credentials: "include" })
      if (response.ok) {
        const data = await response.json()
        setDebugInfo(data)
        console.log("📊 Table test results:", data)
      }
    } catch (error) {
      console.error("❌ Error testing tables:", error)
    }
  }

  // Set up auto-refresh
  useEffect(() => {
    // Refresh data every 30 seconds to keep in sync with Inventory Dashboard
    const intervalId = setInterval(() => {
      loadData(false) // Silent refresh (no loading indicator)
    }, 30000)

    // Clean up interval on component unmount
    return () => clearInterval(intervalId)
  }, [])

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (showProfileDropdown && !event.target.closest(".dropdown")) {
        setShowProfileDropdown(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [showProfileDropdown])

  // Update the loadData function to fetch all types of reports
  const loadData = async (showLoader = true) => {
    if (showLoader) {
      setIsLoading(true)
    }

    try {
      console.log("🔄 Loading data...")

      // Fetch all data concurrently
      const [products, addedReports, removedReports, categoryData] = await Promise.all([
        fetchProducts(),
        fetchItemAddedReports(),
        fetchItemRemovedReports(),
        fetchCategories().catch(() => []), // Don't fail if categories can't be fetched
      ])

      console.log("📦 Products:", products?.length || 0)
      console.log("➕ Stock changes:", addedReports?.length || 0)
      console.log("➖ Removed reports:", removedReports?.length || 0)

      if (products && Array.isArray(products)) {
        setReports(
          products.map((product, index) => ({
            id: index + 1,
            productId: product.id,
            productName: product.name,
            category: product.category || "Uncategorized",
            lastRestockedDate: product.last_restock_date || new Date().toISOString().split("T")[0],
            reportDate: new Date().toISOString().split("T")[0],
            unitPrice: product.price,
            stock: product.stock,
            image: product.image,
          })),
        )
        setApiError(null)
      }

      if (addedReports && Array.isArray(addedReports)) {
        setItemAddedReports(addedReports)
        console.log("✅ Set stock changes:", addedReports.length)
      } else {
        console.warn("⚠️ Stock changes not an array:", addedReports)
      }

      if (removedReports && Array.isArray(removedReports)) {
        setItemRemovedReports(removedReports)
        console.log("✅ Set removed reports:", removedReports.length)
      } else {
        console.warn("⚠️ Removed reports not an array:", removedReports)
      }

      if (categoryData && Array.isArray(categoryData)) {
        setCategories(categoryData)
      }
    } catch (error) {
      console.error("❌ Error loading data:", error)

      // More specific error messages based on the error
      if (error instanceof TypeError && error.message.includes("fetch")) {
        setApiError("Network error: Could not connect to the server. Please check your connection.")
      } else if (error instanceof Error) {
        setApiError(`Error: ${error.message}`)
      } else {
        setApiError("Could not load stock reports. Please try refreshing the page.")
      }
    } finally {
      if (showLoader) {
        setIsLoading(false)
      }
    }
  }

  const handleRefresh = () => {
    invalidateCache() // Force cache refresh
    loadData() // Reload data with loading indicator
    testTables() // Retest tables
  }

  const handleLogout = () => {
    sessionStorage.removeItem("adminToken")
    navigate("/")
  }

  const viewReportDetails = (report: any) => {
    setSelectedReport(report)
    setShowReportModal(true)
  }

  const getStockStatusBadge = (stock: number) => {
    if (stock <= 0) {
      return <Badge bg="danger">Out of Stock</Badge>
    } else if (stock < 10) {
      return <Badge bg="warning">Low Stock</Badge>
    } else {
      return <Badge bg="success">In Stock</Badge>
    }
  }

  // Helper function to get change type badge
  const getChangeTypeBadge = (item: any) => {
    if (item.changeType === "decrease" || item.quantity < 0) {
      return (
        <Badge bg="danger" className="d-flex align-items-center w-auto">
          <FaMinus className="me-1" size={12} />
          {Math.abs(item.quantity)}
        </Badge>
      )
    } else if (item.changeType === "new_item") {
      return (
        <Badge bg="info" className="d-flex align-items-center w-auto">
          <FaPlus className="me-1" size={12} />
          {item.quantity} (New)
        </Badge>
      )
    } else {
      return (
        <Badge bg="success" className="d-flex align-items-center w-auto">
          <FaPlus className="me-1" size={12} />
          {item.quantity}
        </Badge>
      )
    }
  }

  // Get current items based on selected report type
  const getCurrentItems = () => {
    let items = []

    if (selectedReportType === "added") {
      items = itemAddedReports
    } else if (selectedReportType === "removed") {
      items = itemRemovedReports
    } else {
      items = reports
    }

    // Apply filters
    const filteredItems = items.filter((item) => {
      const searchText = searchQuery.toLowerCase()
      const matchesSearch =
        searchQuery === "" ||
        item.productName.toLowerCase().includes(searchText) ||
        item.productId.toString().includes(searchText) ||
        item.category.toLowerCase().includes(searchText)

      const itemDate = new Date(
        selectedReportType === "added"
          ? item.addedDate
          : selectedReportType === "removed"
            ? item.removedDate
            : item.reportDate,
      )
      const startDateObj = startDate ? new Date(startDate) : null
      const endDateObj = endDate ? new Date(endDate) : null

      const matchesStartDate = !startDateObj || itemDate >= startDateObj
      const matchesEndDate = !endDateObj || itemDate <= endDateObj
      const matchesCategory = selectedCategory === "all" || item.category === selectedCategory

      return matchesSearch && matchesStartDate && matchesEndDate && matchesCategory
    })

    return filteredItems
  }

  const filteredItems = getCurrentItems()

  // Pagination logic
  const indexOfLastItem = currentPage * itemsPerPage
  const indexOfFirstItem = indexOfLastItem - itemsPerPage
  const currentItems = filteredItems.slice(indexOfFirstItem, indexOfLastItem)
  const totalPages = Math.ceil(filteredItems.length / itemsPerPage)

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber)
  const nextPage = () => setCurrentPage((prev) => Math.min(prev + 1, totalPages))
  const prevPage = () => setCurrentPage((prev) => Math.max(prev - 1, 1))

  const renderPaginationItems = () => {
    const items = []

    items.push(
      <Pagination.Item key={1} active={currentPage === 1} onClick={() => paginate(1)}>
        1
      </Pagination.Item>,
    )

    if (currentPage > 3) {
      items.push(<Pagination.Ellipsis key="ellipsis1" />)
    }

    for (let i = Math.max(2, currentPage - 1); i <= Math.min(totalPages - 1, currentPage + 1); i++) {
      if (i === 1 || i === totalPages) continue
      items.push(
        <Pagination.Item key={i} active={currentPage === i} onClick={() => paginate(i)}>
          {i}
        </Pagination.Item>,
      )
    }

    if (currentPage < totalPages - 2) {
      items.push(<Pagination.Ellipsis key="ellipsis2" />)
    }

    if (totalPages > 1) {
      items.push(
        <Pagination.Item key={totalPages} active={currentPage === totalPages} onClick={() => paginate(totalPages)}>
          {totalPages}
        </Pagination.Item>,
      )
    }

    return items
  }

  // Calculate statistics
  const totalProducts = reports.length
  const totalStockChanges = itemAddedReports.length
  const totalIncreases = itemAddedReports.filter((item) => item.quantity > 0).length
  const totalDecreases = itemAddedReports.filter((item) => item.quantity < 0).length
  const totalRemovedItems = itemRemovedReports.length
  const totalInventoryValue = reports.reduce((sum, report) => sum + report.unitPrice * report.stock, 0)

  const renderTableHeaders = () => {
    if (selectedReportType === "added") {
      return (
        <tr>
          <th className="ps-3 rounded-start" style={{ borderBottom: "none" }}>
            Product ID/Name
          </th>
          <th style={{ borderBottom: "none" }}>Category</th>
          <th style={{ borderBottom: "none" }}>Date Changed</th>
          <th style={{ borderBottom: "none" }}>Previous Stock</th>
          <th style={{ borderBottom: "none" }}>Change</th>
          <th style={{ borderBottom: "none" }}>New Stock</th>
          <th style={{ borderBottom: "none" }}>Unit Price</th>
          <th style={{ borderBottom: "none" }}>Changed By</th>
          <th className="pe-3 rounded-end" style={{ borderBottom: "none" }}>
            Actions
          </th>
        </tr>
      )
    } else if (selectedReportType === "removed") {
      return (
        <tr>
          <th className="ps-3 rounded-start" style={{ borderBottom: "none" }}>
            Product ID/Name
          </th>
          <th style={{ borderBottom: "none" }}>Category</th>
          <th style={{ borderBottom: "none" }}>Date Removed</th>
          <th style={{ borderBottom: "none" }}>Quantity Removed</th>
          <th style={{ borderBottom: "none" }}>Unit Price</th>
          <th style={{ borderBottom: "none" }}>Total Value</th>
          <th style={{ borderBottom: "none" }}>Reason</th>
          <th className="pe-3 rounded-end" style={{ borderBottom: "none" }}>
            Actions
          </th>
        </tr>
      )
    } else {
      return (
        <tr>
          <th className="ps-3 rounded-start" style={{ borderBottom: "none" }}>
            Product ID/Name
          </th>
          <th style={{ borderBottom: "none" }}>Category</th>
          <th style={{ borderBottom: "none" }}>Last Restocked</th>
          <th style={{ borderBottom: "none" }}>Current Stock</th>
          <th style={{ borderBottom: "none" }}>Unit Price</th>
          <th style={{ borderBottom: "none" }}>Total Value</th>
          <th className="pe-3 rounded-end" style={{ borderBottom: "none" }}>
            Actions
          </th>
        </tr>
      )
    }
  }

  const renderTableRow = (item: any) => {
    if (selectedReportType === "added") {
      return (
        <tr key={item.id} className="shadow-sm">
          <td className="ps-3">
            <div className="d-flex align-items-center">
              <img
                src={`http://localhost:5010/uploads/${item.image}`}
                alt={item.productName}
                style={{
                  width: "40px",
                  height: "40px",
                  objectFit: "cover",
                  borderRadius: "4px",
                  marginRight: "10px",
                }}
                onError={(e) => {
                  ;(e.target as HTMLImageElement).src = "/placeholder.svg?height=40&width=40"
                }}
              />
              <div>
                <div>#{item.productId}</div>
                <div className="text-wrap" style={{ maxWidth: "200px", wordBreak: "break-word" }}>
                  {item.productName}
                </div>
              </div>
            </div>
          </td>
          <td>
            <Badge bg="dark" pill className="px-3 py-2">
              {item.category}
            </Badge>
          </td>
          <td>
            {new Date(item.addedDate).toLocaleDateString()} {new Date(item.addedDate).toLocaleTimeString()}
          </td>
          <td className="text-muted">{item.previousStock || 0}</td>
          <td>{getChangeTypeBadge(item)}</td>
          <td className="fw-bold">{item.newStock || (item.previousStock || 0) + item.quantity}</td>
          <td>₱{item.unitPrice.toLocaleString()}</td>
          <td>{item.addedBy}</td>
          <td className="pe-3 rounded-end">
            <Button
              variant="outline-primary"
              size="sm"
              onClick={() => viewReportDetails(item)}
              title="View Details"
              className="d-flex align-items-center justify-content-center w-100"
            >
              <Eye size={16} className="me-2" /> View Details
            </Button>
          </td>
        </tr>
      )
    } else if (selectedReportType === "removed") {
      return (
        <tr key={item.id} className="shadow-sm">
          <td className="ps-3">
            <div className="d-flex align-items-center">
              <img
                src={`http://localhost:5010/uploads/${item.image}`}
                alt={item.productName}
                style={{
                  width: "40px",
                  height: "40px",
                  objectFit: "cover",
                  borderRadius: "4px",
                  marginRight: "10px",
                }}
                onError={(e) => {
                  ;(e.target as HTMLImageElement).src = "/placeholder.svg?height=40&width=40"
                }}
              />
              <div>
                <div>#{item.productId}</div>
                <div className="text-wrap" style={{ maxWidth: "200px", wordBreak: "break-word" }}>
                  {item.productName}
                </div>
              </div>
            </div>
          </td>
          <td>
            <Badge bg="dark" pill className="px-3 py-2">
              {item.category}
            </Badge>
          </td>
          <td>
            {new Date(item.removedDate).toLocaleDateString()} {new Date(item.removedDate).toLocaleTimeString()}
          </td>
          <td>
            <Badge bg="danger" className="d-flex align-items-center w-auto">
              <FaMinus className="me-1" size={12} />
              {item.quantity}
            </Badge>
          </td>
          <td>₱{item.unitPrice.toLocaleString()}</td>
          <td className="fw-bold">₱{item.totalValue.toLocaleString()}</td>
          <td>{item.reason}</td>
          <td className="pe-3 rounded-end">
            <Button
              variant="outline-primary"
              size="sm"
              onClick={() => viewReportDetails(item)}
              title="View Details"
              className="d-flex align-items-center justify-content-center w-100"
            >
              <Eye size={16} className="me-2" /> View Details
            </Button>
          </td>
        </tr>
      )
    } else {
      return (
        <tr key={item.id} className="shadow-sm">
          <td className="ps-3">
            <div className="d-flex align-items-center">
              <img
                src={`http://localhost:5010/uploads/${item.image}`}
                alt={item.productName}
                style={{
                  width: "40px",
                  height: "40px",
                  objectFit: "cover",
                  borderRadius: "4px",
                  marginRight: "10px",
                }}
                onError={(e) => {
                  ;(e.target as HTMLImageElement).src = "/placeholder.svg?height=40&width=40"
                }}
              />
              <div>
                <div>#{item.productId}</div>
                <div className="text-wrap" style={{ maxWidth: "200px", wordBreak: "break-word" }}>
                  {item.productName}
                </div>
              </div>
            </div>
          </td>
          <td>
            <Badge bg="dark" pill className="px-3 py-2">
              {item.category}
            </Badge>
          </td>
          <td>{new Date(item.lastRestockedDate).toLocaleDateString()}</td>
          <td className="fw-bold">{item.stock}</td>
          <td>₱{item.unitPrice.toLocaleString()}</td>
          <td className="fw-bold">₱{(item.unitPrice * item.stock).toLocaleString()}</td>
          <td className="pe-3 rounded-end">
            <Button
              variant="outline-primary"
              size="sm"
              onClick={() => viewReportDetails(item)}
              title="View Details"
              className="d-flex align-items-center justify-content-center w-100"
            >
              <Eye size={16} className="me-2" /> View Details
            </Button>
          </td>
        </tr>
      )
    }
  }

  return (
    <div className="d-flex">
      <div
        style={{
          width: "100%",
          backgroundColor: "#fbfbfb",
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

      <div
        className="container-fluid"
        style={{
          marginLeft: "270px",
          paddingRight: "20px",
          paddingTop: "20px",
          maxWidth: "calc(100% - 270px)",
        }}
      >
        <div className="header mb-4">
          <h2 className="mb-4" style={{ color: "black" }}>
            Stock Reports
          </h2>
          <div
            className="dropdown"
            style={{ position: "absolute", right: "20px", top: "50%", transform: "translateY(-50%)" }}
          >
            <div
              className="rounded-circle bg-secondary text-white d-flex align-items-center justify-content-center"
              style={{ width: "40px", height: "40px", cursor: "pointer" }}
              onClick={() => setShowProfileDropdown(!showProfileDropdown)}
            >
              A
            </div>
            <div
              className={`dropdown-menu dropdown-menu-end shadow ${showProfileDropdown ? "show" : ""}`}
              style={{ position: "absolute", right: 0, marginTop: "5px" }}
            >
              <div className="dropdown-item fw-bold text-center py-2">Admin Profile</div>
              <div className="dropdown-divider"></div>
              <button className="dropdown-item d-flex align-items-center" onClick={() => setShowLogoutModal(true)}>
                <FaSignOutAlt className="me-2 text-danger" /> Logout
              </button>
            </div>
          </div>
        </div>
        <br />
        <br />

        {/* Debug Info */}
        {debugInfo && !debugInfo.tablesExist?.item_additions && (
          <Alert variant="warning" className="mb-4">
            <Alert.Heading>Database Setup Required</Alert.Heading>
            <p>The tracking tables are not set up yet. Please run the SQL script to create the required tables.</p>
            <hr />
            <p className="mb-0">
              Tables status: item_additions: {debugInfo.tablesExist?.item_additions ? "✅" : "❌"}, item_removals:{" "}
              {debugInfo.tablesExist?.item_removals ? "✅" : "❌"}
            </p>
          </Alert>
        )}

        <div className="row mb-4">
          <div className="col-md-2 col-sm-6 mb-3">
            <Card className="text-center h-100" style={{ boxShadow: "0 4px 12px rgba(0, 0, 0, 0.10)" }}>
              <Card.Body>
                <Package size={24} className="mb-2 text-primary" />
                <Card.Title style={{ fontSize: "24px", marginBottom: "10px" }}>{totalProducts}</Card.Title>
                <Card.Text className="text-muted">Total Products</Card.Text>
              </Card.Body>
            </Card>
          </div>
          <div className="col-md-2 col-sm-6 mb-3">
            <Card className="text-center h-100" style={{ boxShadow: "0 4px 12px rgba(0, 0, 0, 0.10)" }}>
              <Card.Body>
                <FaExchangeAlt size={24} className="mb-2 text-info" />
                <Card.Title style={{ fontSize: "24px", marginBottom: "10px" }}>{totalStockChanges}</Card.Title>
                <Card.Text className="text-muted">Stock Changes</Card.Text>
              </Card.Body>
            </Card>
          </div>
          <div className="col-md-2 col-sm-6 mb-3">
            <Card className="text-center h-100" style={{ boxShadow: "0 4px 12px rgba(0, 0, 0, 0.10)" }}>
              <Card.Body>
                <TrendingUp size={24} className="mb-2 text-success" />
                <Card.Title style={{ fontSize: "24px", marginBottom: "10px" }}>{totalIncreases}</Card.Title>
                <Card.Text className="text-muted">Stock Increases</Card.Text>
              </Card.Body>
            </Card>
          </div>
          <div className="col-md-2 col-sm-6 mb-3">
            <Card className="text-center h-100" style={{ boxShadow: "0 4px 12px rgba(0, 0, 0, 0.10)" }}>
              <Card.Body>
                <TrendingDown size={24} className="mb-2 text-warning" />
                <Card.Title style={{ fontSize: "24px", marginBottom: "10px" }}>{totalDecreases}</Card.Title>
                <Card.Text className="text-muted">Stock Decreases</Card.Text>
              </Card.Body>
            </Card>
          </div>
          <div className="col-md-2 col-sm-6 mb-3">
            <Card className="text-center h-100" style={{ boxShadow: "0 4px 12px rgba(0, 0, 0, 0.10)" }}>
              <Card.Body>
                <FaMinus size={24} className="mb-2 text-danger" />
                <Card.Title style={{ fontSize: "24px", marginBottom: "10px" }}>{totalRemovedItems}</Card.Title>
                <Card.Text className="text-muted">Items Deleted</Card.Text>
              </Card.Body>
            </Card>
          </div>
          <div className="col-md-2 col-sm-6 mb-3">
            <Card className="text-center h-100" style={{ boxShadow: "0 4px 12px rgba(0, 0, 0, 0.10)" }}>
              <Card.Body>
                <Tag size={24} className="mb-2 text-success" />
                <Card.Title style={{ fontSize: "24px", marginBottom: "10px" }}>
                  ₱{totalInventoryValue.toLocaleString()}
                </Card.Title>
                <Card.Text className="text-muted">Inventory Value</Card.Text>
              </Card.Body>
            </Card>
          </div>
        </div>

        {apiError && (
          <div className="alert alert-danger" style={{ marginTop: "20px" }}>
            {apiError}
          </div>
        )}

        <Card className="shadow-sm mb-4">
          <Card.Body style={{ boxShadow: "0 4px 12px rgba(0, 0, 0, 0.10)" }}>
            <div className="d-flex justify-content-between align-items-center mb-3">
              <h5 className="mb-0">Filter Reports</h5>
              {/* <Button
                variant="outline-primary"
                onClick={handleRefresh}
                disabled={isLoading}
                className="d-flex align-items-center"
              >
                {isLoading ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                    Refreshing...
                  </>
                ) : (
                  <>
                    <FaSync className="me-2" /> Refresh Data
                  </>
                )}
              </Button> */}
            </div>
            <Row className="mb-3">
              <Col lg={3} md={6} className="mb-3">
                <Form.Group>
                  <Form.Label>Search</Form.Label>
                  <InputGroup>
                    <InputGroup.Text className="bg-white">
                      <FaSearch />
                    </InputGroup.Text>
                    <Form.Control
                      type="text"
                      placeholder="Search by name, ID or category"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </InputGroup>
                </Form.Group>
              </Col>
              <Col lg={3} md={6} className="mb-3">
                <Form.Group>
                  <Form.Label>Category</Form.Label>
                  <InputGroup>
                    <InputGroup.Text className="bg-white">
                      <FaFilter />
                    </InputGroup.Text>
                    <Form.Select value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)}>
                      <option value="all">All Categories</option>
                      {categories.map((category, index) => (
                        <option key={index} value={category}>
                          {category}
                        </option>
                      ))}
                    </Form.Select>
                  </InputGroup>
                </Form.Group>
              </Col>
              <Col lg={2} md={6} className="mb-3">
                <Form.Group>
                  <Form.Label>Start Date</Form.Label>
                  <InputGroup>
                    <InputGroup.Text className="bg-white">
                      <FaCalendar />
                    </InputGroup.Text>
                    <Form.Control type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
                  </InputGroup>
                </Form.Group>
              </Col>
              <Col lg={2} md={6} className="mb-3">
                <Form.Group>
                  <Form.Label>End Date</Form.Label>
                  <InputGroup>
                    <InputGroup.Text className="bg-white">
                      <FaCalendar />
                    </InputGroup.Text>
                    <Form.Control type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
                  </InputGroup>
                </Form.Group>
              </Col>
              <Col lg={2} md={6} className="d-flex align-items-end mb-3">
                {/* <Button variant="success" className="w-100">
                  <FaDownload className="me-2" /> Export
                </Button> */}
              </Col>
            </Row>
          </Card.Body>
        </Card>

        <Card className="">
          <Card.Body style={{ boxShadow: "0 4px 12px rgba(0, 0, 0, 0.10)" }}>
            <div className="d-flex justify-content-between align-items-center mb-4">
              <h5 className="mb-0">Stock Reports</h5>
              <Form.Group>
                <Form.Select
                  value={selectedReportType}
                  onChange={(e) => {
                    setSelectedReportType(e.target.value)
                    setCurrentPage(1) // Reset to first page when changing report type
                  }}
                  className="w-auto"
                >
                  <option value="all">All Stock Reports</option>
                  <option value="added">Stock Changes Report</option>
                  <option value="removed">Item Deletion Report</option>
                </Form.Select>
              </Form.Group>
            </div>

            <div className="table-responsive">
              <Table hover className="align-middle" style={{ borderCollapse: "separate", borderSpacing: "0 8px" }}>
                <thead className="table-dark">{renderTableHeaders()}</thead>
                <tbody>
                  {isLoading ? (
                    <tr>
                      <td colSpan={9} className="text-center py-5">
                        <div className="spinner-border text-primary" role="status">
                          <span className="visually-hidden">Loading...</span>
                        </div>
                        <p className="mt-3">Loading stock reports...</p>
                      </td>
                    </tr>
                  ) : currentItems.length > 0 ? (
                    currentItems.map((item) => renderTableRow(item))
                  ) : (
                    <tr>
                      <td colSpan={9} className="text-center py-5 text-muted">
                        <div className="d-flex flex-column align-items-center">
                          <FaFileAlt size={40} className="mb-3 text-secondary" />
                          <h5>No reports found</h5>
                          <p className="text-muted">
                            {selectedReportType === "added"
                              ? "No stock changes recorded yet"
                              : selectedReportType === "removed"
                                ? "No item deletions recorded yet"
                                : "Try adjusting your search or filter criteria"}
                          </p>
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </Table>
            </div>
          </Card.Body>
          <Card.Footer className="bg-white">
            {filteredItems.length > 0 && (
              <div className="d-flex flex-wrap justify-content-between align-items-center">
                <div className="mb-2 mb-md-0">
                  Showing {indexOfFirstItem + 1} to {Math.min(indexOfLastItem, filteredItems.length)} of{" "}
                  {filteredItems.length} reports
                </div>
                <Pagination className="mb-0">
                  <Pagination.Prev onClick={prevPage} disabled={currentPage === 1} />
                  {renderPaginationItems()}
                  <Pagination.Next onClick={nextPage} disabled={currentPage === totalPages} />
                </Pagination>
              </div>
            )}
          </Card.Footer>
        </Card>

        {/* Logout Confirmation Modal */}
        <Modal show={showLogoutModal} onHide={() => setShowLogoutModal(false)} centered>
          <Modal.Header closeButton className="bg-light">
            <Modal.Title>
              <div className="d-flex align-items-center">
                <FaSignOutAlt className="me-2 text-danger" />
                Confirm Logout
              </div>
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <p>Are you sure you want to logout? Any unsaved changes will be lost.</p>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowLogoutModal(false)}>
              Cancel
            </Button>
            <Button variant="danger" onClick={handleLogout}>
              Logout
            </Button>
          </Modal.Footer>
        </Modal>

        {/* Report Details Modal */}
        <Modal show={showReportModal} onHide={() => setShowReportModal(false)} centered size="lg">
          <Modal.Header closeButton className="bg-light">
            <Modal.Title>
              <div className="d-flex align-items-center">
                <FileText size={20} className="me-2 text-primary" />
                {selectedReportType === "added"
                  ? "Stock Change"
                  : selectedReportType === "removed"
                    ? "Item Deletion"
                    : "Stock"}{" "}
                Report Details
              </div>
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {selectedReport && (
              <div>
                <div className="text-center mb-4">
                  <img
                    src={`http://localhost:5010/uploads/${selectedReport.image}`}
                    alt={selectedReport.productName}
                    style={{ width: "150px", height: "150px", objectFit: "cover", borderRadius: "8px" }}
                    onError={(e) => {
                      ;(e.target as HTMLImageElement).src = "/placeholder.svg?height=150&width=150"
                    }}
                    className="mb-3"
                  />
                  <h4>{selectedReport.productName}</h4>
                  <Badge bg="dark" pill className="px-3 py-2">
                    {selectedReport.category}
                  </Badge>
                </div>

                <Row className="mb-4">
                  <Col md={6}>
                    <Card className="h-100">
                      <Card.Body>
                        <h5 className="mb-3">Product Information</h5>
                        <div className="mb-2">
                          <strong>Product ID:</strong> #{selectedReport.productId}
                        </div>
                        <div className="mb-2">
                          <strong>Category:</strong> {selectedReport.category}
                        </div>
                        <div className="mb-2">
                          <strong>Unit Price:</strong> ₱{selectedReport.unitPrice.toLocaleString()}
                        </div>
                        {selectedReportType === "added" && (
                          <>
                            <div className="mb-2">
                              <strong>Previous Stock:</strong> {selectedReport.previousStock || 0} units
                            </div>
                            <div className="mb-2">
                              <strong>Stock Change:</strong>{" "}
                              <span
                                className={selectedReport.quantity >= 0 ? "text-success" : "text-danger"}
                                style={{ fontWeight: "bold" }}
                              >
                                {selectedReport.quantity >= 0 ? "+" : ""}
                                {selectedReport.quantity} units
                              </span>
                            </div>
                            <div className="mb-2">
                              <strong>New Stock:</strong>{" "}
                              {selectedReport.newStock || (selectedReport.previousStock || 0) + selectedReport.quantity}{" "}
                              units
                            </div>
                            <div className="mb-2">
                              <strong>Change Value:</strong> ₱{selectedReport.totalValue.toLocaleString()}
                            </div>
                          </>
                        )}
                        {selectedReportType === "removed" && (
                          <>
                            <div className="mb-2">
                              <strong>Quantity Removed:</strong> {selectedReport.quantity} units
                            </div>
                            <div className="mb-2">
                              <strong>Total Value:</strong> ₱{selectedReport.totalValue.toLocaleString()}
                            </div>
                            <div className="mb-2">
                              <strong>Removal Reason:</strong> {selectedReport.reason}
                            </div>
                          </>
                        )}
                        {selectedReportType === "all" && (
                          <>
                            <div className="mb-2">
                              <strong>Current Stock:</strong> {selectedReport.stock} units
                            </div>
                            <div className="mb-2">
                              <strong>Stock Value:</strong> ₱
                              {(selectedReport.unitPrice * selectedReport.stock).toLocaleString()}
                            </div>
                          </>
                        )}
                      </Card.Body>
                    </Card>
                  </Col>
                  <Col md={6}>
                    <Card className="h-100">
                      <Card.Body>
                        <h5 className="mb-3">
                          {selectedReportType === "added"
                            ? "Change"
                            : selectedReportType === "removed"
                              ? "Deletion"
                              : "Report"}{" "}
                          Information
                        </h5>
                        {selectedReportType === "added" && (
                          <>
                            <div className="mb-2">
                              <strong>Date Changed:</strong> {new Date(selectedReport.addedDate).toLocaleDateString()}{" "}
                              at {new Date(selectedReport.addedDate).toLocaleTimeString()}
                            </div>
                            <div className="mb-2">
                              <strong>Changed By:</strong> {selectedReport.addedBy}
                            </div>
                            <div className="mb-2">
                              <strong>Change Type:</strong>{" "}
                              <Badge
                                bg={
                                  selectedReport.changeType === "decrease"
                                    ? "danger"
                                    : selectedReport.changeType === "new_item"
                                      ? "info"
                                      : "success"
                                }
                              >
                                {selectedReport.changeType === "decrease"
                                  ? "Stock Decrease"
                                  : selectedReport.changeType === "new_item"
                                    ? "New Item"
                                    : "Stock Increase"}
                              </Badge>
                            </div>
                            {selectedReport.description && (
                              <div className="mb-2">
                                <strong>Description:</strong> {selectedReport.description}
                              </div>
                            )}
                          </>
                        )}
                        {selectedReportType === "removed" && (
                          <>
                            <div className="mb-2">
                              <strong>Date Removed:</strong> {new Date(selectedReport.removedDate).toLocaleDateString()}{" "}
                              at {new Date(selectedReport.removedDate).toLocaleTimeString()}
                            </div>
                            <div className="mb-2">
                              <strong>Removed By:</strong> {selectedReport.removedBy}
                            </div>
                            <div className="mb-2">
                              <strong>Reason:</strong> {selectedReport.reason}
                            </div>
                          </>
                        )}
                        {selectedReportType === "all" && (
                          <>
                            <div className="mb-2">
                              <strong>Last Restocked:</strong>{" "}
                              {new Date(selectedReport.lastRestockedDate).toLocaleDateString()}
                            </div>
                            
                          </>
                        )}
                      </Card.Body>
                    </Card>
                  </Col>
                </Row>

                <div className="d-flex justify-content-between mt-4">
                  <Button variant="outline-primary">
                    <FaDownload className="me-2" /> Export Report
                  </Button>
                  {selectedReportType === "all" && (
                    <Button
                      variant="primary"
                      onClick={() => {
                        navigate(`/admin/dashboard?edit=${selectedReport.productId}`)
                      }}
                    >
                      Update Stock
                    </Button>
                  )}
                </div>
              </div>
            )}
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowReportModal(false)}>
              Close
            </Button>
          </Modal.Footer>
        </Modal>
      </div>
    </div>
  )
}

export default StockReports
