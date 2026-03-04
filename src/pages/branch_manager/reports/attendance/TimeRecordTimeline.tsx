import { Image as ImageIcon } from "lucide-react";
import type { TimeEvent } from "./types";

interface TimeRecordTimelineProps {
  events: TimeEvent[];
  onImageClick: (imageUrl: string | null, title: string) => void;
}

const eventStyles: Record<
  TimeEvent["type"],
  {
    dot: string;
    line: string;
    bg: string;
    text: string;
    badge: string;
  }
> = {
  "time-in": {
    dot: "bg-green-500",
    line: "border-green-300 dark:border-green-700",
    bg: "bg-green-50 dark:bg-green-900/20",
    text: "text-green-700 dark:text-green-400",
    badge:
      "bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-300",
  },
  "time-out": {
    dot: "bg-red-500",
    line: "border-red-300 dark:border-red-700",
    bg: "bg-red-50 dark:bg-red-900/20",
    text: "text-red-700 dark:text-red-400",
    badge: "bg-red-100 dark:bg-red-900/40 text-red-700 dark:text-red-300",
  },
  "break-in": {
    dot: "bg-amber-500",
    line: "border-amber-300 dark:border-amber-700",
    bg: "bg-amber-50 dark:bg-amber-900/20",
    text: "text-amber-700 dark:text-amber-400",
    badge:
      "bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-300",
  },
  "break-out": {
    dot: "bg-amber-500",
    line: "border-amber-300 dark:border-amber-700",
    bg: "bg-amber-50 dark:bg-amber-900/20",
    text: "text-amber-700 dark:text-amber-400",
    badge:
      "bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-300",
  },
};

export function TimeRecordTimeline({
  events,
  onImageClick,
}: TimeRecordTimelineProps) {
  if (events.length === 0) {
    return (
      <div className="text-center py-6 text-gray-400 dark:text-gray-500 text-sm">
        No time records available
      </div>
    );
  }

  return (
    <div className="relative">
      {/* Vertical line */}
      <div className="absolute left-[18px] top-3 bottom-3 w-0.5 bg-gray-200 dark:bg-gray-700" />

      <div className="space-y-1">
        {events.map((event, index) => {
          const style = eventStyles[event.type];
          const isFirst = index === 0;
          const isLast = index === events.length - 1;

          return (
            <div key={event.id} className="relative flex items-start gap-3">
              {/* Timeline dot */}
              <div className="relative z-10 flex-shrink-0 mt-2.5">
                <div
                  className={`w-[10px] h-[10px] rounded-full ${style.dot} ring-2 ring-white dark:ring-gray-900 ${
                    isFirst || isLast ? "w-3 h-3" : ""
                  }`}
                />
              </div>

              {/* Event card */}
              <div
                className={`flex-1 rounded-lg px-3 py-2 ${style.bg} border ${style.line} ${
                  isFirst || isLast ? "border-2" : ""
                }`}
              >
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2 min-w-0">
                    <span
                      className={`text-xs font-semibold px-2 py-0.5 rounded-full ${style.badge}`}
                    >
                      {event.label}
                    </span>
                    {(isFirst || isLast) && (
                      <span className="text-[10px] font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                        {isFirst ? "First In" : "Last Out"}
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-2 flex-shrink-0">
                    <span className="text-sm font-mono font-semibold text-gray-800 dark:text-gray-200">
                      {event.timeString}
                    </span>

                    {event.image && (
                      <button
                        onClick={() =>
                          onImageClick(event.image, `${event.label} Photo`)
                        }
                        className="p-1 rounded hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
                        title="View Photo"
                      >
                        <ImageIcon className="h-3.5 w-3.5 text-gray-500 dark:text-gray-400" />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
