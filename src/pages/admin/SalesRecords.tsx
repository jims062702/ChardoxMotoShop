"use client"

import { useState, useEffect, useMemo } from "react"
import { Card, Row, Col, Table, Form, Button, InputGroup, Pagination, Modal, Badge } from "react-bootstrap"
import {
  FaSearch,
  FaCalendar,
  FaDownload,
  FaFileAlt,
  FaSignOutAlt,
  FaShoppingCart,
  FaMoneyBillWave,
  FaUsers,
  FaChartBar,
  FaChartPie,
  FaChartLine,
} from "react-icons/fa"
import { useNavigate } from "react-router-dom"
import AdminSidebar from "../components/AdminSidebar"
import "bootstrap/dist/css/bootstrap.min.css"
import "../admin/AdminDashboard.css"
import { Edit, FileBarChart, Clock, CheckCircle, AlertCircle, Undo2} from "lucide-react"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
} from "recharts"

interface Sale {
  id: number
  originalSaleId?: number
  customer: string
  totalAmount: number
  date: string
  itemName: string
  quantity: number
  paymentMethod?: string
  status?: string
}

const SalesRecords = () => {
  const navigate = useNavigate()
  const [sales, setSales] = useState<Sale[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [startDate, setStartDate] = useState("")
  const [endDate, setEndDate] = useState("")
  const [apiError, setApiError] = useState<string | null>(null)
  const [showProfileDropdown, setShowProfileDropdown] = useState(false)
  const [showLogoutModal, setShowLogoutModal] = useState(false)
  const [selectedSale, setSelectedSale] = useState<Sale | null>(null)
  const [showStatusModal, setShowStatusModal] = useState(false)
  const [newStatus, setNewStatus] = useState("")
  const [statusUpdateLoading, setStatusUpdateLoading] = useState(false)
  const [activeChart, setActiveChart] = useState<"payment" | "status" | "trend">("payment")
  const [isMobile, setIsMobile] = useState(false)
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage] = useState(10)

  useEffect(() => {
    fetchSales()

    // Check if screen is mobile
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < 768)
      setSidebarCollapsed(window.innerWidth < 992)
    }

    // Initial check
    checkIfMobile()

    // Add event listener for window resize
    window.addEventListener("resize", checkIfMobile)

    // Cleanup
    return () => window.removeEventListener("resize", checkIfMobile)
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

  const fetchSales = async () => {
    try {
      const response = await fetch("http://localhost:5010/api/sales", { credentials: "include" })
      if (!response.ok) throw new Error("Failed to fetch sales")
      const data = await response.json()

      // Convert all dates to Philippines timezone before setting state
      const formattedSales = data.map((sale: Sale) => ({
        ...sale,
        date: new Date(sale.date).toLocaleDateString("en-PH", { timeZone: "Asia/Manila" }),
      }))

      setSales(formattedSales)
      console.log("Formatted sales data:", formattedSales) // Debug log
    } catch (error) {
      console.error("Error fetching sales:", error)
      setApiError("Could not load sales data. Ensure the server is running.")
    }
  }

  const handleLogout = () => {
    sessionStorage.removeItem("adminToken")
    navigate("/")
  }

  const handleStatusUpdate = async () => {
    if (!selectedSale || !newStatus) return

    try {
      setStatusUpdateLoading(true)

      // Call the API to update the status in the database
      const response = await fetch(`http://localhost:5010/api/sales/update-status/${selectedSale.originalSaleId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status: newStatus }),
        credentials: "include",
      })

      if (!response.ok) {
        throw new Error("Failed to update status")
      }

      // Update the status in the local state for all items with the same originalSaleId
      setSales((prevSales) =>
        prevSales.map((sale) =>
          sale.originalSaleId === selectedSale.originalSaleId ? { ...sale, status: newStatus } : sale,
        ),
      )

      setShowStatusModal(false)
      setSelectedSale(null)
    } catch (error) {
      console.error("Error updating status:", error)
      setApiError("Failed to update status. Please try again.")
    } finally {
      setStatusUpdateLoading(false)
    }
  }

  const getStatusBadgeColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case "completed":
        return "bg-success"
      case "returned":
        return "bg-warning"
      case "cancelled":
        return "bg-danger"
      default:
        return "bg-secondary"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status?.toLowerCase()) {
      case "completed":
        return <CheckCircle size={16}/>
      case "returned":
        return <AlertCircle size={16}/>
      case "cancelled":
        return <Undo2 size={16}/>
      default:
        return <Clock size={16} />
    }
  }

  const filteredSales = sales.filter((sale) => {
    const matchesSearch =
      searchQuery === "" ||
      sale.customer.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (sale.itemName && sale.itemName.toLowerCase().includes(searchQuery.toLowerCase()))

    // Convert input dates to Philippines timezone before comparing
    const saleDate = new Date(sale.date).toLocaleDateString("en-PH", { timeZone: "Asia/Manila" })
    const startDateFormatted = startDate
      ? new Date(startDate).toLocaleDateString("en-PH", { timeZone: "Asia/Manila" })
      : ""
    const endDateFormatted = endDate ? new Date(endDate).toLocaleDateString("en-PH", { timeZone: "Asia/Manila" }) : ""

    const matchesStartDate = startDate === "" || saleDate >= startDateFormatted
    const matchesEndDate = endDate === "" || saleDate <= endDateFormatted

    return matchesSearch && matchesStartDate && matchesEndDate
  })

  // Calculate total items sold
  const totalItems = filteredSales.reduce((sum, sale) => sum + sale.quantity, 0)

  // Calculate total sales amount - ensure we're adding numbers, not concatenating strings
  const totalSales = filteredSales.reduce((sum, sale) => sum + Number(sale.totalAmount), 0)

  // Calculate unique customers
  const uniqueCustomers = new Set(filteredSales.map((sale) => sale.customer)).size

  // Prepare chart data
  const paymentMethodData = useMemo(() => {
    const cashSales = filteredSales.filter((sale) => sale.paymentMethod === "cash")
    const eWalletSales = filteredSales.filter((sale) => sale.paymentMethod !== "cash")

    return [
      { name: "Cash", value: cashSales.reduce((sum, sale) => sum + Number(sale.totalAmount), 0) },
      { name: "E-Wallet", value: eWalletSales.reduce((sum, sale) => sum + Number(sale.totalAmount), 0) },
    ]
  }, [filteredSales])

  const statusData = useMemo(() => {
    const statusCounts = filteredSales.reduce(
      (acc, sale) => {
        const status = sale.status || "Completed"
        if (!acc[status]) {
          acc[status] = 0
        }
        acc[status] += Number(sale.totalAmount)
        return acc
      },
      {} as Record<string, number>,
    )

    return Object.entries(statusCounts).map(([name, value]) => ({ name, value }))
  }, [filteredSales])

  const trendData = useMemo(() => {
    // Group sales by date
    const salesByDate = filteredSales.reduce(
      (acc, sale) => {
        if (!acc[sale.date]) {
          acc[sale.date] = 0
        }
        acc[sale.date] += Number(sale.totalAmount)
        return acc
      },
      {} as Record<string, number>,
    )

    // Convert to array and sort by date
    return Object.entries(salesByDate)
      .map(([date, amount]) => ({ date, amount }))
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
      .slice(-10) // Get last 10 days
  }, [filteredSales])

  // Pagination logic
  const indexOfLastItem = currentPage * itemsPerPage
  const indexOfFirstItem = indexOfLastItem - itemsPerPage
  const currentItems = filteredSales.slice(indexOfFirstItem, indexOfLastItem)
  const totalPages = Math.ceil(filteredSales.length / itemsPerPage)

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

  // Colors for charts
  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884d8", "#82ca9d"]

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
            Sales Records
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

        <div className="row mb-4">
          <div className="col-md-4 col-sm-6 mb-3">
            <Card className="text-center h-100" style={{ boxShadow: "0 4px 12px rgba(0, 0, 0, 0.10)" }}>
              <Card.Body>
                <FaShoppingCart size={24} className="mb-2 text-success" />
                <Card.Title style={{ fontSize: "24px", marginBottom: "10px" }}>{totalItems}</Card.Title>
                <Card.Text className="text-muted">Items Sold</Card.Text>
              </Card.Body>
            </Card>
          </div>
          <div className="col-md-4 col-sm-6 mb-3">
            <Card className="text-center h-100" style={{ boxShadow: "0 4px 12px rgba(0, 0, 0, 0.10)" }}>
              <Card.Body>
                <FaMoneyBillWave size={24} className="mb-2 text-primary" />
                <Card.Title style={{ fontSize: "24px", marginBottom: "10px" }}>
                  ₱{totalSales.toLocaleString()}
                </Card.Title>
                <Card.Text className="text-muted">Total Sales</Card.Text>
              </Card.Body>
            </Card>
          </div>
          <div className="col-md-4 col-sm-6 mb-3">
            <Card className="text-center h-100" style={{ boxShadow: "0 4px 12px rgba(0, 0, 0, 0.10)" }}>
              <Card.Body>
                <FaUsers size={24} className="mb-2 text-danger" />
                <Card.Title style={{ fontSize: "24px", marginBottom: "10px" }}>{uniqueCustomers}</Card.Title>
                <Card.Text className="text-muted">Customers</Card.Text>
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
            <h5 className="mb-3">Sales Analytics</h5>
            <div className="mb-3">
              <div className="btn-group w-100">
                <Button
                  variant={activeChart === "payment" ? "primary" : "outline-primary"}
                  onClick={() => setActiveChart("payment")}
                  className="d-flex align-items-center justify-content-center"
                >
                  <FaChartPie className="me-2" /> Payment Methods
                </Button>
                <Button
                  variant={activeChart === "status" ? "primary" : "outline-primary"}
                  onClick={() => setActiveChart("status")}
                  className="d-flex align-items-center justify-content-center"
                >
                  <FaChartBar className="me-2" /> Status Distribution
                </Button>
                <Button
                  variant={activeChart === "trend" ? "primary" : "outline-primary"}
                  onClick={() => setActiveChart("trend")}
                  className="d-flex align-items-center justify-content-center"
                >
                  <FaChartLine className="me-2" /> Sales Trend
                </Button>
              </div>
            </div>

            <div style={{ height: "300px" }}>
              {activeChart === "payment" && (
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={paymentMethodData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    >
                      {paymentMethodData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => `₱${Number(value).toLocaleString()}`} />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              )}

              {activeChart === "status" && (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={statusData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip formatter={(value) => `₱${Number(value).toLocaleString()}`} />
                    <Legend />
                    <Bar dataKey="value" name="Total Amount" fill="#8884d8">
                      {statusData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              )}

              {activeChart === "trend" && (
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={trendData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip formatter={(value) => `₱${Number(value).toLocaleString()}`} />
                    <Legend />
                    <Line type="monotone" dataKey="amount" name="Sales Amount" stroke="#8884d8" activeDot={{ r: 8 }} />
                  </LineChart>
                </ResponsiveContainer>
              )}
            </div>
          </Card.Body>
        </Card>

        <Card className="shadow-sm mb-4">
          <Card.Body style={{ boxShadow: "0 4px 12px rgba(0, 0, 0, 0.10)" }}>
            <h5 className="mb-3">Sales Records</h5>
            <Row className="mb-3">
              <Col lg={4} md={6} className="mb-3">
                <Form.Group>
                  <Form.Label>Search</Form.Label>
                  <InputGroup>
                    <InputGroup.Text className="bg-white">
                      <FaSearch />
                    </InputGroup.Text>
                    <Form.Control
                      type="text"
                      placeholder="Search customer or product"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </InputGroup>
                </Form.Group>
              </Col>
              <Col lg={3} md={6} className="mb-3">
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
              <Col lg={3} md={6} className="mb-3">
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
                <Button variant="success" className="w-100">
                  <FaDownload className="me-2" /> Export
                </Button>
              </Col>
            </Row>
          </Card.Body>
        </Card>

        <Card className="">
          <Card.Body style={{ boxShadow: "0 4px 12px rgba(0, 0, 0, 0.10)" }}>
            <div className="table-responsive">
              <Table hover className="align-middle" style={{ borderCollapse: "separate", borderSpacing: "0 8px" }}>
                <thead className="table-dark">
                  <tr>
                    <th className="ps-3 rounded-start" style={{ borderBottom: "none" }}>
                      ID
                    </th>
                    <th style={{ borderBottom: "none" }}>Customer</th>
                    <th style={{ borderBottom: "none", width: "25%" }}>Product Name</th>
                    <th style={{ borderBottom: "none" }}>Quantity</th>
                    <th style={{ borderBottom: "none" }}>Total Amount</th>
                    <th style={{ borderBottom: "none" }}>Payment Method</th>
                    <th style={{ borderBottom: "none" }}>Status</th>
                    <th style={{ borderBottom: "none" }}>Purchased Date</th>
                    <th className="pe-3 rounded-end" style={{ borderBottom: "none" }}>
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {currentItems.length > 0 ? (
                    currentItems.map((sale) => (
                      <tr key={sale.id} className="shadow-sm">
                        <td className="ps-3 rounded-start">#{sale.originalSaleId || sale.id}</td>
                        <td className="fw-medium">{sale.customer}</td>
                        <td>
                          <div
                            className="text-wrap"
                            style={{ maxWidth: "100%", wordBreak: "break-word", fontWeight: "bold" }}
                          >
                            {sale.itemName}
                          </div>
                        </td>
                        <td>{sale.quantity}</td>
                        <td className="fw-bold">₱{sale.totalAmount.toLocaleString()}</td>
                        <td>
                          <Badge
                            bg={sale.paymentMethod === "cash" ? "success" : "primary"}
                            className="px-3 py-2"
                            style={{ fontSize: "0.85rem" }}
                          >
                            {sale.paymentMethod === "cash" ? "Cash" : "E-Wallet"}
                          </Badge>
                        </td>
                        <td>
                          <Badge
                            bg={getStatusBadgeColor(sale.status || "Completed").replace("bg-", "")}
                            className="px-3 py-2"
                            style={{ fontSize: "0.85rem" }}
                          >
                            <div className="d-flex align-items-center">
                              {getStatusIcon(sale.status || "Completed")}
                              <span className="ms-1">{sale.status || "Completed"}</span>
                            </div>
                          </Badge>
                        </td>
                        <td>{sale.date}</td>
                        <td className="pe-3 rounded-end">
                          <Button
                            variant="outline-primary"
                            size="sm"
                            onClick={() => {
                              setSelectedSale(sale)
                              setNewStatus(sale.status || "Completed")
                              setShowStatusModal(true)
                            }}
                            title="Update Status"
                            className="d-flex align-items-center justify-content-center w-100"
                            style={{
                              borderRadius: "8px",
                              transition: "all 0.3s ease",
                              boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
                              fontWeight: "500",
                              padding: "8px 12px",
                            }}
                          >
                            <Edit size={16} className="me-2" /> Update
                          </Button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={9} className="text-center py-5 text-muted">
                        <div className="d-flex flex-column align-items-center">
                          <FaFileAlt size={40} className="mb-3 text-secondary" />
                          <h5>No sales records found</h5>
                          <p className="text-muted">Try adjusting your search or filter criteria</p>
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </Table>
            </div>
          </Card.Body>
          <Card.Footer className="bg-white">
            {filteredSales.length > 0 && (
              <div className="d-flex flex-wrap justify-content-between align-items-center">
                <div className="mb-2 mb-md-0">
                  Showing {indexOfFirstItem + 1} to {Math.min(indexOfLastItem, filteredSales.length)} of{" "}
                  {filteredSales.length} records
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

        {/* Status Update Modal */}
        <Modal show={showStatusModal} onHide={() => setShowStatusModal(false)} centered>
          <Modal.Header closeButton className="bg-light">
            <Modal.Title>
              <div className="d-flex align-items-center">
                <FileBarChart size={20} className="me-2 text-primary" />
                Update Order Status
              </div>
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form.Group>
              <Form.Label>Select New Status</Form.Label>
              <Form.Select value={newStatus} onChange={(e) => setNewStatus(e.target.value)}>
                <option value="Completed">Completed</option>
                <option value="Returned">Returned</option>
                <option value="Cancelled">Cancelled</option>
              </Form.Select>
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowStatusModal(false)}>
              Cancel
            </Button>
            <Button
              variant="primary"
              onClick={handleStatusUpdate}
              disabled={statusUpdateLoading}
              className="d-flex align-items-center justify-content-center"
            >
              {statusUpdateLoading ? (
                <>
                  <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                  Updating...
                </>
              ) : (
                <>
                  <CheckCircle size={16} className="me-2" /> Update Status
                </>
              )}
            </Button>
          </Modal.Footer>
        </Modal>
      </div>
    </div>
  )
}

export default SalesRecords
