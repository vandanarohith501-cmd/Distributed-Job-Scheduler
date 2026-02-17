<#
.SYNOPSIS
    Complete setup script for FreelanceHub frontend with Neumorphism UI
.DESCRIPTION
    This script installs Tailwind CSS, creates configuration files,
    and sets up all necessary components with neumorphism styling
.NOTES
    Author: Assistant
    Version: 1.0
#>

# ================================================
# FREELANCEHUB COMPLETE SETUP SCRIPT
# ================================================

# Color definitions for pretty output
$colors = @{
    Cyan = 'Cyan'
    Green = 'Green'
    Yellow = 'Yellow'
    Red = 'Red'
    Magenta = 'Magenta'
}

function Write-Color($text, $color) {
    Write-Host $text -ForegroundColor $color
}

# Clear the screen
Clear-Host

Write-Color "=========================================" $colors.Cyan
Write-Color "   FREELANCEHUB COMPLETE SETUP SCRIPT   " $colors.Cyan
Write-Color "=========================================" $colors.Cyan
Write-Host ""

# Check if we're in the frontend directory
$currentDir = Get-Location
if (-not ($currentDir.Path -like "*frontend")) {
    Write-Color "⚠️  Warning: You don't seem to be in the frontend directory!" $colors.Yellow
    Write-Color "Current directory: $currentDir" $colors.Yellow
    $response = Read-Host "Continue anyway? (y/n)"
    if ($response -ne 'y') {
        Write-Color "Please navigate to your frontend directory and run this script again." $colors.Red
        exit
    }
}

Write-Color "📁 Working directory: $currentDir" $colors.Green
Write-Host ""

# ================================================
# STEP 1: Install Tailwind CSS
# ================================================
Write-Color "Step 1: Installing Tailwind CSS..." $colors.Cyan
Write-Host "This may take a few minutes..." -ForegroundColor Yellow

try {
    $installResult = npm install -D tailwindcss postcss autoprefixer 2>&1
    if ($LASTEXITCODE -ne 0) {
        throw "npm install failed"
    }
    Write-Color "✅ Tailwind CSS installed successfully" $colors.Green
}
catch {
    Write-Color "❌ Failed to install Tailwind CSS" $colors.Red
    Write-Color "Error: $_" $colors.Red
    exit
}
Write-Host ""

# ================================================
# STEP 2: Create tailwind.config.js
# ================================================
Write-Color "Step 2: Creating tailwind.config.js..." $colors.Cyan

$tailwindConfig = @"
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./public/index.html",
  ],
  theme: {
    extend: {
      colors: {
        'neumorphism': '#e0e0e0',
        'neumorphism-light': '#ffffff',
        'neumorphism-dark': '#bebebe',
        'neumorphism-accent': '#4f46e5',
      },
      boxShadow: {
        'neu': '20px 20px 60px #bebebe, -20px -20px 60px #ffffff',
        'neu-sm': '5px 5px 10px #bebebe, -5px -5px 10px #ffffff',
        'neu-lg': '35px 35px 70px #bebebe, -35px -35px 70px #ffffff',
        'neu-xl': '50px 50px 100px #bebebe, -50px -50px 100px #ffffff',
        'neu-inset': 'inset 5px 5px 10px #bebebe, inset -5px -5px 10px #ffffff',
        'neu-inset-sm': 'inset 3px 3px 6px #bebebe, inset -3px -3px 6px #ffffff',
        'neu-inset-lg': 'inset 10px 10px 20px #bebebe, inset -10px -10px 20px #ffffff',
        'neu-btn': '8px 8px 16px #bebebe, -8px -8px 16px #ffffff',
        'neu-btn-hover': '4px 4px 8px #bebebe, -4px -4px 8px #ffffff',
        'neu-btn-active': 'inset 8px 8px 16px #bebebe, inset -8px -8px 16px #ffffff',
        'neu-btn-primary': '8px 8px 16px #4338ca, -8px -8px 16px #818cf8',
        'neu-btn-primary-hover': '4px 4px 8px #4338ca, -4px -4px 8px #818cf8',
        'neu-btn-primary-active': 'inset 8px 8px 16px #4338ca, inset -8px -8px 16px #818cf8',
      },
      animation: {
        'float': 'float 3s ease-in-out infinite',
        'pulse-soft': 'pulse-soft 2s ease-in-out infinite',
        'slide-in': 'slideIn 0.5s ease-out',
        'fade-in': 'fadeIn 0.5s ease-out',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        'pulse-soft': {
          '0%, 100%': { opacity: 1 },
          '50%': { opacity: 0.8 },
        },
        slideIn: {
          '0%': { transform: 'translateX(-100%)', opacity: 0 },
          '100%': { transform: 'translateX(0)', opacity: 1 },
        },
        fadeIn: {
          '0%': { opacity: 0 },
          '100%': { opacity: 1 },
        },
      },
    },
  },
  plugins: [],
}
"@

