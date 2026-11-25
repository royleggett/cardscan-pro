import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Search, BookOpen, LifeBuoy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import ManualSection from "@/components/manual/ManualSection";
import {
  manualSections,
  troubleshootingGroups,
  recentUpdates,
  topicMatches,
  MANUAL_UPDATED,
} from "@/content/userManual";

export default function UserManual() {
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const q = query.trim().toLowerCase();

  const visibleSections = manualSections
    .map((section) => ({
      ...section,
      topics: section.topics.filter((topic) => topicMatches(topic, query)),
    }))
    .filter((section) => section.topics.length > 0);

  const visibleTrouble = troubleshootingGroups
    .map((group) => ({
      ...group,
      items: group.items.filter(
        (item) => !q || `${item.question} ${item.answer}`.toLowerCase().includes(q)
      ),
    }))
    .filter((group) => group.items.length > 0);

  const noResults = Boolean(q) && visibleSections.length === 0 && visibleTrouble.length === 0;

  const jumpLinks = [
    ...manualSections.map((s) => ({ id: s.id, label: s.title })),
    { id: "troubleshooting", label: "Troubleshooting" },
  ];

  return (
    <div className="px-4 py-6 max-w-3xl mx-auto">
      <Button variant="ghost" onClick={() => navigate(-1)} className="mb-4">
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back
      </Button>

      <div className="mb-6">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
            <BookOpen className="w-6 h-6 text-blue-600" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">User Manual</h1>
            <p className="text-xs text-gray-500">Last updated {MANUAL_UPDATED}</p>
          </div>
        </div>
        <p className="text-gray-600 text-sm">
          A complete guide to CardScan-Pro, written in plain English. Search for a feature, or work
          through the sections below.
        </p>
      </div>

      <div className="relative mb-4">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        <Input
          placeholder="Search the manual, e.g. batch scan, reminders, filters..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="pl-10"
        />
      </div>

      <div className="flex gap-2 overflow-x-auto pb-2 mb-6 -mx-1 px-1">
        {jumpLinks.map((link) => (
          <a
            key={link.id}
            href={`#${link.id}`}
            className="whitespace-nowrap px-3 py-1.5 rounded-full text-xs font-semibold bg-white text-gray-600 border border-gray-200 hover:bg-gray-50"
          >
            {link.label}
          </a>
        ))}
      </div>

      {!q && (
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-6">
          <h2 className="font-semibold text-amber-900 text-sm mb-2">What's new</h2>
          <ul className="space-y-1.5">
            {recentUpdates.map((update) => (
              <li key={update.label} className="text-sm text-amber-800">
                <span className="font-semibold">{update.date}:</span> {update.label}
              </li>
            ))}
          </ul>
        </div>
      )}

      {noResults && (
        <div className="text-center py-12">
          <p className="text-gray-600 mb-1">Nothing in the manual matches "{query}".</p>
          <p className="text-sm text-gray-500">
            Try a shorter word, or email support@cardscan-pro.com and we will help directly.
          </p>
        </div>
      )}

      <div className="space-y-10">
        {visibleSections.map((section) => (
          <ManualSection key={section.id} section={section} query={q} />
        ))}
      </div>

      {visibleTrouble.length > 0 && (
        <section id="troubleshooting" className="scroll-mt-28 mt-10">
          <div className="flex items-center gap-2 mb-1">
            <LifeBuoy className="w-6 h-6 text-blue-600" />
            <h2 className="text-xl font-bold text-gray-900">Troubleshooting</h2>
          </div>
          <p className="text-sm text-gray-600 mb-4">
            The problems people hit most often, and what to do about them.
          </p>

          <div className="space-y-6">
            {visibleTrouble.map((group) => (
              <div key={group.id}>
                <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wide mb-2">
                  {group.title}
                </h3>
                <div className="space-y-2">
                  {group.items.map((item) => (
                    <details
                      key={item.question}
                      open={q ? true : undefined}
                      className="group bg-white border border-gray-200 rounded-xl overflow-hidden"
                    >
                      <summary className="px-4 py-3 cursor-pointer list-none select-none text-sm font-semibold text-gray-800 [&::-webkit-details-marker]:hidden">
                        {item.question}
                      </summary>
                      <p className="px-4 pb-4 text-sm text-gray-700">{item.answer}</p>
                    </details>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      <div className="mt-10 bg-blue-50 border border-blue-100 rounded-xl p-4 text-center">
        <p className="text-sm text-blue-800">
          Still stuck? Email{" "}
          <a href="mailto:support@cardscan-pro.com" className="font-semibold underline">
            support@cardscan-pro.com
          </a>{" "}
          and tell us what you were doing when the problem happened.
        </p>
      </div>
    </div>
  );
}