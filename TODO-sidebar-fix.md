# TODO: Fix Sidebar Close Button

## Information Gathered:
- Header uses Sheet with sheetOpen state
- Button has onClick toggle + SheetTrigger onOpenChange
- SheetContent has [&>button]:!block for X button
- User reports hamburger button doesn't close when pressed second time

## Plan:
1. Replace Sheet with simple Button toggle for mobile menu div (no Sheet overlay issues)
2. Toggle visibility of mobile nav div with sheetOpen state
3. Ensure button toggle works reliably

**Dependent Files:** components/header.tsx

**Followup:** Test mobile menu toggle
