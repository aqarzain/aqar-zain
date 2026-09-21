// ============================================================
// Areas Controller - منطق المناطق
// ============================================================

const db = require('../config/database');
const { success, error, notFound } = require('../utils/response');

// ============================================================
// 1. جميع المناطق
// ============================================================
const getAllAreas = async (req, res) => {
  try {
    const { city, governorate, q } = req.query;

    const conditions = [];
    const params = [];
    let paramCount = 0;

    if (city) {
      paramCount++;
      conditions.push(`city = $${paramCount}`);
      params.push(city);
    }

    if (governorate) {
      paramCount++;
      conditions.push(`governorate = $${paramCount}`);
      params.push(governorate);
    }

    if (q) {
      paramCount++;
      conditions.push(`locality ILIKE $${paramCount}`);
      params.push(`%${q}%`);
    }

    const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';

    const result = await db.query(`
      SELECT
        a.id, a.locality AS name, a.city, a.administrative_area AS district,
        a.governorate,
        COUNT(p.id)::int AS properties_count
      FROM areas a
      LEFT JOIN properties p ON p.area_id = a.id AND p.status = 'available'
      ${whereClause}
      GROUP BY a.id, a.locality, a.city, a.administrative_area, a.governorate
      ORDER BY a.locality ASC
    `, params);

    return success(res, result.rows, 'تم جلب المناطق');
  } catch (err) {
    console.error('❌ خطأ في getAllAreas:', err);
    return error(res, err.message, 500);
  }
};

// ============================================================
// 2. منطقة محددة
// ============================================================
const getAreaById = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await db.query(`
      SELECT
        a.id, a.locality AS name, a.city, a.administrative_area AS district,
        a.governorate,
        COUNT(p.id)::int AS properties_count
      FROM areas a
      LEFT JOIN properties p ON p.area_id = a.id AND p.status = 'available'
      WHERE a.id = $1
      GROUP BY a.id, a.locality, a.city, a.administrative_area, a.governorate
    `, [id]);

    if (result.rows.length === 0) {
      return notFound(res, 'المنطقة غير موجودة');
    }

    return success(res, result.rows[0], 'تم جلب المنطقة');
  } catch (err) {
    console.error('❌ خطأ في getAreaById:', err);
    return error(res, err.message, 500);
  }
};

// ============================================================
// 3. إحصائيات المناطق
// ============================================================
const getAreaStats = async (req, res) => {
  try {
    const result = await db.query(`
      SELECT
        COUNT(*)::int AS total_areas,
        COUNT(DISTINCT city)::int AS total_cities,
        COUNT(DISTINCT governorate)::int AS total_governorates
      FROM areas
    `);

    return success(res, result.rows[0], 'تم جلب الإحصائيات');
  } catch (err) {
    console.error('❌ خطأ في getAreaStats:', err);
    return error(res, err.message, 500);
  }
};

module.exports = {
  getAllAreas,
  getAreaById,
  getAreaStats,
};
