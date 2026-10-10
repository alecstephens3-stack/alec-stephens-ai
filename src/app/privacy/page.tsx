import type { Metadata } from "next";
import { LegalPage, type LegalSection } from "@/components/layout/legal-page";
import { CONTACT_EMAIL, CONTACT_EMAIL_JUSHEEN, SITE_URL } from "@/lib/content";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description:
    "How Stephens AI LLC collects, uses, and protects information from visitors to stephensai.co and from the practices we work with, including our use of AI tools and our handling of patient information.",
  alternates: { canonical: `${SITE_URL}/privacy` },
  robots: { index: true, follow: true },
};

const sections: LegalSection[] = [
  {
    id: "who-we-are",
    heading: "Who we are",
    body: (
      <>
        <p>
          Stephens AI LLC is a Kansas limited liability company that builds
          software and AI systems for businesses, with a focus on independent
          healthcare practices. In this policy, &quot;Stephens AI,&quot;
          &quot;we,&quot; &quot;us,&quot; and &quot;our&quot; refer to Stephens
          AI LLC.
          &quot;You&quot; refers to any visitor to <strong>stephensai.co</strong>,
          anyone who contacts us, and any client we work with.
        </p>
        <p>
          Stephens AI is the party responsible for the information described in
          this policy. Contact details are provided at the end of this page.
        </p>
      </>
    ),
  },
  {
    id: "scope",
    heading: "Scope of this policy",
    body: (
      <>
        <p>
          This policy applies to our public website and to our own business
          records: messages sent to us, calls booked with us, and the contact
          information we keep for prospective and current clients.
        </p>
        <p>
          <strong>
            It does not govern the data handled within a client engagement.
          </strong>{" "}
          When we build or operate a system for a practice, the practice remains
          the owner of and responsible party for its data. Our handling of that
          data is governed by the signed agreement between us, including any
          Business Associate Agreement. Where a signed agreement and this policy
          differ, the signed agreement controls.
        </p>
      </>
    ),
  },
  {
    id: "what-we-collect",
    heading: "Information we collect",
    body: (
      <>
        <p>We collect only the information described below.</p>
        <h3>Contact form</h3>
        <p>
          The contact form asks for your name, your email address, and your
          message. These are delivered to our business email so that we can
          reply. No other information is captured by the form.
        </p>
        <h3>Scheduling</h3>
        <p>
          Our scheduling link is hosted by Calendly. When you book a call,
          Calendly collects the details you enter and shares them with us so the
          meeting can be created. Calendly processes that information under its
          own privacy policy.
        </p>
        <h3>Direct correspondence</h3>
        <p>
          When you email us, we retain the correspondence, including your name,
          email address, and any information you provide about your practice, as
          part of our ordinary business records.
        </p>
        <h3>Technical information</h3>
        <ul>
          <li>
            The contact form counts recent submissions per network address in
            order to limit automated abuse. This count is held briefly in memory
            and is not written to a database.
          </li>
          <li>
            Our hosting provider records standard server logs, which may include
            an IP address, the page requested, and a timestamp. We use these
            logs only to operate and secure the site.
          </li>
        </ul>
      </>
    ),
  },
  {
    id: "what-we-dont-collect",
    heading: "Information we do not collect",
    body: (
      <>
        <p>At present, the following do not apply to this website:</p>
        <ul>
          <li>
            <strong>Analytics and advertising trackers.</strong> The site does
            not use Google Analytics, advertising pixels, or third-party tracking
            scripts.
          </li>
          <li>
            <strong>Tracking cookies.</strong> The site does not place
            advertising or analytics cookies on your device.
          </li>
          <li>
            <strong>Sale of personal information.</strong> We do not sell or rent
            personal information, and we do not share it for cross-context
            behavioral advertising.
          </li>
        </ul>
      </>
    ),
  },
  {
    id: "outreach",
    heading: "Business contact information and outreach",
    body: (
      <>
        <p>
          Like most business-to-business firms, we use commercial
          business-contact databases and publicly available information, such
          as a practice&apos;s website and professional profiles, to identify
          practices that may benefit from our services and to tailor our
          messages to them. We may contact those practices by email, phone, or
          professional networks.
        </p>
        <p>
          If you do not wish to receive further contact from us, reply to any
          message or email{" "}
          <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>, and we will
          stop contacting you.
        </p>
      </>
    ),
  },
  {
    id: "how-we-use",
    heading: "How we use information",
    body: (
      <>
        <p>We use the information we collect to:</p>
        <ul>
          <li>Respond to inquiries</li>
          <li>Schedule and conduct calls</li>
          <li>Prepare proposals and deliver contracted services</li>
          <li>Issue invoices and maintain accounting and tax records</li>
          <li>Operate and secure the website</li>
          <li>Comply with legal obligations</li>
        </ul>
        <p>
          For readers in jurisdictions that require a legal basis for
          processing, we rely on your consent when you contact us, on the
          performance of a contract when we deliver services, and on our
          legitimate interest in operating and securing our business.
        </p>
        <p>
          Any marketing email we send includes a way to unsubscribe.
        </p>
      </>
    ),
  },
  {
    id: "providers",
    heading: "Service providers",
    body: (
      <>
        <p>
          We use established third-party providers to operate our business. Each
          receives only the information necessary to perform its function. They
          include the following, and the list changes as our business does.
        </p>
        <table>
          <thead>
            <tr>
              <th>Provider</th>
              <th>Function</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Vercel</td>
              <td>Website hosting and server logs</td>
            </tr>
            <tr>
              <td>Resend</td>
              <td>Delivery of contact form submissions</td>
            </tr>
            <tr>
              <td>Google Workspace</td>
              <td>Email, calendar, and document storage</td>
            </tr>
            <tr>
              <td>Calendly</td>
              <td>Scheduling</td>
            </tr>
            <tr>
              <td>Fathom</td>
              <td>Call recording and notes</td>
            </tr>
            <tr>
              <td>Business-contact databases and email platforms</td>
              <td>Identifying practices and sending outreach</td>
            </tr>
            <tr>
              <td>Anthropic, OpenAI, and Amazon Web Services</td>
              <td>AI services, as described in the following section</td>
            </tr>
          </tbody>
        </table>
        <p>
          We may also disclose information where required by law, to protect our
          rights or the safety of any person, or to a successor in connection
          with a sale or reorganization of the business.
        </p>
      </>
    ),
  },
  {
    id: "ai",
    heading: "Use of AI tools",
    body: (
      <>
        <p>
          Artificial intelligence tools are part of how we perform our work. We
          use services from providers including Anthropic, OpenAI, and Amazon
          Web Services to draft, analyze, write software, and operate the
          systems we build. Information you share with us, including business
          information about your practice, may be processed by these tools in the
          course of our work.
        </p>
        <ul>
          <li>
            <strong>
              We do not train or fine-tune AI models on your information,
            </strong>{" "}
            and we do not authorize any provider to do so on our behalf.
          </li>
          <li>
            <strong>
              We select providers, service tiers, and account settings intended
              to keep client information out of model training.
            </strong>{" "}
            Systems we build and operate for clients run on commercial or
            enterprise services whose terms prohibit the provider from training
            on the data we submit.
          </li>
          <li>
            <strong>
              Protected health information is processed by AI tools only under a
              Business Associate Agreement,
            </strong>{" "}
            as described in the following section.
          </li>
          <li>
            <strong>We treat AI output as a draft subject to review.</strong>{" "}
            Where an error would have consequences, we recommend that a person
            reviews the output before it takes effect.
          </li>
          <li>
            <strong>
              We will tell you which AI providers a system we build for you uses,
            </strong>{" "}
            on request.
          </li>
        </ul>
        <p>
          By engaging Stephens AI, you consent to our use of these tools in
          delivering our services.
        </p>
      </>
    ),
  },
  {
    id: "phi",
    heading: "Patient information",
    body: (
      <>
        <p>
          <strong>
            Do not send protected health information through this website or
            its contact form.
          </strong>{" "}
          Clients share patient information with us only as their Business
          Associate Agreement provides.
        </p>
        <h3>Business Associate Agreements</h3>
        <p>
          <strong>
            We sign a Business Associate Agreement with every healthcare
            practice we work with, before work begins, whether or not we expect
            protected health information to be involved.
          </strong>{" "}
          That agreement governs how patient information is used, where it is
          processed and stored, and how it is returned or destroyed. AI services
          that process patient information do so under a Business Associate
          Agreement and do not use it for model training.
        </p>
        <p>
          There is no government or industry certification for HIPAA compliance,
          and we do not claim one. We describe our practices so that a practice
          and its advisors can evaluate them directly.
        </p>
      </>
    ),
  },
  {
    id: "retention",
    heading: "Data retention",
    body: (
      <>
        <ul>
          <li>
            <strong>Inquiries that do not become engagements:</strong> retained
            while commercially useful, generally no longer than two years, and
            deleted thereafter.
          </li>
          <li>
            <strong>Client records:</strong> retained for the duration of the
            engagement and afterward as required for warranty, tax, and legal
            purposes, generally seven years for financial records.
          </li>
          <li>
            <strong>Server logs:</strong> retained according to our hosting
            provider&apos;s standard schedule.
          </li>
        </ul>
        <p>
          You may request earlier deletion of your information as described
          under Your rights and choices.
        </p>
      </>
    ),
  },
  {
    id: "security",
    heading: "Security",
    body: (
      <>
        <p>
          The website is served over an encrypted connection, and we use
          multi-factor authentication where available. Where a system we build
          operates within your own accounts, the access it uses is granted by
          you and may be modified or withdrawn by you at any time.
        </p>
        <h3>Access to client systems</h3>
        <p>
          Access to client systems is limited to Stephens AI personnel and
          service providers who need it for the work. Our team works remotely,
          including from Asia, and access occurs over encrypted connections.
        </p>
        <p>
          No method of transmission or storage is completely secure. If a
          security incident affects your information, we will notify you and any
          required authority as required by applicable law.
        </p>
      </>
    ),
  },
  {
    id: "your-rights",
    heading: "Your rights and choices",
    body: (
      <>
        <p>
          You may request access to, correction of, or deletion of the personal
          information we hold about you by emailing{" "}
          <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>. We will
          respond within 30 days.
        </p>
        <h3>California residents</h3>
        <p>
          You have the right to know what personal information we collect and
          how it is used, to request its deletion or correction, and not to be
          discriminated against for exercising these rights. We do not sell or
          share personal information as those terms are defined under California
          law.
        </p>
        <h3>Residents of the European Economic Area and the United Kingdom</h3>
        <p>
          You have the right to access, correct, erase, restrict, or object to
          the processing of your personal data, and the right to data
          portability. Where processing is based on consent, you may withdraw
          that consent at any time. You may also lodge a complaint with your
          supervisory authority.
        </p>
      </>
    ),
  },
  {
    id: "international",
    heading: "International data transfers",
    body: (
      <p>
        Stephens AI is a United States company, and our service providers are
        primarily located in the United States, where your information is
        stored and processed. Because our team works remotely, including from
        Asia, your information may also be accessed from Asia. If
        you contact us from outside the United States, the privacy laws of the
        jurisdictions where your information is handled may differ from those
        of your own. By contacting us, you acknowledge that this transfer is
        necessary for us to respond.
      </p>
    ),
  },
  {
    id: "children",
    heading: "Children",
    body: (
      <p>
        This website is intended for businesses. It is not directed to children,
        and we do not knowingly collect information from anyone under the age of
        16. If you believe a child has provided information to us, contact us and
        we will delete it.
      </p>
    ),
  },
  {
    id: "changes",
    heading: "Changes to this policy",
    body: (
      <p>
        We may update this policy from time to time. The date at the top of this
        page reflects the most recent revision. Where a change materially affects
        how we handle information for an existing client, we will notify that
        client directly.
      </p>
    ),
  },
  {
    id: "contact",
    heading: "Contact",
    body: (
      <>
        <p>
          Questions or requests regarding this policy may be directed to either
          founder:
        </p>
        <p>
          <strong>Stephens AI LLC</strong>
          <br />
          A Kansas limited liability company
          <br />
          Alec Stephens, Co-founder:{" "}
          <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>
          <br />
          Jusheen Kim, Co-founder:{" "}
          <a href={`mailto:${CONTACT_EMAIL_JUSHEEN}`}>{CONTACT_EMAIL_JUSHEEN}</a>
        </p>
      </>
    ),
  },
];

export default function PrivacyPage() {
  return (
    <LegalPage
      title="Privacy Policy"
      summary="This policy describes what information Stephens AI LLC collects through this website and in the course of our business, how we use it, how we use AI tools, and how we handle patient information."
      sections={sections}
    />
  );
}
