# Testing Patterns

**Analysis Date:** 2026-03-26

## Test Framework

**Status:** No testing framework detected or configured

**Current State:**
- No Jest, Vitest, Mocha, or other test runner configured in `package.json`
- No test configuration files (`jest.config.js`, `vitest.config.ts`, `playwright.config.ts`)
- No test files found in source directories (only in `node_modules/`)
- No test scripts in `package.json`

**Development Dependencies:**
- No testing libraries (`@testing-library/react`, `@vitest/ui`, `jest`, `vitest`)
- ESLint and TypeScript configured for code quality, but not testing

## Test Organization (Recommended Structure)

While not currently implemented, tests should follow this structure:

**Location Pattern:**
- Co-locate with source code in `__tests__` directories within component/hook/utility folders
- Alternative: `tests/` directory at project root with mirror structure

**Naming Convention:**
- `[FileName].test.tsx` for component tests
- `[FileName].test.ts` for utility/hook tests
- Example: `ProductCard.test.tsx`, `use-cart-store.test.ts`, `utils.test.ts`

**Directory Structure (Recommended):**
```
src/
├── components/
│   ├── sections/
│   │   ├── product-card.tsx
│   │   ├── __tests__/
│   │   │   └── product-card.test.tsx
│   │   └── add-to-cart-button.tsx
│   └── layout/
│       ├── navbar.tsx
│       └── __tests__/
│           └── navbar.test.tsx
├── hooks/
│   ├── use-toast.ts
│   └── __tests__/
│       └── use-toast.test.ts
├── lib/
│   ├── store/
│   │   ├── cart.ts
│   │   └── __tests__/
│   │       └── cart.test.ts
│   └── utils.ts
│       └── __tests__/
│           └── utils.test.ts
└── app/
    └── api/
        └── stripe/
            ├── payment-intent/
            │   ├── route.ts
            │   └── __tests__/
            │       └── route.test.ts
```

## Test Structure (Recommended Pattern)

Based on codebase analysis, recommended test structure for this project:

**Component Test Example:**
```typescript
import { render, screen, fireEvent } from '@testing-library/react';
import { ProductCard } from '@/components/sections/product-card';
import { Product } from '@/lib/types';

describe('ProductCard', () => {
  const mockProduct: Product = {
    id: 'test-1',
    name: 'Test Card',
    description: 'Test description',
    price: 17.99,
    image1: '/test-image.png',
    image2: '/test-image-alt.png',
    features: ['Feature 1', 'Feature 2'],
    category: 'standard'
  };

  it('renders product name', () => {
    render(<ProductCard product={mockProduct} />);
    expect(screen.getByText('Test Card')).toBeInTheDocument();
  });

  it('displays product price formatted correctly', () => {
    render(<ProductCard product={mockProduct} />);
    expect(screen.getByText('€17.99')).toBeInTheDocument();
  });

  it('shows product features up to 3 items', () => {
    render(<ProductCard product={mockProduct} />);
    expect(screen.getByText('Feature 1')).toBeInTheDocument();
    expect(screen.getByText('Feature 2')).toBeInTheDocument();
  });
});
```

**Hook Test Example:**
```typescript
import { renderHook, act } from '@testing-library/react';
import { useCartStore } from '@/lib/store/cart';

describe('useCartStore', () => {
  beforeEach(() => {
    // Clear store state before each test
    const { result } = renderHook(() => useCartStore());
    act(() => {
      result.current.clearCart();
    });
  });

  it('adds item to cart', () => {
    const { result } = renderHook(() => useCartStore());
    const mockProduct = { id: 'test-1', name: 'Test', /* ... */ };

    act(() => {
      result.current.addItem(mockProduct);
    });

    expect(result.current.items.length).toBe(1);
    expect(result.current.getItemCount()).toBe(1);
  });

  it('calculates total correctly', () => {
    const { result } = renderHook(() => useCartStore());
    const mockProduct = { id: 'test-1', price: 17.99, /* ... */ };

    act(() => {
      result.current.addItem(mockProduct);
      result.current.addItem(mockProduct);
    });

    expect(result.current.getTotal()).toBe(35.98);
  });
});
```

## Mocking Strategy

**Framework:** Recommended: `@testing-library/jest-dom` with Jest or Vitest

**Patterns to Implement:**

**Mock External Dependencies:**
```typescript
// Mock Next.js router
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: jest.fn(),
    pathname: '/',
  }),
}));

// Mock Zustand store in tests
jest.mock('@/lib/store/cart', () => ({
  useCartStore: jest.fn(),
}));
```

**Mock Stripe:**
```typescript
jest.mock('@stripe/react-stripe-js', () => ({
  loadStripe: jest.fn(() => Promise.resolve(mockStripeObject)),
  CardElement: () => <div data-testid="card-element" />,
}));
```

**Mock Next.js Image:**
```typescript
jest.mock('next/image', () => ({
  __esModule: true,
  default: (props: any) => <img {...props} />,
}));
```

