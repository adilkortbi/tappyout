# Architecture

**Analysis Date:** 2026-03-26

## Pattern Overview

**Overall:** Component-Driven E-Commerce SPA with Next.js 15 App Router

**Key Characteristics:**
- Client-side state management via Zustand (cart, UI state)
- Next.js App Router with Server Components as default
- Stripe payment integration for checkout flow
- Canvas-based card customization using Fabric.js
- Responsive Radix UI component system with Tailwind CSS
- Static products data with dynamic page segments

## Layers

**Presentation Layer (Components):**
- Purpose: Render user interface and handle interactions
- Location: `src/components/`
- Contains: UI components, sections, forms, layouts
- Depends on: Store (Zustand), Hooks, Types, Utils
- Used by: App Router pages

**Data/State Layer (Store):**
- Purpose: Centralized state management for cart and UI state
- Location: `src/lib/store/cart.ts`
- Contains: Zustand store with persist middleware (localStorage)
- Depends on: Types
- Used by: All components requiring cart access

**Service/Integration Layer (API & External):**
- Purpose: Backend communication and external integrations
- Location: `src/app/api/`, `src/lib/stripe/`
- Contains: Stripe payment intent creation, stripe client initialization
- Depends on: Stripe SDK
- Used by: Checkout page, checkout form

**Type/Model Layer:**
- Purpose: TypeScript interfaces and data structures
- Location: `src/lib/types/index.ts`
- Contains: Product, CartItem, Customer, Order, Address, Testimonial, FAQ interfaces
- Depends on: Nothing
- Used by: All other layers

**Constants Layer:**
- Purpose: Static data and configuration
- Location: `src/lib/constants/`
- Contains: Products list, content data
- Depends on: Types
- Used by: Shop, product, customize pages

**Utilities & Providers:**
- Purpose: Cross-cutting concerns and setup
- Location: `src/lib/utils.ts`, `src/lib/providers/`, `src/hooks/`
- Contains: Theme provider, toast hook, utility functions
- Depends on: React, Next.js

## Data Flow

**Shopping Experience Flow:**

1. **Browse** (`/shop` page)
   - Loads static PRODUCTS array from `src/lib/constants/products.ts`
   - Renders ProductCard components for each product
   - No state needed yet

2. **Product Details** (`/products/[id]` page)
   - Looks up product by ID from PRODUCTS array
   - Displays full features and pricing

3. **Customize** (`/customize/[id]` page - client component)
   - Initializes Fabric.js canvas (not for wooden cards)
   - User uploads logo → Fabric.js renders on canvas
   - User enters NFC URL → stored in local component state
   - User clicks "Save Design & Continue"
   - Design data (canvas.toJSON() + nfcLink) stored in setSavedDesign

4. **Add to Cart**
   - User clicks "Add to Cart" with quantity
   - `handleAddToCart()` calls `useCartStore().addItem(product, customization)`
   - Store updates items array with CartItem object containing:
     - product reference
     - quantity
     - customization (nfcUrl, canvasDesign)
   - Cart store persists to localStorage via Zustand persist middleware
   - Navbar updates item count badge via `getItemCount()`

5. **Cart View** (`src/components/layout/cart.tsx`)
   - Modal sidebar consuming cart store
   - Shows items with quantity controls
   - Displays total via `getTotal()` calculation
   - "Checkout" button navigates to `/checkout`

6. **Checkout** (`/checkout` page - client component)
   - useEffect hook calls POST `/api/stripe/payment-intent`
   - Server endpoint creates Stripe PaymentIntent, returns clientSecret
   - Stripe Elements (react-stripe-js) initialized with clientSecret
   - CheckoutForm collects customer info (name, email, phone)
   - AddressElement from Stripe for shipping address
   - PaymentElement from Stripe for payment method
   - On submit: `stripe.confirmPayment()` → redirects to `/checkout/success` on success
   - On success: `clearCart()` clears store, sessionStorage holds order data

7. **Order Confirmation** (`/checkout/success` page)
   - Reads order data from sessionStorage
   - Displays confirmation with order number

**State Management:**

- **Client-side:** Zustand store with localStorage persistence
  - Cart items, quantities, customization data
  - Cart open/close UI state
  - Survives page refresh via persist middleware

- **Server-side:** None persistent (payments handled by Stripe)
  - SessionStorage used for temporary order display only

**Communication Pattern:**
- Pages are mostly Server Components (default in App Router)
- `'use client'` marks interactive boundaries (navbar, cart, checkout, customizer)
- Client components use hooks (useState, useEffect, useCartStore)
- API route uses Next.js request/response pattern

## Key Abstractions

