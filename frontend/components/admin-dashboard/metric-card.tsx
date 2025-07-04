"use client"
import React from 'react'
import { Card } from "../../components/ui/card"
import { ArrowRight, Users } from "lucide-react"

function MetricCard({ title, value, percentage }: any) {
  return (
    <div>
      <Card className=" w-full p-2 relative shadow-none bg-stone-200 rounded-lg">
        <div className="absolute top-5 right-5">
          <div className="w-8 h-8 rounded-full bg-red-50 flex items-center justify-center">
            <Users className="w-4 h-4 text-red-500" />
          </div>
        </div>
        <div className="space-y-2">
          <div className="bg-white p-3 rounded-md">
            <p className="text-xs font-medium text-gray-500 uppercase">{title}</p>
            <div className="flex items-center gap-2">
              <h2 className="text-2xl font-bold">{value}</h2>
              <span className={`text-xs font-medium px-1.5 py-0.5 rounded-full ${isGrowth(percentage) ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>{percentage}</span>
            </div>
          </div>
        </div>
      </Card>
    </div>
  )
}

export default MetricCard


function isGrowth(percentage: string): boolean {
  const cleaned = percentage?.replace('%', '').trim();
  const value = parseFloat(cleaned);
  return value > 0;
}