import { Card, CardContent } from "@/components/ui/card"
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
    <Card className="shadow-sm hover:shadow-md transition-shadow border border-gray-100 dark:border-zinc-800">
      <CardContent className="p-5 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 rounded-xl bg-themeColor/10 dark:bg-themeColor/20 flex items-center justify-center shrink-0">
            <Icon className="text-lg text-themeColor" />
          </div>
          <div>
            <h3 className="text-2xl font-bold text-slateGray">{value}</h3>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">{title}</p>
          </div>
        </div>

        <span className="text-xs font-semibold px-2 py-1 rounded-full bg-green-100 dark:bg-green-950/50 text-green-700 dark:text-green-400">
          {growth}
        </span>
      </CardContent>
    </Card>
  )
}

export default StatCard
