const Database = require('better-sqlite3');
const path = require('path');

const dbPath = path.join(__dirname, 'portfolio.db');
const db = new Database(dbPath);

// Initialize database tables
db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS about (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    subtitle TEXT,
    description TEXT NOT NULL,
    image_url TEXT,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS work_experience (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    company TEXT NOT NULL,
    period TEXT,
    description TEXT NOT NULL,
    skills TEXT,
    image_url TEXT,
    display_order INTEGER DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS publications (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    publisher TEXT,
    year INTEGER,
    description TEXT,
    url TEXT,
    image_url TEXT,
    display_order INTEGER DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS contact (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    email TEXT,
    github TEXT,
    linkedin TEXT,
    instagram TEXT,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );
`);

// Database helper functions
const db_helpers = {
    // About section
    getAbout: () => {
        return db.prepare('SELECT * FROM about ORDER BY id DESC LIMIT 1').get();
    },

    updateAbout: (data) => {
        const { title, subtitle, description, image_url } = data;
        const existing = db.prepare('SELECT id FROM about LIMIT 1').get();

        if (existing) {
            return db.prepare(`
        UPDATE about 
        SET title = ?, subtitle = ?, description = ?, image_url = ?, updated_at = CURRENT_TIMESTAMP
        WHERE id = ?
      `).run(title, subtitle, description, image_url, existing.id);
        } else {
            return db.prepare(`
        INSERT INTO about (title, subtitle, description, image_url)
        VALUES (?, ?, ?, ?)
      `).run(title, subtitle, description, image_url);
        }
    },

    // Work experience
    getAllWork: () => {
        return db.prepare('SELECT * FROM work_experience ORDER BY display_order, id DESC').all();
    },

    getWorkById: (id) => {
        return db.prepare('SELECT * FROM work_experience WHERE id = ?').get(id);
    },

    createWork: (data) => {
        const { title, company, period, description, skills, image_url, display_order } = data;
        return db.prepare(`
      INSERT INTO work_experience (title, company, period, description, skills, image_url, display_order)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `).run(title, company, period, description, skills, image_url, display_order || 0);
    },

    updateWork: (id, data) => {
        const { title, company, period, description, skills, image_url, display_order } = data;
        return db.prepare(`
      UPDATE work_experience 
      SET title = ?, company = ?, period = ?, description = ?, skills = ?, image_url = ?, display_order = ?, updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `).run(title, company, period, description, skills, image_url, display_order, id);
    },

    deleteWork: (id) => {
        return db.prepare('DELETE FROM work_experience WHERE id = ?').run(id);
    },

    // Publications
    getAllPublications: () => {
        return db.prepare('SELECT * FROM publications ORDER BY display_order, year DESC').all();
    },

    getPublicationById: (id) => {
        return db.prepare('SELECT * FROM publications WHERE id = ?').get(id);
    },

    createPublication: (data) => {
        const { title, publisher, year, description, url, image_url, display_order } = data;
        return db.prepare(`
      INSERT INTO publications (title, publisher, year, description, url, image_url, display_order)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `).run(title, publisher, year, description, url, image_url, display_order || 0);
    },

    updatePublication: (id, data) => {
        const { title, publisher, year, description, url, image_url, display_order } = data;
        return db.prepare(`
      UPDATE publications 
      SET title = ?, publisher = ?, year = ?, description = ?, url = ?, image_url = ?, display_order = ?, updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `).run(title, publisher, year, description, url, image_url, display_order, id);
    },

    deletePublication: (id) => {
        return db.prepare('DELETE FROM publications WHERE id = ?').run(id);
    },

    // Contact
    getContact: () => {
        return db.prepare('SELECT * FROM contact ORDER BY id DESC LIMIT 1').get();
    },

    updateContact: (data) => {
        const { email, github, linkedin, instagram } = data;
        const existing = db.prepare('SELECT id FROM contact LIMIT 1').get();

        if (existing) {
            return db.prepare(`
        UPDATE contact 
        SET email = ?, github = ?, linkedin = ?, instagram = ?, updated_at = CURRENT_TIMESTAMP
        WHERE id = ?
      `).run(email, github, linkedin, instagram, existing.id);
        } else {
            return db.prepare(`
        INSERT INTO contact (email, github, linkedin, instagram)
        VALUES (?, ?, ?, ?)
      `).run(email, github, linkedin, instagram);
        }
    },

    // User management
    getUserByUsername: (username) => {
        return db.prepare('SELECT * FROM users WHERE username = ?').get(username);
    },

    createUser: (username, hashedPassword) => {
        return db.prepare('INSERT INTO users (username, password) VALUES (?, ?)').run(username, hashedPassword);
    }
};

module.exports = { db, db_helpers };
