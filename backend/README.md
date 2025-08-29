# Gestion des Matériels Informatiques – Backend

This folder contains the **backend** of the IT Materials Management system.  
Built with **Express.js** and **MongoDB**, it provides the API, authentication, and data management for the application.

---

## 🛠 Dependencies

### Production Dependencies

- **bcrypt** – hashing library for securely storing passwords  
- **cookie-parser** – parse cookies for authentication and session handling  
- **cors** – enable Cross-Origin Resource Sharing  
- **docx** – create and manipulate Word documents  
- **docxtemplater** – generate Word documents from templates  
- **envdot** – manage environment variables  
- **express** – Node.js web framework  
- **jsonwebtoken** – create and verify JWT tokens for authentication  
- **mongoose** – MongoDB object modeling for Node.js  
- **pizzip** – ZIP compression support (used by docxtemplater)  
- **xlsx** – read/write Excel files

### Development Dependencies

- **nodemon** – automatically restarts the server on file changes  
- **clipboardy** – utility for accessing clipboard (used in development scripts, optional)

---

> 💡 Note: All sensitive environment variables (e.g., database URIs, JWT secrets) should remain in `.env` and never be committed to GitHub.


Install all dependencies and devDependencies with:

```bash
npm install

```

Create a .env file in the backend folder with the following variable:

```bash
PORT=XXXX
MONGODB_CONNECTION_STRING="your-mongodb-connection-string-here"
JWT_ACCESS_TOKEN_SECRET=XXXXYOUR_ACCESS_SECRETXXXXXXXXXXXXXXXXXXXX
JWT_REFRESH_TOKEN_SECRET=XXXXYOUR_REFRESH_SECRETXXXXXXXXXXXXXXXXXXXX

```

You can start the backend server in development mode with:
```bash
npm run dev
```

## 📂 Folder Structure

backend/

├── config/ # Database connection configuration (used whenever connecting to MongoDB)

├── controllers/ # Request handlers and business logic

├── middlewares/ # Express middlewares (auth, error handling, etc.)

├── models/ # Mongoose schemas for different entities

├── node_modules/ # Installed Node.js dependencies (auto-generated)

├── public/ # Public assets (if any)

├── routes/ # API route definitions

├── utils/ # Utility functions, e.g., Word document generation

├── index.js # Entry point of the backend server

├── .env # Environment variables (ignored in Git)

└── package.json # Dependencies and scripts