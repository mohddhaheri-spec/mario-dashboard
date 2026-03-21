'use client'

import { useEffect, useState } from 'react'
import { MetricCards } from '@/components/MetricCards'
import { UsageLineChart } from '@/components/UsageLineChart'
import { ModelPieChart } from '@/components/ModelPieChart'
import { SkillsGrid } from '@/components/SkillsGrid'
import type { UsageSummary } from './api/usage/route'
import type { Skill } from './api/skills/route'

export default function Dashboard() {
  const [usage, setUsage] = useState<UsageSummary | null>(null)
  const [skills, setSkills] = useState<Skill[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      try {
        const [usageRes, skillsRes] = await Promise.all([
          fetch('/api/usage'),
          fetch('/api/skills'),
        ])
        const usageData = await usageRes.json()
        const skillsData = await skillsRes.json()
        setUsage(usageData)
        setSkills(skillsData.skills)
      } catch (err) {
        console.error('Failed to load data:', err)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  return (
    <div className="min-h-screen bg-zinc-950">
      {/* Header */}
      <header className="border-b border-zinc-800 bg-zinc-950/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center">
              <span className="text-emerald-400 text-sm font-bold">M</span>
            </div>
            <div>
              <h1 className="text-white font-semibold text-lg leading-none">Mario Dashboard</h1>
              <p className="text-zinc-500 text-xs mt-0.5">OpenClaw Agent Intelligence</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
            <span className="text-zinc-400 text-sm">Live</span>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-8 space-y-8">
        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="text-center space-y-3">
              <div className="w-8 h-8 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
              <p className="text-zinc-400 text-sm">Loading intelligence data...</p>
            </div>
          </div>
        ) : (
          <>
            {/* Row 1: Metric Cards */}
            <MetricCards usage={usage} skillsCount={skills.length} />

            {/* Row 2: Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <UsageLineChart usage={usage} />
              </div>
              <div>
                <ModelPieChart usage={usage} />
              </div>
            </div>

            {/* Row 3: Skills Grid */}
            <SkillsGrid skills={skills} />
          </>
        )}
      </main>

      <footer className="border-t border-zinc-800 mt-16">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <p className="text-zinc-600 text-xs">Mario · OpenClaw Agent Dashboard</p>
          <p className="text-zinc-600 text-xs">{new Date().toLocaleDateString('en-AE', { timeZone: 'Asia/Dubai', dateStyle: 'long' })}</p>
        </div>
      </footer>
    </div>
  )
}
