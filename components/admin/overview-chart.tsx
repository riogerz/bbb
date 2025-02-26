import { Card } from "@/components/ui/card"

export function OverviewChart() {
  return (
    <Card className="col-span-4">
      <div className="p-6">
        <h3 className="text-lg font-medium">Submissions Overview</h3>
        <div className="h-[200px] flex items-center justify-center text-muted-foreground">
          Chart data will be implemented with your preferred storage solution
        </div>
      </div>
    </Card>
  )
}

