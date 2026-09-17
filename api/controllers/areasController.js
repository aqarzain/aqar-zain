// ============================================================
// Areas Controller - منطق المناطق
// ============================================================

const db = require('../config/database');
const { success, error, notFound } = require('../utils/response');

// ============================================================
// 1. الحصول على جميع المناطق
// ============================================================
const getAllAreas = async (req, res) => {
    try {
        const { city, governorate } = req.query;

        let query = `
            SELECT 
                id, governorate, city, administrative_area,
                locality, street, landmark,
                property_count, avg_price, is_popular,
                distance_to_schools, distance_to_hospitals,
                distance_to_metro, has_school, has_hospital, has_metro
            FROM areas
            WHERE 1=1
        `;

        const params = [];
        let paramCount = 0;

        if (city) {
            paramCount++;
            query += ` AND city = $${paramCount}`;
            params.push(city);
        }

        if (governorate) {
            paramCount++;
            query += ` AND governorate = $${paramCount}`;
            params.push(governorate);
        }

        query += ` ORDER BY property_count DESC, locality ASC`;

        const result = await db.query(query, params);
        return success(res, result.rows, 'تم جلب المناطق');

    } catch (err) {
        console.error('❌ خطأ في getAllAreas:', err);
        return error(res, err.message);
    }
};

// ============================================================
// 2. الحصول على منطقة محددة
// ============================================================
const getAreaById = async (req, res) => {
    try {
        const { id } = req.params;

        const result = await db.query(`
            SELECT 
                a.*,
                COUNT(p.id) AS actual_property_count
            FROM areas a
            LEFT JOIN properties p ON a.id = p.area_id AND p.status = 'available'
            WHERE a.id = $1
            GROUP BY a.id
        `, [id]);

        if (result.rows.length === 0) {
            return notFound(res, 'المنطقة غير موجودة');
        }

        return success(res, result.rows[0], 'تم جلب المنطقة');

    } catch (err) {
        console.error('❌ خطأ في getAreaById:', err);
        return error(res, err.message);
    }
};

// ============================================================
// 3. إحصائيات المناطق
// ============================================================
const getAreaStats = async (req, res) => {
    try {
        const result = await db.query(`
            SELECT 
                governorate,
                city,
                COUNT(*) AS total_areas,
                SUM(property_count) AS total_properties,
                ROUND(AVG(avg_price), 2) AS avg_price
            FROM areas
            GROUP BY governorate, city
            ORDER BY total_properties DESC
        `);

        return success(res, result.rows, 'تم جلب الإحصائيات');

    } catch (err) {
        console.error('❌ خطأ في getAreaStats:', err);
        return error(res, err.message);
    }
};

module.exports = {
    getAllAreas,
    getAreaById,
    getAreaStats
};
