import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Product } from '@/lib/types';
import { AddToCartButton } from './add-to-cart-button';

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const getCategoryColor = (category: Product['category']) => {
    switch (category) {
      case 'standard':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300';
      case 'premium':
        return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300';
      case 'luxury':
        return 'bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-300';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300';
    }
  };

  return (
    <Card className="group h-full flex flex-col transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
      <CardHeader className="p-0">
        <div className="relative aspect-[4/3] rounded-t-lg overflow-hidden">
          <img
            src={product.image1}
            alt={product.name}
            className="absolute inset-0 object-cover w-full h-full transition-opacity duration-300 group-hover:opacity-0"
          />
          <img
            src={product.image2}
            alt={`${product.name} - Alternate View`}
            className="absolute inset-0 object-cover w-full h-full transition-opacity duration-300 opacity-0 group-hover:opacity-100"
          />
          <div className="absolute inset-0 flex items-center justify-center">
           
          </div>
          <Badge className={`absolute top-2 right-2 ${getCategoryColor(product.category)}`}>
            {product.category}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="flex-1 p-6 space-y-4">
        <div className="space-y-2">
          <h3 className="text-xl font-semibold group-hover:text-primary transition-colors">
            {product.name}
          </h3>
          <p className="text-muted-foreground text-sm leading-relaxed">
            {product.description}
          </p>
        </div>

        <div className="space-y-3">
          <div className="text-2xl font-bold text-primary">
            €{product.price.toFixed(2)}
          </div>
          
          <div className="space-y-2">
            <h4 className="text-sm font-medium">Features:</h4>
            <ul className="space-y-1">
              {product.features.slice(0, 3).map((feature, index) => (
                <li key={index} className="text-sm text-muted-foreground flex items-center">
                  <div className="h-1.5 w-1.5 rounded-full bg-primary mr-2"></div>
                  {feature}
                </li>
              ))}
              {product.features.length > 3 && (
                <li className="text-sm text-muted-foreground">
                  + {product.features.length - 3} more features
                </li>
              )}
            </ul>
          </div>
        </div>
      </CardContent>

      <CardFooter className="p-6 pt-0">
        <div className="w-full space-y-2">
          <div className="grid grid-cols-2 gap-2">
            <Button variant="outline" asChild>
              <Link href={`/products/${product.id}`}>
                View Details
              </Link>
            </Button>
            <AddToCartButton product={product} />
          </div>
          <Button asChild variant="secondary" className="w-full">
            <Link href={`/customize/${product.id}`}>
              Customize & Buy
            </Link>
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
}