const success = (res, data, message = 'نجح الطلب', statusCode = 200) => {
    return res.status(statusCode).json({ success: true, message, data });
};

const error = (res, message = 'حدث خطأ', statusCode = 500, details = null) => {
    return res.status(statusCode).json({
        success: false,
        error: message,
        ...(details && { details })
    });
};

const paginated = (res, data, page, limit, total) => {
    return res.status(200).json({
        success: true,
        data,
        pagination: {
            page: parseInt(page),
            limit: parseInt(limit),
            total,
            totalPages: Math.ceil(total / limit)
        }
    });
};

const notFound = (res, message = 'العنصر غير موجود') => {
    return res.status(404).json({ success: false, error: message });
};

const unauthorized = (res, message = 'غير مصرح بالوصول') => {
    return res.status(401).json({ success: false, error: message });
};

module.exports = { success, error, paginated, notFound, unauthorized };
