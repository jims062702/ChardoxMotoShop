"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Modal, Button, Form, Pagination, Card, Badge } from "react-bootstrap"
import "bootstrap/dist/css/bootstrap.min.css"
import AdminSidebar from "../components/AdminSidebar"
import "./AdminDashboard.css"
import { Search, Package, Filter, Plus, Tag, ArrowUp, ArrowDown, Edit, Trash, Heart } from "lucide-react"
import { FaSignOutAlt } from "react-icons/fa"
import { useNavigate } from "react-router-dom"

interface Part {
  id: number
  name: string
  price: number
  description: string
  stock: number
  image: string
  category: string
}

const PREDEFINED_CATEGORIES = [
  "Engine Parts",
  "Transmission",
  "Suspension",
  "Brakes",
  "Electrical",
  "Body Parts",
  "Accessories",
  "Cooling System",
]

const AdminDashboard: React.FC = () => {
  const [parts, setParts] = useState<Part[]>([])
  const [alert, setAlert] = useState<{ type: string; message: string } | null>(null)
  const [selectedPart, setSelectedPart] = useState<Part | null>(null)
  const [operation, setOperation] = useState<"increase" | "decrease" | null>(null)
  const [showAddNewItemModal, setShowAddNewItemModal] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [showStockModal, setShowStockModal] = useState(false)
  const [stockInput, setStockInput] = useState<number>(0)

  const [newItem, setNewItem] = useState({ name: "", price: "", description: "", stock: "", category: "" })
  const [newItemStockInput, setNewItemStockInput] = useState<number>(0)
  const [imageFile, setImageFile] = useState<File | null>(null)

  const [showEditModal, setShowEditModal] = useState(false)
  const [editItem, setEditItem] = useState({ id: 0, name: "", price: "", description: "", stock: "", category: "" })
  const [editImageFile, setEditImageFile] = useState<File | null>(null)

  const [searchQuery, setSearchQuery] = useState<string>("")

  const [categories, setCategories] = useState<string[]>([])
  const [showCategoryModal, setShowCategoryModal] = useState(false)
  const [newCategory, setNewCategory] = useState("")
  const [selectedCategory, setSelectedCategory] = useState<string>("all")

  const [dashboardStats, setDashboardStats] = useState({
    totalItems: 0,
    totalCategories: 0,
    lowStockItems: 0,
    totalValue: 0,
  })

  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage] = useState(5)

  const [sortField, setSortField] = useState<keyof Part | null>(null)
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc")

  const [originalStock, setOriginalStock] = useState<number>(0)

  const [showPriceHistoryModal, setShowPriceHistoryModal] = useState(false)
  const [priceHistory, setPriceHistory] = useState<{ old_price: number; new_price: number; change_date: string }[]>([])
  const [newPrice, setNewPrice] = useState<string>("")
  const navigate = useNavigate()

  const handleLogout = () => {
    sessionStorage.removeItem("adminToken")
    navigate("/")
  }

  const fetchParts = async () => {
    try {
      const response = await fetch("http://localhost:5010/api/parts/get-parts")
      if (!response.ok) throw new Error("Failed to fetch parts.")
      const data = await response.json()
      setParts(data)

      const totalItems = data.length
      const uniqueCategories = new Set(data.map((part) => part.category).filter(Boolean)).size
      const lowStockItems = data.filter((part) => part.stock < 10).length
      const totalValue = data.reduce((sum, part) => sum + part.price * part.stock, 0)

      setDashboardStats({
        totalItems,
        totalCategories: uniqueCategories,
        lowStockItems,
        totalValue,
      })
    } catch (error) {
      console.error("❌ Error fetching parts:", error)
    }
  }

  const fetchPriceHistory = async (partId: number) => {
    try {
      const response = await fetch(`http://localhost:5010/api/parts/priceHistory/${partId}`)
      if (!response.ok) throw new Error("Failed to fetch price history.")
      const data = await response.json()
      setPriceHistory(data)
    } catch (error) {
      console.error("❌ Error fetching price history:", error)
      setAlert({ type: "danger", message: "Failed to fetch price history." })
    }
  }

  const fetchCategories = async () => {
    try {
      const response = await fetch("http://localhost:5010/api/parts/get-categories")
      if (!response.ok) throw new Error("Failed to fetch categories.")
      const data = await response.json()

      const dbCategories = data.map((cat) => cat.category)

      const allCategories = [...new Set([...PREDEFINED_CATEGORIES, ...dbCategories])]

      allCategories.sort()

      setCategories(allCategories)
    } catch (error) {
      console.error("❌ Error fetching categories:", error)

      setCategories(PREDEFINED_CATEGORIES)
    }
  }

  useEffect(() => {
    fetchParts()
    fetchCategories()
  }, [])

  const handleAddCategory = async () => {
    if (!newCategory.trim()) {
      setAlert({ type: "danger", message: "Category name cannot be empty!" })
      return
    }

    try {
      const response = await fetch("http://localhost:5010/api/parts/add-category", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ category: newCategory }),
      })

      if (!response.ok) throw new Error("Failed to add category")

      setAlert({ type: "success", message: "Category added successfully!" })
      setNewCategory("")
      fetchCategories()
    } catch (error) {
      console.error("❌ Error adding category:", error)
      setAlert({ type: "danger", message: "Failed to add category." })
    }
  }

  useEffect(() => {
    if (alert) {
      const timer = setTimeout(() => {
        setAlert(null)
      }, 3000)
      return () => clearTimeout(timer)
    }
  }, [alert])

  useEffect(() => {
    setCurrentPage(1)
  }, [searchQuery])

  const handleAddNewItem = async () => {
    const { name, price, description, category } = newItem

    if (!name || !price || !description || !newItemStockInput || !imageFile) {
      setAlert({ type: "danger", message: "Please fill all fields and select an image!" })
      return
    }

    try {
      const formData = new FormData()
      formData.append("name", name)
      formData.append("price", price)
      formData.append("description", description)
      formData.append("stock", newItemStockInput.toString())
      formData.append("category", category || "")
      formData.append("image", imageFile)

      console.log("📡 Sending request to add item:", formData)

      const response = await fetch("http://localhost:5010/api/parts/add", {
        method: "POST",
        body: formData,
      })

      const data = await response.json()
      console.log("✅ Response from server:", data)

      if (response.ok) {
        setAlert({ type: "success", message: "New item added successfully!" })
        fetchParts() // Refresh parts list
        setShowAddNewItemModal(false)
        setNewItem({ name: "", price: "", description: "", stock: "", category: "" })
        setNewItemStockInput(0)
        setImageFile(null)
      } else {
        setAlert({ type: "danger", message: data.error || "Failed to add item." })
      }
    } catch (error) {
      console.error("❌ Error adding new item:", error)
      setAlert({ type: "danger", message: "Failed to add new item." })
    }
  }

  const openEditModalHandler = (part: Part) => {
    setEditItem({
      id: part.id,
      name: part.name,
      price: part.price.toString(),
      description: part.description,
      stock: part.stock.toString(),
      category: part.category || "",
    })
    setOriginalStock(part.stock)
    setShowEditModal(true)
  }

  const openPriceHistoryModal = async (part: Part) => {
    setSelectedPart(part)
    setNewPrice(part.price.toString())
    await fetchPriceHistory(part.id)
    setShowPriceHistoryModal(true)
  }

  const handleEditItem = async () => {
    const { id, name, price, description, stock, category } = editItem
    if (!name || !price || !description || !stock) {
      setAlert({ type: "danger", message: "Please fill all required fields!" })
      return
    }

    try {
      const formData = new FormData()
      formData.append("name", name)
      formData.append("price", price)
      formData.append("description", description)
      formData.append("stock", stock)
      formData.append("category", category || "")

      if (editImageFile) {
        formData.append("image", editImageFile)
      }

      const response = await fetch(`http://localhost:5010/api/parts/update/${id}`, {
        method: "PUT",
        body: formData,
      })

      if (!response.ok) throw new Error("Failed to update item.")

      const newStock = Number.parseInt(stock)
      if (newStock !== originalStock) {
        const stockDifference = Math.abs(newStock - originalStock)
        const operation = newStock > originalStock ? "increase" : "decrease"

        const stockResponse = await fetch(`http://localhost:5010/api/parts/update-stock/${id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            amount: stockDifference,
            operation: operation,
          }),
        })

        if (!stockResponse.ok) {
          throw new Error("Failed to update stock.")
        }
      }

      fetchParts()
      setAlert({ type: "success", message: "Item updated successfully!" })
      setShowEditModal(false)
      setEditImageFile(null)
    } catch (error) {
      console.error("❌ Error updating item:", error)
      setAlert({ type: "danger", message: "Failed to update item." })
    }
  }

  const handleUpdatePrice = async () => {
    if (!selectedPart || !newPrice || isNaN(Number(newPrice)) || Number(newPrice) <= 0) {
      setAlert({ type: "danger", message: "Please enter a valid price!" })
      return
    }

    try {
      const response = await fetch(`http://localhost:5010/api/parts/updatePrice/${selectedPart.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ newPrice: Number(newPrice) }),
      })

      if (!response.ok) throw new Error("Failed to update price")

      fetchParts()
      fetchPriceHistory(selectedPart.id)
      setAlert({ type: "success", message: "Price updated successfully!" })
      setNewPrice("")
    } catch (error) {
      console.error("❌ Error updating price:", error)
      setAlert({ type: "danger", message: "Failed to update price." })
    }
  }

  const handleStockOperation = async () => {
    if (!selectedPart || stockInput <= 0) {
      setAlert({ type: "danger", message: "Please enter a valid quantity!" })
      return
    }

    try {
      const operationUrl = `http://localhost:5010/api/parts/update-stock/${selectedPart.id}`
      const response = await fetch(operationUrl, {
        method: "PUT",
        body: JSON.stringify({
          amount: stockInput,
          operation: operation,
        }),
        headers: {
          "Content-Type": "application/json",
        },
      })

      if (!response.ok) throw new Error("Operation failed")

      const data = await response.json()
      setAlert({ type: "success", message: data.message })
      setShowStockModal(false)
      setStockInput(0)
      fetchParts()
    } catch (error) {
      setAlert({ type: "danger", message: "Operation failed" })
      console.error("❌ Error performing operation:", error)
    }
  }

  const openStockModal = (part: Part, operationType: "increase" | "decrease") => {
    setSelectedPart(part)
    setOperation(operationType)
    setStockInput(1)
    setShowStockModal(true)
  }

  const openAddNewItemModalHandler = () => {
    setShowDeleteModal(false)
    setShowAddNewItemModal(true)
  }

  const openDeleteModalHandler = (part: Part) => {
    setSelectedPart(part)
    setShowDeleteModal(true)
  }

  const handleDeleteItem = async () => {
    if (!selectedPart) return

    try {
      const response = await fetch(`http://localhost:5010/api/parts/delete/${selectedPart.id}`, {
        method: "DELETE",
      })

      const data = await response.json()

      if (!response.ok) {
        // Parse the error message from the server
        const errorMessage = data.message || data.error || "Unknown error occurred"
        throw new Error(errorMessage)
      }

      fetchParts()
      setAlert({ type: "success", message: "Item deleted successfully!" })
      setShowDeleteModal(false)
    } catch (error) {
      console.error("❌ Error deleting item:", error)
      setAlert({
        type: "danger",
        message: `Failed to delete item: ${error instanceof Error ? error.message : "Unknown error"}`,
      })
    }
  }

  const handleSort = (field: keyof Part) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc")
    } else {
      setSortField(field)
      setSortDirection("asc")
    }
  }

  const filteredParts = parts
    .filter((part) => {
      const searchFields = [part.name, part.description, part.price.toString(), part.stock.toString(), part.category]

      const matchesSearch =
        searchQuery === "" ||
        searchFields.some((field) => field && field.toLowerCase().includes(searchQuery.toLowerCase()))

      const matchesCategory = selectedCategory === "all" || part.category === selectedCategory

      return matchesSearch && matchesCategory
    })
    .sort((a, b) => {
      if (!sortField) return 0

      if (typeof a[sortField] === "string" && typeof b[sortField] === "string") {
        return sortDirection === "asc"
          ? (a[sortField] as string).localeCompare(b[sortField] as string)
          : (b[sortField] as string).localeCompare(a[sortField] as string)
      } else {
        const aValue = a[sortField]
        const bValue = b[sortField]

        if (aValue < bValue) return sortDirection === "asc" ? -1 : 1
        if (aValue > bValue) return sortDirection === "asc" ? 1 : -1
        return 0
      }
    })

  const renderSortIndicator = (field: keyof Part) => {
    if (sortField !== field) return null
    return sortDirection === "asc" ? " ↑" : " ↓"
  }

  const indexOfLastItem = currentPage * itemsPerPage
  const indexOfFirstItem = indexOfLastItem - itemsPerPage
  const currentItems = filteredParts.slice(indexOfFirstItem, indexOfLastItem)
  const totalPages = Math.ceil(filteredParts.length / itemsPerPage)

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber)
  const nextPage = () => setCurrentPage((prev) => Math.min(prev + 1, totalPages))
  const prevPage = () => setCurrentPage((prev) => Math.max(prev - 1, 1))

  const highlightText = (text: string) => {
    if (!searchQuery || !text) return text

    try {
      const regex = new RegExp(`(${searchQuery.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")})`, "gi")

      const parts = text.toString().split(regex)

      return parts.map((part, index) => {
        if (part.toLowerCase() === searchQuery.toLowerCase()) {
          return (
            <span key={index} style={{ backgroundColor: "yellow", fontWeight: "bold" }}>
              {part}
            </span>
          )
        }
        return part
      })
    } catch (error) {
      console.error("Error highlighting text:", error)
      return text
    }
  }

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

  const getStockStatusBadge = (stock: number) => {
    if (stock <= 0) {
      return <Badge bg="danger">Out of Stock</Badge>
    } else if (stock < 10) {
      return <Badge bg="warning">Low Stock</Badge>
    } else {
      return <Badge bg="success">In Stock</Badge>
    }
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
          <h2 className="mb-4">Inventory Management Dashboard</h2>
          <Button variant="outline-light" onClick={handleLogout} className="d-flex align-items-center">
            <FaSignOutAlt className="me-2" /> Logout
          </Button>
        </div>
        <br />
        <br />

        {alert && (
          <div className={`alert alert-${alert.type}`} style={{ marginTop: "20px" }}>
            {alert.message}
          </div>
        )}

        <div className="row mb-4">
          <div className="col-md-3">
            <Card className="text-center shadow-sm" style={{ minHeight: "140px" }}>
              <Card.Body>
                <Package size={24} className="mb-2 text-primary" />
                <Card.Title style={{ fontSize: "24px", marginBottom: "10px" }}>{dashboardStats.totalItems}</Card.Title>
                <Card.Text className="text-muted">Total Items</Card.Text>
              </Card.Body>
            </Card>
          </div>
          <div className="col-md-3">
            <Card className="text-center shadow-sm" style={{ minHeight: "140px" }}>
              <Card.Body>
                <Tag size={24} className="mb-2 text-success" />
                <Card.Title style={{ fontSize: "24px", marginBottom: "10px" }}>
                  {dashboardStats.totalCategories}
                </Card.Title>
                <Card.Text className="text-muted">Categories</Card.Text>
              </Card.Body>
            </Card>
          </div>
          <div className="col-md-3">
            <Card className="text-center shadow-sm" style={{ minHeight: "140px" }}>
              <Card.Body>
                <ArrowDown size={24} className="mb-2 text-danger" />
                <Card.Title style={{ fontSize: "24px", marginBottom: "10px" }}>
                  {dashboardStats.lowStockItems}
                </Card.Title>
                <Card.Text className="text-muted">Low Stock Items</Card.Text>
              </Card.Body>
            </Card>
          </div>
          <div className="col-md-3">
            <Card className="text-center shadow-sm" style={{ minHeight: "140px" }}>
              <Card.Body>
                <Heart size={24} className="mb-2 text-danger" />
                <Card.Title style={{ fontSize: "24px", marginBottom: "10px" }}>
                  ₱{dashboardStats.totalValue.toLocaleString()}
                </Card.Title>
                <Card.Text className="text-muted">Total Inventory Value</Card.Text>
              </Card.Body>
            </Card>
          </div>
        </div>

        <div className="dashboard-container">
          <Card className="shadow-sm mb-4">
            <Card.Body>
              <h5 className="mb-3">Inventory Management</h5>

              <div className="d-flex justify-content-between mb-3 flex-wrap">
                <div className="input-group" style={{ maxWidth: "300px", marginRight: "10px" }}>
                  <span className="input-group-text bg-white">
                    <Search size={18} />
                  </span>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Search inventory..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                <div className="input-group" style={{ maxWidth: "250px", marginRight: "10px" }}>
                  <span className="input-group-text bg-white">
                    <Filter size={18} />
                  </span>
                  <select
                    className="form-control"
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                  >
                    <option value="all">All Categories</option>
                    {categories.map((category, index) => (
                      <option key={index} value={category}>
                        {category}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="d-flex">
                  <Button
                    variant="outline-secondary"
                    onClick={() => setShowCategoryModal(true)}
                    style={{ marginRight: "10px" }}
                    className="d-flex align-items-center"
                  >
                    <Tag size={16} className="me-2" />
                    Manage Categories
                  </Button>
                  <Button variant="primary" onClick={openAddNewItemModalHandler} className="d-flex align-items-center">
                    <Plus size={16} className="me-2" />
                    Add New Item
                  </Button>
                </div>
              </div>
            </Card.Body>
          </Card>

          <Card className="shadow-sm">
            <Card.Body>
              <div className="table-responsive">
                <table className="table table-hover align-middle">
                  <thead className="table-dark">
                    <tr>
                      <th style={{ width: "100px" }}>Image</th>
                      <th
                        style={{ width: "20%", cursor: "pointer" }}
                        onClick={() => handleSort("name")}
                        className="user-select-none"
                      >
                        Name {renderSortIndicator("name")}
                      </th>
                      <th
                        style={{ width: "10%", cursor: "pointer" }}
                        onClick={() => handleSort("price")}
                        className="user-select-none"
                      >
                        Price {renderSortIndicator("price")}
                      </th>
                      <th style={{ width: "25%" }}>Description</th>
                      <th
                        style={{ width: "10%", cursor: "pointer" }}
                        onClick={() => handleSort("stock")}
                        className="user-select-none"
                      >
                        Stock {renderSortIndicator("stock")}
                      </th>
                      <th
                        style={{ width: "10%", cursor: "pointer" }}
                        onClick={() => handleSort("category")}
                        className="user-select-none"
                      >
                        Category {renderSortIndicator("category")}
                      </th>
                      <th style={{ width: "25%" }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {currentItems.length > 0 ? (
                      currentItems.map((part) => (
                        <tr key={part.id} style={{ height: "110px" }}>
                          <td>
                            <img
                              src={`http://localhost:5010/uploads/${part.image}`}
                              alt={part.name}
                              style={{ width: "70px", height: "70px", objectFit: "cover", borderRadius: "4px" }}
                              className="img-thumbnail"
                            />
                          </td>
                          <td className="fw-medium">
                            <div className="text-wrap" style={{ maxWidth: "250px", wordBreak: "break-word" }}>
                              {highlightText(part.name)}
                            </div>
                          </td>
                          <td className="fw-bold">₱{part.price.toLocaleString()}</td>
                          <td>
                            <div
                              style={{
                                maxWidth: "100%",
                                wordBreak: "break-word",
                              }}
                            >
                              {highlightText(part.description)}
                            </div>
                          </td>
                          <td>
                            <div className="d-flex flex-column">
                              <span className="mb-1">{part.stock}</span>
                              {getStockStatusBadge(part.stock)}
                            </div>
                          </td>
                          <td>
                            {part.category ? (
                              <Badge bg="black" pill className="px-2 py-1">
                                <div className="text-wrap" style={{ maxWidth: "100px", wordBreak: "break-word" }}>
                                  {highlightText(part.category)}
                                </div>
                              </Badge>
                            ) : (
                              <span className="text-muted">-</span>
                            )}
                          </td>

                          <td>
                            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "5px" }}>
                              <Button
                                variant="outline-primary"
                                size="sm"
                                onClick={() => openEditModalHandler(part)}
                                title="Edit Item & Stock"
                                className="d-flex align-items-center justify-content-center"
                              >
                                <Edit size={16} className="me-1" /> Edit
                              </Button>
                              <Button
                                variant="outline-danger"
                                size="sm"
                                onClick={() => openDeleteModalHandler(part)}
                                title="Delete"
                                className="d-flex align-items-center justify-content-center"
                              >
                                <Trash size={16} className="me-1" /> Delete
                              </Button>
                              <Button
                                variant="outline-info"
                                size="sm"
                                onClick={() => openPriceHistoryModal(part)}
                                title="Price History"
                                className="d-flex align-items-center justify-content-center"
                              >
                                <Tag size={16} className="me-1" /> Price
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={7} className="text-center py-4">
                          <div className="d-flex flex-column align-items-center">
                            <Package size={48} className="text-muted mb-3" />
                            <h5>No items found</h5>
                            <p className="text-muted">Try adjusting your search or filter criteria</p>
                          </div>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </Card.Body>
            <Card.Footer className="bg-white">
              {filteredParts.length > 0 && (
                <div className="d-flex justify-content-between align-items-center">
                  <div>
                    Showing {indexOfFirstItem + 1} to {Math.min(indexOfLastItem, filteredParts.length)} of{" "}
                    {filteredParts.length} items
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

        <Modal show={showAddNewItemModal} onHide={() => setShowAddNewItemModal(false)} centered size="lg">
          <Modal.Header closeButton className="bg-light">
            <Modal.Title>
              <div className="d-flex align-items-center">
                <Plus size={20} className="me-2" />
                Add New Item
              </div>
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form>
              <div className="row">
                <div className="col-md-6">
                  <Form.Group className="mb-3">
                    <Form.Label>Item Name</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="Enter name"
                      value={newItem.name}
                      onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
                    />
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label>Price</Form.Label>
                    <Form.Control
                      type="number"
                      placeholder="Enter price"
                      value={newItem.price}
                      onChange={(e) => setNewItem({ ...newItem, price: e.target.value })}
                    />
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label>Category</Form.Label>
                    <Form.Select
                      value={newItem.category}
                      onChange={(e) => setNewItem({ ...newItem, category: e.target.value })}
                    >
                      <option value="">Select a category</option>
                      {categories.map((category, index) => (
                        <option key={index} value={category}>
                          {category}
                        </option>
                      ))}
                    </Form.Select>
                  </Form.Group>
                </div>
                <div className="col-md-6">
                  <Form.Group className="mb-3">
                    <Form.Label>Description</Form.Label>
                    <Form.Control
                      as="textarea"
                      rows={3}
                      placeholder="Enter description"
                      value={newItem.description}
                      onChange={(e) => setNewItem({ ...newItem, description: e.target.value })}
                    />
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label>Stock</Form.Label>
                    <Form.Control
                      type="number"
                      placeholder="Enter quantity"
                      value={newItemStockInput}
                      onChange={(e) => setNewItemStockInput(Number(e.target.value))}
                    />
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label>Image</Form.Label>
                    <Form.Control type="file" onChange={(e) => setImageFile(e.target.files?.[0] ?? null)} />
                  </Form.Group>
                </div>
              </div>
            </Form>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowAddNewItemModal(false)}>
              Cancel
            </Button>
            <Button variant="primary" onClick={handleAddNewItem}>
              Add Item
            </Button>
          </Modal.Footer>
        </Modal>

        <Modal show={showEditModal} onHide={() => setShowEditModal(false)} centered size="lg">
          <Modal.Header closeButton className="bg-light">
            <Modal.Title>
              <div className="d-flex align-items-center">
                <Edit size={20} className="me-2" />
                Edit Item
              </div>
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form>
              <div className="row">
                <div className="col-md-6">
                  <Form.Group className="mb-3">
                    <Form.Label>Item Name</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="Enter name"
                      value={editItem.name}
                      onChange={(e) => setEditItem({ ...editItem, name: e.target.value })}
                    />
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label>Category</Form.Label>
                    <Form.Select
                      value={editItem.category}
                      onChange={(e) => setEditItem({ ...editItem, category: e.target.value })}
                    >
                      <option value="">Select a category</option>
                      {categories.map((category, index) => (
                        <option key={index} value={category}>
                          {category}
                        </option>
                      ))}
                    </Form.Select>
                  </Form.Group>
                </div>
                <div className="col-md-6">
                  <Form.Group className="mb-3">
                    <Form.Label>Description</Form.Label>
                    <Form.Control
                      as="textarea"
                      rows={3}
                      placeholder="Enter description"
                      value={editItem.description}
                      onChange={(e) => setEditItem({ ...editItem, description: e.target.value })}
                    />
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label>Image (Optional)</Form.Label>
                    <Form.Control type="file" onChange={(e) => setEditImageFile(e.target.files?.[0] ?? null)} />
                    <Form.Text className="text-muted">Leave empty to keep the current image.</Form.Text>
                  </Form.Group>
                </div>
              </div>

              <div className="mt-3">
                <Card className="bg-light">
                  <Card.Body>
                    <h5 className="mb-3">Stock Management</h5>
                    <div className="row">
                      <div className="col-md-6">
                        <Form.Group className="mb-3">
                          <Form.Label>Current Stock</Form.Label>
                          <Form.Control
                            type="number"
                            placeholder="Enter quantity"
                            value={editItem.stock}
                            onChange={(e) => setEditItem({ ...editItem, stock: e.target.value })}
                          />
                        </Form.Group>
                      </div>
                      <div className="col-md-6">
                        <Form.Group className="mb-3">
                          <Form.Label>Quick Adjust</Form.Label>
                          <div className="d-flex gap-2">
                            <Button
                              variant="outline-success"
                              onClick={() =>
                                setEditItem({
                                  ...editItem,
                                  stock: (Number.parseInt(editItem.stock) + 1).toString(),
                                })
                              }
                            >
                              <ArrowUp size={16} /> +1
                            </Button>
                            <Button
                              variant="outline-success"
                              onClick={() =>
                                setEditItem({
                                  ...editItem,
                                  stock: (Number.parseInt(editItem.stock) + 5).toString(),
                                })
                              }
                            >
                              <ArrowUp size={16} /> +5
                            </Button>
                            <Button
                              variant="outline-warning"
                              onClick={() =>
                                setEditItem({
                                  ...editItem,
                                  stock: Math.max(0, Number.parseInt(editItem.stock) - 1).toString(),
                                })
                              }
                            >
                              <ArrowDown size={16} /> -1
                            </Button>
                            <Button
                              variant="outline-warning"
                              onClick={() =>
                                setEditItem({
                                  ...editItem,
                                  stock: Math.max(0, Number.parseInt(editItem.stock) - 5).toString(),
                                })
                              }
                            >
                              <ArrowDown size={16} /> -5
                            </Button>
                          </div>
                        </Form.Group>
                      </div>
                    </div>
                  </Card.Body>
                </Card>
              </div>
            </Form>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowEditModal(false)}>
              Cancel
            </Button>
            <Button variant="primary" onClick={handleEditItem}>
              Save Changes
            </Button>
          </Modal.Footer>
        </Modal>

        {/* Stock Modal */}
        <Modal show={showStockModal} onHide={() => setShowStockModal(false)} centered>
          <Modal.Header closeButton className="bg-light">
            <Modal.Title>
              <div className="d-flex align-items-center">
                {operation === "increase" ? (
                  <ArrowUp size={20} className="me-2 text-success" />
                ) : (
                  <ArrowDown size={20} className="me-2 text-warning" />
                )}
                {operation === "increase" ? "Add Stock" : "Decrease Stock"}
              </div>
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form>
              <Form.Group>
                <Form.Label>Quantity</Form.Label>
                <Form.Control
                  type="number"
                  value={stockInput}
                  onChange={(e) => setStockInput(Number(e.target.value))}
                  placeholder="Enter quantity"
                />
              </Form.Group>
              {selectedPart && (
                <div className="mt-3 p-3 bg-light rounded">
                  <div className="d-flex align-items-center mb-2">
                    <strong className="me-2">Current Stock:</strong> {selectedPart.stock}
                  </div>
                  <div className="d-flex align-items-center">
                    <strong className="me-2">After Operation:</strong>
                    {operation === "increase"
                      ? selectedPart.stock + stockInput
                      : Math.max(0, selectedPart.stock - stockInput)}
                  </div>
                </div>
              )}
            </Form>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowStockModal(false)}>
              Cancel
            </Button>
            <Button variant={operation === "increase" ? "success" : "warning"} onClick={handleStockOperation}>
              {operation === "increase" ? "Add Stock" : "Decrease Stock"}
            </Button>
          </Modal.Footer>
        </Modal>

        <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)} centered>
          <Modal.Header closeButton className="bg-light">
            <Modal.Title>
              <div className="d-flex align-items-center">
                <Trash size={20} className="me-2 text-danger" />
                Delete Item
              </div>
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {selectedPart && (
              <div className="text-center mb-3">
                <img
                  src={`http://localhost:5010/uploads/${selectedPart.image}`}
                  alt={selectedPart.name}
                  style={{ width: "100px", height: "100px", objectFit: "cover" }}
                  className="img-thumbnail mb-3"
                />
                <h5>{selectedPart.name}</h5>
              </div>
            )}
            <div className="alert alert-danger">
              <p className="mb-0">Are you sure you want to delete this item? This action cannot be undone.</p>
            </div>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
              Cancel
            </Button>
            <Button variant="danger" onClick={handleDeleteItem}>
              Delete
            </Button>
          </Modal.Footer>
        </Modal>

        <Modal show={showCategoryModal} onHide={() => setShowCategoryModal(false)} centered>
          <Modal.Header closeButton className="bg-light">
            <Modal.Title>
              <div className="d-flex align-items-center">
                <Tag size={20} className="me-2" />
                Manage Categories
              </div>
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <div className="mb-4">
              <h5 className="mb-3">Add New Category</h5>
              <div className="d-flex">
                <Form.Control
                  type="text"
                  placeholder="Enter category name"
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value)}
                  className="me-2"
                />
                <Button variant="primary" onClick={handleAddCategory}>
                  Add
                </Button>
              </div>
            </div>

            <h5 className="mb-3">Existing Categories</h5>
            {categories.length > 0 ? (
              <div className="list-group">
                {categories.map((category, index) => (
                  <li
                    key={index}
                    className="list-group-item list-group-item-action d-flex justify-content-between align-items-center"
                  >
                    <div className="d-flex align-items-center">
                      <Tag size={16} className="me-2 text-primary" />
                      {category}
                    </div>
                    <div>
                      <Button
                        variant="outline-danger"
                        size="sm"
                        onClick={() => {
                          const updatedCategories = categories.filter((cat) => cat !== category)
                          setCategories(updatedCategories)
                          setAlert({ type: "success", message: `Category "${category}" removed` })
                        }}
                      >
                        <Trash size={14} />
                      </Button>
                    </div>
                  </li>
                ))}
              </div>
            ) : (
              <div className="text-center py-4">
                <Tag size={32} className="text-muted mb-3" />
                <p className="text-muted">No categories found.</p>
              </div>
            )}
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowCategoryModal(false)}>
              Close
            </Button>
          </Modal.Footer>
        </Modal>
        {/* Price History Modal */}
        <Modal show={showPriceHistoryModal} onHide={() => setShowPriceHistoryModal(false)} centered size="lg">
          <Modal.Header closeButton className="bg-light">
            <Modal.Title>
              <div className="d-flex align-items-center">
                <Tag size={20} className="me-2 text-info" />
                Price History - {selectedPart?.name}
              </div>
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <div className="mb-4">
              <h5 className="mb-3">Update Price</h5>
              <div className="d-flex">
                <Form.Control
                  type="number"
                  placeholder="Enter new price"
                  value={newPrice}
                  onChange={(e) => setNewPrice(e.target.value)}
                  className="me-2"
                />
                <Button variant="primary" onClick={handleUpdatePrice}>
                  Update
                </Button>
              </div>
            </div>

            <h5 className="mb-3">Price History</h5>
            {priceHistory.length > 0 ? (
              <div className="table-responsive">
                <table className="table table-striped">
                  <thead>
                    <tr>
                      <th>Date</th>
                      <th>Old Price</th>
                      <th>New Price</th>
                      <th>Change</th>
                    </tr>
                  </thead>
                  <tbody>
                    {priceHistory.map((record, index) => {
                      const priceDifference = record.new_price - record.old_price
                      const percentChange = ((priceDifference / record.old_price) * 100).toFixed(2)
                      const isIncrease = priceDifference > 0

                      return (
                        <tr key={index}>
                          <td>{new Date(record.change_date).toLocaleString()}</td>
                          <td>₱{record.old_price.toLocaleString()}</td>
                          <td>₱{record.new_price.toLocaleString()}</td>
                          <td>
                            <span className={isIncrease ? "text-success" : "text-danger"}>
                              {isIncrease ? "+" : ""}
                              {priceDifference.toLocaleString()} ({isIncrease ? "+" : ""}
                              {percentChange}%)
                            </span>
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-center py-4">
                <Tag size={32} className="text-muted mb-3" />
                <p className="text-muted">No price history available.</p>
              </div>
            )}
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowPriceHistoryModal(false)}>
              Close
            </Button>
          </Modal.Footer>
        </Modal>
      </div>
    </div>
  )
}

export default AdminDashboard
