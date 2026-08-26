import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Background from "../components/Background";
import "../styles/register.css";
import api from "../services/api";

export default function Register() {

    const navigate = useNavigate();

    const [form, setForm] = useState({
        username: "",
        email: "",
        password: "",
        role: ""
    });

    const [confirmPassword, setConfirmPassword] = useState("");

    const handleChange = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value
        });
    };

    const handleRegister = async (e) => {

        e.preventDefault();

        if (form.password !== confirmPassword) {
            alert("Passwords do not match");
            return;
        }

        if (!form.role) {
            alert("Please select a role");
            return;
        }

        try {

            await api.post("/auth/register", form);

            alert("Registration Successful");

            navigate("/");

        } catch (err) {

            alert(
                err.response?.data?.detail ||
                "Registration Failed"
            );

        }

    };

    return (

        <Background>

            <div className="register-card">

                <div className="register-left">

                    <span className="register-badge">
                        CREATE ACCOUNT
                    </span>

                    <h1>
                        Join the
                        <br />
                        Smart Traffic
                        <br />
                        Network
                    </h1>

                    <p>
                        Register to access the intelligent traffic
                        management platform and experience
                        real-time monitoring and analytics.
                    </p>

                </div>

                <form
                    className="register-right"
                    onSubmit={handleRegister}
                >

                    <h2>Create Account</h2>

                    <input
                        type="text"
                        name="username"
                        placeholder="Username"
                        value={form.username}
                        onChange={handleChange}
                        required
                    />

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

                    <input
                        type="password"
                        placeholder="Confirm Password"
                        value={confirmPassword}
                        onChange={(e) =>
                            setConfirmPassword(e.target.value)
                        }
                        required
                    />

                    <select
                        name="role"
                        value={form.role}
                        onChange={handleChange}
                        required
                    >
                        <option value="">
                            Choose Role
                        </option>

                        <option value="admin">
                            Admin
                        </option>

                        <option value="operator">
                            Operator
                        </option>

                        <option value="commuter">
                            Commuter
                        </option>

                    </select>

                    <button type="submit">
                        Register
                    </button>

                    <p className="bottom-text">
                        Already have an account?
                        <Link to="/"> Login</Link>
                    </p>

                </form>

            </div>

        </Background>

    );

}