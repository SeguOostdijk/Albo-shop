# MercadoPago Integration TODO

## Steps from approved plan:

### ✅ 1. Install SDK
- `npm install mercadopago` → ✅ COMPLETE

### ✅ 2. Update API route (/api/checkout/route.ts)
- Server-side MP preference creation ✅ COMPLETE

### ✅ 3. Update MP page (app/checkout/payment/mercadopago/page.tsx)
- Client-side redirect handling ✅ COMPLETE

### ⬜ 4. Add env vars to .env.local (manual)
```
NEXT_PUBLIC_MERCADOPAGO_PUBLIC_KEY=your_public_key
MERCADOPAGO_ACCESS_TOKEN=your_access_token
```

### ⬜ 5. Test checkout flow
- `npm run dev`
- Add to cart → checkout → select MP → verify redirect

### ⬜ 6. Production: Add webhook endpoint

