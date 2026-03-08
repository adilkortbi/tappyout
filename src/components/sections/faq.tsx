import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { FAQS } from '@/lib/constants/content';

export function FAQ() {
  return (
    <section className="py-24">
      <div className="container mx-auto px-4">
        <div className="text-center space-y-4 mb-16">
          <h2 className="text-3xl md:text-4xl font-bold">
            Frequently Asked Questions
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Have questions? We have answers. Find everything you need to know about our NFC business cards.
          </p>
        </div>

        <div className="max-w-3xl mx-auto">
          <Accordion type="single" collapsible className="space-y-4">
            {FAQS.map((faq) => (
              <AccordionItem 
                key={faq.id} 
                value={faq.id}
                className="border rounded-lg px-6 bg-background/50 backdrop-blur-sm"
              >
                <AccordionTrigger className="text-left hover:no-underline py-6">
                  <span className="font-semibold">{faq.question}</span>
                </AccordionTrigger>
                <AccordionContent className="pb-6 text-muted-foreground leading-relaxed">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>

        {/* Contact Support */}
        <div className="text-center mt-12 space-y-4">
          <h3 className="text-xl font-semibold">Still have questions?</h3>
          <p className="text-muted-foreground">
            Our support team is here to help you with any questions or concerns.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <a 
              href="mailto:adilkortbi@tappy-out.com" 
              className="text-primary hover:underline font-medium"
            >
              adilkortbi@tappy-out.com
            </a>
            <span className="hidden sm:inline text-muted-foreground">•</span>
            <a 
              href="tel:+353873382340" 
              className="text-primary hover:underline font-medium"
            >
              +353 (087) 338 2340
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}