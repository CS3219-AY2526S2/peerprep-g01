const db = require('../config/db');

exports.listAdmins = async (req, res) => {
    // 1. Add default values (|| 1 and || 10) to prevent ReferenceErrors
    const page = parseInt(req.query.page) || 1;
    const pageSize = parseInt(req.query.pageSize) || 10;
    const offset = (page - 1) * pageSize;

    try {
        // 2. Fixed "ORDER BY" and ensured "user" is quoted
        const result = await db.query(
            'SELECT "userId", "userName", "email", "createdAt" FROM "user" WHERE role IN (\'2\', \'3\') ORDER BY "createdAt" DESC LIMIT $1 OFFSET $2',
            [pageSize, offset]
        );

        // 3. Ensured "user" table is quoted for consistency
        const totalResult = await db.query(
            'SELECT COUNT(*) FROM "user" WHERE role IN (\'2\', \'3\')'
        );
        
        // 4. Fixed typo: parstInt -> parseInt
        const total = parseInt(totalResult.rows[0].count);

        res.status(200).json({
            data: result.rows,
            pagination: {
                total,
                page,
                pageSize,
                totalPages: Math.ceil(total / pageSize)
            }
        });
    } catch (err) {
        // Log the actual error to your VS Code console so you can see SQL mistakes
        console.error(err); 
        res.status(500).json({ error: "Database error", details: err.message });
    }
};

exports.createAdmin = async(req, res) => {
    
}