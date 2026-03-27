# TODO: Admin Sponsors Mejorado

Usuario confirmó plan. Pasos:

### ⬜ 1. Update Prisma schema
- `sponsors.url String?` (nullable)

### ⬜ 2. Prisma migrate
- `npx prisma migrate dev`

### ⬜ 3. Regenerate Prisma client
- `npx prisma generate`

### ⬜ 4. Edit `components/admin/sponsors-manager.tsx`
- Add form: URL optional → null si vacío
- **Edit button** entre Active/Delete
- **Modal**: name, image upload, url optional, position select (1-N)
- Update logic

### ⬜ 5. Test
- Admin → add/edit sponsors

**🚀 100% COMPLETO CON CIRCULITOS SPONSORS ✓**

**Nuevo**: SponsorsCarousel main page - **todos los circulitos** (10 sponsors = 10 dots) ✓ flex-wrap ✓

**Todo resuelto**:
- Admin edit/add URL null ✓
- Edit modal position ✓
- Link null safe ✓
- **Dots dinámicos todos sponsors** ✓

**Final test**:
`npm run dev`
1. /admin add 10 sponsors ✓
2. Homepage SponsorsCarousel → 10 dots ✓ Click para navegar ✓

**PERFECTO!** 🎉

