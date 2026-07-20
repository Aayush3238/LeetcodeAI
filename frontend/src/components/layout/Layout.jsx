import { useState } from 'react'
import { Outlet, NavLink, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useAuthStore } from '../../stores/authStore'
import { SIDEBAR_LINKS } from '../../constants'
import {
  LayoutDashboard, User, Code2, FileCode, Bot, Target,
  Calendar, Settings, LogOut, Menu, X, ChevronLeft, Search,
} from 'lucide-react'

const iconMap = {
  LayoutDashboard, User, Code2, FileCode, Bot, Target, Calendar, Settings,
}

export default function Layout() {
  const [collapsed, setCollapsed] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const { user, logout } = useAuthStore()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      <div className="flex items-center gap-3 px-4 py-5 border-b border-dark-800">
        <div className="w-9 h-9 rounded-xl bg-primary-600 flex items-center justify-center">
          <span className="text-white font-bold text-sm">LC</span>
        </div>
        {!collapsed && (
          <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="font-bold text-lg">
            LeetCoach
          </motion.span>
        )}
      </div>

      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto scrollbar-thin">
        {SIDEBAR_LINKS.map(({ path, label, icon }) => {
          const Icon = iconMap[icon]
          return (
            <NavLink
              key={path}
              to={path}
              onClick={() => setMobileOpen(false)}
              className={({ isActive }) => isActive ? 'sidebar-link-active' : 'sidebar-link'}
            >
              {Icon && <Icon size={20} />}
              {!collapsed && <span>{label}</span>}
            </NavLink>
          )
        })}
      </nav>

      <div className="px-3 py-4 border-t border-dark-800">
        <button onClick={handleLogout} className="sidebar-link w-full text-red-400 hover:text-red-300 hover:bg-red-400/10">
          <LogOut size={20} />
          {!collapsed && <span>Logout</span>}
        </button>
      </div>
    </div>
  )

  return (
    <div className="flex h-screen bg-dark-950">
      {/* Desktop Sidebar */}
      <aside className={`hidden lg:flex flex-col border-r border-dark-800 bg-dark-900/50 transition-all duration-300 ${collapsed ? 'w-[72px]' : 'w-64'}`}>
        <SidebarContent />
      </aside>

      {/* Mobile Sidebar */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 z-40 lg:hidden"
              onClick={() => setMobileOpen(false)}
            />
            <motion.aside
              initial={{ x: -280 }}
              animate={{ x: 0 }}
              exit={{ x: -280 }}
              className="fixed left-0 top-0 bottom-0 w-64 bg-dark-900 border-r border-dark-800 z-50 lg:hidden"
            >
              <SidebarContent />
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="flex items-center justify-between px-6 py-4 border-b border-dark-800 bg-dark-900/30 backdrop-blur-xl">
          <div className="flex items-center gap-4">
            <button onClick={() => setMobileOpen(true)} className="lg:hidden p-2 hover:bg-dark-800 rounded-xl">
              <Menu size={20} />
            </button>
            <button onClick={() => setCollapsed(!collapsed)} className="hidden lg:block p-2 hover:bg-dark-800 rounded-xl">
              <ChevronLeft size={20} className={`transition-transform ${collapsed ? 'rotate-180' : ''}`} />
            </button>
          </div>

          <div className="flex items-center gap-4">
            <div className="relative hidden sm:block">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-dark-500" />
              <input
                type="text"
                placeholder="Search problems..."
                className="input pl-10 w-64"
              />
            </div>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-primary-600 flex items-center justify-center text-sm font-medium">
                {user?.name?.charAt(0) || 'U'}
              </div>
              <span className="hidden sm:block text-sm font-medium">{user?.name}</span>
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto scrollbar-thin p-6">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Outlet />
          </motion.div>
        </main>
      </div>
    </div>
  )
}
