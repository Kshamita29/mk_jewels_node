// const express = require('express');
// const pool = require('./db');

// const app = express();
// app.use(express.json());

// /* ---------------------- STAFF APIs ---------------------- */

// // Onboard staff
// app.post('/staff', async (req, res) => {
//   try {
//     const { name, email, phone, department_id, role_id } = req.body;
//     const result = await pool.query(
//       `INSERT INTO staff (name, email, phone, department_id, role_id)
//        VALUES ($1,$2,$3,$4,$5) RETURNING *`,
//       [name, email, phone, department_id, role_id]
//     );
//     res.json(result.rows[0]);
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ error: 'Onboarding failed' });
//   }
// });

// // Get all staff
// app.get('/staff', async (req, res) => {
//   try {
//     const result = await pool.query(
//       `SELECT s.*, r.name as role_name, d.name as dept_name
//        FROM staff s
//        LEFT JOIN roles r ON s.role_id = r.id
//        LEFT JOIN departments d ON s.department_id = d.id`
//     );
//     res.json(result.rows);
//   } catch (err) {
//     res.status(500).json({ error: 'Fetch failed' });
//   }
// });

// /* ---------------------- DEPARTMENTS & ROLES ---------------------- */

// // Create department
// app.post('/departments', async (req, res) => {
//   try {
//     const { name, description } = req.body;
//     const result = await pool.query(
//       `INSERT INTO departments (name, description) VALUES ($1,$2) RETURNING *`,
//       [name, description]
//     );
//     res.json(result.rows[0]);
//   } catch (err) {
//     res.status(500).json({ error: 'Department creation failed' });
//   }
// });

// // Create role
// app.post('/roles', async (req, res) => {
//   try {
//     const { name, description, can_assign_tasks } = req.body;
//     const result = await pool.query(
//       `INSERT INTO roles (name, description, can_assign_tasks)
//        VALUES ($1,$2,$3) RETURNING *`,
//       [name, description, can_assign_tasks || false]
//     );
//     res.json(result.rows[0]);
//   } catch (err) {
//     res.status(500).json({ error: 'Role creation failed' });
//   }
// });

// /* ---------------------- TASKS ---------------------- */

// // Create task (daily/flexible)
// app.post('/tasks', async (req, res) => {
//   try {
//     const {
//       title, description, is_daily, is_time_bound,
//       expected_start_time, expected_end_time,
//       deadline_interval, created_by
//     } = req.body;

//     const result = await pool.query(
//       `INSERT INTO tasks 
//         (title, description, is_daily, is_time_bound, expected_start_time, expected_end_time, deadline_interval, created_by)
//        VALUES ($1,$2,$3,$4,$5,$6,$7,$8) RETURNING *`,
//       [title, description, is_daily || false, is_time_bound || false,
//        expected_start_time, expected_end_time, deadline_interval, created_by]
//     );

//     res.json(result.rows[0]);
//   } catch (err) {
//     res.status(500).json({ error: 'Task creation failed' });
//   }
// });
// // Get Task 
// app.get("/tasks", (req, res) => {
//   const tasks = [
//     {
//       priority: "High",
//       title: "Design Template Planning",
//       time: "Creative Team",
//       meet: "Ram Raimalani",
//       due: "December 20",
//       color: "lightGreenAccent"
//     },
//     {
//       priority: "Low",
//       title: "Sales Report Review",
//       time: "Sales Team",
//       meet: "Ram Raimalani",
//       due: "December 20",
//       color: "tealAccent"
//     },
//     {
//       priority: "Medium",
//       title: "Internet Issue Fix",
//       time: "Admin",
//       meet: "Kush Raimalani",
//       due: "December 21",
//       color: "amberAccent"
//     }
//   ];

//   res.json(tasks); // 👈 Return an array, not an object
// });

// /* ---------------------- ASSIGNMENTS ---------------------- */

