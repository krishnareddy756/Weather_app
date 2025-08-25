#!/bin/bash

# Weather Website Development Server Starter
# This script starts both the backend API server and frontend development server

echo "🌤️ Starting Weather Website Development Servers..."

# Function to cleanup background processes
cleanup() {
    echo "Stopping servers..."
    kill 0
}

trap cleanup EXIT

# Start backend server
echo "📡 Starting Backend API Server..."
cd backend
npm run dev &
BACKEND_PID=$!
cd ..

# Wait a moment for backend to start
sleep 3

# Start frontend server
echo "🌐 Starting Frontend Development Server..."
npm run dev &
FRONTEND_PID=$!

echo "✅ Servers started successfully!"
echo "📡 Backend API: http://localhost:5000/api"
echo "🌐 Frontend: http://localhost:5173/"
echo "🛑 Press Ctrl+C to stop both servers"

# Wait for any process to exit
wait
