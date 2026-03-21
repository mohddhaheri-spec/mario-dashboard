'use client'

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts'
import type { UsageSummary } from '@/app/api/usage/route'

interface Props {
  usage: UsageSummary | null
}

const MODEL_COLORS: Record<string, string> = {
  'claude-sonnet-4-6': '#10b981',
  'claude-haiku-4-5-20251001': '#6366f1',
  'claude-opus-4-6': '#f59e0b',
  'gpt-5.1-codex': '#3b82f6',
  'gpt-4o': '#8b5cf6',
  'gpt-4': '#ec4899',
}

const MODEL_LABELS: Record<string, string> = {
  'claude-sonnet-4-6': 'Sonnet',
  'claude-haiku-4-5-20251001': 'Haiku',
  'claude-opus-4-6': 'Opus',
  'gpt-5.1-codex': 'GPT-5.1',
  'gpt-4o': 'GPT-4o',
  'gpt-4': 'GPT-4',
}

const FALLBACK_COLORS = ['#10b981', '#6366f1', '#f59e0b', '#3b82f6', '#8b5cf6', '#ec4899']

function getLast7Days(): string[] {
  const days = []
  for (let i = 6; i >= 0; i--) {
    const d = new Date()
    d.setDate(d.getDate() - i)
    days.push(d.toISOString().slice(0, 10))
  }
  return days
}

function formatDate(dateStr: string): string {
  const d = new Date(dateStr + 'T12:00:00')
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
}

function formatYAxis(value: number): string {
  if (value >= 1000) return `${(value / 1000).toFixed(0)}K`
  return value.toString()
}

// Custom tooltip
function CustomTooltip({ active, payload, label }: { active?: boolean; payload?: Array<{ name: string; value: number; color: string }>; label?: string }) {
  if (!active || !payload?.length) return null
  return (
    <div className="bg-zinc-900 border border-zinc-700 rounded-lg p-3 shadow-xl">
      <p className="text-zinc-300 text-xs font-medium mb-2">{label}</p>
      {payload.map((entry, i) => (
        <div key={i} className="flex items-center gap-2 text-xs">
          <div className="w-2 h-2 rounded-full" style={{ background: entry.color }} />
          <span className="text-zinc-400">{entry.name}:</span>
          <span className="text-white font-medium">{entry.value >= 1000 ? `${(entry.value / 1000).toFixed(1)}K` : entry.value}</span>
        </div>
      ))}
    </div>
  )
}

export function UsageLineChart({ usage }: Props) {
  const days = getLast7Days()

  // Build chart data
  let models: string[] = []
  let chartData: Array<Record<string, string | number>> = []

  if (usage && Object.keys(usage.daily).length > 0) {
    models = Array.from(
      new Set(Object.values(usage.daily).flatMap(d => Object.keys(d)))
    )
    chartData = days.map(day => {
      const row: Record<string, string | number> = { date: formatDate(day) }
      for (const model of models) {
        row[MODEL_LABELS[model] ?? model] = usage.daily[day]?.[model] ?? 0
      }
      return row
    })
  } else {
    // Fallback mock data
    models = ['claude-sonnet-4-6', 'gpt-5.1-codex']
    chartData = days.map((day, i) => ({
      date: formatDate(day),
      'Sonnet': Math.floor(Math.random() * 50000 + 10000),
      'GPT-5.1': Math.floor(Math.random() * 20000 + 5000),
    }))
  }

  const modelLabels = models.map(m => MODEL_LABELS[m] ?? m)

  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5">
      <div className="mb-5">
        <h2 className="text-white font-semibold">Token Usage · Last 7 Days</h2>
        <p className="text-zinc-500 text-xs mt-1">Daily token consumption by model</p>
      </div>
      <ResponsiveContainer width="100%" height={260}>
        <LineChart data={chartData} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#27272a" vertical={false} />
          <XAxis
            dataKey="date"
            tick={{ fill: '#71717a', fontSize: 11 }}
            axisLine={{ stroke: '#27272a' }}
            tickLine={false}
          />
          <YAxis
            tickFormatter={formatYAxis}
            tick={{ fill: '#71717a', fontSize: 11 }}
            axisLine={false}
            tickLine={false}
            width={40}
          />
          <Tooltip content={<CustomTooltip />} />
          <Legend
            wrapperStyle={{ paddingTop: '16px' }}
            formatter={(value) => <span style={{ color: '#a1a1aa', fontSize: '11px' }}>{value}</span>}
          />
          {modelLabels.map((label, i) => (
            <Line
              key={label}
              type="monotone"
              dataKey={label}
              stroke={MODEL_COLORS[models[i]] ?? FALLBACK_COLORS[i % FALLBACK_COLORS.length]}
              strokeWidth={2}
              dot={{ r: 3, fill: MODEL_COLORS[models[i]] ?? FALLBACK_COLORS[i % FALLBACK_COLORS.length] }}
              activeDot={{ r: 5 }}
            />
          ))}
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}
