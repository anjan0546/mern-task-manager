import { useState } from "react";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/login`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email, password }),
        }
      );

      if (!res.ok) {
        const errorData = await res.json();
        alert(errorData.message || "Login failed ❌");
        return;
      }

      const data = await res.json();

      localStorage.setItem("token", data.token);

      alert("Login successful ✅");

      window.location.href = "/";
    } catch (error) {
      console.error("LOGIN ERROR:", error);
      alert("Server error ❌");
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h1>Login</h1>

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button className="auth-btn" onClick={handleLogin}>
          Login
        </button>

        <p className="auth-text">
          Don't have an account? <a href="/signup">Signup</a>
        </p>
      </div>
    </div>
  );
}

export default Login;