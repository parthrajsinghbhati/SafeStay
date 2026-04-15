# 🏠 SafeStay - Premium Student Housing Platform

SafeStay is a modern, full-stack student housing management and booking platform. Built with security, scalability, and performance in mind, it provides a seamless experience for students to find and book accommodations, and for administrators to manage properties and bookings.

---

## ✨ Features

- **🔐 Robust Authentication**: Secure JWT-based authentication system with Bcrypt password hashing.
- **👥 Role-Based Access Control**: Different permissions for **Students**, **Wardens**, and **Administrators**.
- **🏨 Property & Room Management**: Comprehensive room management with status tracking (Available, Booked, Maintenance).
- **⚡ Real-time Booking System**: High-performance booking flow with **Optimistic Concurrency Control** to prevent overbooking.
- **📱 Modern Responsive UI**: A premium, mobile-first dashboard built with React 19 and Tailwind CSS v4.
- **🧩 Scalable Architecture**: Backend designed using SOLID principles, DTOs, and a modular service-controller pattern.

---

## 🛠️ Technology Stack

### Backend
- **Runtime**: [Node.js](https://nodejs.org/) with [TypeScript](https://www.typescriptlang.org/)
- **Framework**: [Express 5](https://expressjs.com/)
- **ORM**: [Prisma](https://www.prisma.io/)
- **Database**: [PostgreSQL](https://www.postgresql.org/)
- **Security**: JWT (JsonWebToken), Bcrypt
- **Utils**: zod (Validation), tsx (Development)

### Frontend
- **Framework**: [React 19](https://react.dev/)
- **Build Tool**: [Vite](https://vitejs.dev/)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
- **State Management**: [Zustand](https://github.com/pmndrs/zustand)
- **Data Fetching**: [React Query](https://tanstack.com/query/latest)
- **Forms**: [React Hook Form](https://react-hook-form.com/) + [Zod](https://zod.dev/)
- **Icons**: [Lucide React](https://lucide.dev/)

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v20+)
- PostgreSQL installed and running
- npm or yarn

### 🔧 Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd Backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Configure environment variables:
   Create a `.env` file in the `Backend` directory and add:
   ```env
   DATABASE_URL="postgresql://user:password@localhost:5432/safestay"
   JWT_SECRET="your_secret_key"
   PORT=5000
   ```
4. Initialize the database:
   ```bash
   npx prisma migrate dev --name init
   ```
5. Start development server:
   ```bash
   npm run dev
   ```

### 🎨 Frontend Setup

1. Navigate to the frontend directory:
   ```bash
   cd Frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start development server:
   ```bash
   npm run dev
   ```

---

## 📂 Project Structure

```text
SafeStay/
├── Backend/
│   ├── prisma/             # Database schema & migrations
│   ├── src/
│   │   ├── config/         # App configurations
│   │   ├── core/           # Shared utilities & middleware
│   │   ├── modules/        # Feature-based folders (auth, booking, property)
│   │   └── server.ts       # Entry point
│   └── tsconfig.json
├── Frontend/
│   ├── src/
│   │   ├── components/     # UI components
│   │   ├── hooks/          # Custom React hooks
│   │   ├── services/       # API services
│   │   ├── store/          # Zustand state management
│   │   └── pages/          # Layout and route pages
│   └── vite.config.ts
└── README.md               # Main documentation
```

---

## 🔒 Security & Performance

- **Optimistic Locking**: The `Room` model uses a `version` field to ensure that simultaneous booking requests for the same room are handled correctly without race conditions.
- **Validation**: All incoming requests are validated using **Zod** schemas to ensure data integrity.
- **Clean Code**: Adherence to **SOLID** principles ensures the codebase is maintainable and extensible.

---

## 📜 License

This project is licensed under the ISC License.
