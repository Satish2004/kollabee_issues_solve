"use client"
import React, { useState } from 'react'
import { Chart } from "react-google-charts";

function BuyerGeoChart() {

  const [loading, setLoading] = useState(false)
  const [regionData, setRegionData] = useState([
    { region: "Europe", users: 580 },
    { region: "Asia", users: 103 },
    { region: "Africa", users: 239 },
    { region: "Australia", users: 78 },
    { region: "America", users: 78 },
  ])

  const [geoChartData, setGeoChartData] = useState([
    ["Country", "Popularity"],
    ["Germany", 200],
    ["United States", 300],
    ["Brazil", 400],
    ["Canada", 500],
    ["France", 600],
    ["RU", 700],
  ])

  const options = {
    datalessRegionColor: "#fdeff0",
    colorAxis: { colors: ["#efaf68", "#6e114c"] },
  };

  // Calculate the max value for progress bar based on the user's requirement
  const calculateMaxValue = (value) => {
    if (value < 10) return 10
    if (value < 100) return 100
    if (value < 1000) return 1000
    if (value < 10000) return 10000
    return 100000
  }

  // Calculate width percentage for progress bar
  const calculateWidth = (value) => {
    const max = calculateMaxValue(value)
    return (value / max) * 100
  }

  return (
    <div>
      <div className="flex flex-col w-full">
        <h2 className="text-lg font-semibold text-gray-800 pb-2 border-b border-gray-200">Top region of buyers</h2>

        <div className="mt-4 p-5 bg-white rounded-lg border border-gray-200 shadow-sm">
          <div className="flex items-start mb-6">
            <div className="flex-1">
              <h3 className="text-base font-medium text-gray-800">Customer Map Location</h3>
              <p className="text-sm text-gray-500">Report Center</p>
            </div>
          </div>

          <div className="flex flex-col md:flex-row gap-8">
            {/* Left side - Region data with progress bars */}
            <div className="w-full md:w-1/3 space-y-6">
              {regionData.map((item) => (
                <div key={item.region} className="space-y-1">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-gray-700">{item.region}</span>
                    <span className="text-sm text-gray-500">{item.users} Users</span>
                  </div>
                  <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-l from-[#6f124c] via-[#db4e60] to-[#ecac67] rounded-full"
                      style={{ width: `${calculateWidth(item.users)}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>

            {/* Right side - Geo Chart */}
            <div className="w-full md:w-2/3 h-[300px]">
              {loading ? (
                <div className="w-full h-full flex items-center justify-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                </div>
              ) : (
                <Chart
                  chartEvents={[
                    {
                      eventName: "select",
                      callback: ({ chartWrapper }) => {
                        const chart = chartWrapper.getChart();
                        const selection = chart.getSelection();
                        if (selection.length === 0) return;
                        const region = data[selection[0].row + 1];
                      },
                    },
                  ]}
                  chartType="GeoChart"
                  width="100%"
                  height="100%"
                  data={geoChartData}
                  options={options}
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default BuyerGeoChart