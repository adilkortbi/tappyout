'use client';

import { notFound } from 'next/navigation';
import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Input } from '@/components/ui/input';
import { CardDesigner } from '@/components/forms/card-designer';
import { PRODUCTS } from '@/lib/constants/products';
import { ShoppingCart, Tag } from 'lucide-react';
import { use, useState } from 'react';
import { useCartStore } from '@/lib/store/cart';
import { useToast } from '@/hooks/use-toast';

interface CustomizePageProps {
  params: Promise<{
    id: string;
  }>;
}

export default function CustomizePage({ params }: CustomizePageProps) {
  const { id } = use(params);
  const product = PRODUCTS.find(p => p.id === id);
  const [discountCode, setDiscountCode] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [savedDesign, setSavedDesign] = useState<{ canvas: object; nfcLink: string } | null>(null);
  const { addItem, openCart } = useCartStore();
  const { toast } = useToast();

  if (!product) {
    notFound();
  }

  const handleAddToCart = () => {
    if (!savedDesign) {
      toast({
        title: "Design Required",
        description: "Please save your design first before adding to cart.",
      });
      return;
    }

    // Add item to cart with customization data
    for (let i = 0; i < quantity; i++) {
      addItem(product, {
        nfcUrl: savedDesign.nfcLink,
        canvasDesign: savedDesign.canvas,
      });
    }

    toast({
      title: "Added to Cart",
      description: `${quantity} ${product.name}${quantity > 1 ? 's' : ''} added to your cart.`,
    });

    // Open cart to show the user
    openCart();
  };

  return (
    <div className="container mx-auto px-4 py-12">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-muted-foreground mb-8">
        <Link href="/shop" className="hover:text-primary">
          Shop
        </Link>
        <span>/</span>
        <Link href={`/products/${product.id}`} className="hover:text-primary">
          {product.name}
        </Link>
        <span>/</span>
        <span>Customize</span>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        {/* Designer */}
        <div className="xl:col-span-2">
          {/* Card Type Navigation */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="text-lg">Choose Your Card Style</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {PRODUCTS.map((cardProduct) => (
                  <Link
                    key={cardProduct.id}
                    href={`/customize/${cardProduct.id}`}
                    className={`group relative rounded-lg border-2 p-4 transition-all duration-200 hover:shadow-md ${
                      cardProduct.id === product.id
                        ? 'border-brand bg-brand/5'
                        : 'border-border hover:border-brand/50'
                    }`}
                  >
                    <div className="aspect-[1.6/1] w-full mb-3 rounded-md overflow-hidden bg-muted">
                      <img
                        src={cardProduct.image1}
                        alt={cardProduct.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="text-center">
                      <h3 className="font-medium text-sm mb-1">{cardProduct.name}</h3>
                      <p className="text-xs text-muted-foreground">€{cardProduct.price.toFixed(2)}</p>
                    </div>
                    {cardProduct.id === product.id && (
                      <div className="absolute top-2 right-2 w-4 h-4 bg-brand rounded-full flex items-center justify-center">
                        <div className="w-2 h-2 bg-white rounded-full"></div>
                      </div>
                    )}
                  </Link>
                ))}
              </div>
            </CardContent>
          </Card>

          <CardDesigner 
            cardTemplate={product.id}
            onDesignChange={(designData) => {
              setSavedDesign(designData as { canvas: object; nfcLink: string });
            }}
            onSaveAndContinue={() => {
              document.getElementById('add-to-cart')?.scrollIntoView({ 
                behavior: 'smooth',
                block: 'center'
              });
            }}
          />
        </div>

        {/* Product Summary & Actions */}
        <div className="space-y-6">
          {/* Product Info */}
          <Card>
            <CardHeader>
              <CardTitle>Order Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-start">
                <div className="space-y-1">
                  <h3 className="font-semibold">{product.name}</h3>
                  <Badge variant="secondary">{product.category}</Badge>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-primary">
                    €{product.price.toFixed(2)}
                  </div>
                </div>
              </div>
              
              <p className="text-sm text-muted-foreground">
                {product.description}
              </p>

              <Separator />

              <div className="space-y-2">
                <h4 className="font-medium text-sm">Included Features:</h4>
                <ul className="space-y-1">
                  {product.features.slice(0, 4).map((feature, index) => (
                    <li key={index} className="text-sm text-muted-foreground flex items-center">
                      <div className="h-1.5 w-1.5 rounded-full bg-primary mr-2"></div>
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
            </CardContent>
          </Card>

          {/* Customization Options */}
          <Card>
            <CardHeader>
              <CardTitle>Customization</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {product.id === 'premium-wood' ? (
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm">Logo Upload & Sizing</span>
                    <span className="text-sm text-muted-foreground">Not Available</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">NFC Link Programming</span>
                    <span className="text-sm font-medium">Included</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Laser-Engraved NFC Icon</span>
                    <span className="text-sm font-medium">Included</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Eco-Friendly Packaging</span>
                    <span className="text-sm font-medium">Included</span>
                  </div>
                </div>
              ) : (
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm">Logo Upload & Sizing</span>
                    <span className="text-sm font-medium">Included</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Custom Color Scheme</span>
                    <span className="text-sm text-muted-foreground">Available</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Text Customization</span>
                    <span className="text-sm text-muted-foreground">Available</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Premium Packaging</span>
                    <span className="text-sm font-medium">+€5.00</span>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Quantity & Add to Cart */}
          <Card id="add-to-cart">
            <CardContent className="p-6 space-y-4">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium">Quantity</label>
                <div className="flex items-center space-x-2">
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    disabled={quantity <= 1}
                  >
                    -
                  </Button>
                  <span className="w-12 text-center">{quantity}</span>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => setQuantity(quantity + 1)}
                  >
                    +
                  </Button>
                </div>
              </div>

              <Separator />

              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span>Subtotal ({quantity} item{quantity > 1 ? 's' : ''})</span>
                  <span>€{(product.price * quantity).toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Customization</span>
                  <span>Free</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Shipping</span>
                  <span className="text-green-600">Free</span>
                </div>
                <Separator />
                <div className="flex justify-between font-semibold">
                  <span>Total</span>
                  <span>€{(product.price * quantity).toFixed(2)}</span>
                </div>
              </div>

              <div className="space-y-3">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Tag className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm font-medium">Discount Code</span>
                  </div>
                  <div className="flex gap-2">
                    <Input
                      placeholder="Enter discount code"
                      value={discountCode}
                      onChange={(e) => setDiscountCode(e.target.value)}
                      className="flex-1"
                    />
                    <Button variant="outline" size="default">
                      Apply
                    </Button>
                  </div>
                </div>
                
                <div className="pt-6">
                  <Button 
                    className="w-full bg-brand hover:bg-brand/90" 
                    size="lg"
                    onClick={handleAddToCart}
                    disabled={!savedDesign}
                  >
                    <ShoppingCart className="h-4 w-4 mr-2" />
                    Add to Cart
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Trust Indicators */}
          <div className="text-center space-y-2 text-sm text-muted-foreground">
            <div className="flex items-center justify-center space-x-4">
              <div className="flex items-center space-x-1">
                <div className="h-2 w-2 rounded-full bg-green-500"></div>
                <span>Free shipping</span>
              </div>
              <div className="flex items-center space-x-1">
                <div className="h-2 w-2 rounded-full bg-green-500"></div>
                <span>30-day returns</span>
              </div>
            </div>
            <p>Secure checkout with SSL encryption</p>
          </div>
        </div>
      </div>
    </div>
  );
}