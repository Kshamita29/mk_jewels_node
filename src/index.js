import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import departmentRoutes from './routes/departmentRoutes.js';
import roleRoutes from './routes/roleRoutes.js';
import staffRoutes from './routes/staffRoutes.js';
import taskRoutes from './routes/taskRoutes.js';

const app = express();

// ---------- MIDDLEWARE ----------
const corsOptions = {
  origin:"*",
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
};

app.use(cors(corsOptions));
app.use(bodyParser.json());

// ---------- ROUTES ----------
app.use('/api/departments', departmentRoutes);
app.use('/api/roles', roleRoutes);
app.use('/api/staff', staffRoutes);
app.use('/api/tasks', taskRoutes);

// Example Tasks Route
app.get('/tasks', (req, res) => {
  const tasks = [
    { priority: "High", title: "Design Team Planning", time: "Creative Team", meet: "Ram Raimalani", due: "December 20", color: "lightGreenAccent" },
    { priority: "Low", title: "Sales Report Review", time: "Sales Team", meet: "Ram Raimalani", due: "December 20", color: "tealAccent" },
    { priority: "Medium", title: "UI Fix Review", time: "Development Team", meet: "Kush Raimalani", due: "December 21", color: "amberAccent" }
  ];
  res.json(tasks);
});

// Test route
app.get('/', (req, res) => {
  res.send('Welcome to MK_JEWELS Backend!');
});

// ---------- START SERVER ----------
const PORT = process.env.PORT || '3000';
app.listen(PORT, () => console.log(`Server running on port ${PORT}, Backend is Live!`));
