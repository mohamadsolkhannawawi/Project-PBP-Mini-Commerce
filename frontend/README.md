# Frontend Application (React + Vite)

This document provides a detailed breakdown of the `frontend` directory structure, which houses the React-based client application.

## Directory Structure

```
frontend/
├── public/                     # Static assets directly served to the browser
│   ├── no-image.webp           # Placeholder image for products without one
│   └── vite.svg                # Vite logo
├── src/                        # Main application source code
│   ├── api/
│   │   └── axiosClient.js      # Centralized Axios instance for making API requests to the backend
│   ├── assets/                 # Static assets like images and SVGs processed by Vite
│   ├── components/             # Reusable React components used across multiple pages
│   │   ├── admin/              # Components specific to the admin dashboard
│   │   ├── BannerSlider.jsx    # Component for the homepage image slider
│   │   ├── CartItem.jsx        # Component for a single item in the shopping cart
│   │   ├── Navbar.jsx          # Top navigation bar for the application
│   │   ├── ProductCard.jsx     # Card component to display a single product
│   │   ├── ProtectedRoute.jsx  # Wrapper to protect routes requiring admin access
│   │   └── ...                 # Other reusable components
│   ├── contexts/               # Global state management using React Context API
│   │   ├── AuthContext.jsx     # Manages user authentication state and data
│   │   ├── CartContext.jsx     # Manages the state of the shopping cart
│   │   └── ToastContext.jsx    # Manages display of toast notifications
│   ├── layouts/                # Components that define the structure of pages
│   │   ├── AdminLayout.jsx     # Layout for the admin dashboard pages
│   │   ├── AuthLayout.jsx      # Layout for login and registration pages
│   │   └── MainLayout.jsx      # Main layout for general user-facing pages
│   ├── pages/                  # Top-level components representing application pages/routes
│   │   ├── admin/              # Pages for the admin dashboard (e.g., product management)
│   │   ├── CartPage.jsx        # Page displaying the shopping cart
│   │   ├── CheckoutPage.jsx    # Page for the user checkout process
│   │   ├── HomePage.jsx        # The application's landing page
│   │   ├── LoginPage.jsx       # User login page
│   │   └── ...                 # Other page components
│   ├── utils/                  # Utility functions
│   │   └── imageUtils.js       # Functions for handling image URLs or placeholders
│   ├── App.jsx                 # The root component, defines application routes
│   ├── index.css               # Global CSS styles
│   └── main.jsx                # The entry point for the React application
├── .gitignore                  # Specifies files and folders to be ignored by Git
├── index.html                  # The HTML template for the single-page application
├── package.json                # Lists project dependencies and npm scripts
├── tailwind.config.js          # Configuration file for the Tailwind CSS framework
└── vite.config.js              # Configuration file for the Vite build tool
```