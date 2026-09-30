import { useEffect, useRef, useState, type FormEvent, type ReactNode } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import {
  getGetSiteSettingsQueryKey,
  useGetSiteSettings,
  useUpdateSiteSettings,
} from '@workspace/api-client-react';
import type { SiteSettings, SiteSettingsUpdate } from '@workspace/api-client-react';
import {
  AlertCircle,
  Check,
  CheckCircle2,
  Clock3,
  ExternalLink,
  Facebook,
  Globe2,
  Image as ImageIcon,
  Instagram,
  Linkedin,
  LoaderCircle,
  Mail,
  MapPin,
  Phone,
  RefreshCw,
  Save,
  Sparkles,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

const EMPTY_SETTINGS: SiteSettingsUpdate = {
  companyName: '',
  contactEmail: '',
  phone: '',
  address: '',
  officeHours: '',
  heroTitle: '',
  heroSubtitle: '',
  heroImageUrl: '',
  aboutTitle: '',
  aboutDescription: '',
  aboutImageUrl: '',
  facebookUrl: '',
  instagramUrl: '',
  linkedinUrl: '',
};

const toFormValues = (settings: SiteSettings): SiteSettingsUpdate => ({
  companyName: settings.companyName,
  contactEmail: settings.contactEmail,
  phone: settings.phone,
  address: settings.address,
  officeHours: settings.officeHours,
  heroTitle: settings.heroTitle,
  heroSubtitle: settings.heroSubtitle,
  heroImageUrl: settings.heroImageUrl,
  aboutTitle: settings.aboutTitle,
  aboutDescription: settings.aboutDescription,
  aboutImageUrl: settings.aboutImageUrl,
  facebookUrl: settings.facebookUrl,
  instagramUrl: settings.instagramUrl,
  linkedinUrl: settings.linkedinUrl,
});

const isPublicImageUrl = (value: string) => {
  if (!value.trim()) return true;
  try {
    const url = new URL(value);
    return url.protocol === 'http:' || url.protocol === 'https:';
  } catch {
    return false;
  }
};

function SectionHeading({
  eyebrow,
  title,
  description,
  number,
}: {
  eyebrow: string;
  title: string;
  description: string;
  number: string;
}) {
  return (
    <div className="mb-6 flex gap-4">
      <span className="mt-0.5 font-mono text-xs font-semibold tracking-[0.18em] text-[#7c978b]">{number}</span>
      <div>
        <p className="mb-1 text-[11px] font-bold uppercase tracking-[0.18em] text-[#668277]">{eyebrow}</p>
        <h2 className="font-serif text-[25px] font-semibold leading-tight tracking-[-0.025em] text-[#1d3d45]">{title}</h2>
        <p className="mt-2 max-w-2xl text-sm leading-6 text-[#72837f]">{description}</p>
      </div>
    </div>
  );
}

function Field({
  id,
  label,
  value,
  onChange,
  placeholder,
  type = 'text',
  hint,
  required = false,
  maxLength,
}: {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  type?: string;
  hint?: string;
  required?: boolean;
  maxLength?: number;
}) {
  return (
    <div className="space-y-2">
      <Label htmlFor={id} className="text-[13px] font-semibold text-[#314d51]">{label}</Label>
      <Input
        id={id}
        data-testid={`input-${id}`}
        type={type}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        required={required}
        maxLength={maxLength}
        className="h-11 rounded-lg border-[#d6e0d9] bg-[#fcfdf9] text-sm text-[#244149] placeholder:text-[#a0aea7] focus-visible:ring-[#568176]"
      />
      {hint && <p className="text-xs leading-5 text-[#879792]">{hint}</p>}
    </div>
  );
}

function TextAreaField({
  id,
  label,
  value,
  onChange,
  placeholder,
  rows = 4,
  hint,
  maxLength,
}: {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  rows?: number;
  hint?: string;
  maxLength?: number;
}) {
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between gap-3">
        <Label htmlFor={id} className="text-[13px] font-semibold text-[#314d51]">{label}</Label>
        {maxLength && <span className="font-mono text-[10px] text-[#99a8a1]">{value.length}/{maxLength}</span>}
      </div>
      <Textarea
        id={id}
        data-testid={`input-${id}`}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        rows={rows}
        maxLength={maxLength}
        className="resize-y rounded-lg border-[#d6e0d9] bg-[#fcfdf9] text-sm leading-6 text-[#244149] placeholder:text-[#a0aea7] focus-visible:ring-[#568176]"
      />
      {hint && <p className="text-xs leading-5 text-[#879792]">{hint}</p>}
    </div>
  );
}

