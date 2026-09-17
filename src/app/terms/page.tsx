import type { Metadata } from "next";
import { LegalPage, type LegalSection } from "@/components/layout/legal-page";
import { CONTACT_EMAIL, SITE_URL } from "@/lib/content";

export const metadata: Metadata = {
  title: "Terms of Service",
  description:
    "The terms for using stephensai.co and for engaging Stephens AI LLC: how proposals, payment, ownership of the work, support, and liability are handled.",
  alternates: { canonical: `${SITE_URL}/terms` },
  robots: { index: true, follow: true },
};

const sections: LegalSection[] = [
  {
    id: "agreement",
    heading: "Agreement to these terms",
    body: (
      <>
        <p>
          These terms apply when you use <strong>stephensai.co</strong> and when
          you engage Stephens AI LLC to do work. By using the site or accepting a
          proposal from us, you agree to them.
        </p>
        <p>
          If you are agreeing on behalf of a practice or company, you confirm you
          have the authority to bind it, and &quot;you&quot; means that
          organization.
        </p>
      </>
    ),
  },
  {
    id: "who-we-are",
    heading: "Who we are",
    body: (
      <p>
        Stephens AI LLC is a Kansas limited liability company. We build internal
        software and AI systems for independent healthcare practices. In these
        terms, &quot;we,&quot; &quot;us,&quot; and &quot;our&quot; mean Stephens
        AI LLC.
      </p>
    ),
  },
  {
    id: "website",
    heading: "Using this website",
    body: (
      <>
        <p>
          You may read, share, and reference this site freely. The text, design,
          diagrams, and case material on it belong to us, and you may not
          republish substantial portions as your own work.
        </p>
        <p>Please do not:</p>
        <ul>
          <li>Attempt to break, overload, or gain unauthorized access to the site</li>
          <li>Scrape it in a way that degrades service for anyone else</li>
          <li>Use the contact form to send bulk, automated, or unsolicited commercial messages</li>
          <li>Send us patient information or other regulated data through the site</li>
        </ul>
        <p>
          The site describes what we build and roughly what it costs. Nothing on
          it is an offer that binds us. A price becomes real when it is in a
          written proposal signed by both sides.
        </p>
      </>
    ),
  },
  {
    id: "engagements",
    heading: "How engagements work",
    body: (
      <>
        <p>Our work follows a consistent path:</p>
        <ol>
          <li>A short qualifying call, at no cost</li>
          <li>A written proposal describing the scope, the deliverables, the price, and the timeline</li>
          <li>A discovery call once the proposal is accepted</li>
          <li>The build</li>
          <li>A live demonstration, setup, and a recorded walkthrough</li>
          <li>A support window after delivery</li>
        </ol>
        <h3>The proposal controls</h3>
        <p>
          <strong>
            Where a signed proposal, statement of work, or Business Associate
            Agreement says something different from this page, that document
            wins.
          </strong>{" "}
          These terms fill the gaps; they do not override what we specifically
          agreed with you in writing.
        </p>
        <h3>Changes to scope</h3>
        <p>
          Work outside the agreed scope is quoted separately before it starts. We
          will not quietly expand a project and invoice you for it afterward, and
          we will not absorb material new work without telling you what it costs.
        </p>
        <h3>Timelines</h3>
        <p>
          Dates in a proposal are our honest estimate and depend on getting
          timely access, approvals, and answers from your side. Delays caused by
          waiting on access or decisions move the schedule accordingly.
        </p>
      </>
    ),
  },
  {
    id: "fees",
    heading: "Fees and payment",
    body: (
      <>
        <ul>
          <li>
            <strong>Project work is fixed price.</strong> The proposal states the
            amount and the payment schedule. We price the project, not the hours,
            unless a proposal says otherwise.
          </li>
          <li>
            <strong>Ongoing support is billed monthly</strong> at the rate in the
            proposal and continues until either side ends it.
          </li>
          <li>
            <strong>Invoices are due on the terms stated on the invoice.</strong>{" "}
            If an invoice is past due, we may pause work after giving you
            notice.
          </li>
          <li>
            <strong>Fees do not include third-party costs.</strong> Software
            subscriptions, cloud usage, and similar charges are billed to your
            own accounts and are yours to pay.
          </li>
          <li>
            <strong>Prices exclude taxes.</strong> Any applicable taxes are
            yours, other than taxes on our income.
          </li>
        </ul>
      </>
    ),
  },
  {
    id: "your-side",
    heading: "What we need from you",
    body: (
      <>
        <p>
          Our work depends on things only you can provide. You agree to give us,
          within a reasonable time:
        </p>
        <ul>
          <li>Accurate information about how your practice actually operates</li>
          <li>The access and permissions the work requires</li>
          <li>A named person who can make decisions and give approvals</li>
          <li>Review of deliverables when we hand them over</li>
        </ul>
        <p>
          You are responsible for the accuracy and legality of the material you
          give us, and for having the right to give it to us.
        </p>
      </>
    ),
  },
  {
    id: "third-party",
    heading: "Third-party services and accounts",
    body: (
      <>
        <p>
          The systems we build run either on services you own, such as your cloud
          account, your email platform, or your accounting product, or on
          infrastructure we operate on your behalf where no patient information is
          involved. A front desk knowledge base is an example of the second kind:
          your content sits in a database we manage for you, none of it is patient
          information, and you can export all of it at any time.{" "}
          <strong>
            Before you commit to anything we tell you which of the two it is and
            where your content lives.
          </strong>
        </p>
        <ul>
          <li>
            Those accounts stay in your name, under your control, and under those
            vendors&apos; terms.
          </li>
          <li>
            We are not responsible for a third-party vendor&apos;s outage, price
            change, policy change, or discontinuation of a product.
          </li>
          <li>
            If a vendor changes something that breaks your system, we will tell
            you what it takes to fix it. Your support agreement, if you have one,
            states what it covers. Anything beyond that, and any change that means
            rebuilding part of the system, is quoted before we start.
          </li>
        </ul>
        <p>
          We tell you what a system depends on before you commit to it.
        </p>
      </>
    ),
  },
  {
    id: "ai-limits",
    heading: "What AI systems can and cannot do",
    body: (
      <>
        <ul>
          <li>
            <strong>AI systems make mistakes.</strong> Language models can
            produce output that is wrong while appearing confident. Anyone who
            tells you otherwise is selling something.
          </li>
          <li>
            <strong>We design for review, not autonomy.</strong> Where an error
            would matter, we build a step where a person checks the work before
            it takes effect. That step is part of the product, not an optional
            extra. If you ever want it removed, we will tell you what we think and
            document the decision, but it is your call to make.
          </li>
          <li>
            <strong>We do not guarantee specific business outcomes.</strong> We
            can tell you exactly what a system does, show you it working on your
            own data, and warrant that it does what the proposal says. What we
            will not put in a contract is a number we do not control: a
            particular amount of revenue, time saved, or staff hours reduced.
            Those depend on the system and on how your team adopts it. If a
            system is not doing what the proposal said it does, that is ours to
            fix under the warranty below, not a limitation of AI.
          </li>
          <li>
            <strong>Nothing we build is professional advice.</strong> Our systems
            do not provide medical, legal, tax, or accounting advice, and must
            not be used as a substitute for a qualified professional or for
            clinical judgment.
          </li>
        </ul>
      </>
    ),
  },
  {
    id: "ownership",
    heading: "Ownership of the work",
    body: (
      <>
        <h3>What you own</h3>
        <p>
          <strong>
            Once you have paid in full, the deliverables built specifically for
            you are yours.
          </strong>{" "}
          That includes the custom code, configuration, written content, and
          documentation produced for your engagement.
        </p>
        <p>
          <strong>Your data is yours at all times.</strong> You can export it in
          a standard format during the engagement or after it ends, and we do not
          charge for an export. Where a system stores content we manage for you, we
          give you a way to get it out.
        </p>
        <h3>What we keep</h3>
        <p>
          We keep ownership of the general tools, templates, patterns, and
          know-how we bring with us or develop along the way. This never includes
          your content, your data, your configuration, your pricing, your
          procedures, or anything specific to how your practice runs. Where our
          pre-existing material is embedded in your deliverable, you get a
          perpetual, non-exclusive license to use it as part of that deliverable.
        </p>
        <h3>There is no lock-in</h3>
        <p>
          There is no long-term contract on a build. A monthly support agreement
          is month to month and either side can end it with 30 days&apos; notice.
          If you stop paying us, the system you paid for keeps running, because it
          runs on your accounts rather than ours. We would rather you stay because
          it is working than because leaving is painful.
        </p>
        <h3>Using your name</h3>
        <p>
          We will not name you publicly, use your logo, or publish details of
          your engagement without your written permission. If you do give
          permission, you can withdraw it later and we will take the material
          down.
        </p>
      </>
    ),
  },
  {
    id: "confidentiality",
    heading: "Confidentiality",
    body: (
      <p>
        Each side will protect the other&apos;s non-public information, use it
        only for the engagement, and not disclose it to anyone who does not need
        it. This does not apply to information that is already public, that you
        or we already knew, or that the law requires us to disclose. These
        obligations continue after the engagement ends.
      </p>
    ),
  },
  {
    id: "healthcare",
    heading: "Healthcare engagements",
    body: (
      <>
        <p>
          We work with healthcare practices, so protected health information
          needs its own rules.
        </p>
        <ul>
          <li>
            <strong>Our default is that no patient data is involved.</strong>{" "}
            Most of what we build is deliberately designed to sit away from
            patient records.
          </li>
          <li>
            <strong>
              We sign a Business Associate Agreement with every healthcare
              client before the work starts,
            </strong>{" "}
            whether or not we expect patient information to be involved. Where
            one exists, it governs that data and overrides anything here that
            conflicts with it.
          </li>
          <li>
            <strong>
              Systems that touch protected health information run in your own
              cloud account,
            </strong>{" "}
            opened in your practice&apos;s name with your billing. You accept the
            cloud provider&apos;s Business Associate Agreement directly, and we
            walk you through what it says. The account is yours, any access you
            grant us is yours to revoke, and we set up a spending alert on the
            account so usage stays visible. These costs are billed to you
            directly and we do not mark them up.
          </li>
          <li>
            <strong>
              When an engagement ends, your data comes back and our copies go
              away.
            </strong>{" "}
            We return what we hold in a usable format and delete our copies. Where
            a Business Associate Agreement is in place, its return and destruction
            terms govern. Where a system runs in your own cloud account there is
            nothing on our side to return, which is part of why we build it that
            way.
          </li>
          <li>
            <strong>
              If we discover a security incident affecting your data, you hear
              from us within 24 hours.
            </strong>{" "}
            Not the 60 days the regulation allows. You get what we know, what we
            do not yet know, and what we are doing about it, and we keep you
            updated until it is closed. We support your own notification
            obligations at no charge.
          </li>
          <li>
            <strong>Your compliance program remains yours.</strong> We can build
            to your requirements and explain how a system works, but we are not
            your compliance officer, auditor, or legal counsel, and we do not
            certify your practice as compliant with any regulation.
          </li>
        </ul>
      </>
    ),
  },
  {
    id: "support",
    heading: "Support and warranty",
    body: (
      <>
        <p>
          We warrant that we will perform our work with reasonable skill and
          care, and that the deliverable will do what the proposal says it does.
        </p>
        <p>
          <strong>
            We answer support requests within 24 hours on business days.
          </strong>{" "}
          What an ongoing support agreement covers, and at what price, is set in
          your proposal rather than here, because it differs by engagement.
        </p>
        <p>
          Every project includes a support window after delivery, stated in the
          proposal and 30 days unless the proposal says otherwise.{" "}
          <strong>
            During that window, defects in what we built are fixed at no charge.
          </strong>{" "}
          Requests for new or changed behavior are not defects; they are quoted
          as additional work. Ongoing support after that window is available
          under a monthly agreement.
        </p>
      </>
    ),
  },
  {
    id: "disclaimers",
    heading: "Disclaimers",
    body: (
      <p>
        Except for the warranty stated directly above, the website and our
        services are provided &quot;as is,&quot; and we disclaim all other
        warranties, whether express or implied, including implied warranties of
        merchantability, fitness for a particular purpose, and
        non-infringement. We do not warrant that the site or any system will be
        uninterrupted, error free, or free of harmful components. Some
        jurisdictions do not allow certain disclaimers, so parts of this section
        may not apply to you.
      </p>
    ),
  },
  {
    id: "liability",
    heading: "Limitation of liability",
    body: (
      <>
        <p>
          To the fullest extent the law allows, neither side is liable to the
          other for indirect, incidental, special, consequential, or punitive
          damages, or for lost profits, lost revenue, lost data, or business
          interruption, even if warned that such damages were possible.
        </p>
        <p>
          <strong>
            Our total liability arising out of or relating to an engagement, for
            all claims combined and regardless of the legal theory, is limited to
            the total fees you paid us for that engagement.
          </strong>{" "}
          For use of the website alone, where you have paid us nothing, our total
          liability is limited to one hundred United States dollars.
        </p>
        <p>
          Nothing in these terms limits liability that cannot be limited by law,
          including liability for fraud, willful misconduct, or gross negligence.
        </p>
      </>
    ),
  },
  {
    id: "indemnity",
    heading: "Indemnification",
    body: (
      <>
        <p>
          You agree to defend and indemnify us against third-party claims
          arising from material you provided to us, from your use of a
          deliverable in a way the proposal did not contemplate, or from your
          breach of these terms or of applicable law.
        </p>
        <p>
          We will defend and indemnify you against third-party claims that a
          deliverable we built infringes someone&apos;s intellectual property
          rights. That indemnity does not cover
          claims arising from material you supplied or specifications you
          directed, from your modification of a deliverable, from combining it
          with software we did not provide, or from third-party and open-source
          components used under their own licenses.
        </p>
        <p>
          The party seeking indemnity must give prompt written notice and
          reasonable cooperation.
        </p>
      </>
    ),
  },
  {
    id: "termination",
    heading: "Ending an engagement",
    body: (
      <>
        <p>
          Either side may end a monthly support agreement with 30 days&apos;
          written notice.
        </p>
        <p>
          Either side may end a project engagement in writing if the other
          materially breaches these terms or the proposal and does not fix it
          within 15 days of being told.
        </p>
        <p>
          If a project ends early, you pay for the work completed up to that
          point, and we hand over what has been built and paid for. Sections that
          by their nature should survive, including ownership, confidentiality,
          payment for completed work, indemnification, disclaimers, limitation of
          liability, and governing law, survive termination.
        </p>
      </>
    ),
  },
  {
    id: "continuity",
    heading: "If we stop being able to support you",
    body: (
      <>
        <p>
          We are two people, and you should know what happens if one of us is
          not here.
        </p>
        <ul>
          <li>
            <strong>We document what we build.</strong> The source code, the
            configuration, and a walkthrough are part of every delivery, not
            something you have to ask for later, so another developer can pick it
            up.
          </li>
          <li>
            <strong>
              Systems that run on your own accounts keep running whether or not
              we are here.
            </strong>{" "}
            They do not depend on a Stephens AI server or licence.
          </li>
          <li>
            <strong>
              For a system we host on your behalf, you can export your content at
              any time,
            </strong>{" "}
            and if Stephens AI stops operating we will hand over any
            administrative access we still hold, along with your data.
          </li>
          <li>
            <strong>You keep everything you have paid for.</strong> Your system
            does not stop working because we do.
          </li>
        </ul>
      </>
    ),
  },
  {
    id: "general",
    heading: "General terms",
    body: (
      <>
        <h3>Events outside our control</h3>
        <p>
          Neither side is liable for failing to perform because of something
          genuinely outside its reasonable control, such as a natural disaster,
          war, labour action, a government order, a failure of the public
          internet, or the outage or discontinuation of a third-party service.
          The affected side will tell the other promptly and do what it
          reasonably can to limit the impact.
        </p>
        <h3>If part of this fails</h3>
        <p>
          If any provision of these terms is found unenforceable, it is limited
          or removed only to the minimum extent necessary and the rest stays in
          force.
        </p>
        <h3>The whole agreement</h3>
        <p>
          These terms, together with any signed proposal, statement of work, or
          Business Associate Agreement, are the entire agreement between us on
          this subject and replace any earlier discussions. A failure to enforce
          a provision is not a waiver of it.
        </p>
        <h3>Assignment</h3>
        <p>
          Neither side may assign this agreement without the other&apos;s written
          consent, except to a successor in connection with a merger, a
          reorganization, or a sale of substantially all of its assets. Any other
          attempted assignment is void.
        </p>
      </>
    ),
  },
  {
    id: "governing-law",
    heading: "Governing law and disputes",
    body: (
      <>
        <p>
          These terms are governed by the laws of the State of Kansas, without
          regard to its conflict of law rules. The courts located in Sedgwick
          County, Kansas have exclusive jurisdiction, and both sides consent to
          that venue.
        </p>
        <p>
          Before filing anything, both sides agree to raise the problem in
          writing and spend 30 days genuinely trying to resolve it. Most
          disagreements are a misunderstanding about scope, and a conversation
          fixes them faster than a filing.
        </p>
      </>
    ),
  },
  {
    id: "changes",
    heading: "Changes to these terms",
    body: (
      <p>
        We may update these terms, and we will move the date at the top when we
        do. Changes apply to new engagements and to continued use of the site.
        They do not retroactively change the terms of an engagement already
        underway, which stays governed by the version in effect when the proposal
        was signed.
      </p>
    ),
  },
  {
    id: "contact",
    heading: "Contact us",
    body: (
      <>
        <p>Questions about these terms can go to a real person:</p>
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

export default function TermsPage() {
  return (
    <LegalPage
      title="Terms of Service"
      summary="The rules for using this site and for working with us: how proposals govern an engagement, what you own when we are done, what we will and will not promise about AI, and where the limits sit."
      sections={sections}
    />
  );
}
