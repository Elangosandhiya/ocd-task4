import { pool } from '../config/db.js';

export async function listLocations(req, res) {
  const result = await pool.query(
    `SELECT DISTINCT location
     FROM businesses
     WHERE location IS NOT NULL AND location <> ''
     ORDER BY location ASC`
  );
  return res.status(200).json({
    success: true,
    data: result.rows.map((row) => row.location)
  });
}
