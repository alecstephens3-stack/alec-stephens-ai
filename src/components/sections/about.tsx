import Image from "next/image";
import { AnimateOnScroll } from "@/components/ui/animate-on-scroll";

type Founder = {
  name: string;
  role: string;
  photo: string | null;
  objectPosition?: string;
  linkedin: string;
  blurb: string[];
};

const FOUNDERS: Founder[] = [
  {
    name: "Alec Stephens",
    role: "Co-founder",
    photo: "/images/headshot.png",
    linkedin: "https://www.linkedin.com/in/alec-stephens-55b392213/",
    blurb: [
      "I lead every engagement personally. Strategy, architecture, and build. No account managers, no handoffs. The person on the call is the person building your system.",
      "I've worked with clients in the US, Japan, South Korea, and around the world, building everything from AI learning apps to complex workflow automations. Every project starts with understanding how your business actually works.",
    ],
  },
  {
    name: "Jusheen Kim",
    role: "Co-founder",
    photo: "/images/headshot-jusheen.png",
    // Face sits in the upper portion of the source, so bias the crop upward.
    objectPosition: "center 22%",
    linkedin: "https://www.linkedin.com/in/jusheenkim/",
    blurb: [
      "I'm an ex-J.P. Morgan lead software engineer that's passionate about working with real people and giving them their time back — building automations and websites that handle the busywork so they can focus on what actually matters to them. I've worked with all kinds of clients, from healthcare practices and solo freelancers to SaaS companies.",
    ],
  },
];

function getInitials(name: string) {
  return name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

export function About() {
  return (
    <section id="about" className="bg-sand/50 py-28 md:py-40" aria-label="About">
      <div className="mx-auto max-w-5xl px-6">
        <AnimateOnScroll>
          <h2 className="font-heading text-3xl font-medium tracking-tight text-black md:text-4xl">
            About
          </h2>
          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-ink-60">
            Stephens AI is just the two of us — here&apos;s who you&apos;ll be
            working with.
          </p>

          <div className="mt-14 grid items-start gap-12 md:mt-16 md:grid-cols-2 md:gap-16">
            {FOUNDERS.map((founder) => (
              <div key={founder.name}>
                {/* Headshot — falls back to initials until a photo is set */}
                <div
                  className="relative overflow-hidden rounded-lg border border-border bg-sand"
                  style={{ width: 180, height: 220 }}
                >
                  {founder.photo ? (
                    <Image
                      src={founder.photo}
                      alt={founder.name}
                      fill
                      className="object-cover"
                      style={{ objectPosition: founder.objectPosition ?? "center" }}
                      sizes="180px"
                    />
                  ) : (
                    <div
                      className="flex h-full w-full items-center justify-center"
                      aria-label={`${founder.name} headshot coming soon`}
                    >
                      <span className="font-heading text-4xl font-medium text-ink-40">
                        {getInitials(founder.name)}
                      </span>
                    </div>
                  )}
                </div>

                <h3 className="mt-6 font-heading text-2xl font-medium tracking-tight text-black">
                  {founder.name}
                </h3>
                <p className="mt-1 font-mono text-[13px] uppercase tracking-[0.04em] text-ink-60">
                  {founder.role}
                </p>

                <div className="mt-4 max-w-xl space-y-4">
                  {founder.blurb.map((paragraph, i) => (
                    <p
                      key={i}
                      className="text-lg leading-relaxed text-ink-60"
                    >
                      {paragraph}
                    </p>
                  ))}
                </div>

                <a
                  href={founder.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-6 inline-flex items-center gap-2 text-sm font-medium text-salmon transition-colors hover:text-salmon-deep"
                >
                  LinkedIn
                  <span aria-hidden="true">&rarr;</span>
                </a>
              </div>
            ))}
          </div>
        </AnimateOnScroll>
      </div>
    </section>
  );
}
