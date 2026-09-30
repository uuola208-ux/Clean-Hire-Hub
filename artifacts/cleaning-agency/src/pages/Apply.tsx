import { useState, useRef, useEffect } from "react";
import { useLocation } from "wouter";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { ApplicationInputPositionApplying } from "@workspace/api-client-react";
import { useCreateApplication } from "@workspace/api-client-react";

import { Button } from "@/components/ui/button";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { CheckCircle2, UploadCloud, FileType, AlertCircle, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

// Validate files (max 5MB)
const MAX_FILE_SIZE = 5 * 1024 * 1024;

const formSchema = z.object({
  fullName: z.string().min(2, "Name must be at least 2 characters."),
  dateOfBirth: z.string().min(1, "Date of birth is required"),
  address: z.string().min(5, "Address must be at least 5 characters."),
  phone: z.string().min(5, "Valid phone number is required."),
  email: z.string().email("Please enter a valid email address."),
  nationality: z.string().min(1, "Nationality is required."),
  positionApplying: z.nativeEnum(ApplicationInputPositionApplying, {
    required_error: "Please select a position.",
  }),
  previousExperience: z.string().optional(),
  availability: z.string().min(1, "Please specify your availability."),
  hasDrivingLicence: z.enum(["yes", "no"], { required_error: "Please select." }),
  rightToWorkUk: z.enum(["yes", "no"], { required_error: "Please select." }),
  niNumber: z.string().optional(),
  gdprConsent: z.boolean().refine((val) => val === true, {
    message: "You must consent to data processing.",
  }),
});

type FormValues = z.infer<typeof formSchema>;

export default function Apply() {
  const [location, setLocation] = useLocation();
  const searchParams = new URLSearchParams(window.location.search);
  const initialPosition = searchParams.get("position");
  const { toast } = useToast();
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [documentUploadIssue, setDocumentUploadIssue] = useState<string | null>(null);

  // File states
  const [files, setFiles] = useState<Record<string, File | null>>({
    cv: null,
    'passport-id': null,
    'right-to-work': null,
    'dbs-certificate': null,
    'national-insurance': null,
    'proof-of-address': null,
    'cleaning-certificate': null,
  });

  const fileInputRefs = {
    cv: useRef<HTMLInputElement>(null),
    'passport-id': useRef<HTMLInputElement>(null),
    'right-to-work': useRef<HTMLInputElement>(null),
    'dbs-certificate': useRef<HTMLInputElement>(null),
    'national-insurance': useRef<HTMLInputElement>(null),
    'proof-of-address': useRef<HTMLInputElement>(null),
    'cleaning-certificate': useRef<HTMLInputElement>(null),
  };

  const createApplication = useCreateApplication();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fullName: "",
      dateOfBirth: "",
      address: "",
      phone: "",
      email: "",
      nationality: "",
      positionApplying: (initialPosition as any) || undefined,
      previousExperience: "",
      availability: "",
      hasDrivingLicence: undefined,
      rightToWorkUk: undefined,
      niNumber: "",
      gdprConsent: false,
    },
  });

  const handleFileChange = (type: string, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > MAX_FILE_SIZE) {
      toast({
        variant: "destructive",
        title: "File too large",
        description: "Maximum file size is 5MB.",
      });
      if (fileInputRefs[type as keyof typeof fileInputRefs].current) {
        fileInputRefs[type as keyof typeof fileInputRefs].current!.value = '';
      }
      return;
    }

    setFiles(prev => ({ ...prev, [type]: file }));
  };

  const uploadDocuments = async (appId: number) => {
    const types = Object.keys(files);
    let successCount = 0;
    let failCount = 0;
    const failedFiles: string[] = [];

    for (const type of types) {
      const file = files[type];
      if (!file) continue;

      try {
        const urlResponse = await fetch(`/api/applications/${appId}/documents/upload-url`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            documentType: type,
            name: file.name,
            size: file.size,
            contentType: file.type,
          }),
        });
        const uploadDetails = await urlResponse.json();
        if (!urlResponse.ok) {
          throw new Error(uploadDetails.error || 'Could not prepare the document upload.');
        }

        const storageResponse = await fetch(uploadDetails.uploadURL, {
          method: 'PUT',
          headers: { 'Content-Type': file.type },
          body: file,
        });
        if (!storageResponse.ok) {
          throw new Error('Could not upload the document to private storage.');
        }

        const registerResponse = await fetch(`/api/applications/${appId}/documents`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            documentType: type,
            originalName: file.name,
            mimeType: file.type,
            fileSize: file.size,
            filePath: uploadDetails.objectPath,
          }),
        });
        if (!registerResponse.ok) {
          throw new Error('Could not finish saving the document.');
        }

        successCount++;
      } catch (err) {
        failCount++;
        failedFiles.push(file.name);
      }
    }

    return { successCount, failCount, failedFiles };
  };

  const onSubmit = async (data: FormValues) => {
    setIsSubmitting(true);

    try {
      // 1. Create Application
      const applicationResult = await createApplication.mutateAsync({
        data: {
          ...data,
          hasDrivingLicence: data.hasDrivingLicence === "yes",
          rightToWorkUk: data.rightToWorkUk === "yes",
        }
      });

      const appId = applicationResult.id;

      // 2. Upload Documents
      const hasFiles = Object.values(files).some(f => f !== null);
      if (hasFiles) {
        const uploadResult = await uploadDocuments(appId);
        if (uploadResult.failCount > 0) {
          setDocumentUploadIssue(uploadResult.failedFiles.join(", "));
          toast({
            variant: "destructive",
            title: "Application received; some documents need attention",
            description: `These files did not upload: ${uploadResult.failedFiles.join(", ")}.`,
          });
        }
      }

      setIsSuccess(true);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (error) {
      console.error(error);
      toast({
        variant: "destructive",
        title: "Submission Failed",
        description: "There was an error submitting your application. Please try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="min-h-screen bg-muted/30 flex items-center justify-center p-4">
        <div className="bg-white p-10 rounded-3xl max-w-lg w-full text-center shadow-xl animate-in zoom-in-95 duration-500">
          <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 className="w-10 h-10" />
          </div>
          <h2 className="text-3xl font-serif font-bold text-primary mb-4">Application Submitted!</h2>
          <p className="text-foreground/70 mb-8 leading-relaxed">
            {documentUploadIssue
              ? `We received your application, but these documents could not be saved: ${documentUploadIssue}. Please contact our recruitment team to arrange another way to provide them.`
              : "Thank you for applying to TJ FreshSpace. We have received your application and documents. Our recruitment team will review your details and contact you within 2-3 working days."}
          </p>
          <div className="flex flex-col gap-3">
            <Button onClick={() => setLocation('/')} className="rounded-full w-full" size="lg">
              Return to Home
            </Button>
            <Button onClick={() => window.location.reload()} variant="outline" className="rounded-full w-full" size="lg">
              Submit Another Application
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-muted/20 py-12 md:py-24">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="mb-10 text-center">
          <h1 className="text-4xl md:text-5xl font-serif font-bold text-primary mb-4">Join Our Team</h1>
          <p className="text-foreground/70 text-lg max-w-2xl mx-auto">
            Complete the form below to apply. Please ensure all your details are correct and provide as much information as possible to help us match you with the right role.
          </p>
        </div>

        <div className="bg-white rounded-3xl shadow-xl border border-border p-6 md:p-12">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-12">
              
              {/* Personal Information */}
              <div className="space-y-6">
                <div className="border-b pb-4 mb-6">
                  <h3 className="text-2xl font-serif font-bold text-primary">1. Personal Information</h3>
                </div>
                
                <div className="grid md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="fullName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Full Name *</FormLabel>
                        <FormControl>
                          <Input placeholder="John Doe" className="bg-muted/50" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="dateOfBirth"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Date of Birth *</FormLabel>
                        <FormControl>
                          <Input type="date" className="bg-muted/50" {...field} />
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
                        <FormLabel>Email Address *</FormLabel>
                        <FormControl>
                          <Input type="email" placeholder="john@example.com" className="bg-muted/50" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="phone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Phone Number *</FormLabel>
                        <FormControl>
                          <Input type="tel" placeholder="07123 456789" className="bg-muted/50" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="nationality"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Nationality *</FormLabel>
                        <FormControl>
                          <Input placeholder="British" className="bg-muted/50" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="niNumber"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>National Insurance Number</FormLabel>
                        <FormControl>
                          <Input placeholder="AB123456C" className="bg-muted/50" {...field} />
                        </FormControl>
                        <FormDescription>Optional at this stage</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="address"
                    render={({ field }) => (
                      <FormItem className="md:col-span-2">
                        <FormLabel>Full Residential Address *</FormLabel>
                        <FormControl>
                          <Textarea placeholder="123 Main St..." className="resize-none bg-muted/50" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              {/* Employment Information */}
              <div className="space-y-6 pt-6">
                <div className="border-b pb-4 mb-6">
                  <h3 className="text-2xl font-serif font-bold text-primary">2. Employment Details</h3>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="positionApplying"
                    render={({ field }) => (
                      <FormItem className="md:col-span-2">
                        <FormLabel>Position Applying For *</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger className="bg-muted/50">
                              <SelectValue placeholder="Select a position" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="domestic-cleaner">Domestic Cleaner</SelectItem>
                            <SelectItem value="commercial-cleaner">Commercial Cleaner</SelectItem>
                            <SelectItem value="office-cleaner">Office Cleaner</SelectItem>
                            <SelectItem value="housekeeping">Housekeeping</SelectItem>
                            <SelectItem value="supervisor">Cleaning Supervisor</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="availability"
                    render={({ field }) => (
                      <FormItem className="md:col-span-2">
                        <FormLabel>Availability *</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g. Mon-Fri mornings, Weekends..." className="bg-muted/50" {...field} />
                        </FormControl>
                        <FormDescription>What hours and days are you looking to work?</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="previousExperience"
                    render={({ field }) => (
                      <FormItem className="md:col-span-2">
                        <FormLabel>Previous Experience</FormLabel>
                        <FormControl>
                          <Textarea placeholder="Briefly describe your cleaning experience (if any)..." className="resize-none bg-muted/50 min-h-[100px]" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="rightToWorkUk"
                    render={({ field }) => (
                      <FormItem className="space-y-3 p-4 bg-muted/30 rounded-xl border border-border">
                        <FormLabel>Do you have the Right to Work in the UK? *</FormLabel>
                        <FormControl>
                          <RadioGroup
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                            className="flex flex-col space-y-1"
                          >
                            <FormItem className="flex items-center space-x-3 space-y-0">
                              <FormControl><RadioGroupItem value="yes" /></FormControl>
                              <FormLabel className="font-normal">Yes</FormLabel>
                            </FormItem>
                            <FormItem className="flex items-center space-x-3 space-y-0">
                              <FormControl><RadioGroupItem value="no" /></FormControl>
                              <FormLabel className="font-normal">No</FormLabel>
                            </FormItem>
                          </RadioGroup>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="hasDrivingLicence"
                    render={({ field }) => (
                      <FormItem className="space-y-3 p-4 bg-muted/30 rounded-xl border border-border">
                        <FormLabel>Do you have a valid UK Driving Licence? *</FormLabel>
                        <FormControl>
                          <RadioGroup
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                            className="flex flex-col space-y-1"
                          >
                            <FormItem className="flex items-center space-x-3 space-y-0">
                              <FormControl><RadioGroupItem value="yes" /></FormControl>
                              <FormLabel className="font-normal">Yes</FormLabel>
                            </FormItem>
                            <FormItem className="flex items-center space-x-3 space-y-0">
                              <FormControl><RadioGroupItem value="no" /></FormControl>
                              <FormLabel className="font-normal">No</FormLabel>
                            </FormItem>
                          </RadioGroup>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              {/* Document Uploads */}
              <div className="space-y-6 pt-6">
                <div className="border-b pb-4 mb-6">
                  <h3 className="text-2xl font-serif font-bold text-primary">3. Documents</h3>
                  <p className="text-foreground/60 text-sm mt-1">Upload supporting documents. You can skip these now and provide them later if preferred. (Max 5MB per file)</p>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  {[
                    { id: 'cv', label: 'CV / Resume' },
                    { id: 'passport-id', label: 'Passport or Photo ID' },
                    { id: 'right-to-work', label: 'Proof of Right to Work' },
                    { id: 'dbs-certificate', label: 'DBS Certificate' },
                    { id: 'proof-of-address', label: 'Proof of Address' },
                    { id: 'cleaning-certificate', label: 'Cleaning Certificates' },
                  ].map((doc) => (
                    <div key={doc.id} className="border border-dashed border-border rounded-xl p-4 bg-muted/20 flex flex-col justify-center transition-colors hover:border-secondary/50 hover:bg-secondary/5">
                      <label className="flex items-center gap-3 cursor-pointer">
                        <div className="bg-primary/5 p-2 rounded-lg text-primary">
                          <FileType className="h-5 w-5" />
                        </div>
                        <div className="flex-1">
                          <span className="font-medium text-sm block text-primary">{doc.label}</span>
                          <span className="text-xs text-foreground/50">
                            {files[doc.id] ? files[doc.id]?.name : "Click to select file"}
                          </span>
                        </div>
                        <UploadCloud className="h-5 w-5 text-secondary" />
                        <input 
                          type="file" 
                          className="hidden" 
                          ref={fileInputRefs[doc.id as keyof typeof fileInputRefs]}
                          onChange={(e) => handleFileChange(doc.id, e)}
                          accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                        />
                      </label>
                    </div>
                  ))}
                </div>
              </div>

              {/* Declaration */}
              <div className="space-y-6 pt-6">
                <div className="border-b pb-4 mb-6">
                  <h3 className="text-2xl font-serif font-bold text-primary">4. Declaration</h3>
                </div>

                <FormField
                  control={form.control}
                  name="gdprConsent"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-xl border p-4 bg-muted/30">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                          className="mt-1"
                        />
                      </FormControl>
                      <div className="space-y-1 leading-relaxed">
                        <FormLabel className="font-medium">
                          I confirm that the information provided is true and complete.
                        </FormLabel>
                        <FormDescription className="text-xs">
                          I understand that any false statements or omissions may result in dismissal. I also consent to TJ FreshSpace Recruitment processing my personal data for recruitment purposes in accordance with GDPR and their Privacy Policy.
                        </FormDescription>
                      </div>
                      <FormMessage className="ml-0 w-full col-span-2 block" />
                    </FormItem>
                  )}
                />

                <div className="pt-6">
                  <Button 
                    type="submit" 
                    size="lg" 
                    className="w-full md:w-auto rounded-full px-12 py-6 text-lg bg-secondary hover:bg-secondary/90 text-white shadow-xl"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                        Submitting Application...
                      </>
                    ) : (
                      'Submit Application'
                    )}
                  </Button>
                  {Object.keys(form.formState.errors).length > 0 && (
                    <p className="text-destructive flex items-center gap-2 mt-4 text-sm font-medium">
                      <AlertCircle className="h-4 w-4" /> Please correct the errors in the form above.
                    </p>
                  )}
                </div>
              </div>

            </form>
          </Form>
        </div>
      </div>
    </div>
  );
}
