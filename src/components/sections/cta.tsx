import Link from 'next/link';
import { ArrowRight, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

export function CTA() {
  return (
    <section className="py-24 bg-gradient-to-br from-primary via-primary/95 to-primary/80 text-primary-foreground">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <div className="space-y-4">
            <Badge variant="secondary" className="w-fit mx-auto bg-primary-foreground/10 text-primary-foreground border-primary-foreground/20">
              <Sparkles className="h-3 w-3 mr-1" />
              Limited Time Offer
            </Badge>
            
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold">
              Ready to Transform Your Networking?
            </h2>
            
            <p className="text-xl text-primary-foreground/80 max-w-2xl mx-auto">
              Join thousands of professionals who have revolutionized their networking. 
              Get your premium digital business cards today and make every connection count.
            </p>
          </div>

          {/* Special Offer */}
          <div className="bg-primary-foreground/10 rounded-2xl p-6 backdrop-blur-sm border border-primary-foreground/20">
            <div className="space-y-2">
              <div className="text-lg font-semibold">Special Launch Offer</div>
              <div className="text-2xl font-bold">
                20% OFF + Free Shipping
              </div>
              <div className="text-sm text-primary-foreground/70">
                Use code LAUNCH20 at checkout. Offer expires soon!
              </div>
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              asChild 
              size="lg" 
              variant="secondary"
              className="text-lg px-8 bg-primary-foreground text-primary hover:bg-primary-foreground/90 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-0.5"
            >
              <Link href="/shop">
                Start Shopping
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            
            <Button 
              asChild 
              size="lg" 
              variant="outline"
              className="text-lg px-8 border-primary-foreground/30 hover:bg-primary-foreground/10 dark:text-primary-foreground text-primary shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-0.5"
            >
              <Link href="/customize/standard-black-white">
                Try Customization Tool
              </Link>
            </Button>
          </div>

          {/* Trust Indicators */}
          <div className="pt-8 space-y-4">
            <div className="flex flex-wrap justify-center items-center gap-8 text-sm text-primary-foreground/70">
              <div className="flex items-center space-x-2">
                <div className="h-2 w-2 rounded-full bg-green-400"></div>
                <span>Free shipping on orders €50+</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="h-2 w-2 rounded-full bg-green-400"></div>
                <span>30-day money-back guarantee</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="h-2 w-2 rounded-full bg-green-400"></div>
                <span>Lifetime warranty on premium cards</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}