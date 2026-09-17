import type { Metadata } from "next";
import { LegalPage, type LegalSection } from "@/components/layout/legal-page";
import { CONTACT_EMAIL, SITE_URL } from "@/lib/content";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description:
    "How Stephens AI LLC handles information from visitors to stephensai.co and from the practices we work with, including our position on patient health information.",
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
          Stephens AI LLC is a Kansas limited liability company. We build
          internal software and AI systems for independent healthcare practices,
          mainly optometry and other owner-run clinics.
        </p>
        <p>
          In this policy, &quot;we,&quot; &quot;us,&quot; and &quot;our&quot;
          mean Stephens AI LLC. &quot;You&quot; means anyone who visits{" "}
          <strong>stephensai.co</strong>, contacts us, or works with us as a
          client.
        </p>
        <p>
          We are the party responsible for the information described here. You
          can reach us any time at{" "}
          <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>.
        </p>
      </>
    ),
  },
  {
    id: "scope",
    heading: "What this policy covers",
    body: (
      <>
        <p>
          This policy covers our public website and our own business records:
          the messages you send us, the calls you book, and the contact details
          we keep for prospective and current clients.
        </p>
        <p>
          <strong>It does not govern the data inside a client engagement.</strong>{" "}
          When we build or operate a system for a practice, the practice remains
          responsible for its own data, and our handling of that data is set by
          the signed agreement between us, including any Business Associate
          Agreement. Where those documents and this policy differ, the signed
          agreement controls.
        </p>
      </>
    ),
  },
  {
    id: "what-we-collect",
    heading: "Information we collect",
    body: (
      <>
        <p>We collect very little. Here is all of it.</p>
        <h3>When you use the contact form</h3>
        <p>
          The form asks for your name, your email address, and your message. All
          three are sent to our own inbox so that a person can reply. Nothing
          else is captured from that form.
        </p>
        <h3>When you book a call</h3>
        <p>
          Our scheduling link is hosted by Calendly. When you book, Calendly
          collects the details you enter there and shares them with us so the
          meeting can be created. Calendly handles that information under its own
          privacy policy.
        </p>
        <h3>When you email us directly</h3>
        <p>
          We keep the correspondence, along with your name, email address, and
          anything you choose to tell us about your practice. This is ordinary
          business record keeping.
        </p>
        <h3>Technical information</h3>
        <ul>
          <li>
            Our contact form counts recent submissions per network address to
            stop automated abuse. That count is held briefly in memory and is
            not written to a database.
          </li>
          <li>
            Our hosting provider records standard server logs, which can include
            an IP address, the page requested, and a timestamp. We use these only
            to keep the site running and secure.
          </li>
        </ul>
      </>
    ),
  },
  {
    id: "what-we-dont-do",
    heading: "What we do not do",
    body: (
      <>
        <p>
          Some of what a privacy policy should say is what is absent. On this
          site:
        </p>
        <ul>
          <li>
            <strong>We do not run analytics or advertising trackers.</strong>{" "}
            There is no Google Analytics, no advertising pixel, and no
            third-party tracking script on our pages.
          </li>
          <li>
            <strong>We do not set tracking cookies.</strong> The site does not
            place advertising or analytics cookies on your device.
          </li>
          <li>
            <strong>We do not sell or rent personal information</strong> to
            anyone, and we do not share it for cross-context behavioral
            advertising.
          </li>
        </ul>
      </>
    ),
  },
  {
    id: "outreach",
    heading: "If we contacted you first",
    body: (
      <>
        <p>
          <strong>We may have found you before you found us.</strong> Like most
          business-to-business firms, we use commercial business-contact
          databases to identify practices that might benefit from what we build.
          That is how a cold email from us would reach you.
        </p>
        <p>
          What that involves is business contact information: a name, a role, a
          work email address, and the practice itself. We do not build profiles
          of individuals, we do not combine that information with anything that
          happens on this website, and we do not buy or use personal or consumer
          data for outreach.
        </p>
        <p>
          <strong>One reply asking us to stop ends it permanently.</strong> You
          can also email{" "}
          <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a> and ask us to
          delete your details, and we will.
        </p>
      </>
    ),
  },
  {
    id: "how-we-use",
    heading: "How we use information",
    body: (
      <>
        <p>We use what we collect to:</p>
        <ul>
          <li>Reply to your message and answer your questions</li>
          <li>Schedule and hold calls</li>
          <li>Prepare proposals and deliver work you have engaged us for</li>
          <li>Send invoices and keep our accounting and tax records</li>
          <li>Keep the website secure and working</li>
          <li>Meet our legal obligations</li>
        </ul>
        <p>
          The next sentence is for readers in Europe and the UK and uses their
          legal vocabulary. Where a legal basis for processing is required, we
          rely on your consent when you contact us, on the performance of a
          contract when we are delivering work, and on our legitimate interest in
          running and securing a small business.
        </p>
        <p>
          We do not send marketing newsletters from this site. If that ever
          changes, it will be something you opt into, and every message will have
          an unsubscribe link.
        </p>
      </>
    ),
  },
  {
    id: "providers",
    heading: "Service providers we rely on",
    body: (
      <>
        <p>
          We are a two-person firm and we use established providers rather than
          running our own infrastructure. Each one only receives what it needs to
          do its job.
        </p>
        <table>
          <thead>
            <tr>
              <th>Provider</th>
              <th>What it does for us</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Vercel</td>
              <td>Hosts this website and records standard server logs</td>
            </tr>
            <tr>
              <td>Resend</td>
              <td>Delivers contact form submissions to our inbox</td>
            </tr>
            <tr>
              <td>Google Workspace</td>
              <td>Our email, calendar, and document storage</td>
            </tr>
            <tr>
              <td>Calendly</td>
              <td>Scheduling, when you book a call</td>
            </tr>
            <tr>
              <td>Anthropic and Amazon Web Services</td>
              <td>
                The models behind the systems we build. See the section on AI
                below
              </td>
            </tr>
          </tbody>
        </table>
        <p>
          We may also disclose information when the law requires it, to protect
          our rights or someone&apos;s safety, or to a successor if the business
          is ever sold or reorganized.
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
            Do not send patient information through this website, the contact
            form, or ordinary email.
          </strong>{" "}
          None of those channels is an appropriate place for protected health
          information, and we do not want to receive it that way. If you send it
          anyway, we will delete it and ask you to use a secure channel.
        </p>
        <h3>How we work with practices</h3>
        <p>
          Most of what we build is designed so that patient information never
          reaches it. Front desk knowledge bases, staff training material,
          scheduling rules, bookkeeping, and vendor invoice handling can all be
          built without touching a patient record, and that is our default.
        </p>
        <h3>We sign a BAA with every healthcare client</h3>
        <p>
          <strong>
            We sign a Business Associate Agreement with every healthcare
            practice we work with, before the work starts, whether or not we
            expect patient information to be involved.
          </strong>{" "}
          We would rather have it and not need it.
        </p>
        <p>
          When an engagement genuinely does involve protected health
          information, two more things are true before any of it moves:
        </p>
        <ol>
          <li>
            The system runs inside the practice&apos;s own cloud account, under
            the agreement between the practice and that cloud provider, rather
            than on infrastructure we own. We hold a key scoped to only the
            actions the system performs, never full administrator access, and
            you can revoke it at any time.
          </li>
          <li>
            The AI services involved are configured so the data is not retained
            by the provider after the request is answered, and is not used to
            train models.
          </li>
        </ol>
        <p>
          We do not claim to be a certified or accredited compliance vendor,
          because no such certification exists. HIPAA has no certifying body,
          and any vendor calling itself &quot;HIPAA certified&quot; is
          describing a marketing badge, not a legal status. What we can do is
          describe our architecture plainly so a practice and its advisors can
          judge it for themselves.
        </p>
      </>
    ),
  },
  {
    id: "ai",
    heading: "How we use AI with your information",
    body: (
      <>
        <p>
          AI is what we build with, so it deserves a direct answer rather than a
          vague one.
        </p>
        <ul>
          <li>
            <strong>We do not build or train AI models on your data.</strong> We
            are not creating a model out of your documents, your messages, or
            your practice.
          </li>
          <li>
            <strong>
              The systems we build and operate for clients run on commercial and
              enterprise service tiers whose terms do not permit the provider to
              train on the data we send.
            </strong>{" "}
            Where a system handles sensitive material, we configure it so the
            provider retains nothing once a request is answered.
          </li>
          <li>
            <strong>
              A person approves anything that changes a record, sends a message,
              moves money, or leaves your building.
            </strong>{" "}
            We tell you which steps those are before a system goes live.
          </li>
          <li>
            <strong>
              We will not add or change an AI provider that touches client data
              without telling affected clients first.
            </strong>
          </li>
        </ul>
      </>
    ),
  },
  {
    id: "retention",
    heading: "How long we keep information",
    body: (
      <>
        <ul>
          <li>
            <strong>Inquiries that do not become engagements:</strong> we keep
            the correspondence while it is still commercially useful, generally
            no more than two years, and delete it when it is not.
          </li>
          <li>
            <strong>Client records:</strong> kept for the life of the engagement
            and afterwards for as long as we need them for warranty, tax, and
            legal purposes, generally seven years for financial records.
          </li>
          <li>
            <strong>Server logs:</strong> retained on our hosting provider&apos;s
            standard schedule, which is a short rolling window.
          </li>
        </ul>
        <p>You can ask us to delete your information sooner. See your rights below.</p>
      </>
    ),
  },
  {
    id: "security",
    heading: "How we protect information",
    body: (
      <>
        <p>
          The site is served over an encrypted connection. We use multi-factor
          authentication where it is available, and we follow least-privilege
          access: where a system we build needs credentials, we scope them to the
          specific actions that system performs rather than granting broad
          administrator access.
        </p>
        <h3>Who can see your systems</h3>
        <p>
          <strong>
            Stephens AI is two people, and no one else has access to client
            systems.
          </strong>{" "}
          We do not use subcontractors, offshore staff, or an outsourced support
          desk. We are currently based in the United States and in Asia, so
          access happens from both locations over encrypted connections. If that
          ever changes, we will tell affected clients before it does, not after.
        </p>
        <p>
          No method of transmission or storage is perfectly secure, and we will
          not pretend otherwise. If a breach ever affects your information, we
          will tell you and any required authority as promptly as the law
          requires.
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
          Whatever jurisdiction you are in, you can ask us to show you what we
          hold about you, correct it, or delete it. Email{" "}
          <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a> and we will
          respond within 30 days.
        </p>
        <h3>California residents</h3>
        <p>
          You have the right to know what personal information we collect and how
          we use it, to request deletion or correction, and not to be
          discriminated against for exercising those rights. We do not sell or
          share personal information as those terms are defined under California
          law, so there is nothing to opt out of.
        </p>
        <h3>Residents of the EEA and the UK</h3>
        <p>
          You have the right to access, correct, erase, restrict, or object to
          our processing of your personal data, and the right to data
          portability. Where we rely on consent, you may withdraw it at any time.
          You may also lodge a complaint with your local supervisory authority.
        </p>
      </>
    ),
  },
  {
    id: "international",
    heading: "International visitors",
    body: (
      <>
        <p>
          We are a United States company and our service providers are primarily
          in the United States, so your information is stored and handled there.
          Because our two founders are currently based in the United States and
          in Asia, your information may also be accessed from Asia. If you
          contact us from outside the United States, privacy laws where your data
          is handled may differ from those in your own country. By contacting us
          you understand that this is necessary for us to reply to you.
        </p>
      </>
    ),
  },
  {
    id: "children",
    heading: "Children",
    body: (
      <p>
        This is a business-to-business website. It is not directed to children,
        and we do not knowingly collect information from anyone under 16. If you
        believe a child has sent us information, email us and we will delete it.
      </p>
    ),
  },
  {
    id: "changes",
    heading: "Changes to this policy",
    body: (
      <p>
        We will update this page when our practices change, and we will move the
        date at the top when we do. If a change materially affects how we handle
        information for an existing client, we will tell that client directly
        rather than relying on you to notice a website edit.
      </p>
    ),
  },
  {
    id: "contact",
    heading: "Contact us",
    body: (
      <>
        <p>
          Questions, requests, or concerns about this policy can go to a real
          person:
        </p>
        <p>
          <strong>Stephens AI LLC</strong>
          <br />
          A Kansas limited liability company
          <br />
          <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>
        </p>
      </>
    ),
  },
];

export default function PrivacyPage() {
  return (
    <LegalPage
      title="Privacy Policy"
      summary="We collect almost nothing on this website, we run no trackers, and we never want patient information in our inbox. Here is exactly what we hold, why we hold it, and how to make us delete it."
      sections={sections}
    />
  );
}
