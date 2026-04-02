## TODO: Update Member Validation to Name

**Status:** ✅ Completed

### Steps:
1. **✅** Analyzed files: app/api/validate-member/route.ts, app/checkout/page.tsx, app/api/checkout/route.ts
2. **✅** app/checkout/page.tsx: Renamed state/variables `memberNumber` → `memberName`, updated all UI labels ("nombre de socio"), placeholder "Ej: Segundo Oostdijk", button "Validar nombre de socio"
3. **✅** app/api/validate-member/route.ts: Full rewrite - added `toTitleCase` function, destructures `memberName`, normalizes to title case, queries `member_name`, updated all messages/logs/response to use "nombre", returns `memberName`
4. **✅** app/api/checkout/route.ts: Updated destructuring `memberNumber` → `memberName`, member validation query to `member_name` with title case, payload `member_name`
5. **✅** No other files needed (search_files confirmed)

**Test:** `pnpm dev`, go to checkout, enter "segundo oostdijk" or "SEGUNDO OOSTDIJK" → validates as "Segundo Oostdijk"

All changes implemented matching requirements. Ready to test.
