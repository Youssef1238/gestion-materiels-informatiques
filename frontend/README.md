# Gestion des Matériels Informatiques – Frontend

This folder contains the **frontend** of the IT Materials Management system.  
Built with **React** and **TailwindCSS**, it provides the user interface, dashboard, forms, and visualization for the application.

---


## 🛠 Dependencies

The frontend requires the following packages:

### Production Dependencies

- **@radix-ui/react-dropdown-menu, @radix-ui/react-popover, @radix-ui/react-select, @radix-ui/react-switch** – Radix UI components for accessible UI primitives  
- **@svgr/webpack** – transform SVGs into React components  
- **axios** – HTTP client for API requests  
- **chart.js** & **react-chartjs-2** – charting library and React wrapper for dashboards  
- **class-variance-authority** – utility for handling conditional class names  
- **clsx** – utility for combining CSS classes  
- **js-cookie** – browser cookies management (used for authentication)  
- **jwt-decode** – decode JWT tokens  
- **lucide-react** – icon library  
- **react** & **react-dom** – core React libraries  
- **react-router-dom** – routing for React pages  
- **react-shapes** – simple shape components for visualization  
- **tailwind-merge** – merge Tailwind classes dynamically  
- **tailwindcss-animate** – prebuilt Tailwind animation utilities  
- **xlsx** – read/write Excel files

### Development Dependencies

- **vite** – build tool for modern frontend projects  
- **@vitejs/plugin-react** – Vite plugin for React support  
- **vite-plugin-svgr** – import SVGs as React components  
- **tailwindcss** – utility-first CSS framework  
- **eslint, @eslint/js, eslint-plugin-react, eslint-plugin-react-hooks, eslint-plugin-react-refresh** – linting tools for code quality  
- **@types/react, @types/react-dom** – TypeScript type definitions (optional if using TypeScript)

---

> 💡 Note: TailwindCSS is only needed during development to generate the compiled `output.css`. Once built, the generated CSS is sufficient to run the app.


Install all dependencies and devDependencies with:

```bash
npm install

```

Create a .env file in the backend folder with the following variable:

```bash
VITE_API_URL="http://localhost:PORT or another url"


```

Start the development server with:
```bash
npm run dev
```

## 📂 Folder Structure

frontend/

├── node_modules/       -- Installed Node.js dependencies

├── public/             -- Static assets, index.html

├── src/

│   ├── assets/         -- Images, icons, and other media

│   ├── auth/           -- Authentication logic: login, logout, refresh token

│   ├── components/     -- Reusable UI components

│   ├── lib/            -- Helper functions and static data

│   ├── pages/          -- React pages for routes

│   ├── utils/          -- Customized Axios instance ("api") and utility functions

│   ├── main.jsx        -- Application entry point

│   ├── input.css       -- Tailwind input CSS

│   └── output.css      -- Compiled Tailwind CSS

├── .env                -- Environment variables (ignored in Git)

├── package.json        -- Dependencies and scripts

├── tailwind.config.js  -- Tailwind configuration

├── index.html          -- Main HTML file

└── README.md           -- Frontend documentation
