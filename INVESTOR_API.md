# Investor API Documentation

## Overview
The Investor API provides endpoints for investor registration, authentication, property management, messaging, and offer functionality.

## Base URL
```
http://localhost:3000/investors
```

## Authentication
Most endpoints require authentication using JWT tokens. Include the token in the Authorization header:
```
Authorization: Bearer <your-jwt-token>
```

## Endpoints

### Authentication

#### 1. Investor Signup
**POST** `/signup`

Creates a new investor account with email verification.

**Request Body:**
```json
{
  "firstName": "John",
  "lastName": "Doe",
  "email": "john.doe@example.com",
  "password": "SecurePass123!",
  "receiveTexts": true,
  "termsAccepted": true,
  "privacyAccepted": true
}
```

**Password Requirements:**
- Minimum 8 characters
- At least one uppercase letter
- At least one lowercase letter
- At least one digit
- At least one special character

**Response:**
```json
{
  "message": "Investor account created successfully. Please check your email for verification OTP.",
  "email": "john.doe@example.com"
}
```

#### 2. Investor Login
**POST** `/login`

Authenticates investor and sends OTP for verification.

**Request Body:**
```json
{
  "email": "john.doe@example.com",
  "password": "SecurePass123!"
}
```

**Response:**
```json
{
  "message": "OTP sent to your email for login verification",
  "email": "john.doe@example.com"
}
```

#### 3. Verify OTP
**POST** `/verify-otp`

Verifies OTP and completes login process.

**Request Body:**
```json
{
  "email": "john.doe@example.com",
  "otp": "123456"
}
```

**Response:**
```json
{
  "message": "Login successful",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "investor": {
    "id": "60f7b3b3b3b3b3b3b3b3b3b3",
    "email": "john.doe@example.com",
    "firstName": "John",
    "lastName": "Doe",
    "isEmailVerified": true,
    "isActive": true
  }
}
```

#### 4. Verify Email
**POST** `/verify-email`

Verifies email during signup process.

**Request Body:**
```json
{
  "email": "john.doe@example.com",
  "otp": "123456"
}
```

#### 5. Resend OTP
**POST** `/resend-otp`

Resends OTP to investor's email.

**Request Body:**
```json
{
  "email": "john.doe@example.com"
}
```

### Profile Management

#### 6. Get Profile
**GET** `/profile`

Retrieves investor profile information.

**Headers:**
```
Authorization: Bearer <token>
```

**Response:**
```json
{
  "id": "60f7b3b3b3b3b3b3b3b3b3b3",
  "firstName": "John",
  "lastName": "Doe",
  "email": "john.doe@example.com",
  "phone": "+1234567890",
  "isEmailVerified": true,
  "isActive": true,
  "receiveTexts": true,
  "savedProperties": [],
  "favoriteProperties": [],
  "preferences": {
    "propertyTypes": [],
    "priceRange": { "min": 0, "max": 0 },
    "locations": [],
    "bedrooms": 0,
    "bathrooms": 0
  }
}
```

#### 7. Update Profile
**PUT** `/profile`

Updates investor profile information.

**Headers:**
```
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "firstName": "John",
  "lastName": "Smith",
  "phone": "+1234567890",
  "receiveTexts": false
}
```

### Offers

#### 8. Make Offer
**POST** `/offers`

Creates a new offer on a property.

**Headers:**
```
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "propertyId": "60f7b3b3b3b3b3b3b3b3b3b3",
  "offerAmount": 250000,
  "message": "I'm interested in this property",
  "terms": "30-day closing",
  "contingencies": 2
}
```

**Response:**
```json
{
  "message": "Offer submitted successfully",
  "offer": {
    "id": "60f7b3b3b3b3b3b3b3b3b3b3",
    "propertyId": "60f7b3b3b3b3b3b3b3b3b3b3",
    "offerAmount": 250000,
    "status": "pending",
    "expiresAt": "2024-01-15T10:00:00.000Z"
  }
}
```

#### 9. Get My Offers
**GET** `/offers`

Retrieves all offers made by the investor.

**Headers:**
```
Authorization: Bearer <token>
```

