import Link from 'next/link';
import { ArrowRight, Play, Zap, Shield, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

export function Hero() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-background via-background/95 to-muted/30">
      <div className="container mx-auto px-4 py-24 lg:py-32">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Content */}
          <div className="space-y-8">
            <div className="space-y-4">
              <Badge variant="secondary" className="w-fit bg-brand text-black hover:bg-brand/90">
                <Zap className="h-3 w-3 mr-1" />
                Next-Gen Networking
              </Badge>
              
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight">
                Premium{' '}
                <span className="bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                  Digital Business Cards
                </span>{' '}
                for Modern Professionals & Tradespeople
              </h1>
              
              <p className="text-xl text-muted-foreground max-w-2xl">
                Revolutionize your networking with premium digital business cards. Share your contact information, 
                social profiles, and portfolio instantly with a simple tap.
              </p>
            </div>

            {/* Stats */}
            <div className="flex flex-wrap gap-8 py-4">
              <div className="flex items-center space-x-2">
                <Shield className="h-5 w-5 text-primary" />
                <div>
                  <div className="font-semibold">99.9%</div>
                  <div className="text-sm text-muted-foreground">Reliability</div>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Users className="h-5 w-5 text-primary" />
                <div>
                  <div className="font-semibold">5K+</div>
                  <div className="text-sm text-muted-foreground">Happy Customers</div>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Zap className="h-5 w-5 text-primary" />
                <div>
                  <div className="font-semibold">Instant</div>
                  <div className="text-sm text-muted-foreground">Contact Sharing</div>
                </div>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Button asChild size="lg" className="bg-brand hover:bg-brand/90 text-black text-lg px-8 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-0.5">
                <Link href="/shop">
                  Shop Now
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button variant="outline" size="lg" className="text-lg px-8 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-0.5">
                <Link href="/contact">
                  Get in Touch
                </Link>
              </Button>
              
              {/* <Button variant="outline" size="lg" className="text-lg px-8 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-0.5">
                <Play className="mr-2 h-5 w-5" />
                Watch Demo
              </Button> */}
            </div>

            {/* Social Proof */}
            <div className="pt-4">
              <p className="text-sm text-muted-foreground mb-3">
                Trusted by professionals at
              </p>
              <div className="flex items-center space-x-8 opacity-60">
                <div className="font-semibold text-lg">TechCorp</div>
                <div className="font-semibold text-lg">StartupHub</div>
                <div className="font-semibold text-lg">DesignCo</div>
                <div className="font-semibold text-lg">InnovateLab</div>
              </div>
            </div>
          </div>

          {/* Hero Image/Visual */}
          <div className="relative">
            <div className="relative z-10">
              <Link href="/shop" className="block aspect-square rounded-3xl overflow-hidden border border-border/50 cursor-pointer">
                <img
                  src="/hero.png"
                  alt="Premium Digital Business Card"
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                />
              </Link>
            </div>
            
            {/* Background Elements */}
            <div className="absolute top-10 right-10 h-24 w-24 rounded-full bg-primary/10 -z-10"></div>
            <div className="absolute bottom-10 left-10 h-32 w-32 rounded-full bg-primary/5 -z-10"></div>
          </div>
        </div>
      </div>
    </section>
  );
}