// // Assign task to staff (manual)
// app.post('/assign-task', async (req, res) => {
//   try {
//     const { task_id, assigned_to, assigned_by, due_date } = req.body;
//     const result = await pool.query(
//       `INSERT INTO task_assignments 
//         (task_id, assigned_to, assigned_by, due_date)
//        VALUES ($1,$2,$3,$4) RETURNING *`,
//       [task_id, assigned_to, assigned_by, due_date]
//     );
//     res.json(result.rows[0]);
//   } catch (err) {
//     res.status(500).json({ error: 'Assignment failed' });
//   }
// });

// // Mark task as completed
// app.put('/complete-task/:id', async (req, res) => {
//   try {
//     const { id } = req.params;
//     const { remarks } = req.body;
//     const result = await pool.query(
//       `UPDATE task_assignments 
//        SET status='completed', completed_at=NOW(), remarks=$1
//        WHERE id=$2 RETURNING *`,
//       [remarks, id]
//     );
//     res.json(result.rows[0]);
//   } catch (err) {
//     res.status(500).json({ error: 'Completion failed' });
//   }
// });

// // Get tasks for a staff for today
// app.get('/tasks/today/:staffId', async (req, res) => {
//   try {
//     const { staffId } = req.params;
//     const result = await pool.query(
//       `SELECT ta.*, t.title, t.is_time_bound, t.expected_start_time, t.expected_end_time
//        FROM task_assignments ta
//        JOIN tasks t ON ta.task_id = t.id
//        WHERE ta.assigned_to=$1 AND ta.due_date=CURRENT_DATE`,
//       [staffId]
//     );
//     res.json(result.rows);
//   } catch (err) {
//     res.status(500).json({ error: 'Fetch failed' });
//   }
// });

// /* ---------------------- DAILY JOB ----------------------
//    To auto-assign daily tasks: use node-cron or worker
// -------------------------------------------------------- */

// app.post('/generate-daily-tasks', async (req, res) => {
//   try {
//     // fetch all daily tasks
//     const tasks = await pool.query(`SELECT * FROM tasks WHERE is_daily = true`);
//     const staff = await pool.query(`SELECT id FROM staff`);

//     let assignments = [];
//     for (let task of tasks.rows) {
//       for (let member of staff.rows) {
//         const a = await pool.query(
//           `INSERT INTO task_assignments (task_id, assigned_to, due_date)
//            VALUES ($1,$2,CURRENT_DATE) RETURNING *`,
//           [task.id, member.id]
//         );
//         assignments.push(a.rows[0]);
//       }
//     }

//     res.json({ success: true, assignments });
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ error: 'Daily generation failed' });
//   }
// });

// // GET /analytics/staff/:staffId?start=2025-09-01&end=2025-09-25
// app.get('/analytics/staff/:staffId', async (req, res) => {
//   try {
//     const { staffId } = req.params;
//     const { start, end } = req.query;

//     const result = await pool.query(
//       `SELECT 
//          COUNT(*) FILTER (WHERE status='completed') AS completed,
//          COUNT(*) FILTER (WHERE status='pending') AS pending,
//          COUNT(*) FILTER (WHERE status='skipped') AS skipped,
//          COUNT(*) AS total
//        FROM task_assignments
//        WHERE assigned_to=$1 AND due_date BETWEEN $2 AND $3`,
//       [staffId, start, end]
//     );

//     res.json(result.rows[0]);
//   } catch (err) {
//     res.status(500).json({ error: 'Analytics failed' });
//   }
// });

// // GET /analytics/staff/:staffId/ontime?start=2025-09-01&end=2025-09-25
// app.get('/analytics/staff/:staffId/ontime', async (req, res) => {
//   try {
//     const { staffId } = req.params;
//     const { start, end } = req.query;

