import { getSiteSettings } from "@/lib/site-settings";

export async function generateMetadata() {
  const settings = await getSiteSettings();
  return {
    title: "Privacy Policy",
    description: `Privacy Policy for ${settings.siteName}. Learn how we collect, use, and protect your personal information.`,
  };
}

export default async function PrivacyPolicyPage() {
  const settings = await getSiteSettings();
  return (
    <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
      <h1 className="text-4xl font-bold tracking-tight">Privacy Policy</h1>
      <p className="mt-2 text-sm text-muted-foreground">
        Last updated: {new Date().toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}
      </p>

      <div className="prose prose-lg mt-10 max-w-none dark:prose-invert">
        <h2>1. Introduction</h2>
        <p>
          Welcome to {settings.siteName} (&quot;we,&quot; &quot;our,&quot; or &quot;us&quot;). We are committed to protecting
          your personal information and your right to privacy. This Privacy Policy explains how we
          collect, use, disclose, and safeguard your information when you visit our website and use
          our services.
        </p>
        <p>
          By accessing or using our platform, you agree to the terms of this Privacy Policy. If you
          do not agree with the terms, please do not access the site.
        </p>

        <h2>2. Information We Collect</h2>
        <h3>Personal Information You Provide</h3>
        <p>We may collect personal information that you voluntarily provide when you:</p>
        <ul>
          <li>Create an account (name, email address, password)</li>
          <li>Subscribe to our newsletter (email address)</li>
          <li>Submit a contact form (name, email, message content)</li>
          <li>Create or publish blog posts (content, images, author information)</li>
          <li>Interact with our platform (comments, shares, preferences)</li>
        </ul>

        <h3>Information Automatically Collected</h3>
        <p>When you visit our website, we automatically collect certain information, including:</p>
        <ul>
          <li>Device information (browser type, operating system, device type)</li>
          <li>Usage data (pages visited, time spent, click patterns)</li>
          <li>IP address and approximate geographic location</li>
          <li>Referring website or source</li>
          <li>Cookies and similar tracking technologies</li>
        </ul>

        <h2>3. How We Use Your Information</h2>
        <p>We use the information we collect to:</p>
        <ul>
          <li>Provide, maintain, and improve our platform and services</li>
          <li>Process your account registration and manage your account</li>
          <li>Send you newsletters and marketing communications (with your consent)</li>
          <li>Respond to your inquiries and provide customer support</li>
          <li>Analyze usage trends and optimize user experience</li>
          <li>Generate AI-powered content summaries and recommendations</li>
          <li>Detect, prevent, and address technical issues or security breaches</li>
          <li>Comply with legal obligations</li>
        </ul>

        <h2>4. Cookies and Tracking Technologies</h2>
        <p>
          We use cookies and similar tracking technologies to collect and store information about
          your interactions with our platform. These include:
        </p>
        <ul>
          <li><strong>Essential cookies:</strong> Required for basic site functionality and authentication.</li>
          <li><strong>Analytics cookies:</strong> Help us understand how visitors interact with our site.</li>
          <li><strong>Preference cookies:</strong> Remember your settings such as theme preference (dark/light mode).</li>
        </ul>
        <p>
          You can control cookie preferences through your browser settings. Disabling certain
          cookies may affect site functionality.
        </p>

        <h2>5. Sharing of Information</h2>
        <p>We do not sell your personal information. We may share your data with:</p>
        <ul>
          <li><strong>Service providers:</strong> Third-party companies that help us operate our platform (hosting, email delivery, analytics).</li>
          <li><strong>AI service providers:</strong> To generate content summaries and recommendations (content data only, not personal identifiers).</li>
          <li><strong>Legal requirements:</strong> When required by law, court order, or governmental authority.</li>
          <li><strong>Business transfers:</strong> In the event of a merger, acquisition, or sale of assets.</li>
        </ul>

        <h2>6. Data Retention</h2>
        <p>
          We retain your personal information for as long as your account is active or as needed to
          provide you with our services. We may also retain data as necessary to comply with legal
          obligations, resolve disputes, and enforce agreements. You may request deletion of your
          data at any time by contacting us.
        </p>

        <h2>7. Data Security</h2>
        <p>
          We implement appropriate technical and organizational measures to protect your personal
          information against unauthorized access, alteration, disclosure, or destruction. However,
          no method of transmission over the Internet is 100% secure, and we cannot guarantee
          absolute security.
        </p>

        <h2>8. Your Rights</h2>
        <p>Depending on your location, you may have the following rights:</p>
        <ul>
          <li>Access, correct, or delete your personal information</li>
          <li>Withdraw consent for data processing</li>
          <li>Object to or restrict processing of your data</li>
          <li>Data portability (receive your data in a structured format)</li>
          <li>Lodge a complaint with a supervisory authority</li>
        </ul>
        <p>
          To exercise any of these rights, please contact us through our{" "}
          <a href="/contact">contact page</a>.
        </p>

        <h2>9. Third-Party Links</h2>
        <p>
          Our platform may contain links to third-party websites. We are not responsible for the
          privacy practices or content of these external sites. We encourage you to review the
          privacy policies of any third-party sites you visit.
        </p>

        <h2>10. Children&apos;s Privacy</h2>
        <p>
          Our platform is not directed to children under the age of 13. We do not knowingly collect
          personal information from children. If we become aware that we have collected data from a
          child under 13, we will take steps to delete that information promptly.
        </p>

        <h2>11. Changes to This Policy</h2>
        <p>
          We may update this Privacy Policy from time to time. We will notify you of any material
          changes by posting the updated policy on this page with a revised &quot;Last updated&quot; date. Your
          continued use of the platform after changes constitutes acceptance of the updated policy.
        </p>

        <h2>12. Contact Us</h2>
        <p>
          If you have questions or concerns about this Privacy Policy, please contact us through
          our <a href="/contact">contact page</a>.
        </p>
      </div>
    </div>
  );
}
