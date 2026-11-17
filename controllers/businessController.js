import { matchedData } from 'express-validator';
import { pool } from '../config/db.js';
import { ApiError } from '../utils/ApiError.js';

const businessSelect = `
  SELECT b.id, b.name, b.description, b.category_id, c.name AS category_name,
         b.address, b.location, b.contact_number, b.whatsapp_number,
         b.website_url, b.image_url, b.is_featured, b.created_at, b.updated_at
  FROM businesses b
  JOIN categories c ON c.id = b.category_id
`;

async function findBusiness(id) {
  const result = await pool.query(`${businessSelect} WHERE b.id = $1`, [id]);
  return result.rows[0];
}

export async function listBusinesses(req, res) {
  const filters = matchedData(req, { locations: ['query'] });
  const page = filters.page || 1;
  const limit = filters.limit || 10;
  const offset = (page - 1) * limit;
  const conditions = [];
  const values = [];

  if (filters.search) {
    values.push(`%${filters.search}%`);
    conditions.push(`b.name ILIKE $${values.length}`);
  }
  if (filters.category) {
    values.push(filters.category);
    conditions.push(`b.category_id = $${values.length}`);
  }
  if (filters.location) {
    values.push(`%${filters.location}%`);
    conditions.push(`b.location ILIKE $${values.length}`);
  }
  if (filters.featured !== undefined) {
    values.push(filters.featured);
    conditions.push(`b.is_featured = $${values.length}`);
  }

  const whereClause = conditions.length ? `WHERE ${conditions.join(' AND ')}` : '';
  const orderClause = filters.sort === 'name'
    ? 'ORDER BY b.is_featured DESC, b.name ASC, b.created_at DESC'
    : 'ORDER BY b.is_featured DESC, b.created_at DESC';
  const countResult = await pool.query(
    `SELECT COUNT(*)::int AS total FROM businesses b ${whereClause}`,
    values
  );
  const total = countResult.rows[0].total;
  const dataValues = [...values, limit, offset];
  const result = await pool.query(
    `${businessSelect} ${whereClause} ${orderClause} LIMIT $${values.length + 1} OFFSET $${values.length + 2}`,
    dataValues
  );

  return res.status(200).json({
    success: true,
    data: result.rows,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit)
    }
  });
}

export async function getBusiness(req, res) {
  const { id } = matchedData(req, { locations: ['params'] });
  const business = await findBusiness(id);
  if (!business) {
    throw new ApiError(404, 'Business not found');
  }
  return res.status(200).json({ success: true, data: business });
}

export async function createBusiness(req, res) {
  const data = matchedData(req, { locations: ['body'] });
  const result = await pool.query(
    `INSERT INTO businesses
      (name, description, category_id, address, location, contact_number,
       whatsapp_number, website_url, image_url, is_featured)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
     RETURNING id`,
    [
      data.name, data.description, data.category_id, data.address, data.location,
      data.contact_number, data.whatsapp_number, data.website_url ?? null,
      data.image_url ?? null, data.is_featured ?? false
    ]
  );

  const business = await findBusiness(result.rows[0].id);
  return res.status(201).json({ success: true, data: business });
}

export async function updateBusiness(req, res) {
  const { id } = matchedData(req, { locations: ['params'] });
  const data = matchedData(req, { locations: ['body'] });
  const result = await pool.query(
    `UPDATE businesses
     SET name = $1, description = $2, category_id = $3, address = $4,
         location = $5, contact_number = $6, whatsapp_number = $7,
         website_url = $8, image_url = $9, is_featured = $10, updated_at = NOW()
     WHERE id = $11
     RETURNING id`,
    [
      data.name, data.description, data.category_id, data.address, data.location,
      data.contact_number, data.whatsapp_number, data.website_url ?? null,
      data.image_url ?? null, data.is_featured ?? false, id
    ]
  );

  if (result.rowCount === 0) {
    throw new ApiError(404, 'Business not found');
  }
  const business = await findBusiness(id);
  return res.status(200).json({ success: true, data: business });
}

export async function deleteBusiness(req, res) {
  const { id } = matchedData(req, { locations: ['params'] });
  const result = await pool.query('DELETE FROM businesses WHERE id = $1', [id]);
  if (result.rowCount === 0) {
    throw new ApiError(404, 'Business not found');
  }
  return res.status(200).json({ success: true, message: 'Business deleted' });
}

export async function setBusinessFeatured(req, res) {
  const { id } = matchedData(req, { locations: ['params'] });
  const { is_featured: isFeatured } = matchedData(req, { locations: ['body'] });
  const result = await pool.query(
    `UPDATE businesses
     SET is_featured = $1, updated_at = NOW()
     WHERE id = $2
     RETURNING id`,
    [isFeatured, id]
  );

  if (result.rowCount === 0) {
    throw new ApiError(404, 'Business not found');
  }
  return res.status(200).json({ success: true, data: await findBusiness(id) });
}
