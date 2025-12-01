const express = require('express');
const multer = require('multer');
const path = require('path');
const { db_helpers } = require('./database');
const { verifyToken } = require('./auth');

const router = express.Router();

// Configure multer for image uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, path.join(__dirname, 'uploads'));
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + path.extname(file.originalname));
    }
});

const upload = multer({
    storage: storage,
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
    fileFilter: (req, file, cb) => {
        const allowedTypes = /jpeg|jpg|png|webp|gif/;
        const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
        const mimetype = allowedTypes.test(file.mimetype);

        if (mimetype && extname) {
            return cb(null, true);
        } else {
            cb(new Error('Only image files are allowed!'));
        }
    }
});

// Public routes - Get portfolio data
router.get('/about', (req, res) => {
    try {
        const about = db_helpers.getAbout();
        res.json(about || {});
    } catch (error) {
        console.error('Error fetching about:', error);
        res.status(500).json({ error: 'Failed to fetch about section' });
    }
});

router.get('/work', (req, res) => {
    try {
        const work = db_helpers.getAllWork();
        res.json(work);
    } catch (error) {
        console.error('Error fetching work:', error);
        res.status(500).json({ error: 'Failed to fetch work experience' });
    }
});

router.get('/publications', (req, res) => {
    try {
        const publications = db_helpers.getAllPublications();
        res.json(publications);
    } catch (error) {
        console.error('Error fetching publications:', error);
        res.status(500).json({ error: 'Failed to fetch publications' });
    }
});

router.get('/contact', (req, res) => {
    try {
        const contact = db_helpers.getContact();
        res.json(contact || {});
    } catch (error) {
        console.error('Error fetching contact:', error);
        res.status(500).json({ error: 'Failed to fetch contact info' });
    }
});

// Get all portfolio data at once
router.get('/all', (req, res) => {
    try {
        const data = {
            about: db_helpers.getAbout() || {},
            work: db_helpers.getAllWork(),
            publications: db_helpers.getAllPublications(),
            contact: db_helpers.getContact() || {}
        };
        res.json(data);
    } catch (error) {
        console.error('Error fetching portfolio data:', error);
        res.status(500).json({ error: 'Failed to fetch portfolio data' });
    }
});

// Protected routes - Update portfolio data (requires authentication)
router.put('/about', verifyToken, (req, res) => {
    try {
        const result = db_helpers.updateAbout(req.body);
        res.json({ success: true, message: 'About section updated successfully' });
    } catch (error) {
        console.error('Error updating about:', error);
        res.status(500).json({ error: 'Failed to update about section' });
    }
});

router.post('/work', verifyToken, (req, res) => {
    try {
        const result = db_helpers.createWork(req.body);
        res.json({ success: true, id: result.lastInsertRowid, message: 'Work experience added successfully' });
    } catch (error) {
        console.error('Error creating work:', error);
        res.status(500).json({ error: 'Failed to add work experience' });
    }
});

router.put('/work/:id', verifyToken, (req, res) => {
    try {
        const result = db_helpers.updateWork(req.params.id, req.body);
        res.json({ success: true, message: 'Work experience updated successfully' });
    } catch (error) {
        console.error('Error updating work:', error);
        res.status(500).json({ error: 'Failed to update work experience' });
    }
});

router.delete('/work/:id', verifyToken, (req, res) => {
    try {
        const result = db_helpers.deleteWork(req.params.id);
        res.json({ success: true, message: 'Work experience deleted successfully' });
    } catch (error) {
        console.error('Error deleting work:', error);
        res.status(500).json({ error: 'Failed to delete work experience' });
    }
});

router.post('/publications', verifyToken, (req, res) => {
    try {
        const result = db_helpers.createPublication(req.body);
        res.json({ success: true, id: result.lastInsertRowid, message: 'Publication added successfully' });
    } catch (error) {
        console.error('Error creating publication:', error);
        res.status(500).json({ error: 'Failed to add publication' });
    }
});

router.put('/publications/:id', verifyToken, (req, res) => {
    try {
        const result = db_helpers.updatePublication(req.params.id, req.body);
        res.json({ success: true, message: 'Publication updated successfully' });
    } catch (error) {
        console.error('Error updating publication:', error);
        res.status(500).json({ error: 'Failed to update publication' });
    }
});

router.delete('/publications/:id', verifyToken, (req, res) => {
    try {
        const result = db_helpers.deletePublication(req.params.id);
        res.json({ success: true, message: 'Publication deleted successfully' });
    } catch (error) {
        console.error('Error deleting publication:', error);
        res.status(500).json({ error: 'Failed to delete publication' });
    }
});

router.put('/contact', verifyToken, (req, res) => {
    try {
        const result = db_helpers.updateContact(req.body);
        res.json({ success: true, message: 'Contact info updated successfully' });
    } catch (error) {
        console.error('Error updating contact:', error);
        res.status(500).json({ error: 'Failed to update contact info' });
    }
});

// Image upload endpoint
router.post('/upload', verifyToken, upload.single('image'), (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: 'No file uploaded' });
        }

        const imageUrl = `/uploads/${req.file.filename}`;
        res.json({ success: true, url: imageUrl });
    } catch (error) {
        console.error('Error uploading image:', error);
        res.status(500).json({ error: 'Failed to upload image' });
    }
});

module.exports = router;
