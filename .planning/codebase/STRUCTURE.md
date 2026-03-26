# Codebase Structure

**Analysis Date:** 2026-03-26

## Directory Layout

```
src/
├── app/                           # Next.js App Router pages and routes
│   ├── about/
│   │   └── page.tsx              # About page
│   ├── api/                       # Backend API routes
│   │   └── stripe/
│   │       └── payment-intent/
│   │           └── route.ts       # Stripe PaymentIntent creation endpoint
│   ├── cart/
│   │   └── page.tsx              # Shopping cart page
│   ├── checkout/
│   │   ├── page.tsx              # Checkout page
│   │   └── success/
│   │       └── page.tsx          # Order confirmation page
│   ├── contact/
│   │   └── page.tsx              # Contact page
│   ├── customize/
│   │   └── [id]/
│   │       └── page.tsx          # Product customization with dynamic ID
│   ├── products/
│   │   └── [id]/
│   │       └── page.tsx          # Product details with dynamic ID
│   ├── shop/
│   │   └── page.tsx              # Shop/product listing
│   ├── layout.tsx                # Root layout (wraps all pages)
│   ├── page.tsx                  # Home page
│   ├── globals.css               # Global Tailwind styles
│   ├── robots.ts                 # SEO robots metadata
│   └── sitemap.ts                # SEO sitemap
├── components/                    # Reusable React components
│   ├── checkout/
│   │   └── checkout-form.tsx     # Stripe payment form component
│   ├── forms/
│   │   └── card-designer.tsx     # Fabric.js canvas designer
│   ├── layout/
│   │   ├── navbar.tsx            # Top navigation bar
│   │   ├── footer.tsx            # Footer
│   │   └── cart.tsx              # Shopping cart modal/sidebar
│   ├── sections/
│   │   ├── hero.tsx              # Homepage hero
│   │   ├── features.tsx          # Features section
│   │   ├── product-card.tsx      # Product card component (grid)
│   │   ├── add-to-cart-button.tsx # Add to cart button
│   │   ├── how-it-works.tsx      # How it works section
│   │   ├── testimonials.tsx      # Customer testimonials
│   │   ├── cta.tsx               # Call-to-action section
│   │   └── faq.tsx               # FAQ section
│   └── ui/                        # Radix UI + Tailwind primitives
│       ├── accordion.tsx
│       ├── avatar.tsx
│       ├── badge.tsx
│       ├── button.tsx
│       ├── card.tsx
│       ├── input.tsx
│       ├── label.tsx
│       ├── select.tsx
│       ├── separator.tsx
│       ├── scroll-reveal.tsx     # Framer motion scroll animation
│       └── sonner.tsx            # Toast notifications wrapper
├── hooks/
│   └── use-toast.ts              # Custom hook for toast notifications
├── lib/                          # Utilities, types, configuration
│   ├── constants/
│   │   ├── products.ts           # Static PRODUCTS array
│   │   └── content.ts            # Static text content
│   ├── providers/
│   │   └── theme-provider.tsx    # next-themes dark mode setup
│   ├── store/
│   │   └── cart.ts               # Zustand cart state store
│   ├── stripe/
│   │   └── stripe.ts             # Stripe SDK initialization
│   ├── types/
│   │   └── index.ts              # TypeScript interfaces
│   └── utils.ts                  # Utility functions (class merging)
└── public/                        # Static assets
    ├── customizable-white.png    # Card template background
    ├── customizable-black.png    # Card template background
    ├── tappy-out-light-mode.svg  # Logo light
    └── tappy-out-dark-mode.svg   # Logo dark
```

## Directory Purposes

**`src/app/`**
- Purpose: Next.js App Router directory - defines routes, layouts, and API endpoints
- Contains: Page components (server/client), layout wrappers, API handlers
- Key files: `layout.tsx` (root), `page.tsx` (routes), dynamic segments `[id]`, API routes `route.ts`

**`src/app/api/`**
- Purpose: Backend API endpoints
- Contains: Server-only code handling requests from client (Stripe payment intents)
- Pattern: `route.ts` files export HTTP method handlers (POST, GET, etc.)
- Execution: Node.js environment with access to environment variables

**`src/components/`**
- Purpose: Reusable React components organized by domain
- Contains: UI components (buttons, cards, inputs), feature components (cart, navbar, designer)
- Subdirectories:
  - `ui/` - Headless primitives from Radix UI with Tailwind styles
  - `layout/` - Page structure components (nav, footer, cart modal)
  - `sections/` - Content sections for pages (hero, features, testimonials)
  - `forms/` - Complex form components (card designer, checkout)
  - `checkout/` - Checkout-specific components

**`src/lib/`**
- Purpose: Non-component utilities, configuration, and shared code
- Contains: State stores, types, constants, providers, Stripe config
- Subdirectories:
  - `store/` - Zustand state management
  - `types/` - TypeScript interface definitions
  - `constants/` - Static data (products array)
  - `providers/` - React context providers
  - `stripe/` - Stripe SDK setup
  - `utils.ts` - Helper functions (cn for class merging)

