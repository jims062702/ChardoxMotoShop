"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import { FaUser, FaLock, FaEye, FaEyeSlash, FaCheck, FaTimes } from "react-icons/fa"
import "../../styles/ClientRegister.css";

const ClientRegister = () => {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [message, setMessage] = useState("")
  const [messageType, setMessageType] = useState<"success" | "error" | "">("")
  const [showPassword, setShowPassword] = useState(false)
  const [isEmailValid, setIsEmailValid] = useState(true)
  const [passwordValidation, setPasswordValidation] = useState({
    length: false,
    capital: false,
    number: false,
  })
  const [showValidation, setShowValidation] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    if (email) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      setIsEmailValid(emailRegex.test(email))
    } else {
      setIsEmailValid(true)
    }
  }, [email])

  useEffect(() => {
    setPasswordValidation({
      length: password.length >= 5,
      capital: /[A-Z]/.test(password),
      number: /[0-9]/.test(password),
    })
  }, [password])

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword)
  }

  const handlePasswordFocus = () => {
    setShowValidation(true)
  }

  const handlePasswordBlur = () => {
    if (!password) {
      setShowValidation(false)
    }
  }

  const isPasswordValid = () => {
    return passwordValidation.length && passwordValidation.capital && passwordValidation.number
  }

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    setMessage("")
    setMessageType("")
    setIsLoading(true)

    if (!isEmailValid) {
      setMessage("Please enter a valid email address.")
      setMessageType("error")
      setIsLoading(false)
      return
    }

    if (!isPasswordValid()) {
      setMessage("Password does not meet the requirements.")
      setMessageType("error")
      setIsLoading(false)
      return
    }

    if (password !== confirmPassword) {
      setMessage("Passwords do not match.")
      setMessageType("error")
      setIsLoading(false)
      return
    }

    try {
      const response = await fetch("http://localhost:5010/api/client/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      })

      const data = await response.json()

      if (response.ok) {
        setMessage(data.message || "Registration successful!")
        setMessageType("success")

        setName("")
        setEmail("")
        setPassword("")
        setConfirmPassword("")
        setShowValidation(false)
      } else {
        setMessage(data.message || "Registration failed.")
        setMessageType("error")
      }
    } catch (error) {
      console.error("❌ Registration Error:", error)
      setMessage("An error occurred during registration.")
      setMessageType("error")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="client-register-container">
      <div className="register-box">
        <h2 className="register-title">CLIENT REGISTER</h2>
        <form onSubmit={handleRegister} className="register-form">
          <div className="input-container">
            <FaUser className="input-icon" />
            <input
              type="text"
              placeholder="Full Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="register-input"
              required
            />
          </div>

          <div className="input-container">
            <FaUser className="input-icon" />
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={`register-input ${email && !isEmailValid ? "input-error" : ""}`}
              required
            />
          </div>
          {email && !isEmailValid && (
            <div className="validation-message error">
              <FaTimes className="validation-icon" /> Please enter a valid email address
            </div>
          )}

          <div className="input-container">
            <FaLock className="input-icon" />
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onFocus={handlePasswordFocus}
              onBlur={handlePasswordBlur}
              className={`register-input ${password && !isPasswordValid() ? "input-error" : ""}`}
              required
            />
            <button type="button" className="password-toggle" onClick={togglePasswordVisibility} tabIndex={-1}>
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </button>
          </div>

          <div className="input-container">
            <FaLock className="input-icon" />
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Confirm Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className={`register-input ${confirmPassword && password !== confirmPassword ? "input-error" : ""}`}
              required
            />
            <button type="button" className="password-toggle" onClick={togglePasswordVisibility} tabIndex={-1}>
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </button>
          </div>
          {confirmPassword && password !== confirmPassword && (
            <div className="validation-message error">
              <FaTimes className="validation-icon" /> Passwords do not match
            </div>
          )}

          {showValidation && (
            <div className="password-requirements">
              <div className={`validation-message ${passwordValidation.capital ? "success" : "error"}`}>
                {passwordValidation.capital ? (
                  <FaCheck className="validation-icon" />
                ) : (
                  <FaTimes className="validation-icon" />
                )}
                At least one capital letter
              </div>
              <div className={`validation-message ${passwordValidation.length ? "success" : "error"}`}>
                {passwordValidation.length ? (
                  <FaCheck className="validation-icon" />
                ) : (
                  <FaTimes className="validation-icon" />
                )}
                At least 5 characters
              </div>

              <div className={`validation-message ${passwordValidation.number ? "success" : "error"}`}>
                {passwordValidation.number ? (
                  <FaCheck className="validation-icon" />
                ) : (
                  <FaTimes className="validation-icon" />
                )}
                At least one number
              </div>
            </div>
          )}

          <button type="submit" className="register-button" disabled={isLoading}>
            {isLoading ? "REGISTERING..." : "REGISTER"}
          </button>
        </form>

        <p className="register-link">
          Already have an account?{" "}
          <Link to="/client-login" className="login-link">
            Login
          </Link>
        </p>

        {message && <p className={`register-message ${messageType}`}>{message}</p>}
      </div>
    </div>
  )
}

export default ClientRegister

