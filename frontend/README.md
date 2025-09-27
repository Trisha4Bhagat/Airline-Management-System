# Airline Reservation System Frontend

This is the frontend application for the Airline Reservation System, built with React, TypeScript, and Material UI.

## Features

- Modern UI/UX with Material Design
- Responsive design for desktop and mobile devices
- Interactive flight search and booking functionality
- User authentication and profile management
- Dashboard with booking history and stats

## Getting Started

### Prerequisites

- Node.js 16+ and npm

### Installation

1. Install dependencies:
   ```bash
   npm install
   ```

2. Start the development server:
   ```bash
   npm run dev
   ```

3. Open your browser and navigate to:
   ```
   http://localhost:5173
   ```

## Project Structure

```
src/
├── components/     # Reusable UI components
│   ├── common/     # Layout and shared components
│   └── flights/    # Flight-related components
├── pages/          # Page components
├── services/       # API services
├── types/          # TypeScript type definitions
└── utils/          # Utility functions
```

## Available Scripts

- `npm run dev` - Start the development server
- `npm run build` - Build for production
- `npm run lint` - Run ESLint
- `npm run preview` - Preview the production build

## Backend Integration

The frontend connects to the FastAPI backend running at `http://localhost:8000`.