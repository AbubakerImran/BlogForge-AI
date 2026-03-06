import ContactForm from "@/components/forms/ContactForm";
import { getSiteSettings } from "@/lib/site-settings";

export async function generateMetadata() {
  const settings = await getSiteSettings();
  return {
    title: "Contact",
    description: `Get in touch with the ${settings.siteName} team. We'd love to hear from you.`,
  };
}

export default async function ContactPage() {
  const settings = await getSiteSettings();

  const socialLinks = [
    ...(settings.twitterUrl ? [{ label: "Twitter", href: settings.twitterUrl }] : []),
    ...(settings.githubUrl ? [{ label: "GitHub", href: settings.githubUrl }] : []),
    ...(settings.linkedinUrl ? [{ label: "LinkedIn", href: settings.linkedinUrl }] : []),
  ];

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="mb-10 text-center">
        <h1 className="text-4xl font-bold tracking-tight">Contact Us</h1>
        <p className="mt-2 text-lg text-muted-foreground">
          Have a question, feedback, or just want to say hello? We&apos;d love
          to hear from you.
        </p>
      </div>

      <div className="grid gap-12 lg:grid-cols-2">
        {/* Contact Form */}
        <div className="rounded-xl border bg-card p-6 shadow-sm sm:p-8">
          <h2 className="mb-6 text-2xl font-semibold">Send Us a Message</h2>
          <ContactForm />
        </div>

        {/* Contact Info */}
        <div className="space-y-8">
          <div className="rounded-xl border bg-card p-6 shadow-sm sm:p-8">
            <h2 className="mb-6 text-2xl font-semibold">Get in Touch</h2>
            <div className="space-y-6">
              <div>
                <h3 className="font-medium">Email</h3>
                <p className="mt-1 text-muted-foreground">
                  {settings.resendFromEmail}
                </p>
              </div>
              {socialLinks.length > 0 && (
                <div>
                  <h3 className="font-medium">Social</h3>
                  <div className="mt-2 flex gap-4">
                    {socialLinks.map((link) => (
                      <a
                        key={link.label}
                        href={link.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-muted-foreground transition hover:text-primary"
                      >
                        {link.label}
                      </a>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Info */}
          <div className="flex h-64 items-center justify-center rounded-xl border bg-muted">
            <div className="text-center text-muted-foreground">
              <span className="text-4xl">✉️</span>
              <p className="mt-2 text-sm font-medium">{settings.siteName}</p>
              <p className="text-xs">We&apos;ll get back to you soon</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
