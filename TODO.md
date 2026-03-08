# TODO - Account & Auth Implementation

## Phase 1: Database Schema
- [x] Update Prisma schema with User, Order, OrderItem models

## Phase 2: Auth Utilities
- [x] Create lib/supabase/auth.ts - Auth helper functions
- [x] Create lib/auth-context.tsx - React context for auth state

## Phase 3: Account Pages
- [x] Create app/account/login/page.tsx - Login page
- [x] Create app/account/register/page.tsx - Registration page
- [x] Create app/account/orders/page.tsx - Purchase history

## Phase 4: Integration
- [x] Update checkout to save orders to database
- [x] Update Header with auth state
- [ ] Create middleware for protected routes (optional)

## Phase 5: Setup Required
- [ ] Run `npx prisma generate` to generate Prisma client
- [ ] Run `npx prisma db push` to sync schema with database
- [ ] Configure Supabase environment variables (.env.local):
   - NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   - NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
- [ ] Create orders and order_items tables in Supabase (or run migrations)

