"use client"

import { Link } from "react-router-dom"
import"../pages/Home.css"
const Home = () => {
  return (
    <div
      style={{
        position: "relative",
        width: "100vw",
        height: "100vh",
        margin: 0,
        padding: 0,
        overflow: "hidden", 
      }}
    >
      
      <video
        autoPlay
        loop    
         muted
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          objectFit: "cover", 
          zIndex: 0,
        }}
      >
        <source src="/chardox.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </video>

      
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          background: "linear-gradient(to right, rgba(0,0,0,0.7), rgba(0,0,0,0.5), rgba(0,0,0,0.7))",
          zIndex: 1,
        }}
      ></div>

      
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          zIndex: 2,
          padding: 0,
        }}
      >
        <div
          style={{
            textAlign: "center",
            padding: "0 24px",
            color: "white",
            maxWidth: "800px",
          }}
        >
          <h1 className="title"
            style={{
              fontSize: "clamp(2rem, 5vw, 3.5rem)",
              fontWeight: "bold",
              marginBottom: "24px",
              letterSpacing: "-0.025em",
            }}
          >
            WELCOME TO THE CHARDOX MOTO PARTS & SERVICES
          </h1>

          <p
            style={{
              fontSize: "clamp(1rem, 2vw, 1.25rem)",
              marginBottom: "40px",
              color: "rgba(255, 255, 255, 0.9)",
              maxWidth: "600px",
              margin: "0 auto 40px",
            }}
          >
            Select an option to continue:
          </p>

          
          <div
            style={{
              display: "flex",
              gap: "24px",
              flexWrap: "wrap",
              justifyContent: "center",
            }}
          >
            <Link
              to="/client-store"
              style={{
                padding: "12px 24px",
                backgroundColor: "#ff5722",
                color: "white",
                fontSize: "1.125rem",
                fontWeight: "600",
                borderRadius: "8px",
                textDecoration: "none",
                transition: "background-color 0.2s",
                display: "inline-flex",
                alignItems: "center",
              }}
              onMouseOver={(e) => (e.currentTarget.style.backgroundColor = "#e64a19")}
              onMouseOut={(e) => (e.currentTarget.style.backgroundColor = "#ff5722")}
            >
              Browse Item
            </Link>

            <Link
              to="/admin/login"
              style={{
                padding: "12px 24px",
                backgroundColor: "rgba(0, 0, 0, 0.5)",
                border: "1px solid rgba(255, 255, 255, 0.3)",
                color: "white",
                fontSize: "1.125rem",
                fontWeight: "600",
                borderRadius: "8px",
                textDecoration: "none",
                transition: "background-color 0.2s",
                display: "inline-flex",
                alignItems: "center",
              }}
              onMouseOver={(e) => (e.currentTarget.style.backgroundColor = "rgba(0, 0, 0, 0.7)")}
              onMouseOut={(e) => (e.currentTarget.style.backgroundColor = "rgba(0, 0, 0, 0.5)")}
            >
              Admin Login
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Home

