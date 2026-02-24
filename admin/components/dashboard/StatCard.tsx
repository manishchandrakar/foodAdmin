import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { IconType } from "react-icons"

export interface IStatCardProps {
  title: string
  value: string
  growth: string
  icon: IconType
}

const StatCard = (props: IStatCardProps) => {
  const { title, value, growth, icon } = props
  const Icon = icon

  return (
    <Card className="shadow-md hover:shadow-lg transition">
      <CardContent className="p-6 flex items-center justify-between">
        
        <div className="flex items-center gap-4">
          <Icon className="text-2xl text-indigo-500" />

          <div>
            <h3 className="text-2xl font-bold">{value}</h3>
            <p className="text-sm text-muted-foreground">{title}</p>
          </div>
        </div>

        <Badge className="bg-green-100 text-green-600">
          {growth}
        </Badge>
      </CardContent>
    </Card>
  )
}

export default StatCard