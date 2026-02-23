import StatCard from "@/components/dashboard/StatCard"
import { getDashboardStats } from "@/lib/dashboard-data"

const Home = () => {
  const stats = getDashboardStats()

  return (
    <div className=" w-full bg-zinc-50 dark:bg-black p-8">

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
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