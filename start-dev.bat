@echo off
REM Weather Website Development Server Starter for Windows
REM This script starts both the backend API server and frontend development server

echo 🌤️ Starting Weather Website Development Servers...

REM Start backend server in new window
echo 📡 Starting Backend API Server...
cd backend
start "Backend API Server" cmd /k "npm run dev"
cd ..

REM Wait a moment for backend to start
timeout /t 3 /nobreak > nul

REM Start frontend server in new window
echo 🌐 Starting Frontend Development Server...
start "Frontend Dev Server" cmd /k "npm run dev"

echo ✅ Servers started successfully!
echo 📡 Backend API: http://localhost:5000/api
echo 🌐 Frontend: http://localhost:5173/
echo 🛑 Close the terminal windows to stop the servers

pause