**`src/hooks/`**
- Purpose: Custom React hooks
- Contains: Reusable stateful logic (toast notifications)
- Pattern: Custom hooks exposed as named exports

## Key File Locations

**Entry Points:**
- `src/app/layout.tsx`: Root HTML wrapper, theme/toast providers, navbar/footer
- `src/app/page.tsx`: Home page landing with hero and sections
- `src/app/shop/page.tsx`: Product listing page
- `src/app/customize/[id]/page.tsx`: Card customization flow

**Configuration:**
- `src/lib/stripe/stripe.ts`: Stripe SDK initialization with public key
- `src/lib/providers/theme-provider.tsx`: Dark mode setup via next-themes
- `.env.local`: Environment variables (STRIPE_PUBLISHABLE_KEY, STRIPE_SECRET_KEY)

**Core Logic:**
- `src/lib/store/cart.ts`: Zustand cart state with persistence
- `src/lib/types/index.ts`: Product, CartItem, Customer, Order, Address interfaces
- `src/lib/constants/products.ts`: Static product catalog array
- `src/app/api/stripe/payment-intent/route.ts`: Stripe PaymentIntent server endpoint

**Testing:**
- No test files present (not detected)

**Styling:**
- `src/app/globals.css`: Global Tailwind CSS configuration
- Component-scoped styles via Tailwind className attributes
- Theme colors via CSS variables in theme provider

## Naming Conventions

**Files:**
- Pages: lowercase with hyphens (e.g., `checkout.tsx`, `product-card.tsx`)
- Dynamic segments: square brackets `[id]`, `[userId]`
- API routes: `route.ts`
- Components: PascalCase (e.g., `Navbar`, `CardDesigner`)
- Hooks: `use` prefix (e.g., `useToast`, `useCartStore`)
- Types: PascalCase interfaces (e.g., `Product`, `CartItem`)

**Directories:**
- Lowercase with hyphens for nested paths (e.g., `checkout/success`, `api/stripe/payment-intent`)
- Domain-based organization (e.g., `components/checkout/`, `components/sections/`)
- Logical grouping by feature or type

**Exports:**
- Named exports for components: `export function ComponentName() {}`
- Named exports for utilities: `export const functionName = () => {}`
- Default exports for pages (implicit in Next.js)
- Index files barrel re-exports not used (components imported directly)

**Variables & Functions:**
- camelCase for variables, functions, methods
- UPPERCASE for constants (PRODUCTS array)
- Prefixed with `handle` for event handlers: `handleAddToCart`, `handleFileUpload`
- Prefixed with `set` for state updaters: `setQuantity`, `setNfcLink`

## Where to Add New Code

**New Feature:**
- Page component: `src/app/[feature-name]/page.tsx`
- Feature-specific components: `src/components/[feature-name]/`
- Feature types: Add to `src/lib/types/index.ts`
- Feature state (if needed): `src/lib/store/[feature-name].ts`

**New Component/Module:**
- UI primitive: `src/components/ui/[component-name].tsx`
- Feature component: `src/components/[domain]/[component-name].tsx` (where domain = sections, forms, checkout, layout, etc.)
- Layout component: `src/components/layout/[component-name].tsx`
- Page-specific component: Colocate in same file as page or `src/components/[page-name]/`

**Utilities:**
- Shared helpers: `src/lib/utils.ts` or new file `src/lib/[utility-name].ts`
- Custom hooks: `src/hooks/use-[name].ts`
- Constants: `src/lib/constants/[name].ts`
- Type definitions: `src/lib/types/index.ts`

**State Management:**
- Global store: `src/lib/store/[feature].ts` using Zustand
- Local component state: useState within component
- Derived state: Computed in selectors or store methods (e.g., `getTotal()`)

**API Routes:**
- Feature endpoint: `src/app/api/[feature]/[action]/route.ts`
- Stripe payment: `src/app/api/stripe/payment-intent/route.ts` (already exists)
- Webhook handlers: `src/app/api/webhooks/[provider]/route.ts`

**Tests:**
- Colocate with source: `src/components/[name].test.tsx` or `src/lib/[name].test.ts`
- Use Jest + Vitest (not yet configured)

## Special Directories

**`public/`**
- Purpose: Static assets served at root URL
- Generated: No
- Committed: Yes
- Contents: Logos, card template images, favicon assets
- Usage: Referenced via `/filename` in Image components

**`.env.local`**
- Purpose: Environment variables (local development)
- Generated: No (manually created)
- Committed: No (in .gitignore)
- Required: STRIPE_PUBLISHABLE_KEY, STRIPE_SECRET_KEY
- Usage: Loaded automatically by Next.js

**`.next/`**
- Purpose: Next.js build output and cache
- Generated: Yes (by `npm run build` or `npm run dev`)
- Committed: No
- Contents: Compiled pages, static assets, build metadata

**`node_modules/`**
- Purpose: Installed dependencies
- Generated: Yes (by npm install)
- Committed: No
- Size: Large (~500MB+)

---

*Structure analysis: 2026-03-26*
