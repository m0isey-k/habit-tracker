import { Link } from "react-router-dom"
import { Card, CardContent } from "./ui/card"
import { Button } from "./ui/button"

type Props = {
  title: string
  description: string
  actionLabel?: string
  actionHref?: string
  onAction?: () => void
}

export function EmptyState({ title, description, actionLabel, actionHref, onAction }: Props) {
  const showAction = !!actionLabel && (!!actionHref || !!onAction)

  return (
    <Card className="border-dashed bg-card/50">
      <CardContent className="flex flex-col items-center justify-center py-12 text-center">
        <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-muted">
          <div className="h-6 w-6 rounded-full border-2 border-muted-foreground" />
        </div>

        <h3 className="text-lg font-medium">{title}</h3>
        <p className="mt-1 max-w-sm text-sm text-muted-foreground">{description}</p>

        {showAction ? (
          actionHref ? (
            <Button asChild className="mt-4">
              <Link to={actionHref}>{actionLabel}</Link>
            </Button>
          ) : (
            <Button className="mt-4" onClick={onAction}>
              {actionLabel}
            </Button>
          )
        ) : null}
      </CardContent>
    </Card>
  )
}
