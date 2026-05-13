import { Button } from "@/components/ui/button"
import {
  Card,
  CardAction,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

type ActionCardProps = {
  title: string
  detail: string
  action: string
  onAction?: () => void
}

function ActionCard({ title, detail, action, onAction }: ActionCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardAction>
          <Button type="button" size="sm" variant="outline" className="touch-manipulation" onClick={onAction}>
            {action}
          </Button>
        </CardAction>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground">{detail}</p>
      </CardContent>
    </Card>
  )
}

export default ActionCard
