"use client";
import { Navigation } from "@/components/nav/Navigation";
import { Footer } from "@/components/Footer";
import { ContactForm } from "@/components/ContactForm";

export default function GetInvolvedPage() {
  return (
    <>
      <Navigation />
      <main className="min-h-screen pt-[var(--main-top-offset)]">
        <section className="py-4 md:py-6 px-4 md:px-8">
          <div className="max-w-[var(--content-max)] mx-auto">
            <h1 className="font-display text-4xl md:text-5xl font-light text-[var(--color-text-primary)] mb-4">
              Get Involved
            </h1>
            <p className="font-body text-[var(--color-text-muted)] text-lg mb-12">
              Writers, Designers, Researchers, Podcast Hosts, Developers — we want you. Your major doesn&apos;t matter. Your curiosity does.
            </p>
            <ContactForm />
          </div>
        </section>
        <Footer />
      </main>
    </>
  );
}
