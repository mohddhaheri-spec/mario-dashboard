'use client'

import type { UsageSummary } from '@/app/api/usage/route'

interface Props {
  usage: UsageSummary | null
  skillsCount: number
}

function formatNum(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}K`
  return n.toString()
}

function formatModel(model: string): string {
  const map: Record<string, string> = {
    'claude-sonnet-4-6': 'Claude Sonnet',
    'claude-haiku-4-5-20251001': 'Claude Haiku',
    'claude-opus-4-6': 'Claude Opus',
    'gpt-5.1-codex': 'GPT-5.1 Codex',
    'gpt-4o': 'GPT-4o',
    'gpt-4': 'GPT-4',
    'unknown': '—',
  }
  return map[model] ?? model
}

interface CardProps {
  title: string
  value: string
  sub?: string
  icon: React.ReactNode
  accent?: boolean
}

function Card({ title, value, sub, icon, accent }: CardProps) {
  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5 flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <span className="text-zinc-400 text-sm font-medium">{title}</span>
        <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${accent ? 'bg-emerald-500/15 text-emerald-400' : 'bg-zinc-800 text-zinc-400'}`}>
          {icon}
        </div>
      </div>
      <div>
        <p className="text-white text-2xl font-bold tracking-tight">{value}</p>
        {sub && <p className="text-zinc-500 text-xs mt-1">{sub}</p>}
      </div>
    </div>
  )
}

export function MetricCards({ usage, skillsCount }: Props) {
  const totalTokens = usage?.totalTokens ?? 0
  const todayTokens = usage?.todayTokens ?? 0
  const topModel = usage?.topModel ?? 'unknown'
  const totalCost = usage?.totalCost ?? 0

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      <Card
        title="Total Tokens"
        value={formatNum(totalTokens)}
        sub={`$${totalCost.toFixed(2)} total cost`}
        accent
        icon={
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
        }
      />
      <Card
        title="Tokens Today"
        value={formatNum(todayTokens)}
        sub={todayTokens > 0 ? `$${(usage?.todayCost ?? 0).toFixed(3)} today` : 'No activity yet'}
        icon={
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364-.707-.707M6.343 6.343l-.707-.707m12.728 0-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
          </svg>
        }
      />
      <Card
        title="Active Skills"
        value={skillsCount.toString()}
        sub="Available integrations"
        icon={
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
          </svg>
        }
      />
      <Card
        title="Top Model"
        value={formatModel(topModel)}
        sub={usage?.byModel[topModel] ? `${formatNum(usage.byModel[topModel].total)} tokens` : 'No data yet'}
        icon={
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m1.636-6.364l.707.707M12 21v-1M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
        }
      />
    </div>
  )
}
