import { Card, CardContent } from "../ui/card"

interface StatsCardProps {
  label: string
  value: string | number
  subtext?: string
}

export function StatsCard({ label, value, subtext }: StatsCardProps) {
  return (
    <Card>
      <CardContent className="p-4">
        <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
          {label}
        </p>
        <p className="mt-1 text-2xl font-semibold">
          {value}
        </p>
        {subtext && (
          <p className="mt-0.5 text-xs text-muted-foreground">
            {subtext}
          </p>
        )}
      </CardContent>
    </Card>
  )
}
