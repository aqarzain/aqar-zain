// ============================================================
// Estimate Controller - تقدير الأسعار بالذكاء الاصطناعي
// ============================================================

const db = require('../config/database');
const { success, error, notFound } = require('../utils/response');

// ============================================================
// 1. تقدير سعر عقار جديد
// ============================================================
const estimatePrice = async (req, res) => {
    try {
        const {
            category,
            listing_type,
            area_id,
            area_sqm,
            bedrooms = 0,
            bathrooms = 1,
            floor_number = 0,
            total_floors = 1,
            finishing_type = 'تشطيب عادي',
            has_gas = false,
            has_elevator = false,
            is_furnished = false,
            has_garden = false,
            has_pool = false,
            has_parking = false,
            quality_rating = 3,
            is_commercial_facade = false
        } = req.body;

        // التحقق من البيانات المطلوبة
        if (!category || !listing_type || !area_id || !area_sqm) {
            return error(res, 'الحقول المطلوبة: category, listing_type, area_id, area_sqm', 400);
        }

        // استخدام النموذج المناسب
        let query;
        let params;

        if (category === 'محل') {
            // استخدام V13 للمحلات
            query = `
                SELECT ai_estimate_price_v13(
                    $1, $2, $3, $4, $5, $6, $7, $8, $9,
                    $10, $11, $12, $13, $14, $15, 0, $16, $17
                ) AS prediction
            `;
            params = [
                category, listing_type, area_id, area_sqm,
                bedrooms, bathrooms, floor_number, total_floors,
                finishing_type, has_gas, has_elevator, is_furnished,
                has_garden, has_pool, has_parking,
                quality_rating, is_commercial_facade
            ];
        } else {
            // استخدام V11 لبقية العقارات
            query = `
                SELECT ai_estimate_price_v11(
                    $1, $2, $3, $4, $5, $6, $7, $8, $9,
                    $10, $11, $12, $13, $14, $15, 0, $16
                ) AS prediction
            `;
            params = [
                category, listing_type, area_id, area_sqm,
                bedrooms, bathrooms, floor_number, total_floors,
                finishing_type, has_gas, has_elevator, is_furnished,
                has_garden, has_pool, has_parking, quality_rating
            ];
        }

        const result = await db.query(query, params);

        return success(res, result.rows[0].prediction, 'تم تقدير السعر بنجاح');

    } catch (err) {
        console.error('❌ خطأ في estimatePrice:', err);
        return error(res, err.message);
    }
};

// ============================================================
// 2. تقدير سعر عقار موجود
// ============================================================
const estimateExistingProperty = async (req, res) => {
    try {
        const { id } = req.params;

        // الحصول على بيانات العقار
        const propResult = await db.query(`
            SELECT 
                id, category, listing_type, area_id, area_sqm,
                bedrooms, bathrooms, floor_number, total_floors,
                finishing_type, has_gas, has_elevator, is_furnished,
                has_garden, has_pool, has_parking, quality_rating, price AS current_price
            FROM properties
            WHERE id = $1
        `, [id]);

        if (propResult.rows.length === 0) {
            return notFound(res, 'العقار غير موجود');
        }

        const p = propResult.rows[0];

        // استخدام ai_estimate_existing_property
        const result = await db.query(
            'SELECT ai_estimate_existing_property($1, $2) AS prediction',
            [id, p.current_price]
        );

        return success(res, result.rows[0].prediction, 'تم تقدير السعر بنجاح');

    } catch (err) {
        console.error('❌ خطأ في estimateExistingProperty:', err);
        return error(res, err.message);
    }
};

module.exports = {
    estimatePrice,
    estimateExistingProperty
};
