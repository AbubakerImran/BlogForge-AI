import { getSiteSettings } from "@/lib/site-settings";

export async function generateMetadata() {
  const settings = await getSiteSettings();
  return {
    title: "Privacy Policy",
    description: `Privacy Policy for ${settings.siteName}. Learn how we collect, use, and protect your information.`,
  };
}

export default async function PrivacyPolicyPage() {
  const settings = await getSiteSettings();

  return (
    <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="mb-10">
        <h1 className="text-4xl font-bold tracking-tight">Privacy Policy</h1>
        <p className="mt-2 text-lg text-muted-foreground">
          Last updated: {new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}
        </p>
      </div>

      <div className="prose prose-lg max-w-none dark:prose-invert">
        <h2>1. Introduction</h2>
        <p>
          Welcome to {settings.siteName}. We respect your privacy and are committed to
          protecting your personal data. This privacy policy will inform you about how
          we look after your personal data when you visit our website and tell you about
          your privacy rights.
        </p>

        <h2>2. Information We Collect</h2>
        <p>We may collect the following types of information:</p>
        <ul>
          <li>
            <strong>Personal Information:</strong> Name, email address, and other
            information you voluntarily provide when creating an account, subscribing
            to our newsletter, or contacting us.
          </li>
          <li>
            <strong>Usage Data:</strong> Information about how you use our website,
            including pages visited, time spent on pages, and device information.
          </li>
          <li>
            <strong>Cookies and Tracking:</strong> We use cookies and similar
            technologies to track activity on our website and hold certain information
            to improve your experience.
          </li>
        </ul>

        <h2>3. How We Use Your Information</h2>
        <p>We use the information we collect to:</p>
        <ul>
          <li>Provide, maintain, and improve our services</li>
          <li>Send you newsletters and updates (with your consent)</li>
          <li>Analyze usage patterns to improve user experience</li>
          <li>Respond to your comments, questions, and requests</li>
          <li>Monitor and analyze trends, usage, and activities</li>
        </ul>

        <h2>4. Data Sharing</h2>
        <p>
          We do not sell, trade, or otherwise transfer your personal information to
          outside parties. We may share information with trusted third-party service
          providers who assist us in operating our website, conducting our business,
          or serving our users, so long as those parties agree to keep this information
          confidential.
        </p>

        <h2>5. Data Security</h2>
        <p>
          We implement appropriate security measures to protect your personal information.
          However, no method of transmission over the Internet or method of electronic
          storage is 100% secure, and we cannot guarantee absolute security.
        </p>

        <h2>6. Your Rights</h2>
        <p>You have the right to:</p>
        <ul>
          <li>Access, update, or delete your personal information</li>
          <li>Opt out of marketing communications at any time</li>
          <li>Request a copy of the data we hold about you</li>
          <li>Withdraw consent where we rely on consent to process your data</li>
        </ul>

        <h2>7. Newsletter</h2>
        <p>
          If you subscribe to our newsletter, we will use your email address to send
          you periodic updates and content. You can unsubscribe at any time by clicking
          the unsubscribe link in any newsletter email or by contacting us directly.
        </p>

        <h2>8. Analytics</h2>
        <p>
          We use analytics tools to understand how visitors interact with our website.
          This data is collected anonymously and used solely for improving our services.
          We track unique page views using anonymous tokens to ensure accurate metrics
          without compromising your privacy.
        </p>

        <h2>9. Third-Party Links</h2>
        <p>
          Our website may contain links to third-party websites. We are not responsible
          for the privacy practices or content of those websites. We encourage you to
          read the privacy policies of any third-party sites you visit.
        </p>

        <h2>10. Changes to This Policy</h2>
        <p>
          We may update this privacy policy from time to time. We will notify you of
          any changes by posting the new privacy policy on this page and updating the
          &quot;Last updated&quot; date.
        </p>

        <h2>11. Contact Us</h2>
        <p>
          If you have any questions about this privacy policy, please contact us through
          our <a href="/contact">contact page</a>.
        </p>
      </div>
    </div>
  );
}
