# Web BoardGame

A full-stack web application built for playing board games online. The project features a React-based frontend and a Node.js/Express backend communicating with a PostgreSQL database, providing user authentication, comprehensive game management, and interactive gameplay.

## Technology Stack

**Frontend:**
- React 19 with Vite
- React Router DOM for routing
- TailwindCSS for utility-first styling
- Radix UI and Lucide React for accessible UI components
- Axios for API requests
- React Hook Form & Zod for robust form validation
- Recharts for data visualization

**Backend:**
- Node.js & Express
- PostgreSQL database
- Knex.js query builder
- JSON Web Tokens (JWT) & bcrypt for secure authentication
- Swagger (swagger-ui-express) for API documentation

## Live Demo & Documentation

- **Frontend (Vercel):** [https://web-board-game-phi.vercel.app/](https://web-board-game-phi.vercel.app/)
- **Backend API (Render):** [https://web-boardgame.onrender.com](https://web-boardgame.onrender.com)
- **API Documentation (Swagger):** [https://web-boardgame.onrender.com/docs-login](https://web-boardgame.onrender.com/docs-login)

> Note: The backend is hosted on a free tier service, which may spin down after periods of inactivity. It might take a moment to process the first request if the server has been idle.

## Demo Accounts

You can use the following accounts to test the application features:

| Role  | Email | Password |
| :---  | :---  | :---     |
| **Admin** | `admin@gmail.com` | `123456` |
| **User**  | `phat@gmail.com`  | `23456`  |

## Local Development Setup

To run the project locally, you will need to set up both the backend and the frontend.

### 1. Backend Setup

Open a terminal, navigate to the backend directory, and install dependencies:

```bash
cd backend
npm install
```

Start the backend development server:

```bash
npm run dev
```
*The backend server will run at http://localhost:3000.*

### 2. Frontend Setup

Open a new terminal window, navigate to the frontend directory, and install dependencies:

```bash
cd frontend
npm install
```

*(Optional) Create or modify `.env.development` if you need to override the backend API URL for local development.*

Start the frontend development server:

```bash
npm run dev
```
*The frontend application will be served at http://localhost:5173.*

## Project Structure

```
Web_BoardGame/
├── backend/            # Express server, database config (Knex), API routes
├── frontend/           # React application using Vite, TailwindCSS
├── docs/               # Technical documents, guidelines, and instructions
└── README.md           # Project documentation
```

## Contributors

- Trương Thành Phát - 23120319@student.hcmus.edu.vn
- Thái Thiên Phú - 23120327@student.hcmus.edu.vn
- Bửu Huỳnh Vĩnh Phúc - 23120328@student.hcmus.edu.vn
- Bùi Minh Quân - 23120337@student.hcmus.edu.vn
