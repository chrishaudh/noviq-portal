# Noviq Portal

Customer-facing quote and booking portal for Noviq.

## Local Setup

From your terminal:

```bash
cd ~/Documents/Noviq/noviq-portal
npm install
npm run dev
```

The portal runs at:

```text
http://localhost:3001
```

The app expects the FastAPI backend to be running at:

```text
http://127.0.0.1:8000
```

If you need to change the backend URL, create `.env.local`:

```bash
NEXT_PUBLIC_API_BASE_URL=http://127.0.0.1:8000
```

## Backend

Start the backend in a separate terminal:

```bash
cd ~/Documents/Noviq/smallbiz-os
uvicorn app.main:app --reload
```

## Pages

- `/` - landing page
- `/quote` - quote request form
- `/book` - booking request form with availability slots
- `/confirmation` - booking confirmation details

## Notes

- Authentication is not included yet.
- Stripe payments are not included yet.
- Supabase/Postgres is not included yet.
- The portal uses a placeholder `business_id` for local development.