**What to Mock:**
- External APIs (Stripe, authentication services)
- File system operations
- Network requests
- Heavy third-party libraries (fabric.js for canvas)
- Browser APIs (localStorage via Zustand persist)

**What NOT to Mock:**
- Custom hooks and utilities
- React components (unless testing integration)
- URL path aliases (@/*)
- Local state management logic

## Fixtures and Factories

**Test Data (Recommended):**

Create `tests/fixtures/` directory:
```typescript
// tests/fixtures/products.ts
import { Product } from '@/lib/types';

export const mockProducts: Record<string, Product> = {
  standard: {
    id: 'standard-black',
    name: 'Standard Black PVC Card',
    description: 'Sleek black business card with NFC technology',
    price: 17.99,
    image1: '/test-image.png',
    image2: '/test-image-alt.png',
    features: ['NFC Technology', 'Durable PVC Material'],
    category: 'standard'
  },
  premium: {
    id: 'premium-wood',
    name: 'Premium Wood Business Card',
    description: 'Eco-friendly wooden business card',
    price: 17.99,
    image1: '/test-wood.png',
    image2: '/test-wood-alt.png',
    features: ['Sustainable Wood', 'Embedded NFC'],
    category: 'premium'
  }
};

export const createMockProduct = (overrides: Partial<Product> = {}): Product => ({
  ...mockProducts.standard,
  ...overrides,
});
```

```typescript
// tests/fixtures/cart.ts
import { CartItem } from '@/lib/types';
import { mockProducts } from './products';

export const mockCartItem: CartItem = {
  product: mockProducts.standard,
  quantity: 1,
  customization: {
    nfcUrl: 'https://example.com'
  }
};
```

**Location:** `tests/fixtures/` or `__tests__/fixtures/`

## Coverage Goals (Recommended)

**Current:** Not applicable - no testing framework

**Recommended Targets:**
- Statements: 70%+
- Branches: 60%+
- Functions: 70%+
- Lines: 70%+

**View Coverage (Once Implemented):**
```bash
npm run test:coverage
# or
vitest --coverage
```

**Add to package.json:**
```json
{
  "scripts": {
    "test": "vitest",
    "test:watch": "vitest --watch",
    "test:coverage": "vitest --coverage",
    "test:ui": "vitest --ui"
  }
}
```

## Test Types

**Unit Tests:**
- Scope: Individual functions, utilities, hooks, small components
- Approach: Test in isolation with mocked dependencies
- Examples: `useCartStore` calculations, `utils.cn()` function, error handling logic
- Execution: Fast, run frequently during development

**Integration Tests:**
- Scope: Component + store interaction, API route handling, form submission
- Approach: Test real component interactions with mocked external services
- Examples: ProductCard with useCartStore, CheckoutForm with Stripe integration
- Execution: Moderate speed, run before commits

**E2E Tests:**
- Framework: Not configured - Recommended: Playwright or Cypress
- Scope: Full user workflows (browse, customize, checkout)
- Examples: Add to cart → Customize → Checkout → Payment
- Execution: Slow, run on CI/CD pipeline

## Common Patterns to Test

**Async Testing (Recommended Pattern):**
```typescript
it('loads and displays products', async () => {
  render(<Shop />);

  // Wait for async data loading
  const productName = await screen.findByText('Standard Black PVC Card', {}, { timeout: 3000 });
  expect(productName).toBeInTheDocument();
});

// Or with act() for state updates
it('handles async cart operations', async () => {
  const { result } = renderHook(() => useCartStore());

  await act(async () => {
    await result.current.addItem(mockProduct);
  });

  expect(result.current.getItemCount()).toBe(1);
});
```

**Error Testing (Recommended Pattern):**
```typescript
it('handles Stripe payment failure', async () => {
  const mockError = new Error('Stripe processing failed');
  jest.mocked(stripe.paymentIntents.create).mockRejectedValue(mockError);

  const { result } = await renderPaymentRoute();

  expect(result.status).toBe(500);
  expect(result.body.error).toContain('Payment setup failed');
});

it('validates required fields', () => {
  render(<CardDesigner />);

  const saveButton = screen.getByText('Save Design & Continue');
  fireEvent.click(saveButton);

  expect(screen.getByText(/Please enter a valid URL/)).toBeInTheDocument();
});
```

**User Event Testing (Recommended Pattern):**
```typescript
import userEvent from '@testing-library/user-event';

it('toggles cart visibility', async () => {
  const user = userEvent.setup();
  render(<Navbar />);

  const cartButton = screen.getByRole('button', { name: /shopping cart/i });
  await user.click(cartButton);

  expect(screen.getByText('Your Cart')).toBeVisible();
});
```

## Setup Required

To implement testing:

1. Install test framework:
```bash
npm install -D vitest @testing-library/react @testing-library/jest-dom
```

2. Create `vitest.config.ts`:
```typescript
import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./tests/setup.ts'],
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
});
```

3. Create `tests/setup.ts`:
```typescript
import '@testing-library/jest-dom';
```

4. Add test scripts to `package.json`

---

*Testing analysis: 2026-03-26*
