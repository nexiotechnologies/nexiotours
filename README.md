# TourVista — Tourism Management System

A full-stack tourism management platform built with **React** (frontend), **Django** (backend), **Supabase** (auth + database), and **Cloudinary** (media storage).

---

## Project Structure

```
tourvista/
├── frontend/          # React app (Vercel)
│   ├── public/
│   └── src/
│       ├── components/    # Reusable UI components
│       ├── context/       # Auth & Booking context
│       ├── pages/         # All 13 pages
│       ├── utils/         # Supabase, API, helpers
│       └── styles/        # Global CSS
└── backend/           # Django REST API
    ├── tourvista/
    │   ├── settings/
    │   ├── apps/
    │   │   ├── users/
    │   │   ├── destinations/
    │   │   ├── bookings/
    │   │   ├── reviews/
    │   │   ├── chat/
    │   │   ├── notifications/
    │   │   ├── blog/
    │   │   └── loyalty/
    │   └── urls.py
    └── manage.py
```

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18, React Router v6 |
| Styling | CSS-in-JS (inline styles) |
| Charts | Recharts |
| Backend | Django 5, Django REST Framework |
| Auth | Supabase Auth + JWT |
| Database | Supabase (PostgreSQL) |
| Media | Cloudinary |
| Deployment | Vercel (frontend), Railway/Render (backend) |

---

## Features

### Modules
- **Destination Management** — Browse, search, filter, wishlists, weather, virtual tour
- **Booking & Payments** — Tours, hotels, transport, activities, promo codes, invoices
- **User & Role Management** — 4 roles: Traveler, Business, Admin, Service Provider
- **Reviews & Ratings** — Star ratings, photos, verified badges, business replies
- **Notifications** — In-app, email, SMS alerts
- **Chat / Messaging** — Real-time conversations between all stakeholders
- **Loyalty & Rewards** — Points, tiers (Bronze/Silver/Gold), referrals
- **Travel Blog** — Articles, guides, user stories, comments

### Pages (13 total)
1. Home
2. Login
3. Register (with role selection)
4. Destinations (with filters + map)
5. Destination Detail (gallery, tours, reviews)
6. Booking Flow (3-step: Details → Payment → Confirm)
7. My Bookings (history, cancel, invoice)
8. Profile (preferences, security, notifications)
9. Chat / Inbox
10. Loyalty Dashboard
11. Blog
12. Business Portal
13. Admin Dashboard (analytics, user mgmt, booking mgmt, content)

---

## Quick Start

### Frontend

```bash
cd frontend
cp .env.example .env
# Fill in your Supabase + API credentials
npm install
npm start
```

### Backend

```bash
cd backend
python -m venv venv
source venv/bin/activate   # Windows: venv\Scripts\activate
pip install -r requirements.txt
cp .env.example .env
# Fill in DB and Cloudinary credentials
python manage.py migrate
python manage.py createsuperuser
python manage.py runserver
```

---

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /api/auth/token/ | Login (get JWT) |
| POST | /api/users/register/ | Register |
| GET/PUT | /api/users/profile/ | User profile |
| GET | /api/destinations/ | List destinations |
| GET | /api/destinations/:slug/ | Destination detail |
| GET/POST | /api/bookings/ | List/create bookings |
| POST | /api/bookings/promo/validate/ | Validate promo code |
| GET/POST | /api/reviews/ | List/create reviews |
| GET | /api/blog/ | List blog posts |
| GET | /api/loyalty/ | Loyalty account |
| GET | /api/notifications/ | User notifications |
| GET | /api/chat/ | Conversations |

---

## Environment Variables

### Frontend (.env)
```
REACT_APP_SUPABASE_URL=
REACT_APP_SUPABASE_ANON_KEY=
REACT_APP_API_URL=http://localhost:8000/api
REACT_APP_CLOUDINARY_CLOUD_NAME=
```

### Backend (.env)
```
SECRET_KEY=
DEBUG=True
DB_NAME=
DB_USER=
DB_PASSWORD=
DB_HOST=
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=
```

---

## Deployment

### Frontend (Vercel)
1. Push to GitHub
2. Import to Vercel
3. Set environment variables
4. Deploy — Vercel handles the rest via `vercel.json`

### Backend (Railway / Render)
1. Connect GitHub repo
2. Set environment variables
3. Add `Procfile`: `web: gunicorn tourvista.wsgi`
4. Run migrations on deploy

---

*Built with TourVista — Tourism Management System*
