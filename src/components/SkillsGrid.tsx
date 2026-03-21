'use client'

import { useState } from 'react'
import type { Skill } from '@/app/api/skills/route'

interface Props {
  skills: Skill[]
}

const CATEGORY_COLORS: Record<string, string> = {
  'Productivity': 'bg-blue-500/10 text-blue-400 border-blue-500/20',
  'Communication': 'bg-purple-500/10 text-purple-400 border-purple-500/20',
  'Development': 'bg-orange-500/10 text-orange-400 border-orange-500/20',
  'AI': 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
  'Research': 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20',
  'Automation': 'bg-pink-500/10 text-pink-400 border-pink-500/20',
  'Devices': 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20',
  'System': 'bg-zinc-500/10 text-zinc-400 border-zinc-500/20',
  'Lifestyle': 'bg-rose-500/10 text-rose-400 border-rose-500/20',
  'Media': 'bg-violet-500/10 text-violet-400 border-violet-500/20',
  'Integration': 'bg-teal-500/10 text-teal-400 border-teal-500/20',
}

function getBadgeColor(uses: number): string {
  if (uses >= 30) return 'bg-emerald-500/15 text-emerald-400'
  if (uses >= 15) return 'bg-blue-500/15 text-blue-400'
  if (uses >= 5) return 'bg-zinc-700/50 text-zinc-400'
  return 'bg-zinc-800/50 text-zinc-600'
}

export function SkillsGrid({ skills }: Props) {
  const [filter, setFilter] = useState<string>('All')
  const [search, setSearch] = useState('')

  const categories = ['All', ...Array.from(new Set(skills.map(s => s.category))).sort()]

  const filtered = skills.filter(skill => {
    const matchCat = filter === 'All' || skill.category === filter
    const matchSearch = !search || skill.name.toLowerCase().includes(search.toLowerCase()) ||
      skill.description.toLowerCase().includes(search.toLowerCase())
    return matchCat && matchSearch
  })

  return (
    <div>
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
        <div>
          <h2 className="text-white font-semibold text-lg">Skills Library</h2>
          <p className="text-zinc-500 text-xs mt-1">{skills.length} skills available · {filtered.length} shown</p>
        </div>
        <div className="flex items-center gap-3 w-full sm:w-auto">
          {/* Search */}
          <div className="relative flex-1 sm:w-56">
            <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-zinc-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              placeholder="Search skills..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full bg-zinc-900 border border-zinc-800 rounded-lg pl-8 pr-3 py-2 text-zinc-300 text-xs placeholder-zinc-600 focus:outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/20"
            />
          </div>
        </div>
      </div>

      {/* Category filters */}
      <div className="flex flex-wrap gap-2 mb-6">
        {categories.map(cat => (
          <button
            key={cat}
            onClick={() => setFilter(cat)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
              filter === cat
                ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                : 'bg-zinc-900 text-zinc-400 border border-zinc-800 hover:border-zinc-700 hover:text-zinc-300'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
        {filtered.map(skill => (
          <div
            key={skill.id}
            className="bg-zinc-900 border border-zinc-800 rounded-xl p-4 hover:border-zinc-700 transition-colors group"
          >
            <div className="flex items-start justify-between gap-2 mb-3">
              <div className="flex-1 min-w-0">
                <h3 className="text-white text-sm font-semibold truncate group-hover:text-emerald-400 transition-colors">
                  {skill.name}
                </h3>
              </div>
              <span className={`flex-shrink-0 text-xs px-1.5 py-0.5 rounded font-medium tabular-nums ${getBadgeColor(skill.uses)}`}>
                {skill.uses}×
              </span>
            </div>
            <p className="text-zinc-500 text-xs leading-relaxed line-clamp-2 mb-3">
              {skill.description}
            </p>
            <span className={`inline-flex items-center text-xs px-2 py-0.5 rounded-md border ${CATEGORY_COLORS[skill.category] ?? 'bg-zinc-800 text-zinc-400 border-zinc-700'}`}>
              {skill.category}
            </span>
          </div>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-16">
          <p className="text-zinc-600 text-sm">No skills match your search</p>
        </div>
      )}
    </div>
  )
}
