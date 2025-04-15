import { cn } from "@/lib/utils";

type TimelineItem = {
  date: string;
  status: string;
  description: string;
  completed: boolean;
};

interface ShippingTimelineProps {
  items: TimelineItem[];
}

export default function ShippingTimeline({ items }: ShippingTimelineProps) {
  return (
    <div className="py-4">
      <h2 className="text-lg font-semibold mb-4">Shipping History</h2>
      <div>
        {/* Timeline items */}
        <div className="space-y-8">
          {items.map((item, index) => (
            <div key={index} className="flex">
              {/* Date on the left */}
              <div className="w-24 text-gray-500 text-sm pt-0.5">
                {item.date}
              </div>

              {/* Status with timeline on the right */}
              <div className="flex-1 relative">
                {/* Vertical line - runs through all items except the last one */}
                {index < items.length - 1 && (
                  <div className="absolute left-[5px] top-[14px] bottom-[-32px] w-[2px] bg-gray-200"></div>
                )}

                <div className="flex">
                  {/* Timeline dot */}
                  <div
                    className={cn(
                      "w-[10px] h-[10px] rounded-full border-2 mt-1.5 mr-4 z-10",
                      item.completed
                        ? "bg-green-500 border-green-500"
                        : "bg-gray-300 border-gray-300"
                    )}
                  ></div>

                  {/* Content */}
                  <div>
                    <div className="font-medium">{item.status}</div>
                    <div className="text-gray-500 text-sm">
                      {item.description}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
