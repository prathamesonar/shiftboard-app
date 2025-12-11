# ShiftBoard - Employee Shift Management System

A full-stack MERN application for managing employee shifts with Role-Based Access Control (RBAC).

##  Live Demo
- **Frontend:** [https://shiftboard.vercel.app]
- **Backend:** [https://dashboard-j2hf.onrender.com]

##  Features
- **Admin:** Assign shifts, view all schedules, delete shifts.
- **User:** View personal shifts only.
- **Logic:** - Prevents overlapping shifts.
  - Enforces minimum 4-hour shift duration.
- **Tech:** React (Vite), Node.js, Express, MongoDB, Tailwind CSS.

### 📂 Project Structure

```bash
ShiftBoard/
├── backend/                 # Node.js & Express Backend
│   ├── config/              # Database connection logic
│   ├── controllers/         #  logic for Auth & Shifts
│   ├── middleware/          # JWT Authentication & Role checks
│   ├── models/              # Mongoose Schemas (User, Shift)
│   ├── routes/              # API Route 
│   ├── server.js            # Server entry point
│   └── .env                 # Environment variables 
│
└── frontend/                # React (Vite) Frontend
    ├── public/              # Static assets
    ├── src/
    │   ├── components/      # Reusable UI components (Header, etc.)
    │   ├── context/         # Global State (Auth, Theme)
    │   ├── pages/           # Application Views (Login, Dashboard)
    │   ├── App.jsx          # Main Router component
    │   └── main.jsx         # React DOM entry point
    ├── tailwind.config.js   # Tailwind CSS configuration
    └── vite.config.js       # Vite build configuration
```

## ⚙️ Setup Instructions


### Installation
1. Clone the repo:
   ```bash
   git clone https://github.com/prathamesonar/shiftboard-app.git
   cd shiftboard
   ```

2.  **Backend Setup:**

    ```bash
    cd backend
    npm install
    # Create  .env file with: PORT=5000, MONGO_URI=..., JWT_SECRET=...
    npm start
    ```

3.  **Frontend Setup:**

    ```bash
    cd frontend
    npm install
    npm run dev
    ```


### Auth

  - `POST /api/login` - Login user (Returns JWT)
  - `GET /api/employees` - Get list of employees (Admin only)

### Shifts

  - `GET /api/shifts` - Get shifts (User: own only, Admin: all)
  - `POST /api/shifts` - Create a shift (Admin only)
  - `DELETE /api/shifts/:id` - Delete a shift (Admin only)

##  Testing Credentials

  - **Admin:** hire-me@anshumat.org / HireMe@2025\!
  - **User:** rahul@example.com / User@123
