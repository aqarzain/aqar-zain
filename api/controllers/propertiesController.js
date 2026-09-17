// ============================================================
// Properties Controller - منطق العقارات
// ============================================================

const db = require('../config/database');
const { success, error, notFound, paginated } = require('../utils/response');

// ============================================================
// 1. الحصول على جميع العقارات
// ============================================================
const getAllProperties = async (req, res) => {
    try {
        const {
            category,
            listing_type,
            area_id,
            min_price,
            max_price,
            bedrooms,
            page = 1,
            limit = 20
        } = req.query;

        const offset = (page - 1) * limit;

        // بناء الاستعلام
        let query = `
            SELECT 
                p.id, p.category, p.listing_type, p.title, p.description,
                p.area_sqm, p.bedrooms, p.bathrooms, p.floor_number,
                p.finishing_type, p.price, p.has_gas, p.has_elevator,
                p.has_parking, p.is_furnished, p.status, p.views_count,
                p.phone_contact, p.whatsapp_contact, p.quality_rating,
                p.created_at,
                a.id AS area_id, a.locality AS area_name, a.city,
                a.administrative_area AS district
            FROM properties p
            LEFT JOIN areas a ON p.area_id = a.id
            WHERE p.status = 'available'
        `;

        const params = [];
        let paramCount = 0;

        if (category) {
            paramCount++;
            query += ` AND p.category = $${paramCount}`;
            params.push(category);
        }

        if (listing_type) {
            paramCount++;
            query += ` AND p.listing_type = $${paramCount}`;
            params.push(listing_type);
        }

        if (area_id) {
            paramCount++;
            query += ` AND p.area_id = $${paramCount}`;
            params.push(area_id);
        }

        if (min_price) {
            paramCount++;
            query += ` AND p.price >= $${paramCount}`;
            params.push(min_price);
        }

        if (max_price) {
            paramCount++;
            query += ` AND p.price <= $${paramCount}`;
            params.push(max_price);
        }

        if (bedrooms) {
            paramCount++;
            query += ` AND p.bedrooms >= $${paramCount}`;
            params.push(bedrooms);
        }

        // العد الكلي
        const countQuery = `SELECT COUNT(*) FROM (${query}) AS count_query`;
        const countResult = await db.query(countQuery, params);
        const total = parseInt(countResult.rows[0].count);

        // إضافة الترتيب والترقيم
        query += ` ORDER BY p.created_at DESC LIMIT $${paramCount + 1} OFFSET $${paramCount + 2}`;
        params.push(limit, offset);

        const result = await db.query(query, params);

        return paginated(res, result.rows, page, limit, total);

    } catch (err) {
        console.error('❌ خطأ في getAllProperties:', err);
        return error(res, err.message);
    }
};

// ============================================================
// 2. الحصول على عقار محدد
// ============================================================
const getPropertyById = async (req, res) => {
    try {
        const { id } = req.params;

        const result = await db.query(`
            SELECT 
                p.*,
                a.id AS area_id, a.locality AS area_name, a.city,
                a.administrative_area AS district, a.governorate
            FROM properties p
            LEFT JOIN areas a ON p.area_id = a.id
            WHERE p.id = $1
        `, [id]);

        if (result.rows.length === 0) {
            return notFound(res, 'العقار غير موجود');
        }

        // الحصول على الصور
        const media = await db.query(
            'SELECT * FROM property_media WHERE property_id = $1 AND is_deleted = FALSE',
            [id]
        );

        // الحصول على المميزات
        const features = await db.query(`
            SELECT f.id, f.name_ar, f.name_en, f.icon, pf.value
            FROM property_features pf
            JOIN features f ON pf.feature_id = f.id
            WHERE pf.property_id = $1
        `, [id]);

        // زيادة عدد المشاهدات
        await db.query(
            'UPDATE properties SET views_count = views_count + 1 WHERE id = $1',
            [id]
        );

        const property = {
            ...result.rows[0],
            media: media.rows,
            features: features.rows
        };

        return success(res, property, 'تم جلب العقار بنجاح');

    } catch (err) {
        console.error('❌ خطأ في getPropertyById:', err);
        return error(res, err.message);
    }
};