function ImagePreview({ url, label }: { url: string; label: string }) {
  const [failed, setFailed] = useState(false);
  const hasUsableUrl = Boolean(url.trim()) && isPublicImageUrl(url);

  if (!hasUsableUrl || failed) {
    return (
      <div className="flex h-[150px] items-center justify-center rounded-lg border border-dashed border-[#cbd9d1] bg-[#f2f6f0] px-5 text-center">
        <div>
          <div className="mx-auto mb-2 flex h-9 w-9 items-center justify-center rounded-full bg-[#e3ede5] text-[#66877b]">
            <ImageIcon className="h-4 w-4" aria-hidden="true" />
          </div>
          <p className="text-xs font-semibold text-[#536d66]">{url.trim() && failed ? 'Preview unavailable' : 'Bundled image in use'}</p>
          <p className="mt-1 text-[11px] leading-4 text-[#8a9a92]">
            {url.trim() && failed ? 'Check that the image is public and the link is correct.' : 'Leave this blank to keep the current site image.'}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative h-[150px] overflow-hidden rounded-lg border border-[#d5dfd8] bg-[#e8eee9]">
      <img
        src={url}
        alt={`${label} preview`}
        data-testid={`img-preview-${label.toLowerCase().replaceAll(' ', '-')}`}
        className="h-full w-full object-cover"
        onError={() => setFailed(true)}
      />
      <span className="absolute bottom-2 left-2 rounded-md bg-[#183943]/85 px-2 py-1 text-[10px] font-semibold tracking-wide text-[#eef3ed]">LIVE PREVIEW</span>
    </div>
  );
}

function ImageUrlField({
  id,
  label,
  value,
  onChange,
}: {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
}) {
  const valid = isPublicImageUrl(value);
  const errorId = `${id}-error`;

  return (
    <div className="space-y-3">
      <div className="space-y-2">
        <Label htmlFor={id} className="text-[13px] font-semibold text-[#314d51]">{label}</Label>
        <Input
          id={id}
          data-testid={`input-${id}`}
          type="text"
          inputMode="url"
          value={value}
          onChange={(event) => onChange(event.target.value)}
          placeholder="https://example.com/image.jpg"
          aria-invalid={!valid}
          aria-describedby={!valid ? errorId : `${id}-hint`}
          className={`h-11 rounded-lg bg-[#fcfdf9] text-sm text-[#244149] placeholder:text-[#a0aea7] focus-visible:ring-[#568176] ${valid ? 'border-[#d6e0d9]' : 'border-[#c77762] focus-visible:ring-[#c77762]'}`}
        />
        {!valid ? (
          <p id={errorId} className="flex items-center gap-1.5 text-xs text-[#a94f3b]">
            <AlertCircle className="h-3.5 w-3.5" aria-hidden="true" />
            Use a public image URL beginning with http:// or https://.
          </p>
        ) : (
          <p id={`${id}-hint`} className="text-xs leading-5 text-[#879792]">Use a public image URL featuring a Black woman. Blank keeps the current bundled image.</p>
        )}
      </div>
      <ImagePreview key={value || 'bundled'} url={value} label={label} />
    </div>
  );
}

function LoadingSettings() {
  return (
    <div className="mx-auto max-w-6xl px-4 pb-16 pt-8 sm:px-6 lg:px-8">
      <div className="animate-pulse">
        <div className="mb-8 h-3 w-36 rounded bg-[#dce5dd]" />
        <div className="mb-3 h-10 w-72 max-w-full rounded bg-[#dce5dd]" />
        <div className="mb-10 h-4 w-[28rem] max-w-full rounded bg-[#e2e9e2]" />
        <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_280px]">
          <div className="space-y-5 rounded-2xl border border-[#dfe7df] bg-[#fbfcf8] p-6 sm:p-8">
            <div className="h-6 w-48 rounded bg-[#dce5dd]" />
            <div className="grid gap-5 sm:grid-cols-2">
              <div className="h-16 rounded-lg bg-[#edf1eb]" />
              <div className="h-16 rounded-lg bg-[#edf1eb]" />
              <div className="h-16 rounded-lg bg-[#edf1eb]" />
              <div className="h-16 rounded-lg bg-[#edf1eb]" />
            </div>
          </div>
          <div className="h-64 rounded-2xl border border-[#dfe7df] bg-[#fbfcf8]" />
        </div>
      </div>
      <p className="sr-only" role="status" data-testid="status-settings-loading">Loading site settings</p>
    </div>
  );
}

export default function SiteSettings() {
  const settingsQuery = useGetSiteSettings();
  const updateSettings = useUpdateSiteSettings();
  const queryClient = useQueryClient();
  const initialized = useRef(false);
  const [form, setForm] = useState<SiteSettingsUpdate>(EMPTY_SETTINGS);
  const [saved, setSaved] = useState(false);
  const [saveError, setSaveError] = useState(false);
  const [attemptedSubmit, setAttemptedSubmit] = useState(false);

  useEffect(() => {
    if (settingsQuery.data && !initialized.current) {
      setForm(toFormValues(settingsQuery.data));
      initialized.current = true;
    }
  }, [settingsQuery.data]);

  const setField = (key: keyof SiteSettingsUpdate, value: string) => {
    setForm((current) => ({ ...current, [key]: value }));
    setSaved(false);
    setSaveError(false);
  };

  const imageErrors = [
    !isPublicImageUrl(form.heroImageUrl) ? 'Hero image' : '',
    !isPublicImageUrl(form.aboutImageUrl) ? 'About image' : '',
  ].filter(Boolean);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setAttemptedSubmit(true);
    setSaved(false);
    setSaveError(false);
    if (imageErrors.length > 0) return;

    updateSettings.mutate(
      { data: form },
      {
        onSuccess: async (result) => {
          setForm(toFormValues(result));
          setSaved(true);
          await queryClient.invalidateQueries({ queryKey: getGetSiteSettingsQueryKey() });
        },
        onError: () => setSaveError(true),
      },
    );
  };

  if (settingsQuery.isLoading) return <LoadingSettings />;

  if (settingsQuery.isError || !settingsQuery.data) {
    return (
      <main className="mx-auto max-w-3xl px-4 py-16 sm:px-6">
        <div className="rounded-2xl border border-[#dce5dc] bg-[#fbfcf8] px-6 py-10 text-center shadow-[0_18px_45px_-40px_rgba(29,61,69,0.5)] sm:px-10">
          <div className="mx-auto mb-5 flex h-12 w-12 items-center justify-center rounded-full bg-[#f7e8e1] text-[#a24e3d]">
            <AlertCircle className="h-5 w-5" aria-hidden="true" />
          </div>
          <p className="mb-2 text-xs font-bold uppercase tracking-[0.18em] text-[#82928a]">Settings unavailable</p>
          <h1 className="font-serif text-3xl font-semibold tracking-tight text-[#1d3d45]">We couldn’t load your site settings.</h1>
          <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-[#768681]">Your changes are safe. Check your connection, then try loading the settings again.</p>
          <Button
            type="button"
            data-testid="button-retry-settings"
            onClick={() => settingsQuery.refetch()}
            className="mt-7 rounded-lg bg-[#1d454d] text-[#f5f6ef] hover:bg-[#285962]"
          >
            <RefreshCw className="mr-2 h-4 w-4" aria-hidden="true" />
            Try again
          </Button>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-[calc(100dvh-4rem)] bg-[#f3f5ef]">
      <div className="mx-auto max-w-6xl px-4 pb-28 pt-8 sm:px-6 sm:pt-11 lg:px-8">
        <div className="mb-8 flex flex-col justify-between gap-6 border-b border-[#dce5dc] pb-7 sm:flex-row sm:items-end">
          <div>
            <p className="mb-3 flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.2em] text-[#698478]">
              <span className="h-px w-6 bg-[#91aa9d]" />
              Public presence · Site settings
            </p>
            <h1 className="font-serif text-4xl font-semibold tracking-[-0.04em] text-[#183943] sm:text-[44px]">Your site, in good order.</h1>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-[#72837d]">
              Keep the details your visitors see accurate, welcoming, and unmistakably yours.
            </p>
          </div>
          <div className="flex items-center gap-2 self-start rounded-full border border-[#d5e0d7] bg-[#fafbf7] px-3 py-2 text-xs font-medium text-[#6d8179] sm:self-auto">
            <span className="h-2 w-2 rounded-full bg-[#5d8b75]" />
            Changes publish to the public site
          </div>
        </div>

        <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_275px]">
          <form onSubmit={handleSubmit} className="min-w-0 space-y-6">
            <section className="rounded-2xl border border-[#dce5dc] bg-[#fbfcf8] p-5 shadow-[0_16px_40px_-36px_rgba(29,61,69,0.45)] sm:p-8">
              <SectionHeading
                number="01"
                eyebrow="The essentials"
                title="How visitors reach you"
                description="Company details appear across your public pages and give applicants a direct way to get in touch."
              />
              <div className="grid gap-x-5 gap-y-5 sm:grid-cols-2">
                <Field id="company-name" label="Company name" value={form.companyName} onChange={(value) => setField('companyName', value)} placeholder="TJ FreshSpace" required maxLength={120} />
                <Field id="contact-email" label="Contact email" value={form.contactEmail} onChange={(value) => setField('contactEmail', value)} placeholder="hello@tjfreshspace.co.uk" type="email" required maxLength={254} />
                <Field id="contact-phone" label="Phone number" value={form.phone} onChange={(value) => setField('phone', value)} placeholder="+44 20 7946 0821" type="tel" maxLength={80} />
                <Field id="office-hours" label="Office hours" value={form.officeHours} onChange={(value) => setField('officeHours', value)} placeholder="Mon–Fri, 9am–5pm" maxLength={500} />
                <div className="sm:col-span-2">
                  <TextAreaField id="business-address" label="Business address" value={form.address} onChange={(value) => setField('address', value)} placeholder="Street, town or city, postcode" rows={2} maxLength={500} />
                </div>
              </div>
            </section>

            <section className="rounded-2xl border border-[#dce5dc] bg-[#fbfcf8] p-5 shadow-[0_16px_40px_-36px_rgba(29,61,69,0.45)] sm:p-8">
              <SectionHeading
                number="02"
                eyebrow="First impression"
                title="The welcome"
                description="Set the headline, supporting message, and image visitors meet first on your homepage."
              />
              <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(245px,0.8fr)]">
                <div className="space-y-5">
                  <Field id="hero-title" label="Hero title" value={form.heroTitle} onChange={(value) => setField('heroTitle', value)} placeholder="A fresh start for every space" maxLength={240} />
                  <TextAreaField id="hero-subtitle" label="Hero subtitle" value={form.heroSubtitle} onChange={(value) => setField('heroSubtitle', value)} placeholder="A short, warm introduction to your team and services." rows={4} maxLength={1000} />
                </div>
                <ImageUrlField id="hero-image-url" label="Hero image URL" value={form.heroImageUrl} onChange={(value) => setField('heroImageUrl', value)} />
              </div>
            </section>

            <section className="rounded-2xl border border-[#dce5dc] bg-[#fbfcf8] p-5 shadow-[0_16px_40px_-36px_rgba(29,61,69,0.45)] sm:p-8">
              <SectionHeading
                number="03"
                eyebrow="A little about you"
                title="The story"
                description="Share what sets your team apart. A few genuine details are more memorable than a polished slogan."
              />
              <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(245px,0.8fr)]">
                <div className="space-y-5">
                  <Field id="about-title" label="About title" value={form.aboutTitle} onChange={(value) => setField('aboutTitle', value)} placeholder="Care in every corner" maxLength={240} />
                  <TextAreaField id="about-description" label="About description" value={form.aboutDescription} onChange={(value) => setField('aboutDescription', value)} placeholder="Tell visitors how the team works and what matters to you." rows={6} maxLength={2000} />
                </div>
                <ImageUrlField id="about-image-url" label="About image URL" value={form.aboutImageUrl} onChange={(value) => setField('aboutImageUrl', value)} />
              </div>
            </section>

            <section className="rounded-2xl border border-[#dce5dc] bg-[#fbfcf8] p-5 shadow-[0_16px_40px_-36px_rgba(29,61,69,0.45)] sm:p-8">
              <SectionHeading
                number="04"
                eyebrow="Stay connected"
                title="Social profiles"
                description="Add the profiles your team actively maintains. Empty links stay hidden from the public site."
              />
              <div className="grid gap-x-5 gap-y-5 sm:grid-cols-2">
                <div className="relative">
                  <Facebook className="pointer-events-none absolute left-3 top-[39px] h-4 w-4 text-[#80978c]" aria-hidden="true" />
                  <div className="[&_input]:pl-9">
                    <Field id="facebook-url" label="Facebook" value={form.facebookUrl} onChange={(value) => setField('facebookUrl', value)} placeholder="https://facebook.com/…" type="url" maxLength={2048} />
                  </div>
                </div>
                <div className="relative">
                  <Instagram className="pointer-events-none absolute left-3 top-[39px] h-4 w-4 text-[#80978c]" aria-hidden="true" />
                  <div className="[&_input]:pl-9">
                    <Field id="instagram-url" label="Instagram" value={form.instagramUrl} onChange={(value) => setField('instagramUrl', value)} placeholder="https://instagram.com/…" type="url" maxLength={2048} />
                  </div>
                </div>
                <div className="relative sm:col-span-2">
                  <Linkedin className="pointer-events-none absolute left-3 top-[39px] h-4 w-4 text-[#80978c]" aria-hidden="true" />
                  <div className="[&_input]:pl-9">
                    <Field id="linkedin-url" label="LinkedIn" value={form.linkedinUrl} onChange={(value) => setField('linkedinUrl', value)} placeholder="https://linkedin.com/company/…" type="url" maxLength={2048} />
                  </div>
                </div>
              </div>
            </section>

            {attemptedSubmit && imageErrors.length > 0 && (
              <div role="alert" data-testid="status-image-url-error" className="flex gap-3 rounded-xl border border-[#e9c8bd] bg-[#fbefea] px-4 py-3 text-sm text-[#8d4435]">
                <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
                <p>Check the {imageErrors.join(' and ').toLowerCase()} URL. Only public http and https links are supported.</p>
              </div>
            )}
            {saveError && (
              <div role="alert" data-testid="status-save-error" className="flex gap-3 rounded-xl border border-[#e9c8bd] bg-[#fbefea] px-4 py-3 text-sm text-[#8d4435]">
                <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
                <p>Your settings weren’t saved. Please try again.</p>
              </div>
            )}
            {saved && (
              <div role="status" data-testid="status-settings-saved" className="flex gap-3 rounded-xl border border-[#cbded0] bg-[#edf5ec] px-4 py-3 text-sm text-[#426c55]">
                <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
                <p>Your public site settings are up to date.</p>
              </div>
            )}

            <div className="sticky bottom-0 z-10 -mx-4 flex items-center justify-between gap-4 border-t border-[#d9e3db] bg-[#f3f5ef]/95 px-4 py-4 backdrop-blur sm:static sm:mx-0 sm:border-0 sm:bg-transparent sm:px-0 sm:py-1 sm:backdrop-blur-none">
              <p className="hidden text-xs text-[#82918b] sm:block">Changes take effect on the public website after saving.</p>
              <Button
                type="submit"
                data-testid="button-save-settings"
                disabled={updateSettings.isPending}
                className="ml-auto h-11 min-w-[158px] rounded-lg bg-[#1d454d] px-5 text-sm font-semibold text-[#f5f6ef] shadow-[0_8px_20px_-12px_rgba(24,57,67,0.7)] hover:bg-[#285962] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {updateSettings.isPending ? (
                  <>
                    <LoaderCircle className="mr-2 h-4 w-4 animate-spin" aria-hidden="true" />
                    Saving changes…
                  </>
                ) : saved ? (
                  <>
                    <Check className="mr-2 h-4 w-4" aria-hidden="true" />
                    Saved
                  </>
                ) : (
                  <>
                    <Save className="mr-2 h-4 w-4" aria-hidden="true" />
                    Save changes
                  </>
                )}
              </Button>
            </div>
          </form>

          <aside className="space-y-4 lg:sticky lg:top-24">
            <div className="overflow-hidden rounded-2xl border border-[#d7e2d8] bg-[#1d454d] p-5 text-[#f2f4ec]">
              <div className="mb-6 flex items-start justify-between">
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#b4cec0]">Quick preview</p>
                  <h2 className="mt-1 font-serif text-2xl font-medium text-[#f2f4ec]">Your details</h2>
                </div>
                <div className="flex h-9 w-9 items-center justify-center rounded-full border border-[#d2e4d6]/20 bg-[#d2e4d6]/10 text-[#c6dcca]">
                  <Globe2 className="h-4 w-4" aria-hidden="true" />
                </div>
              </div>
              <div className="space-y-4">
                <PreviewDetail icon={<Mail className="h-4 w-4" aria-hidden="true" />} label="Email" value={form.contactEmail} />
                <PreviewDetail icon={<Phone className="h-4 w-4" aria-hidden="true" />} label="Phone" value={form.phone} />
                <PreviewDetail icon={<MapPin className="h-4 w-4" aria-hidden="true" />} label="Address" value={form.address} />
                <PreviewDetail icon={<Clock3 className="h-4 w-4" aria-hidden="true" />} label="Office hours" value={form.officeHours} />
              </div>
              <div className="mt-6 border-t border-[#d7e4d7]/15 pt-4">
                <p className="text-xs leading-5 text-[#d3e0d7]/70">This quick view updates as you edit. Save to publish it to visitors.</p>
              </div>
            </div>

            <div className="rounded-2xl border border-[#dce5dc] bg-[#fbfcf8] p-5">
              <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-full bg-[#e8efe7] text-[#668478]">
                <Sparkles className="h-4 w-4" aria-hidden="true" />
              </div>
              <h3 className="font-serif text-lg font-semibold text-[#24434a]">A small tip</h3>
              <p className="mt-1.5 text-xs leading-5 text-[#788982]">For the clearest previews, use a direct image link and keep the subject framed near the centre.</p>
              <a href="/" target="_blank" rel="noreferrer" data-testid="link-view-public-site" className="mt-4 inline-flex items-center gap-1.5 text-xs font-semibold text-[#48746a] transition-colors hover:text-[#1d454d] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#568176]">
                View public site
                <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
              </a>
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
}

function PreviewDetail({ icon, label, value }: { icon: ReactNode; label: string; value: string }) {
  return (
    <div className="flex gap-3" data-testid={`preview-${label.toLowerCase().replaceAll(' ', '-')}`}>
      <span className="mt-0.5 text-[#b4cec0]">{icon}</span>
      <div className="min-w-0">
        <p className="text-[10px] font-semibold uppercase tracking-[0.13em] text-[#b4cec0]/75">{label}</p>
        <p className="mt-0.5 break-words text-sm text-[#f1f3ed]">{value || <span className="italic text-[#c1d1c6]/60">Not added yet</span>}</p>
      </div>
    </div>
  );
}