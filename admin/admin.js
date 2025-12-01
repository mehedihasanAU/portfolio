// API Configuration
const API_BASE_URL = 'http://localhost:3000/api';
let authToken = localStorage.getItem('authToken');
let currentTargetInput = null;

// DOM Elements
const loginScreen = document.getElementById('loginScreen');
const adminDashboard = document.getElementById('adminDashboard');
const loginForm = document.getElementById('loginForm');
const loginError = document.getElementById('loginError');
const logoutBtn = document.getElementById('logoutBtn');
const adminUsername = document.getElementById('adminUsername');
const notification = document.getElementById('notification');

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    if (authToken) {
        verifyToken();
    } else {
        showLoginScreen();
    }

    setupEventListeners();
});

// Event Listeners
function setupEventListeners() {
    // Login
    loginForm.addEventListener('submit', handleLogin);
    logoutBtn.addEventListener('click', handleLogout);

    // Navigation
    document.querySelectorAll('.nav-btn').forEach(btn => {
        btn.addEventListener('click', () => switchSection(btn.dataset.section));
    });

    // Forms
    document.getElementById('aboutForm').addEventListener('submit', handleAboutSubmit);
    document.getElementById('workForm').addEventListener('submit', handleWorkSubmit);
    document.getElementById('publicationForm').addEventListener('submit', handlePublicationSubmit);
    document.getElementById('contactForm').addEventListener('submit', handleContactSubmit);

    // Modal buttons
    document.getElementById('addWorkBtn').addEventListener('click', () => openWorkModal());
    document.getElementById('addPublicationBtn').addEventListener('click', () => openPublicationModal());

    // Close modals
    document.querySelectorAll('.close').forEach(closeBtn => {
        closeBtn.addEventListener('click', () => {
            closeBtn.closest('.modal').classList.remove('active');
        });
    });

    // Image upload
    document.getElementById('imageUpload').addEventListener('change', handleImageUpload);
}

// Authentication
async function handleLogin(e) {
    e.preventDefault();

    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    try {
        const response = await fetch(`${API_BASE_URL}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password })
        });

        const data = await response.json();

        if (response.ok && data.success) {
            authToken = data.token;
            localStorage.setItem('authToken', authToken);
            adminUsername.textContent = data.user.username;
            showDashboard();
            loadAllData();
        } else {
            showError(loginError, data.error || 'Login failed');
        }
    } catch (error) {
        console.error('Login error:', error);
        showError(loginError, 'Connection error. Please try again.');
    }
}

async function verifyToken() {
    try {
        const response = await fetch(`${API_BASE_URL}/auth/verify`, {
            headers: { 'Authorization': `Bearer ${authToken}` }
        });

        if (response.ok) {
            const data = await response.json();
            adminUsername.textContent = data.user.username;
            showDashboard();
            loadAllData();
        } else {
            handleLogout();
        }
    } catch (error) {
        console.error('Token verification error:', error);
        handleLogout();
    }
}

function handleLogout() {
    authToken = null;
    localStorage.removeItem('authToken');
    showLoginScreen();
}

function showLoginScreen() {
    loginScreen.style.display = 'flex';
    adminDashboard.style.display = 'none';
}

function showDashboard() {
    loginScreen.style.display = 'none';
    adminDashboard.style.display = 'flex';
}

// Navigation
function switchSection(section) {
    // Update nav buttons
    document.querySelectorAll('.nav-btn').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.section === section);
    });

    // Update content sections
    document.querySelectorAll('.content-section').forEach(sec => {
        sec.classList.toggle('active', sec.id === `${section}Section`);
    });
}

// Load Data
async function loadAllData() {
    await loadAbout();
    await loadWork();
    await loadPublications();
    await loadContact();
}

async function loadAbout() {
    try {
        const response = await fetch(`${API_BASE_URL}/portfolio/about`);
        const data = await response.json();

        if (data) {
            document.getElementById('aboutTitle').value = data.title || '';
            document.getElementById('aboutSubtitle').value = data.subtitle || '';
            document.getElementById('aboutDescription').value = data.description || '';
            document.getElementById('aboutImage').value = data.image_url || '';
        }
    } catch (error) {
        console.error('Error loading about:', error);
    }
}

async function loadWork() {
    try {
        const response = await fetch(`${API_BASE_URL}/portfolio/work`);
        const work = await response.json();

        const workList = document.getElementById('workList');
        workList.innerHTML = work.map(item => `
      <div class="item-card">
        <div class="item-info">
          <h3>${item.title}</h3>
          <p><strong>${item.company}</strong> ${item.period ? `• ${item.period}` : ''}</p>
          <p>${item.description.substring(0, 150)}${item.description.length > 150 ? '...' : ''}</p>
        </div>
        <div class="item-actions">
          <button class="btn btn-secondary" onclick="editWork(${item.id})">Edit</button>
          <button class="btn btn-danger" onclick="deleteWork(${item.id})">Delete</button>
        </div>
      </div>
    `).join('');
    } catch (error) {
        console.error('Error loading work:', error);
    }
}

async function loadPublications() {
    try {
        const response = await fetch(`${API_BASE_URL}/portfolio/publications`);
        const publications = await response.json();

        const publicationsList = document.getElementById('publicationsList');
        publicationsList.innerHTML = publications.map(item => `
      <div class="item-card">
        <div class="item-info">
          <h3>${item.title}</h3>
          <p><strong>${item.publisher || ''}</strong> ${item.year ? `• ${item.year}` : ''}</p>
          <p>${item.description ? item.description.substring(0, 150) : ''}${item.description && item.description.length > 150 ? '...' : ''}</p>
        </div>
        <div class="item-actions">
          <button class="btn btn-secondary" onclick="editPublication(${item.id})">Edit</button>
          <button class="btn btn-danger" onclick="deletePublication(${item.id})">Delete</button>
        </div>
      </div>
    `).join('');
    } catch (error) {
        console.error('Error loading publications:', error);
    }
}

async function loadContact() {
    try {
        const response = await fetch(`${API_BASE_URL}/portfolio/contact`);
        const data = await response.json();

        if (data) {
            document.getElementById('contactEmail').value = data.email || '';
            document.getElementById('contactGithub').value = data.github || '';
            document.getElementById('contactLinkedin').value = data.linkedin || '';
            document.getElementById('contactInstagram').value = data.instagram || '';
        }
    } catch (error) {
        console.error('Error loading contact:', error);
    }
}

// Form Submissions
async function handleAboutSubmit(e) {
    e.preventDefault();

    const formData = {
        title: document.getElementById('aboutTitle').value,
        subtitle: document.getElementById('aboutSubtitle').value,
        description: document.getElementById('aboutDescription').value,
        image_url: document.getElementById('aboutImage').value
    };

    try {
        const response = await fetch(`${API_BASE_URL}/portfolio/about`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${authToken}`
            },
            body: JSON.stringify(formData)
        });

        const data = await response.json();

        if (response.ok) {
            showNotification('About section updated successfully!', 'success');
        } else {
            showNotification(data.error || 'Failed to update', 'error');
        }
    } catch (error) {
        console.error('Error updating about:', error);
        showNotification('Connection error', 'error');
    }
}

