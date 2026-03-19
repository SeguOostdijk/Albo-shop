# Mobile Product Layout Fix (3 Columns)
Target: Fix category pages (primera-division, femenino, infantiles, extras) to show 3 product columns on mobile instead of 2.

## Steps:
- [x] 1. Update components/category-page-client.tsx: Change grid base to grid-cols-3, fix conditional logic.
- [x] 2. Update components/product-card.tsx: Adjust image sizes for 3-col mobile (33vw).
- [x] 3. Update components/product-grid.tsx: Set grid-cols-3 base for consistency.
- [x] 4. Update components/product-skeleton.tsx: Align skeleton grid to 3 cols mobile.
- [ ] 5. Test on mobile view: Navigate to /category/primera-division etc., verify 3 cols, no overflow.
- [ ] 6. Complete: Run `npm run dev` if needed, confirm fix.
- [ ] 5. Test on mobile view: Navigate to /category/primera-division etc., verify 3 cols, no overflow.
- [ ] 6. Complete: Run `npm run dev` if needed, confirm fix.

✅ All edits complete. Test in browser devtools (mobile viewport): /category/primera-division, femenino, infantiles, extras - verify 3-col layout.
To run: `npm run dev`
Changes safe, no new deps needed.
