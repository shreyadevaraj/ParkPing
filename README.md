# ParkPing

ParkPing is a QR-code based vehicle management solution that allows users to anonymously notify vehicle owners when their car is blocking the way, without sharing personal phone numbers.

## Features
- **Anonymous Notification**: Notify vehicle owners via SMS or automated voice calls using Twilio.
- **Secure Authentication**: OTP-based login and signup with JWT persistence.
- **Vehicle Management**: QR code generation for vehicle identification.
- **Privacy Focused**: No personal phone numbers are shared between the notifier and the owner.

## Tech Stack
- **Frontend**: React, Vite, TailwindCSS
- **Backend**: Spring Boot 3, Java 17, PostgreSQL
- **Database**: PostgreSQL
- **External Services**: Twilio (SMS & Voice)

## Setup Instructions

### Prerequisites
- Java 17+
- Node.js & npm
- PostgreSQL database (running on port 5432)
- Twilio Account (for SMS/Voice features)

### Backend Setup
1.  Navigate to the `backend` directory.
2.  Update `src/main/resources/application.properties` with your credentials:
    ```properties
    spring.datasource.password=YOUR_DB_PASSWORD
    jwt.secret=YOUR_SECURE_RANDOM_SECRET_KEY
    twilio.account_sid=YOUR_TWILIO_SID
    twilio.auth_token=YOUR_TWILIO_AUTH_TOKEN
    twilio.phone_number=YOUR_TWILIO_PHONE_NUMBER
    ```
3.  Run the application:
    ```bash
    mvn spring-boot:run
    ```

### Frontend Setup
1.  Navigate to the `frontend` directory.
2.  Install dependencies:
    ```bash
    npm install
    ```
3.  Start the development server:
    ```bash
    npm run dev
    ```
4.  Open [http://localhost:5173](http://localhost:5173) in your browser.

## API Documentation
The backend runs on port 8080 by default. Key endpoints:
- `POST /api/auth/login`: Send OTP for login.
- `POST /api/ping/{token}`: Send anonymous notification to vehicle owner.
