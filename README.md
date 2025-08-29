# Gestion des Articles Informatiques

A web application for managing the lifecycle of IT materials ("Matériel Informatique") within an organization.  
The system tracks the process from opening a **Marché** (procurement batch) to distributing **Articles** (IT assets) to different **Entités Administratives**, while maintaining reports, history, and secure access.

---

## ✨ Features

- **Authentication & Accounts**
  - Admins manage user accounts (creation, password reset, role assignment).
  - Secure login system with JWT-based authentication.
  - Tokens automatically refreshed on the frontend.

- **Dashboard (Home Page)**
  - Overview of main system actions.
  - Interactive charts and key statistics.
  - Manual page to guide users.

- **Entity Management**
  - Add, edit, and manage:
    - Marchés (procurement batches)
    - Articles Types
    - Fournisseurs (suppliers)
    - Comptes (accounts) — *admin only*
  - Advanced management interface with:
    - Search bar  
    - Filtering & sorting  
    - Pagination  
    - Toggle between **card view** and **table view**

- **Marché Page**
  - Detailed information about a selected Marché.
  - Statistics and insights.
  - Manage articles belonging to the Marché.

- **Entité Administrative Page**
  - Assign (affecter) and recover (récupérer) articles.
  - Track history of affectations with downloadable reports.
  - Visual statistics and insights.

- **Global Search (Navbar)**
  - Quick navigation to any Marché or Entité Administrative.
  - Search criteria adapted depending on the entity type.

- **Forms & Overlays**
  - Clean overlay forms for creating/editing entities without page reload.
  - Streamlined user experience.

---

## 🛠 Tech Stack

### Frontend
- [React](https://react.dev/) — component-based UI
- [TailwindCSS](https://tailwindcss.com/) — utility-first styling
- [Axios](https://axios-http.com/) — HTTP client with a custom API instance
  - Unified base URL from `.env`
  - Automatic JWT token refresh
- [shadcn/ui](https://ui.shadcn.com/) — pre-built UI components (customized)

### Backend
- [Express.js](https://expressjs.com/) — web framework
- [MongoDB](https://www.mongodb.com/) — NoSQL database
- Clear MVC structure:
  - **Models** for data schemas
  - **Controllers** for business logic
  - **Routers** for API endpoints
- JWT-based authentication & authorization
- Robust error handling in all controllers

---

## 📂 Project Structure

Source-Code/

│── frontend/ # React + Tailwind app

│── backend/ # Express + MongoDB app

│ ├── models/ # Mongoose schemas

│ ├── controllers/# Business logic

│ ├── routes/ # API endpoints

│ ├── .env # Environment variables (ignored by Git)

│── README.md # Project overview

---

## ⚙️ Setup & Installation

### Prerequisites
- Node.js (>=16)
- MongoDB instance
- npm or yarn

### Backend

1. go to the backend folder
```bash
cd backend
```
2. add a .env file with these variables
```bash
PORT=XXXX
MONGODB_CONNECTION_STRING="your-mongodb-connection-string-here"
JWT_ACCESS_TOKEN_SECRET=XXXXYOUR_ACCESS_SECRETXXXXXXXXXXXXXXXXXXXX
JWT_REFRESH_TOKEN_SECRET=XXXXYOUR_REFRESH_SECRETXXXXXXXXXXXXXXXXXXXX
```
3. install dependencies
```bash
npm install
```
4. run the app
```bash
npm run dev
```

### Frontend

1. go to the frontend folder
```bash
cd frontend
```
2. add a .env file with these variables
```bash
VITE_SERVER_URL=the_url_of_the_backend_server
```
3. install dependencies
```bash
npm install
```
4. run the app
```bash
npm run dev
```

