'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { useCartStore } from '@/lib/store/cart';
import { ArrowLeft, Plus, Minus, X, ShoppingBag, CreditCard } from 'lucide-react';

export default function CartPage() {
  const {
    items,
    removeItem,
    updateQuantity,
    getTotal,
    getDiscountedTotal,
    getDiscountAmount,
    getItemCount,
    clearCart,
    appliedDiscountCode
  } = useCartStore();

  const subtotal = getTotal();
  const discountAmount = getDiscountAmount();
  const total = getDiscountedTotal();
  const itemCount = getItemCount();

  if (items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-24">
        <div className="max-w-2xl mx-auto text-center space-y-8">
          <ShoppingBag className="h-24 w-24 text-muted-foreground/50 mx-auto" />
          <div className="space-y-4">
            <h1 className="text-3xl font-bold">Your cart is empty</h1>
            <p className="text-lg text-muted-foreground">
              Looks like you haven&apos;t added any items to your cart yet.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg">
              <Link href="/shop">Browse Products</Link>
            </Button>
            <Button variant="outline" size="lg" asChild>
              <Link href="/">Back to Home</Link>
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12">
      {/* Header */}
      <div className="flex items-center gap-2 text-sm text-muted-foreground mb-8">
        <Link href="/shop" className="hover:text-primary flex items-center gap-2">
          <ArrowLeft className="h-4 w-4" />
          Continue Shopping
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Cart Items */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <ShoppingBag className="h-5 w-5" />
                Shopping Cart ({itemCount} items)
              </CardTitle>
              {items.length > 0 && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={clearCart}
                  className="text-muted-foreground hover:text-destructive"
                >
                  Clear Cart
                </Button>
              )}
            </CardHeader>
            <CardContent className="space-y-6">
              {items.map((item, index) => (
                <div key={item.product.id}>
                  <div className="flex gap-6">
                    {/* Product Image */}
                    <div className="h-24 w-32 rounded-lg overflow-hidden flex-shrink-0">
                      <img
                        src={item.product.image1}
                        alt={item.product.name}
                        className="w-full h-full object-cover"
                      />
                    </div>

                    {/* Product Details */}
                    <div className="flex-1 space-y-3">
                      <div className="flex justify-between items-start">
                        <div className="space-y-2">
                          <h3 className="font-semibold text-lg">{item.product.name}</h3>
                          <Badge variant="secondary">{item.product.category}</Badge>
                          <p className="text-sm text-muted-foreground">
                            {item.product.description}
                          </p>
                        </div>
                        
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-muted-foreground hover:text-destructive"
                          onClick={() => removeItem(item.product.id)}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="text-xl font-bold text-primary">
                          €{item.product.price.toFixed(2)}
                        </div>
                        
                        {/* Quantity Controls */}
                        <div className="flex items-center space-x-3">
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                          >
                            <Minus className="h-4 w-4" />
                          </Button>
                          <span className="w-12 text-center font-medium">{item.quantity}</span>
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                          >
                            <Plus className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>

                      {/* Customization Info */}
                      {item.customization && (
                        <div className="bg-muted/50 rounded-lg p-3">
                          <div className="text-sm font-medium mb-1">Customization included:</div>
                          <div className="text-xs text-muted-foreground">
                            Custom logo positioning and design
                          </div>
                        </div>
                      )}

                      {/* Item Actions */}
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm" asChild>
                          <Link href={`/customize/${item.product.id}`}>
                            Edit Customization
                          </Link>
                        </Button>
                        <Button variant="outline" size="sm" asChild>
                          <Link href={`/products/${item.product.id}`}>
                            View Product
                          </Link>
                        </Button>
                      </div>
                    </div>
                  </div>
                  
                  {index < items.length - 1 && <Separator className="mt-6" />}
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Order Summary */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Order Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span>Subtotal ({itemCount} items)</span>
                  <span>€{subtotal.toFixed(2)}</span>
                </div>
                {appliedDiscountCode && discountAmount > 0 && (
                  <div className="flex justify-between text-green-600">
                    <span>Discount ({appliedDiscountCode})</span>
                    <span>-€{discountAmount.toFixed(2)}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>Shipping</span>
                  <span className="text-green-600">Free</span>
                </div>
                <Separator />
                <div className="flex justify-between text-lg font-semibold">
                  <span>Total</span>
                  <span className="text-primary">€{total.toFixed(2)}</span>
                </div>
              </div>

              <div className="space-y-3">
                <Button className="w-full" size="lg" asChild>
                  <Link href="/checkout">
                    <CreditCard className="h-4 w-4 mr-2" />
                    Proceed to Checkout
                  </Link>
                </Button>
                <Button variant="outline" className="w-full" asChild>
                  <Link href="/shop">Continue Shopping</Link>
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Trust Badges */}
          <Card>
            <CardContent className="p-4">
              <div className="space-y-3 text-sm">
                <div className="flex items-center space-x-2">
                  <div className="h-2 w-2 rounded-full bg-green-500"></div>
                  <span>Free shipping on all orders</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="h-2 w-2 rounded-full bg-green-500"></div>
                  <span>30-day money-back guarantee</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="h-2 w-2 rounded-full bg-green-500"></div>
                  <span>Secure SSL encryption</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="h-2 w-2 rounded-full bg-green-500"></div>
                  <span>24/7 customer support</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}