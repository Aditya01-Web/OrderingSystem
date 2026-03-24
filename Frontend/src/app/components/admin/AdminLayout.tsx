import { useNavigate, useLocation, Link } from 'react-router';
import { Coffee, LayoutDashboard, UtensilsCrossed, LogOut } from 'lucide-react';
import { adminLogout } from '../../services/adminApi';

export const AdminLayout = ({ children }: { children: React.ReactNode }) => {
  const navigate  = useNavigate();
  const location  = useLocation();

  const handleLogout = () => {
    adminLogout();
    navigate('/admin/login');
  };

  const navItems = [
    { to: '/admin/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { to: '/admin/menu',      label: 'Menu',       icon: UtensilsCrossed },
  ];

  return (
    <div className="min-h-screen flex" style={{ backgroundColor: '#F7F3ED' }}>
      {/* Sidebar */}
      <aside
        className="w-64 min-h-screen flex flex-col border-r"
        style={{ backgroundColor: '#fff', borderColor: '#C8BAA8' }}
      >
        {/* Logo */}
        <div className="p-6 border-b" style={{ borderColor: '#C8BAA8' }}>
          <div className="flex items-center gap-3">
            <div
              className="w-10 h-10 rounded-full flex items-center justify-center"
              style={{ backgroundColor: '#3A6B35' }}
            >
              <Coffee className="w-5 h-5" style={{ color: '#F7F3ED' }} />
            </div>
            <div>
              <p className="font-bold text-sm" style={{ color: '#1C2B1A' }}>Coffee Nest</p>
              <p className="text-xs" style={{ color: '#6B7F68' }}>Admin Panel</p>
            </div>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 p-4 space-y-1">
          {navItems.map(({ to, label, icon: Icon }) => {
            const isActive = location.pathname === to;
            return (
              <Link
                key={to}
                to={to}
                className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200"
                style={{
                  backgroundColor: isActive ? '#E8F0E5' : 'transparent',
                  color:           isActive ? '#3A6B35' : '#4A5E47',
                  borderLeft:      isActive ? '3px solid #3A6B35' : '3px solid transparent',
                }}
              >
                <Icon className="w-4 h-4" />
                {label}
              </Link>
            );
          })}
        </nav>

        {/* Logout */}
        <div className="p-4 border-t" style={{ borderColor: '#C8BAA8' }}>
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium w-full transition-all duration-200"
            style={{ color: '#DC2626' }}
            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#FEF2F2')}
            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
          >
            <LogOut className="w-4 h-4" />
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8 overflow-auto">
        {children}
      </main>
    </div>
  );
};