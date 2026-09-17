// ============================================================
// Search Controller - البحث المتقدم
// ============================================================

const db = require('../config/database');
const { success, error } = require('../utils/response');

// ============================================================
// 1. البحث بالنص
// ============================================================
const searchByText = async (req, res) => {
    try {
        const {
            q: search_text,
            category,
            listing_type,
            min_price,
            max_price,
            area_id,
            min_area,
            max_area,
            bedrooms,
            limit = 50
        } = req.query;

        const result = await db.query(`
            SELECT * FROM search_properties(
                $1, $2, $3, $4, $5, $6, $7, $8, $9, NULL, NULL, NULL, $10
            )
        `, [
            search_text || null,
            category || null,
            listing_type || null,
            min_price || null,
            max_price || null,
            area_id || null,
            min_area || null,
            max_area || null,
            bedrooms || null,
            limit
        ]);

        return success(res, result.rows, `تم العثور على ${result.rows.length} عقار`);

    } catch (err) {
        console.error('❌ خطأ في searchByText:', err);
        return error(res, err.message);
    }
};

// ============================================================
// 2. البحث الذكي (بالكيانات)
// ============================================================
const smartSearch = async (req, res) => {
    try {
        const entities = req.body;

        const result = await db.query(
            'SELECT search_properties_by_entities($1::jsonb) AS results',
            [JSON.stringify(entities)]
        );

        return success(res, result.rows[0].results, 'تم البحث بنجاح');

    } catch (err) {
        console.error('❌ خطأ في smartSearch:', err);
        return error(res, err.message);
    }
};

// ============================================================
// 3. استخراج كيانات من نص
// ============================================================
const extractEntities = async (req, res) => {
    try {
        const { text } = req.body;

        if (!text) {
            return error(res, 'النص مطلوب', 400);
        }

        const result = await db.query(
            'SELECT extract_entities($1) AS entities',
            [text]
        );

        return success(res, result.rows[0].entities, 'تم الاستخراج بنجاح');

    } catch (err) {
        console.error('❌ خطأ في extractEntities:', err);
        return error(res, err.message);
    }
};

module.exports = {
    searchByText,
    smartSearch,
    extractEntities
};
