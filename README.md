# InvestorLift Backend

A NestJS backend for the InvestorLift platform with user authentication and OTP verification.

## Features

- User authentication with email/password
- OTP verification via email
- JWT token-based authentication
- MongoDB integration
- Email notifications using Nodemailer
- Input validation and sanitization
- CORS enabled for frontend integration

## Prerequisites

- Node.js (v16 or higher)
- MongoDB (local or cloud)
- SMTP email service (Gmail, SendGrid, etc.)

## Installation

1. Install dependencies:
```bash
npm install
```

2. Create a `.env` file in the root directory with the following variables:
```env
# Database
MONGODB_URI=mongodb://localhost:27017/investorlift

# JWT
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production

# Email Configuration (Gmail example)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password

# App Configuration
PORT=3001
NODE_ENV=development
```

3. Start the development server:
```bash
npm run dev
```

The server will start on `http://localhost:3001`

## API Endpoints

### Authentication

- `POST /auth/login` - Login with email and password
- `POST /auth/verify-otp` - Verify OTP and complete login

### Request Examples

#### Login
```json
POST /auth/login
{
  "email": "test@investorlift.com",
  "password": "test123"
}
```

#### Verify OTP
```json
POST /auth/verify-otp
{
  "email": "test@investorlift.com",
  "otp": "123456"
}
```

## Test Users

The application automatically creates test users on startup:

- **Admin User:**
  - Email: `admin@investorlift.com`
  - Password: `admin123`
  - Role: `admin`

- **Test User:**
  - Email: `test@investorlift.com`
  - Password: `test123`
  - Role: `user`

## Email Configuration

To use Gmail SMTP:

1. Enable 2-factor authentication on your Gmail account
2. Generate an App Password
3. Use the App Password in the `SMTP_PASS` environment variable

## Development

- `npm run dev` - Start development server with hot reload
- `npm run build` - Build for production
- `npm run start:prod` - Start production server
- `npm run test` - Run tests
- `npm run lint` - Run ESLint

## Project Structure

```
src/
├── auth/                 # Authentication module
│   ├── dto/             # Data transfer objects
│   ├── templates/       # Email templates
│   ├── auth.controller.ts
│   ├── auth.service.ts
│   └── auth.module.ts
├── users/               # Users module
│   ├── schemas/         # MongoDB schemas
│   ├── users.service.ts
│   └── users.module.ts
├── seed/                # Database seeding
│   └── seed.service.ts
├── app.controller.ts
├── app.service.ts
├── app.module.ts
└── main.ts
```
