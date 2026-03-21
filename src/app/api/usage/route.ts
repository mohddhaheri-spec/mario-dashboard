import { NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'
import os from 'os'
import readline from 'readline'

export interface UsageEntry {
  model: string
  inputTokens: number
  outputTokens: number
  totalTokens: number
  cost: number
  timestamp: number
  date: string
}

export interface UsageSummary {
  totalInput: number
  totalOutput: number
  totalTokens: number
  totalCost: number
  todayTokens: number
  todayCost: number
  topModel: string
  byModel: Record<string, { input: number; output: number; total: number; cost: number; count: number }>
  daily: Record<string, Record<string, number>>
  entries: UsageEntry[]
}

async function parseJsonlFile(filePath: string): Promise<UsageEntry[]> {
  const entries: UsageEntry[] = []
  try {
    const fileStream = fs.createReadStream(filePath)
    const rl = readline.createInterface({ input: fileStream, crlfDelay: Infinity })

    for await (const line of rl) {
      if (!line.trim()) continue
      try {
        const obj = JSON.parse(line)
        // Handle format: { type: "message", message: { role: "assistant", model, usage, ... } }
        const msg = obj?.message
        if (!msg) continue
        if (msg.role !== 'assistant') continue
        const usage = msg.usage
        if (!usage) continue

        const inputTokens = usage.input ?? usage.input_tokens ?? 0
        const outputTokens = usage.output ?? usage.output_tokens ?? 0
        const totalTokens = usage.totalTokens ?? (inputTokens + outputTokens)
        const cost = usage.cost?.total ?? 0
        const model = msg.model ?? 'unknown'
        const timestamp = obj.timestamp
          ? new Date(obj.timestamp).getTime()
          : (msg.timestamp ?? Date.now())

        if (inputTokens === 0 && outputTokens === 0) continue

        const date = new Date(typeof timestamp === 'number' && timestamp > 1e12 ? timestamp : timestamp * 1000)
          .toISOString().slice(0, 10)

        entries.push({ model, inputTokens, outputTokens, totalTokens, cost, timestamp: Number(timestamp), date })
      } catch {
        // skip malformed lines
      }
    }
  } catch {
    // skip unreadable files
  }
  return entries
}

export async function GET() {
  const sessionsDir = path.join(os.homedir(), '.openclaw', 'agents', 'main', 'sessions')
  const summary: UsageSummary = {
    totalInput: 0,
    totalOutput: 0,
    totalTokens: 0,
    totalCost: 0,
    todayTokens: 0,
    todayCost: 0,
    topModel: 'unknown',
    byModel: {},
    daily: {},
    entries: [],
  }

  try {
    const files = fs.readdirSync(sessionsDir).filter(f => f.endsWith('.jsonl'))
    const allEntries: UsageEntry[] = []

    for (const file of files) {
      const entries = await parseJsonlFile(path.join(sessionsDir, file))
      allEntries.push(...entries)
    }

    const today = new Date().toISOString().slice(0, 10)

    for (const entry of allEntries) {
      summary.totalInput += entry.inputTokens
      summary.totalOutput += entry.outputTokens
      summary.totalTokens += entry.totalTokens
      summary.totalCost += entry.cost

      if (entry.date === today) {
        summary.todayTokens += entry.totalTokens
        summary.todayCost += entry.cost
      }

      if (!summary.byModel[entry.model]) {
        summary.byModel[entry.model] = { input: 0, output: 0, total: 0, cost: 0, count: 0 }
      }
      summary.byModel[entry.model].input += entry.inputTokens
      summary.byModel[entry.model].output += entry.outputTokens
      summary.byModel[entry.model].total += entry.totalTokens
      summary.byModel[entry.model].cost += entry.cost
      summary.byModel[entry.model].count++

      // Daily aggregation
      if (!summary.daily[entry.date]) {
        summary.daily[entry.date] = {}
      }
      if (!summary.daily[entry.date][entry.model]) {
        summary.daily[entry.date][entry.model] = 0
      }
      summary.daily[entry.date][entry.model] += entry.totalTokens
    }

    // Find top model by total tokens
    let maxTokens = 0
    for (const [model, data] of Object.entries(summary.byModel)) {
      if (data.total > maxTokens) {
        maxTokens = data.total
        summary.topModel = model
      }
    }

    summary.entries = allEntries.sort((a, b) => b.timestamp - a.timestamp).slice(0, 200)
  } catch (err) {
    console.error('Error reading sessions:', err)
  }

  return NextResponse.json(summary)
}
