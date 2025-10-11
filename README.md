# TokoKita E-Commerce Platform

## Project Description

TokoKita is a modern e-commerce platform built with a decoupled architecture featuring a separate API backend and a client-side frontend. It provides a complete online shopping experience for users and a powerful management panel for administrators to manage products and orders.

## Tech Stack

- **Backend:** Laravel
- **Frontend:** React (Vite)
- **Database:** MySQL
- **Styling:** Tailwind CSS

## Project Structure

```
TokoKita/
├── backend/                  # Laravel Project (API)
│   ├── app/
│   │   ├── Http/
│   │   │   ├── Controllers/  # Logic for handling API requests
│   │   │   └── Middleware/   # Filters for HTTP requests (e.g., IsAdmin)
│   │   ├── Models/           # Database table representations (Eloquent)
│   │   └── Notifications/    # Classes for notifications (e.g., new order)
│   ├── config/               # Project configuration files
│   ├── database/
│   │   ├── migrations/       # Database schema definitions
│   │   └── seeders/          # Database seeders for initial data
│   └── routes/
│       └── api.php           # API endpoint definitions
├── frontend/                 # React Project (Client)
│   ├── public/               # Public assets not processed by Vite
│   └── src/
│       ├── api/              # Axios client configuration for API communication
│       ├── components/       # Reusable UI components
│       ├── contexts/         # Global state management (Auth, Cart, etc.)
│       ├── layouts/          # Page layout components (Main, Admin, Auth)
│       ├── pages/            # Components for each application page
│       └── App.jsx           # Main application component and routing
└── README.md                 # This documentation file
```
> **Note:** For a more detailed breakdown of the `backend` and `frontend` directories, please refer to the `README.md` files located within each respective folder.

## Installation and Setup Guide

### 1. Prerequisites
Ensure the following software is installed on your machine:
- PHP (v8.1+ recommended)
- Composer
- Node.js & NPM
- A MySQL Server (XAMPP, Laragon, or other solutions are recommended)

### 2. Initial Setup
1. Clone this repository:
   ```bash
   git clone https://github.com/mohamadsolkhannawawi/Project-PBP-Mini-Commerce.git
   ```
2. Navigate into the project directory:
   ```bash
   cd Project-PBP-Mini-Commerce
   ```

### 3. Backend Configuration (Laravel)
1. Navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Install PHP dependencies:
   ```bash
   composer install
   ```
3. Create the environment file by copying the example:
   ```bash
   cp .env.example .env
   or
   copy .env.example .env
   ```
4. Generate the application key:
   ```bash
   php artisan key:generate
   ```
5. Open the `.env` file and configure your database connection:
   ```env
   DB_CONNECTION=mysql
   DB_HOST=127.0.0.1
   DB_PORT=3306
   DB_DATABASE=tokokita_db  // Choose a name for your database
   DB_USERNAME=root         // Your database username
   DB_PASSWORD=             // Your database password
   ```
6. **Database Setup:**
   - Start your MySQL server.
   - Create a new database with the name you specified in the `.env` file (e.g., `db_umkm_minicommerce`).
   - Run the database migrations and seeders to create the tables and populate them with initial data:
     ```bash
     php artisan migrate --seed
     ```
7. Run the backend development server:
   ```bash
   php artisan serve
   ```
   The API will be available at `http://127.0.0.1:8000`.

### 4. Frontend Configuration (React)
1. Open a new terminal and navigate to the frontend directory:
   ```bash
   cd frontend
   ```
2. Install JavaScript dependencies:
   ```bash
   npm install
   ```
3. Create an environment file if it doesn't exist, but this version not required:
   ```bash
   cp .env.example .env
   or
   copy .env.example .env
   ```
4. Open the `.env` file and ensure the API base URL is correct, but this version not required:
   ```env
   VITE_API_BASE_URL=http://127.0.0.1:8000
   ```
5. Run the frontend development server:
   ```bash
   npm run dev
   ```

### 5. Accessing the Application
- Open your browser and navigate to the URL provided by Vite (usually `http://localhost:5173`).