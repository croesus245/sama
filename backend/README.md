# MWG Hostels Backend API

## Quick Start

1. Install dependencies:
   ```bash
   npm install
   ```

2. Configure environment:
   ```bash
   cp .env.example .env
   # Edit .env with your actual values
   ```

3. Start MongoDB (make sure MongoDB is running)

4. Run the server:
   ```bash
   # Development
   npm run dev
   
   # Production
   npm start
   ```

## API Endpoints

- **Auth**: `/api/auth/*`
- **Users**: `/api/users/*`
- **Properties**: `/api/properties/*`
- **Roommates**: `/api/roommates/*`
- **Bookings**: `/api/bookings/*`
- **Realtors**: `/api/realtors/*`
- **Reviews**: `/api/reviews/*`

## Features

- ✅ User authentication & authorization
- ✅ Student verification system
- ✅ Property management
- ✅ Roommate matching
- ✅ Real-time messaging
- ✅ Payment processing
- ✅ Email notifications
- ✅ File uploads
- ✅ Rate limiting
- ✅ Input validation
- ✅ Error handling

## Environment Variables

See `.env.example` for all required environment variables.

## Database

This project uses MongoDB. Make sure MongoDB is installed and running.

## Documentation

API documentation available at: `/api/docs` (when implemented)
