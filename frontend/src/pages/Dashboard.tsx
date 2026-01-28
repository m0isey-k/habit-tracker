import { StatsCard } from "../components/stats/StatsCard"
import { ProgressRing } from "../components/stats/ProgressRing"

export default function Dashboard() {
  return (
    <div className="max-w-4xl mx-auto py-8 space-y-6">
      <h1 className="text-2xl font-semibold">Dashboard</h1>

      <div className="flex justify-center">
        <ProgressRing progress={67} />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatsCard label="Current streak" value="7 days" />
        <StatsCard label="Success days" value={21} />
        <StatsCard
          label="Relapses"
          value={3}
          subtext="last 30 days"
        />
      </div>
    </div>
  )
}
