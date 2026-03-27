import { useState } from "react"

function Signup() {

  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")

  const handleSignup = async () => {

    try {

      const res = await fetch(`${import.meta.env.VITE_API_URL}/signup`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ name, email, password })
      })

      const data = await res.json()

      if (res.ok) {
        alert("Signup successful! Please login.")
        window.location.href = "/login"
      } else {
        alert(data.error || data.message || "Signup failed" || "Signup failed")
      }

    } catch (error) {
      console.log(error)
      alert("Server error")
    }
  }

  return (
    <div className="auth-container">

      <div className="auth-card">

        <h1>Signup</h1>

        <input
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <input
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

        <button className="auth-btn" onClick={handleSignup}>
          Signup
        </button>

        <p className="auth-text">
          Already have an account? <a href="/login">Login</a>
        </p>

      </div>

    </div>
  )
}

export default Signup