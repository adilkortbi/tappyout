'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { useCartStore } from '@/lib/store/cart';
import { CheckCircle, Package, Home, ShoppingBag, Mail } from 'lucide-react';

interface OrderItem {
  name: string;
  price: number;
  quantity: number;
  image: string;
  category: string;
}

interface OrderData {
  items: OrderItem[];
  total: number;
  customerEmail: string;
  customerName: string;
}

function CheckoutSuccessContent() {
  const { clearCart } = useCartStore();
  const searchParams = useSearchParams();
  const [orderData, setOrderData] = useState<OrderData | null>(null);
  const [transactionId, setTransactionId] = useState<string>('');

  useEffect(() => {
    // Clear the cart when the success page loads
    clearCart();

    // Get payment intent ID from URL (Stripe adds this on redirect)
    const paymentIntent = searchParams.get('payment_intent');
    if (paymentIntent) {
      // Use last 12 characters for a cleaner display
      setTransactionId(paymentIntent.slice(-12).toUpperCase());
    } else {
      setTransactionId(Date.now().toString().slice(-8).toUpperCase());
    }

    // Get saved order data from sessionStorage
    const savedOrder = sessionStorage.getItem('lastOrder');
    if (savedOrder) {
      setOrderData(JSON.parse(savedOrder));
      // Clean up after reading
      sessionStorage.removeItem('lastOrder');
    }
  }, [clearCart, searchParams]);

  return (
    <div className="container mx-auto px-4 py-24">
      <div className="max-w-2xl mx-auto text-center space-y-8">
        <CheckCircle className="h-24 w-24 text-green-500 mx-auto" />

        <div className="space-y-4">
          <h1 className="text-4xl font-bold text-green-600">Payment Successful!</h1>
          <p className="text-xl text-muted-foreground">
            Thank you for your purchase{orderData?.customerName ? `, ${orderData.customerName.split(' ')[0]}` : ''}. Your order has been confirmed.
          </p>
        </div>

        <div className="bg-green-50 border border-green-200 rounded-lg p-6 space-y-4">
          <div className="flex items-center justify-center space-x-2">
            <Package className="h-5 w-5 text-green-600" />
            <span className="font-medium text-green-700">Order Confirmed</span>
          </div>

          <div className="flex items-center justify-center space-x-2 text-sm text-green-600">
            <Mail className="h-4 w-4" />
            <span>
              A confirmation email will be sent to{' '}
              <strong>{orderData?.customerEmail || 'your email'}</strong>
            </span>
          </div>

          <div className="bg-white rounded-md p-3 border border-green-200">
            <div className="text-xs text-muted-foreground">Transaction ID</div>
            <div className="text-lg font-mono font-bold text-green-700">
              #{transactionId}
            </div>
          </div>
        </div>

        {/* Order Summary */}
        {orderData && orderData.items.length > 0 && (
          <Card>
            <CardContent className="p-6 space-y-4">
              <h3 className="font-semibold text-lg text-left">Order Summary</h3>
              <div className="space-y-4">
                {orderData.items.map((item, index) => (
                  <div key={index} className="flex gap-4">
                    <div className="h-16 w-20 rounded-lg overflow-hidden flex-shrink-0 bg-muted">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1 text-left space-y-1">
                      <h4 className="font-medium text-sm">{item.name}</h4>
                      <div className="flex items-center gap-2">
                        <Badge variant="secondary" className="text-xs">
                          {item.category}
                        </Badge>
                        <span className="text-xs text-muted-foreground">
                          Qty: {item.quantity}
                        </span>
                      </div>
                      <div className="text-sm font-semibold text-primary">
                        €{(item.price * item.quantity).toFixed(2)}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <Separator />
              <div className="flex justify-between font-semibold">
                <span>Total Paid</span>
                <span className="text-primary">€{orderData.total.toFixed(2)}</span>
              </div>
            </CardContent>
          </Card>
        )}

        <div className="space-y-4">
          <h2 className="text-lg font-semibold">What happens next?</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div className="bg-muted/50 rounded-lg p-4">
              <div className="font-medium mb-2">1. Order Processing</div>
              <div className="text-muted-foreground">
                We&apos;ll prepare your NFC cards with your custom design
              </div>
            </div>
            <div className="bg-muted/50 rounded-lg p-4">
              <div className="font-medium mb-2">2. Quality Check</div>
              <div className="text-muted-foreground">
                Each card is tested to ensure perfect functionality
              </div>
            </div>
            <div className="bg-muted/50 rounded-lg p-4">
              <div className="font-medium mb-2">3. Shipping</div>
              <div className="text-muted-foreground">
                Free express shipping (3-5 business days)
              </div>
            </div>
            <div className="bg-muted/50 rounded-lg p-4">
              <div className="font-medium mb-2">4. Delivery</div>
              <div className="text-muted-foreground">
                Your custom NFC cards arrive at your door
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button asChild size="lg">
            <Link href="/shop">
              <ShoppingBag className="h-4 w-4 mr-2" />
              Continue Shopping
            </Link>
          </Button>
          <Button variant="outline" size="lg" asChild>
            <Link href="/">
              <Home className="h-4 w-4 mr-2" />
              Back to Home
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}

export default function CheckoutSuccessPage() {
  return (
    <Suspense>
      <CheckoutSuccessContent />
    </Suspense>
  );
}