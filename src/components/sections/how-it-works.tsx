import { CreditCard, Palette, User, Zap } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { HOW_IT_WORKS_STEPS } from '@/lib/constants/content';

const iconMap = {
  CreditCard,
  Palette,
  User,
  Zap
};

export function HowItWorks() {
  return (
    <section className="py-24">
      <div className="container mx-auto px-4">
        <div className="text-center space-y-4 mb-16">
          <h2 className="text-3xl md:text-4xl font-bold">
            How It Works
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Get started with your NFC business cards in just four simple steps.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {HOW_IT_WORKS_STEPS.map((step, index) => {
            const Icon = iconMap[step.icon as keyof typeof iconMap];
            const isLast = index === HOW_IT_WORKS_STEPS.length - 1;
            
            return (
              <div key={step.step} className="relative">
                <Card className="h-full border-0 bg-background shadow-sm hover:shadow-md transition-shadow duration-300">
                  <CardContent className="p-6 text-center space-y-4">
                    <div className="relative">
                      <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                        <Icon className="h-8 w-8 text-brand" />
                      </div>
                      <Badge 
                        variant="default" 
                        className="absolute -top-2 -right-2 h-6 w-6 rounded-full p-0 flex items-center justify-center text-xs"
                      >
                        {step.step}
                      </Badge>
                    </div>
                    
                    <div className="space-y-2">
                      <h3 className="text-lg font-semibold">{step.title}</h3>
                      <p className="text-muted-foreground text-sm leading-relaxed">
                        {step.description}
                      </p>
                    </div>
                  </CardContent>
                </Card>

                {/* Arrow for desktop */}
                {!isLast && (
                  <div className="hidden lg:block absolute top-1/2 -right-4 transform -translate-y-1/2 z-10">
                    <div className="h-0.5 w-8 bg-border relative">
                      <div className="absolute right-0 top-1/2 transform -translate-y-1/2 w-0 h-0 border-l-4 border-l-border border-t-2 border-b-2 border-t-transparent border-b-transparent"></div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}