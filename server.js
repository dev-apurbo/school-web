const express = require('express');
const multer = require('multer');
const cors = require('cors');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = 3000;

// Middleware
app.use(cors());
app.use(express.json());
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

// Multer Setup for File Uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + '-' + file.originalname);
    }
});

const upload = multer({ storage: storage });

// API Endpoints
app.get('/api/notices', (req, res) => {
    res.json(notices);
});

app.post('/api/notices', upload.single('pdf'), (req, res) => {
    const { title, date } = req.body;
    const file = req.file;

    if (!file) {
        return res.status(400).json({ error: 'No file uploaded' });
    }

    const newNotice = {
        id: Date.now(),
        title,
        date,
        fileUrl: `http://localhost:${PORT}/uploads/${file.filename}`,
        filename: file.filename
    };

    notices.unshift(newNotice);
    saveNotices();
    res.status(201).json(newNotice);
});

// Update Notice Metadata
app.put('/api/notices/:id', upload.single('pdf'), (req, res) => {
    const id = parseInt(req.params.id);
    const { title, date } = req.body;
    const noticeIndex = notices.findIndex(n => n.id === id);

    if (noticeIndex === -1) return res.status(404).json({ error: 'Notice not found' });

    notices[noticeIndex].title = title;
    notices[noticeIndex].date = date;

    // If a new file was uploaded, replace the old one
    if (req.file) {
        const oldFilePath = path.join(__dirname, 'uploads', notices[noticeIndex].filename);
        if (fs.existsSync(oldFilePath)) fs.unlinkSync(oldFilePath);
        
        notices[noticeIndex].filename = req.file.filename;
        notices[noticeIndex].fileUrl = `http://localhost:${PORT}/uploads/${req.file.filename}`;
    }

    saveNotices();
    res.json(notices[noticeIndex]);
});

// Delete Specific Notice
app.delete('/api/notices/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const noticeIndex = notices.findIndex(n => n.id === id);

    if (noticeIndex === -1) return res.status(404).json({ error: 'Notice not found' });

    // Delete file from disk
    const filePath = path.join(__dirname, 'uploads', notices[noticeIndex].filename);
    if (fs.existsSync(filePath)) fs.unlinkSync(filePath);

    notices.splice(noticeIndex, 1);
    saveNotices();
    res.json({ message: 'Notice deleted successfully' });
});

app.delete('/api/notices', (req, res) => {
    // Delete all files and reset notices
    notices.forEach(notice => {
        const filePath = path.join(__dirname, 'uploads', notice.filename);
        if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
    });
    notices = [];
    saveNotices();
    res.json({ message: 'All notices cleared' });
});

app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
