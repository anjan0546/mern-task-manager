const express = require("express")
const mongoose = require("mongoose")
const cors = require("cors")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")

const Task = require("./models/Task")
const User = require("./models/User")
const authMiddleware = require("./middleware/auth")

const app = express()

app.use(cors())
app.use(express.json())

// MongoDB connection
mongoose.connect("mongodb://127.0.0.1:27017/taskmanager")
.then(()=>console.log("MongoDB Connected"))
.catch(err=>console.log(err))

app.get("/", (req,res)=>{
    res.send("Task Manager API Running")
})

app.listen(5000, ()=>{
    console.log("Server running on port 5000")
})

/* ------------------ AUTH ROUTES ------------------ */

app.post("/signup", async (req, res) => {
  try {

    const { name, email, password } = req.body

    const hashedPassword = await bcrypt.hash(password, 10)

    const user = new User({
      name,
      email,
      password: hashedPassword
    })

    await user.save()

    res.json({ message: "User created successfully" })

  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})


app.post("/login", async (req, res) => {
  try {

    const { email, password } = req.body

    const user = await User.findOne({ email })

    if (!user) {
      return res.status(400).json({ message: "User not found" })
    }

    const validPassword = await bcrypt.compare(password, user.password)

    if (!validPassword) {
      return res.status(400).json({ message: "Invalid password" })
    }

    const token = jwt.sign(
      { userId: user._id },
      "secretkey"
    )

    res.json({ token })

  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})


/* ------------------ TASK ROUTES ------------------ */

// GET tasks
app.get("/tasks", authMiddleware, async (req, res) => {

  const tasks = await Task.find({ userId: req.userId })
  res.json(tasks)

})


// ADD task
app.post("/tasks", authMiddleware, async (req, res) => {

  try {

    const { title } = req.body

    if (!title || title.trim() === "") {
      return res.status(400).json({ message: "Title required" })
    }

    const newTask = new Task({
      title,
      userId: req.userId
    })

    const savedTask = await newTask.save()

    res.json(savedTask)

  } catch (err) {
    res.status(500).json({ error: err.message })
  }

})
// TOGGLE complete
app.put("/tasks/:id", authMiddleware, async (req, res) => {

  try {

    const task = await Task.findById(req.params.id)

    task.completed = !task.completed

    await task.save()

    res.json(task)

  } catch (err) {
    res.status(500).json({ error: err.message })
  }

})


// DELETE task
app.delete("/tasks/:id", authMiddleware, async (req, res) => {

  try {

    const deletedTask = await Task.findByIdAndDelete(req.params.id)

    res.json(deletedTask)

  } catch (err) {
    res.status(500).json({ error: err.message })
  }

})