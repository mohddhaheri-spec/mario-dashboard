import { NextResponse } from 'next/server'

export interface Skill {
  id: string
  name: string
  description: string
  category: string
  uses: number
  lastUsed?: string
}

const SKILLS: Skill[] = [
  { id: 'apple-notes', name: 'Apple Notes', description: 'Manage Apple Notes via the memo CLI on macOS', category: 'Productivity', uses: 12 },
  { id: 'apple-reminders', name: 'Apple Reminders', description: 'Manage Apple Reminders via remindctl CLI', category: 'Productivity', uses: 8 },
  { id: 'bear-notes', name: 'Bear Notes', description: 'Create, search, and manage Bear notes via grizzly CLI', category: 'Productivity', uses: 5 },
  { id: 'blogwatcher', name: 'Blog Watcher', description: 'Monitor blogs and RSS/Atom feeds for updates', category: 'Research', uses: 15 },
  { id: 'camsnap', name: 'CamSnap', description: 'Capture frames or clips from RTSP/ONVIF cameras', category: 'Devices', uses: 3 },
  { id: 'clawhub', name: 'ClawHub', description: 'Search, install, update, and publish agent skills', category: 'System', uses: 22 },
  { id: 'gemini', name: 'Gemini', description: 'Gemini CLI for one-shot Q&A, summaries, and generation', category: 'AI', uses: 18 },
  { id: 'gh-issues', name: 'GH Issues', description: 'Fetch GitHub issues, spawn sub-agents to implement fixes and open PRs', category: 'Development', uses: 9 },
  { id: 'gifgrep', name: 'GifGrep', description: 'Search GIF providers with CLI/TUI, download results', category: 'Media', uses: 4 },
  { id: 'github', name: 'GitHub', description: 'GitHub operations via gh CLI: issues, PRs, CI runs, code review', category: 'Development', uses: 31 },
  { id: 'gog', name: 'Google Workspace', description: 'Google Workspace CLI for Gmail, Calendar, Drive, Contacts, Sheets, Docs', category: 'Productivity', uses: 44 },
  { id: 'healthcheck', name: 'Health Check', description: 'Host security hardening and risk-tolerance configuration', category: 'System', uses: 7 },
  { id: 'himalaya', name: 'Himalaya', description: 'CLI to manage emails via IMAP/SMTP', category: 'Communication', uses: 19 },
  { id: 'imsg', name: 'iMessage', description: 'iMessage/SMS CLI for listing chats, history, and sending messages', category: 'Communication', uses: 38 },
  { id: 'mcporter', name: 'MCPorter', description: 'List, configure, auth, and call MCP servers/tools directly', category: 'System', uses: 6 },
  { id: 'model-usage', name: 'Model Usage', description: 'CodexBar CLI local cost usage to summarize per-model usage', category: 'AI', uses: 11 },
  { id: 'nano-pdf', name: 'Nano PDF', description: 'Edit PDFs with natural-language instructions', category: 'Productivity', uses: 5 },
  { id: 'node-connect', name: 'Node Connect', description: 'Diagnose OpenClaw node connection and pairing failures', category: 'System', uses: 3 },
  { id: 'obsidian', name: 'Obsidian', description: 'Work with Obsidian vaults (plain Markdown notes)', category: 'Productivity', uses: 14 },
  { id: 'openai-whisper', name: 'Whisper', description: 'Local speech-to-text with the Whisper CLI (no API key)', category: 'AI', uses: 8 },
  { id: 'openhue', name: 'OpenHue', description: 'Control Philips Hue lights and scenes', category: 'Devices', uses: 17 },
  { id: 'oracle', name: 'Oracle', description: 'Prompt + file bundling, engines, sessions, and file attachment patterns', category: 'AI', uses: 25 },
  { id: 'ordercli', name: 'OrderCLI', description: 'Foodora-only CLI for checking past orders and active order status', category: 'Lifestyle', uses: 6 },
  { id: 'peekaboo', name: 'Peekaboo', description: 'Capture and automate macOS UI with the Peekaboo CLI', category: 'Automation', uses: 10 },
  { id: 'skill-creator', name: 'Skill Creator', description: 'Create, edit, improve, or audit AgentSkills', category: 'System', uses: 16 },
  { id: 'songsee', name: 'SongSee', description: 'Generate spectrograms and feature-panel visualizations from audio', category: 'Media', uses: 2 },
  { id: 'sonoscli', name: 'SonosCLI', description: 'Control Sonos speakers (discover/status/play/volume/group)', category: 'Devices', uses: 21 },
  { id: 'summarize', name: 'Summarize', description: 'Summarize or extract text/transcripts from URLs, podcasts, and local files', category: 'Research', uses: 33 },
  { id: 'things-mac', name: 'Things', description: 'Manage Things 3 via the things CLI on macOS', category: 'Productivity', uses: 28 },
  { id: 'video-frames', name: 'Video Frames', description: 'Extract frames or short clips from videos using ffmpeg', category: 'Media', uses: 7 },
  { id: 'wacli', name: 'WaCLI', description: 'Send WhatsApp messages and search/sync WhatsApp history', category: 'Communication', uses: 47 },
  { id: 'weather', name: 'Weather', description: 'Get current weather and forecasts via wttr.in or Open-Meteo', category: 'Lifestyle', uses: 29 },
  { id: 'xurl', name: 'X (Twitter)', description: 'Authenticated requests to the X API: post, reply, search, DMs', category: 'Communication', uses: 13 },
  { id: 'agent-browser', name: 'Agent Browser', description: 'Headless browser automation optimized for AI agents', category: 'Automation', uses: 20 },
  { id: 'api-gateway', name: 'API Gateway', description: 'Connect to 100+ APIs with managed OAuth (Google, Microsoft, GitHub, etc.)', category: 'Integration', uses: 35 },
  { id: 'caldav-calendar', name: 'CalDAV Calendar', description: 'Sync and query CalDAV calendars using vdirsyncer + khal', category: 'Productivity', uses: 11 },
  { id: 'self-improvement', name: 'Self Improvement', description: 'Captures learnings and errors to enable continuous improvement', category: 'System', uses: 24 },
  { id: 'word-docx', name: 'Word / DOCX', description: 'Create, inspect, and edit Microsoft Word documents', category: 'Productivity', uses: 9 },
  { id: 'qmd', name: 'QMD', description: 'Local search/indexing CLI (BM25 + vectors + rerank) with MCP mode', category: 'Research', uses: 16 },
]

export async function GET() {
  const categories = Array.from(new Set(SKILLS.map(s => s.category))).sort()
  return NextResponse.json({ skills: SKILLS, categories, total: SKILLS.length })
}
