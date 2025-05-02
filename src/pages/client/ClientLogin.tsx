"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import { FaUser, FaLock, FaEye, FaEyeSlash, FaCheck, FaTimes } from "react-icons/fa"
import "../../styles/ClientLogin.css";

const ClientLogin = () => {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [errorMessage, setErrorMessage] = useState("")
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

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrorMessage("")
    setIsLoading(true)

    if (!isEmailValid) {
      setErrorMessage("Please enter a valid email address.")
      setIsLoading(false)
      return
    }

    if (!isPasswordValid()) {
      setErrorMessage("Password does not meet the requirements.")
      setIsLoading(false)
      return
    }

    try {
      const res = await fetch("http://localhost:5010/api/auth/client-login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
        credentials: "include",
      })

      const data = await res.json()
      if (res.ok) {
        console.log("✅ Login successful:", data)
        localStorage.setItem("user", JSON.stringify(data.user))
        window.location.href = "/client-dashboard"
      } else {
        console.error("❌ Login error:", data.error)
        setErrorMessage(data.error || "Invalid email or password.")
      }
    } catch (error) {
      console.error("❌ Network error:", error)
      setErrorMessage("Network error. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="client-login-container">
      <div className="login-box">
        <h2 className="login-title">CLIENT LOGIN</h2>
        {errorMessage && <p className="error-message">{errorMessage}</p>}
        <form onSubmit={handleLogin} className="login-form">
          <div className="input-container">
            <FaUser className="input-icon" />
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={`login-input ${email && !isEmailValid ? "input-error" : ""}`}
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
              className={`login-input ${password && !isPasswordValid() ? "input-error" : ""}`}
              required
            />
            <button type="button" className="password-toggle" onClick={togglePasswordVisibility} tabIndex={-1}>
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </button>
          </div>

          {showValidation && (
            <div className="password-requirements">
              <div className={`validation-message ${passwordValidation.length ? "success" : "error"}`}>
                {passwordValidation.length ? (
                  <FaCheck className="validation-icon" />
                ) : (
                  <FaTimes className="validation-icon" />
                )}
                At least 5 characters
              </div>
              <div className={`validation-message ${passwordValidation.capital ? "success" : "error"}`}>
                {passwordValidation.capital ? (
                  <FaCheck className="validation-icon" />
                ) : (
                  <FaTimes className="validation-icon" />
                )}
                At least one capital letter
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

          <button type="submit" className="login-button" disabled={isLoading}>
            {isLoading ? "LOGGING IN..." : "LOGIN"}
          </button>
        </form>

        <p className="register-text">
          Don't have an account?{" "}
          <Link to="/client-register" className="register-link1">
            Register
          </Link>
        </p>
      </div>
    </div>
  )
}

export default ClientLogin

