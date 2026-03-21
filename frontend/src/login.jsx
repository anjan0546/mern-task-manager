import { useState } from "react"

function Login() {

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")

  const handleLogin = async () => {

    const res = await fetch("http://localhost:5000/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ email, password })
    })

    const data = await res.json()

    if (data.token) {
      localStorage.setItem("token", data.token)
      window.location.href = "/"
    } else {
      alert("Login failed")
    }
  }

  return (
  <div className="auth-container">

    <div className="auth-card">

      <h1>Login</h1>

      <input
        placeholder="Email"
        value={email}
        onChange={(e)=>setEmail(e.target.value)}
      />

      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e)=>setPassword(e.target.value)}
      />

      <button className="auth-btn" onClick={handleLogin}>
        Login
      </button>

      <p className="auth-text">
        Don't have an account? <a href="/signup">Signup</a>
      </p>

    </div>

  </div>
)
}

export default Login