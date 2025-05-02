"use client"

import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { ArrowLeft, User, MapPin, Lock, Save } from "lucide-react"
import "../styles/Profile.css"

const Profile = () => {
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState("personal")
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [user, setUser] = useState(null)
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    postalCode: "",
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  })
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")

  useEffect(() => {
    fetchUserProfile()
  }, [])

  const fetchUserProfile = async () => {
    setIsLoading(true)
    try {
      // This would be replaced with your actual API call
      // Simulating API call with mock data
      setTimeout(() => {
        const mockUser = {
          id: 1,
          name: "John Doe",
          email: "john.doe@example.com",
          phone: "09123456789",
          address: "123 Main Street",
          city: "Manila",
          postalCode: "1000",
        }

        setUser(mockUser)
        setFormData({
          name: mockUser.name,
          email: mockUser.email,
          phone: mockUser.phone || "",
          address: mockUser.address || "",
          city: mockUser.city || "",
          postalCode: mockUser.postalCode || "",
          currentPassword: "",
          newPassword: "",
          confirmPassword: "",
        })

        setIsLoading(false)
      }, 1000)
    } catch (error) {
      console.error("❌ Error fetching user profile:", error)
      setError("Failed to load user profile. Please try again.")
      setIsLoading(false)
    }
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData({
      ...formData,
      [name]: value,
    })
  }

  const handlePersonalInfoSubmit = async (e) => {
    e.preventDefault()
    setError("")
    setSuccess("")
    setIsSaving(true)

    try {
      // This would be replaced with your actual API call
      // Simulating API call
      setTimeout(() => {
        console.log("Updating personal info:", {
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
        })

        setSuccess("Personal information updated successfully!")
        setIsSaving(false)
      }, 1000)
    } catch (error) {
      console.error("❌ Error updating personal info:", error)
      setError("Failed to update personal information. Please try again.")
      setIsSaving(false)
    }
  }

  const handleAddressSubmit = async (e) => {
    e.preventDefault()
    setError("")
    setSuccess("")
    setIsSaving(true)

    try {
      // This would be replaced with your actual API call
      // Simulating API call
      setTimeout(() => {
        console.log("Updating address:", {
          address: formData.address,
          city: formData.city,
          postalCode: formData.postalCode,
        })

        setSuccess("Address updated successfully!")
        setIsSaving(false)
      }, 1000)
    } catch (error) {
      console.error("❌ Error updating address:", error)
      setError("Failed to update address. Please try again.")
      setIsSaving(false)
    }
  }

  const handlePasswordSubmit = async (e) => {
    e.preventDefault()
    setError("")
    setSuccess("")

    if (!formData.currentPassword) {
      setError("Current password is required")
      return
    }

    if (formData.newPassword !== formData.confirmPassword) {
      setError("New passwords do not match")
      return
    }

    setIsSaving(true)

    try {
      // This would be replaced with your actual API call
      // Simulating API call
      setTimeout(() => {
        console.log("Updating password")

        setSuccess("Password updated successfully!")
        setFormData({
          ...formData,
          currentPassword: "",
          newPassword: "",
          confirmPassword: "",
        })

        setIsSaving(false)
      }, 1000)
    } catch (error) {
      console.error("❌ Error updating password:", error)
      setError("Failed to update password. Please try again.")
      setIsSaving(false)
    }
  }

  return (
    <div className="profile-container">
      <div className="container py-5">
        <div className="row">
          <div className="col-12">
            <div className="d-flex justify-content-between align-items-center mb-4">
              <h1 className="fw-bold">My Profile</h1>
              <button className="btn btn-outline-secondary" onClick={() => navigate("/client-dashboard")}>
                <ArrowLeft size={16} className="me-2" />
                Back to Dashboard
              </button>
            </div>
          </div>
        </div>

        {error && (
          <div className="alert alert-danger" role="alert">
            {error}
          </div>
        )}

        {success && (
          <div className="alert alert-success" role="alert">
            {success}
          </div>
        )}

        {isLoading ? (
          <div className="profile-skeleton">
            <div className="row">
              <div className="col-md-3">
                <div className="skeleton-card p-3 mb-4">
                  <div className="skeleton-avatar mb-3"></div>
                  <div className="skeleton-text mb-2"></div>
                  <div className="skeleton-text sm mb-4"></div>
                  <div className="skeleton-nav-item"></div>
                  <div className="skeleton-nav-item"></div>
                  <div className="skeleton-nav-item"></div>
                </div>
              </div>
              <div className="col-md-9">
                <div className="skeleton-card p-4">
                  <div className="skeleton-title mb-4"></div>
                  <div className="row">
                    <div className="col-md-6 mb-3">
                      <div className="skeleton-text sm mb-2"></div>
                      <div className="skeleton-input"></div>
                    </div>
                    <div className="col-md-6 mb-3">
                      <div className="skeleton-text sm mb-2"></div>
                      <div className="skeleton-input"></div>
                    </div>
                  </div>
                  <div className="skeleton-button mt-3"></div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="row">
            <div className="col-md-3">
              <div className="profile-sidebar mb-4">
                <div className="profile-user-info text-center mb-4">
                  <div className="profile-avatar">{user?.name?.charAt(0) || "U"}</div>
                  <h5 className="mt-3 mb-1">{user?.name}</h5>
                  <p className="text-muted mb-0">{user?.email}</p>
                </div>

                <div className="profile-nav">
                  <button
                    className={`profile-nav-item ${activeTab === "personal" ? "active" : ""}`}
                    onClick={() => setActiveTab("personal")}
                  >
                    <User size={18} />
                    <span>Personal Information</span>
                  </button>
                  <button
                    className={`profile-nav-item ${activeTab === "address" ? "active" : ""}`}
                    onClick={() => setActiveTab("address")}
                  >
                    <MapPin size={18} />
                    <span>Address</span>
                  </button>
                  <button
                    className={`profile-nav-item ${activeTab === "password" ? "active" : ""}`}
                    onClick={() => setActiveTab("password")}
                  >
                    <Lock size={18} />
                    <span>Change Password</span>
                  </button>
                </div>
              </div>
            </div>

            <div className="col-md-9">
              <div className="profile-content">
                {activeTab === "personal" && (
                  <div className="tab-content">
                    <h4 className="mb-4">Personal Information</h4>
                    <form onSubmit={handlePersonalInfoSubmit}>
                      <div className="row">
                        <div className="col-md-6 mb-3">
                          <label htmlFor="name" className="form-label">
                            Full Name
                          </label>
                          <input
                            type="text"
                            className="form-control"
                            id="name"
                            name="name"
                            value={formData.name}
                            onChange={handleInputChange}
                            required
                          />
                        </div>
                        <div className="col-md-6 mb-3">
                          <label htmlFor="email" className="form-label">
                            Email Address
                          </label>
                          <input
                            type="email"
                            className="form-control"
                            id="email"
                            name="email"
                            value={formData.email}
                            onChange={handleInputChange}
                            required
                          />
                        </div>
                        <div className="col-md-6 mb-3">
                          <label htmlFor="phone" className="form-label">
                            Phone Number
                          </label>
                          <input
                            type="tel"
                            className="form-control"
                            id="phone"
                            name="phone"
                            value={formData.phone}
                            onChange={handleInputChange}
                          />
                        </div>
                      </div>
                      <button type="submit" className="btn btn-primary mt-3" disabled={isSaving}>
                        {isSaving ? (
                          <>
                            <span
                              className="spinner-border spinner-border-sm me-2"
                              role="status"
                              aria-hidden="true"
                            ></span>
                            Saving...
                          </>
                        ) : (
                          <>
                            <Save size={16} className="me-2" />
                            Save Changes
                          </>
                        )}
                      </button>
                    </form>
                  </div>
                )}

                {activeTab === "address" && (
                  <div className="tab-content">
                    <h4 className="mb-4">Address Information</h4>
                    <form onSubmit={handleAddressSubmit}>
                      <div className="row">
                        <div className="col-12 mb-3">
                          <label htmlFor="address" className="form-label">
                            Street Address
                          </label>
                          <input
                            type="text"
                            className="form-control"
                            id="address"
                            name="address"
                            value={formData.address}
                            onChange={handleInputChange}
                          />
                        </div>
                        <div className="col-md-6 mb-3">
                          <label htmlFor="city" className="form-label">
                            City
                          </label>
                          <input
                            type="text"
                            className="form-control"
                            id="city"
                            name="city"
                            value={formData.city}
                            onChange={handleInputChange}
                          />
                        </div>
                        <div className="col-md-6 mb-3">
                          <label htmlFor="postalCode" className="form-label">
                            Postal Code
                          </label>
                          <input
                            type="text"
                            className="form-control"
                            id="postalCode"
                            name="postalCode"
                            value={formData.postalCode}
                            onChange={handleInputChange}
                          />
                        </div>
                      </div>
                      <button type="submit" className="btn btn-primary mt-3" disabled={isSaving}>
                        {isSaving ? (
                          <>
                            <span
                              className="spinner-border spinner-border-sm me-2"
                              role="status"
                              aria-hidden="true"
                            ></span>
                            Saving...
                          </>
                        ) : (
                          <>
                            <Save size={16} className="me-2" />
                            Save Changes
                          </>
                        )}
                      </button>
                    </form>
                  </div>
                )}

                {activeTab === "password" && (
                  <div className="tab-content">
                    <h4 className="mb-4">Change Password</h4>
                    <form onSubmit={handlePasswordSubmit}>
                      <div className="mb-3">
                        <label htmlFor="currentPassword" className="form-label">
                          Current Password
                        </label>
                        <input
                          type="password"
                          className="form-control"
                          id="currentPassword"
                          name="currentPassword"
                          value={formData.currentPassword}
                          onChange={handleInputChange}
                          required
                        />
                      </div>
                      <div className="mb-3">
                        <label htmlFor="newPassword" className="form-label">
                          New Password
                        </label>
                        <input
                          type="password"
                          className="form-control"
                          id="newPassword"
                          name="newPassword"
                          value={formData.newPassword}
                          onChange={handleInputChange}
                          required
                        />
                      </div>
                      <div className="mb-3">
                        <label htmlFor="confirmPassword" className="form-label">
                          Confirm New Password
                        </label>
                        <input
                          type="password"
                          className="form-control"
                          id="confirmPassword"
                          name="confirmPassword"
                          value={formData.confirmPassword}
                          onChange={handleInputChange}
                          required
                        />
                      </div>
                      <button type="submit" className="btn btn-primary mt-3" disabled={isSaving}>
                        {isSaving ? (
                          <>
                            <span
                              className="spinner-border spinner-border-sm me-2"
                              role="status"
                              aria-hidden="true"
                            ></span>
                            Updating...
                          </>
                        ) : (
                          <>
                            <Save size={16} className="me-2" />
                            Update Password
                          </>
                        )}
                      </button>
                    </form>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default Profile

