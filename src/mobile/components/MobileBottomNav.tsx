import { useLocation, useNavigate } from 'react-router-dom'

interface Tab {
  key: string
  label: string
  path: string
  icon: (active: boolean) => React.ReactNode
  authRequired?: boolean
}

const TABS: Tab[] = [
  {
    key: 'home',
    label: 'Home',
    path: '/',
    icon: (active) => (
      <svg width="22" height="22" viewBox="0 0 24 24" fill={active ? 'currentColor' : 'none'}
        stroke="currentColor" strokeWidth={active ? 0 : 1.8} strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 12L12 3l9 9" />
        <path d="M9 21V12h6v9" fill={active ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth={active ? 0 : 1.8} />
        <path d="M3 12v9h18V12" fill={active ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth={active ? 0 : 1.8} />
      </svg>
    ),
  },
  {
    key: 'hotels',
    label: 'Hotels',
    path: '/hotels',
    icon: (active) => (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none"
        stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="7" width="20" height="15" rx="2"
          fill={active ? 'currentColor' : 'none'} strokeWidth={active ? 0 : 1.8} />
        <path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2" stroke="currentColor" strokeWidth="1.8" />
        {active
          ? <><rect x="8" y="12" width="3" height="3" rx="0.5" fill="white" /><rect x="13" y="12" width="3" height="3" rx="0.5" fill="white" /></>
          : <><rect x="8" y="12" width="3" height="3" rx="0.5" /><rect x="13" y="12" width="3" height="3" rx="0.5" /></>
        }
      </svg>
    ),
  },
  {
    key: 'bookings',
    label: 'Bookings',
    path: '/bookings',
    authRequired: true,
    icon: (active) => (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none"
        stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="4" width="18" height="18" rx="2"
          fill={active ? 'currentColor' : 'none'} strokeWidth={active ? 0 : 1.8} />
        <path d="M16 2v4M8 2v4M3 10h18" stroke="currentColor" strokeWidth="1.8" />
        {active
          ? <path d="M8 15l2.5 2.5L16 13" stroke="white" strokeWidth="2" />
          : <path d="M8 15l2.5 2.5L16 13" strokeWidth="1.8" />
        }
      </svg>
    ),
  },
  {
    key: 'profile',
    label: 'Profile',
    path: '/profile',
    authRequired: true,
    icon: (active) => (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none"
        stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="8" r="4"
          fill={active ? 'currentColor' : 'none'} strokeWidth={active ? 0 : 1.8} />
        <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" stroke="currentColor" strokeWidth="1.8" />
      </svg>
    ),
  },
]

export default function MobileBottomNav() {
  const location = useLocation()
  const navigate = useNavigate()

  // Determine active tab — /hotels, /bookings, /profile are exact; / is home
  const activeKey = (() => {
    if (location.pathname === '/') return 'home'
    const match = TABS.find((t) => t.path !== '/' && location.pathname.startsWith(t.path))
    return match?.key ?? 'home'
  })()

  return (
    <nav className="fixed inset-x-0 bottom-0 z-40 border-t border-cream/[0.07] bg-forest-950/95 backdrop-blur-md">
      <div className="flex items-stretch">
        {TABS.map((tab) => {
          const active = tab.key === activeKey
          return (
            <button
              key={tab.key}
              type="button"
              onClick={() => navigate(tab.path)}
              className={`relative flex flex-1 flex-col items-center gap-1 py-2.5 transition-colors ${
                active ? 'text-gold-400' : 'text-cream/35'
              }`}
            >
              {/* Lock dot for auth-required tabs */}
              {tab.authRequired && (
                <span className="absolute right-[calc(50%-14px)] top-2 h-1.5 w-1.5 rounded-full bg-cream/20" />
              )}
              {tab.icon(active)}
              <span className={`text-[10px] font-medium tracking-wide ${active ? 'text-gold-400' : 'text-cream/35'}`}>
                {tab.label}
              </span>
              {/* Active indicator pill */}
              {active && (
                <span className="absolute inset-x-4 top-0 h-[2px] rounded-full bg-gold-400" />
              )}
            </button>
          )
        })}
      </div>
    </nav>
  )
}
