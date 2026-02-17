"use client";

import { useState } from "react";
import Image from "next/image";
import { CASE_STUDIES } from "@/lib/constants";
import { SectionHeader } from "@/components/ui/section-header";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AnimateOnScroll } from "@/components/ui/animate-on-scroll";
import { ImageModal } from "@/components/ui/image-modal";
import type { CaseStudyImage } from "@/types";

export function CaseStudies() {
  const [modalImages, setModalImages] = useState<CaseStudyImage[] | null>(
    null
  );
  const [modalIndex, setModalIndex] = useState(0);
  const [activeVideo, setActiveVideo] = useState<string | null>(null);

  const openModal = (images: CaseStudyImage[], index: number) => {
    setModalImages(images);
    setModalIndex(index);
  };

  return (
    <section
      id="work"
      className="bg-warm-white py-24"
      aria-label="Case studies"
    >
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <SectionHeader
          label="Work"
          heading="Selected Projects"
          description="Here's some of what I've built. Click the images to see the details."
        />

        <div className="space-y-8">
          {CASE_STUDIES.map((study, index) => (
            <AnimateOnScroll key={study.title} delay={index * 100}>
              <Card className="overflow-hidden">
                <div className="flex flex-col lg:flex-row lg:gap-8">
                  {/* Content */}
                  <div className="flex-1 p-2">
                    {/* Metric highlight */}
                    <div className="mb-3 flex items-baseline gap-2">
                      <span className="font-heading text-3xl font-bold text-terracotta">
                        {study.metric}
                      </span>
                      <span className="text-sm text-warm-gray">
                        {study.metricLabel}
                      </span>
                    </div>

                    <h3 className="font-heading text-2xl font-semibold text-black">
                      {study.title}
                    </h3>
                    <p className="mt-2 leading-relaxed text-warm-gray">
                      {study.description}
                    </p>

                    <div className="mt-4 flex flex-wrap gap-2">
                      {study.tags.map((tag) => (
                        <Badge key={tag}>{tag}</Badge>
                      ))}
                    </div>

                    {/* Demo video button */}
                    {study.demoVideo && (
                      <button
                        onClick={() => setActiveVideo(study.demoVideo!)}
                        className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-terracotta transition-colors hover:text-terracotta-light"
                      >
                        <svg
                          className="h-5 w-5"
                          viewBox="0 0 24 24"
                          fill="currentColor"
                        >
                          <path d="M8 5v14l11-7z" />
                        </svg>
                        Watch Demo
                      </button>
                    )}
                  </div>

                  {/* Image gallery */}
                  {study.images && study.images.length > 0 && (
                    <div className="mt-6 lg:mt-0 lg:w-[55%] shrink-0">
                      <div className="grid grid-cols-2 gap-2">
                        {study.images.map((image, imgIndex) => (
                          <button
                            key={image.src}
                            onClick={() => openModal(study.images!, imgIndex)}
                            className="group relative aspect-video overflow-hidden rounded-lg bg-cream"
                            aria-label={`View: ${image.alt}`}
                          >
                            <Image
                              src={image.src}
                              alt={image.alt}
                              fill
                              className="object-cover transition-transform duration-300 group-hover:scale-105"
                              sizes="(max-width: 1024px) 50vw, 280px"
                            />
                            <div className="absolute inset-0 bg-black/0 transition-colors group-hover:bg-black/10" />
                            <div className="absolute bottom-2 right-2 rounded-full bg-black/60 p-1.5 opacity-0 transition-opacity group-hover:opacity-100">
                              <svg
                                className="h-3.5 w-3.5 text-white"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                              >
                                <path d="M15 3h6v6M14 10l6.1-6.1M9 21H3v-6M10 14l-6.1 6.1" />
                              </svg>
                            </div>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </Card>
            </AnimateOnScroll>
          ))}
        </div>
      </div>

      {/* Image modal */}
      {modalImages && (
        <ImageModal
          images={modalImages}
          initialIndex={modalIndex}
          onClose={() => setModalImages(null)}
        />
      )}

      {/* Video modal */}
      {activeVideo && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4"
          onClick={() => setActiveVideo(null)}
          role="dialog"
          aria-modal="true"
          aria-label="Video player"
        >
          <div
            className="relative w-full max-w-4xl"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setActiveVideo(null)}
              className="absolute -top-12 right-0 text-white/70 hover:text-white transition-colors text-sm font-medium"
              aria-label="Close video"
            >
              Close (Esc)
            </button>
            <video
              src={activeVideo}
              controls
              autoPlay
              className="w-full rounded-lg"
            >
              Your browser does not support the video tag.
            </video>
          </div>
        </div>
      )}
    </section>
  );
}
