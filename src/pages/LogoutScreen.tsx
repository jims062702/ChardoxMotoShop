import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const LogoutScreen = () => {
  const [ip, setIp] = useState("Fetching...");
  const navigate = useNavigate();

  
  useEffect(() => {
    const fetchIP = async () => {
      try {
        const res = await fetch("https://api64.ipify.org?format=json");
        const data = await res.json();
        setIp(data.ip);
      } catch (error) {
        console.error("❌ Error fetching IP:", error);
        setIp("Unable to fetch IP");
      }
    };
    fetchIP();
  }, []);

  
  useEffect(() => {
    const timer = setTimeout(() => {
      navigate("/login"); 
    }, 5010);
    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div style={styles.container}>
      <h1 style={styles.heading}>You have successfully logged out!</h1>
      <p style={styles.text}>Your IP Address: {ip}</p>

      <div style={styles.buttonContainer}>
        <button style={styles.button} onClick={() => navigate("/login")}>
          Client Login
        </button>
        <button style={styles.button} onClick={() => navigate("/admin/login")}>
          Admin Login
        </button>
      </div>

      <p style={styles.redirectMessage}>
        Redirecting to login in <b>5 seconds...</b>
      </p>
    </div>
  );
};


const styles = {
  container: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    height: "100vh",
    backgroundColor: "#f8f9fa",
    textAlign: "center",
  },
  heading: {
    fontSize: "24px",
    color: "#333",
  },
  text: {
    fontSize: "18px",
    marginBottom: "20px",
  },
  buttonContainer: {
    display: "flex",
    gap: "10px",
  },
  button: {
    padding: "10px 20px",
    fontSize: "16px",
    backgroundColor: "#007bff",
    color: "#fff",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
  },
  redirectMessage: {
    marginTop: "20px",
    fontSize: "14px",
    color: "#555",
  },
};

export default LogoutScreen;
