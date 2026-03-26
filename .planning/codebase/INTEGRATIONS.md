# External Integrations

**Analysis Date:** 2026-03-26

## APIs & External Services

**Payment Processing:**
- Stripe - Payment gateway for credit card and wallet payments
  - SDK/Client: `stripe` (v20.0.0), `@stripe/stripe-js` (v8.5.1), `@stripe/react-stripe-js` (v5.3.0)
  - Auth: `STRIPE_SECRET_KEY` (server-side environment variable)
  - Client Key: `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` (client-side environment variable)
  - Implementation: `src/lib/stripe/stripe.ts` exports Stripe client initialization
  - API Endpoint: `src/app/api/stripe/payment-intent/route.ts` handles PaymentIntent creation
  - Version: API version 2025-11-17.clover

**Contact Form Service:**
- FormSubmit.co - Email form submission service (no-code form backend)
  - Method: Form POST to `https://formsubmit.co/${EMAIL_ACCOUNT}`
  - Auth: `EMAIL_ACCOUNT` environment variable (email address)
  - Configured in: `src/app/contact/page.tsx`
  - Features: Table-formatted HTML emails, custom subject, auto-response redirects

**Image Hosting:**
- ImgBox (images2.imgbox.com) - External image hosting for product images
  - Configured in: `next.config.ts` remote image pattern allowlist
  - Usage: Product photos in `src/components/forms/card-designer.tsx`

## Data Storage

**Client-Side Storage:**
- Browser LocalStorage - Via Zustand persistence middleware
  - Key: `cart-storage` - Shopping cart state persistence
  - Implementation: `src/lib/store/cart.ts` uses `persist` middleware from zustand/middleware
  - Persisted data: Cart items, quantities, customizations (logo, NFC URL)

**Session Storage:**
- Browser SessionStorage - Temporary order data during checkout
  - Key: `lastOrder` - Stores order details before payment confirmation
  - Data structure: Items, total, customer email/name
  - Cleared on payment failure; used for success page display
  - Implementation: `src/components/checkout/checkout-form.tsx`

**Databases:**
- Not detected - Application uses client-side state only
- No backend database (PostgreSQL, MongoDB, etc.) detected
- Product data stored locally: `src/lib/constants/products.ts`

**File Storage:**
- Client-side only - No cloud file storage detected
- File uploads: Canvas designs and logos handled in-memory for customization
  - Type: `File` objects in CartItem customization
  - Implementation: `src/components/forms/card-designer.tsx`

**Caching:**
- None configured - Relies on Next.js built-in caching

## Authentication & Identity

**Auth Provider:**
- Custom/None - No auth system configured
- Guest checkout - No user accounts or authentication required
- Customer data collected at checkout via: `src/components/checkout/checkout-form.tsx`
  - Fields: First name, last name, email, phone
  - Shipping address: Collected via Stripe AddressElement

## Monitoring & Observability

**Error Tracking:**
- None configured - Console logging only

**Logs:**
- Browser console - Runtime error logging via `console.error()`
- Server-side errors logged to stdout/stderr in API routes
- Implementation: `src/app/api/stripe/payment-intent/route.ts` logs payment intent creation errors

## CI/CD & Deployment

**Hosting:**
- Not specified in configuration
- Next.js compatible platforms supported:
  - Vercel (recommended)
  - Self-hosted Node.js environments
  - Docker containers

**CI Pipeline:**
- None detected

## Environment Configuration

**Required env vars:**

**Server-Side (Secret):**
- `STRIPE_SECRET_KEY` - Stripe API secret key (starts with `sk_`)
- `EMAIL_ACCOUNT` - Email address for FormSubmit.co

**Client-Side (Public):**
- `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` - Stripe publishable key (starts with `pk_`)

**Optional:**
- `STRIPE_WEBHOOK_SECRET` - For future webhook handling (documented but not implemented)

**Secrets location:**
- `.env` file - Local development (not committed)
- `.env.example` - Template documentation
- Platform env vars - Production deployment (Vercel, etc.)

## Webhooks & Callbacks

**Incoming:**
- None detected - No webhook handlers implemented
- Optional infrastructure noted in `.env.example` for `STRIPE_WEBHOOK_SECRET`

**Outgoing:**
- Stripe confirmPayment redirect - `window.location.href = /checkout/success`
  - Triggered on payment success
  - Passes `payment_intent` query parameter
  - Implementation: `src/components/checkout/checkout-form.tsx` (lines 84-85)
  - `confirmParams.return_url`: `${window.location.origin}/checkout/success`

**Form Callbacks:**
- FormSubmit.co redirect on submission
  - `_next` parameter: Redirects to `https://tappy-out.com/contact` after form submission
  - Implementation: `src/app/contact/page.tsx` (line 44)

## Data Flow

**Shopping Flow:**
1. Product browsing → Cart management (Zustand store)
2. Checkout page loads → Fetches Stripe PaymentIntent via `POST /api/stripe/payment-intent`
3. PaymentIntent client secret returned → Elements mounted for payment form
4. Customer submits payment → Stripe confirmPayment handles processing
5. Success → Redirected to `/checkout/success` with payment_intent query param
6. Order data cached in sessionStorage for success page display

**Contact Flow:**
1. Form submission → FormSubmit.co service (POST)
2. Email sent to configured EMAIL_ACCOUNT
3. Redirect to contact page confirmation

## Integration Points Summary

**Critical for Operations:**
- Stripe: Payment processing (requires valid test/live API keys)
- FormSubmit.co: Contact form email delivery (requires email account)

**Client-Side Only:**
- Zustand: Local state persistence
- No backend API required (stateless client application)
- All business logic runs in browser except payment processing

---

*Integration audit: 2026-03-26*
