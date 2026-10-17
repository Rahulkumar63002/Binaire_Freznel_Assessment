# Sensor Monitoring System

## About the Project
This project is built using React, TypeScript, Node.js, and Firebase. It is used to monitor system sensor data and manage user authentication.

## Features
- User registration and login using Firebase Authentication
- Store user profiles in Firestore
- Monitor CPU, GPU, memory, disk, and network data
- Backend APIs using Node.js and Express
- Store sensor readings in Cloud Firestore
- Basic offline data support

## Technologies Used
- React
- TypeScript
- Node.js
- Express.js
- Firebase Authentication
- Cloud Firestore

## Installation

Install the dependencies:

```bash
npm install
```

## Run the Project

Start the backend:

```bash
node server/server.js
```

Start the frontend in another terminal:

```bash
npm run dev
```

Open the local URL shown in the terminal.

## Firebase Setup
Configure Firebase Authentication and Cloud Firestore before running the application.

Keep your Firebase service account key and `.env` file private. Do not upload them to GitHub.