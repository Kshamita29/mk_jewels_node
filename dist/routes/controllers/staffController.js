import { pool } from '../db/db.js';
export const getStaff = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT s.*, r.name AS role_name, d.name AS department_name
      FROM staff s
      LEFT JOIN roles r ON s.role_id = r.id
      LEFT JOIN departments d ON s.department_id = d.id
      ORDER BY s.id
    `);
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({
      error: err.message
    });
  }
};
export const addStaff = async (req, res) => {
  const {
    name,
    email,
    pass,
    phone,
    role_id,
    department_id
  } = req.body;
  try {
    const result = await pool.query(`INSERT INTO staff (name, email, pass, phone, role_id, department_id)
       VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`, [name, email, pass, phone, role_id, department_id]);
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({
      error: err.message
    });
  }
};
export const updateStaff = async (req, res) => {
  const {
    id
  } = req.params;
  const {
    name,
    email,
    pass,
    phone,
    role_id,
    department_id
  } = req.body;
  try {
    const result = await pool.query(`UPDATE staff
       SET name=$1, email=$2, pass=$3, phone=$4, role_id=$5, department_id=$6, updated_at=NOW()
       WHERE id=$7 RETURNING *`, [name, email, pass, phone, role_id, department_id, id]);
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({
      error: err.message
    });
  }
};
export const deleteStaff = async (req, res) => {
  const {
    id
  } = req.params;
  try {
    await pool.query('DELETE FROM staff WHERE id=$1', [id]);
    res.json({
      message: 'Staff deleted successfully'
    });
  } catch (err) {
    res.status(500).json({
      error: err.message
    });
  }
};