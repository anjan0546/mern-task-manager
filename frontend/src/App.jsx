import { Routes, Route, Navigate } from "react-router-dom"
import Dashboard from "./dashboard"
import Login from "./login"
import Signup from "./signup"

function App() {

  const token = localStorage.getItem("token")

  return (

    <Routes>

      <Route
        path="/login"
        element={<Login />}
      />
      <Route path="/signup" element={<Signup />} />

      <Route
        path="/"
        element={
          token ? <Dashboard /> : <Navigate to="/login" />
        }
      />
      
  

</Routes>


  )
}

export default App