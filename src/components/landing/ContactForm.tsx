"use client";

import { FormEvent, useState } from "react";
import { Button } from "@/components/ui/Button";

const SUBJECTS = [
  "General inquiry",
  "Job seeker support",
  "Employer support",
  "Career counselling",
  "Events",
  "Technical issue",
] as const;

const fieldClass =
  "mt-1.5 w-full rounded-lg border border-[#dbe3ef] bg-white px-3 py-2.5 text-sm text-[#1b2a4a] outline-none transition placeholder:text-[#9aa8c0] focus:border-[#2f4d9a]";

function RequiredMark() {
  return <span className="text-[#c0392b]">*</span>;
}

export function ContactForm() {
  const [sent, setSent] = useState(false);

  function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSent(true);
    e.currentTarget.reset();
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block text-sm font-medium text-[#1b2a4a]">
          First name <RequiredMark />
          <input name="firstName" required className={fieldClass} placeholder="First name" />
        </label>
        <label className="block text-sm font-medium text-[#1b2a4a]">
          Last name <RequiredMark />
          <input name="lastName" required className={fieldClass} placeholder="Last name" />
        </label>
      </div>

      <label className="block text-sm font-medium text-[#1b2a4a]">
        Contact Number <RequiredMark />
        <input
          name="phone"
          type="tel"
          required
          className={fieldClass}
          placeholder="03XX-XXXXXXX"
        />
      </label>

      <label className="block text-sm font-medium text-[#1b2a4a]">
        Email address <RequiredMark />
        <input
          name="email"
          type="email"
          required
          className={fieldClass}
          placeholder="you@example.com"
        />
      </label>

      <label className="block text-sm font-medium text-[#1b2a4a]">
        Select Subject <RequiredMark />
        <select name="subject" required defaultValue="" className={fieldClass}>
          <option value="" disabled>
            Choose subject
          </option>
          {SUBJECTS.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
      </label>

      <label className="block text-sm font-medium text-[#1b2a4a]">
        Your Message <RequiredMark />
        <textarea
          name="message"
          required
          rows={5}
          className={`${fieldClass} resize-y`}
          placeholder="How can we help?"
        />
      </label>

      {sent ? (
        <p className="rounded-lg border border-[#cfe0d6] bg-[#f3faf6] px-3 py-2 text-sm text-[#1f6b45]">
          Thank you — your message has been received. Our team will get back to you soon.
        </p>
      ) : null}

      <Button type="submit" className="!px-5 !py-2.5 !text-sm">
        Send message
      </Button>
    </form>
  );
}
