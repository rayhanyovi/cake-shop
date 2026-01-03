"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";

const heroSlides = [
  {
    id: "hero-1",
    title: "Lorem ipsum dolor sit amet consectetur",
    body: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
    kicker: "Union Bakery",
    image: "/Hero Banner.png",
  },
  {
    id: "hero-2",
    title: "Sed ut perspiciatis unde omnis",
    body: "Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
    kicker: "Signature Cakes",
    image: "/placeholder.png",
  },
  {
    id: "hero-3",
    title: "At vero eos et accusamus",
    body: "Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.",
    kicker: "Seasonal Specials",
    image: "/placeholder.png",
  },
];

export default function HeroCarousel() {
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % heroSlides.length);
    }, 6000);

    return () => window.clearInterval(timer);
  }, []);

  const handlePrev = () => {
    setActiveIndex(
      (prev) => (prev - 1 + heroSlides.length) % heroSlides.length
    );
  };

  const handleNext = () => {
    setActiveIndex((prev) => (prev + 1) % heroSlides.length);
  };

  const activeSlide = heroSlides[activeIndex];

  return (
    <section className="relative min-h-screen w-full overflow-hidden">
      <Image
        key={activeSlide.id}
        src={activeSlide.image}
        alt={activeSlide.title}
        fill
        priority
        className="object-cover"
      />
      <div className="absolute inset-0 bg-black/25" />
      <div className="relative mx-auto flex min-h-screen w-full max-w-6xl items-end justify-end px-6 pb-16 text-background">
        <div className="max-w-md space-y-4 text-right">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-background/70">
            {activeSlide.kicker}
          </p>
          <h1 className="text-4xl font-bold leading-tight">
            {activeSlide.title}
          </h1>
          <p className="text-sm text-background/80">{activeSlide.body}</p>
        </div>
      </div>
      <div className="pointer-events-none absolute inset-x-0 bottom-10 flex items-center justify-between px-6">
        <button
          type="button"
          onClick={handlePrev}
          className="pointer-events-auto flex h-10 w-10 items-center justify-center rounded-full border border-white/40 text-white/80 transition hover:text-white"
          aria-label="Previous slide"
        >
          <ChevronLeft className="h-4 w-4" />
        </button>
        <button
          type="button"
          onClick={handleNext}
          className="pointer-events-auto flex h-10 w-10 items-center justify-center rounded-full border border-white/40 text-white/80 transition hover:text-white"
          aria-label="Next slide"
        >
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>
      <div className="absolute bottom-10 left-1/2 flex -translate-x-1/2 gap-2">
        {heroSlides.map((slide, index) => (
          <button
            key={slide.id}
            type="button"
            onClick={() => setActiveIndex(index)}
            className={`h-1.5 w-8 rounded-full transition ${
              index === activeIndex ? "bg-white" : "bg-white/40"
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </section>
  );
}
