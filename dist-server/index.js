import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';
import { pool } from './db.js';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const app = express();
const PORT = process.env.PORT || 8080;
app.use(cors());
app.use(express.json());
// Initialize Database Schema
async function initDb() {
    try {
        const schemaSql = fs.readFileSync(path.join(__dirname, '../database/schema.sql'), 'utf-8');
        await pool.query(schemaSql);
        console.log('Database schema initialized.');
    }
    catch (error) {
        console.error('Error initializing database schema:', error);
    }
}
// Ensure the schema is created on startup
initDb();
// API ROUTES
app.post('/api/auth/handshake', async (req, res) => {
    const { token } = req.body;
    if (!token) {
        return res.status(400).json({ error: 'Token is required' });
    }
    // In a real application, you might validate the token against an external service here.
    // For this exercise, we treat the token itself as the user_id (or derive one).
    // The requirement says: API returns a user_id, and users table ID must match it.
    const user_id = token;
    const client = await pool.connect();
    try {
        await client.query('BEGIN');
        // Check if user exists
        const userRes = await client.query('SELECT * FROM users WHERE id = $1', [user_id]);
        if (userRes.rows.length === 0) {
            // Initialize user
            await client.query('INSERT INTO users (id) VALUES ($1)', [user_id]);
        }
        await client.query('COMMIT');
        res.json({ user_id });
    }
    catch (err) {
        await client.query('ROLLBACK');
        console.error('Handshake error:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
    finally {
        client.release();
    }
});
app.get('/api/notes', async (req, res) => {
    const userId = req.headers['x-user-id'];
    if (!userId) {
        return res.status(401).json({ error: 'Unauthorized' });
    }
    try {
        const result = await pool.query('SELECT note_text FROM mirror_notes WHERE user_id = $1 ORDER BY created_at ASC', [userId]);
        res.json(result.rows.map(row => row.note_text));
    }
    catch (error) {
        console.error('Error fetching notes:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});
app.post('/api/notes', async (req, res) => {
    const userId = req.headers['x-user-id'];
    const { notes } = req.body;
    if (!userId) {
        return res.status(401).json({ error: 'Unauthorized' });
    }
    if (!Array.isArray(notes)) {
        return res.status(400).json({ error: 'Notes must be an array' });
    }
    const client = await pool.connect();
    try {
        await client.query('BEGIN');
        // Clear existing notes for user to replace with new state (based on frontend logic)
        // The frontend sends the full array of notes to save
        await client.query('DELETE FROM mirror_notes WHERE user_id = $1', [userId]);
        for (const text of notes) {
            await client.query('INSERT INTO mirror_notes (user_id, note_text) VALUES ($1, $2)', [userId, text]);
        }
        await client.query('COMMIT');
        res.json({ success: true });
    }
    catch (err) {
        await client.query('ROLLBACK');
        console.error('Error saving notes:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
    finally {
        client.release();
    }
});
// STATIC FILES & SPA FALLBACK
// Serve the static files from the React app if in production
const distPath = path.join(__dirname, '../dist');
app.use('/the-appreciation-mirror', express.static(distPath));
app.use('/the-appreciation-mirror', (req, res) => {
    res.sendFile(path.join(distPath, 'index.html'));
});
// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
