// State Management
let notices = [];
let editingNoticeId = null;
const API_URL = '/api/notices';

// DOM Elements
const noticeContainer = document.getElementById('notice-container');
const teacherPortal = document.getElementById('teacher-portal');
const loginView = document.getElementById('login-view');
const uploadView = document.getElementById('upload-view');
const loginForm = document.getElementById('login-form');
const uploadForm = document.getElementById('upload-form');
const navbar = document.getElementById('navbar');
const fileInput = document.getElementById('notice-pdf');
const fileNameDisplay = document.getElementById('file-name-display');
const heroLatestNotice = document.getElementById('hero-latest-notice');
const portalTitle = document.querySelector('#upload-view h3');
const publishBtn = document.querySelector('#upload-form button[type="submit"]');

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    fetchNotices();
    checkAuth();
});

// Scroll Effect
window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
});

// API Calls
async function fetchNotices() {
    try {
        const response = await fetch(API_URL);
        notices = await response.json();
        renderNotices();
    } catch (err) {
        console.error('Error fetching notices:', err);
        noticeContainer.innerHTML = '<p class="error">Could not connect to server. Please ensure Node.js server is running.</p>';
    }
}

// Notice Rendering
function renderNotices() {
    noticeContainer.innerHTML = '';
    const isLoggedIn = !!sessionStorage.getItem('teacher_session');
    
    // Sort by date descending
    const sortedNotices = [...notices].sort((a, b) => new Date(b.date) - new Date(a.date));

    if (sortedNotices.length > 0) {
        heroLatestNotice.textContent = sortedNotices[0].title;
    } else {
        heroLatestNotice.textContent = "Welcome to St. George's Academy!";
    }

    sortedNotices.forEach(notice => {
        const card = document.createElement('div');
        card.className = 'notice-card';
        card.innerHTML = `
            <div>
                <div class="notice-meta">
                    <span><i class="far fa-calendar-alt"></i> ${formatDate(notice.date)}</span>
                    <span class="badge">Official</span>
                </div>
                <h3>${notice.title}</h3>
            </div>
            <div class="notice-footer">
                <a href="${notice.fileUrl}" target="_blank" class="notice-action">
                    <i class="fas fa-file-pdf"></i> View PDF
                </a>
                ${isLoggedIn ? `
                    <div class="admin-actions">
                        <button onclick="editNotice(${notice.id})" class="btn-icon edit" title="Edit"><i class="fas fa-edit"></i></button>
                        <button onclick="deleteNotice(${notice.id})" class="btn-icon delete" title="Delete"><i class="fas fa-trash"></i></button>
                    </div>
                ` : ''}
            </div>
        `;
        noticeContainer.appendChild(card);
    });
}

function formatDate(dateStr) {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateStr).toLocaleDateString(undefined, options);
}

// Teacher Portal Logic
function toggleTeacherPortal() {
    teacherPortal.classList.toggle('active');
    if (teacherPortal.classList.contains('active')) {
        checkAuth();
    } else {
        resetUploadForm();
    }
}

function checkAuth() {
    const session = sessionStorage.getItem('teacher_session');
    if (session) {
        loginView.classList.add('hidden');
        uploadView.classList.remove('hidden');
        renderNotices(); // Re-render to show admin buttons
    } else {
        loginView.classList.remove('hidden');
        uploadView.classList.add('hidden');
        renderNotices(); // Re-render to hide admin buttons
    }
}

loginForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const user = document.getElementById('username').value;
    const pass = document.getElementById('password').value;

    if (user === 'admin' && pass === 'admin') {
        sessionStorage.setItem('teacher_session', 'true');
        checkAuth();
    } else {
        alert('Invalid credentials! Use admin / admin');
    }
});

function logout() {
    sessionStorage.removeItem('teacher_session');
    checkAuth();
}

// File Upload Handling
fileInput.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (file) {
        fileNameDisplay.textContent = `Selected: ${file.name}`;
    }
});

uploadForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const title = document.getElementById('notice-title').value;
    const date = document.getElementById('notice-date').value;
    const file = fileInput.files[0];

    const formData = new FormData();
    formData.append('title', title);
    formData.append('date', date);
    if (file) formData.append('pdf', file);

    try {
        let url = API_URL;
        let method = 'POST';

        if (editingNoticeId) {
            url = `${API_URL}/${editingNoticeId}`;
            method = 'PUT';
        } else if (!file) {
            alert('Please select a PDF file');
            return;
        }

        const response = await fetch(url, {
            method: method,
            body: formData
        });

        if (!response.ok) throw new Error('Server error during operation');

        await fetchNotices();
        resetUploadForm();
        alert(editingNoticeId ? 'Notice updated successfully!' : 'Notice published successfully!');
        toggleTeacherPortal();
    } catch (err) {
        alert(err.message || 'Error processing request.');
        console.error(err);
    }
});

function editNotice(id) {
    const notice = notices.find(n => n.id === id);
    if (!notice) return;

    editingNoticeId = id;
    document.getElementById('notice-title').value = notice.title;
    document.getElementById('notice-date').value = notice.date;
    fileNameDisplay.textContent = 'Keep current file or upload new one';
    
    portalTitle.textContent = 'Modify Notice';
    publishBtn.textContent = 'Update Notice';
    
    toggleTeacherPortal();
}

async function deleteNotice(id) {
    if (confirm('Are you sure you want to delete this notice?')) {
        try {
            const response = await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
            if (!response.ok) throw new Error('Could not delete notice');
            await fetchNotices();
        } catch (err) {
            alert(err.message);
        }
    }
}

function resetUploadForm() {
    editingNoticeId = null;
    uploadForm.reset();
    fileNameDisplay.textContent = '';
    portalTitle.textContent = 'Upload New Notice';
    publishBtn.textContent = 'Publish Notice';
}

async function clearAllNotices() {
    if (confirm('Are you sure you want to delete ALL notices from the server?')) {
        try {
            await fetch(API_URL, { method: 'DELETE' });
            await fetchNotices();
            alert('All notices cleared.');
        } catch (err) {
            alert('Error clearing notices.');
        }
    }
}

// Close modal on outside click
window.onclick = function(event) {
    if (event.target == teacherPortal) {
        toggleTeacherPortal();
    }
}
// Admission Form Handling
const admissionForm = document.getElementById('admission-form');
const formSuccess = document.getElementById('form-success');

if (admissionForm) {
    admissionForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        // Hide form and show success message
        admissionForm.classList.add('hidden');
        formSuccess.classList.remove('hidden');
        
        // Scroll to success message
        formSuccess.scrollIntoView({ behavior: 'smooth', block: 'center' });
    });
}

function resetForm() {
    if (admissionForm) {
        admissionForm.reset();
        admissionForm.classList.remove('hidden');
        formSuccess.classList.add('hidden');
    }
}
