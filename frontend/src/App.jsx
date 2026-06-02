import { useState } from 'react'
import { useAuth } from './lib/AuthContext'
import AuthPage from './pages/AuthPage'
import Sidebar from './components/Sidebar'
import Dashboard from './pages/Dashboard'
import Leads from './pages/Leads'
import AddLead from './pages/AddLead'

export default function App() {
  const { user, loading } = useAuth()
  const [page, setPage] = useState('dashboard')

  if (loading) {
    return (
      <div className="min-h-screen bg-base flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-accent/20 flex items-center justify-center">
            <div className="w-3 h-3 rounded-full bg-accent animate-pulse"/>
          </div>
          <span className="text-dim text-sm font-mono">Loading...</span>
        </div>
      </div>
    )
  }

  if (!user) return <AuthPage/>

  const pages = {
    dashboard: <Dashboard setPage={setPage}/>,
    leads: <Leads setPage={setPage}/>,
    add: <AddLead setPage={setPage}/>,
  }

  return (
    <div className="flex h-screen bg-base overflow-hidden">
      <Sidebar page={page} setPage={setPage}/>
      <main className="flex-1 overflow-y-auto">
        {pages[page] || pages.dashboard}
      </main>
    </div>
  )
}
