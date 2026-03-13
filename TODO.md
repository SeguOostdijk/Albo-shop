# Fix Filters Task - Progress Tracker

## Plan Breakdown & Steps

### 1. Create TODO.md ✅ (Done)

### 2. Edit components/filters.tsx (Dynamic props + cursor) ✅
- Replace hardcoded filterGroups with prop `filterOptions`
- Add `cursor-pointer` class to Checkbox

### 3. Edit components/category-page-client.tsx (Core fixes)
- Compute dynamic `filterOptions` from `products` in useState/useMemo
  - size: unique sizes with stock>0
  - color: from all variants.colors (any match)
  - price: hardcoded buckets (0-30000, 30k-60k, 60k-90k, 90k+)
  - collection: unique tags matching ['nueva-temporada', 'entrenamiento', 'retro']
- Update `filteredProducts` useMemo to apply ALL selectedFilters before tipo/sort
- Pass computed `filterOptions` to Filters components

### 4. Test changes
- dev server: npm run dev
- Go to /category/primera-division
- Verify: color counts category-specific (not total 20 azul)
- Select azul → only primera-division azules show
- Toggle sizes/colors → filters work, counts update
- Remove tipo de producto (not passed)

### 5. attempt_completion

Next step: Edit filters.tsx

