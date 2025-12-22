# STRIPE-4.3: Production Deployment

## Status: IN PROGRESS

## Summary
Deploy Stripe premium integration to production (home server), configure production Stripe keys, and verify the full payment flow works in live mode.

## Prerequisites
- [x] All Phase 1-3 code complete and tested locally
- [x] Webhook handler tested with Stripe CLI
- [x] Premium status correctly updates in database
- [ ] Changes committed and pushed to `stripe` branch

## Deployment Steps

### 1. Pull Latest Changes on Home Server
```bash
cd /path/to/project
git fetch origin
git checkout stripe
git pull origin stripe
```

### 2. Configure Production Environment Variables
Add to production `.env`:
```bash
# Stripe Production Keys (from https://dashboard.stripe.com/apikeys)
STRIPE_SECRET_KEY=sk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...  # Generated in step 3
STRIPE_PREMIUM_PRICE_CENTS=100
```

### 3. Configure Stripe Webhook in Dashboard
1. Go to https://dashboard.stripe.com/webhooks
2. Click "Add endpoint"
3. Enter endpoint URL: `https://your-domain.com/api/v1/stripe/webhook`
4. Select events to listen for:
   - `checkout.session.completed`
5. Click "Add endpoint"
6. Copy the signing secret (`whsec_...`) to production `.env`

### 4. Rebuild and Deploy
```bash
docker compose down
docker compose up -d --build
```

### 5. Run Database Migration (if needed)
```bash
docker compose exec backend alembic upgrade head
```

## Production Testing Checklist

### Payment Flow
- [ ] Navigate to Settings page, see "Free Tier" status
- [ ] Click "Upgrade to Premium - $1"
- [ ] Redirected to Stripe Checkout (live mode)
- [ ] Complete payment with real card
- [ ] Redirected to /payment-success page
- [ ] Premium badge appears in navbar

### Webhook Verification
- [ ] Check Stripe Dashboard > Webhooks > Recent deliveries
- [ ] Confirm `checkout.session.completed` event shows 200 response
- [ ] Verify `premium_user` row created in database:
  ```bash
  docker compose exec db psql -U postgres -d app -c "SELECT * FROM premium_user;"
  ```

### Feature Verification
- [ ] Premium badge visible next to username in navbar
- [ ] Settings page shows "Premium Member" status
- [ ] Items page shows "X items (Premium)" instead of "X/2 (Free Tier)"
- [ ] Can create more than 2 items (no limit for premium)

### Error Handling
- [ ] Canceling checkout returns to Settings page
- [ ] Already premium user sees appropriate message (not double-charged)

## Rollback Plan
If issues occur:
1. Check backend logs: `docker compose logs backend --tail 100`
2. Check Stripe Dashboard for webhook failures
3. Verify environment variables are set correctly
4. If critical: revert to previous commit

## Environment Variables Reference

| Variable | Description | Where to Get |
|----------|-------------|--------------|
| `STRIPE_SECRET_KEY` | Live secret key | Stripe Dashboard > API Keys |
| `STRIPE_WEBHOOK_SECRET` | Webhook signing secret | Stripe Dashboard > Webhooks > Your endpoint |
| `STRIPE_PREMIUM_PRICE_CENTS` | Price in cents (100 = $1) | Set manually |

## Notes
- Production uses live Stripe keys (sk_live_*, not sk_test_*)
- Real charges will occur - use your own card for testing
- Webhook endpoint must be HTTPS in production
- First production test: consider using $1 price to minimize risk

## Post-Deployment
- [ ] Monitor Stripe Dashboard for successful payments
- [ ] Check application logs for any errors
- [ ] Verify premium features work for paid users
