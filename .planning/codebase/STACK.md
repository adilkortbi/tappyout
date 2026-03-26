# Technology Stack

**Analysis Date:** 2026-03-26

## Languages

**Primary:**
- TypeScript 5.x - Full codebase, strict mode enabled for type safety
- JSX/TSX - React component syntax with TypeScript integration

**Secondary:**
- JavaScript - Configuration files (postcss.config.mjs)
- CSS - Tailwind CSS utility-first styling

## Runtime

**Environment:**
- Node.js - No specific version specified (.nvmrc file absent)

**Package Manager:**
- npm - Lockfile: `package-lock.json` present

## Frameworks

**Core:**
- Next.js 15.5.12 - Full-stack React framework with Turbopack bundler support
- React 19.1.0 - UI library (used with React DOM 19.1.0)

**Styling & UI:**
- Tailwind CSS 4.x - Utility-first CSS framework
- Radix UI - Headless component library for accessible UI components
  - @radix-ui/react-accordion 1.2.12
  - @radix-ui/react-avatar 1.1.10
  - @radix-ui/react-label 2.1.7
  - @radix-ui/react-select 2.2.6
  - @radix-ui/react-separator 1.1.7
  - @radix-ui/react-slot 1.2.3

**Animation & Motion:**
- Framer Motion 12.23.19 - Animation library for interactive elements

**State Management:**
- Zustand 5.0.8 - Lightweight state management with persistence middleware
- next-themes 0.4.6 - Theme switching (dark/light mode)

**Payment Processing:**
- Stripe 20.0.0 - Backend payment processing SDK
- @stripe/stripe-js 8.5.1 - Frontend Stripe.js library
- @stripe/react-stripe-js 5.3.0 - React components for Stripe integration

**UI Utilities:**
- Lucide React 0.544.0 - Icon library
- Sonner 2.0.7 - Toast notification system
- Class Variance Authority 0.7.1 - CSS class composition utility
- clsx 2.1.1 - Conditional className utility
- Tailwind Merge 3.3.1 - Tailwind CSS class merging

**Canvas & Graphics:**
- Fabric.js 6.7.1 - Canvas manipulation library for design tools
- @types/fabric 5.3.10 - TypeScript types for Fabric.js

**Forms & Input:**
- React Phone Number Input 3.4.12 - International phone number input component
- libphonenumber-js 1.12.18 - Phone number parsing and formatting

## Testing

**Not configured** - No testing framework or test runner detected

## Build/Dev

**Bundler:**
- Turbopack - Next.js bundler for fast development builds (used with `next dev --turbopack`)

**Linting:**
- ESLint 9.x - JavaScript/TypeScript linting
- eslint-config-next 15.5.12 - Next.js ESLint configuration preset
- @eslint/eslintrc 3.x

**Build System:**
- Next.js build command uses Turbopack for optimized production builds

**CSS Processing:**
- PostCSS 4.x - CSS transformation framework
- @tailwindcss/postcss 4.x - PostCSS plugin for Tailwind CSS

## Configuration

**Environment:**
- `.env` file present - Contains configuration for:
  - EMAIL_ACCOUNT (FormSubmit.co email)
  - STRIPE_SECRET_KEY (server-side only)
  - NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY (client-side, safe for browser)
  - STRIPE_WEBHOOK_SECRET (optional, for webhook handling)
- `.env.example` file present for documentation

**Build:**
- `tsconfig.json` - TypeScript configuration with path alias `@/*` mapping to `./src/*`
- `next.config.ts` - Next.js configuration:
  - Remote image allowlist: `images2.imgbox.com` for external image optimization
- `postcss.config.mjs` - PostCSS configuration for Tailwind CSS
- `.eslintrc.json` - ESLint rules configuration

## Platform Requirements

**Development:**
- Node.js (version not specified)
- npm package manager
- Modern browser with ES2017+ support

**Production:**
- Deployment target: Serverless/Edge (Next.js compatible)
  - Vercel (recommended for Next.js)
  - Any Node.js-compatible platform
- Environment variables required for Stripe integration

---

*Stack analysis: 2026-03-26*
