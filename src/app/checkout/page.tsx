'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Elements } from '@stripe/react-stripe-js';
import { useTheme } from 'next-themes';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { useCartStore } from '@/lib/store/cart';
import { stripePromise } from '@/lib/stripe/stripe';
import { ArrowLeft, ShoppingBag, Truck, CheckCircle, Pencil, Link as LinkIcon } from 'lucide-react';
import { CheckoutForm } from '@/components/checkout/checkout-form';

export default function CheckoutPage() {
  const { items, getTotal, getDiscountedTotal, getDiscountAmount, getItemCount, appliedDiscountCode } = useCartStore();
  const { theme } = useTheme();
  const [clientSecret, setClientSecret] = useState<string>('');
  const [orderComplete, setOrderComplete] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const subtotal = getTotal();
  const discountAmount = getDiscountAmount();
  const total = getDiscountedTotal();
  const itemCount = getItemCount();

  useEffect(() => {
    // Check if Stripe is configured
    if (!stripePromise) {
      setError('Stripe is not configured. Please add NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY to your environment variables.');
      return;
    }

    if (items.length > 0 && total > 0) {
      // Create PaymentIntent as soon as the page loads
      // Include cart items data for order fulfillment
      const orderItems = items.map(item => ({
        name: item.product.name,
        price: item.product.price,
        quantity: item.quantity,
        image: item.product.image1,
        nfcUrl: item.customization?.nfcUrl || '',
      }));

      fetch('/api/stripe/payment-intent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: total,
          currency: 'eur',
          items: orderItems,
          discountCode: appliedDiscountCode,
        }),
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.error) {
            setError(data.error);
          } else if (data.clientSecret) {
            setClientSecret(data.clientSecret);
            setError(null);
          }
        })
        .catch((error) => {
          console.error('Error creating payment intent:', error);
          setError('Failed to initialize payment. Please refresh and try again.');
        });
    }
  }, [items, total, appliedDiscountCode]);

  if (items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-24">
        <div className="max-w-2xl mx-auto text-center space-y-8">
          <ShoppingBag className="h-24 w-24 text-muted-foreground/50 mx-auto" />
          <div className="space-y-4">
            <h1 className="text-3xl font-bold">Your cart is empty</h1>
            <p className="text-lg text-muted-foreground">
              Add some items to your cart before checking out.
            </p>
          </div>
          <Button asChild size="lg">
            <Link href="/shop">Browse Products</Link>
          </Button>
        </div>
      </div>
    );
  }

  if (orderComplete) {
    return (
      <div className="container mx-auto px-4 py-24">
        <div className="max-w-2xl mx-auto text-center space-y-8">
          <CheckCircle className="h-24 w-24 text-green-500 mx-auto" />
          <div className="space-y-4">
            <h1 className="text-3xl font-bold text-green-600">Order Complete!</h1>
            <p className="text-lg text-muted-foreground">
              Thank you for your purchase. We&apos;ll send you an email confirmation shortly.
            </p>
            <div className="bg-muted/50 rounded-lg p-6">
              <div className="text-sm text-muted-foreground">Order Number</div>
              <div className="text-xl font-bold">#TO-{Date.now().toString().slice(-6)}</div>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg">
              <Link href="/shop">Continue Shopping</Link>
            </Button>
            <Button variant="outline" size="lg" asChild>
              <Link href="/">Back to Home</Link>
            </Button>
          </div>
        </div>
      </div>
    );
  }

  const appearance = {
    theme: (theme === 'dark' ? 'night' : 'stripe') as 'night' | 'stripe',
    variables: {
      colorPrimary: '#0570de',
      colorBackground: theme === 'dark' ? '#444444' : '#ffffff',
      colorText: theme === 'dark' ? '#ffffff' : '#30313d',
      colorDanger: '#df1b41',
      fontFamily: 'system-ui, sans-serif',
      spacingUnit: '4px',
      borderRadius: '8px',
    },
  };

  const options = {
    clientSecret,
    appearance,
    loader: 'auto' as const,
  };

  return (
    <div className="container mx-auto px-4 py-12">
      {/* Header */}
      <div className="flex items-center gap-2 text-sm text-muted-foreground mb-8">
        <Link href="/cart" className="hover:text-primary flex items-center gap-2">
          <ArrowLeft className="h-4 w-4" />
          Back to Cart
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Checkout Form */}
        <div className="space-y-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">Checkout</h1>
            <p className="text-muted-foreground">Complete your order below</p>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-6">
              <div className="flex items-center space-x-3">
                <div className="h-5 w-5 rounded-full bg-red-100 flex items-center justify-center">
                  <div className="h-2 w-2 rounded-full bg-red-500"></div>
                </div>
                <div>
                  <h3 className="text-red-800 font-medium">Configuration Error</h3>
                  <p className="text-red-600 text-sm mt-1">{error}</p>
                  <p className="text-red-600 text-xs mt-2">
                    Please contact support or try again later.
                  </p>
                </div>
              </div>
            </div>
          )}

          {clientSecret && !error && stripePromise && (
            <Elements key={clientSecret} options={options} stripe={stripePromise}>
              <CheckoutForm
                total={total}
                onOrderComplete={() => setOrderComplete(true)}
              />
            </Elements>
          )}

          {!clientSecret && !error && (
            <div className="flex items-center justify-center py-12">
              <div className="text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
                <p className="text-muted-foreground">Preparing checkout...</p>
              </div>
            </div>
          )}
        </div>

        {/* Order Summary */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Order Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Items */}
              <div className="space-y-4">
                {items.map((item) => (
                  <div key={item.product.id} className="space-y-3 pb-4 border-b last:border-b-0">
                    <div className="flex gap-4">
                      <div className="h-16 w-20 rounded-lg overflow-hidden flex-shrink-0">
                        <img
                          src={item.product.image1}
                          alt={item.product.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-1 space-y-1">
                        <h4 className="font-medium text-sm">{item.product.name}</h4>
                        <div className="flex items-center gap-2">
                          <Badge variant="secondary" className="text-xs">
                            {item.product.category}
                          </Badge>
                          <span className="text-xs text-muted-foreground">
                            Qty: {item.quantity}
                          </span>
                        </div>
                        <div className="text-sm font-semibold text-primary">
                          €{(item.product.price * item.quantity).toFixed(2)}
                        </div>
                      </div>
                    </div>

                    {/* NFC Link Display */}
                    {item.customization?.nfcUrl && (
                      <div className="bg-muted/50 rounded-lg p-3 space-y-2">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2 text-xs text-muted-foreground">
                            <LinkIcon className="h-3 w-3" />
                            <span>NFC Link</span>
                          </div>
                          <Link href={`/customize/${item.product.id}`}>
                            <Button variant="ghost" size="sm" className="h-6 px-2 text-xs">
                              <Pencil className="h-3 w-3 mr-1" />
                              Edit
                            </Button>
                          </Link>
                        </div>
                        <a
                          href={item.customization.nfcUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sm text-primary hover:underline break-all"
                        >
                          {item.customization.nfcUrl}
                        </a>
                      </div>
                    )}

                    {/* No link warning */}
                    {!item.customization?.nfcUrl && (
                      <div className="bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 rounded-lg p-3">
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-amber-700 dark:text-amber-300">
                            No NFC link configured
                          </span>
                          <Link href={`/customize/${item.product.id}`}>
                            <Button variant="outline" size="sm" className="h-6 px-2 text-xs">
                              <Pencil className="h-3 w-3 mr-1" />
                              Add Link
                            </Button>
                          </Link>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>

              <Separator />

              {/* Totals */}
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
            </CardContent>
          </Card>

          {/* Shipping Info */}
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-3">
                <Truck className="h-5 w-5 text-primary" />
                <div>
                  <div className="font-medium text-sm">Free Express Shipping</div>
                  <div className="text-xs text-muted-foreground">
                    Estimated delivery: 3-5 business days
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Trust Badges */}
          <Card>
            <CardContent className="p-4">
              <div className="space-y-3 text-sm">
                <div className="flex items-center space-x-2">
                  <div className="h-2 w-2 rounded-full bg-green-500"></div>
                  <span>SSL encrypted checkout</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="h-2 w-2 rounded-full bg-green-500"></div>
                  <span>30-day money-back guarantee</span>
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