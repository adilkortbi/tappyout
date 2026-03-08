'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { MessagesSquare } from 'lucide-react';
import { toast } from 'sonner';
import PhoneInput from 'react-phone-number-input'
import 'react-phone-number-input/style.css'
import styles from './contact.module.css'


export default function ContactPage() {
  const [phone, setPhone] = useState<string>("");
  
  const handlePhoneChange = (value: string | undefined) => {
    setPhone(value || "");
  };
  return (
    <div className="container mx-auto px-4 py-24">
      <div className="max-w-2xl mx-auto">
        <Card>
          <CardHeader className="text-center space-y-3">
            <CardTitle className="text-3xl flex items-center justify-center gap-2">
              <MessagesSquare className="h-6 w-6 text-primary" />
              Chat with our Team today
            </CardTitle>
            <CardDescription className="text-lg">
              Complete the form & a member of our team will reach out to you.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form 
              action={`https://formsubmit.co/${process.env.EMAIL_ACCOUNT}`} 
              method="POST"
              className="space-y-6"
            >
              {/* Hidden fields for formsubmit.co configuration */}
              <input type="hidden" name="_subject" value="New Contact Form Submission - Digital Business Cards" />
              <input type="hidden" name="_next" value="https://tappy-out.com/contact" />
              <input type="hidden" name="_template" value="table" />

              {/* Name */}
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input 
                  id="name"
                  name="name"
                  placeholder="John Doe"
                  required
                />
              </div>

              {/* Email */}
              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <Input 
                  id="email"
                  name="email"
                  type="email"
                  placeholder="john@example.com"
                  required
                />
              </div>

              {/* Phone Number */}
              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number</Label>
                <div className={styles['PhoneInput-wrapper']}>
                  <PhoneInput
                    international
                    countryCallingCodeEditable={false}
                    defaultCountry="IE"
                    value={phone}
                    onChange={handlePhoneChange}
                    name="phone"
                    required
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  />
                </div>
              </div>

              {/* Query Description */}
              <div className="space-y-2">
                <Label htmlFor="message">How can we help?</Label>
                <Textarea 
                  id="message"
                  name="message"
                  placeholder="Tell us about your inquiry..."
                  className="min-h-[120px]"
                  required
                />
              </div>

              {/* Submit Button */}
              <Button 
                type="submit" 
                className="w-full"
                size="lg"
              >
                Send Message
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
