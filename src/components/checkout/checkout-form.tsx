'use client';

import { useState } from 'react';
import {
  useStripe,
  useElements,
  PaymentElement,
} from '@stripe/react-stripe-js';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useCartStore } from '@/lib/store/cart';
import { Lock, Loader2 } from 'lucide-react';

interface CheckoutFormProps {
  total: number;
  onOrderComplete: () => void;
}

export function CheckoutForm({ total, onOrderComplete }: CheckoutFormProps) {
  const stripe = useStripe();
  const elements = useElements();
  const { items, clearCart } = useCartStore();

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [customerInfo, setCustomerInfo] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
  });

  const [shippingAddress, setShippingAddress] = useState({
    line1: '',
    line2: '',
    city: '',
    state: '',
    postalCode: '',
    country: 'IE',
  });

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setIsLoading(true);
    setError(null);

    // Save cart items and customer info to sessionStorage for the success page
    sessionStorage.setItem('lastOrder', JSON.stringify({
      items: items.map(item => ({
        name: item.product.name,
        price: item.product.price,
        quantity: item.quantity,
        image: item.product.image1,
        category: item.product.category,
        nfcUrl: item.customization?.nfcUrl || '',
      })),
      total,
      customerEmail: customerInfo.email,
      customerName: `${customerInfo.firstName} ${customerInfo.lastName}`,
      shippingAddress: {
        line1: shippingAddress.line1,
        line2: shippingAddress.line2,
        city: shippingAddress.city,
        state: shippingAddress.state,
        postalCode: shippingAddress.postalCode,
        country: shippingAddress.country,
      },
    }));

    const { error: submitError } = await elements.submit();
    if (submitError) {
      setError(submitError.message || 'An error occurred');
      setIsLoading(false);
      return;
    }

    const { error: confirmError, paymentIntent } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: `${window.location.origin}/checkout/success`,
        receipt_email: customerInfo.email,
        shipping: {
          name: `${customerInfo.firstName} ${customerInfo.lastName}`,
          address: {
            line1: shippingAddress.line1,
            line2: shippingAddress.line2 || undefined,
            city: shippingAddress.city,
            state: shippingAddress.state || undefined,
            postal_code: shippingAddress.postalCode,
            country: shippingAddress.country,
          },
        },
      },
      redirect: 'if_required',
    });

    if (confirmError) {
      setError(confirmError.message || 'Payment failed');
      setIsLoading(false);
      sessionStorage.removeItem('lastOrder');
    } else if (paymentIntent && paymentIntent.status === 'succeeded') {
      // Payment succeeded without redirect - manually redirect to success page
      clearCart();
      window.location.href = `/checkout/success?payment_intent=${paymentIntent.id}`;
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCustomerInfo((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleShippingChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setShippingAddress((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* Contact Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <div className="h-6 w-6 rounded-full bg-primary text-primary-foreground text-sm flex items-center justify-center">
              1
            </div>
            Contact Information
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="firstName">First Name</Label>
              <Input
                id="firstName"
                name="firstName"
                placeholder="John"
                value={customerInfo.firstName}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="lastName">Last Name</Label>
              <Input
                id="lastName"
                name="lastName"
                placeholder="Doe"
                value={customerInfo.lastName}
                onChange={handleInputChange}
                required
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              name="email"
              type="email"
              placeholder="john@example.com"
              value={customerInfo.email}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="phone">Phone (optional)</Label>
            <Input
              id="phone"
              name="phone"
              type="tel"
              placeholder="+353 (087) 338 2340"
              value={customerInfo.phone}
              onChange={handleInputChange}
            />
          </div>
        </CardContent>
      </Card>

      {/* Shipping Address */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <div className="h-6 w-6 rounded-full bg-primary text-primary-foreground text-sm flex items-center justify-center">
              2
            </div>
            Shipping Address
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="line1">Address</Label>
            <Input
              id="line1"
              name="line1"
              placeholder="123 Main Street"
              value={shippingAddress.line1}
              onChange={handleShippingChange}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="line2">Apartment, suite, etc. (optional)</Label>
            <Input
              id="line2"
              name="line2"
              placeholder="Apt 4B"
              value={shippingAddress.line2}
              onChange={handleShippingChange}
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="city">City</Label>
              <Input
                id="city"
                name="city"
                placeholder="Dublin"
                value={shippingAddress.city}
                onChange={handleShippingChange}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="state">County / State</Label>
              <Input
                id="state"
                name="state"
                placeholder="County Dublin"
                value={shippingAddress.state}
                onChange={handleShippingChange}
              />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="postalCode">Postal Code</Label>
              <Input
                id="postalCode"
                name="postalCode"
                placeholder="D15 XY12"
                value={shippingAddress.postalCode}
                onChange={handleShippingChange}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="country">Country</Label>
              <select
                id="country"
                name="country"
                value={shippingAddress.country}
                onChange={handleShippingChange}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                required
              >
                <option value="IE">Ireland</option>
                <option value="GB">United Kingdom</option>
                <option value="US">United States</option>
                <option value="DE">Germany</option>
                <option value="FR">France</option>
                <option value="ES">Spain</option>
                <option value="IT">Italy</option>
                <option value="NL">Netherlands</option>
                <option value="BE">Belgium</option>
                <option value="AT">Austria</option>
                <option value="PT">Portugal</option>
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Payment Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <div className="h-6 w-6 rounded-full bg-primary text-primary-foreground text-sm flex items-center justify-center">
              3
            </div>
            Payment Information
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {!stripe || !elements ? (
            <div className="flex items-center justify-center py-8">
              <div className="text-center space-y-2">
                <Loader2 className="h-6 w-6 animate-spin mx-auto text-muted-foreground" />
                <p className="text-sm text-muted-foreground">Loading payment form...</p>
              </div>
            </div>
          ) : (
            <PaymentElement
              options={{
                layout: 'tabs',
              }}
            />
          )}

          <div className="flex items-center space-x-2 text-sm text-muted-foreground">
            <Lock className="h-4 w-4" />
            <span>Your payment information is secure and encrypted</span>
          </div>
        </CardContent>
      </Card>

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-600 text-sm">{error}</p>
        </div>
      )}

      {/* Place Order Button */}
      <Button
        type="submit"
        className="w-full"
        size="lg"
        disabled={!stripe || isLoading}
      >
        {isLoading ? (
          <>
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
            Processing Payment...
          </>
        ) : (
          <>
            <Lock className="h-4 w-4 mr-2" />
            Place Order - €{total.toFixed(2)}
          </>
        )}
      </Button>

      {/* Processing Overlay */}
      {isLoading && (
        <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center">
          <div className="bg-white rounded-xl shadow-2xl p-8 max-w-md mx-4 text-center space-y-6">
            <div className="relative">
              <div className="h-16 w-16 mx-auto">
                <Loader2 className="h-16 w-16 text-primary animate-spin" />
              </div>
            </div>
            <div className="space-y-2">
              <h3 className="text-xl font-semibold">Processing Payment</h3>
              <p className="text-muted-foreground">
                Please do not close this page or press the back button while we process your payment.
              </p>
            </div>
            <div className="flex items-center justify-center space-x-2 text-sm text-muted-foreground">
              <Lock className="h-4 w-4" />
              <span>Secure payment powered by Stripe</span>
            </div>
          </div>
        </div>
      )}
    </form>
  );
}