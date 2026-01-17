# Intern Management System – Backend week 2-3 for dev 1

---

##  Features

- **JWT Authentication** (Access & Refresh Tokens)
- **Login / Logout**
- **Token Refresh**
- **Get Current User** (`/api/auth/me`)
- **Forgot & Reset Password**
- **Change Password after logging in**

---

## ⚙️ Prerequisites

- **Node.js** (v18 or higher) for typescript
- **MongoDB** (local installation or MongoDB Atlas)
- **Postman** or similar API testing tool

---

## 🔧 Setup Instructions

### 1️⃣ Clone the Repository
```bash
git clone https://github.com/<your-username>/intern-management-backend.git
cd intern-management-backend
```

### 2️⃣ Install Dependencies
Install typescripts dependencies
```bash
npm install -D ts-node typescript
```
### 3️⃣ Configure Environment Variables

Create a `.env` file in the root directory:

```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/intern-management
JWT_SECRET=your_jwt_secret_here_change_this_in_production
JWT_EXPIRES_IN=7d
JWT_ACCESS_SECRET=access_secret_token
JWT_REFRESH_SECRET=refresh_secret_token
NODE_ENV=development
```

```bash
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

run the above command to generate the jwt tokens . Run thrice to get 3 random strings and paste it in 3 tokens respectively

> ⚠️ **Security Note:** Never commit `.env` files to version control.

### 4️⃣ Start the Development Server
```bash
npm run dev
```

Server will run at:
```
http://localhost:5000
```

---

## 🗄️ Database Initialization (Manual)

### 1. Create a Company
```javascript
// Run in MongoDB shell or Compass
db.companies.insertOne({
  name: "Acme Corp",
  status: "active",
  created_at: new Date(),
  updated_at: new Date()
});
```

### 2. Create a Role
```javascript
db.roles.insertOne({
  company_id: ObjectId("COMPANY_ID_FROM_ABOVE"),
  name: "admin",
  permissions: ["*"], // Full access
  created_at: new Date()
});
```

### 3. Create a User
**First, generate a bcrypt hash for your password:**

```javascript
db.users.insertOne({
  company_id: ObjectId("COMPANY_ID"),
  role_id: ObjectId("ROLE_ID"),
  email: "admin@acme.com",
  password_hash: "$2b$10$hashed_password_here", // Replace with actual hash
  temp_password: false,
  status: "active",
  created_at: new Date()
});
```

---

## 🔐 Generate Hashed Password (bcrypt)

Passwords stored in the database **must be bcrypt-hashed**.

### Using Node.js (Recommended)

#### Step 1️⃣ Open terminal in project root
```bash
node
```

#### Step 2️⃣ Run the following commands
```js
const bcrypt = require("bcrypt");
bcrypt.hash("Admin@123", 12).then(console.log);
```

✔ Output will be something like:
```text
$2b$12$uQ9cZVZP1j3r9Yp9bqGJGeYFZp7q2Hk9YkYvPzQ5B6VnLZP2xWk2C
```

📌 Copy this hash and store it as `password_hash` in MongoDB.

---

### Example MongoDB Insert
```js
db.users.insertOne({
  "company_id": ObjectId("64f000000000000000000001"),
  "role_id": ObjectId("64f000000000000000000002"),
  "email": "admin@acme.com",
  "password_hash": "$2b$12$XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX", // insert hashed password here
  "temp_password": false,
  "status": "active",
  "onboarding_status": "approved",
  "created_at": new Date(),
  "updated_at": new Date()
});
```

---

### ⚠️ Important Notes
* Never store plain text passwords
* Use **bcrypt rounds = 12**
* Each hash is **unique**, even for the same password
* For production, never log password hashes

---

## 🧪 API Testing with Postman

### 🔐 **Login**
- **Endpoint:** `POST /api/auth/login`
- **Body:**
```json
{
  "email": "admin@acme.com",
  "password": "Admin@123"
}
```
- **Response:** Returns access and refresh tokens, temp_password, user details.

---

### 👤 **Get Current User**
- **Endpoint:** `GET /api/auth/me`
- **Headers:**
  ```
  Authorization: Bearer <ACCESS_TOKEN>
  ```
- **Description:** Retrieves the authenticated user's profile.

---

### 🔄 **Refresh Token**
- **Endpoint:** `POST /api/auth/refresh`
- **Body:**
```json
{
  "refreshToken": "<REFRESH_TOKEN>"
}
```
- **Response:** Returns a new access token.

---

### 🚪 **Logout**
- **Endpoint:** `POST /api/auth/logout`
- **Body:**
```json
{
  "refreshToken": "<REFRESH_TOKEN>"
}
```
- **Description:** Invalidates the refresh token.

---

### 🔑 **Forgot Password**
- **Endpoint:** `POST /api/auth/forgot-password`
- **Body:**
```json
{
  "email": "admin@acme.com"
}
```
- **Response:** Sends a password reset email( for now it is displayed in the console).

---

### 🔒 **Reset Password**
- **Endpoint:** `POST /api/auth/reset-password`
- **Body:**
```json
{
  "token": "<RESET_TOKEN>",
  "password": "NewStrongPass@123"
}
```
- **Description:** Resets the user's password using the provided reset token ( for now it will be displayed in the console, copy that and paste here).

---

### 🔐 **Change Password**

* **Endpoint:** `PUT /api/auth/change-password`
* **Headers:**

  ```
  Authorization: Bearer <ACCESS_TOKEN>
  ```
* **Body:**

  ```json
  {
    "currentPassword": "OldPassword@123",
    "newPassword": "NewStrongPassword@123"
  }
  ```
* **Description:** Allows the authenticated user to change their own password by providing the current password.

---


## ⚠️ Important Notes

- **Token Expiry:**
  - Access Token: 15 minutes
  - Refresh Token: 7 days

---



