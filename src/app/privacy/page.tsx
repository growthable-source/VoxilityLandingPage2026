import type { Metadata } from "next";
import { LegalShell } from "@/components/sections/LegalShell";

const TITLE = "Privacy Policy — Xovera";
const DESCRIPTION =
  "How Xovera collects, uses, and protects your information when you visit our site, contact us, or use the Xovera AI, Xovera Ads, or Xovera Go platforms.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: "https://xovera.io/privacy" },
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    url: "https://xovera.io/privacy",
    type: "article",
  },
  twitter: { card: "summary_large_image", title: TITLE, description: DESCRIPTION },
};

export default function PrivacyPage() {
  return (
    <LegalShell
      title="Privacy Policy"
      lastUpdated="April 27, 2026"
      intro="This Privacy Policy describes how Xovera collects, uses, and protects personal information when you visit our website, contact us, or use the Xovera AI, Xovera Ads, or Xovera Go platforms."
    >
      <p>
        We aim to be straightforward. If anything in this policy is unclear,
        email <a href="mailto:privacy@xovera.io">privacy@xovera.io</a>.
      </p>

      <h2>1. Information we collect</h2>
      <h3>Information you provide</h3>
      <ul>
        <li>Identity and contact information (name, company, work email, phone number, role)</li>
        <li>Business qualification details (ad spend, CRM, team size, notes)</li>
        <li>Account credentials and profile data when you sign in to a Xovera platform</li>
        <li>Payment and billing information when you become a customer</li>
      </ul>

      <h3>Information collected automatically</h3>
      <ul>
        <li>Device, browser, and operating system details</li>
        <li>IP address and approximate location</li>
        <li>Pages visited, features used, and how you navigate our properties</li>
        <li>Cookies and similar technologies (see Section 6)</li>
      </ul>

      <h3>Information from third parties</h3>
      <ul>
        <li>Authentication providers (e.g. Google, Microsoft) when you use single sign-on</li>
        <li>Integrations (CRMs, calendars, ad platforms) you connect to a Xovera platform</li>
        <li>Analytics and advertising partners, in line with their own policies</li>
      </ul>

      <h2>2. How we use your information</h2>
      <ul>
        <li>To provide and operate our products and services</li>
        <li>To respond to inquiries, schedule calls, and provide customer support</li>
        <li>To process payments and manage your account</li>
        <li>To send transactional messages (account confirmations, security alerts, service updates)</li>
        <li>To send marketing communications when you&rsquo;ve opted in (see Section 4)</li>
        <li>To improve our products, run analytics, and detect fraud or abuse</li>
        <li>To comply with legal obligations</li>
      </ul>
      <p>
        <strong>We do not sell your personal information.</strong>
      </p>

      <h2>3. How we share information</h2>
      <ul>
        <li>
          <strong>Service providers</strong> — companies that help us operate
          (cloud hosting, email delivery, payment processing, analytics, CRM,
          customer support tools). They&rsquo;re bound by contract to use your
          data only on our instructions.
        </li>
        <li>
          <strong>Integration partners</strong> — when you authorize an
          integration (e.g. connecting Xovera AI to your CRM), data flows
          between us and that partner per your configuration.
        </li>
        <li>
          <strong>Legal requirements</strong> — if required by law, regulation,
          or valid legal process, or to protect our rights, users, or the
          public.
        </li>
        <li>
          <strong>Business transfers</strong> — in connection with a merger,
          acquisition, or sale of assets, with continuity of this policy.
        </li>
      </ul>

      <h2>4. Marketing and SMS</h2>
      <p>
        When you opt in, we may send relevant updates by email or SMS. You can
        opt out at any time by replying <strong>STOP</strong> to any SMS or
        clicking <strong>unsubscribe</strong> in any email. Transactional
        messages (account confirmations, service notifications) continue
        regardless of marketing preferences.
      </p>
      <p>
        If you provide a phone number through a form and check the SMS
        marketing opt-in, you&rsquo;re agreeing to receive recurring marketing
        text messages from Xovera. Message frequency varies. Message and
        data rates may apply. Reply <strong>HELP</strong> for help,{" "}
        <strong>STOP</strong> to cancel. Consent is not a condition of
        purchase.
      </p>

      <h2>5. Data security</h2>
      <p>
        We use industry-standard technical and organizational measures to
        protect your data, including encryption in transit (TLS), encryption
        at rest, access controls, and regular security reviews. No system is
        perfectly secure, but we work to minimize risk.
      </p>

      <h2>6. Cookies and tracking</h2>
      <p>We use cookies and similar technologies for:</p>
      <ul>
        <li>Essential site functions (authentication, security, preferences)</li>
        <li>Analytics (understanding how visitors use the site)</li>
        <li>Advertising and remarketing (only with your consent where legally required)</li>
      </ul>
      <p>
        You can control cookies through your browser settings. Disabling
        certain cookies may affect site functionality.
      </p>

      <h2>7. Data retention</h2>
      <p>
        We keep personal data only as long as needed for the purposes
        described, or as required by law. Inactive marketing contacts are
        removed periodically. Customer records are retained for the duration
        of your account plus a reasonable period for legal and accounting
        purposes.
      </p>

      <h2>8. Your rights</h2>
      <p>Depending on where you live, you may have rights to:</p>
      <ul>
        <li><strong>Access</strong> the personal data we hold about you</li>
        <li><strong>Correct</strong> inaccurate information</li>
        <li><strong>Delete</strong> your data, subject to legal exceptions</li>
        <li><strong>Object</strong> to certain processing</li>
        <li><strong>Restrict</strong> or <strong>port</strong> your data</li>
        <li><strong>Withdraw consent</strong> for marketing or other consent-based processing</li>
      </ul>

      <h3>EU and UK (GDPR)</h3>
      <p>
        Xovera acts as a controller for the data described in this policy.
        Lawful bases for processing include performance of a contract,
        legitimate interests, your consent, and legal obligations. You have
        the right to lodge a complaint with your local supervisory authority.
      </p>

      <h3>California (CCPA / CPRA)</h3>
      <p>
        California residents have additional rights, including the right to
        know, delete, and correct personal information; the right to opt out
        of any &ldquo;sale&rdquo; or &ldquo;sharing&rdquo; of personal
        information; and the right to limit use of sensitive personal
        information. We do not sell personal information as defined under
        CCPA. To exercise these rights, email{" "}
        <a href="mailto:privacy@xovera.io">privacy@xovera.io</a>.
      </p>

      <h3>How to exercise your rights</h3>
      <p>
        Email <a href="mailto:privacy@xovera.io">privacy@xovera.io</a>.
        We&rsquo;ll respond within the timeframe required by applicable law.
        We may need to verify your identity before fulfilling certain
        requests.
      </p>

      <h2>9. International transfers</h2>
      <p>
        Xovera operates globally. If you&rsquo;re outside the country where
        our infrastructure is hosted, your data may be transferred to and
        processed in other jurisdictions. We use safeguards such as Standard
        Contractual Clauses when transferring personal data out of the EU or
        UK.
      </p>

      <h2>10. Children</h2>
      <p>
        Our services are not intended for children under 16, and we do not
        knowingly collect data from them. If you believe we&rsquo;ve collected
        information from a child, contact us and we&rsquo;ll delete it.
      </p>

      <h2>11. Changes to this policy</h2>
      <p>
        We may update this policy from time to time. The &ldquo;Last
        updated&rdquo; date at the top reflects the most recent change.
        Significant changes will be communicated through the website or by
        email.
      </p>

      <h2>12. Contact</h2>
      <p>
        Xovera — <a href="mailto:privacy@xovera.io">privacy@xovera.io</a>{" "}
        for privacy questions,{" "}
        <a href="mailto:support@xovera.io">support@xovera.io</a> for
        general inquiries.
      </p>
    </LegalShell>
  );
}
