# FleaHub Campus Marketplace

🔗 [Live Demo](https://fleahub-campus-app.vercel.app/)

A modern second-hand trading platform designed specifically for university students, enabling safe and convenient on-campus transactions with real-time interaction features.

## Tech Stack

### Frontend

- **Framework**: Next.js 14 with App Router
- **Language**: TypeScript
- **UI/Styling**:
  - Tailwind CSS for responsive design
  - shadcn/ui for component library
  - Optimistic UI updates for better user experience
- **State Management**: React Context API for global states
- **Data Fetching**: Server-side rendering with Next.js

### Backend

- **Database**: Supabase (PostgreSQL)
- **Authentication**:
  - Google OAuth integration
  - Server-side authentication
  - Middleware for route protection
- **Storage**: Supabase storage for image uploads
- **Data Generation**: Python scripts for test data generation

## Key Features

### Item Management

- Create, edit, reserve and delete items with multiple image uploads
- Real-time item status updates
- Advanced filtering and options
- Automatic status synchronization with appointments
- Comprehensive item details display with image gallery

### Trading System

- Create, edit, approve and cancel the appointments
- Appointment scheduling system with status tracking
- Intuitive wishlist management with optimistic updates
- Safe transaction process with meetup coordination
- Role-based access control for buyers and sellers

## Deployment

- Frontend deployed on Vercel
- Database and authentication hosted on Supabase

## Future Enhancements

- Responsive design for all devices
- Enhanced search functionality
- Message box implementation
- Theme customization
- User settings management
- Performance optimization
