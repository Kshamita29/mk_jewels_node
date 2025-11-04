import { pool } from "../db/db.js";

// ======================================================GET ALL TASKS + ASSIGNEES ======================================================
export const getTasks = async (req, res) => {
  try {
    const tasks = await pool.query("SELECT * FROM tasks ORDER BY id DESC");

    const assigneeRows = await pool.query(`
      SELECT ta.*, s.name AS staff_name, r.name AS role_name, d.name AS department_name
      FROM task_assignees ta
      LEFT JOIN staff s ON s.id = ta.staff_id
      LEFT JOIN roles r ON r.id = ta.role_id
      LEFT JOIN departments d ON d.id = ta.department_id
    `);

    const taskList = tasks.rows.map(task => {
      const assigned = assigneeRows.rows.filter(a => a.task_id === task.id);
      return { ...task, assigned_people: assigned };
    });

    res.json(taskList);

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ====================================================== CREATE A TASK ======================================================
export const addTask = async (req, res) => {
  const {
    title,
    description,
    datetime,
    is_daily,
    repeat_rule,
    custom_recurrence,
    assigned_people = [] // staff_id, role_id, department_id
  } = req.body;

  try {
    const taskResult = await pool.query(
      `INSERT INTO tasks (title, description, datetime, is_daily, repeat_rule, custom_recurrence)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING *`,
      [
        title,
        description,
        datetime,
        is_daily,
        repeat_rule,
        custom_recurrence
      ]
    );

    const task = taskResult.rows[0];

    for (let person of assigned_people) {
      await pool.query(
        `INSERT INTO task_assignees (task_id, staff_id, role_id, department_id)
         VALUES ($1, $2, $3, $4)`,
        [
          task.id,
          person.staff_id,
          person.role_id,
          person.department_id
        ]
      );
    }

    res.json(task);

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ====================================================== UPDATE TASK ======================================================
export const updateTask = async (req, res) => {
  const { id } = req.params;
  const {
    title,
    description,
    datetime,
    is_daily,
    repeat_rule,
    custom_recurrence,
    assigned_people = []
  } = req.body;

  try {
    const updated = await pool.query(
      `UPDATE tasks
       SET title=$1, description=$2, datetime=$3, is_daily=$4, repeat_rule=$5, custom_recurrence=$6
       WHERE id=$7 RETURNING *`,
      [
        title,
        description,
        datetime,
        is_daily,
        repeat_rule,
        custom_recurrence,
        id
      ]
    );

    // Remove old assignees
    await pool.query(`DELETE FROM task_assignees WHERE task_id=$1`, [id]);

    // Insert new ones
    for (let person of assigned_people) {
      await pool.query(
        `INSERT INTO task_assignees (task_id, staff_id, role_id, department_id)
         VALUES ($1, $2, $3, $4)`,
        [
          id,
          person.staff_id,
          person.role_id,
          person.department_id
        ]
      );
    }

    res.json(updated.rows[0]);

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ====================================================== DELETE TASK ======================================================
export const deleteTask = async (req, res) => {
  const { id } = req.params;
  try {
    await pool.query("DELETE FROM tasks WHERE id=$1", [id]);
    res.json({ message: "Task deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
