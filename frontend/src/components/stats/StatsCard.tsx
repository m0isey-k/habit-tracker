import { Card, CardContent } from "../ui/card"

interface StatsCardProps {
  label: string
  value: string | number
  subtext?: string
  variant?: "default" | "success" | "warning"
}

export function StatsCard({ label, value, subtext, variant = "default" }: StatsCardProps) {
  const valueClass =
    variant === "success"
      ? "text-success"
      : variant === "warning"
        ? "text-destructive"
        : "text-foreground"

  return (
    <Card>
      <CardContent className="space-y-1">
        <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
          {label}
        </p>
        <p className={`text-2xl font-semibold tabular-nums ${valueClass}`}>{value}</p>
        {subtext ? <p className="text-xs text-muted-foreground">{subtext}</p> : null}
      </CardContent>
    </Card>
  )
}
