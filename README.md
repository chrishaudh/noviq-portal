# Noviq Portal

Customer-facing quote and booking portal for local Noviq demos.

## Local Backend Dependency

Start the FastAPI backend first:

```bash
cd ~/Documents/Noviq/smallbiz-os
source .venv/bin/activate
uvicorn app.main:app --reload
```

The portal reads from:

```text
http://127.0.0.1:8000
```

Override with `.env.local` if needed:

```text
NEXT_PUBLIC_API_BASE_URL=http://127.0.0.1:8000
```

## Run The Portal

Use port `3002` when the dashboard is already running on `3000`.

```bash
cd ~/Documents/Noviq/noviq-portal
npm install
npm run dev -- -p 3002
```

Open:

```text
http://localhost:3002
```

## Pages

- `/` - customer-facing landing page
- `/quote` - quote request form
- `/book` - booking request form with availability slots
- `/confirmation` - booking confirmation details
- `/hawkins-pro-mounting/quote` - future slug-style route placeholder
- `/precision-lawn-care/quote` - future slug-style route placeholder

## Useful Checks

```bash
npm run build
```

## Notes

- Authentication, Stripe payments, Supabase/Postgres, and deployment are intentionally deferred.
- The current portal uses Hawkins Pro Mounting as the local placeholder business context.
- If the backend is not running, quote/booking submissions will show friendly error messages.
