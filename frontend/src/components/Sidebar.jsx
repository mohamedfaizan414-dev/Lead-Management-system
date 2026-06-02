import { useAuth } from '../lib/AuthContext'

const navItems = [
  {
    section: 'MAIN',
    items: [
      { id: 'dashboard', label: 'Dashboard', icon: (
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
          <rect x="1" y="1" width="6" height="6" rx="1.5" stroke="currentColor" strokeWidth="1.5"/>
          <rect x="9" y="1" width="6" height="6" rx="1.5" stroke="currentColor" strokeWidth="1.5"/>
          <rect x="1" y="9" width="6" height="6" rx="1.5" stroke="currentColor" strokeWidth="1.5"/>
          <rect x="9" y="9" width="6" height="6" rx="1.5" stroke="currentColor" strokeWidth="1.5"/>
        </svg>
      )},
      { id: 'leads', label: 'All Leads', icon: (
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
          <circle cx="8" cy="5" r="3" stroke="currentColor" strokeWidth="1.5"/>
          <path d="M2 13c0-3.314 2.686-5 6-5s6 1.686 6 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
        </svg>
      )},
    ]
  },
  {
    section: 'ACTIONS',
    items: [
      { id: 'add', label: 'Add Lead', icon: (
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
          <circle cx="8" cy="8" r="6.5" stroke="currentColor" strokeWidth="1.5"/>
          <path d="M8 5v6M5 8h6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
        </svg>
      )},
    ]
  }
]

export default function Sidebar({ page, setPage }) {
  const { user, logout } = useAuth()

  return (
    <div className="w-60 min-w-[240px] bg-surface border-r border-border flex flex-col h-screen sticky top-0">
      <div className="px-5 py-5 border-b border-border">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-accent flex items-center justify-center flex-shrink-0">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M2 8L6 12L14 4" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <div>
            <div className="font-display text-base text-bright leading-none">LeadFlow</div>
            <div className="text-[10px] text-dim mt-0.5 font-mono uppercase tracking-widest">Sales CRM</div>
          </div>
        </div>
      </div>

      <nav className="flex-1 px-3 py-4 overflow-y-auto">
        {navItems.map(group => (
          <div key={group.section} className="mb-5">
            <div className="text-[10px] font-mono text-muted uppercase tracking-widest px-2 mb-2">{group.section}</div>
            {group.items.map(item => (
              <button
                key={item.id}
                onClick={() => setPage(item.id)}
                className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm font-medium mb-0.5 transition-all duration-150 text-left ${
                  page === item.id
                    ? 'bg-accent/15 text-accent border border-accent/20'
                    : 'text-dim hover:text-bright hover:bg-panel'
                }`}
              >
                <span className={page === item.id ? 'text-accent' : 'text-muted'}>{item.icon}</span>
                {item.label}
              </button>
            ))}
          </div>
        ))}
      </nav>

      <div className="border-t border-border px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-7 h-7 rounded-full bg-accent/20 flex items-center justify-center flex-shrink-0">
              <span className="text-accent text-xs font-semibold">
                {user?.username?.[0]?.toUpperCase() || 'U'}
              </span>
            </div>
            <div className="min-w-0">
              <div className="text-bright text-xs font-medium truncate">{user?.username}</div>
              <div className="text-dim text-[10px] truncate">{user?.email}</div>
            </div>
          </div>
          <button
            onClick={logout}
            title="Logout"
            className="text-muted hover:text-danger transition-colors ml-2 flex-shrink-0"
          >
            <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
              <path d="M10 7.5H3M6 4.5L3 7.5L6 10.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M8 2.5h4a1 1 0 011 1v8a1 1 0 01-1 1H8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
          </button>
        </div>
      </div>
    </div>
  )
}
