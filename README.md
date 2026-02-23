# FoodAdmin — Monorepo

Full-stack food/fruit e-commerce platform with admin dashboard.

## Project Structure

```
FoodAdmin/
├── Backend/        # Express.js + TypeScript REST API (port 5000)
├── my-dashboard/   # Next.js 14 Admin Dashboard (port 3000)
└── website/        # React + Vite Customer Frontend (port 5173)
```

## Tech Stack

<!-- Database DB.io.Digram
https://dbdiagram.io/d/6999b53cbd82f5fce2608872
 -->

| Layer    | Tech                           |
| -------- | ------------------------------ |
| Backend  | Express.js, TypeScript, Prisma |
| Database | PostgreSQL                     |
| Admin UI | Next.js 14, Tailwind CSS       |
| Website  | React, Vite, TypeScript        |
| Auth     | JWT (httpOnly cookies)         |

## Getting Started

### Backend

```bash
cd Backend
npm install
npm run dev
```

### Admin Dashboard

```bash
cd my-dashboard
npm install
npm run dev
```

## DataBase Relations

https://dbdiagram.io/d/6999b53cbd82f5fce2608872

### Customer Website

```bash
cd website
npm install
npm run dev
```
