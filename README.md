# Video Play Management Frontend

A responsive authentication UI built with **React**, **TypeScript**, and **TailwindCSS**, integrated with a custom **Express + PostgreSQL** backend for user management.

---

## ✨ Features

- User Registration and Login
- JWT-based Authentication (stored in cookies)
- Password visibility toggle
- Inline error & success toasts
- Persistent login with profile fetch
- Form validation and loading states
- Auth context with React hooks

---

## 🔧 Stack

### Frontend:
- [React](https://react.dev/)
- [TypeScript](https://www.typescriptlang.org/)
- [TailwindCSS](https://tailwindcss.com/)
- [React Router](https://reactrouter.com/)
- [React Cookie](https://www.npmjs.com/package/react-cookie)
- Custom Toast Hook

### Backend:
- [Express](https://expressjs.com/)
- [PostgreSQL](https://www.postgresql.org/)
- [JWT](https://jwt.io/) for authentication

---

## 🧠 Architecture Overview

```txt
[React UI] → [AuthContext] → [Express API]
         ↘ (Cookies)      ↘ (JWT in Headers)
