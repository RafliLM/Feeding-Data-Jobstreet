# Feeding Data Jobstreet
Developed using Express Js and Next JS + Material UI

## Prerequisites
- Bun
- Python
- Pip

## How To Run
We need to run both backend and frontend to serve a functional web page.

### Backend
There are 2 choices for the backend, ExpressJS or Django. Just choose one you like.
#### ExpressJS
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
#### Django
- Move to backend-django directory
- Create virtual environment (optional)
```
python -m venv venv
```
- Install Dependencies
```
pip install -r requirements .txt
```
- Move to fdj directory
- Adjust database connection in fdj/settings.py
- Initiate migration
```
python manage.py makemigrations
python manage.py migrate
```
- Run backend server
```
python manage.py runserver 8081
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
