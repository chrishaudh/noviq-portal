# Noviq Portal

Customer-facing quote and booking portal for local Noviq demos.

## Local Startup Sequence

Start the backend first:

```bash
cd ~/Documents/Noviq/smallbiz-os
source .venv/bin/activate
uvicorn app.main:app --reload
```

Then run the portal on port `3002` when the dashboard is using `3000`:

```bash
cd ~/Documents/Noviq/noviq-portal
npm install
npm run dev -- -p 3002
```

Open:

```text
http://localhost:3002
```

## Environment

The portal reads from:

```text
http://127.0.0.1:8000
```

Override with `.env.local` if needed:

```text
NEXT_PUBLIC_API_BASE_URL=http://127.0.0.1:8000
```

## Pages

- `/` - customer-facing landing page
- `/quote` - quote request form
- `/book` - booking request form with availability slots
- `/confirmation` - booking confirmation details
- `/hawkins-pro-mounting/quote` - future slug-style route placeholder
- `/precision-lawn-care/quote` - future slug-style route placeholder

## Future Access Prep

The portal stays public/customer-facing. Future hardening can add:

- public business slug resolution
- booking reference lookup
- magic-link booking status access
- rate limiting for public forms
- bot/spam protection

Do not add dashboard-style staff auth here unless a customer account feature is explicitly planned.

## Checks

```bash
npm run build
```

## Git Workflow

```bash
git status
git add <files>
git commit -m "Describe the portal change"
git status
```

## Notes

- Authentication, Stripe payments, Supabase/Postgres, and deployment are intentionally deferred.
- The current portal uses Hawkins Pro Mounting as the local placeholder business context.
- If the backend is not running, quote/booking submissions should show friendly error messages.
