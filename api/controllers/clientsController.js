// ============================================================
// Clients Controller - منطق العملاء
// ============================================================

const db = require('../config/database');
const { success, error, notFound } = require('../utils/response');

// 1. جميع العملاء
const getAllClients = async (req, res) => {
    try {
        const result = await db.query(`
            SELECT 
                c.id, c.name, c.phone, c.phone2, c.is_owner,
                c.is_agent, c.is_verified, c.rating, c.total_listings,
                c.created_at,
                COUNT(p.id) AS actual_listings
            FROM clients c
            LEFT JOIN properties p ON c.id = p.client_id AND p.status = 'available'
            GROUP BY c.id
            ORDER BY c.created_at DESC
        `);

        return success(res, result.rows, 'تم جلب العملاء');

    } catch (err) {
        return error(res, err.message);
    }
};

// 2. عميل محدد
const getClientById = async (req, res) => {
    try {
        const { id } = req.params;

        const result = await db.query(
            'SELECT * FROM clients WHERE id = $1',
            [id]
        );

        if (result.rows.length === 0) {
            return notFound(res, 'العميل غير موجود');
        }

        // عقارات العميل
        const properties = await db.query(`
            SELECT id, title, category, listing_type, price, status
            FROM properties
            WHERE client_id = $1
            ORDER BY created_at DESC
        `, [id]);

        return success(res, {
            ...result.rows[0],
            properties: properties.rows
        }, 'تم جلب العميل');

    } catch (err) {
        return error(res, err.message);
    }
};

module.exports = { getAllClients, getClientById };
