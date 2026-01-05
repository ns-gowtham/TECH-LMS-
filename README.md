# LMS

A comprehensive Learning Management System built with ReactJS, Node.js, and PostgreSQL.
Designed for Desktop Web, Android, and iOS.

## Prerequisites

1.  **Node.js**: Install from [nodejs.org](https://nodejs.org/).
2.  **PostgreSQL**: Install and running locally.
3.  **Android Studio / Xcode**: Required for building mobile apps.

## Setup Instructions

### 1. Database Setup
Create a PostgreSQL database named `fusionhubble`.
You may need to update the connection string in `server/db.js` or create a `.env` file in `server/` with:
```
DATABASE_URL=postgres://username:password@localhost:5432/fusionhubble
```

### 2. Server Setup
```bash
cd server
npm install
npm start
```
The server will run on `http://localhost:3000`.

### 3. Client Setup
Open a new terminal:
```bash
cd client
npm install
npm run dev
```
The web app will run on `http://localhost:5173`.

## Building for Mobile (Android/iOS)

This project uses **Capacitor** to wrap the React web app into native mobile apps.

1.  **Build the Web Assets**:
    ```bash
    cd client
    npm run build
    ```

2.  **Initialize Capacitor (First Time Only)**:
    ```bash
    npx cap add android
    npx cap add ios
    ```

3.  **Sync and Open**:
    ```bash
    # For Android
    npx cap sync
    npx cap open android

    # For iOS (Mac only)
    npx cap sync
    npx cap open ios
    ```

## Features
- **Super Admin Dashboard**: Manage Trainers, Students, and Courses.
- **Premium Design**: Modern glassmorphism UI.
- **Cross-Platform**: Works on Web, Android, and iOS.