// ============================================================
// 3. إضافة عقار جديد
// ============================================================
const createProperty = async (req, res) => {
    try {
        const {
            category, listing_type, title, description,
            area_sqm, bedrooms, bathrooms, floor_number, total_floors,
            finishing_type, price, price_is_negotiable,
            has_gas, has_elevator, has_parking, is_furnished,
            area_id, client_id, phone_contact, whatsapp_contact
        } = req.body;

        // التحقق من البيانات المطلوبة
        if (!category || !listing_type || !title) {
            return error(res, 'الحقول المطلوبة ناقصة: category, listing_type, title', 400);
        }

        const result = await db.query(`
            INSERT INTO properties (
                category, listing_type, title, description,
                area_sqm, bedrooms, bathrooms, floor_number, total_floors,
                finishing_type, price, price_is_negotiable,
                has_gas, has_elevator, has_parking, is_furnished,
                area_id, client_id, phone_contact, whatsapp_contact,
                status, source, quality_rating, created_at, updated_at
            ) VALUES (
                $1, $2, $3, $4, $5, $6, $7, $8, $9, $10,
                $11, $12, $13, $14, $15, $16, $17, $18, $19, $20,
                'available', 'الموقع', 3, NOW(), NOW()
            )
            RETURNING id, title, price
        `, [
            category, listing_type, title, description,
            area_sqm, bedrooms, bathrooms, floor_number, total_floors,
            finishing_type, price, price_is_negotiable || false,
            has_gas || false, has_elevator || false,
            has_parking || false, is_furnished || false,
            area_id, client_id, phone_contact, whatsapp_contact
        ]);

        return success(res, result.rows[0], 'تم إضافة العقار بنجاح', 201);

    } catch (err) {
        console.error('❌ خطأ في createProperty:', err);
        return error(res, err.message);
    }
};

// ============================================================
// 4. تحديث عقار
// ============================================================
const updateProperty = async (req, res) => {
    try {
        const { id } = req.params;
        const updates = req.body;

        // التحقق من وجود العقار
        const check = await db.query('SELECT id FROM properties WHERE id = $1', [id]);
        if (check.rows.length === 0) {
            return notFound(res, 'العقار غير موجود');
        }

        // بناء استعلام التحديث
        const allowedFields = [
            'title', 'description', 'price', 'area_sqm', 'bedrooms',
            'bathrooms', 'floor_number', 'total_floors', 'finishing_type',
            'has_gas', 'has_elevator', 'has_parking', 'is_furnished',
            'status', 'quality_rating', 'phone_contact', 'whatsapp_contact'
        ];

        const setClauses = [];
        const params = [];
        let paramCount = 0;

        for (const field of allowedFields) {
            if (updates[field] !== undefined) {
                paramCount++;
                setClauses.push(`${field} = $${paramCount}`);
                params.push(updates[field]);
            }
        }

        if (setClauses.length === 0) {
            return error(res, 'لا توجد حقول للتحديث', 400);
        }

        paramCount++;
        params.push(id);

        const result = await db.query(`
            UPDATE properties 
            SET ${setClauses.join(', ')}, updated_at = NOW()
            WHERE id = $${paramCount}
            RETURNING id, title, price, status
        `, params);

        return success(res, result.rows[0], 'تم تحديث العقار بنجاح');

    } catch (err) {
        console.error('❌ خطأ في updateProperty:', err);
        return error(res, err.message);
    }
};

// ============================================================
// 5. حذف عقار (soft delete)
// ============================================================
const deleteProperty = async (req, res) => {
    try {
        const { id } = req.params;

        const result = await db.query(`
            UPDATE properties 
            SET status = 'inactive', updated_at = NOW()
            WHERE id = $1
            RETURNING id, title
        `, [id]);

        if (result.rows.length === 0) {
            return notFound(res, 'العقار غير موجود');
        }

        return success(res, result.rows[0], 'تم حذف العقار بنجاح');

    } catch (err) {
        console.error('❌ خطأ في deleteProperty:', err);
        return error(res, err.message);
    }
};

// ============================================================
// 6. إحصائيات العقارات
// ============================================================
const getPropertyStats = async (req, res) => {
    try {
        const result = await db.query(`
            SELECT 
                COUNT(*) AS total,
                COUNT(*) FILTER (WHERE listing_type = 'بيع') AS for_sale,
                COUNT(*) FILTER (WHERE listing_type = 'إيجار') AS for_rent,
                COUNT(*) FILTER (WHERE category = 'شقة') AS apartments,
                COUNT(*) FILTER (WHERE category = 'منزل') AS houses,
                COUNT(*) FILTER (WHERE category = 'فيلا') AS villas,
                COUNT(*) FILTER (WHERE category = 'أرض') AS lands,
                COUNT(*) FILTER (WHERE category = 'محل') AS shops,
                ROUND(AVG(price), 2) AS avg_price,
                MIN(price) AS min_price,
                MAX(price) AS max_price
            FROM properties
            WHERE status = 'available'
        `);

        return success(res, result.rows[0], 'تم جلب الإحصائيات');

    } catch (err) {
        console.error('❌ خطأ في getPropertyStats:', err);
        return error(res, err.message);
    }
};

module.exports = {
    getAllProperties,
    getPropertyById,
    createProperty,
    updateProperty,
    deleteProperty,
    getPropertyStats
};
