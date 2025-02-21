"use client";

import { ArrowUp } from "lucide-react"
import { Card, CardContent } from "../ui/card"

const metricsData = [
  {
    title: "Requests",
    value: "239",
    change: "+1.68%",
    trend: "up",
  },
  {
    title: "Messages",
    value: "12",
  },
  {
    title: "Published Products",
    value: "200",
  },
]

export function MetricsCards() {
  return (
    <div className="grid gap-4 md:grid-cols-3">
      {metricsData.map((item, index) => (
        <Card key={index}>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium text-muted-foreground">
                {item.title}
              </p>
            </div>
            <div className="mt-2 flex items-center gap-2">
              <h2 className="text-2xl font-bold">{item.value}</h2>
              {item.change && (
                <div className="flex items-center gap-0.5">
                  <ArrowUp className="h-4 w-4 text-green-500" />
                  <span className="text-sm text-green-500">{item.change}</span>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
