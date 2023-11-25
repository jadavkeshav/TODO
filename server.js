const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors'); 
const app = express();

app.use(cors());

// Connect to MongoDB
mongoose.connect('mongodb+srv://jk:keshav@task.xz6rdea.mongodb.net/task?retryWrites=true&w=majority', { useNewUrlParser: true, useUnifiedTopology: true });
const db = mongoose.connection;

db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', () => {
  console.log('Connected to MongoDB');
});

// Define Task Schema
const taskSchema = new mongoose.Schema({
  description: String,
  completed: Boolean,
});

const Task = mongoose.model('Task', taskSchema);

// Express API endpoints
app.use(express.json());

app.post('/addTask', async (req, res) => {
  const { description } = req.body;

  if (!description) {
    return res.status(400).json({ error: 'Description is required' });
  }

  const newTask = new Task({
    description,
    completed: false,
  });

  await newTask.save();

  res.status(201).json(newTask);
});

app.get('/getTasks', async (req, res) => {
  const tasks = await Task.find();
  res.json(tasks);
});

app.delete('/deleteTask/:taskId', async (req, res) => {
  const { taskId } = req.params;

  try {
    await Task.findByIdAndDelete(taskId);
    res.json({ message: 'Task deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
