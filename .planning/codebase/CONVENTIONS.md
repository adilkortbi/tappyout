# Coding Conventions

**Analysis Date:** 2026-03-26

## Naming Patterns

**Files:**
- Components: PascalCase with `.tsx` extension (e.g., `ProductCard.tsx`, `Navbar.tsx`, `CardDesigner.tsx`)
- Hooks: camelCase prefixed with `use-` (e.g., `use-toast.ts`)
- Utilities: camelCase (e.g., `utils.ts`, `stripe.ts`)
- Constants: camelCase for files (e.g., `products.ts`, `content.ts`)
- Pages: kebab-case in directory names with `page.tsx` (e.g., `src/app/shop/page.tsx`, `src/app/customize/[id]/page.tsx`)
- Types/Interfaces: file as `index.ts` in types directory

**Functions:**
- camelCase for all function names
- Prefix with `handle` for event handlers (e.g., `handleFileUpload`, `handleAddToCart`, `handleSaveAndContinue`)
- Prefix with `get` for getter functions (e.g., `getCategoryColor`, `getTotal`, `getItemCount`)
- Async functions: camelCase (e.g., `fetchPaymentIntent`)

**Variables:**
- camelCase for all variables and state
- Boolean prefixed with `is` or `has` (e.g., `isOpen`, `isMounted`, `isWoodenCard`, `mounted`, `selectedObject`)
- Arrays: plural nouns (e.g., `items`, `navigation`, `features`, `footerLinks`)
- Refs: suffixed with `Ref` (e.g., `canvasRef`, `fileInputRef`)

**Types:**
- PascalCase for all interfaces and type names (e.g., `Product`, `CartItem`, `CartStore`, `ProductCardProps`, `CardDesignerProps`)
- Props interfaces: ComponentName + `Props` suffix (e.g., `ProductCardProps`, `AddToCartButtonProps`, `CardDesignerProps`)
- State interfaces: descriptive names (e.g., `CartStore`, `Customer`, `Order`)

## Code Style

**Formatting:**
- No automatic formatter configured (prettier config not detected)
- Consistent indentation: 2 spaces used throughout
- Line length: no strict limit observed, lines up to 100+ characters

**Linting:**
- ESLint enabled with Next.js configuration (`eslint.config.mjs`)
- Base configs: `next/core-web-vitals` and `next/typescript`
- Custom rules:
  - `react/no-unescaped-entities`: off
  - `@typescript-eslint/no-unused-vars`: warn

**Ignored patterns:**
- `node_modules/`, `.next/`, `out/`, `build/`, `next-env.d.ts`

## Import Organization

**Order:**
1. React and Next.js core imports (e.g., `React`, `next/link`, `next/image`)
2. Third-party libraries (e.g., `clsx`, `zustand`, `lucide-react`, `fabric`)
3. UI components from `@/components/ui/`
4. Business components from `@/components/`
5. Types from `@/lib/types`
6. Hooks from `@/hooks/`
7. Utilities from `@/lib/utils`
8. Store imports from `@/lib/store/`
9. Constants from `@/lib/constants/`

**Path Aliases:**
- `@/*` → `./src/*` - Single root alias for all imports
- Examples: `@/components/ui/button`, `@/lib/types`, `@/hooks/use-toast`

## Error Handling

**Patterns:**
- Try-catch blocks for async operations (see `/src/app/api/stripe/payment-intent/route.ts`)
- Error type checking: `if (error instanceof Error)` for specific error messages
- Validation before operations: check for required values before processing (e.g., amount > 0, URL validation)
- User-facing error messages via `toast` notifications
- Server-side console logging for debugging: `console.error('message', error)`
- Return descriptive HTTP error responses from API routes with status codes (400, 500)

**Example pattern from payment intent route:**
```typescript
try {
  if (!amount || amount <= 0) {
    return NextResponse.json({ error: 'Invalid amount provided' }, { status: 400 });
  }
  // Process request
} catch (error) {
  console.error('Error creating payment intent:', error);
  if (error instanceof Error) {
    return NextResponse.json(
      { error: `Payment setup failed: ${error.message}` },
      { status: 500 }
    );
  }
  return NextResponse.json({ error: 'Failed to create payment intent' }, { status: 500 });
}
```

## Logging

**Framework:** Console object (`console.error`, `console.log`)

**Patterns:**
- Use `console.error()` in catch blocks for exceptions
- Log descriptive error messages with context (e.g., 'Error creating payment intent:', error)
- No centralized logging service detected
- Client-side notifications via `useToast()` hook for user feedback

**Example:**
```typescript
const { toast } = useToast();
toast({ title: "Success", description: "Action completed" });
console.error('Detailed error for debugging', error);
```

## Comments

**When to Comment:**
- Explain complex logic or non-obvious behavior (e.g., in `card-designer.tsx`: canvas event handlers, max scale calculations)
- Document intent for future maintainers
- Describe workarounds or temporary solutions
- No JSDoc comments observed

**JSDoc/TSDoc:**
- Not actively used in codebase
- TypeScript interfaces provide sufficient documentation

**Inline comments:**
- Used to clarify sections: `// Logo`, `// Desktop Navigation`, `// Mobile Menu Button`
- Explain "why" not "what" (e.g., `// Skip canvas setup for wooden cards - they cannot be customized visually`)

## Function Design

**Size:**
- Generally small focused functions (100-200 lines max for components)
- Larger files with multiple responsibilities: `card-designer.tsx` (483 lines) handles template selection and canvas logic

**Parameters:**
- Use destructuring for props: `{ product }: ProductCardProps`
- Group related parameters into objects for optional settings
- Type all parameters explicitly

**Return Values:**
- JSX components return `JSX.Element` implicitly
- Event handlers return void
- Utility functions return explicit types (e.g., `string`, `number`, `object`)
- API routes return `NextResponse` with typed JSON payloads

**Example pattern:**
```typescript
export function ProductCard({ product }: ProductCardProps) {
  const getCategoryColor = (category: Product['category']): string => {
    switch (category) {
      case 'standard':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300';
    }
  };
  // ...
}
```

## Module Design

**Exports:**
- Named exports for all components and functions: `export function ComponentName() {}`
- Single export per file (components), or multiple related exports (utils, types)
- No default exports used in component files

**Barrel Files:**
- Index files used for type exports: `src/lib/types/index.ts` exports `Product`, `CartItem`, `Customer`, `Order`, `Address`, `Testimonial`, `FAQ`
- No barrel files for components observed

**Example from types:**
```typescript
// src/lib/types/index.ts
export interface Product {
  id: string;
  name: string;
  // ...
}
export interface CartItem {
  product: Product;
  quantity: number;
}
```

## Client vs Server Components

**Client Components:**
- Marked with `'use client'` directive at file top
- Used for: state management, hooks, event handlers, interactive features
- Examples: `navbar.tsx`, `card-designer.tsx`, `cart.ts` (Zustand store)

**Server Components:**
- Default in Next.js App Router
- Used for: page layouts, data fetching, static content
- Examples: `layout.tsx`, `page.tsx`, `product-card.tsx` (can be client but typically server)

**API Routes:**
- `src/app/api/stripe/payment-intent/route.ts` - Server-side only, handles Stripe integration

---

*Convention analysis: 2026-03-26*
