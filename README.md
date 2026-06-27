# CareerVault - Job Application Tracker

CareerVault is a premium, full-stack Job Application Tracker designed for developers and job seekers. It features a modern dark mode dashboard, glassmorphic charts, comprehensive job status management, custom status filters, search functionality, and pagination.

---

## Technical Stack

### Frontend
- **Framework**: React.js (Vite)
- **Routing**: React Router DOM v6
- **Styling**: Tailwind CSS v3
- **Charts**: Recharts (fully customized glassmorphic theme)
- **Icons**: Lucide React
- **API Client**: Axios with automated bearer token interceptors

### Backend
- **Runtime**: Node.js
- **Server Framework**: Express.js
- **Database**: MongoDB Atlas
- **Security**: Password hashing via `bcryptjs`, authorization middleware via JWT
- **Development Utility**: Nodemon

---

## Folder Structure

```text
Job Application Tracker/
│
├── backend/
│   ├── config/
│   │   └── db.js                 # Database connection logic
│   ├── controllers/
│   │   ├── authController.js     # Register and login controllers
│   │   └── jobController.js      # CRUD operations and dashboard stats aggregation
│   ├── middleware/
│   │   └── auth.js               # JWT security gatekeeper middleware
│   ├── models/
│   │   ├── Job.js                # Job Application schema & status enums
│   │   └── User.js               # User credentials schema & password comparison methods
│   ├── routes/
│   │   ├── authRoutes.js         # Register and login endpoints
│   │   └── jobRoutes.js          # Protected job management routes
│   ├── .env                      # Environment configurations
│   ├── package.json              # Backend dependencies & dev scripts
│   └── server.js                 # Main server configuration & endpoint setup
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Layout.jsx        # Dashboard container shell
│   │   │   ├── Navbar.jsx        # Header with user avatar and date
│   │   │   ├── ProtectedRoute.jsx# Auth route guardian
│   │   │   └── Sidebar.jsx       # Sidebar drawer navigation
│   │   ├── context/
│   │   │   └── AuthContext.jsx   # Auth state provider
│   │   ├── pages/
│   │   │   ├── Dashboard.jsx     # Recharts stats visualization
│   │   │   ├── Jobs.jsx          # Live CRUD Table, search, filters & pagination
│   │   │   ├── Login.jsx         # Credentials login form
│   │   │   └── Register.jsx      # Registration form
│   │   ├── services/
│   │   │   └── api.js            # Axios client with interceptors
│   │   ├── App.jsx               # Navigation route mapping
│   │   ├── index.css             # Main styling, typography, & gradients
│   │   └── main.jsx              # React DOM mounting entry point
│   ├── index.html                # Entry HTML with preconnected fonts
│   ├── postcss.config.js         # PostCSS config
│   ├── tailwind.config.js        # Custom theme extension config
│   └── package.json              # Frontend dependencies & build commands
│
└── README.md                     # Installation & guide
```

---

## Installation & Setup

### Prerequisites
1. **Node.js** (v16.x or newer) installed.
2. A **MongoDB Atlas** database. (Sign up for a free shared cluster at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)).

### Step 1: Set Up the Backend
1. Open a terminal in the `backend` directory.
2. Install dependencies:
   ```bash
   npm install
   ```
3. Edit the environment variables in `backend/.env`:
   - Replace the connection string placeholder `MONGODB_URI` with your own MongoDB Atlas URI (ensure you replace `<username>` and `<password>` with your database user credentials):
     ```env
     PORT=5000
     MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.xxxxxx.mongodb.net/job-tracker?retryWrites=true&w=majority
     JWT_SECRET=jobtrackersecretkey123456!
     ```
4. Start the backend development server:
   ```bash
   npm run dev
   ```
   The backend will start on `http://localhost:5000`.

### Step 2: Set Up the Frontend
1. Open a new terminal in the `frontend` directory.
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the Vite React development server:
   ```bash
   npm run dev
   ```
   The frontend will start on `http://localhost:5173`. Open this URL in your browser to access CareerVault.

---

## Key Features

1. **Dashboard Insights**: Interactive **Bar Chart** and **Pie Chart** displaying recruitment statistics. Hover over segments to see detailed tooltips.
2. **Search & Filters**: Use the search input to filter by company name/job title in real-time, or use the dropdown selector to isolate applications by status.
3. **Primary Job Statuses**: Strictly tracks the 5 core recruitment stages:
   - *Applied*
   - *Phone Screen*
   - *Interview*
   - *Offer*
   - *Rejected*
4. **Modal Management Form**: Add or edit application details, set the date applied, insert application links, and write interview notes in a slide-over modal container.
5. **Secure Authentication**: JWT-based session security storing tokens in local storage. Protected routes prevent unauthorized access to the application dashboards.
Testing YOLO GitHub achivement
