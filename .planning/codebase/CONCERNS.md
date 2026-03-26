# Codebase Concerns

**Analysis Date:** 2026-03-26

## Tech Debt

**Fragile Order ID Generation:**
- Issue: Orders use `Date.now().toString().slice(-6)` or last 12 chars of Stripe payment intent for display only
- Files: `src/app/checkout/page.tsx` (line 79), `src/app/checkout/success/page.tsx` (line 44)
- Impact: Non-unique order identifiers in the UI. Collisions possible if multiple orders placed within same millisecond. Transaction ID display may not be reliable for customer support lookups.
- Fix approach: Generate proper sequential order IDs server-side with persistent database storage instead of client-side timestamp slicing

**sessionStorage for Critical Order Data:**
- Issue: Order data and cart state relying on browser sessionStorage for persistence across payment flow
- Files: `src/components/checkout/checkout-form.tsx` (lines 47-48, 80), `src/app/checkout/success/page.tsx` (lines 47-52)
- Impact: Data loss if user clears session, browser tabs closed unexpectedly, or if sessionStorage is disabled. Payment intent ID extraction is fragile.
- Fix approach: Implement server-side order persistence with database. Store order state in secure HTTP-only cookies or authenticated API responses instead of sessionStorage.

**Inefficient Cart Item Addition Loop:**
- Issue: Cart items added with unnecessary loop when quantity > 1
- Files: `src/app/customize/[id]/page.tsx` (lines 46-50)
- Impact: Creates N separate Zustand state updates and persistence writes instead of single batch operation. Scales poorly with high quantities.
- Fix approach: Refactor `addItem` to accept quantity parameter. Update store to add item once with quantity field.

**Unvalidated Product IDs:**
- Issue: Product lookup only uses `notFound()` but doesn't validate against actual product database
- Files: `src/app/customize/[id]/page.tsx` (line 25), `src/app/products/[id]/page.tsx` (similar pattern)
- Impact: Relies on hardcoded PRODUCTS array. Invalid product states could occur if products are dynamic. No 404 SEO optimization.
- Fix approach: Validate against backend product source. Implement proper database layer with real product inventory.

## Security Considerations

**Exposed Email Configuration in Contact Form:**
- Risk: Email address embedded in client-side code via process.env
- Files: `src/app/contact/page.tsx` (line 38)
- Current mitigation: Using FormSubmit.co third-party service
- Recommendations: Move email configuration to environment variables (already using process.env.EMAIL_ACCOUNT - good). Validate email before form submission. Consider implementing server-side contact form handler instead of third-party dependency.

**Stripe Configuration Validation:**
- Risk: Checking for placeholder strings at runtime is fragile; should fail at build/startup
- Files: `src/app/api/stripe/payment-intent/route.ts` (lines 16-17)
- Current mitigation: Console error logging
- Recommendations: Move Stripe key validation to application startup. Use TypeScript to enforce required env vars. Return HTTP 500 with generic message (currently does this correctly). Add structured logging.

**Missing CSRF Protection on Payment Intent Creation:**
- Risk: POST endpoint at `src/app/api/stripe/payment-intent/route.ts` lacks CSRF token validation
- Files: `src/app/api/stripe/payment-intent/route.ts`
- Current mitigation: None detected
- Recommendations: Implement CSRF tokens for state-changing requests. Use same-origin checks. Consider implementing request signing with user session.

**Direct window.location.href Assignment:**
- Risk: Unvalidated URL assignment could be vulnerable to XSS in edge cases
- Files: `src/components/checkout/checkout-form.tsx` (line 84)
- Current mitigation: URL is constructed from `paymentIntent.id` (Stripe-provided)
- Recommendations: Use Next.js `router.push()` instead of `window.location.href`. Implement URL validation before redirect.

## Performance Bottlenecks

**Canvas Rendering with Fabric.js (482 lines):**
- Problem: Heavy Fabric.js canvas library initialized on every customize page load even when not needed
- Files: `src/components/forms/card-designer.tsx` (entire component)
- Cause: Full canvas setup runs for all card templates. No lazy loading for image processing. Event handlers create closure overhead.
- Improvement path: Implement lazy loading for canvas initialization. Split wooden card UI from canvas UI. Consider canvas rendering optimization with render layers. Debounce scaling events.

