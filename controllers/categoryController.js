import { matchedData } from 'express-validator';
import { pool } from '../config/db.js';
import { ApiError } from '../utils/ApiError.js';

export async function listCategories(req, res) {
  const result = await pool.query(
    `SELECT c.id, c.name, COUNT(b.id)::int AS business_count
     FROM categories c
     LEFT JOIN businesses b ON b.category_id = c.id
     GROUP BY c.id
     ORDER BY c.name ASC`
  );
  return res.status(200).json({ success: true, data: result.rows });
}

export async function createCategory(req, res) {
  const { name } = matchedData(req, { locations: ['body'] });
  const result = await pool.query(
    'INSERT INTO categories (name) VALUES ($1) RETURNING id, name',
    [name]
  );
  return res.status(201).json({ success: true, data: result.rows[0] });
}

export async function updateCategory(req, res) {
  const { id } = matchedData(req, { locations: ['params'] });
  const { name } = matchedData(req, { locations: ['body'] });
  const result = await pool.query(
    'UPDATE categories SET name = $1 WHERE id = $2 RETURNING id, name',
    [name, id]
  );
  if (result.rowCount === 0) {
    throw new ApiError(404, 'Category not found');
  }
  return res.status(200).json({ success: true, data: result.rows[0] });
}

export async function deleteCategory(req, res) {
  const { id } = matchedData(req, { locations: ['params'] });
  const result = await pool.query('DELETE FROM categories WHERE id = $1', [id]);
  if (result.rowCount === 0) {
    throw new ApiError(404, 'Category not found');
  }
  return res.status(200).json({ success: true, message: 'Category deleted' });
}
