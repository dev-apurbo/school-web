# 🏫 St. George's Academy - School Web Portal

A premium, modern, and high-performance school web portal designed for **St. George's Academy**. This application provides a seamless experience for students and parents to access school information and allows teachers to manage official notices with cloud-backed PDF storage.

![St. George's Academy](about-school.png)

## ✨ Features

### 🎨 Frontend Excellence
- **Premium Aesthetics**: Crafted with a modern design system featuring glassmorphism, fluid animations, and a sophisticated color palette.
- **Dynamic Notice Board**: Real-time fetching and display of school announcements.
- **Responsive Layout**: Optimized for all devices—from desktop monitors to smartphones.
- **Multi-page Experience**: Dedicated sections for **About Us**, **Achievements**, **Admission**, and **Tuition**.

### 🛠️ Administrative Capabilities
- **Teacher Portal**: A secure, password-protected interface for authorized staff.
- **Cloud-Powered Notices**: Integrated with **Vercel Blob** for reliable, global delivery of PDF documents.
- **Full CRUD Support**: Teachers can create, update, and delete notices directly from the portal.
- **Automated Metadata Management**: Notices are tracked via a persistent JSON data store.

## 🚀 Technology Stack

- **Frontend**: 
  - Semantic HTML5 & Vanilla CSS3 (Custom Design Tokens)
  - JavaScript (ES6+ with Async/Await)
  - FontAwesome 6.4.0 & Google Fonts (Inter, Outfit)
- **Backend**:
  - Node.js & Express.js
  - Multer (Memory Storage)
  - Vercel Blob SDK
- **Infrastructure**:
  - Docker & Docker Compose
  - Vercel Serverless Functions

## 🏁 Getting Started

### 📋 Prerequisites
- [Node.js](https://nodejs.org/) (v18+ recommended)
- [Docker](https://www.docker.com/) (Optional, for containerized environments)
- A [Vercel](https://vercel.com/) account for Blob storage.


### 🛠️ Installation & Local Development

1. **Clone the repository**:
   ```bash
   git clone https://github.com/dev-apurbo/school-web.git
   cd school-web
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Run the development server**:
   ```bash
   npm start
   ```
   Access the portal at `http://localhost:3000`.

### 🐳 Running with Docker

For a consistent environment across different machines:

```bash
docker-compose up -d --build
```

## 🚢 Deployment

This project is optimized for deployment on **Vercel**.

1. Push your code to a GitHub repository.
2. Connect the repository to Vercel.
3. Configure the `BLOB_READ_WRITE_TOKEN` and `TEACHER_PASSWORD` environment variables in the Vercel Dashboard.
4. Vercel will automatically detect `vercel.json` and deploy the application.

## 📂 Project Structure

```text
├── uploads/             # Local temporary storage for uploads
├── index.html           # Main Landing Page & Notice Board
├── about.html           # School History & Vision
├── achievements.html    # Milestones & Awards
├── admission.html       # Enrollment Procedures
├── tuition.html         # Fee Structure & Payments
├── style.css            # Global Design System
├── script.js            # Frontend Interactivity & API Client
├── server.js            # Express API & Cloud Integration
├── notices.json         # Notice Metadata Persistence
├── vercel.json          # Deployment Configuration
└── package.json         # Node.js Dependencies
```

## 📜 License

This project is licensed under the **ISC License**.

---
Built with ❤️ for **St. George's Academy**.