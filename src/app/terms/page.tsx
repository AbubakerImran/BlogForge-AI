import { getSiteSettings } from "@/lib/site-settings";

export async function generateMetadata() {
  const settings = await getSiteSettings();
  return {
    title: "Terms and Conditions",
    description: `Terms and Conditions for ${settings.siteName}. Please read these terms carefully before using our platform.`,
  };
}

export default async function TermsPage() {
  const settings = await getSiteSettings();
  return (
    <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
      <h1 className="text-4xl font-bold tracking-tight">
        Terms and Conditions
      </h1>
      <p className="mt-2 text-sm text-muted-foreground">
        Last updated: {new Date().toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}
      </p>

      <div className="prose prose-lg mt-10 max-w-none dark:prose-invert">
        <h2>1. Acceptance of Terms</h2>
        <p>
          By accessing and using {settings.siteName} (&quot;the Platform&quot;), you accept and agree to be
          bound by these Terms and Conditions. If you do not agree to these terms, you must not use
          the Platform. These terms apply to all visitors, users, and contributors.
        </p>

        <h2>2. Description of Service</h2>
        <p>
          {settings.siteName} is an AI-powered blogging and content platform that provides tools for
          creating, publishing, and consuming blog content. Our services include but are not limited
          to:
        </p>
        <ul>
          <li>Blog publishing and content management</li>
          <li>AI-generated content summaries and recommendations</li>
          <li>Newsletter subscription and delivery</li>
          <li>Content analytics and insights</li>
          <li>User account management and authentication</li>
        </ul>

        <h2>3. User Accounts</h2>
        <p>
          To access certain features, you may need to create an account. You agree to:
        </p>
        <ul>
          <li>Provide accurate, current, and complete information during registration</li>
          <li>Maintain and update your account information to keep it accurate</li>
          <li>Maintain the security of your password and accept all risks of unauthorized access</li>
          <li>Notify us immediately of any unauthorized use of your account</li>
        </ul>
        <p>
          We reserve the right to suspend or terminate accounts that violate these terms or engage
          in fraudulent activity.
        </p>

        <h2>4. User Content</h2>
        <p>
          You retain ownership of any content you create and publish on the Platform. By publishing
          content, you grant us a non-exclusive, worldwide, royalty-free license to use, reproduce,
          modify, and display your content in connection with providing our services.
        </p>
        <p>You agree that your content will not:</p>
        <ul>
          <li>Infringe on any third-party intellectual property rights</li>
          <li>Contain defamatory, libelous, or fraudulent material</li>
          <li>Include malicious code, spam, or unauthorized advertising</li>
          <li>Violate any applicable law or regulation</li>
          <li>Contain personal information of others without their consent</li>
          <li>Promote violence, discrimination, or illegal activities</li>
        </ul>
        <p>
          We reserve the right to remove any content that violates these terms without prior notice.
        </p>

        <h2>5. AI-Generated Content</h2>
        <p>
          Our Platform uses artificial intelligence to generate content summaries, recommendations,
          and other features. While we strive for accuracy, AI-generated content:
        </p>
        <ul>
          <li>May not always be fully accurate or complete</li>
          <li>Should not be relied upon as professional or expert advice</li>
          <li>Is provided &quot;as is&quot; without warranties of any kind</li>
          <li>May be updated or modified as our AI models improve</li>
        </ul>

        <h2>6. Intellectual Property</h2>
        <p>
          The Platform, including its design, logos, features, and original content, is the property
          of {settings.siteName} and is protected by copyright, trademark, and other intellectual
          property laws. You may not reproduce, distribute, or create derivative works without our
          express written permission.
        </p>

        <h2>7. Prohibited Activities</h2>
        <p>When using the Platform, you agree not to:</p>
        <ul>
          <li>Attempt to gain unauthorized access to any part of the Platform</li>
          <li>Use automated tools (bots, scrapers) to access the Platform without permission</li>
          <li>Interfere with or disrupt the Platform&apos;s functionality or servers</li>
          <li>Impersonate another person or entity</li>
          <li>Engage in any activity that could damage, disable, or impair the Platform</li>
          <li>Use the Platform for any unlawful or unauthorized purpose</li>
          <li>Circumvent any security features or access controls</li>
        </ul>

        <h2>8. Newsletter and Communications</h2>
        <p>
          By subscribing to our newsletter, you consent to receiving periodic emails from us. You
          may unsubscribe at any time using the link provided in each email. We will not share your
          email address with third parties for marketing purposes.
        </p>

        <h2>9. Third-Party Links and Services</h2>
        <p>
          The Platform may contain links to third-party websites or services. We are not responsible
          for the content, privacy policies, or practices of any third-party sites. Access to
          third-party content is at your own risk.
        </p>

        <h2>10. Disclaimer of Warranties</h2>
        <p>
          The Platform is provided on an &quot;as is&quot; and &quot;as available&quot; basis. We make no warranties,
          expressed or implied, regarding the Platform&apos;s reliability, accuracy, availability,
          or fitness for a particular purpose. We do not warrant that the Platform will be
          uninterrupted, error-free, or free of viruses or other harmful components.
        </p>

        <h2>11. Limitation of Liability</h2>
        <p>
          To the maximum extent permitted by law, {settings.siteName} and its affiliates shall not be
          liable for any indirect, incidental, special, consequential, or punitive damages arising
          from your use of the Platform, including but not limited to loss of data, profits, or
          goodwill.
        </p>

        <h2>12. Indemnification</h2>
        <p>
          You agree to indemnify and hold harmless {settings.siteName}, its affiliates, and their
          respective officers, directors, employees, and agents from any claims, damages, losses, or
          expenses arising out of your use of the Platform or violation of these terms.
        </p>

        <h2>13. Modifications to Terms</h2>
        <p>
          We reserve the right to modify these Terms and Conditions at any time. Changes will be
          effective immediately upon posting on the Platform. Your continued use of the Platform
          after any changes constitutes acceptance of the modified terms.
        </p>

        <h2>14. Governing Law</h2>
        <p>
          These Terms and Conditions shall be governed by and construed in accordance with the laws
          of the State of California, United States, without regard to its conflict of law
          provisions. Any disputes arising under these terms shall be subject to the exclusive
          jurisdiction of the courts in San Francisco, California.
        </p>

        <h2>15. Severability</h2>
        <p>
          If any provision of these Terms is found to be unenforceable or invalid, that provision
          shall be limited or eliminated to the minimum extent necessary, and the remaining
          provisions shall remain in full force and effect.
        </p>

        <h2>16. Contact Us</h2>
        <p>
          If you have questions about these Terms and Conditions, please contact us through
          our <a href="/contact">contact page</a>.
        </p>
      </div>
    </div>
  );
}
