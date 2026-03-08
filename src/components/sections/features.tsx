import { Share, Award, Paintbrush, RefreshCw, BarChart, Leaf } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { FEATURES } from '@/lib/constants/content';

const iconMap = {
  Share,
  Award,
  Paintbrush,
  RefreshCw,
  BarChart,
  Leaf
};

export function Features() {
  return (
    <section className="py-24 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center space-y-4 mb-16">
          <h2 className="text-3xl md:text-4xl font-bold">
            Why Choose Our NFC Cards?
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Experience the perfect blend of innovation, quality, and style with our premium digital business cards.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {FEATURES.map((feature, index) => {
            const Icon = iconMap[feature.icon as keyof typeof iconMap];
            
            return (
              <Card key={index} className="border-0 bg-background/50 backdrop-blur-sm hover:bg-background/80 transition-all duration-300 hover:shadow-lg">
                <CardContent className="p-6 space-y-4">
                  <div className="h-12 w-12 rounded-lg bg-brand/10 flex items-center justify-center">
                    <Icon className="h-6 w-6 text-brand" />
                  </div>
                  
                  <div className="space-y-2">
                    <h3 className="text-xl font-semibold">{feature.title}</h3>
                    <p className="text-muted-foreground leading-relaxed">
                      {feature.description}
                    </p>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
}