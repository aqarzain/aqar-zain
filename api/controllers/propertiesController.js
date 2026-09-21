// ============================================================
// Properties Controller - منطق العقارات (محدث)
// ============================================================

const db = require('../config/database');
const { success, error, notFound, paginated } = require('../utils/response');

// خريطة الترتيب المسموح بها (آمنة ضد SQL Injection)
const SORT_MAP = {
  newest: 'p.created_at DESC',
  oldest: 'p.created_at ASC',
  price_asc: 'p.price ASC NULLS LAST',
  price_desc: 'p.price DESC NULLS LAST',
  area_asc: 'p.area_sqm ASC NULLS LAST',
  area_desc: 'p.area_sqm DESC NULLS LAST',
  views_desc: 'p.views_count DESC',
};

// ============================================================
// 1. الحصول على جميع العقارات (مع فلاتر وترقيم وترتيب)
// ============================================================
const getAllProperties = async (req, res) => {
  try {
    const {
      category,
      type,                 // alias لـ category
      listing_type,
      offer,                // alias لـ listing_type
      area_id,
      area,                 // alias لـ area_id
      min_price,
      max_price,
      bedrooms,
      rooms,                // alias لـ bedrooms
      finishing_type,
      sort = 'newest',
      page = 1,
      limit = 12,
      q,                    // بحث نصي
    } = req.query;

    // دمج الـ aliases
    const finalCategory = category || type;
    const finalListingType = listing_type || offer;
    const finalAreaId = area_id || area;
    const finalBedrooms = bedrooms || rooms;

    const pageNum = Math.max(1, parseInt(page) || 1);
    const limitNum = Math.min(100, Math.max(1, parseInt(limit) || 12));
    const offset = (pageNum - 1) * limitNum;

    // بناء الشروط
    const conditions = ["p.status = 'available'"];
    const params = [];
    let paramCount = 0;

    if (finalCategory) {
      paramCount++;
      conditions.push(`p.category = $${paramCount}`);
      params.push(finalCategory);
    }

    if (finalListingType) {
      paramCount++;
      conditions.push(`p.listing_type = $${paramCount}`);
      params.push(finalListingType);
    }

    if (finalAreaId) {
      paramCount++;
      conditions.push(`p.area_id = $${paramCount}`);
      params.push(parseInt(finalAreaId));
    }

    if (min_price) {
      paramCount++;
      conditions.push(`p.price >= $${paramCount}`);
      params.push(parseFloat(min_price));
    }

    if (max_price) {
      paramCount++;
      conditions.push(`p.price <= $${paramCount}`);
      params.push(parseFloat(max_price));
    }

    if (finalBedrooms) {
      paramCount++;
      conditions.push(`p.bedrooms >= $${paramCount}`);
      params.push(parseInt(finalBedrooms));
    }

    if (finishing_type) {
      paramCount++;
      conditions.push(`p.finishing_type = $${paramCount}`);
      params.push(finishing_type);
    }

    if (q) {
      paramCount++;
      conditions.push(`(p.title ILIKE $${paramCount} OR p.description ILIKE $${paramCount})`);
      params.push(`%${q}%`);
    }

    const whereClause = conditions.join(' AND ');

    // الاستعلام الأساسي
    const baseSelect = `
      SELECT
        p.id, p.category, p.listing_type, p.title, p.description,
        p.area_sqm, p.bedrooms, p.bathrooms, p.floor_number, p.total_floors,
        p.finishing_type, p.price, p.price_is_negotiable,
        p.has_gas, p.has_elevator, p.has_parking, p.is_furnished,
        p.status, p.views_count, p.phone_clicks,
        p.phone_contact, p.whatsapp_contact, p.quality_rating,
        p.is_featured, p.created_at, p.updated_at,
        a.id AS area_id, a.locality AS area_name, a.city,
        a.administrative_area AS district, a.governorate,
        (
          SELECT json_agg(json_build_object(
            'id', pm.id,
            'media_url', pm.media_url,
            'media_type', pm.media_type,
            'is_primary', pm.is_primary
          ) ORDER BY pm.is_primary DESC, pm.id ASC)
          FROM property_media pm
          WHERE pm.property_id = p.id AND pm.is_deleted = FALSE
        ) AS media
      FROM properties p
      LEFT JOIN areas a ON p.area_id = a.id
      WHERE ${whereClause}
    `;

    // عدد النتائج الكلي
    const countQuery = `SELECT COUNT(*)::int AS total FROM properties p WHERE ${whereClause}`;
    const countResult = await db.query(countQuery, params);
    const total = countResult.rows[0].total;

    // الترتيب والترقيم
    const orderBy = SORT_MAP[sort] || SORT_MAP.newest;

    paramCount++;
    const limitParam = `$${paramCount}`;
    params.push(limitNum);

    paramCount++;
    const offsetParam = `$${paramCount}`;
    params.push(offset);

    const finalQuery = `${baseSelect} ORDER BY ${orderBy} LIMIT ${limitParam} OFFSET ${offsetParam}`;
    const result = await db.query(finalQuery, params);

    return paginated(res, result.rows, pageNum, limitNum, total);
  } catch (err) {
    console.error('❌ خطأ في getAllProperties:', err);
    return error(res, err.message, 500);
  }
};

