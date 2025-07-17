# ToDoAI

A full-stack todo application with AI integration, built with React, Node.js, Express, and MongoDB.

## Features

- User authentication and authorization
- Create, edit, and manage todo items
- Organize todos into lists
- Calendar view for todo management
- AI-powered chat assistance
- Drag and drop functionality
- Responsive design with TailwindCSS

## Tech Stack

### Frontend

- React
- Redux Toolkit for state management
- React Router for navigation
- TailwindCSS for styling
- Vite for build tooling
- FullCalendar for calendar functionality
- React Beautiful DnD for drag and drop

### Backend

- Node.js with Express
- MongoDB with Mongoose
- JWT for authentication
- bcryptjs for password hashing
- LangChain for AI integration
- Joi and Zod for validation

## Prerequisites

Before running this application, make sure you have the following installed:

- [Node.js](https://nodejs.org/) (version 16 or higher)
- [MongoDB](https://www.mongodb.com/try/download/community) (local installation or MongoDB Atlas account)
- npm or yarn package manager

## Environment Setup

1. **Clone the repository**

   ```bash
   git clone <your-repository-url>
   cd ToDoAI
   ```

2. **Create environment variables**

   Create a `.env` file in the `server` directory with the following variables:

   ```env
   MONGODB_URL=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret_key
   GOOGLE_API_KEY=your_google_ai_api_key
   ```

   **Note:**

   - Replace `your_mongodb_connection_string` with your MongoDB connection URL
   - Replace `your_jwt_secret_key` with a secure random string for JWT signing
   - Replace `your_google_ai_api_key` with your Google Gemini API key 

## Installation

1. **Install root dependencies**

   ```bash
   npm install
   ```

2. **Install server dependencies**

   ```bash
   cd server
   npm install
   cd ..
   ```

3. **Install client dependencies**
   ```bash
   cd client
   npm install
   cd ..
   ```

## Running the Application

### Development Mode

1. **Start the server**

   ```bash
   cd server
   npm run dev
   ```

   This will start the backend server on port 3000 with nodemon for auto-reloading.

2. **Start the client** (in a new terminal)

   ```bash
   cd client
   npm run dev
   ```

   This will start the frontend development server (typically on port 5173).

3. **Access the application**
   - Frontend: http://localhost:3001
   - Backend API: http://localhost:3000

### Production Mode

1. **Build the application**

   ```bash
   npm run build
   ```

   This will install dependencies and build the client for production.

2. **Create environment variables**

   Create a `.env` file in the root directory with the following variables:

   ```env
   MONGODB_URL=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret_key
   GOOGLE_API_KEY=your_google_ai_api_key
   ```

   **Note:**

   - Replace `your_mongodb_connection_string` with your MongoDB connection URL
   - Replace `your_jwt_secret_key` with a secure random string for JWT signing
   - Replace `your_google_ai_api_key` with your Google Gemini API key 

3. **Start the production server**

   ```bash
   npm start
   ```

   This will start the server and serve the built frontend files.

4. **Access the application**
   - Application: http://localhost:3000

## Project Structure

```
ToDoAI/
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/     # React components
│   │   ├── pages/         # Page components
│   │   ├── redux/         # Redux store and slices
│   │   └── utils/         # Utility functions
│   └── package.json
├── server/                # Node.js backend
│   ├── config/           # Configuration files
│   ├── controllers/      # Route controllers
│   ├── middleware/       # Express middleware
│   ├── models/          # MongoDB models
│   ├── routes/          # API routes
│   └── package.json
└── package.json          # Root package.json
```

## API Endpoints

- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/logout` - User logout
- `GET /api/users/profile` - Get user profile
- `PUT /api/users/profile` - Update user profile
- `GET /api/todos` - Get user todos
- `POST /api/todos` - Create new todo
- `PUT /api/todos/:id` - Update todo
- `DELETE /api/todos/:id` - Delete todo
- `GET /api/lists` - Get user lists
- `POST /api/lists` - Create new list
- `PUT /api/lists/:id` - Update list
- `DELETE /api/lists/:id` - Delete list
- `POST /api/ai/chat` - AI chat endpoint