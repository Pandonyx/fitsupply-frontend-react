# FitSupply - Fitness Supplements E-Commerce Frontend

A modern, responsive e-commerce web application built with React and Vite for browsing and purchasing fitness supplements.

![React](https://img.shields.io/badge/React-18-blue)
![Vite](https://img.shields.io/badge/Vite-5-purple)
![License](https://img.shields.io/badge/License-MIT-green)

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Getting Started](#getting-started)
- [Project Structure](#project-structure)
- [Available Scripts](#available-scripts)
- [Environment Variables](#environment-variables)
- [API Integration](#api-integration)
- [State Management](#state-management)
- [Routing](#routing)
- [Authentication](#authentication)
- [Testing](#testing)
- [Deployment](#deployment)
- [Contributing](#contributing)
- [License](#license)

## Overview

FitSupply is a full-featured e-commerce frontend application that provides users with a seamless shopping experience for fitness supplements. The application includes product browsing, cart management, checkout with mock payment, order tracking, and user profile management.

## Features

### Customer Features

- **Product Browsing**

  - Grid layout with responsive columns
  - Category filtering
  - Product search
  - Sort by price, name, or date
  - Product detail pages with full information

- **Shopping Cart**

  - Add/remove items
  - Update quantities
  - Real-time price calculations
  - Persistent cart state

- **Checkout Process**

  - Shipping address form
  - Billing address (separate or same as shipping)
  - Mock Stripe payment integration
  - Order confirmation

- **User Account**
  - Registration and login
  - Profile management
  - Order history
  - Order tracking with status updates

### UI/UX Features

- Fully responsive design (mobile-first)
- Loading states and animations
- Error handling with user-friendly messages
- Empty states with calls-to-action
- Toast notifications for user actions

## Tech Stack

- **React 18** - UI library
- **Vite** - Build tool and dev server
- **React Router DOM** - Client-side routing
- **Zustand** - State management
- **Material UI (MUI)** - Component library
- **Tailwind CSS** - Utility-first CSS framework
- **Axios** - HTTP client
- **ESLint** - Code linting

## Getting Started

### Prerequisites

- Node.js 16+ and npm
- Git

### Installation

1. Clone the repository

```bash
git clone https://github.com/Pandonyx/fitsupply-frontend-react.git
cd fitsupply-frontend-react
```

2. Install dependencies

```bash
npm install
```

3. Create environment file

```bash
cp .env.example .env
```

4. Configure environment variables in `.env`

```env
VITE_API_BASE_URL=https://pandonyx.pythonanywhere.com/api/v1
```

5. Start development server

```bash
npm run dev
```

The app will be available at `http://localhost:5173`

## Project Structure

```
src/
├── components/
│   ├── common/              # Reusable components
│   │   ├── ProductCard.jsx
│   │   ├── ProductGallery.jsx
│   │   └── index.js
│   └── layout/              # Layout components
│       ├── Navbar.jsx
│       ├── Footer.jsx
│       └── index.js
├── pages/                   # Page components
│   ├── auth/
│   │   ├── Login.jsx
│   │   └── Register.jsx
│   ├── products/
│   │   ├── index.jsx        # Product listing
│   │   └── [slug].jsx       # Product detail
│   ├── Cart.jsx
│   ├── Checkout.jsx
│   ├── Landing.jsx
│   ├── OrderDetail.jsx
│   ├── OrderSuccess.jsx
│   └── Profile.jsx
├── services/                # API services
│   └── api.js
├── store/                   # Zustand stores
│   └── index.js
├── App.jsx                  # Main app component
├── App.css
├── index.css
└── main.jsx                 # App entry point
```

## Available Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build
npm run lint         # Run ESLint
```

## Environment Variables

Create a `.env` file in the root directory:

```env
VITE_API_BASE_URL=your_api_url_here
```

**Note:** Vite requires environment variables to be prefixed with `VITE_`

## API Integration

The application communicates with a RESTful API. Key endpoints include:

- **Auth:** `/register/`, `/token/`, `/token/refresh/`, `/user/`
- **Products:** `/products/`, `/products/{slug}/`
- **Categories:** `/categories/`
- **Cart:** `/cart/`, `/cart/add/`, `/cart/items/{id}/`
- **Orders:** `/orders/`, `/orders/{id}/`

API requests include:

- JWT token authentication
- Automatic token refresh
- Error handling and logging

See `src/services/api.js` for complete API implementation.

## State Management

The application uses **Zustand** for state management with the following stores:

### Auth Store

- User authentication state
- Login/logout actions
- Profile management
- Token handling

### Products Store

- Product listing
- Filtering and search
- Current product details

### Categories Store

- Category data

### Cart Store

- Cart items
- Add/update/remove operations
- Total calculations

### Orders Store

- Order history
- Order details
- Order creation

## Routing

```
/                           # Landing page
/products                   # Product listing
/products/:slug             # Product detail
/login                      # Login page
/register                   # Registration page
/cart                       # Shopping cart (protected)
/checkout                   # Checkout (protected)
/order-success/:orderNumber # Order confirmation (protected)
/orders/:id                 # Order details (protected)
/profile                    # User profile (protected)
```

Protected routes require authentication and redirect to `/login` if the user is not authenticated.

## Authentication

### JWT Token Flow

1. User logs in with credentials
2. API returns access and refresh tokens
3. Tokens stored in localStorage
4. Access token sent with all API requests via interceptor
5. Automatic token refresh on 401 errors
6. Logout clears tokens and redirects to home

### Protected Routes

- Cart, Checkout, Profile, and Orders require authentication
- Unauthenticated users are redirected to login page
- Authentication state persists across page refreshes

## Testing

### Manual Testing Checklist

- [ ] Register new user
- [ ] Login with credentials
- [ ] Browse and filter products
- [ ] Search products
- [ ] View product details
- [ ] Add items to cart
- [ ] Update cart quantities
- [ ] Remove items from cart
- [ ] Checkout process
- [ ] Mock payment (use test card: 4242 4242 4242 4242)
- [ ] View order confirmation
- [ ] Check order history in profile
- [ ] View order details
- [ ] Edit profile information
- [ ] Logout

### Test Cards (Mock Payment)

```
Card Number: 4242 4242 4242 4242
Expiry: Any future date
CVV: Any 3 digits
```

## Deployment

### Build for Production

```bash
npm run build
```

Output will be in the `dist/` directory.

### Deployment Platforms

- **Netlify:** Connect GitHub repo, set build command to `npm run build`, publish directory to `dist`
- **Vercel:** Import project, Vercel auto-detects Vite configuration
- **GitHub Pages:** Use `gh-pages` package or GitHub Actions
- **AWS S3 + CloudFront:** Upload `dist/` contents to S3 bucket

### Environment Variables in Production

Make sure to set `VITE_API_BASE_URL` in your deployment platform's environment variables.

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Performance

- Bundle size: ~589KB (gzipped: ~181KB)
- First load optimized with Vite
- Code splitting by route
- Material UI tree-shaking enabled

## Known Issues

- None currently

## Future Enhancements

- [ ] Admin dashboard
- [ ] Product reviews and ratings
- [ ] Wishlist functionality
- [ ] Real Stripe payment integration
- [ ] Email notifications
- [ ] Advanced search filters
- [ ] Product recommendations
- [ ] Social sharing

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Author

Pandonyx - [GitHub](https://github.com/Pandonyx)

## Acknowledgments

- Material UI for component library
- Tailwind CSS for styling utilities
- Zustand for state management
- Vite for blazing fast development experience

---

**Note:** This is a frontend-only application that connects to an external API. The backend API is not included in this repository.
