const db = require('../config/db');

exports.listAdmins = async (req, res) => {

    const page = parseInt(req.query.page) || 1;
    const pageSize = parseInt(req.query.pageSize) || 10;
    const offset = (page - 1) * pageSize;

    try {
        const result = await db.query(
            'SELECT "userId", "userName", "email", "createdAt" FROM "user" WHERE role IN (\'2\', \'3\') ORDER BY "createdAt" DESC LIMIT $1 OFFSET $2',
            [pageSize, offset]
        );

        const totalResult = await db.query(
            'SELECT COUNT(*) FROM "user" WHERE role IN (\'2\', \'3\')'
        );
        
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
        console.error(err); 
        res.status(500).json({ error: "Database error", details: err.message });
    }
};

exports.createAdmin = async(req, res) => {
    const { email } = req.body;
    const invitedBy = 'a0000000-0000-0000-0000-000000000001';

    if(!email) {
        return res.status(400).json({error: "Email is required"});
    }
    try {
        const userResult = await db.query(
            'SELECT "userId", "role" FROM "user" WHERE LOWER(email) = LOWER($1)',
            [email]
        );

        if (userResult.rowCount === 0) {
            return res.status(400).json({error: "User not found. Please ask user to register an account"});
        }

        const targetUser = userResult.rows[0];

        if(targetUser.role === '2' || targetUser.role === '3') {
            return res.status(400).json({error: "User is already an Admin"})
        }

        await db.query('BEGIN');

        await db.query('UPDATE "user" SET role = \'2\' WHERE "userId" = $1', [targetUser.userId]);

        await db.query(`INSERT INTO "admin_authorisation" (email, "userId", "invited_by") 
                        VALUES (LOWER($1), $2, $3)`, [email, targetUser.userId, invitedBy]);

        await db.query('COMMIT');

        return res.status(200).json({ 
            message: `User ${email} has been successfully promoted to Admin.` 
        });

    } catch (err) {
        // If anything fails, rollback the database changes
        await db.query('ROLLBACK');
        console.error("Promotion Error:", err);

        // Handle unique constraint violation (if email is somehow already in admin_authorisation)
        if (err.code === '23505') {
            return res.status(400).json({ error: "This user is already in the authorisation list." });
        }

        return res.status(500).json({ error: "Internal server error." });
    }
    
};
