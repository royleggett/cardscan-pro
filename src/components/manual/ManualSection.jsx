import React from "react";
import ManualTopic from "@/components/manual/ManualTopic";

export default function ManualSection({ section, query }) {
  return (
    <section id={section.id} className="scroll-mt-28">
      <div className="flex items-center gap-2 mb-1">
        <span className="text-2xl">{section.icon}</span>
        <h2 className="text-xl font-bold text-gray-900">{section.title}</h2>
      </div>
      {section.intro && <p className="text-sm text-gray-600 mb-3">{section.intro}</p>}

      <div className="space-y-2">
        {section.topics.map((topic) => (
          <ManualTopic key={topic.id} topic={topic} open={Boolean(query)} />
        ))}
      </div>
    </section>
  );
}