// ============================================================
// 2. الحصول على عقار محدد
// ============================================================
const getPropertyById = async (req, res) => {
  try {
    const { id } = req.params;
    const { track = 'true' } = req.query;

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

    const media = await db.query(
      'SELECT * FROM property_media WHERE property_id = $1 AND is_deleted = FALSE ORDER BY is_primary DESC, id ASC',
      [id]
    );

    const features = await db.query(`
      SELECT f.id, f.name_ar, f.name_en, f.icon, pf.value
      FROM property_features pf
      JOIN features f ON pf.feature_id = f.id
      WHERE pf.property_id = $1
    `, [id]);

    // زيادة المشاهدات (اختياري)
    if (track !== 'false') {
      await db.query(
        'UPDATE properties SET views_count = views_count + 1, last_viewed_at = NOW() WHERE id = $1',
        [id]
      );
    }

    const property = {
      ...result.rows[0],
      media: media.rows,
      features: features.rows,
    };

    return success(res, property, 'تم جلب العقار بنجاح');
  } catch (err) {
    console.error('❌ خطأ في getPropertyById:', err);
    return error(res, err.message, 500);
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
      area_id, client_id, phone_contact, whatsapp_contact,
    } = req.body;

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
      area_id, client_id, phone_contact, whatsapp_contact,
    ]);

    return success(res, result.rows[0], 'تم إضافة العقار بنجاح', 201);
  } catch (err) {
    console.error('❌ خطأ في createProperty:', err);
    return error(res, err.message, 500);
  }
};

// ============================================================
// 4. تحديث عقار
// ============================================================
const updateProperty = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const check = await db.query('SELECT id FROM properties WHERE id = $1', [id]);
    if (check.rows.length === 0) {
      return notFound(res, 'العقار غير موجود');
    }

    const allowedFields = [
      'title', 'description', 'price', 'area_sqm', 'bedrooms',
      'bathrooms', 'floor_number', 'total_floors', 'finishing_type',
      'has_gas', 'has_elevator', 'has_parking', 'is_furnished',
      'status', 'quality_rating', 'phone_contact', 'whatsapp_contact',
      'price_is_negotiable', 'is_featured',
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
    return error(res, err.message, 500);
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
    return error(res, err.message, 500);
  }
};

// ============================================================
// 6. إحصائيات العقارات
// ============================================================
const getPropertyStats = async (req, res) => {
  try {
    const result = await db.query(`
      SELECT
        COUNT(*)::int AS total,
        COUNT(*) FILTER (WHERE listing_type = 'بيع')::int AS for_sale,
        COUNT(*) FILTER (WHERE listing_type = 'إيجار')::int AS for_rent,
        COUNT(*) FILTER (WHERE category = 'شقة')::int AS apartments,
        COUNT(*) FILTER (WHERE category = 'منزل')::int AS houses,
        COUNT(*) FILTER (WHERE category = 'فيلا')::int AS villas,
        COUNT(*) FILTER (WHERE category = 'أرض')::int AS lands,
        COUNT(*) FILTER (WHERE category = 'محل')::int AS shops,
        COUNT(*) FILTER (WHERE category = 'مكتب')::int AS offices,
        COALESCE(ROUND(AVG(price), 2), 0) AS avg_price,
        COALESCE(MIN(price), 0) AS min_price,
        COALESCE(MAX(price), 0) AS max_price
      FROM properties
      WHERE status = 'available'
    `);

    return success(res, result.rows[0], 'تم جلب الإحصائيات');
  } catch (err) {
    console.error('❌ خطأ في getPropertyStats:', err);
    return error(res, err.message, 500);
  }
};

module.exports = {
  getAllProperties,
  getPropertyById,
  createProperty,
  updateProperty,
  deleteProperty,
  getPropertyStats,
};
