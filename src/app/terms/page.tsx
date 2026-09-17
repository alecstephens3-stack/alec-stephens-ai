import type { Metadata } from "next";
import { LegalPage, type LegalSection } from "@/components/layout/legal-page";
import { CONTACT_EMAIL, CONTACT_EMAIL_JUSHEEN, SITE_URL } from "@/lib/content";

export const metadata: Metadata = {
  title: "Terms of Service",
  description:
    "The terms governing use of stephensai.co and engagements with Stephens AI LLC, including proposals, payment, ownership of deliverables, use of AI, support, and limitation of liability.",
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
          These terms govern your use of <strong>stephensai.co</strong> and any
          engagement of Stephens AI LLC for services. By using the website or
          accepting a proposal from us, you agree to these terms.
        </p>
        <p>
          If you accept these terms on behalf of a practice or other
          organization, you represent that you have authority to bind that
          organization, and &quot;you&quot; refers to that organization.
        </p>
      </>
    ),
  },
  {
    id: "who-we-are",
    heading: "Who we are",
    body: (
      <p>
        Stephens AI LLC is a Kansas limited liability company that builds
        internal software and AI systems for independent healthcare practices.
        In these terms, &quot;Stephens AI,&quot; &quot;we,&quot;
        &quot;us,&quot; and &quot;our&quot; refer to Stephens AI LLC.
      </p>
    ),
  },
  {
    id: "website",
    heading: "Use of this website",
    body: (
      <>
        <p>
          You may view, share, and reference this website. The text, design,
          diagrams, and case material on it are the property of Stephens AI and
          may not be republished in substantial part without our permission.
        </p>
        <p>You agree not to:</p>
        <ul>
          <li>
            Attempt to disrupt, overload, or gain unauthorized access to the
            website
          </li>
          <li>Scrape the website in a manner that degrades service for others</li>
          <li>
            Use the contact form to send bulk, automated, or unsolicited
            commercial messages
          </li>
          <li>
            Submit protected health information or other regulated data through
            the website
          </li>
        </ul>
        <p>
          Descriptions and prices on this website are for information only and
          do not constitute an offer. Pricing becomes binding only when set out
          in a written proposal accepted by both parties.
        </p>
      </>
    ),
  },
  {
    id: "engagements",
    heading: "Engagements",
    body: (
      <>
        <p>Our engagements generally follow this sequence:</p>
        <ol>
          <li>An initial qualifying call at no cost</li>
          <li>
            A written proposal setting out scope, deliverables, price, and
            timeline
          </li>
          <li>A discovery call following acceptance of the proposal</li>
          <li>The build</li>
          <li>Demonstration, setup, and a recorded walkthrough</li>
          <li>A post-delivery support window</li>
        </ol>
        <h3>Order of precedence</h3>
        <p>
          <strong>
            Where a signed proposal, statement of work, or Business Associate
            Agreement conflicts with these terms, the signed document controls.
          </strong>{" "}
          These terms apply to matters not addressed in the signed documents.
        </p>
        <h3>Changes in scope</h3>
        <p>
          Work outside the agreed scope is quoted in writing before it begins.
        </p>
        <h3>Timelines</h3>
        <p>
          Dates in a proposal are estimates and depend on timely access,
          approvals, and information from you. Delays attributable to you extend
          the schedule accordingly.
        </p>
      </>
    ),
  },
  {
    id: "fees",
    heading: "Fees and payment",
    body: (
      <ul>
        <li>
          <strong>Project work is fixed price</strong> as stated in the
          proposal, together with the payment schedule. We price the project,
          not the hours, unless the proposal states otherwise.
        </li>
        <li>
          <strong>Ongoing support is billed monthly</strong> at the rate stated
          in the proposal and continues until terminated by either party.
        </li>
        <li>
          <strong>Invoices are payable on the terms stated on the invoice.</strong>{" "}
          If an invoice is past due, we may suspend work after giving you notice.
        </li>
        <li>
          <strong>Fees exclude third-party costs.</strong> Software
          subscriptions, cloud usage, and similar charges are billed to your own
          accounts and are your responsibility.
        </li>
        <li>
          <strong>Fees exclude taxes.</strong> You are responsible for any
          applicable taxes other than taxes on our income.
        </li>
      </ul>
    ),
  },
  {
    id: "your-side",
    heading: "Client responsibilities",
    body: (
      <>
        <p>You agree to provide, within a reasonable time:</p>
        <ul>
          <li>Accurate information about how your practice operates</li>
          <li>The access and permissions required for the work</li>
          <li>A designated contact authorized to make decisions and approvals</li>
          <li>Review of deliverables upon delivery</li>
        </ul>
        <p>
          You are responsible for the accuracy and lawfulness of the materials
          you provide to us, and for having the right to provide them.
        </p>
      </>
    ),
  },
  {
    id: "third-party",
    heading: "Third-party services",
    body: (
      <>
        <p>
          The systems we build operate either on services you own, such as your
          cloud account, email platform, or accounting software, or on
          infrastructure we operate on your behalf where no protected health
          information is involved. A front desk knowledge base is an example of
          the second kind: your content is stored in a database we manage for
          you, none of it is patient information, and you may export it at any
          time. We identify which arrangement applies before you commit to an
          engagement.
        </p>
        <ul>
          <li>
            Accounts in your name remain under your control and subject to the
            relevant vendor&apos;s terms.
          </li>
          <li>
            We are not responsible for a third-party vendor&apos;s outage, price
            change, policy change, or discontinuation of a product.
          </li>
          <li>
            If a vendor change affects your system, we will advise you of what
            is required to address it. Your support agreement, if any, states
            what it covers. Work beyond that scope is quoted before it begins.
          </li>
        </ul>
      </>
    ),
  },
  {
    id: "ai",
    heading: "Artificial intelligence",
    body: (
      <>
        <h3>Use of AI tools in our services</h3>
        <p>
          We use AI tools from third-party providers, including Anthropic,
          OpenAI, and Amazon Web Services, in performing our services. This
          includes drafting, analysis, writing software, and operating the
          systems we deliver. Information you provide to us may be processed by
          these tools in the course of the engagement.{" "}
          <strong>
            By engaging Stephens AI, you consent to this use.
          </strong>{" "}
          Our Privacy Policy describes how we select and configure these tools
          and how protected health information is handled.
        </p>
        <h3>Limitations of AI systems</h3>
        <ul>
          <li>
            <strong>
              AI systems can produce output that is incorrect, incomplete, or
              inconsistent,
            </strong>{" "}
            including output that appears authoritative. This is a
            characteristic of the technology and not a defect in a deliverable.
          </li>
          <li>
            <strong>We design for human review.</strong> Where an error would
            have consequences, the systems we build include a step at which a
            person reviews the output before it takes effect. That step is part
            of the deliverable. If you elect to remove it, you accept the
            associated risk.
          </li>
          <li>
            <strong>We do not guarantee business outcomes.</strong> We warrant
            that a system performs as described in the proposal. We do not
            warrant, and the proposal will not state, any particular amount of
            revenue, time saved, or staff hours reduced, as those results depend
            on factors outside our control, including how your team uses the
            system.
          </li>
          <li>
            <strong>Our systems do not provide professional advice.</strong>{" "}
            Nothing we deliver constitutes medical, legal, tax, or accounting
            advice, and no system may be used as a substitute for the judgment
            of a qualified professional.
          </li>
        </ul>
      </>
    ),
  },
  {
    id: "ownership",
    heading: "Ownership",
    body: (
      <>
        <h3>Deliverables</h3>
        <p>
          <strong>
            Upon payment in full, the deliverables created specifically for you
            become your property.
          </strong>{" "}
          This includes custom code, configuration, written content, and
          documentation produced for the engagement.
        </p>
        <p>
          <strong>Your data remains your property at all times.</strong> You may
          export it in a standard format during or after the engagement at no
          charge. Where a system stores content we manage on your behalf, we
          provide a means of exporting it.
        </p>
        <h3>Retained materials</h3>
        <p>
          We retain ownership of the general tools, templates, patterns, and
          know-how that we bring to an engagement or develop in the course of
          it. This does not include your content, data, configuration, pricing,
          procedures, or any other information specific to your practice. Where
          our pre-existing materials are incorporated into a deliverable, you
          receive a perpetual, non-exclusive license to use them as part of that
          deliverable.
        </p>
        <h3>No long-term commitment</h3>
        <p>
          Project engagements do not require a long-term contract. Monthly
          support agreements are month to month and may be terminated by either
          party on 30 days&apos; notice. Systems that operate on your own
          accounts continue to function after an engagement ends.
        </p>
        <h3>Use of your name</h3>
        <p>
          We will not identify you publicly, use your logo, or publish details
          of your engagement without your written permission. Permission may be
          withdrawn at any time, after which we will remove the relevant
          material.
        </p>
      </>
    ),
  },
  {
    id: "confidentiality",
    heading: "Confidentiality",
    body: (
      <p>
        Each party will protect the other&apos;s non-public information, use it
        only for purposes of the engagement, and disclose it only to those who
        need it for that purpose. These obligations do not apply to information
        that is publicly available, that the receiving party already possessed,
        or that must be disclosed by law. These obligations survive the end of
        the engagement.
      </p>
    ),
  },
  {
    id: "healthcare",
    heading: "Healthcare engagements",
    body: (
      <ul>
        <li>
          <strong>
            Our default is that protected health information is not involved.
          </strong>{" "}
          Most of the systems we build are designed to operate without access
          to patient records.
        </li>
        <li>
          <strong>
            We sign a Business Associate Agreement with every healthcare client
            before work begins,
          </strong>{" "}
          whether or not protected health information is expected to be
          involved. Where such an agreement exists, it governs that information
          and controls over any conflicting provision of these terms.
        </li>
        <li>
          <strong>
            Systems that process protected health information operate within
            your own cloud account,
          </strong>{" "}
          opened in your practice&apos;s name with your billing. You accept the
          cloud provider&apos;s Business Associate Agreement directly. The
          account belongs to you, any access granted to us may be revoked by
          you, and we configure a spending alert so that usage remains visible.
          Cloud costs are billed to you directly and are not marked up.
        </li>
        <li>
          <strong>
            At the end of an engagement, we return the data we hold in a usable
            format and delete our copies.
          </strong>{" "}
          Where a Business Associate Agreement is in place, its return and
          destruction provisions govern. Where a system operates within your own
          cloud account, we hold nothing to return.
        </li>
        <li>
          <strong>
            If we discover a security incident affecting your data, we will
            notify you within 24 hours of discovery
          </strong>{" "}
          with the information available at that time, and keep you informed
          until the matter is resolved. We will cooperate with your own
          notification obligations.
          </li>
        <li>
          <strong>Your compliance program remains your responsibility.</strong>{" "}
          We build to your requirements and explain how our systems operate. We
          are not your compliance officer, auditor, or legal counsel, and we do
          not certify your practice as compliant with any regulation.
        </li>
      </ul>
    ),
  },
  {
    id: "support",
    heading: "Support and warranty",
    body: (
      <>
        <p>
          We warrant that our services will be performed with reasonable skill
          and care and that each deliverable will perform as described in the
          applicable proposal.
        </p>
        <p>
          <strong>
            We respond to support requests within 24 hours on business days.
          </strong>{" "}
          The scope and price of any ongoing support agreement are set out in
          your proposal.
        </p>
        <p>
          Each project includes a post-delivery support window of 30 days unless
          the proposal states otherwise.{" "}
          <strong>
            During that window, defects in the deliverable are corrected at no
            charge.
          </strong>{" "}
          Requests for new or changed functionality are not defects and are
          quoted as additional work.
        </p>
      </>
    ),
  },
  {
    id: "disclaimers",
    heading: "Disclaimers",
    body: (
      <>
        <p>
          Except for the warranty expressly stated above, the website and our
          services are provided &quot;as is,&quot; and we disclaim all other
          warranties, express or implied, including implied warranties of
          merchantability, fitness for a particular purpose, and
          non-infringement. We do not warrant that the website or any system
          will be uninterrupted, error-free, or free of harmful components.
        </p>
        <p>
          <strong>
            We do not warrant that any individual output produced by an AI
            system will be accurate, complete, or free of error.
          </strong>{" "}
          The warranty above covers whether a system performs as described in
          the proposal, not the correctness of each output it produces.
        </p>
        <p>
          Some jurisdictions do not permit certain disclaimers, and portions of
          this section may not apply to you.
        </p>
      </>
    ),
  },
  {
    id: "liability",
    heading: "Limitation of liability",
    body: (
      <>
        <p>
          To the fullest extent permitted by law, neither party is liable to the
          other for indirect, incidental, special, consequential, or punitive
          damages, or for lost profits, lost revenue, lost data, or business
          interruption, even if advised of the possibility of such damages.
        </p>
        <p>
          <strong>
            Our total liability arising out of or relating to an engagement,
            for all claims combined and regardless of the legal theory, is
            limited to the total fees you paid us for that engagement.
          </strong>{" "}
          For use of the website where no fees have been paid, our total
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
          You agree to defend and indemnify Stephens AI against third-party
          claims arising from materials you provide to us, from your use of a
          deliverable in a manner not contemplated by the proposal, or from your
          breach of these terms or of applicable law.
        </p>
        <p>
          We will defend and indemnify you against third-party claims that a
          deliverable we created infringes a third party&apos;s intellectual
          property rights. This indemnity does not cover claims arising from
          materials or specifications you supplied, from your modification of a
          deliverable, from its combination with software we did not provide, or
          from third-party or open-source components used under their own
          licenses.
        </p>
        <p>
          The party seeking indemnification must provide prompt written notice
          and reasonable cooperation.
        </p>
      </>
    ),
  },
  {
    id: "termination",
    heading: "Termination",
    body: (
      <>
        <p>
          Either party may terminate a monthly support agreement on 30
          days&apos; written notice.
        </p>
        <p>
          Either party may terminate a project engagement in writing if the
          other party materially breaches these terms or the proposal and fails
          to cure the breach within 15 days of written notice.
        </p>
        <p>
          If a project is terminated before completion, you will pay for work
          completed to that date, and we will deliver the work that has been
          completed and paid for. Provisions that by their nature should
          survive, including ownership, confidentiality, payment for completed
          work, indemnification, disclaimers, limitation of liability, and
          governing law, survive termination.
        </p>
      </>
    ),
  },
  {
    id: "continuity",
    heading: "Business continuity",
    body: (
      <>
        <p>
          Stephens AI is a small firm. This section describes what applies if
          we are unable to continue supporting you.
        </p>
        <ul>
          <li>
            <strong>We document what we build.</strong> Source code,
            configuration, and a walkthrough are included with each delivery so
            that another developer can maintain the system.
          </li>
          <li>
            <strong>
              Systems that operate on your own accounts continue to function
              independently of Stephens AI.
            </strong>{" "}
            They do not depend on a Stephens AI server or license.
          </li>
          <li>
            <strong>
              For systems we host on your behalf, you may export your content
              at any time.
            </strong>{" "}
            If Stephens AI ceases operations, we will transfer any
            administrative access we hold, together with your data.
          </li>
          <li>
            <strong>You retain everything you have paid for.</strong>
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
        <h3>Force majeure</h3>
        <p>
          Neither party is liable for failure to perform due to causes beyond
          its reasonable control, including natural disaster, war, labor action,
          government order, failure of public networks, or the outage or
          discontinuation of a third-party service. The affected party will
          notify the other promptly and take reasonable steps to mitigate the
          effect.
        </p>
        <h3>Severability</h3>
        <p>
          If any provision of these terms is held unenforceable, it will be
          limited or severed to the minimum extent necessary, and the remaining
          provisions remain in effect.
        </p>
        <h3>Entire agreement</h3>
        <p>
          These terms, together with any signed proposal, statement of work, or
          Business Associate Agreement, constitute the entire agreement between
          the parties regarding their subject matter and supersede prior
          discussions. Failure to enforce a provision is not a waiver of it.
        </p>
        <h3>Assignment</h3>
        <p>
          Neither party may assign this agreement without the other&apos;s
          written consent, except to a successor in connection with a merger,
          reorganization, or sale of substantially all of its assets. Any other
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
          regard to its conflict of law principles. The state and federal courts
          located in Sedgwick County, Kansas have exclusive jurisdiction over any
          dispute, and both parties consent to that venue.
        </p>
        <p>
          Before commencing any legal proceeding, the parties agree to raise the
          dispute in writing and to attempt in good faith to resolve it for a
          period of 30 days.
        </p>
      </>
    ),
  },
  {
    id: "changes",
    heading: "Changes to these terms",
    body: (
      <p>
        We may update these terms from time to time. The date at the top of this
        page reflects the most recent revision. Changes apply to new engagements
        and to continued use of the website. An engagement already in progress
        remains governed by the version in effect when its proposal was
        accepted.
      </p>
    ),
  },
  {
    id: "contact",
    heading: "Contact",
    body: (
      <>
        <p>Questions regarding these terms may be directed to either founder:</p>
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

export default function TermsPage() {
  return (
    <LegalPage
      title="Terms of Service"
      summary="These terms govern use of this website and engagements with Stephens AI LLC, including how proposals control an engagement, ownership of deliverables, our use of AI, support, and the limits of our liability."
      sections={sections}
    />
  );
}
