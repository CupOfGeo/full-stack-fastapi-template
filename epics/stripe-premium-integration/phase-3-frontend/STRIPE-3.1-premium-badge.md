# STRIPE-3.1: Premium Badge Component

## Status: COMPLETE

## Progress
- [x] Backend: Added `GET /api/v1/stripe/status` endpoint in `routes.py`
- [x] Frontend: Created `PremiumBadge.tsx` component
- [x] Frontend: Created `usePremiumStatus.ts` hook
- [x] Frontend: Update `UserMenu.tsx` to show badge next to username
- [x] Regenerate TypeScript client (`uv run bash scripts/generate-client.sh`)

## Summary
Create a reusable premium badge component (star icon) that displays next to premium users' names throughout the app.

## Acceptance Criteria
- [ ] `<PremiumBadge />` component created
- [ ] Badge shows star icon for premium users
- [ ] Badge hidden for non-premium users
- [ ] Added to UserMenu (navbar) next to username
- [ ] Consistent styling across app

## Technical Details

### Backend: Add Premium Status to User Response
Need endpoint or modification to return premium status with user data.

Option A: Add to `/api/v1/users/me` response
Option B: Create new `/api/v1/stripe/status` endpoint

### New Component
Create `frontend/src/components/Premium/PremiumBadge.tsx`:
- Props: `isPremium: boolean`
- Renders star icon (FaStar) when true
- Returns null when false
- Yellow/gold color styling

### Modify UserMenu
Update `frontend/src/components/Common/UserMenu.tsx`:
- Import PremiumBadge
- Add badge next to user's name in the menu button
- Fetch/use premium status from user context or API

### Files to Create/Modify
1. `frontend/src/components/Premium/PremiumBadge.tsx` - NEW
2. `frontend/src/components/Common/UserMenu.tsx` - Add badge
3. Backend endpoint to expose premium status (TBD)

## Dependencies
- Need way to get premium status on frontend (new endpoint or modify existing)

## Notes
- Consider adding premium status to the user query response
- Badge should be subtle but visible
- Use FaStar icon from react-icons/fa
