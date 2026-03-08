import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ProductCard } from '@/components/sections/product-card';
import { PRODUCTS } from '@/lib/constants/products';
import { Filter, SortAsc } from 'lucide-react';
import { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Shop Digital Business Cards - Premium Business Cards | Tappy Out',
  description: 'Browse our collection of premium digital business cards. From standard to luxury options, find the perfect card for your professional image.',
  keywords: ['business cards', 'shop', 'premium cards', 'professional networking'],
};

export default function ShopPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      {/* Header */}
      <div className="text-center space-y-4 mb-12">
        <h1 className="text-4xl md:text-5xl font-bold">
          Shop Digital Business Cards
        </h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Choose from our premium collection of digital business cards. 
          From standard to luxury options, find the perfect card for your professional image.
        </p>
      </div>

      {/* Filters & Sorting */}
      {/* <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div className="flex flex-wrap gap-2">
          <Badge variant="outline" className="cursor-pointer hover:bg-primary hover:text-primary-foreground">
            All Cards
          </Badge>
          <Badge variant="secondary" className="cursor-pointer hover:bg-primary hover:text-primary-foreground">
            Standard
          </Badge>
          <Badge variant="secondary" className="cursor-pointer hover:bg-primary hover:text-primary-foreground">
            Premium
          </Badge>
          <Badge variant="secondary" className="cursor-pointer hover:bg-primary hover:text-primary-foreground">
            Luxury
          </Badge>
        </div>

        <div className="flex items-center gap-4">
          <Button variant="outline" size="sm">
            <Filter className="h-4 w-4 mr-2" />
            Filters
          </Button>
          
          <Select defaultValue="featured">
            <SelectTrigger className="w-48">
              <SortAsc className="h-4 w-4 mr-2" />
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="featured">Featured</SelectItem>
              <SelectItem value="price-low">Price: Low to High</SelectItem>
              <SelectItem value="price-high">Price: High to Low</SelectItem>
              <SelectItem value="name">Name</SelectItem>
              <SelectItem value="category">Category</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div> */}

      {/* Products Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {PRODUCTS.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>

      {/* Bottom CTA */}
      <div className="text-center mt-16 space-y-4">
        <h2 className="text-2xl font-semibold">
          Need help choosing the right card?
        </h2>
        <p className="text-muted-foreground">
          Our team is here to help you find the perfect digital business card for your needs.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button asChild className="bg-brand hover:bg-brand/90 text-black shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-0.5">
            <Link href="/contact">
              Contact Sales
            </Link>
          </Button>
          {/* <Button className="shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-0.5">
            Request Samples
          </Button> */}
        </div>
      </div>
    </div>
  );
}