**Cart Store Persistence on Every Update:**
- Problem: Zustand persist middleware writes entire cart to localStorage on every action
- Files: `src/lib/store/cart.ts` (lines 21-96)
- Cause: No batching or debouncing of persistence. Each quantity change, add, or remove triggers localStorage write.
- Improvement path: Debounce localStorage writes (100-200ms). Implement selective persistence (only critical data). Consider IndexedDB for larger payloads.

**Image Loading Without Optimization:**
- Problem: External images loaded directly without Next.js Image component optimization
- Files: `src/components/checkout/checkout-form.tsx` (line 180), `src/components/layout/cart.tsx` (line 81-82), multiple product image locations
- Cause: Using HTML `<img>` tags instead of `next/image`. No lazy loading, CDN optimization, or srcset.
- Improvement path: Replace all `<img>` with `next/image` component. Implement lazy loading for checkout/cart images. Add proper width/height hints.

**Fabric.js as Unoptimized External Dependency:**
- Problem: 482-line card designer uses heavy Fabric.js library for basic canvas manipulation
- Files: `src/components/forms/card-designer.tsx`
- Cause: Library overkill for drag-resize-scale functionality. No tree-shaking. Full library bundled.
- Improvement path: Evaluate if HTML5 canvas native APIs sufficient. Consider lightweight alternatives like Konva.js or canvas-based custom implementation. Lazy load Fabric.js only on customize page.

## Fragile Areas

**Card Designer Component (482 lines):**
- Files: `src/components/forms/card-designer.tsx`
- Why fragile: Monolithic component mixing canvas state, UI controls, and image handling. Complex event handler chains (scaling, selection, movement). Custom scaling boundary logic uses internal `_maxScaleX/_maxScaleY` properties (non-standard).
- Safe modification: Extract canvas initialization to separate hook. Separate wooden card UI from customizable card UI. Create focused event handler utilities. Test all scaling edge cases (corners, boundaries, flips).
- Test coverage: No test files found. Scaling constraints (lines 100-135) need unit tests for boundary conditions.

**Checkout Form with Multiple State Dependencies:**
- Files: `src/components/checkout/checkout-form.tsx`
- Why fragile: Form state depends on Stripe Elements loading, sessionStorage, cart store, and payment confirmation state. Error handling path removes sessionStorage on failure but may lose data on unexpected redirects. Customer info validation minimal.
- Safe modification: Add comprehensive form validation. Implement retry logic with data persistence. Separate concerns: form handling vs. payment processing vs. data persistence.
- Test coverage: No tests. Form submission flow (lines 37-86) with error paths needs integration tests.

**Session-Based Order Persistence:**
- Files: `src/components/checkout/checkout-form.tsx`, `src/app/checkout/success/page.tsx`, `src/app/checkout/page.tsx`
- Why fragile: Three separate files depend on implicit sessionStorage contract. No schema validation. JSON parsing without try-catch (line 50 in success page).
- Safe modification: Create `useOrderData()` hook with validation. Implement server-side order persistence layer. Add error boundaries for corrupted data.
- Test coverage: None. sessionStorage access needs mocking in tests.

**Hardcoded Product Array:**
- Files: `src/lib/constants/products.ts`
- Why fragile: All product logic depends on static PRODUCTS array. No validation that products exist before rendering. Product category enum in types (`'standard' | 'premium' | 'luxury'`) doesn't match actual categories in products.
- Safe modification: Move to database. Implement product service with caching. Add runtime validation of product structure. Make categories dynamic.
- Test coverage: No validation tests.

## Scaling Limits

**Static Product Inventory:**
- Current capacity: Hardcoded 3 products in memory
- Limit: Cannot scale to dynamic product catalog. No inventory tracking for real sales.
- Scaling path: Implement database-backed product service. Add inventory management system. Create admin panel for product CRUD.

**Cart Persistence via localStorage:**
- Current capacity: Limited by browser localStorage size (typically 5-10MB)
- Limit: Large customization data (base64 canvas designs) quickly exceeds quota
- Scaling path: Move cart to server-side with user accounts. Implement canvas design compression. Use IndexedDB for larger data.

