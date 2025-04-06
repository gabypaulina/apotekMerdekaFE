import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Container } from "react-bootstrap";

const Login = () => {
  const [fullName, setFullName] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      console.log("Sending data to backend:", { fullName, password });
      const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/login`, { fullName, password });
      console.log("Response from backend:", response.data); // Log respons dari backend
      localStorage.setItem("token", response.data.token);
      localStorage.setItem("role", response.data.role);
      localStorage.setItem("fullName", response.data.fullName);
      navigate("/");
    } catch (err) {
      setError("Login gagal. Periksa fullName dan password Anda.");
      console.error("Login error:", err); // Log error object lengkap
      console.error("Error response data:", err.response ? err.response.data : "No response data"); // Log respons error dari backend
      console.error("Error status:", err.response ? err.response.status : "No status"); // Log status code
    }
  };

  return (
    <Container className="mt-4 Raleway text-center">
      <h2>LOGIN</h2>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <form onSubmit={handleLogin}>
        <div className="mt-4">
          <label>Username :</label>
          <input
            type="text"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            required
            className="ms-4"
          />
        </div>
        <div className="mt-4">
          <label>Password :</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="ms-4"
          />
        </div>
        <button type="submit" className="save mt-4">Login</button>
      </form>
    </Container>
  );
};

export default Login;