async function handleWorkSubmit(e) {
    e.preventDefault();

    const id = document.getElementById('workId').value;
    const formData = {
        title: document.getElementById('workTitle').value,
        company: document.getElementById('workCompany').value,
        period: document.getElementById('workPeriod').value,
        description: document.getElementById('workDescription').value,
        skills: document.getElementById('workSkills').value,
        image_url: document.getElementById('workImage').value,
        display_order: parseInt(document.getElementById('workOrder').value) || 0
    };

    try {
        const url = id ? `${API_BASE_URL}/portfolio/work/${id}` : `${API_BASE_URL}/portfolio/work`;
        const method = id ? 'PUT' : 'POST';

        const response = await fetch(url, {
            method,
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${authToken}`
            },
            body: JSON.stringify(formData)
        });

        const data = await response.json();

        if (response.ok) {
            showNotification(id ? 'Work updated successfully!' : 'Work added successfully!', 'success');
            closeModal('workModal');
            loadWork();
        } else {
            showNotification(data.error || 'Failed to save', 'error');
        }
    } catch (error) {
        console.error('Error saving work:', error);
        showNotification('Connection error', 'error');
    }
}

async function handlePublicationSubmit(e) {
    e.preventDefault();

    const id = document.getElementById('publicationId').value;
    const formData = {
        title: document.getElementById('publicationTitle').value,
        publisher: document.getElementById('publicationPublisher').value,
        year: parseInt(document.getElementById('publicationYear').value) || null,
        description: document.getElementById('publicationDescription').value,
        url: document.getElementById('publicationUrl').value,
        image_url: document.getElementById('publicationImage').value,
        display_order: parseInt(document.getElementById('publicationOrder').value) || 0
    };

    try {
        const url = id ? `${API_BASE_URL}/portfolio/publications/${id}` : `${API_BASE_URL}/portfolio/publications`;
        const method = id ? 'PUT' : 'POST';

        const response = await fetch(url, {
            method,
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${authToken}`
            },
            body: JSON.stringify(formData)
        });

        const data = await response.json();

        if (response.ok) {
            showNotification(id ? 'Publication updated successfully!' : 'Publication added successfully!', 'success');
            closeModal('publicationModal');
            loadPublications();
        } else {
            showNotification(data.error || 'Failed to save', 'error');
        }
    } catch (error) {
        console.error('Error saving publication:', error);
        showNotification('Connection error', 'error');
    }
}