**No Order Management System:**
- Current capacity: Orders stored only in sessionStorage, never persisted
- Limit: No order history, no customer support tracking, no analytics
- Scaling path: Implement database-backed order system. Add order API endpoints. Create order dashboard for admins and customers.

## Dependencies at Risk

**Fabric.js (6.7.1) - Large Untyped Library:**
- Risk: Large bundle size (482 lines of component code just to use it). Type definitions via `@types/fabric` may lag behind library.
- Impact: Canvas customization breaks if Fabric API changes. Difficult to test custom object scaling logic.
- Migration plan: Evaluate switching to native Canvas API or Konva.js. Create abstraction layer around Fabric usage to ease migration.

**Stripe.js SDK Version Mismatch:**
- Risk: Using `apiVersion: '2025-11-17.clover'` which is a custom version string (non-standard Stripe API version format)
- Files: `src/app/api/stripe/payment-intent/route.ts` (line 10)
- Impact: May cause payment processing to fail if version doesn't exist or is deprecated
- Migration plan: Update to valid Stripe API version (e.g., `'2024-12-15'`). Review Stripe documentation for current supported versions.

**Next.js Turbopack (Experimental):**
- Risk: Using `next dev --turbopack` and `next build --turbopack` with Next.js 15.5.12. Turbopack still experimental in some features.
- Files: `package.json` (lines 6-7)
- Impact: May encounter build instability, slower cold builds, or incompatibilities with certain plugins
- Migration plan: Monitor Turbopack stability. Have fallback to SWC if issues occur. Test production builds thoroughly.

## Missing Critical Features

**No User Authentication:**
- Problem: Checkout accepts any email, stores customer info in sessionStorage only
- Blocks: Cannot support order history, saved preferences, account dashboards, personalized recommendations
- Priority: High - Blocks scaling to repeat customers

**No Email Notifications:**
- Problem: Checkout displays "confirmation email will be sent" but no backend email service implemented
- Blocks: Customers never receive order confirmations, shipping updates, or support contact ability
- Priority: High - Required for basic e-commerce functionality

**No Inventory Management:**
- Problem: Cart allows unlimited quantities, no stock tracking
- Blocks: Cannot manage inventory, prevent overselling, implement backorder workflows
- Priority: High - Will cause fulfillment issues

**No Discount/Coupon System:**
- Problem: Discount code input field exists in UI but "Apply" button has no handler
- Files: `src/app/customize/[id]/page.tsx` (lines 281-283)
- Blocks: Cannot run promotions, no revenue optimization through discounts
- Priority: Medium

**No Admin Dashboard:**
- Problem: No way to manage orders, inventory, or products
- Blocks: Requires manual database access to fulfill orders
- Priority: High - Blocks operationalizing business

## Test Coverage Gaps

**No Test Files Found:**
- What's not tested: Entire codebase - 0 test files detected
- Files: All source files lack corresponding `.test.ts`, `.spec.ts` files
- Risk: Breaking changes undetected, regressions in payment flow, cart state corruption goes unnoticed
- Priority: Critical - Payment processing and cart logic need unit + integration tests

**Canvas Scaling Logic Untested:**
- What's not tested: Image scaling constraints (lines 96-135 in card-designer.tsx), boundary conditions, aspect ratio preservation
- Files: `src/components/forms/card-designer.tsx`
- Risk: Custom canvas interactions break on edge cases (oversized images, mobile, extreme scales)
- Priority: High

**Payment Flow Untested:**
- What's not tested: Stripe payment intent creation, error handling, sessionStorage persistence across redirects
- Files: `src/app/api/stripe/payment-intent/route.ts`, `src/components/checkout/checkout-form.tsx`, `src/app/checkout/success/page.tsx`
- Risk: Silent payment failures, incomplete orders, data loss on payment failures
- Priority: Critical - Financial transactions at stake

**Cart State Management Untested:**
- What's not tested: Zustand store operations (addItem, removeItem, updateQuantity, clearCart), persistence, edge cases
- Files: `src/lib/store/cart.ts`
- Risk: Cart duplication, phantom items, incorrect totals
- Priority: High

---

*Concerns audit: 2026-03-26*
