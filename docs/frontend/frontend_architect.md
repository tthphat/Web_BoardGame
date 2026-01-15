# Frontend Architecture Documentation

This document explains the directory structure, technologies, and architectural patterns used in the frontend of the BoardGame project.

## 🛠 Technology Stack

- **Framework:** [React 19](https://react.dev/)
- **Build Tool:** [Vite 7](https://vite.dev/)
- **Styling:** [Tailwind CSS 4](https://tailwindcss.com/)
- **Routing:** [React Router 7](https://reactrouter.com/)
- **State Management:** React Context API
- **Form Handling:** React Hook Form & Zod
- **HTTP Client:** 
- **Icons:** Lucide React

## 📂 Directory Structure

The `frontend/src` directory is organized as follows:

```text
src/
├── assets/          # Static assets (images, fonts, SVG)
├── components/      # Reusable UI components
│   ├── common/      # Generic components (Buttons, Modals, etc.)
│   ├── games/       # Business-specific components for Games
│   └── ui/          # Base UI primitives (e.g., Shadcn-like components)
├── contexts/        # React Contexts for global state
├── layouts/         # Page layout wrappers (MainLayout, AuthLayout)
├── lib/             # Third-party library configurations (Axios, utils)
├── pages/           # Page-level components (Route targets)
│   ├── auth/        # Authentication pages (Login, Register)
│   └── games/       # Board game related pages
├── routes/          # Route configuration and navigation logic
├── services/        # API calls and data fetching logic
├── styles/          # Global styles and Tailwind configuration
└── utils/           # Shared utility functions and constants
```

## 🏗 Key Architectural Patterns

### 1. Component Organization
We follow an atomic-lite approach:
- **UI Components:** Found in `components/ui`, these are shadcn components.
- **Common Components:** Found in `components/common`, these are reusable but might contain some logic.
- **Feature Components:** Located in specific subfolders (like `components/games`), these are tied to specific domains.

### 2. Routing
Routes are centrally managed in `src/routes/routes.jsx`. We use `React Router 7` for declarative routing.

### 3. API Services
All external API communication is abstracted into the `src/services/` directory. This ensures that UI components remain decoupled from the data fetching implementation.

### 4. Form Validation
We use **Zod** for schema-based validation and **React Hook Form** for managing form state efficiently.

### 5. Styling
Tailwind CSS 4 is used for styling. Design tokens and global styles are managed in `src/styles/` and `src/index.css`.

---
*Last updated: 2026-01-15*
