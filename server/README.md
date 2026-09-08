# KisanDirect Backend API — Node.js + Express + MongoDB

Backend service providing RESTful authentication, role management, and profile services for the KisanDirect Agricultural Digital Marketplace.

---

## 🛠️ Tech Stack

- **Runtime**: Node.js (ES Modules)
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose ODM (with automatic in-memory fallback for instant dev testing)
- **Security**: JWT (JSON Web Tokens) & `bcryptjs` password salt hashing
- **CORS**: Enabled for Vite frontend (`http://localhost:5173`)

---

## 🚀 Getting Started

### 1. Install Dependencies
```bash
cd server
npm install
```

### 2. Configure Environment (`.env`)
A default `.env` is already provided. If using MongoDB Atlas (cloud database):
```env
PORT=5000
MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.mongodb.net/kisandirect?retryWrites=true&w=majority
JWT_SECRET=kisandirect_jwt_secret_super_secure_key_2026_!#@
JWT_EXPIRES_IN=7d
CORS_ORIGIN=http://localhost:5173
```

### 3. Start the Server
```bash
# Production mode
npm start

# Development auto-reloading mode
npm run dev
```

The API will listen at: `http://localhost:5000`

---

## 📡 API Endpoints

### Health Check
- **`GET /api/health`**
  - Returns backend status and database connection state.

### Authentication Endpoints
- **`POST /api/auth/register`**
  - Creates a new user (Farmer, Consumer, or Bulk Buyer).
  - Body:
    ```json
    {
      "role": "farmer",
      "name": "Rameshwar Patel",
      "mobile": "9876543210",
      "email": "farmer@kisandirect.in",
      "password": "farmer@123",
      "farmName": "Patel Organic Farm",
      "location": "Nashik, Maharashtra"
    }
    ```
- **`POST /api/auth/login`**
  - Authenticates user credentials and returns signed JWT.
  - Body:
    ```json
    {
      "identifier": "9876543210",
      "password": "farmer@123",
      "role": "farmer",
      "rememberMe": true
    }
    ```
- **`GET /api/auth/me`** (Protected)
  - Headers: `Authorization: Bearer <token>`
  - Returns logged-in user profile.
- **`POST /api/auth/forgot-password`**
  - Sends password recovery OTP simulation.

---

## 🌾 Pre-Seeded Demo Accounts

| Role | Mobile | Email | Password |
|---|---|---|---|
| **Farmer / FPO** | `9876543210` | `farmer@kisandirect.in` | `farmer@123` |
| **Consumer** | `9811223344` | `ananya.sharma@gmail.com` | `fresh@123` |
| **Bulk Buyer** | `9988776655` | `procurement@tastygreens.com` | `buyer@123` |
