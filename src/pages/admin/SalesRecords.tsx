"use client"

import { useState, useEffect } from "react"
import { Card, Row, Col, Table, Form, Button, Badge, InputGroup, Pagination } from "react-bootstrap"
import {
  FaSearch,
  FaCalendar,
  FaDownload,
  FaFileAlt,
  FaSignOutAlt,
  FaShoppingCart,
  FaMoneyBillWave,
  FaUsers,
} from "react-icons/fa"
import { useNavigate } from "react-router-dom"
import AdminSidebar from "../components/AdminSidebar"
import "bootstrap/dist/css/bootstrap.min.css"
import "../admin/AdminDashboard.css"

interface Sale {
  id: number
  originalSaleId?: number
  customer: string
  totalAmount: number
  date: string
  itemName: string
  quantity: number
}

const SalesRecords = () => {
  const navigate = useNavigate()
  const [sales, setSales] = useState<Sale[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [startDate, setStartDate] = useState("")
  const [endDate, setEndDate] = useState("")
  const [apiError, setApiError] = useState<string | null>(null)

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage] = useState(10)

  useEffect(() => {
    fetchSales()
  }, [])

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

  return (
    <div className="d-flex">
      <div
        style={{
          width: "250px",
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
          <h2 className="mb-4">Sales Records Dashboard</h2>
          <Button variant="outline-light" onClick={handleLogout} className="d-flex align-items-center">
            <FaSignOutAlt className="me-2" /> Logout
          </Button>
        </div>
        <br />
        <br />

        <div className="d-flex flex-wrap gap-3">
          {/* Stats Card */}
          <div className="card mb-4" style={{ borderRadius: "8px", maxWidth: "250px" }}>
            <div className="card-body d-flex align-items-center p-3">
              <div
                className="rounded-circle me-3 d-flex align-items-center justify-content-center"
                style={{
                  width: "40px",
                  height: "40px",
                  backgroundColor: "#f0f8f0",
                }}
              >
                <FaShoppingCart size={18} className="text-success" />
              </div>
              <div>
                <div className="text-muted small">Items Sold</div>
                <h3 className="mb-0">{totalItems}</h3>
              </div>
            </div>
          </div>

          <div className="card mb-4" style={{ borderRadius: "8px", maxWidth: "250px" }}>
            <div className="card-body d-flex align-items-center p-3">
              <div
                style={{
                  width: "40px",
                  height: "40px",
                  backgroundColor: "#f0f5ff",
                  borderRadius: "50%",
                  position: "relative",
                  flexShrink: 0,
                }}
              >
                <FaMoneyBillWave
                  size={18}
                  className="text-primary"
                  style={{
                    position: "absolute",
                    top: "50%",
                    left: "50%",
                    transform: "translate(-50%, -50%)",
                  }}
                />
              </div>
              <div className="ms-3">
                <div className="text-muted small">Total Sales</div>
                <h3 className="mb-0">₱{totalSales.toLocaleString()}</h3>
              </div>
            </div>
          </div>

          {/* Unique Customers Card */}
          <div className="card mb-4" style={{ borderRadius: "8px", maxWidth: "250px" }}>
            <div className="card-body d-flex align-items-center p-3">
              <div
                className="rounded-circle me-3 d-flex align-items-center justify-content-center"
                style={{
                  width: "40px",
                  height: "40px",
                  backgroundColor: "#fff5f5",
                }}
              >
                <FaUsers size={18} className="text-danger" />
              </div>
              <div>
                <div className="text-muted small">Customers</div>
                <h3 className="mb-0">{uniqueCustomers}</h3>
              </div>
            </div>
          </div>
        </div>

        {apiError && (
          <div className="alert alert-danger" style={{ marginTop: "20px" }}>
            {apiError}
          </div>
        )}

        <Card className="shadow-sm mb-4">
          <Card.Body>
            <h5 className="mb-3">Sales Records</h5>
            <Row className="mb-3">
              <Col md={4}>
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
              <Col md={3}>
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
              <Col md={3}>
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
              <Col md={2} className="d-flex align-items-end">
                <Button variant="success" className="w-100">
                  <FaDownload className="me-2" /> Export
                </Button>
              </Col>
            </Row>
          </Card.Body>
        </Card>

        <Card className="shadow-sm">
          <Card.Body>
            <div className="table-responsive">
              <Table hover className="align-middle" style={{ borderCollapse: "separate", borderSpacing: "0 8px" }}>
                <thead className="table-dark">
                  <tr>
                    <th className="ps-3 rounded-start" style={{ borderBottom: "none" }}>
                      ID
                    </th>
                    <th style={{ borderBottom: "none" }}>Customer</th>
                    <th style={{ borderBottom: "none", width: "30%" }}>Product Name</th>
                    <th style={{ borderBottom: "none" }}>Quantity</th>
                    <th style={{ borderBottom: "none" }}>Total Amount</th>
                    <th className="pe-3 rounded-end" style={{ borderBottom: "none" }}>
                      Purchased Date
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
                          <Badge bg="info" pill className="px-3 py-2">
                            <div className="text-wrap" style={{ maxWidth: "100%", wordBreak: "break-word" }}>
                              {sale.itemName}
                            </div>
                          </Badge>
                          {/* remove the badge and add fw-bold in text-wrap */}
                        </td>
                        <td>{sale.quantity}</td>
                        <td className="fw-bold">₱{sale.totalAmount.toLocaleString()}</td>
                        <td className="pe-3 rounded-end">{sale.date}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={6} className="text-center py-5 text-muted">
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
              <div className="d-flex justify-content-between align-items-center">
                <div>
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
      </div>
    </div>
  )
}

export default SalesRecords
