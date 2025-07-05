import type React from "react"
import { CheckCircle, Circle } from "lucide-react"

interface TimelineItem {
  date: string
  status: string
  description: string
  completed: boolean
  icon?: React.ReactNode
}

interface ShippingTimelineProps {
  items: TimelineItem[]
}

export default function ShippingTimeline({ items }: ShippingTimelineProps) {
  return (
    <div className="space-y-6">
      {items.map((item, index) => (
        <div key={index} className="flex items-start space-x-4">
          {/* Timeline dot */}
          <div className="flex flex-col items-center">
            <div
              className={`flex items-center justify-center w-10 h-10 rounded-full border-2 ${item.completed
                  ? "bg-green-100 border-green-500 text-green-600"
                  : "bg-gray-100 border-gray-300 text-gray-400"
                }`}
            >
              {item.icon || (item.completed ? <CheckCircle className="w-5 h-5" /> : <Circle className="w-5 h-5" />)}
            </div>
            {/* Connecting line */}
            {index < items.length - 1 && (
              <div className={`w-0.5 h-12 mt-2 ${item.completed ? "bg-green-300" : "bg-gray-200"}`} />
            )}
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between">
              <h3 className={`text-sm font-medium ${item.completed ? "text-gray-900" : "text-gray-500"}`}>
                {item.status}
              </h3>
              <span className={`text-xs ${item.completed ? "text-gray-600" : "text-gray-400"}`}>{item.date}</span>
            </div>
            <p className={`text-sm mt-1 ${item.completed ? "text-gray-600" : "text-gray-400"}`}>{item.description}</p>
          </div>
        </div>
      ))}
    </div>
  )
}
