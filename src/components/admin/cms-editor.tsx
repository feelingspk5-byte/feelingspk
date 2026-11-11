"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import type { CmsContent, HeroSlide } from "@/lib/store/types";

export function CmsEditor({ initial }: { initial: CmsContent }) {
  const router = useRouter();
  const [cms, setCms] = useState(initial);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  function updateSlide(idx: number, patch: Partial<HeroSlide>) {
    setCms((prev) => {
      const slides = [...prev.hero.slides];
      slides[idx] = { ...slides[idx], ...patch };
      return { ...prev, hero: { ...prev.hero, slides } };
    });
  }

  function addSlide() {
    setCms((prev) => ({
      ...prev,
      hero: {
        ...prev.hero,
        slides: [
          ...prev.hero.slides,
          { src: "/brand/hero/fabric-atelier-right.jpg", alt: "New slide", label: "New" },
        ],
      },
    }));
  }

  function addFaq() {
    setCms((prev) => ({
      ...prev,
      faq: [...prev.faq, { question: "", answer: "" }],
    }));
  }

  async function save(e: FormEvent) {
    e.preventDefault();
    setBusy(true);
    setMessage(null);
    const res = await fetch("/api/admin/cms", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(cms),
    });
    setBusy(false);
    if (!res.ok) {
      setMessage("Could not save.");
      return;
    }
    setMessage("Website content saved — live on the storefront.");
    router.refresh();
  }

  return (
    <form onSubmit={save} className="space-y-8">
      <section className="space-y-4 border border-ink/10 bg-ivory p-6">
        <h2 className="font-display text-2xl">Homepage hero</h2>
        <Input
          value={cms.hero.eyebrow}
          onChange={(e) =>
            setCms({ ...cms, hero: { ...cms.hero, eyebrow: e.target.value } })
          }
          placeholder="Eyebrow"
        />
        <Input
          value={cms.hero.title}
          onChange={(e) =>
            setCms({ ...cms, hero: { ...cms.hero, title: e.target.value } })
          }
          placeholder="Title"
        />
        <Textarea
          rows={3}
          value={cms.hero.subtitle}
          onChange={(e) =>
            setCms({ ...cms, hero: { ...cms.hero, subtitle: e.target.value } })
          }
          placeholder="Subtitle"
        />
        <div className="space-y-3">
          {cms.hero.slides.map((slide, idx) => (
            <div key={idx} className="grid gap-2 border border-ink/10 p-3 md:grid-cols-3">
              <Input
                value={slide.src}
                onChange={(e) => updateSlide(idx, { src: e.target.value })}
                placeholder="Image path"
              />
              <Input
                value={slide.label}
                onChange={(e) => updateSlide(idx, { label: e.target.value })}
                placeholder="Label"
              />
              <Input
                value={slide.alt}
                onChange={(e) => updateSlide(idx, { alt: e.target.value })}
                placeholder="Alt text"
              />
            </div>
          ))}
          <Button type="button" variant="outline" onClick={addSlide}>
            Add slide
          </Button>
        </div>
      </section>

      <section className="space-y-4 border border-ink/10 bg-ivory p-6">
        <h2 className="font-display text-2xl">About page</h2>
        <Input
          value={cms.about.title}
          onChange={(e) =>
            setCms({ ...cms, about: { ...cms.about, title: e.target.value } })
          }
        />
        <Textarea
          rows={4}
          value={cms.about.body}
          onChange={(e) =>
            setCms({ ...cms, about: { ...cms.about, body: e.target.value } })
          }
        />
      </section>

      <section className="space-y-4 border border-ink/10 bg-ivory p-6">
        <h2 className="font-display text-2xl">Contact intro</h2>
        <Input
          value={cms.contact.title}
          onChange={(e) =>
            setCms({
              ...cms,
              contact: { ...cms.contact, title: e.target.value },
            })
          }
        />
        <Textarea
          rows={3}
          value={cms.contact.body}
          onChange={(e) =>
            setCms({
              ...cms,
              contact: { ...cms.contact, body: e.target.value },
            })
          }
        />
      </section>

      <section className="space-y-4 border border-ink/10 bg-ivory p-6">
        <div className="flex items-center justify-between">
          <h2 className="font-display text-2xl">FAQ</h2>
          <Button type="button" variant="outline" onClick={addFaq}>
            Add question
          </Button>
        </div>
        {cms.faq.map((item, idx) => (
          <div key={idx} className="space-y-2 border border-ink/10 p-3">
            <Input
              placeholder="Question"
              value={item.question}
              onChange={(e) => {
                const faq = [...cms.faq];
                faq[idx] = { ...item, question: e.target.value };
                setCms({ ...cms, faq });
              }}
            />
            <Textarea
              rows={2}
              placeholder="Answer"
              value={item.answer}
              onChange={(e) => {
                const faq = [...cms.faq];
                faq[idx] = { ...item, answer: e.target.value };
                setCms({ ...cms, faq });
              }}
            />
          </div>
        ))}
      </section>

      <section className="space-y-4 border border-ink/10 bg-ivory p-6">
        <h2 className="font-display text-2xl">Footer note</h2>
        <Input
          value={cms.footerNote}
          onChange={(e) => setCms({ ...cms, footerNote: e.target.value })}
        />
      </section>

      {message ? <p className="text-sm text-ink/60">{message}</p> : null}
      <Button type="submit" size="lg" disabled={busy}>
        {busy ? "Saving…" : "Save website content"}
      </Button>
    </form>
  );
}