//     const result = await pool.query(
//       `SELECT 
//           COUNT(*) FILTER (
//             WHERE ta.status='completed' 
//               AND (
//                 (t.is_time_bound = TRUE 
//                  AND ta.completed_at <= (ta.due_date + t.expected_end_time::interval))
//                 OR
//                 (t.is_time_bound = FALSE 
//                  AND ta.completed_at <= (ta.created_at + COALESCE(t.deadline_interval, '1 day'::interval)))
//               )
//           ) AS on_time,
//           COUNT(*) FILTER (
//             WHERE ta.status='completed' 
//               AND ta.completed_at IS NOT NULL
//               AND (
//                 (t.is_time_bound = TRUE 
//                  AND ta.completed_at > (ta.due_date + t.expected_end_time::interval))
//                 OR
//                 (t.is_time_bound = FALSE 
//                  AND ta.completed_at > (ta.created_at + COALESCE(t.deadline_interval, '1 day'::interval)))
//               )
//           ) AS delayed
//        FROM task_assignments ta
//        JOIN tasks t ON ta.task_id = t.id
//        WHERE ta.assigned_to=$1 AND ta.due_date BETWEEN $2 AND $3`,
//       [staffId, start, end]
//     );

//     res.json(result.rows[0]);
//   } catch (err) {
//     res.status(500).json({ error: 'On-time analytics failed' });
//   }
// });

// // GET /analytics/department/:deptId?start=2025-09-01&end=2025-09-25
// app.get('/analytics/department/:deptId', async (req, res) => {
//   try {
//     const { deptId } = req.params;
//     const { start, end } = req.query;

//     const result = await pool.query(
//       `SELECT d.name as department, 
//               COUNT(*) FILTER (WHERE ta.status='completed') AS completed,
//               COUNT(*) FILTER (WHERE ta.status='pending') AS pending,
//               COUNT(*) AS total
//        FROM task_assignments ta
//        JOIN staff s ON ta.assigned_to = s.id
//        JOIN departments d ON s.department_id = d.id
//        WHERE d.id=$1 AND ta.due_date BETWEEN $2 AND $3
//        GROUP BY d.name`,
//       [deptId, start, end]
//     );

//     res.json(result.rows[0]);
//   } catch (err) {
//     res.status(500).json({ error: 'Department analytics failed' });
//   }
// });

// // GET /analytics/leaderboard?start=2025-09-01&end=2025-09-25&limit=5
// app.get('/analytics/leaderboard', async (req, res) => {
//   try {
//     const { start, end, limit } = req.query;

//     const result = await pool.query(
//       `SELECT s.name, 
//               COUNT(*) FILTER (WHERE ta.status='completed') AS completed,
//               COUNT(*) AS total,
//               ROUND((COUNT(*) FILTER (WHERE ta.status='completed')::decimal / COUNT(*) * 100), 2) AS completion_rate
//        FROM task_assignments ta
//        JOIN staff s ON ta.assigned_to = s.id
//        WHERE ta.due_date BETWEEN $1 AND $2
//        GROUP BY s.name
//        ORDER BY completion_rate DESC
//        LIMIT $3`,
//       [start, end, limit || 5]
//     );

//     res.json(result.rows);
//   } catch (err) {
//     res.status(500).json({ error: 'Leaderboard failed' });
//   }
// });

// /* ---------------------- SERVER ---------------------- */

// app.listen(3000, () => {
//   console.log('Server running on http://localhost:3000');
// });

import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import departmentRoutes from './routes/departmentRoutes.js';
import roleRoutes from './routes/roleRoutes.js';
import staffRoutes from './routes/staffRoutes.js';
const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use('/api/departments', departmentRoutes);
app.use('/api/roles', roleRoutes);
app.use('/api/staff', staffRoutes);
app.get("/tasks", (req, res) => {
  const tasks = [{
    priority: "High",
    title: "Design Team Planning",
    time: "Creative Team",
    meet: "Ram Raimalani",
    due: "December 20",
    color: "lightGreenAccent"
  }, {
    priority: "Low",
    title: "Sales Report Review",
    time: "Sales Team",
    meet: "Ram Raimalani",
    due: "December 20",
    color: "tealAccent"
  }, {
    priority: "Medium",
    title: "UI Fix Review",
    time: "Development Team",
    meet: "Kush Raimalani",
    due: "December 21",
    color: "amberAccent"
  }];
  res.json(tasks); // 👈 Return an array, not an object
});
const PORT = 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));