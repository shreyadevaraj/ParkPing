# ParkPing 🚗📲

> **The Privacy-First Solution for Urban Parking Management**

![Java](https://img.shields.io/badge/Java-17-orange)
![Spring Boot](https://img.shields.io/badge/Spring_Boot-3.2-green)
![React](https://img.shields.io/badge/React-18-blue)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16-336791)
![Twilio](https://img.shields.io/badge/Twilio-API-red)
![JWT](https://img.shields.io/badge/Security-JWT-black)

## 💡 The Problem
In dense urban environments, **double parking** is unavoidable. However, contacting the vehicle owner often leads to:
1.  **Privacy Risks**: Sharing personal phone numbers with strangers.
2.  **Delays**: Searching for security guards or honking endlessly.
3.  **Conflict**: Frustrated interactions due to lack of communication.

## 🚀 The Solution
**ParkPing** bridges the gap between vehicle owners and blocked drivers **anonymously**. By placing a secure QR code on their vehicle, owners can be notified instantly via SMS or automated voice calls without ever revealing their contact details.

## ✨ Key Features

### 🔒 Privacy-Centric Communication
- **Anonymous P2P Messaging**: Connects parties without exchanging phone numbers.
- **Secure Handling**: All contact data is encrypted and handled server-side.

### 📞 Multi-Channel Alerts (Twilio Integration)
- **Instant SMS**: Delivers pre-formatted, polite notification messages.
- **Automated Voice Calls**: Triggers a phone call to the owner for urgent situations (e.g., "Your car is blocking someone").

### 🛡️ Enterprise-Grade Security
- **JWT Authentication**: Stateless, persistent user sessions using JSON Web Tokens.
- **Secure Onboarding**: OTP-based login and registration flow.
- **CSRF & CORS Protection**: configured for modern web standards.

### 🧠 Intelligent Logic
- **Rate Limiting**: Prevents spamming owners (Max 3 pings/10 mins per device).
- **Escalation Workflow**: Automatically provides "Notify Management" options if the owner is unresponsive.
- **DND Mode**: Owners can set "Do Not Disturb" status to avoid non-critical alerts.

## 🛠️ Tech Stack

### Backend System (Spring Boot)
- **Framework**: Spring Boot 3 (Java 17)
- **Security**: Spring Security 6 + JWT Filter
- **Database**: PostgreSQL (JPA/Hibernate)
- **Integration**: Twilio Java SDK

### Frontend Application (React)
- **Build Tool**: Vite (Lightning fast HMR)
- **Styling**: TailwindCSS (Modern utility-first design)
- **State Management**: React Context API
- **Routing**: React Router DOM

## ⚙️ Setup & Installation

### Prerequisites
- Java 17+
- Node.js v18+
- PostgreSQL
- Twilio Account (SID & Auth Token)

### 1. Backend Setup
```bash
cd backend
# Configure your credentials in src/main/resources/application.properties
# (See application.properties.example for reference)
mvn spring-boot:run
```

### 2. Frontend Setup
```bash
cd frontend
npm install
npm run dev
```

## 📸 Screenshots
*(Add your project screenshots here)*

## 🔮 Future Roadmap
- [ ] **Docker Support**: Containerization for easy deployment.
- [ ] **WebSocket Integration**: Real-time status updates (e.g., "Owner is coming!").
- [ ] **Mobile App**: Native Android/iOS wrapper.

---
*Built with ❤️ by [Shreya Devaraj](https://github.com/shreyadevaraj)*
