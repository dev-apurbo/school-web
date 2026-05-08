const express = require('express');
const multer = require('multer');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const { put, del } = require('@vercel/blob');

const app = express();
const PORT = 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname))); // Serve static files (HTML, CSS, JS)
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Ensure uploads directory exists
const uploadDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir);
}

// Data Storage (Using a simple JSON file to persist notice metadata)
const DATA_FILE = path.join(__dirname, 'notices.json');
let notices = [];

if (fs.existsSync(DATA_FILE)) {
    notices = JSON.parse(fs.readFileSync(DATA_FILE));
}

function saveNotices() {
    fs.writeFileSync(DATA_FILE, JSON.stringify(notices, null, 2));
}

// Multer Setup for File Uploads (Using Memory Storage for Vercel Blob)
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// API Endpoints
app.get('/api/notices', (req, res) => {
    res.json(notices);
});

app.post('/api/notices', upload.single('pdf'), async (req, res) => {
    const { title, date } = req.body;
    const file = req.file;

    if (!file) {
        return res.status(400).json({ error: 'No file uploaded' });
    }

    try {
        // Upload to Vercel Blob
        const blob = await put(`notices/${Date.now()}-${file.originalname}`, file.buffer, {
            access: 'public',
        });

        const newNotice = {
            id: Date.now(),
            title,
            date,
            fileUrl: blob.url,
            filename: file.originalname // Store original name for display
        };

        notices.unshift(newNotice);
        saveNotices();
        res.status(201).json(newNotice);
    } catch (error) {
        console.error('Blob upload error:', error);
        res.status(500).json({ error: 'Failed to upload PDF to blob storage' });
    }
});

// Update Notice Metadata
app.put('/api/notices/:id', upload.single('pdf'), async (req, res) => {
    const id = parseInt(req.params.id);
    const { title, date } = req.body;
    const noticeIndex = notices.findIndex(n => n.id === id);

    if (noticeIndex === -1) return res.status(404).json({ error: 'Notice not found' });

    try {
        notices[noticeIndex].title = title;
        notices[noticeIndex].date = date;

        // If a new file was uploaded, replace the old one
        if (req.file) {
            // Delete old blob if it exists
            if (notices[noticeIndex].fileUrl) {
                await del(notices[noticeIndex].fileUrl);
            }
            
            // Upload new blob
            const blob = await put(`notices/${Date.now()}-${req.file.originalname}`, req.file.buffer, {
                access: 'public',
            });
            
            notices[noticeIndex].filename = req.file.originalname;
            notices[noticeIndex].fileUrl = blob.url;
        }

        saveNotices();
        res.json(notices[noticeIndex]);
    } catch (error) {
        console.error('Blob update error:', error);
        res.status(500).json({ error: 'Failed to update notice in blob storage' });
    }
});

// Delete Specific Notice
app.delete('/api/notices/:id', async (req, res) => {
    const id = parseInt(req.params.id);
    const noticeIndex = notices.findIndex(n => n.id === id);

    if (noticeIndex === -1) return res.status(404).json({ error: 'Notice not found' });

    try {
        // Delete blob from Vercel Blob storage
        if (notices[noticeIndex].fileUrl) {
            await del(notices[noticeIndex].fileUrl);
        }

        notices.splice(noticeIndex, 1);
        saveNotices();
        res.json({ message: 'Notice deleted successfully' });
    } catch (error) {
        console.error('Blob delete error:', error);
        res.status(500).json({ error: 'Failed to delete PDF from blob storage' });
    }
});

app.delete('/api/notices', async (req, res) => {
    try {
        // Delete all blobs
        const deletePromises = notices
            .filter(n => n.fileUrl)
            .map(n => del(n.fileUrl));
        
        await Promise.all(deletePromises);
        
        notices = [];
        saveNotices();
        res.json({ message: 'All notices and files cleared' });
    } catch (error) {
        console.error('Blob clear error:', error);
        res.status(500).json({ error: 'Failed to clear all files from blob storage' });
    }
});

// Serve the landing page for the root route
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

if (process.env.NODE_ENV !== 'production' || !process.env.VERCEL) {
    app.listen(PORT, () => {
        console.log(`Server running at http://localhost:${PORT}`);
    });
}

module.exports = app;
