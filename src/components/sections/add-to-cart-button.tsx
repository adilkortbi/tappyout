'use client';

import { Button } from '@/components/ui/button';
import { useCartStore } from '@/lib/store/cart';
import { Product } from '@/lib/types';

interface AddToCartButtonProps {
  product: Product;
  className?: string;
}

export function AddToCartButton({ product, className }: AddToCartButtonProps) {
  const { addItem } = useCartStore();

  const handleAddToCart = () => {
    addItem(product);
  };

  return (
    <Button onClick={handleAddToCart} className={`bg-brand hover:bg-brand/90 ${className || ''}`}>
      Add to Cart
    </Button>
  );
}