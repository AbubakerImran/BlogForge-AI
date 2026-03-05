import ContactForm from "@/components/forms/ContactForm";
import { getSiteSettings } from "@/lib/site-settings";

export async function generateMetadata() {
  const settings = await getSiteSettings();
  return {
    title: "Contact",
    description: `Get in touch with the ${settings.siteName} team. We'd love to hear from you.`,
  };
}

export default function ContactPage() {
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
                  contact@blogforgeai.com
                </p>
              </div>
              <div>
                <h3 className="font-medium">Address</h3>
                <p className="mt-1 text-muted-foreground">
                  123 Innovation Drive
                  <br />
                  San Francisco, CA 94107
                  <br />
                  United States
                </p>
              </div>
              <div>
                <h3 className="font-medium">Social</h3>
                <div className="mt-2 flex gap-4">
                  <a
                    href="https://twitter.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-muted-foreground transition hover:text-primary"
                  >
                    Twitter
                  </a>
                  <a
                    href="https://github.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-muted-foreground transition hover:text-primary"
                  >
                    GitHub
                  </a>
                  <a
                    href="https://linkedin.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-muted-foreground transition hover:text-primary"
                  >
                    LinkedIn
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Map Placeholder */}
          <div className="flex h-64 items-center justify-center rounded-xl border bg-muted">
            <div className="text-center text-muted-foreground">
              <span className="text-4xl">📍</span>
              <p className="mt-2 text-sm">Map placeholder</p>
              <p className="text-xs">San Francisco, CA</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
