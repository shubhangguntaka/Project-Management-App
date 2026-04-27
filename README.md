# ProjectFlow - Project Management Utility

A high-level project management application built with the MERN stack (MongoDB, Express.js, React, Node.js). ProjectFlow provides a centralized dashboard the capability of tracking SDLC (Software Development Life Cycle) phases visually using a Kanban board, along with comprehensive user management and individual task histories.

---

## 🚀 Setup & Run Locally

### Prerequisites
- [Node.js](https://nodejs.org/) installed (v16+ recommended).
- [MongoDB Atlas](https://www.mongodb.com/atlas) connection URI (Currently configured via `.env`).

### Installation
1. **Clone the repository** (if applicable) or navigate to the project root:
   ```bash
   cd e:\CMRM\Internships\Utpatti\project-management-app
   ```

2. **Install Server Dependencies:**
   ```bash
   cd server
   npm install
   ```

3. **Install Client Dependencies:**
   ```bash
   cd ../client
   npm install
   ```

### Running the Application

Due to potential memory paging constraints with `concurrently`, we recommend running the frontend and backend servers separately:

**1. Start the Backend API Server:**
```bash
cd server
node server.js
```
*The server will run on `http://localhost:5000`.*

**2. Start the Frontend React Client:**
```bash
cd client
node node_modules/react-scripts/scripts/start.js
```
*The client will compile and automatically open at `http://localhost:3000`.*

---

## 🏗️ Design Choices

### Folder Structure
The application adopts a standard **monorepo-style structure** separated by concerns:
* **`/server`**: Houses the Express.js Backend.
  * `/models`: Mongoose database schemas defining database structures (`User.js`, `Task.js`).
  * `/controllers`: Core business logic isolating request-handling from routing.
  * `/routes`: Express routers mapping API path endpoints to their respective controllers.
  * `/middleware`: Express middleware mechanisms (e.g., simplistic cross-system API Key validations).
* **`/client`**: Houses the React Frontend.
  * `/src/pages`: Distinct isolated page-level views routing mapping (`Homepage`, `KanbanBoard`, `UserManagement`, `UserDashboard`).
  * `/src/components`: Highly reusable, atomic UI blocks (`TaskCard`, `Sidebar`, `TaskHistory`, `Modal`s).
  * `api.js`: An Axios-driven configuration layer centralizing API calls out of React components.

### Component Architecture & State Management
* **Component Modularity:** UI is broken down into small scale atoms (Buttons, Inputs, Cards). Large scale containers (Kanban Columns, Dashboard Wrappers) import smaller structural fragments.
* **Component State:** Relying purely on React functional Hooks (`useState` and `useEffect`) over external libraries (like Redux). Because state doesn't deeply cross-contaminate paths, fetching straight from Axios within page top-level components and passing down minimally to immediate children works smoothly.
* **UI/UX Aesthetics:** Instead of bulky CSS frameworks relying on generic styles, we designed a custom **premium dark-mode design system** via plain CSS (`index.css`). It implements complex stylistic elements natively such as 'Glassmorphism' cards, animated gradient backgrounds, and dynamic micro-interactions.

---

## 🔮 Future Improvements 

Given more time, here are system features and architectures that'd instantly be upgraded:

### 1. Robust Authentication & Authorization
Currently, routing and server protection simulates a simplistic API-key header lock. Moving forward, full **JWT (JSON Web Token) based Authentication** via Passport.js or NextAuth integrated tightly with role-based accessibility models (Admin vs Developer route protection) is priority #1.

### 2. Live WebSocket Integration 
Currently, component data is fetched passively. Leveraging **Socket.io**, we could instantly push updates client-side. When a developer moves a task card to "Code Review", the Kanban board of any manager currently on the page should immediately sync and move live without requiring manual page-refreshes.

### 3. Drag-and-Drop User Experience
Card workflows currently click a dropdown selector. Using advanced drag-and-drop toolkits such as `react-beautiful-dnd` or `@dnd-kit/core` would streamline SDLC phase shifting across columns.

### 4. Migration to Advanced Stacks
As the framework scopes forward, transitioning the frontend SPA mechanism into **Next.js** for SSR (Server Side Rendering), heavily strengthening the backend typings using **Golang** handling heavy asynchronous worker pipelines, and standardizing mobile availability through **Flutter**.
