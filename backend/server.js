require("dotenv").config()

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
mongoose.connect(process.env.MONGO_URI)
.then(()=>console.log("MongoDB Connected"))
.catch(err=>console.log(err))

app.get("/", (req,res)=>{
    res.send("Task Manager API Running")
})

// Use PORT from .env
app.listen(process.env.PORT, ()=>{
    console.log(`Server running on port ${process.env.PORT}`)
})

/* ------------------ AUTH ROUTES ------------------ */

// SIGNUP
app.post("/signup", async (req, res) => {
  try {
    console.log("BODY:", req.body); // 🔥 ADD THIS

    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: "All fields required" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new User({
      name,
      email,
      password: hashedPassword
    });

    await user.save();

    res.json({ message: "User created successfully" });

  } catch (err) {
    console.log("🔥 SIGNUP ERROR:", err); // 🔥 VERY IMPORTANT
    res.status(500).json({ error: err.message });
  }
});

// LOGIN
app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body

    console.log("EMAIL:", email)

    const user = await User.findOne({ email })

    if (!user) {
      return res.status(400).json({ message: "User not found" })
    }

    const validPassword = await bcrypt.compare(password, user.password)

    if (!validPassword) {
      return res.status(400).json({ message: "Invalid password" })
    }

    if (!process.env.JWT_SECRET) {
      return res.status(500).json({ message: "JWT missing" })
    }

    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    )

    res.json({ token })

  } catch (err) {
    console.log("LOGIN ERROR:", err)
    res.status(500).json({ error: err.message })
  }
})

// TOGGLE
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

// DELETE
app.delete("/tasks/:id", authMiddleware, async (req, res) => {
  try {
    const deletedTask = await Task.findByIdAndDelete(req.params.id)
    res.json(deletedTask)

  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})


app.post("/tasks", authMiddleware, async (req, res) => {
  try {
    const { title } = req.body;

    if (!title || title.trim() === "") {
      return res.status(400).json({ message: "Title required" });
    }

    const newTask = new Task({
      title,
      userId: req.userId
    });

    const savedTask = await newTask.save();
    res.json(savedTask);

  } catch (err) {
    console.log("ADD TASK ERROR:", err);
    res.status(500).json({ error: err.message });
  }
});

app.get("/tasks", authMiddleware, async (req, res) => {
  try {
    const tasks = await Task.find({ userId: req.userId });
    res.json(tasks);
  } catch (err) {
    console.log("GET TASK ERROR:", err);
    res.status(500).json({ error: err.message });
  }
});

app.listen(process.env.PORT || 5000, () => {
  console.log("Server running")
})