# 📚 Book Review Web Application

Full-stack Book Review platform built with **React (Vite)** for frontend and **Node.js, Express, MongoDB** for backend.

---

## 🔗 API Routes

### 📚 Books Routes

| Method | Route      | Description                 |
| ------ | ---------- | --------------------------- |
| GET    | /books     | Get all books               |
| GET    | /books/:id | Get a single book by ID     |
| POST   | /books     | Add a new book (Admin only) |

### ✍️ Reviews Routes

| Method | Route                   | Description                |
| ------ | ----------------------- | -------------------------- |
| GET    | /reviews?bookId=BOOK_ID | Get all reviews for a book |
| POST   | /reviews                | Submit a review for a book |

### 👤 User Routes

| Method | Route      | Description              |
| ------ | ---------- | ------------------------ |
| GET    | /users/:id | Get user profile info    |
| PUT    | /users/:id | Update user profile info |

---

## ⚙️ Project Setup & Run (Frontend + Backend)



```bash
git clone <your-repo-url>
cd <repo-folder>


cd client && npm install && cd ..
cd server && npm install && cd ..


3️⃣ Create Environment File for Backend
DATABASE_URL=your_mongodb_uri
SECRET:jwt_secret


cd server
npm run dev


cd client
npm run dev
```
