"use client"

import * as React from "react"
import { cn } from "@/lib/utils"
import type { TooltipProps } from "recharts"
import { ResponsiveContainer, Tooltip } from "recharts"

// =============================================================================
// Chart Container
// =============================================================================

interface ChartConfig {
  [key: string]: {
    label: string
    color?: string
    icon?: React.ElementType
  }
}

interface ChartContextValue {
  config: ChartConfig
  colors: Record<string, string>
}

const ChartContext = React.createContext<ChartContextValue | null>(null)

interface ChartContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  config: ChartConfig
}

export function ChartContainer({ config, className, children, ...props }: ChartContainerProps) {
  // Create CSS variables for each color in the config
  const colors = Object.entries(config).reduce<Record<string, string>>((acc, [key, value]) => {
    if (value.color) {
      acc[`--color-${key}`] = value.color
    }
    return acc
  }, {})

  // Create a style object with the CSS variables
  const style = {
    ...colors,
  }

  return (
    <ChartContext.Provider value={{ config, colors }}>
      <div className={cn("w-full h-full", className)} style={style} {...props}>
        <ResponsiveContainer width="100%" height="100%">
          {children}
        </ResponsiveContainer>
      </div>
    </ChartContext.Provider>
  )
}

// =============================================================================
// Chart Tooltip
// =============================================================================

export function useChartContext() {
  const context = React.useContext(ChartContext)
  if (!context) {
    throw new Error("useChartContext must be used within a ChartContainer")
  }
  return context
}

interface ChartTooltipProps extends Omit<TooltipProps<any, any>, "content"> {
  content?: React.ReactNode
  indicator?: "line" | "dashed" | false
  defaultIndex?: number
}

export function ChartTooltip({ content, indicator = "line", defaultIndex, ...props }: ChartTooltipProps) {
  const [activeIndex, setActiveIndex] = React.useState<number | null>(defaultIndex ?? null)

  React.useEffect(() => {
    if (defaultIndex !== undefined) {
      setActiveIndex(defaultIndex)
    }
  }, [defaultIndex])

  return (
    <Tooltip
      content={content}
      {...props}
      cursor={
        indicator
          ? {
              stroke: "var(--tooltip-stroke, hsl(var(--muted-foreground)))",
              strokeWidth: 1,
              strokeDasharray: indicator === "dashed" ? "5 5" : undefined,
              fill: "transparent",
            }
          : false
      }
      onMouseEnter={(data) => {
        if (data.activeTooltipIndex !== undefined) {
          setActiveIndex(data.activeTooltipIndex)
        }
      }}
      onMouseLeave={() => {
        if (defaultIndex !== undefined) {
          setActiveIndex(defaultIndex)
        }
      }}
    />
  )
}

// =============================================================================
// Chart Tooltip Content
// =============================================================================

interface ChartTooltipContentProps {
  active?: boolean
  payload?: Array<{
    name: string
    value: number
    payload: {
      [key: string]: any
    }
  }>
  label?: string
  labelKey?: string
  labelFormat?: (label: string) => string
  valueFormat?: (value: number) => string
  formatter?: (value: number, name: string, props: any) => [string, string]
  hideLabel?: boolean
  hideValue?: boolean
  hideColor?: boolean
  indicator?: "line" | "dot"
}

export function ChartTooltipContent({
  active,
  payload,
  label,
  labelKey,
  labelFormat,
  valueFormat,
  formatter,
  hideLabel = false,
  hideValue = false,
  hideColor = false,
  indicator = "dot",
}: ChartTooltipContentProps) {
  const { config } = useChartContext()

  if (!active || !payload?.length) {
    return null
  }

  const formattedLabel = labelFormat ? labelFormat(label!) : label

  return (
    <div className="rounded-lg border bg-background p-2 shadow-md">
      {!hideLabel && (
        <div className="px-3 py-1.5">
          <div className="font-medium">{labelKey ? config[labelKey]?.label : formattedLabel}</div>
        </div>
      )}
      <div className="px-2">
        {payload.map((item, index) => {
          const dataKey = item.name
          const itemConfig = config[dataKey]
          const itemColor = itemConfig?.color || `var(--color-${dataKey})`
          const itemIcon = itemConfig?.icon
          const itemLabel = itemConfig?.label || dataKey
          const [formattedValue, formattedName] = formatter
            ? formatter(item.value, dataKey, item)
            : [valueFormat ? valueFormat(item.value) : item.value.toString(), itemLabel]

          return (
            <div key={index} className="flex items-center justify-between gap-2 px-1 py-1">
              <div className="flex items-center gap-1">
                {!hideColor && (
                  <>
                    {indicator === "dot" ? (
                      <div className="h-2 w-2 rounded-full" style={{ backgroundColor: itemColor }} />
                    ) : (
                      <div className="h-0.5 w-4" style={{ backgroundColor: itemColor }} />
                    )}
                  </>
                )}
                {itemIcon && (
                  <div className="text-muted-foreground">{React.createElement(itemIcon, { className: "h-3 w-3" })}</div>
                )}
                <div className="text-xs font-medium text-muted-foreground">{formattedName}</div>
              </div>
              {!hideValue && <div className="text-xs font-medium">{formattedValue}</div>}
            </div>
          )
        })}
      </div>
    </div>
  )
}
