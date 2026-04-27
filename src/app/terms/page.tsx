import type { Metadata } from "next";
import { LegalShell } from "@/components/sections/LegalShell";

const TITLE = "Terms of Service — Voxility";
const DESCRIPTION =
  "Terms governing the marketing services and software platforms provided by Voxility, including Voxility AI, Voxility Ads, and Voxility Go.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: "https://voxility.com/terms" },
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    url: "https://voxility.com/terms",
    type: "article",
  },
  twitter: { card: "summary_large_image", title: TITLE, description: DESCRIPTION },
};

export default function TermsPage() {
  return (
    <LegalShell
      title="Terms of Service"
      lastUpdated="April 27, 2026"
      intro="These Terms govern your use of Voxility's marketing services and software platforms (Voxility AI, Voxility Ads, and Voxility Go). By signing an order form or accessing the platforms, you agree to these Terms."
    >
      <p>
        These Terms work together with any signed Order Form or Services
        Agreement (together, the &ldquo;Agreement&rdquo;). In case of
        conflict, the signed Order Form controls.
      </p>

      <h2>1. Services</h2>
      <p>
        <strong>Marketing services.</strong> Voxility provides the marketing
        services described in your Order Form, which may include paid
        advertising management (Meta, Google), landing page design and
        hosting, conversion analytics, and integration setup.
      </p>
      <p>
        <strong>Software platforms.</strong> Voxility AI, Voxility Ads, and
        Voxility Go are software-as-a-service products. Your use of each
        platform is also governed by our{" "}
        <a href="/acceptable-use">Acceptable Use Policy</a>.
      </p>
      <p>
        <strong>Voxility Go (whitelabel).</strong> Voxility Go is a whitelabel
        of GoHighLevel. By using Voxility Go, you also agree to GoHighLevel&rsquo;s
        applicable terms.
      </p>

      <h2>2. Fees and payment</h2>
      <p>You&rsquo;ll pay the fees set out in your Order Form. Unless otherwise stated:</p>
      <ul>
        <li>Fees are charged monthly in advance</li>
        <li>Ad spend is billed separately and passed through at cost (or per Order Form)</li>
        <li>Invoices are due on receipt; late payments may accrue interest at the lesser of 1.5% per month or the maximum permitted by law</li>
        <li>Fees are non-refundable except as required by law or as expressly stated in the Order Form</li>
      </ul>

      <h2>3. Term and termination</h2>
      <p>
        <strong>Term.</strong> The Agreement begins on the start date in the
        Order Form and continues until terminated.
      </p>
      <p>
        <strong>Initial commitment.</strong> Many Order Forms include an
        initial commitment period (typically 90 days) so the system has time
        to compound. After that, the Agreement is month-to-month.
      </p>
      <p>
        <strong>Termination.</strong> Either party may terminate with 30
        days&rsquo; written notice after the initial commitment period. We
        may suspend or terminate immediately for unpaid fees, breach of these
        Terms, or risk to our infrastructure or other customers.
      </p>
      <p>
        <strong>Effect of termination.</strong> Upon termination:
      </p>
      <ul>
        <li>You retain ownership of your data, contact records, phone numbers, and creative assets</li>
        <li>We&rsquo;ll provide a clean export of your records within a reasonable period</li>
        <li>Outstanding fees become immediately due</li>
      </ul>

      <h2>4. Customer responsibilities</h2>
      <p>You agree to:</p>
      <ul>
        <li>Provide accurate information and reasonable cooperation to enable our services</li>
        <li>Comply with all applicable laws (advertising standards, telecommunications laws, healthcare or financial regulations relevant to your industry, etc.)</li>
        <li>Maintain ownership of, and rights to, any content, data, or assets you provide</li>
        <li>Use our platforms in accordance with the <a href="/acceptable-use">Acceptable Use Policy</a></li>
      </ul>
      <p>
        You&rsquo;re responsible for the content of your own ads, landing
        pages, and customer communications, including TCPA, CAN-SPAM, and
        similar compliance.
      </p>

      <h2>5. Voxility responsibilities</h2>
      <ul>
        <li>Perform services with reasonable care and professional skill</li>
        <li>Keep your data confidential and secure (subject to our <a href="/privacy">Privacy Policy</a>)</li>
        <li>Provide reasonable support during business hours, with senior contact for material issues</li>
        <li>Make reasonable efforts to maintain platform availability; specific uptime SLAs apply only when committed in your Order Form</li>
      </ul>

      <h2>6. Intellectual property</h2>
      <p>
        <strong>Your content.</strong> You retain all rights to data, contact
        records, brand assets, ad creative, and other content you provide.
        You grant us a license to use it solely to provide the services.
      </p>
      <p>
        <strong>Our IP.</strong> Voxility retains all rights to our software
        platforms, source code, infrastructure, methodologies, and any work
        product or improvements we develop in the course of providing
        services.
      </p>
      <p>
        <strong>Deliverables.</strong> Specific deliverables described in
        your Order Form (e.g. custom landing pages, configured workflows) are
        licensed to you for use during the term of the Agreement.
      </p>

      <h2>7. Confidentiality</h2>
      <p>
        Each party will protect the other&rsquo;s confidential information
        using the same care it uses for its own (and at minimum, reasonable
        care). Confidential information may be disclosed only as needed to
        perform the Agreement or as required by law.
      </p>

      <h2>8. Warranties and disclaimers</h2>
      <p>
        We warrant that we&rsquo;ll perform services with reasonable care.
        <strong>
          {" "}
          Except as expressly stated, our services are provided &ldquo;as
          is&rdquo;, without warranties of any kind, express or implied,
          including merchantability, fitness for a particular purpose, and
          non-infringement.
        </strong>{" "}
        Outcomes of marketing services depend on many factors outside our
        control (your industry, market conditions, ad-platform changes, etc.)
        — we don&rsquo;t guarantee specific results.
      </p>

      <h2>9. Limitation of liability</h2>
      <p>To the maximum extent permitted by law:</p>
      <ul>
        <li>Neither party is liable for indirect, incidental, consequential, or punitive damages, lost profits, or lost data, even if advised of the possibility</li>
        <li>Our total aggregate liability for any claim is limited to the fees paid by you to Voxility in the 12 months preceding the claim</li>
        <li>Nothing in this section limits liability for fraud, willful misconduct, or matters that cannot be limited under applicable law</li>
      </ul>

      <h2>10. Indemnification</h2>
      <p>
        You&rsquo;ll indemnify Voxility against claims arising from your
        content, your end-customer interactions, your breach of law, or your
        breach of these Terms. Voxility will indemnify you against
        third-party claims that our services infringe intellectual property
        rights, subject to standard exceptions.
      </p>

      <h2>11. Governing law</h2>
      <p>
        These Terms are governed by the laws of [STATE / JURISDICTION — to be
        set]. Disputes will be resolved in the courts of [JURISDICTION]
        unless the parties agree otherwise.
      </p>

      <h2>12. General</h2>
      <ul>
        <li><strong>Assignment.</strong> Neither party may assign without consent, except in connection with a merger or sale of substantially all assets.</li>
        <li><strong>Entire agreement.</strong> The Order Form and these Terms (together with the Privacy Policy and Acceptable Use Policy) form the entire agreement.</li>
        <li><strong>Modifications.</strong> We may update these Terms; material changes take effect 30 days after notice.</li>
        <li><strong>Severability.</strong> If any provision is unenforceable, the rest remains in effect.</li>
        <li><strong>Notices.</strong> Sent to the email addresses on the Order Form unless otherwise specified.</li>
      </ul>

      <h2>13. Contact</h2>
      <p>
        Voxility — <a href="mailto:legal@voxility.com">legal@voxility.com</a>.
      </p>
    </LegalShell>
  );
}
