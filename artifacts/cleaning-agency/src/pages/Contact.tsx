import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useCreateContactInquiry } from "@workspace/api-client-react";

import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { MapPin, Phone, Mail, Clock, Send, CheckCircle2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const formSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters."),
  email: z.string().email("Please enter a valid email address."),
  phone: z.string().optional(),
  subject: z.string().optional(),
  message: z.string().min(10, "Message must be at least 10 characters."),
});

type FormValues = z.infer<typeof formSchema>;

export default function Contact() {
  const { toast } = useToast();
  const [isSuccess, setIsSuccess] = useState(false);
  const createInquiry = useCreateContactInquiry();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      subject: "",
      message: "",
    },
  });

  const onSubmit = async (data: FormValues) => {
    try {
      await createInquiry.mutateAsync({ data });
      setIsSuccess(true);
      toast({
        title: "Message Sent",
        description: "We've received your inquiry and will get back to you soon.",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to send message. Please try again later.",
      });
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      {/* Header */}
      <section className="bg-primary text-primary-foreground py-20 relative">
        <div className="container mx-auto px-4 text-center max-w-3xl relative z-10">
          <h1 className="text-4xl md:text-6xl font-bold mb-6 font-serif">Get in Touch</h1>
          <p className="text-lg text-primary-foreground/80">
            Whether you're looking for work or looking for staff, we're here to help. Reach out to our friendly team today.
          </p>
        </div>
      </section>

      {/* Content */}
      <section className="container mx-auto px-4 py-16">
        <div className="max-w-6xl mx-auto grid lg:grid-cols-5 gap-12 lg:gap-20">
          
          {/* Contact Info */}
          <div className="lg:col-span-2 space-y-8">
            <div>
              <h2 className="text-2xl font-bold font-serif text-primary mb-6">Contact Information</h2>
              <ul className="space-y-6">
                <li className="flex items-start gap-4 group">
                  <div className="bg-secondary/10 p-3 rounded-xl group-hover:bg-secondary/20 transition-colors">
                    <MapPin className="h-6 w-6 text-secondary" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-primary mb-1">Office Address</h4>
                    <p className="text-foreground/70 text-sm leading-relaxed">
                      124 Business Park Road<br />
                      London, W1 4XY<br />
                      United Kingdom
                    </p>
                  </div>
                </li>
                
                <li className="flex items-start gap-4 group">
                  <div className="bg-secondary/10 p-3 rounded-xl group-hover:bg-secondary/20 transition-colors">
                    <Phone className="h-6 w-6 text-secondary" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-primary mb-1">Phone</h4>
                    <p className="text-foreground/70 text-sm">020 7946 0000</p>
                    <p className="text-foreground/70 text-sm mt-1">Mon - Fri, 9am - 5pm</p>
                  </div>
                </li>

                <li className="flex items-start gap-4 group">
                  <div className="bg-secondary/10 p-3 rounded-xl group-hover:bg-secondary/20 transition-colors">
                    <Mail className="h-6 w-6 text-secondary" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-primary mb-1">Email</h4>
                    <p className="text-foreground/70 text-sm">hello@brightclean.co.uk</p>
                    <p className="text-foreground/70 text-sm mt-1">We aim to reply within 24hrs</p>
                  </div>
                </li>
              </ul>
            </div>

            <div className="bg-muted p-8 rounded-3xl">
              <h3 className="font-bold text-lg mb-4 text-primary flex items-center gap-2">
                <Clock className="h-5 w-5 text-secondary" /> Working Hours
              </h3>
              <ul className="space-y-2 text-sm text-foreground/70">
                <li className="flex justify-between border-b border-border pb-2">
                  <span>Monday - Friday</span>
                  <span className="font-medium text-primary">09:00 - 17:30</span>
                </li>
                <li className="flex justify-between border-b border-border pb-2">
                  <span>Saturday</span>
                  <span className="font-medium text-primary">10:00 - 14:00</span>
                </li>
                <li className="flex justify-between pt-1">
                  <span>Sunday & Bank Holidays</span>
                  <span className="font-medium text-primary">Closed</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Form */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-3xl shadow-xl border border-border p-8 md:p-12">
              <h2 className="text-2xl font-bold font-serif text-primary mb-2">Send us a message</h2>
              <p className="text-foreground/60 mb-8">Fill out the form below and we'll be in touch shortly.</p>

              {isSuccess ? (
                <div className="text-center py-12 px-6 bg-green-50 rounded-2xl border border-green-100 animate-in zoom-in-95">
                  <div className="bg-green-100 text-green-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                    <CheckCircle2 className="w-8 h-8" />
                  </div>
                  <h3 className="text-xl font-bold text-green-800 mb-2">Message Received</h3>
                  <p className="text-green-700/80 mb-6">Thank you for reaching out. We will get back to you as soon as possible.</p>
                  <Button variant="outline" onClick={() => { setIsSuccess(false); form.reset(); }} className="rounded-full">
                    Send Another Message
                  </Button>
                </div>
              ) : (
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    <div className="grid md:grid-cols-2 gap-6">
                      <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Name *</FormLabel>
                            <FormControl>
                              <Input placeholder="Your full name" className="bg-muted/50" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Email *</FormLabel>
                            <FormControl>
                              <Input type="email" placeholder="your@email.com" className="bg-muted/50" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    
                    <div className="grid md:grid-cols-2 gap-6">
                      <FormField
                        control={form.control}
                        name="phone"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Phone (Optional)</FormLabel>
                            <FormControl>
                              <Input type="tel" placeholder="07123..." className="bg-muted/50" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="subject"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Subject (Optional)</FormLabel>
                            <FormControl>
                              <Input placeholder="How can we help?" className="bg-muted/50" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <FormField
                      control={form.control}
                      name="message"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Message *</FormLabel>
                          <FormControl>
                            <Textarea 
                              placeholder="Write your message here..." 
                              className="min-h-[150px] resize-none bg-muted/50" 
                              {...field} 
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <Button 
                      type="submit" 
                      className="w-full rounded-full bg-secondary hover:bg-secondary/90 text-white" 
                      size="lg"
                      disabled={createInquiry.isPending}
                    >
                      {createInquiry.isPending ? 'Sending...' : (
                        <>Send Message <Send className="ml-2 w-4 h-4" /></>
                      )}
                    </Button>
                  </form>
                </Form>
              )}
            </div>
          </div>
          
        </div>
      </section>
    </div>
  );
}