**CartStore (Zustand):**
- Purpose: Single source of truth for cart state across app
- Examples: `src/lib/store/cart.ts`
- Pattern: Zustand create() with persist middleware, direct state mutation in immer style
- Interface: `addItem()`, `removeItem()`, `updateQuantity()`, `clearCart()`, `getTotal()`, `getItemCount()`, `toggleCart()`, `openCart()`, `closeCart()`

**Product Model:**
- Purpose: Standardized product structure for catalog, cards, checkout
- Examples: `src/lib/types/index.ts`, `src/lib/constants/products.ts`
- Pattern: TypeScript interface defining shape, exported constant array as database
- Used: Shop list, product detail, customize options, cart, checkout summary

**CardDesigner Component:**
- Purpose: Encapsulate Fabric.js canvas customization logic
- Examples: `src/components/forms/card-designer.tsx`
- Pattern: Client component with ref-based canvas control, conditional rendering for wooden cards
- Capabilities: Logo upload, scaling, positioning, preview download, NFC URL input

**Stripe Integration Layer:**
- Purpose: Separate Stripe SDK initialization and payment endpoint
- Examples: `src/lib/stripe/stripe.ts`, `src/app/api/stripe/payment-intent/route.ts`
- Pattern: Client-side promise (stripePromise), server-side PaymentIntent creation
- Separation: Public key on client, secret key only on server

## Entry Points

**App Router Root:**
- Location: `src/app/layout.tsx`
- Triggers: Server renders on every request
- Responsibilities:
  - Sets metadata (SEO)
  - Wraps app in ThemeProvider, Toaster
  - Renders navbar, footer, cart modal, main content
  - Global styles via globals.css

**Home Page:**
- Location: `src/app/page.tsx`
- Triggers: GET /
- Responsibilities: Hero, Features, HowItWorks, Testimonials, FAQ sections with ScrollReveal

**Shop Page:**
- Location: `src/app/shop/page.tsx`
- Triggers: GET /shop
- Responsibilities: Grid of ProductCard components from PRODUCTS array

**Customize Page:**
- Location: `src/app/customize/[id]/page.tsx`
- Triggers: GET /customize/:id (dynamic segment)
- Responsibilities:
  - Loads product by ID
  - Renders CardDesigner component
  - Manages quantity and design state
  - Handles add-to-cart action
  - Shows order summary sidebar

**Checkout Page:**
- Location: `src/app/checkout/page.tsx`
- Triggers: GET /checkout
- Responsibilities:
  - Validates cart (redirects if empty)
  - Calls Stripe PaymentIntent API
  - Wraps CheckoutForm in Stripe Elements context
  - Displays order summary
  - Handles order completion state

**Payment Intent API:**
- Location: `src/app/api/stripe/payment-intent/route.ts`
- Triggers: POST /api/stripe/payment-intent
- Responsibilities:
  - Validates request (amount, currency)
  - Creates Stripe PaymentIntent with automatic payment methods
  - Returns clientSecret to client
  - Error handling with descriptive messages

## Error Handling

**Strategy:** Try-catch with user-facing error messages via toast notifications and error states

**Patterns:**

- **API Errors:** Server route catches errors, returns 400/500 with error message, client logs and displays via error state
  - Example: `src/app/api/stripe/payment-intent/route.ts` lines 45-60

- **Form Validation:** Inline validation with conditional error display
  - Example: CardDesigner NFC URL validation at line 230-233

- **User Feedback:** Toast notifications for all significant actions
  - Success: "Added to Cart", "Design saved"
  - Error: "Design Required", "Payment failed"
  - Implementation: `src/hooks/use-toast.ts` (sonner library)

- **Graceful Degradation:**
  - Wooden card customizer hides canvas, shows info banner
  - Checkout shows loading spinner during PaymentIntent creation
  - Disabled add-to-cart button until design saved

- **Network Resilience:**
  - Stripe SDK loaded asynchronously via promise
  - PaymentIntent fetch with error handling
  - No retry logic currently implemented

## Cross-Cutting Concerns

**Logging:** console.error used in error paths (no structured logging)
- PaymentIntent creation errors: `src/app/api/stripe/payment-intent/route.ts` line 46
- Stripe config validation: line 17

**Validation:**
- Stripe secret key presence check (environment)
- Amount > 0 check for payment intent
- NFC URL required check in CardDesigner
- Customer form fields required in CheckoutForm

**Authentication:** None (public e-commerce, no user accounts)
- All checkout anonymous
- No order history or user accounts

**Authorization:** None (all pages public, all products accessible)

**Customization State Persistence:**
- Design data saved to component state during customize flow
- NOT persisted to cart until "Add to Cart" clicked
- Once in cart, persists via Zustand + localStorage
- Customization lost if user leaves customize page without adding to cart

---

*Architecture analysis: 2026-03-26*
