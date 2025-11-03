import { pool } from '../db/db.js';
export const getRoles = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT r.*, d.name AS department_name
      FROM roles r
      LEFT JOIN departments d ON r.department_id = d.id
      ORDER BY r.id
    `);
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const addRole = async (req, res) => {
  const { name, description, can_assign_tasks, department_id } = req.body;
  try {
    const result = await pool.query(
      `INSERT INTO roles (name, description, can_assign_tasks, department_id)
       VALUES ($1, $2, $3, $4) RETURNING *`,
      [name, description, can_assign_tasks, department_id]
    );
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const updateRole = async (req, res) => {
  const { id } = req.params;
  const { name, description, can_assign_tasks, department_id } = req.body;
  try {
    const result = await pool.query(
      `UPDATE roles
       SET name=$1, description=$2, can_assign_tasks=$3, department_id=$4
       WHERE id=$5 RETURNING *`,
      [name, description, can_assign_tasks, department_id, id]
    );
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const deleteRole = async (req, res) => {
  const { id } = req.params;
  try {
    await pool.query('DELETE FROM roles WHERE id=$1', [id]);
    res.json({ message: 'Role deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
