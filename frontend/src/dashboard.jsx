import { useEffect, useState } from "react"
import "./App.css"

function Dashboard() {

  const [tasks, setTasks] = useState([])
  const [title, setTitle] = useState("")
  const [filter, setFilter] = useState("all")
  const [loading, setLoading] = useState(true)

  const API = `${import.meta.env.VITE_API_URL}/tasks`

  const fetchTasks = async () => {
    try {

      const res = await fetch(API, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`
        }
      })

      const data = await res.json()

      if (Array.isArray(data)) {
        setTasks(data)
      }

    } catch (error) {
      console.log(error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchTasks()
  }, [])

  const addTask = async () => {

    if (!title.trim()) return

    try {

      const res = await fetch(API, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`
        },
        body: JSON.stringify({ title })
      })

      if (!res.ok) {
        console.log("Error adding task")
        return
      }

      setTitle("")
      fetchTasks()

    } catch (error) {
      console.log(error)
    }
  }

  const deleteTask = async (id) => {

    await fetch(`${API}/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`
      }
    })

    fetchTasks()
  }

  const toggleTask = async (id) => {

    await fetch(`${API}/${id}`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`
      }
    })

    fetchTasks()
  }

  const logout = () => {
    localStorage.removeItem("token")
    window.location.href = "/login"
  }

  const filteredTasks = tasks.filter((task) => {

    if (filter === "completed") return task.completed
    if (filter === "pending") return !task.completed
    return true

  })

  return (

    <div className="container">

      <h1>Task Manager</h1>

      <button className="logout-btn" onClick={logout} style={{ marginBottom: "20px" }}>
        Logout
      </button>

      <div className="input-section">

        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && addTask()}
          placeholder="Enter task..."
        />

        <button className="add-btn" onClick={addTask}>
          Add
        </button>

      </div>

      <div className="filter-buttons">

        <button onClick={() => setFilter("all")}>All</button>
        <button onClick={() => setFilter("completed")}>Completed</button>
        <button onClick={() => setFilter("pending")}>Pending</button>

      </div>

      {loading && <p>Loading tasks...</p>}

      {!loading && filteredTasks.length === 0 && (
        <p>No tasks yet. Add your first task 🚀</p>
      )}

      {!loading && filteredTasks.map(task => (

        <div className="task" key={task._id}>

          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>

            <input
              type="checkbox"
              checked={task.completed}
              onChange={() => toggleTask(task._id)}
            />

            <span className={task.completed ? "completed" : ""}>
              {task.title}
            </span>

          </div>

          <button
            className="delete-btn"
            onClick={() => deleteTask(task._id)}
          >
            Delete
          </button>

        </div>

      ))}

    </div>
  )
}

export default Dashboard