$tailwindConfig | Out-File -FilePath "tailwind.config.js" -Encoding UTF8
Write-Color "✅ tailwind.config.js created" $colors.Green
Write-Host ""

# ================================================
# STEP 3: Create postcss.config.js
# ================================================
Write-Color "Step 3: Creating postcss.config.js..." $colors.Cyan

$postcssConfig = @"
module.exports = {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
}
"@

$postcssConfig | Out-File -FilePath "postcss.config.js" -Encoding UTF8
Write-Color "✅ postcss.config.js created" $colors.Green
Write-Host ""

# ================================================
# STEP 4: Update index.css with neumorphism styles
# ================================================
Write-Color "Step 4: Updating src/index.css with neumorphism styles..." $colors.Cyan

# Create src directory if it doesn't exist
if (-not (Test-Path "src")) {
    New-Item -ItemType Directory -Path "src" -Force | Out-Null
}

$indexCss = @"
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  body {
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen',
      'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue',
      sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    background-color: #e0e0e0;
    min-height: 100vh;
  }

  code {
    font-family: source-code-pro, Menlo, Monaco, Consolas, 'Courier New',
      monospace;
  }
}

@layer components {
  /* Cards */
  .neu-card {
    @apply bg-[#e0e0e0] rounded-3xl p-6 transition-all duration-300;
    box-shadow: 20px 20px 60px #bebebe,
                -20px -20px 60px #ffffff;
  }
  
  .neu-card:hover {
    box-shadow: 25px 25px 75px #bebebe,
                -25px -25px 75px #ffffff;
  }
  
  .neu-card-sm {
    @apply bg-[#e0e0e0] rounded-2xl p-4 transition-all duration-300;
    box-shadow: 8px 8px 16px #bebebe,
                -8px -8px 16px #ffffff;
  }
  
  .neu-card-lg {
    @apply bg-[#e0e0e0] rounded-[40px] p-8 transition-all duration-300;
    box-shadow: 35px 35px 70px #bebebe,
                -35px -35px 70px #ffffff;
  }
  
  /* Buttons */
  .neu-btn {
    @apply bg-[#e0e0e0] px-6 py-3 rounded-xl font-medium 
           transition-all duration-300 cursor-pointer
           text-gray-700 hover:text-gray-900;
    box-shadow: 8px 8px 16px #bebebe,
                -8px -8px 16px #ffffff;
  }
  
  .neu-btn:hover {
    box-shadow: 4px 4px 8px #bebebe,
                -4px -4px 8px #ffffff;
  }
  
  .neu-btn:active {
    box-shadow: inset 8px 8px 16px #bebebe,
                inset -8px -8px 16px #ffffff;
  }
  
  .neu-btn-primary {
    @apply bg-indigo-500 text-white px-6 py-3 rounded-xl font-medium 
           transition-all duration-300 cursor-pointer;
    box-shadow: 8px 8px 16px #4338ca,
                -8px -8px 16px #818cf8;
  }
  
  .neu-btn-primary:hover {
    @apply bg-indigo-600;
    box-shadow: 4px 4px 8px #4338ca,
                -4px -4px 8px #818cf8;
  }
  
  .neu-btn-primary:active {
    box-shadow: inset 8px 8px 16px #4338ca,
                inset -8px -8px 16px #818cf8;
  }
  
  .neu-btn-success {
    @apply bg-emerald-500 text-white px-6 py-3 rounded-xl font-medium 
           transition-all duration-300 cursor-pointer;
    box-shadow: 8px 8px 16px #047857,
                -8px -8px 16px #6ee7b7;
  }
  
  .neu-btn-danger {
    @apply bg-rose-500 text-white px-6 py-3 rounded-xl font-medium 
           transition-all duration-300 cursor-pointer;
    box-shadow: 8px 8px 16px #b91c1c,
                -8px -8px 16px #f87171;
  }
  
  /* Inputs */
  .neu-input {
    @apply w-full bg-[#e0e0e0] px-4 py-3 rounded-xl 
           border-none outline-none text-gray-700
           placeholder-gray-400;
    box-shadow: inset 5px 5px 10px #bebebe,
                inset -5px -5px 10px #ffffff;
  }
  
  .neu-input:focus {
    box-shadow: inset 6px 6px 12px #bebebe,
                inset -6px -6px 12px #ffffff;
  }
  
  .neu-input-error {
    @apply border-2 border-rose-300;
    box-shadow: inset 5px 5px 10px #bebebe,
                inset -5px -5px 10px #ffffff,
                0 0 0 2px rgba(244, 63, 94, 0.1);
  }
  
  /* Textarea */
  .neu-textarea {
    @apply w-full bg-[#e0e0e0] px-4 py-3 rounded-xl 
           border-none outline-none text-gray-700
           placeholder-gray-400 resize-none;
    box-shadow: inset 5px 5px 10px #bebebe,
                inset -5px -5px 10px #ffffff;
  }
  
  .neu-textarea:focus {
    box-shadow: inset 6px 6px 12px #bebebe,
                inset -6px -6px 12px #ffffff;
  }
  
  /* Select */
  .neu-select {
    @apply w-full bg-[#e0e0e0] px-4 py-3 rounded-xl 
           border-none outline-none text-gray-700
           appearance-none cursor-pointer;
    box-shadow: inset 5px 5px 10px #bebebe,
                inset -5px -5px 10px #ffffff;
  }
  
  .neu-select:focus {
    box-shadow: inset 6px 6px 12px #bebebe,
                inset -6px -6px 12px #ffffff;
  }
  
  /* Checkbox & Radio */
  .neu-checkbox {
    @apply appearance-none w-5 h-5 bg-[#e0e0e0] rounded-md 
           cursor-pointer transition-all duration-300
           checked:bg-indigo-500 checked:border-indigo-600;
    box-shadow: 3px 3px 6px #bebebe,
                -3px -3px 6px #ffffff;
  }
  
  .neu-checkbox:checked {
    box-shadow: inset 2px 2px 4px #4338ca,
                inset -2px -2px 4px #818cf8;
  }
  
  .neu-radio {
    @apply appearance-none w-5 h-5 bg-[#e0e0e0] rounded-full 
           cursor-pointer transition-all duration-300
           checked:bg-indigo-500 checked:border-indigo-600;
    box-shadow: 3px 3px 6px #bebebe,
                -3px -3px 6px #ffffff;
  }
  
  .neu-radio:checked {
    box-shadow: inset 2px 2px 4px #4338ca,
                inset -2px -2px 4px #818cf8;
  }
  
  /* Navigation */
  .neu-nav {
    @apply bg-[#e0e0e0] sticky top-0 z-50 py-4 px-6;
    box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1);
  }
  
  .neu-nav-item {
    @apply px-4 py-2 rounded-xl text-gray-700 
           transition-all duration-300;
    box-shadow: 3px 3px 6px #bebebe,
                -3px -3px 6px #ffffff;
  }
  
  .neu-nav-item:hover {
    box-shadow: 2px 2px 4px #bebebe,
                -2px -2px 4px #ffffff;
  }
  
  .neu-nav-item.active {
    box-shadow: inset 3px 3px 6px #bebebe,
                inset -3px -3px 6px #ffffff;
  }
  
  /* Avatar */
  .neu-avatar {
    @apply rounded-full bg-[#e0e0e0] flex items-center 
           justify-center overflow-hidden;
    box-shadow: 8px 8px 16px #bebebe,
                -8px -8px 16px #ffffff;
  }
  
  .neu-avatar-sm {
    @apply w-8 h-8 text-sm;
  }
  
  .neu-avatar-md {
    @apply w-12 h-12 text-base;
  }
  
  .neu-avatar-lg {
    @apply w-16 h-16 text-xl;
  }
  
  /* Badges */
  .neu-badge {
    @apply inline-block px-3 py-1 rounded-full text-xs font-medium;
    box-shadow: 3px 3px 6px #bebebe,
                -3px -3px 6px #ffffff;
  }
  
  .neu-badge-primary {
    @apply bg-indigo-500 text-white;
  }
  
  .neu-badge-success {
    @apply bg-emerald-500 text-white;
  }
  
  .neu-badge-warning {
    @apply bg-amber-500 text-white;
  }
  
  .neu-badge-danger {
    @apply bg-rose-500 text-white;
  }
  
  /* Dividers */
  .neu-divider {
    @apply h-px bg-[#e0e0e0] my-6;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
  }
  
  .neu-divider-vertical {
    @apply w-px h-full bg-[#e0e0e0] mx-4;
    box-shadow: 2px 0 4px rgba(0, 0, 0, 0.05);
  }
  
  /* Alerts */
  .neu-alert {
    @apply p-4 rounded-2xl mb-4;
    box-shadow: inset 3px 3px 6px #bebebe,
                inset -3px -3px 6px #ffffff;
  }
  
  .neu-alert-info {
    @apply bg-blue-100 text-blue-800;
  }
  
  .neu-alert-success {
    @apply bg-emerald-100 text-emerald-800;
  }
  
  .neu-alert-warning {
    @apply bg-amber-100 text-amber-800;
  }
  
  .neu-alert-error {
    @apply bg-rose-100 text-rose-800;
  }
  
  /* Modal */
  .neu-modal {
    @apply bg-[#e0e0e0] rounded-3xl p-8 max-w-md w-full;
    box-shadow: 35px 35px 70px #bebebe,
                -35px -35px 70px #ffffff;
  }
  
  /* Tooltips */
  .neu-tooltip {
    @apply absolute bg-[#e0e0e0] text-sm px-3 py-2 rounded-xl
           pointer-events-none z-50;
    box-shadow: 5px 5px 10px #bebebe,
                -5px -5px 10px #ffffff;
  }
  
  /* Progress Bar */
  .neu-progress {
    @apply h-2 bg-[#e0e0e0] rounded-full overflow-hidden;
    box-shadow: inset 2px 2px 4px #bebebe,
                inset -2px -2px 4px #ffffff;
  }
  
  .neu-progress-bar {
    @apply h-full bg-indigo-500 rounded-full transition-all duration-300;
    box-shadow: 0 2px 4px rgba(79, 70, 229, 0.3);
  }
  
  /* Loading Spinner */
  .neu-spinner {
    @apply w-8 h-8 border-4 border-[#e0e0e0] border-t-indigo-500 
           rounded-full animate-spin;
    box-shadow: 3px 3px 6px #bebebe,
                -3px -3px 6px #ffffff;
  }
  
  /* Tables */
  .neu-table {
    @apply w-full bg-[#e0e0e0] rounded-2xl overflow-hidden;
    box-shadow: 8px 8px 16px #bebebe,
                -8px -8px 16px #ffffff;
  }
  
  .neu-table th {
    @apply px-6 py-3 text-left text-sm font-semibold text-gray-700;
    box-shadow: inset 0 -2px 4px rgba(0, 0, 0, 0.05);
  }
  
  .neu-table td {
    @apply px-6 py-4 text-sm text-gray-600;
  }
  
  .neu-table tr:not(:last-child) {
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
  }
  
  /* Lists */
  .neu-list {
    @apply bg-[#e0e0e0] rounded-2xl overflow-hidden;
    box-shadow: inset 3px 3px 6px #bebebe,
                inset -3px -3px 6px #ffffff;
  }
  
  .neu-list-item {
    @apply px-4 py-3 text-gray-700;
  }
  
  .neu-list-item:not(:last-child) {
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
  }
  
  /* Toggle Switch */
  .neu-toggle {
    @apply relative inline-block w-12 h-6 rounded-full cursor-pointer;
    box-shadow: inset 2px 2px 4px #bebebe,
                inset -2px -2px 4px #ffffff;
  }
  
  .neu-toggle input {
    @apply opacity-0 w-0 h-0;
  }
  
  .neu-toggle-slider {
    @apply absolute top-0 left-0 right-0 bottom-0 rounded-full
           transition-all duration-300;
  }
  
  .neu-toggle-slider:before {
    @apply absolute content-[''] h-5 w-5 left-0.5 bottom-0.5
           bg-[#e0e0e0] rounded-full transition-all duration-300;
    box-shadow: 2px 2px 4px #bebebe,
                -1px -1px 2px #ffffff;
  }
  
  input:checked + .neu-toggle-slider {
    @apply bg-indigo-500;
  }
  
  input:checked + .neu-toggle-slider:before {
    transform: translateX(24px);
  }
}

@layer utilities {
  .animate-float {
    animation: float 3s ease-in-out infinite;
  }
  
  .animate-pulse-soft {
    animation: pulse-soft 2s ease-in-out infinite;
  }
  
  .animate-slide-in {
    animation: slideIn 0.5s ease-out;
  }
  
  .animate-fade-in {
    animation: fadeIn 0.5s ease-out;
  }
  
  .text-shadow-neu {
    text-shadow: 2px 2px 4px #bebebe, -2px -2px 4px #ffffff;
  }
  
  .neu-convex {
    box-shadow: 8px 8px 16px #bebebe,
                -8px -8px 16px #ffffff;
  }
  
  .neu-concave {
    box-shadow: inset 8px 8px 16px #bebebe,
                inset -8px -8px 16px #ffffff;
  }
  
  .neu-pressed {
    box-shadow: inset 4px 4px 8px #bebebe,
                inset -4px -4px 8px #ffffff;
  }
}
"@

$indexCss | Out-File -FilePath "src/index.css" -Encoding UTF8
Write-Color "✅ src/index.css updated with neumorphism styles" $colors.Green
Write-Host ""

# ================================================
# STEP 5: Create components directory and Navbar
# ================================================
Write-Color "Step 5: Creating components..." $colors.Cyan

# Create components directory
if (-not (Test-Path "src/components")) {
    New-Item -ItemType Directory -Path "src/components" -Force | Out-Null
}

# Create Navbar component
$navbarComponent = @"
import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [user, setUser] = useState(null);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      setUser(JSON.parse(userData));
    }
  }, [location]);

  const handleLogout = () => {
    localStorage.clear();
    setUser(null);
    navigate('/login');
  };

  const isActive = (path) => {
    return location.pathname === path ? 'active' : '';
  };

  return (
    <nav className="neu-nav">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <div className="flex items-center space-x-8">
          <Link to="/" className="text-2xl font-bold text-indigo-600">
            FreelanceHub
          </Link>
          
          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-4">
            <Link to="/jobs" className={`neu-nav-item ${isActive('/jobs')}`}>
              Jobs
            </Link>
            
            {user?.user_type === 'recruiter' && (
              <>
                <Link to="/recruiter/post-job" className={`neu-nav-item ${isActive('/recruiter/post-job')}`}>
                  Post a Job
                </Link>
                <Link to="/recruiter/dashboard" className={`neu-nav-item ${isActive('/recruiter/dashboard')}`}>
                  Dashboard
                </Link>
              </>
            )}
            
            {user?.user_type === 'freelancer' && (
              <Link to="/freelancer/profile" className={`neu-nav-item ${isActive('/freelancer/profile')}`}>
                My Profile
              </Link>
            )}
          </div>
        </div>

        <div className="flex items-center space-x-4">
          {user ? (
            <>
              <div className="neu-avatar neu-avatar-md">
                <span className="text-indigo-600 font-semibold">
                  {user.first_name?.charAt(0) || user.username?.charAt(0)}
                </span>
              </div>
              <span className="hidden md:block text-gray-700">
                {user.first_name || user.username}
              </span>
              <button
                onClick={handleLogout}
                className="neu-btn"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="neu-btn hidden md:block">
                Login
              </Link>
              <Link to="/register" className="neu-btn-primary">
                Sign Up
              </Link>
            </>
          )}

          {/* Mobile menu button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden neu-btn p-2"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {isOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden mt-4 space-y-2 animate-slide-in">
          <Link to="/jobs" className="block neu-nav-item w-full text-center" onClick={() => setIsOpen(false)}>
            Jobs
          </Link>
          
          {user?.user_type === 'recruiter' && (
            <>
              <Link to="/recruiter/post-job" className="block neu-nav-item w-full text-center" onClick={() => setIsOpen(false)}>
                Post a Job
              </Link>
              <Link to="/recruiter/dashboard" className="block neu-nav-item w-full text-center" onClick={() => setIsOpen(false)}>
                Dashboard
              </Link>
            </>
          )}
          
          {user?.user_type === 'freelancer' && (
            <Link to="/freelancer/profile" className="block neu-nav-item w-full text-center" onClick={() => setIsOpen(false)}>
              My Profile
            </Link>
          )}
          
          {!user && (
            <Link to="/login" className="block neu-nav-item w-full text-center" onClick={() => setIsOpen(false)}>
              Login
            </Link>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
"@

$navbarComponent | Out-File -FilePath "src/components/Navbar.js" -Encoding UTF8
Write-Color "✅ Navbar component created" $colors.Green
Write-Host ""

# ================================================
# STEP 6: Create API service
# ================================================
Write-Color "Step 6: Creating API service..." $colors.Cyan

if (-not (Test-Path "src/services")) {
    New-Item -ItemType Directory -Path "src/services" -Force | Out-Null
}

$apiService = @"
import axios from 'axios';

const API_URL = 'http://127.0.0.1:8000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('access_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    console.log('API Request:', config.method.toUpperCase(), config.url, config.data);
    return config;
  },
  (error) => {
    console.error('Request Error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => {
    console.log('API Response:', response.status, response.data);
    return response;
  },
  async (error) => {
    console.error('API Error:', error.response?.status, error.response?.data);
    
    const originalRequest = error.config;
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        const refresh = localStorage.getItem('refresh_token');
        const response = await axios.post(`${API_URL}/accounts/token/refresh/`, {
          refresh,
        });
        localStorage.setItem('access_token', response.data.access);
        api.defaults.headers.common['Authorization'] = `Bearer ${response.data.access}`;
        return api(originalRequest);
      } catch (refreshError) {
        console.error('Token refresh failed:', refreshError);
        localStorage.clear();
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

// Auth APIs
export const authAPI = {
  register: (userData) => api.post('/accounts/register/', userData),
  login: (credentials) => api.post('/accounts/login/', credentials),
  getUser: () => api.get('/accounts/user/'),
};

// Profile APIs
export const profileAPI = {
  getProfile: () => api.get('/accounts/freelancer-profile/'),
  createProfile: (profileData) => api.post('/accounts/freelancer-profile/', profileData),
  updateProfile: (id, profileData) => api.put(`/accounts/freelancer-profile/${id}/`, profileData),
};

// Job APIs
export const jobAPI = {
  getJobs: () => api.get('/accounts/jobs/'),
  getJob: (id) => api.get(`/accounts/jobs/${id}/`),
  createJob: (jobData) => api.post('/accounts/jobs/', jobData),
  updateJob: (id, jobData) => api.put(`/accounts/jobs/${id}/`, jobData),
  deleteJob: (id) => api.delete(`/accounts/jobs/${id}/`),
};

// Application APIs
export const applicationAPI = {
  getApplications: () => api.get('/accounts/applications/'),
  getMyApplications: () => api.get('/accounts/applications/my-applications/'),
  applyForJob: (applicationData) => api.post('/accounts/applications/', applicationData),
  updateApplication: (id, status) => api.patch(`/accounts/applications/${id}/`, { status }),
};

// Notification APIs
export const notificationAPI = {
  getNotifications: () => api.get('/accounts/notifications/'),
  markAsRead: (id) => api.patch(`/accounts/notifications/${id}/mark-read/`, { is_read: true }),
  markAllAsRead: () => api.post('/accounts/notifications/mark-all-read/'),
};

// Skills APIs
export const skillsAPI = {
  getSkills: () => api.get('/accounts/skills/'),
  getTechStacks: () => api.get('/accounts/tech-stacks/'),
  createSkill: (name) => api.post('/accounts/skills/', { name }),
  createTechStack: (name) => api.post('/accounts/tech-stacks/', { name }),
};

export default api;
"@

$apiService | Out-File -FilePath "src/services/api.js" -Encoding UTF8
Write-Color "✅ API service created" $colors.Green
Write-Host ""

# ================================================
# STEP 7: Create Test Page
# ================================================
Write-Color "Step 7: Creating test page..." $colors.Cyan

$testPage = @"
import React, { useState } from 'react';

const TestPage = () => {
  const [showModal, setShowModal] = useState(false);
  const [toggle, setToggle] = useState(false);

  return (
    <div className="space-y-12 p-8">
      <h1 className="text-4xl font-bold text-gray-800 text-center mb-12">
        Neumorphism UI Components
      </h1>
      
      {/* Cards Section */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold text-gray-700 mb-6">Cards</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="neu-card animate-float">
            <h3 className="text-xl font-semibold mb-2">Standard Card</h3>
            <p className="text-gray-600">Basic neumorphism card with floating animation.</p>
            <div className="mt-4 flex justify-end">
              <span className="neu-badge neu-badge-primary">New</span>
            </div>
          </div>
          
          <div className="neu-card-sm">
            <h3 className="text-lg font-semibold mb-2">Small Card</h3>
            <p className="text-gray-600">Compact card design for less content.</p>
          </div>
          
          <div className="neu-card-lg">
            <h3 className="text-2xl font-semibold mb-2">Large Card</h3>
            <p className="text-gray-600">Bigger card for featured content with more space.</p>
          </div>
        </div>
      </section>

      {/* Buttons Section */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold text-gray-700 mb-6">Buttons</h2>
        <div className="flex flex-wrap gap-4">
          <button className="neu-btn">Default</button>
          <button className="neu-btn-primary">Primary</button>
          <button className="neu-btn-success">Success</button>
          <button className="neu-btn-danger">Danger</button>
          <button className="neu-btn" disabled>Disabled</button>
        </div>
      </section>

      {/* Inputs Section */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold text-gray-700 mb-6">Input Fields</h2>
        <div className="grid grid-cols-1 md:grid-cols