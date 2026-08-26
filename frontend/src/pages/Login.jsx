import Swal from "sweetalert2";
import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import Background from "../components/Background";
import "../styles/login.css";
import api from "../services/api";

export default function Login() {

    const navigate = useNavigate();

    // Clear any stale session on login page load
    useEffect(() => {
        localStorage.removeItem("token");
        localStorage.removeItem("role");
        localStorage.removeItem("username");
        localStorage.removeItem("email");
    }, []);

    const [form, setForm] = useState({
        email: "",
        password: ""
    });

    const handleChange = (e) => {

        setForm({
            ...form,
            [e.target.name]: e.target.value
        });

    };

    const handleLogin = async (e) => {

        e.preventDefault();

        try {

            const response = await api.post("/auth/login", form);

            const data = response.data;

            localStorage.setItem("token", data.access_token);
            localStorage.setItem("role", data.role);
            localStorage.setItem("username", data.username);
            localStorage.setItem("email", data.email);

            await Swal.fire({
                icon: "success",
                title: "Login Successful",
                text: `Welcome back, ${data.username}!`,
                background: "#101722",
                color: "#ffffff",
                confirmButtonColor: "#00D9FF",
                timer: 1800,
                showConfirmButton: false,
                timerProgressBar: true
            });

            switch (data.role) {

                case "admin":
                    navigate("/admin");
                    break;

                case "operator":
                    navigate("/operator");
                    break;

                case "commuter":
                    navigate("/commuter");
                    break;

                default:
                    navigate("/");
            }

        }

        catch (err) {

            console.error("Login error:", err);

            // Determine a helpful error message
            let errorMsg;
            if (err.response) {
                // Server replied with an error status
                errorMsg = err.response.data?.detail || "Invalid email or password.";
            } else if (err.request) {
                // Request was made but no response received (network/CORS issue)
                errorMsg = "Cannot reach the server. Make sure the backend is running on port 8000.";
            } else {
                errorMsg = err.message || "An unexpected error occurred.";
            }

            Swal.fire({
                icon: "error",
                title: "Login Failed",
                text: errorMsg,
                background: "#101722",
                color: "#ffffff",
                confirmButtonColor: "#EF4444"
            });

        }

    };

    return (

        <Background>

            <div className="login-card">

                <div className="left">

                    <span className="login-badge">SMART TRAFFIC SYSTEM</span>

                    <h1>
                        Intelligent
                        <br />
                        Traffic
                        <br />
                        Management
                    </h1>

                    <p>
                        Secure AI powered platform for
                        administrators, operators and commuters.
                    </p>

                </div>

                <form
                    className="right"
                    onSubmit={handleLogin}
                >

                    <h2>Welcome Back</h2>

                    <input
                        type="email"
                        name="email"
                        placeholder="Email Address"
                        value={form.email}
                        onChange={handleChange}
                        required
                    />

                    <input
                        type="password"
                        name="password"
                        placeholder="Password"
                        value={form.password}
                        onChange={handleChange}
                        required
                    />

                    <button type="submit">
                        Login
                    </button>

                    <p className="bottom-text">
                        Don't have an account?
                        <Link to="/register"> Register</Link>
                    </p>

                </form>

            </div>

        </Background>

    );

}