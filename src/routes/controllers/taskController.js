import { pool } from "../db/db.js";

// ====================================================== GET ALL TASKS + ASSIGNEES ======================================================
export const getTasks = async (req, res) => {
  try {
    const tasksResult = await pool.query("SELECT * FROM tasks ORDER BY id DESC");

    const assigneesResult = await pool.query(`
      SELECT 
        ta.*, 
        s.name AS staff_name, 
        r.name AS role_name, 
        d.name AS department_name
      FROM task_assignees ta
      LEFT JOIN staff s ON s.id = ta.staff_id
      LEFT JOIN roles r ON r.id = ta.role_id
      LEFT JOIN departments d ON d.id = ta.department_id
    `);

    const assignees = assigneesResult.rows;
    const tasks = tasksResult.rows;

    const formatted = tasks.map(task => ({
      ...task,
      assigned_people: assignees.filter(a => a.task_id === task.id)
    }));

    res.json(formatted);

  } catch (err) {
    console.error("GET TASKS ERROR:", err);
    res.status(500).json({ error: "Failed to fetch tasks" });
  }
};

// ====================================================== CREATE A TASK ======================================================
export const addTask = async (req, res) => {
  const client = await pool.connect();

  try {
    const {
      title,
      description,
      datetime,
      is_daily,
      repeat_rule,
      custom_recurrence,
      assigned_people = []
    } = req.body;

    if (!title) {
      return res.status(400).json({ error: "Title is required" });
    }

    await client.query("BEGIN");

    const taskResult = await client.query(
      `INSERT INTO tasks (title, description, datetime, is_daily, repeat_rule, custom_recurrence)
       VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
      [title, description, datetime, is_daily, repeat_rule, custom_recurrence]
    );

    const task = taskResult.rows[0];

    for (let person of assigned_people) {
      await client.query(
        `INSERT INTO task_assignees (task_id, staff_id, role_id, department_id)
         VALUES ($1, $2, $3, $4)`,
        [
          task.id,
          person.staff_id || null,
          person.role_id || null,
          person.department_id || null
        ]
      );
    }

    await client.query("COMMIT");

    res.json({ message: "Task created successfully", task });

  } catch (err) {
    await client.query("ROLLBACK");
    console.error("CREATE TASK ERROR:", err);
    res.status(500).json({ error: "Failed to create task" });
  } finally {
    client.release();
  }
};

// ====================================================== UPDATE TASK ======================================================
export const updateTask = async (req, res) => {
  const client = await pool.connect();
  const { id } = req.params;

  try {
    const {
      title,
      description,
      datetime,
      is_daily,
      repeat_rule,
      custom_recurrence,
      assigned_people = []
    } = req.body;

    await client.query("BEGIN");

    const updated = await client.query(
      `UPDATE tasks
       SET title=$1, description=$2, datetime=$3, is_daily=$4, repeat_rule=$5, custom_recurrence=$6
       WHERE id=$7
       RETURNING *`,
      [title, description, datetime, is_daily, repeat_rule, custom_recurrence, id]
    );

    // Delete old assignees
    await client.query(`DELETE FROM task_assignees WHERE task_id=$1`, [id]);

    // Insert new assignees
    for (let person of assigned_people) {
      await client.query(
        `INSERT INTO task_assignees (task_id, staff_id, role_id, department_id)
         VALUES ($1, $2, $3, $4)`,
        [
          id,
          person.staff_id || null,
          person.role_id || null,
          person.department_id || null
        ]
      );
    }

    await client.query("COMMIT");

    res.json({ message: "Task updated successfully", task: updated.rows[0] });

  } catch (err) {
    await client.query("ROLLBACK");
    console.error("UPDATE TASK ERROR:", err);
    res.status(500).json({ error: "Failed to update task" });
  } finally {
    client.release();
  }
};

// ====================================================== DELETE TASK ======================================================
export const deleteTask = async (req, res) => {
  const { id } = req.params;

  try {
    await pool.query("DELETE FROM tasks WHERE id=$1", [id]);
    res.json({ message: "Task deleted successfully" });
  } catch (err) {
    console.error("DELETE TASK ERROR:", err);
    res.status(500).json({ error: "Failed to delete task" });
  }
};
