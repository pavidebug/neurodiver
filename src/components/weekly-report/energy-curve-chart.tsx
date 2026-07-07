import { formatDisplayDate } from '@/lib/dates'
import type { WeeklyReportEnergyPoint } from '@/types/work-energy'

interface EnergyCurveChartProps {
  points: WeeklyReportEnergyPoint[]
}

const CHART_HEIGHT = 160
const CHART_WIDTH = 320
const PADDING = { top: 16, right: 12, bottom: 28, left: 28 }

function scaleY(value: number, innerHeight: number): number {
  return PADDING.top + innerHeight - ((value - 1) / 4) * innerHeight
}

function dayLabel(date: string): string {
  return new Date(`${date}T12:00:00`).toLocaleDateString('en-US', {
    weekday: 'short',
  })
}

export function EnergyCurveChart({ points }: EnergyCurveChartProps) {
  const innerWidth = CHART_WIDTH - PADDING.left - PADDING.right
  const innerHeight = CHART_HEIGHT - PADDING.top - PADDING.bottom
  const stepX = innerWidth / Math.max(points.length - 1, 1)

  function buildPath(
    accessor: (point: WeeklyReportEnergyPoint) => number | null,
  ): string {
    const segments: string[] = []

    points.forEach((point, index) => {
      const value = accessor(point)
      if (value === null) return

      const x = PADDING.left + index * stepX
      const y = scaleY(value, innerHeight)
      segments.push(`${segments.length === 0 ? 'M' : 'L'} ${x} ${y}`)
    })

    return segments.join(' ')
  }

  const energyPath = buildPath((point) => point.energyTank)
  const maskingPath = buildPath((point) => point.maskingLoad)

  return (
    <div className="overflow-x-auto">
      <svg
        viewBox={`0 0 ${CHART_WIDTH} ${CHART_HEIGHT}`}
        className="w-full min-w-[280px]"
        role="img"
        aria-label="Energy tank and masking load across the week"
      >
        {[1, 2, 3, 4, 5].map((level) => {
          const y = scaleY(level, innerHeight)
          return (
            <line
              key={level}
              x1={PADDING.left}
              y1={y}
              x2={CHART_WIDTH - PADDING.right}
              y2={y}
              stroke="currentColor"
              strokeOpacity={0.08}
            />
          )
        })}

        {energyPath && (
          <path
            d={energyPath}
            fill="none"
            stroke="#2d6a4f"
            strokeWidth={2.5}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        )}

        {maskingPath && (
          <path
            d={maskingPath}
            fill="none"
            stroke="#e07a2f"
            strokeWidth={2.5}
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeDasharray="6 4"
          />
        )}

        {points.map((point, index) => {
          const x = PADDING.left + index * stepX

          return (
            <g key={point.date}>
              <text
                x={x}
                y={CHART_HEIGHT - 6}
                textAnchor="middle"
                className="fill-text-muted text-[10px]"
              >
                {dayLabel(point.date)}
              </text>

              {point.energyTank !== null && (
                <circle
                  cx={x}
                  cy={scaleY(point.energyTank, innerHeight)}
                  r={4}
                  fill="#2d6a4f"
                />
              )}

              {point.maskingLoad !== null && (
                <circle
                  cx={x}
                  cy={scaleY(point.maskingLoad, innerHeight)}
                  r={4}
                  fill="#e07a2f"
                />
              )}
            </g>
          )
        })}
      </svg>

      <div className="mt-3 flex flex-wrap gap-4 text-sm text-text-muted">
        <span className="inline-flex items-center gap-2">
          <span className="h-0.5 w-6 bg-green" aria-hidden="true" />
          Energy tank
        </span>
        <span className="inline-flex items-center gap-2">
          <span
            className="h-0.5 w-6 border-t-2 border-dashed border-orange"
            aria-hidden="true"
          />
          Masking load
        </span>
      </div>

      <p className="mt-2 text-xs text-text-muted">
        Days without a check-in are skipped on the chart.
      </p>
    </div>
  )
}

export function formatReportDateRange(start: string, end: string): string {
  return `${formatDisplayDate(start)} – ${formatDisplayDate(end)}`
}
