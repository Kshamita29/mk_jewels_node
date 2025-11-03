import { pool } from '../db/db.js';
export const getDepartments = async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM departments ORDER BY id');
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({
      error: err.message
    });
  }
};
export const addDepartment = async (req, res) => {
  const {
    name,
    description
  } = req.body;
  try {
    const result = await pool.query('INSERT INTO departments (name, description) VALUES ($1, $2) RETURNING *', [name, description]);
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({
      error: err.message
    });
  }
};
export const updateDepartment = async (req, res) => {
  const {
    id
  } = req.params;
  const {
    name,
    description
  } = req.body;
  try {
    const result = await pool.query('UPDATE departments SET name=$1, description=$2 WHERE id=$3 RETURNING *', [name, description, id]);
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({
      error: err.message
    });
  }
};
export const deleteDepartment = async (req, res) => {
  const {
    id
  } = req.params;
  try {
    await pool.query('DELETE FROM departments WHERE id=$1', [id]);
    res.json({
      message: 'Department deleted successfully'
    });
  } catch (err) {
    res.status(500).json({
      error: err.message
    });
  }
};