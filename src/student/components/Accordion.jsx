import React, { useState } from "react";

export default function Accordion({ items = [] }) {
  return (
    <div className="space-y-3">
      {items.map((it, i) => (
        <AccordionItem key={i} item={it} />
      ))}
    </div>
  );
}

function AccordionItem({ item }) {
  const [open, setOpen] = useState(false);
  const contentId = `accordion-panel-${item.q.replace(/\s+/g, '-').toLowerCase()}`;

  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex w-full items-center justify-between gap-3 bg-white px-4 py-3 text-left transition hover:bg-gray-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1B5E20]/30"
        aria-expanded={open}
        aria-controls={contentId}
        id={`${contentId}-button`}
      >
        <span className="min-w-0 flex-1 pr-2 font-medium text-gray-800">{item.q}</span>
        <span className="min-h-11 min-w-11 rounded-lg bg-gray-100 text-center text-lg leading-11 text-gray-500">{open ? "−" : "+"}</span>
      </button>
      {open && (
        <div id={contentId} role="region" aria-labelledby={`${contentId}-button`} className="border-t border-gray-100 bg-gray-50 px-4 py-3 text-sm leading-6 text-gray-700">
          {item.a}
        </div>
      )}
    </div>
  );
}
