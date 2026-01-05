# Cake Store

Next.js App Router storefront for Union Bakery's cake catalog, cart, and checkout.

## Setup

1. Install dependencies:

```bash
npm install
```

2. Create a `.env` file (see `.env.example`).

3. Run the dev server:

```bash
npm run dev
```

## Environment Variables

```
NEXT_PUBLIC_API_BASE_URL="https://api-natron.antikode.dev/api"
API_BASE_URL="https://api-natron.antikode.dev/api"
NEXT_PUBLIC_APP_URL="http://localhost:3000"
APP_URL="http://localhost:3000"
```

- `API_BASE_URL` is used by Next.js API routes to proxy requests to the 3rd party API.
- `NEXT_PUBLIC_API_BASE_URL` is only needed for any client-side direct access (currently unused).
- `NEXT_PUBLIC_APP_URL` / `APP_URL` should point to this app (Vercel URL in prod).

## Notes / Assumptions

- Prices are displayed in thousands of IDR across the UI.
- Checkout stores a short-lived order summary in `localStorage` (expires after 5 minutes).
- "Add to cart" is disabled when the selected variant is not available for sale.

## Scripts

```bash
npm run dev
npm run build
npm run lint
```
