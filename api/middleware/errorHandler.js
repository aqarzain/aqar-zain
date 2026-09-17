const errorHandler = (err, req, res, next) => {
    console.error('❌ خطأ:', err);
    
    if (err.code === '23505') {
        return res.status(409).json({ success: false, error: 'البيانات موجودة مسبقاً' });
    }
    
    if (err.code === '23503') {
        return res.status(400).json({ success: false, error: 'المرجع غير موجود' });
    }
    
    res.status(err.status || 500).json({
        success: false,
        error: err.message || 'حدث خطأ في السيرفر'
    });
};

const notFoundHandler = (req, res) => {
    res.status(404).json({
        success: false,
        error: 'المسار غير موجود',
        path: req.path
    });
};

module.exports = { errorHandler, notFoundHandler };
