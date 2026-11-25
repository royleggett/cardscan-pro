import React from "react";
import { ChevronDown } from "lucide-react";

export default function ManualTopic({ topic, open }) {
  return (
    <details
      open={open || undefined}
      className="group bg-white border border-gray-200 rounded-xl overflow-hidden"
    >
      <summary className="flex items-center justify-between gap-3 px-4 py-3 cursor-pointer list-none select-none [&::-webkit-details-marker]:hidden">
        <span className="font-semibold text-gray-800 text-sm">{topic.title}</span>
        <ChevronDown className="w-4 h-4 text-gray-400 flex-shrink-0 transition-transform group-open:rotate-180" />
      </summary>

      <div className="px-4 pb-4">
        {topic.steps?.length > 0 && (
          <ol className="list-decimal pl-5 space-y-1.5 text-sm text-gray-700">
            {topic.steps.map((step, i) => (
              <li key={i}>{step}</li>
            ))}
          </ol>
        )}

        {topic.image && (
          <figure className="mt-3">
            <img
              src={topic.image.src}
              alt={topic.image.alt}
              className="rounded-lg border border-gray-200 w-full"
            />
            {topic.image.caption && (
              <figcaption className="text-xs text-gray-500 mt-1">{topic.image.caption}</figcaption>
            )}
          </figure>
        )}

        {topic.video && (
          <div className="mt-3">
            <video
              src={topic.video.src}
              controls
              playsInline
              className="w-full rounded-lg border border-gray-200"
            />
            {topic.video.caption && (
              <p className="text-xs text-gray-500 mt-1">{topic.video.caption}</p>
            )}
          </div>
        )}

        {topic.tip && (
          <p className="mt-3 text-sm bg-blue-50 border border-blue-100 text-blue-900 rounded-lg px-3 py-2">
            {topic.tip}
          </p>
        )}
      </div>
    </details>
  );
}