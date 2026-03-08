'use client';

import * as React from 'react';
import { X, Plus, Minus, ShoppingBag } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { useCartStore } from '@/lib/store/cart';
import Link from 'next/link';

export function Cart() {
  const { 
    items, 
    isOpen, 
    closeCart, 
    removeItem, 
    updateQuantity, 
    getTotal,
    getItemCount
  } = useCartStore();

  if (!isOpen) return null;

  const total = getTotal();
  const itemCount = getItemCount();

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={closeCart}
      />
      
      {/* Cart Panel */}
      <div className="absolute right-0 top-0 h-full w-full max-w-md bg-background shadow-xl">
        <div className="flex h-full flex-col">
          {/* Header */}
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
            <CardTitle className="flex items-center gap-2">
              <ShoppingBag className="h-5 w-5" />
              Shopping Cart
              {itemCount > 0 && (
                <Badge variant="secondary">{itemCount}</Badge>
              )}
            </CardTitle>
            <Button
              variant="ghost"
              size="icon"
              onClick={closeCart}
              className="h-6 w-6"
            >
              <X className="h-4 w-4" />
            </Button>
          </CardHeader>

          {items.length === 0 ? (
            /* Empty Cart */
            <CardContent className="flex-1 flex flex-col items-center justify-center space-y-4">
              <ShoppingBag className="h-16 w-16 text-muted-foreground/50" />
              <div className="text-center space-y-2">
                <h3 className="font-semibold">Your cart is empty</h3>
                <p className="text-sm text-muted-foreground">
                  Add some amazing NFC cards to get started!
                </p>
              </div>
              <Button asChild onClick={closeCart}>
                <Link href="/shop">Browse Products</Link>
              </Button>
            </CardContent>
          ) : (
            <>
              {/* Cart Items */}
              <CardContent className="flex-1 overflow-y-auto space-y-4">
                {items.map((item) => (
                  <div key={item.product.id} className="space-y-4">
                    <div className="flex gap-4">
                      {/* Product Image */}
                      <div className="h-16 w-20 rounded-lg overflow-hidden flex-shrink-0">
                        <img
                          src={item.product.image1}
                          alt={item.product.name}
                          className="w-full h-full object-cover"
                        />
                      </div>

                      {/* Product Info */}
                      <div className="flex-1 space-y-2">
                        <div className="space-y-1">
                          <h4 className="font-medium text-sm leading-tight">
                            {item.product.name}
                          </h4>
                          <Badge variant="secondary" className="text-xs">
                            {item.product.category}
                          </Badge>
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <div className="text-sm font-semibold text-primary">
                            €{item.product.price.toFixed(2)}
                          </div>
                          
                          {/* Quantity Controls */}
                          <div className="flex items-center space-x-2">
                            <Button
                              variant="outline"
                              size="icon"
                              className="h-6 w-6"
                              onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                            >
                              <Minus className="h-3 w-3" />
                            </Button>
                            <span className="w-8 text-center text-sm">{item.quantity}</span>
                            <Button
                              variant="outline"
                              size="icon"
                              className="h-6 w-6"
                              onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                            >
                              <Plus className="h-3 w-3" />
                            </Button>
                          </div>
                        </div>

                        {/* Customization Info */}
                        {item.customization && (
                          <div className="text-xs text-muted-foreground">
                            Custom logo included
                          </div>
                        )}
                      </div>

                      {/* Remove Button */}
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6 text-muted-foreground"
                        onClick={() => removeItem(item.product.id)}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </div>
                    <Separator />
                  </div>
                ))}
              </CardContent>

              {/* Footer */}
              <div className="border-t p-6 space-y-4">
                {/* Totals */}
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Subtotal</span>
                    <span>€{total.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Shipping</span>
                    <span className="text-green-600">Free</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between font-semibold">
                    <span>Total</span>
                    <span className="text-primary">€{total.toFixed(2)}</span>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="space-y-2">
                  <Button className="w-full" size="lg" asChild>
                    <Link href="/checkout" onClick={closeCart}>
                      Checkout
                    </Link>
                  </Button>
                  <Button variant="outline" className="w-full" asChild>
                    <Link href="/cart" onClick={closeCart}>
                      View Cart
                    </Link>
                  </Button>
                </div>

                {/* Trust Indicators */}
                <div className="flex justify-center items-center space-x-4 text-xs text-muted-foreground">
                  <div className="flex items-center space-x-1">
                    <div className="h-1.5 w-1.5 rounded-full bg-green-500"></div>
                    <span>Secure checkout</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <div className="h-1.5 w-1.5 rounded-full bg-green-500"></div>
                    <span>Free shipping</span>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}