import StatCard from "@/components/dashboard/StatCard"
import { getDashboardStats } from "@/lib/dashboard-data"

const Home = () => {
  const stats = getDashboardStats()

  return (
    <div className="w-full">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slateGray">Dashboard</h1>
        <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-0.5">Welcome back — here&apos;s your store overview</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <StatCard
            key={stat.title}
            title={stat.title}
            value={stat.value}
            growth={stat.growth}
            icon={stat.icon}
          />
        ))}
      </div>
    </div>
  )
}

export default Home