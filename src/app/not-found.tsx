// Lens v3 404. The layout supplies the scene, dock, and footer.
import { Porthole } from "@/components/ui/lens-primitives";
import { ButtonLink } from "@/components/ui/button";

export const metadata = { title: "Page not found" };

export default function NotFound() {
  return (
    <div className="mx-auto max-w-5xl px-6">
      <div className="sai-pane sai-streak sai-rise rounded-window mx-auto mt-44 mb-24 max-w-xl px-8 py-16 text-center md:px-14 md:py-20">
        <div className="flex justify-center">
          <Porthole>404</Porthole>
        </div>

        <h1
          className="mt-8 font-medium tracking-[-0.01em] text-ink-90"
          style={{ fontSize: "clamp(2rem, 4vw, 2.8rem)", lineHeight: 1.15 }}
        >
          Nothing in focus here.
        </h1>

        <p className="mx-auto mt-5 max-w-md text-base text-ink-2">
          The page you&rsquo;re looking for drifted out of frame.
        </p>

        <div className="mt-10 flex justify-center">
          <ButtonLink href="/" variant="primary">
            Back to home
          </ButtonLink>
        </div>
      </div>
    </div>
  );
}
