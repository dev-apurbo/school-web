# St. George's Academy - School Web Portal

A modern, responsive, and functional school website built with a focus on aesthetics and usability. This project features a multi-page structure, a dynamic notice board, and a teacher portal for administrative tasks.

![St. George's Academy](about-school.png)

## 🚀 Features

### Frontend
- **Modern UI/UX**: Designed with a premium look using glassmorphism, smooth animations, and a curated color palette (Inter and Outfit typography).
- **Responsive Navigation**: Fully responsive navbar with a dedicated mobile-friendly layout.
- **Multi-page Structure**:
  - **Home**: Hero section with latest updates and featured notices.
  - **About Us**: Information about the school's history and mission.
  - **Achievements**: Showcasing school milestones and awards.
  - **Admission**: Details on the enrollment process and requirements.
  - **Tuition**: Transparent breakdown of school fees and payment options.
- **Dynamic Notice Board**: Automatically fetches and displays the latest notices uploaded by teachers.

### Backend & Admin
- **Teacher Portal**: A secure modal-based interface for authorized personnel to manage school announcements.
- **PDF Upload System**: Integrated file upload functionality for sharing official documents and notices.
- **Dynamic Data API**: Serves notice information and handles persistent storage of notice metadata.

## 🛠️ Technology Stack

- **Frontend**: 
  - Vanilla HTML5 & CSS3 (Custom Design System)
  - JavaScript (ES6+)
  - FontAwesome 6.4.0
  - Google Fonts (Inter, Outfit)
- **Backend**:
  - Node.js
  - Express.js
  - Multer (File Upload Handling)
  - CORS Middleware
- **Storage**:
  - Local filesystem for PDF storage (`/uploads`)
  - JSON-based data persistence (`notices.json`)

## 🏁 Getting Started

### Prerequisites
- [Node.js](https://nodejs.org/) installed on your machine.

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/dev-apurbo/school-web.git
   ```

2. Navigate to the project directory:
   ```bash
   cd school-web
   ```

3. Install dependencies:
   ```bash
   npm install
   ```

### Running the Application

1. Start the server:
   ```bash
   npm start
   ```

2. Open your browser and navigate to:
   ```
   http://localhost:3000
   ```

### Running with Docker (Recommended for Persistence)

Docker is the recommended way to deploy this application because it allows for persistent storage of uploaded PDFs and notice data.

1. Build and start the container:
   ```bash
   docker-compose up -d --build
   ```

2. The application will be available at `http://localhost:3000`.

3. To stop the application:
   ```bash
   docker-compose down
   ```

### Teacher Portal Credentials (Demo)
- **Username**: `admin`
- **Password**: `admin`

## 📂 Project Structure

```text
├── uploads/             # Directory for uploaded PDF notices
├── index.html           # Landing page & Notice board
├── about.html           # About Us page
├── achievements.html    # School achievements page
├── admission.html       # Admission details page
├── tuition.html         # Tuition fee information page
├── style.css            # Core design system and styles
├── script.js            # Frontend logic and API integration
├── server.js            # Express server and file handling
├── notices.json         # Metadata storage for notices
└── package.json         # Project dependencies and scripts
```

## 📜 License
This project is licensed under the ISC License.

---
Built with ❤️ for St. George's Academy.