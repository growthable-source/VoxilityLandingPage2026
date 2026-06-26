import type { Metadata } from "next";
import { LegalShell } from "@/components/sections/LegalShell";

const TITLE = "Acceptable Use Policy — Xovera";
const DESCRIPTION =
  "The rules for using the Xovera AI, Xovera Ads, and Xovera Go software platforms — what's allowed, what isn't, and what you're responsible for as a user.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: "https://xovera.io/acceptable-use" },
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    url: "https://xovera.io/acceptable-use",
    type: "article",
  },
  twitter: { card: "summary_large_image", title: TITLE, description: DESCRIPTION },
};

export default function AcceptableUsePage() {
  return (
    <LegalShell
      title="Acceptable Use Policy"
      lastUpdated="April 27, 2026"
      intro="This Acceptable Use Policy applies to all users of the Xovera software platforms — Xovera AI (app.xovera.io), Xovera Ads (ads.xovera.io), and Xovera Go (go.xovera.io). By accessing or using a Xovera platform, you agree to comply with this Policy."
    >
      <p>
        If you&rsquo;re using Xovera under a Services Agreement, this Policy
        supplements the <a href="/terms">Terms of Service</a>.
      </p>

      <h2>1. Account responsibilities</h2>
      <ul>
        <li>Provide accurate, current information and keep it up to date</li>
        <li>Keep your credentials secure; you&rsquo;re responsible for activity under your account</li>
        <li>Notify us promptly at <a href="mailto:security@xovera.io">security@xovera.io</a> if you suspect unauthorized access</li>
        <li>One person per account login; sharing credentials is not allowed</li>
      </ul>

      <h2>2. Acceptable use</h2>
      <p>
        You may use the platforms only for lawful purposes and in line with
        this Policy. You&rsquo;re responsible for ensuring your use complies
        with all applicable laws, including:
      </p>
      <ul>
        <li>Telecommunications regulations (TCPA, TSR, CAN-SPAM, CASL, GDPR ePrivacy, and equivalent local laws)</li>
        <li>Industry-specific regulations (HIPAA, FDCPA, Fair Lending, etc., where applicable)</li>
        <li>Advertising standards in the jurisdictions where you operate</li>
        <li>Data protection laws applicable to the data you process</li>
      </ul>

      <h2>3. Prohibited conduct</h2>
      <p>You may not use the platforms to:</p>

      <h3>Illegal or harmful activity</h3>
      <ul>
        <li>Violate any law, regulation, or third-party right</li>
        <li>Engage in fraud, deception, or misrepresentation</li>
        <li>Promote hate speech, harassment, or violence</li>
      </ul>

      <h3>Spam and abuse</h3>
      <ul>
        <li>Send unsolicited messages (calls, SMS, email) without proper consent</li>
        <li>Bypass do-not-call lists or opt-out requests</li>
        <li>Use the platforms to deliver spam, robocalls, or other unwanted communications</li>
        <li>Send messages to recipients in jurisdictions where you don&rsquo;t have a legal basis to do so</li>
      </ul>

      <h3>Restricted industries</h3>
      <p>
        Without our prior written consent, you may not use Xovera for:
      </p>
      <ul>
        <li>Adult content, dating, or escort services</li>
        <li>Gambling, lotteries, or sweepstakes</li>
        <li>Cryptocurrency or digital-asset trading or promotion</li>
        <li>Multi-level marketing or pyramid schemes</li>
        <li>Payday lending or high-interest short-term credit</li>
        <li>Firearms, ammunition, or explosives</li>
        <li>Tobacco, vaping, or controlled substances</li>
        <li>Debt collection of consumer debt that violates applicable law</li>
      </ul>

      <h3>Security and integrity</h3>
      <ul>
        <li>Probe, scan, or test the vulnerability of the platforms without authorization</li>
        <li>Circumvent authentication, rate limits, or access controls</li>
        <li>Reverse-engineer, decompile, or disassemble the software</li>
        <li>Introduce malware, viruses, or other harmful code</li>
        <li>Interfere with other users&rsquo; accounts or platform stability</li>
      </ul>

      <h3>Misuse of AI features</h3>
      <ul>
        <li>Impersonate Xovera or a real human in a deceptive way</li>
        <li>Generate content that infringes intellectual property or privacy rights</li>
        <li>Use the AI for high-stakes decisions where human review is legally required</li>
      </ul>

      <h2>4. Content standards</h2>
      <p>Content you upload, generate, or transmit must:</p>
      <ul>
        <li>Belong to you, or be content you have rights to use</li>
        <li>Not infringe intellectual property, privacy, or publicity rights</li>
        <li>Not contain malware or malicious code</li>
        <li>Comply with the prohibited conduct rules above</li>
      </ul>
      <p>
        We reserve the right to remove content that violates this Policy,
        with notice where reasonably possible.
      </p>

      <h2>5. Platform limits</h2>
      <p>
        Each plan includes platform usage limits (call minutes, message
        volume, AI compute, integrations, etc.) as set in your Order Form or
        plan. We reserve the right to throttle or suspend accounts that
        significantly exceed plan limits or impose disproportionate load on
        shared infrastructure.
      </p>

      <h2>6. Suspension and termination</h2>
      <p>
        We may suspend or terminate access if we believe you&rsquo;ve violated
        this Policy or applicable law, or if your activity threatens the
        security, performance, or reputation of the platforms. Where
        reasonably possible, we&rsquo;ll provide notice and an opportunity to
        remedy minor breaches.
      </p>
      <p>
        For serious violations (e.g. spam, fraud, illegal content), we may
        suspend access immediately without notice.
      </p>

      <h2>7. Reporting abuse</h2>
      <p>
        To report abuse, security issues, or copyright infringement, email{" "}
        <a href="mailto:abuse@xovera.io">abuse@xovera.io</a> or{" "}
        <a href="mailto:security@xovera.io">security@xovera.io</a>.
      </p>

      <h2>8. Changes</h2>
      <p>
        We may update this Policy. Material changes take effect 30 days after
        notice.
      </p>

      <h2>9. Contact</h2>
      <p>
        Xovera — <a href="mailto:support@xovera.io">support@xovera.io</a>.
      </p>
    </LegalShell>
  );
}
