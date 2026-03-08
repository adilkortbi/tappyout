import { notFound } from 'next/navigation';
import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { PRODUCTS } from '@/lib/constants/products';
import { ArrowLeft, Check, ShoppingCart, Palette } from 'lucide-react';

interface ProductPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { id } = await params;
  const product = PRODUCTS.find(p => p.id === id);

  if (!product) {
    notFound();
  }

  const getCategoryColor = (category: typeof product.category) => {
    switch (category) {
      case 'standard':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300';
      case 'premium':
        return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300';
      case 'luxury':
        return 'bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-300';
    }
  };

  return (
    <div className="container mx-auto px-4 py-12">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-muted-foreground mb-8">
        <Link href="/shop" className="hover:text-primary flex items-center gap-2">
          <ArrowLeft className="h-4 w-4" />
          Back to Shop
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Product Images */}
        <div className="space-y-4">
          <Card className="border-0 aspect-square overflow-hidden">
            <CardContent className="p-0 h-full relative group">
              <img
                src={product.image1}
                alt={product.name}
                className="w-full h-full object-cover transition-opacity duration-300 group-hover:opacity-0"
              />
              <img
                src={product.image2}
                alt={`${product.name} - Alternate View`}
                className="absolute inset-0 w-full h-full object-cover transition-opacity duration-300 opacity-0 group-hover:opacity-100"
              />
              <div className="absolute top-4 right-4 bg-black/20 backdrop-blur-sm px-3 py-1 rounded-full">
                <span className="text-white text-sm font-medium">NFC</span>
              </div>
            </CardContent>
          </Card>
          
          {/* Additional views */}
          <div className="grid grid-cols-3 gap-4">
            <Card className="border-0 aspect-square overflow-hidden">
              <CardContent className="p-0 h-full">
                <img
                  src={product.image1}
                  alt={`${product.name} - Front`}
                  className="w-full h-full object-cover"
                />
              </CardContent>
            </Card>
            <Card className="border-0 aspect-square overflow-hidden">
              <CardContent className="p-0 h-full">
                <img
                  src={product.image2}
                  alt={`${product.name} - Back`}
                  className="w-full h-full object-cover"
                />
              </CardContent>
            </Card>
            <Card className="border-0 aspect-square overflow-hidden bg-muted/50">
              <CardContent className="p-4 h-full flex items-center justify-center text-muted-foreground">
                <span className="text-xs text-center">More views coming soon</span>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Product Info */}
        <div className="space-y-6">
          <div className="space-y-4">
            <Badge className={getCategoryColor(product.category)}>
              {product.category}
            </Badge>
            
            <h1 className="text-3xl md:text-4xl font-bold">{product.name}</h1>
            
            <p className="text-lg text-muted-foreground leading-relaxed">
              {product.description}
            </p>
            
            <div className="text-3xl font-bold text-primary">
              €{product.price.toFixed(2)}
            </div>
          </div>

          <Separator />

          {/* Features */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Features & Benefits</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {product.features.map((feature, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <Check className="h-4 w-4 text-green-500 flex-shrink-0" />
                  <span className="text-sm">{feature}</span>
                </div>
              ))}
            </div>
          </div>

          <Separator />

          {/* Actions */}
          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* <Button size="lg" className="h-12 bg-brand hover:bg-brand/90">
                <ShoppingCart className="h-4 w-4 mr-2" />
                Add to Cart
              </Button> */}
              <Button size="lg" className="h-12 bg-brand hover:bg-brand/90" asChild>
                <Link href={`/customize/${product.id}`}>
                  <Palette className="h-4 w-4 mr-2" />
                  Customize
                </Link>
              </Button>
            </div>
            
            {/* <Button variant="outline" size="lg" className="w-full h-12">
              Buy Now - Express Checkout
            </Button> */}
          </div>

          {/* Additional Info */}
          <div className="space-y-4 pt-4">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="space-y-2">
                <div className="font-medium">Free Shipping</div>
                <div className="text-muted-foreground">On orders over €50</div>
              </div>
              <div className="space-y-2">
                <div className="font-medium">Fast Delivery</div>
                <div className="text-muted-foreground">3-5 business days</div>
              </div>
              <div className="space-y-2">
                <div className="font-medium">30-Day Returns</div>
                <div className="text-muted-foreground">Money-back guarantee</div>
              </div>
              <div className="space-y-2">
                <div className="font-medium">Customer Support</div>
                <div className="text-muted-foreground">24/7 assistance</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Related Products */}
      <div className="mt-24">
        <h2 className="text-2xl font-bold mb-8">You Might Also Like</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {PRODUCTS.filter(p => p.id !== product.id)
            .slice(0, 3)
            .map((relatedProduct) => (
            <Card key={relatedProduct.id} className="group cursor-pointer hover:shadow-lg transition-shadow">
              <CardContent className="p-6 space-y-4">
                <div className="aspect-[4/3] rounded-lg overflow-hidden">
                  <div className="relative w-full h-full">
                    <img
                      src={relatedProduct.image1}
                      alt={relatedProduct.name}
                      className="absolute inset-0 w-full h-full object-cover transition-opacity duration-300 group-hover:opacity-0"
                    />
                    <img
                      src={relatedProduct.image2}
                      alt={`${relatedProduct.name} - Alternate View`}
                      className="absolute inset-0 w-full h-full object-cover transition-opacity duration-300 opacity-0 group-hover:opacity-100"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <h3 className="font-semibold group-hover:text-primary transition-colors">
                    {relatedProduct.name}
                  </h3>
                  <div className="text-lg font-bold text-primary">
                    €{relatedProduct.price.toFixed(2)}
                  </div>
                </div>
                <Button variant="outline" className="w-full" asChild>
                  <Link href={`/products/${relatedProduct.id}`}>
                    View Details
                  </Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}