**Response:**
```json
[
  {
    "id": "60f7b3b3b3b3b3b3b3b3b3b3",
    "propertyId": {
      "id": "60f7b3b3b3b3b3b3b3b3b3b3",
      "title": "Beautiful Home",
      "address": "123 Main St",
      "price": 300000,
      "images": ["image1.jpg", "image2.jpg"]
    },
    "wholesalerId": {
      "id": "60f7b3b3b3b3b3b3b3b3b3b3",
      "firstName": "Jane",
      "lastName": "Smith",
      "email": "jane.smith@example.com"
    },
    "offerAmount": 250000,
    "status": "pending",
    "createdAt": "2024-01-08T10:00:00.000Z"
  }
]
```

#### 10. Get Offer Details
**GET** `/offers/:id`

Retrieves detailed information about a specific offer.

**Headers:**
```
Authorization: Bearer <token>
```

### Messaging

#### 11. Send Message
**POST** `/messages`

Sends a message to a wholesaler.

**Headers:**
```
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "recipientId": "60f7b3b3b3b3b3b3b3b3b3b3",
  "subject": "Property Inquiry",
  "message": "I'm interested in learning more about this property.",
  "propertyId": "60f7b3b3b3b3b3b3b3b3b3b3"
}
```

#### 12. Get Messages
**GET** `/messages`

Retrieves all messages for the investor.

**Headers:**
```
Authorization: Bearer <token>
```

#### 13. Mark Message as Read
**PUT** `/messages/:id/read`

Marks a message as read.

**Headers:**
```
Authorization: Bearer <token>
```

### Reviews

#### 14. Get Wholesaler Reviews
**GET** `/wholesalers/:id/reviews`

Retrieves reviews for a specific wholesaler.

**Headers:**
```
Authorization: Bearer <token>
```

**Response:**
```json
[
  {
    "id": "60f7b3b3b3b3b3b3b3b3b3b3",
    "rating": 5,
    "title": "Great experience",
    "comment": "Very professional and responsive",
    "reviewerId": {
      "firstName": "John",
      "lastName": "Doe"
    },
    "createdAt": "2024-01-08T10:00:00.000Z"
  }
]
```

#### 15. Get Wholesaler Rating
**GET** `/wholesalers/:id/rating`

Retrieves rating statistics for a wholesaler.

**Headers:**
```
Authorization: Bearer <token>
```

**Response:**
```json
{
  "averageRating": 4.5,
  "totalReviews": 10,
  "ratingBreakdown": {
    "1": 0,
    "2": 1,
    "3": 2,
    "4": 3,
    "5": 4
  }
}
```

### Property Management

#### 16. Save Property
**POST** `/properties/:id/save`

Saves a property to investor's saved list.

**Headers:**
```
Authorization: Bearer <token>
```

#### 17. Remove Saved Property
**DELETE** `/properties/:id/save`

Removes a property from investor's saved list.

**Headers:**
```
Authorization: Bearer <token>
```

#### 18. Get Saved Properties
**GET** `/properties/saved`

Retrieves all saved properties.

**Headers:**
```
Authorization: Bearer <token>
```

### Preferences

#### 19. Update Preferences
**PUT** `/preferences`

Updates investor's property preferences.

**Headers:**
```
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "propertyTypes": ["single-family", "condo"],
  "priceRange": {
    "min": 200000,
    "max": 500000
  },
  "locations": ["San Francisco", "Oakland"],
  "bedrooms": 3,
  "bathrooms": 2
}
```

## Error Responses

### 400 Bad Request
```json
{
  "statusCode": 400,
  "message": ["Password must contain at least one uppercase letter"],
  "error": "Bad Request"
}
```

### 401 Unauthorized
```json
{
  "statusCode": 401,
  "message": "Invalid credentials",
  "error": "Unauthorized"
}
```

### 403 Forbidden
```json
{
  "statusCode": 403,
  "message": "Access denied. Investor role required.",
  "error": "Forbidden"
}
```

### 404 Not Found
```json
{
  "statusCode": 404,
  "message": "Property not found",
  "error": "Not Found"
}
```

### 409 Conflict
```json
{
  "statusCode": 409,
  "message": "An investor with this email already exists",
  "error": "Conflict"
}
```

## Notes

1. **OTP Verification**: Every login requires OTP verification for security.
2. **Email Verification**: New accounts require email verification during signup.
3. **Password Security**: Passwords are hashed using bcrypt with 12 salt rounds.
4. **JWT Tokens**: Tokens expire after 24 hours.
5. **Role-based Access**: All protected endpoints require investor role verification.
6. **Data Validation**: All input data is validated using class-validator decorators. 