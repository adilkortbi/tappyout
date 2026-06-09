'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { CartItem, Product } from '../types';

interface CartStore {
  items: CartItem[];
  isOpen: boolean;
  appliedDiscountCode: string | null;
  addItem: (product: Product, customization?: CartItem['customization']) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  getTotal: () => number;
  getDiscountedTotal: () => number;
  getDiscountAmount: () => number;
  getItemCount: () => number;
  toggleCart: () => void;
  openCart: () => void;
  closeCart: () => void;
  applyDiscount: (code: string) => { success: boolean; message: string };
  removeDiscount: () => void;
}

const VALID_DISCOUNT_CODES: Record<string, number> = {
  'ADIL99OFF': 99, // 99% off
};

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      isOpen: false,
      appliedDiscountCode: null,

      addItem: (product, customization) => {
        const items = get().items;
        const existingItemIndex = items.findIndex(
          (item) => item.product.id === product.id
        );

        if (existingItemIndex > -1) {
          const updatedItems = [...items];
          updatedItems[existingItemIndex].quantity += 1;
          if (customization) {
            updatedItems[existingItemIndex].customization = customization;
          }
          set({ items: updatedItems });
        } else {
          set({
            items: [...items, { product, quantity: 1, customization }]
          });
        }
      },

      removeItem: (productId) => {
        set({
          items: get().items.filter((item) => item.product.id !== productId)
        });
      },

      updateQuantity: (productId, quantity) => {
        if (quantity <= 0) {
          get().removeItem(productId);
          return;
        }

        set({
          items: get().items.map((item) =>
            item.product.id === productId ? { ...item, quantity } : item
          )
        });
      },

      clearCart: () => {
        set({ items: [], appliedDiscountCode: null });
      },

      getTotal: () => {
        return get().items.reduce(
          (total, item) => total + item.product.price * item.quantity,
          0
        );
      },

      getDiscountAmount: () => {
        const code = get().appliedDiscountCode;
        if (!code) return 0;
        const discountPercent = VALID_DISCOUNT_CODES[code.toUpperCase()];
        if (!discountPercent) return 0;
        return get().getTotal() * (discountPercent / 100);
      },

      getDiscountedTotal: () => {
        return get().getTotal() - get().getDiscountAmount();
      },

      getItemCount: () => {
        return get().items.reduce((count, item) => count + item.quantity, 0);
      },

      toggleCart: () => {
        set({ isOpen: !get().isOpen });
      },

      openCart: () => {
        set({ isOpen: true });
      },

      closeCart: () => {
        set({ isOpen: false });
      },

      applyDiscount: (code: string) => {
        const normalizedCode = code.toUpperCase().trim();

        // Check if already applied
        if (get().appliedDiscountCode?.toUpperCase() === normalizedCode) {
          return { success: false, message: 'This discount code is already applied.' };
        }

        // Check if valid
        if (!VALID_DISCOUNT_CODES[normalizedCode]) {
          return { success: false, message: 'Invalid discount code.' };
        }

        set({ appliedDiscountCode: normalizedCode });
        return { success: true, message: `Discount applied! ${VALID_DISCOUNT_CODES[normalizedCode]}% off.` };
      },

      removeDiscount: () => {
        set({ appliedDiscountCode: null });
      }
    }),
    {
      name: 'cart-storage'
    }
  )
);