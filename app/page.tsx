import Header from '@/components/header'
import Dashboard from '@/components/dashboard'

export default function Home() {
  return (
    <div className="h-screen flex flex-col bg-white">
      <Header />
      <Dashboard />
    </div>
  )
}
