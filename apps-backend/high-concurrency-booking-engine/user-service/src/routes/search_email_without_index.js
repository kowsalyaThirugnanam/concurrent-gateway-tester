import pool from '../db.js';

const searchEmailWithoutIndexRoute = (app) => (req, res) => {
    const { email } = req.query;
    if (!email) {
        return res.status(400).json({ error: 'Email query parameter is required' });
    }
    const start = performance.now();
    const queryText = 'SELECT user_uuid, name, email, role FROM users_test WHERE email = $1';

    pool.query(queryText, [email], (err, result) => {
        const end = performance.now();
        const duration = end - start;
        console.log(`⏱️ Search Duration: ${end - start} ms`);
        if (err) {
            console.error('❌ Error occurred while searching for user:', err.message);
            return res.status(500).json({ error: 'Internal Server Error' });
        }
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'User not found' });
        }
        res.json({
            status: 'success',
            database_scan_time_ms: `${duration}ms`,
            data: result.rows[0]
        });
    });
}

export default searchEmailWithoutIndexRoute;
