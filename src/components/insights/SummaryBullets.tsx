"use client"

import { Lightbulb } from "lucide-react"

interface SummaryBulletsProps {
  bullets: string[]
}

export default function SummaryBullets({ bullets }: SummaryBulletsProps) {
  if (bullets.length === 0) return null

  return (
    <div className="rounded-2xl border border-border bg-card p-6">
      <h3 className="font-heading text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
        <Lightbulb className="w-5 h-5 text-amber-500" />
        Key Takeaways
      </h3>
      <ul className="space-y-3">
        {bullets.map((bullet, i) => (
          <li
            key={i}
            className="flex items-start gap-3 text-sm text-muted-foreground leading-relaxed"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-2 flex-shrink-0" />
            {bullet}
          </li>
        ))}
      </ul>
    </div>
  )
}
