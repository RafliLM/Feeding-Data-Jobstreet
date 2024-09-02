# Feeding Data Jobstreet
Developed using Express Js and Next JS + Material UI

## Prerequisites
- Bun

## How To Run
We need to run both backend and frontend to serve a functional web page.

### Backend
- Move to backend directory
- Install Dependencies
```
bun install
```
- Adjust database url in .env
- Initiate prisma client and migration
```
bunx prisma migrate dev --name init
```
- Run backend server
```
bun --watch index.ts
```

### Frontend
- Move to the frontend directory
- Install Dependencies
```
bun install
```
- Run frontend server
```
bun ---bun run dev
```
