# School Website Frontend

This is a React-based frontend application for a school website, built with modern web technologies.

## WEB URL
sspublicschool.vercel.app

## Features

- Responsive design
- Modern UI components
- Smooth animations
- SEO-friendly
- Accessible
- Gallery Management System

## Prerequisites

- Node.js v14 or higher
- npm package manager
- Supabase account and project

## Setup

1. Clone the repository:
   ```
   git clone <repository-url>
   cd School-demo
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Configure environment variables:
   - Copy `.env.example` to `.env`
   - Update the Supabase credentials in the `.env` file



## Running the Application

### Development Server

```
npm run dev
```

This starts the Vite development server.

### Production Build

```
npm run build
```

This creates a production build in the `dist` directory.

### Preview Production Build

```
npm run preview
```

This serves the production build locally for testing.

## Project Structure

- `/src` - Source code
  - `/components` - Reusable React components
  - `/pages` - Page components
  - `/styles` - CSS styles
  - `/utils` - Utility functions
  - `/__tests__` - Test files
- `/public` - Static assets
  - Images
  - Fonts
  - Other static files

## Technologies Used

- React
- React Router
- Vite
- Bootstrap
- AOS (Animate On Scroll)
- React Helmet
- Supabase (for backend services)

## Gallery Management System

This project includes a comprehensive gallery management system that allows administrators to:
- Upload images directly from the admin panel
- Organize images into categories
- Delete images and categories
- View all images in a responsive gallery

The gallery management system allows administrators to upload, organize, and manage images directly from the admin panel.

## License

ISC