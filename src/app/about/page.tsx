import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Mail, Phone, MapPin, Users, Award, Target, Heart } from 'lucide-react';
import Link from 'next/link';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'About Tappy Out - Revolutionizing Professional Networking',
  description: 'Learn about Tappy Out, the leading provider of digital business cards. Discover our story, values, and mission to transform professional networking.',
  keywords: ['about Tappy Out', 'company story', 'professional networking', 'NFC technology', 'team'],
};

const team = [
  {
    name: 'Adil Kortbi',
    role: 'CEO & Founder',
    description: 'Entrepreneur with 5+ years in the trades industries and 2+ years in digital innovations.',
    avatar: '/images/team/sarah.jpg'
  }
];

const values = [
  {
    icon: Target,
    title: 'Innovation First',
    description: 'We push the boundaries of what&apos;s possible with NFC technology.'
  },
  {
    icon: Award,
    title: 'Premium Quality',
    description: 'Every card is crafted with meticulous attention to detail and quality.'
  },
  {
    icon: Users,
    title: 'Customer Success',
    description: 'Your networking success is our primary measure of achievement.'
  },
  {
    icon: Heart,
    title: 'Sustainability',
    description: 'We&apos;re committed to eco-friendly materials and processes.'
  }
];

export default function AboutPage() {
  return (
    <div className="space-y-0">
      {/* Hero Section */}
      <section className="py-24 bg-gradient-to-br from-background via-background/95 to-muted/30">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center space-y-6">
            <Badge variant="secondary" className="w-fit mx-auto">
              About Tappy Out
            </Badge>
            
            <h1 className="text-4xl md:text-5xl font-bold">
              Revolutionizing Professional Networking
            </h1>
            
            <p className="text-xl text-muted-foreground leading-relaxed">
              We believe that first impressions matter. That&apos;s why we&apos;ve created the world&apos;s most 
              sophisticated digital business cards, combining cutting-edge technology with premium craftsmanship 
              to transform how professionals connect.
            </p>
          </div>
        </div>
      </section>

      {/* Our Story */}
      <section className="py-24">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <h2 className="text-3xl md:text-4xl font-bold">Our Story</h2>
              
              <div className="space-y-4 text-muted-foreground leading-relaxed">
                <p>
                  Founded in 2023, Tappy Out emerged from a simple frustration: traditional business cards 
                  were outdated, wasteful, and often ended up forgotten in desk drawers. Our founder, 
                  Sarah Johnson, envisioned a future where professional networking was seamless, 
                  sustainable, and memorable.
                </p>
                
                <p>
                  After months of research and development, working with leading NFC technology experts 
                  and premium material suppliers, we launched our first collection of digital business cards. 
                  The response was overwhelming – professionals loved the instant connectivity and 
                  premium feel.
                </p>
                
                <p>
                  Today, we serve hundreds of professionals worldwide, from hospitality and hairdressing owners to startup founders,
                  helping them make lasting connections and reduce their environmental footprint.
                </p>
              </div>
            </div>

            <div className="relative">
              <Card className="border-0 bg-gradient-to-br from-primary/10 to-primary/5">
                <CardContent className="p-8">
                  <div className="grid grid-cols-2 gap-6 text-center">
                    <div>
                      <div className="text-3xl font-bold text-primary">5K+</div>
                      <div className="text-sm text-muted-foreground">Cards Delivered</div>
                    </div>
                    <div>
                      <div className="text-3xl font-bold text-primary">200+</div>
                      <div className="text-sm text-muted-foreground">Connections Made</div>
                    </div>
                    <div>
                      <div className="text-3xl font-bold text-primary">98%</div>
                      <div className="text-sm text-muted-foreground">Customer Satisfaction</div>
                    </div>
                    <div>
                      <div className="text-3xl font-bold text-primary">4+</div>
                      <div className="text-sm text-muted-foreground">Countries Served</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Our Values */}
      <section className="py-24 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center space-y-4 mb-16">
            <h2 className="text-3xl md:text-4xl font-bold">Our Values</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              These core principles guide everything we do, from product design to customer service.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => {
              const Icon = value.icon;
              return (
                <Card key={index} className="border-0 bg-background/50 backdrop-blur-sm text-center">
                  <CardContent className="p-6 space-y-4">
                    <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mx-auto">
                      <Icon className="h-6 w-6 text-primary" />
                    </div>
                    <div className="space-y-2">
                      <h3 className="text-lg font-semibold">{value.title}</h3>
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        {value.description}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-24">
        <div className="container mx-auto px-4">
          <div className="text-center space-y-4 mb-16">
            <h2 className="text-3xl md:text-4xl font-bold">Meet Our Team</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              The passionate individuals behind Tappy Out, dedicated to revolutionizing professional networking.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {team.map((member, index) => (
              <Card key={index} className="border-0 bg-background shadow-sm text-center">
                <CardContent className="p-6 space-y-4">
                  <div className="h-24 w-24 rounded-full bg-gradient-to-br from-primary/20 to-primary/10 mx-auto flex items-center justify-center">
                    <div className="text-2xl font-bold text-primary">
                      {member.name.split(' ').map(n => n[0]).join('')}
                    </div>
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-lg font-semibold">{member.name}</h3>
                    <Badge variant="secondary">{member.role}</Badge>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {member.description}
                    </p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-24 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div className="space-y-6">
              <h2 className="text-3xl md:text-4xl font-bold">Get in Touch</h2>
              <p className="text-lg text-muted-foreground">
                Have questions about our products or need help with your order? 
                We&apos;re here to help and would love to hear from you.
              </p>

              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <Mail className="h-5 w-5 text-primary" />
                  <div>
                    <div className="font-medium">Email Us</div>
                    <div className="text-muted-foreground">adilkortbi@tappy-out.com</div>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <Phone className="h-5 w-5 text-primary" />
                  <div>
                    <div className="font-medium">Call Us</div>
                    <div className="text-muted-foreground">+353 (087) 338 2340</div>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <MapPin className="h-5 w-5 text-primary" />
                  <div>
                    <div className="font-medium">Visit Us</div>
                    <div className="text-muted-foreground">177 roselawn road, Dublin 15, Dublin</div>
                  </div>
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Business Hours</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Monday - Friday</span>
                    <span>9:00 AM - 6:00 PM PST</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Saturday</span>
                    <span>10:00 AM - 4:00 PM PST</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Sunday</span>
                    <span>Closed</span>
                  </div>
                </div>
              </div>
            </div>

            <Card className="border-0 bg-background/50 backdrop-blur-sm">
              <CardContent className="p-8 space-y-6">
                <h3 className="text-2xl font-semibold">Ready to Get Started?</h3>
                <p className="text-muted-foreground">
                  Join thousands of professionals who have already transformed their networking 
                  with our premium digital business cards.
                </p>
                
                <div className="space-y-4">
                  <Button asChild className="w-full" size="lg">
                    <Link href="/shop">Browse Products</Link>
                  </Button>
                  <Button variant="outline" className="w-full" size="lg">
                    Request Sample Pack
                  </Button>
                </div>

                <div className="text-center space-y-2 pt-4">
                  <div className="text-sm text-muted-foreground">
                    Free shipping on orders over €50
                  </div>
                  <div className="text-sm text-muted-foreground">
                    30-day money-back guarantee
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </div>
  );
}