async function handleContactSubmit(e) {
    e.preventDefault();

    const formData = {
        email: document.getElementById('contactEmail').value,
        github: document.getElementById('contactGithub').value,
        linkedin: document.getElementById('contactLinkedin').value,
        instagram: document.getElementById('contactInstagram').value
    };

    try {
        const response = await fetch(`${API_BASE_URL}/portfolio/contact`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${authToken}`
            },
            body: JSON.stringify(formData)
        });

        const data = await response.json();

        if (response.ok) {
            showNotification('Contact info updated successfully!', 'success');
        } else {
            showNotification(data.error || 'Failed to update', 'error');
        }
    } catch (error) {
        console.error('Error updating contact:', error);
        showNotification('Connection error', 'error');
    }
}

// Work Management
function openWorkModal(id = null) {
    const modal = document.getElementById('workModal');
    const form = document.getElementById('workForm');
    const title = document.getElementById('workModalTitle');

    form.reset();

    if (id) {
        title.textContent = 'Edit Work Experience';
        // Load work data
        fetch(`${API_BASE_URL}/portfolio/work`)
            .then(res => res.json())
            .then(work => {
                const item = work.find(w => w.id === id);
                if (item) {
                    document.getElementById('workId').value = item.id;
                    document.getElementById('workTitle').value = item.title;
                    document.getElementById('workCompany').value = item.company;
                    document.getElementById('workPeriod').value = item.period || '';
                    document.getElementById('workDescription').value = item.description;
                    document.getElementById('workSkills').value = item.skills || '';
                    document.getElementById('workImage').value = item.image_url || '';
                    document.getElementById('workOrder').value = item.display_order || 0;
                }
            });
    } else {
        title.textContent = 'Add Work Experience';
        document.getElementById('workId').value = '';
    }

    modal.classList.add('active');
}

window.editWork = openWorkModal;

async function deleteWork(id) {
    if (!confirm('Are you sure you want to delete this work experience?')) return;

    try {
        const response = await fetch(`${API_BASE_URL}/portfolio/work/${id}`, {
            method: 'DELETE',
            headers: { 'Authorization': `Bearer ${authToken}` }
        });

        if (response.ok) {
            showNotification('Work deleted successfully!', 'success');
            loadWork();
        } else {
            showNotification('Failed to delete', 'error');
        }
    } catch (error) {
        console.error('Error deleting work:', error);
        showNotification('Connection error', 'error');
    }
}

window.deleteWork = deleteWork;

// Publication Management
function openPublicationModal(id = null) {
    const modal = document.getElementById('publicationModal');
    const form = document.getElementById('publicationForm');
    const title = document.getElementById('publicationModalTitle');

    form.reset();

    if (id) {
        title.textContent = 'Edit Publication';
        fetch(`${API_BASE_URL}/portfolio/publications`)
            .then(res => res.json())
            .then(publications => {
                const item = publications.find(p => p.id === id);
                if (item) {
                    document.getElementById('publicationId').value = item.id;
                    document.getElementById('publicationTitle').value = item.title;
                    document.getElementById('publicationPublisher').value = item.publisher || '';
                    document.getElementById('publicationYear').value = item.year || '';
                    document.getElementById('publicationDescription').value = item.description || '';
                    document.getElementById('publicationUrl').value = item.url || '';
                    document.getElementById('publicationImage').value = item.image_url || '';
                    document.getElementById('publicationOrder').value = item.display_order || 0;
                }
            });
    } else {
        title.textContent = 'Add Publication';
        document.getElementById('publicationId').value = '';
    }

    modal.classList.add('active');
}

window.editPublication = openPublicationModal;

async function deletePublication(id) {
    if (!confirm('Are you sure you want to delete this publication?')) return;

    try {
        const response = await fetch(`${API_BASE_URL}/portfolio/publications/${id}`, {
            method: 'DELETE',
            headers: { 'Authorization': `Bearer ${authToken}` }
        });

        if (response.ok) {
            showNotification('Publication deleted successfully!', 'success');
            loadPublications();
        } else {
            showNotification('Failed to delete', 'error');
        }
    } catch (error) {
        console.error('Error deleting publication:', error);
        showNotification('Connection error', 'error');
    }
}

window.deletePublication = deletePublication;

// Image Upload
function uploadImage(targetInputId) {
    currentTargetInput = targetInputId;
    document.getElementById('imageUpload').click();
}

window.uploadImage = uploadImage;

async function handleImageUpload(e) {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('image', file);

    try {
        const response = await fetch(`${API_BASE_URL}/portfolio/upload`, {
            method: 'POST',
            headers: { 'Authorization': `Bearer ${authToken}` },
            body: formData
        });

        const data = await response.json();

        if (response.ok && data.url) {
            document.getElementById(currentTargetInput).value = data.url;
            showNotification('Image uploaded successfully!', 'success');
        } else {
            showNotification(data.error || 'Upload failed', 'error');
        }
    } catch (error) {
        console.error('Error uploading image:', error);
        showNotification('Upload error', 'error');
    }

    e.target.value = ''; // Reset file input
}

// Utilities
function closeModal(modalId) {
    document.getElementById(modalId).classList.remove('active');
}

function showError(element, message) {
    element.textContent = message;
    element.classList.add('show');
    setTimeout(() => element.classList.remove('show'), 5000);
}

function showNotification(message, type = 'success') {
    notification.textContent = message;
    notification.className = `notification ${type} show`;

    setTimeout(() => {
        notification.classList.remove('show');
    }, 3000);
}
