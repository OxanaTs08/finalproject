## Project:

Social Network ( based on Instagram) with Real-Time Chat

## Description

This project is a fully functional social network built with **Node.js** and **TypeScript**, providing a seamless user experience across multiple features:

- **Backend**: REST API for managing users, posts, comments, likes, following/followers functionality.
- **Frontend**: A instagram-based interface for user interaction.
- **Chat Server**: Real-time chat implemented using **WebSocket** (via Socket.IO).

## Technology Stack

### Backend:

- **Node.js** Runtime environment for executing JavaScript code on the server.
- **Express.js** Web framework for building RESTful APIs.
- **TypeScript** Strongly typed JavaScript for better code quality and maintainability.
- **MongoDB** NoSQL database for flexible and scalable data storage.
- **Mongoose**O bject Data Modeling (ODM) library for MongoDB.
- **JWT Authentication** Secure token-based authentication for user sessions.
- **Base64** Image Uploads: Photos are uploaded in Base64 format, decoded on the server, and optionally stored in cloud storage.
- **Nodemailer** Email library used for password recovery and account-related notifications.
- **Cloud Storage**: Photos and user-uploaded files are stored on a secure cloud storage service (Cloudinary).
- **Socket.IO** (for real-time communication)

### Frontend:

- **React** Library for building user interfaces.
- **TypeScript** Ensures type safety and reduces runtime errors in the frontend.
- **Redux** State management library to handle application state.
- **Axios** Library for making HTTP requests to the backend.
- **Material-UI** (MUI): A React component library used for building responsive and accessible user interfaces with pre-built components and themes.

### Chat Server:

- **Node.js** Runtime environment for executing JavaScript code on the server.
- **Express.js** Web framework for building RESTful APIs.
- **TypeScript** Strongly typed JavaScript for better code quality and maintainability.
- **MongoDB** NoSQL database for flexible and scalable data storage.
- **Mongoose**O bject Data Modeling (ODM) library for MongoDB.
- **Socket.IO**: Used for establishing and managing real-time, bidirectional communication between users.

### DevOps & Tooling:

- **Docker** ( for containerization)
- **Prettier** (for code quality)
- **Postman** (for API testing)

## Features

1. **User Authentication**:

   - Registration, login, and logout with JWT.
   - Password encryption using **bcrypt**.
   - Reseting password using **nodemailer**

2. **Social Media Functionality**:

   - Create, read, update, and delete (CRUD) operations for posts and comments.
   - User profiles with followers and followings.
   - Like functionality

3. **Real-Time Chat**:

   - One-to-one chat with WebSocket.
   - User online status tracking.

4. **Responsive Frontend**:
   - Interactive and responsive design for optimal user experience.

## Installation

### Prerequisites

- Node.js (>= 16.x)
- MongoDB (running locally or via cloud services like Atlas)
- Docker (optional)

### Steps

1. **Clone the repository**:

````bash
   git clone https://github.com/OxanaTs08/finalproject
   cd finalproject
   cd backendfp
   npm install
   cd ../backendchat
   npm install
   cd ../finaprojectfront
   npm install

2. **.env**:
3. **RUN the application** :
```bash
cd ../backendfp
npm start
cd ../backendchat
npm start
cd ../finaprojectfront
npm run dev

## Project Structure
backendfp/
  ├── controllers
  ├── db
  ├── middlWares
  ├── models
  ├── routes
  └── utils/

backendchat/
  ├── controllers
  ├── models
  ├── routes
  └── utils

finalprojectfront/
├─ src/
  ├── assets
  ├── components
  ├── hooks
  ├── pages
  ├──redux
  ├── selectors
  └── utils



````
