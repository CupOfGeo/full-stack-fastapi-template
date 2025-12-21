# STRIPE-3.3: Items Page Upgrade CTA

## Status: COMPLETE

## Progress
- [x] Created `ItemsHeader.tsx` component
- [x] Shows "X/2 items (Free Tier)" for free users
- [x] Shows "X items (Premium)" with star for premium users
- [x] Upgrade button appears when at limit
- [x] Updated `items.tsx` to use new header

## Summary
Add item count display and upgrade call-to-action on the Items page for free users approaching or at their limit.

## Acceptance Criteria
- [ ] Item count displayed near Add Item button
- [ ] Free users see "X/2 items (Free Tier)"
- [ ] Premium users see "X items (Premium)"
- [ ] Upgrade button shown for free users at/near limit
- [ ] Clicking upgrade initiates Stripe Checkout

## Technical Details

### Item Count Display
Position near the "Add Item" button in items page header:
```
Free user:  "2/2 items (Free Tier)" [Upgrade]
Premium:    "5 items (Premium)" [Star]
```

### Modify Items Page
Update `frontend/src/routes/_layout/items.tsx`:
- Import premium status hook/query
- Display item count from existing query (data.count)
- Conditionally show limit and upgrade button

### Upgrade Button Component
Consider creating shared `UpgradeButton.tsx`:
- Used in: UpgradeModal, Settings page, Items page
- Handles checkout session creation
- Shows loading state during redirect

### Files to Modify
1. `frontend/src/routes/_layout/items.tsx` - Add count display and CTA
2. `frontend/src/components/Premium/UpgradeButton.tsx` - NEW (optional shared component)

## Dependencies
- STRIPE-3.1 (premium status endpoint)
- STRIPE-1.3 (checkout session endpoint)

## Notes
- Don't show upgrade CTA to premium users
- Consider showing CTA when at 1/2 items (approaching limit)
- Keep UI non-intrusive for users who don't want to upgrade
