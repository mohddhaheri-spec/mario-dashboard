'use client'

import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts'
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
  'claude-sonnet-4-6': 'Claude Sonnet',
  'claude-haiku-4-5-20251001': 'Claude Haiku',
  'claude-opus-4-6': 'Claude Opus',
  'gpt-5.1-codex': 'GPT-5.1 Codex',
  'gpt-4o': 'GPT-4o',
  'gpt-4': 'GPT-4',
}

const FALLBACK_COLORS = ['#10b981', '#6366f1', '#f59e0b', '#3b82f6', '#8b5cf6', '#ec4899', '#14b8a6', '#f43f5e']

function CustomTooltip({ active, payload }: { active?: boolean; payload?: Array<{ name: string; value: number; payload: { percent: number } }> }) {
  if (!active || !payload?.length) return null
  const item = payload[0]
  return (
    <div className="bg-zinc-900 border border-zinc-700 rounded-lg p-3 shadow-xl">
      <p className="text-zinc-300 text-xs font-medium">{item.name}</p>
      <p className="text-white text-sm font-bold mt-1">
        {item.value >= 1000 ? `${(item.value / 1000).toFixed(1)}K` : item.value} tokens
      </p>
      <p className="text-zinc-400 text-xs">{(item.payload.percent * 100).toFixed(1)}%</p>
    </div>
  )
}

export function ModelPieChart({ usage }: Props) {
  let data: Array<{ name: string; value: number; color: string }> = []

  if (usage && Object.keys(usage.byModel).length > 0) {
    data = Object.entries(usage.byModel)
      .map(([model, stats], i) => ({
        name: MODEL_LABELS[model] ?? model,
        value: stats.total,
        color: MODEL_COLORS[model] ?? FALLBACK_COLORS[i % FALLBACK_COLORS.length],
      }))
      .sort((a, b) => b.value - a.value)
  } else {
    // Fallback mock
    data = [
      { name: 'Claude Sonnet', value: 340000, color: '#10b981' },
      { name: 'GPT-5.1 Codex', value: 120000, color: '#3b82f6' },
      { name: 'Claude Haiku', value: 85000, color: '#6366f1' },
    ]
  }

  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5 h-full flex flex-col">
      <div className="mb-4">
        <h2 className="text-white font-semibold">By Model</h2>
        <p className="text-zinc-500 text-xs mt-1">Token share per model</p>
      </div>
      <div className="flex-1">
        <ResponsiveContainer width="100%" height={220}>
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="45%"
              innerRadius={60}
              outerRadius={90}
              paddingAngle={3}
              dataKey="value"
            >
              {data.map((entry, i) => (
                <Cell key={i} fill={entry.color} stroke="transparent" />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
          </PieChart>
        </ResponsiveContainer>
      </div>
      {/* Legend */}
      <div className="space-y-2 mt-2">
        {data.map((item, i) => (
          <div key={i} className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: item.color }} />
              <span className="text-zinc-400 text-xs truncate max-w-[120px]">{item.name}</span>
            </div>
            <span className="text-zinc-300 text-xs font-medium tabular-nums">
              {item.value >= 1000 ? `${(item.value / 1000).toFixed(0)}K` : item.value}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}
