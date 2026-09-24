import { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import {
  LayoutDashboard,
  ChefHat,
  ShoppingBag,
  Sparkles,
  Flame,
  QrCode,
  MessageSquare,
  BarChart3,
  Palette,
  Settings,
  LogOut,
  Menu,
  X,
  ExternalLink
} from 'lucide-react';
import { useMimenu } from '@/lib/mimenuContext';
import { toast } from 'sonner';

interface SidebarItem {
  label: string;
  icon: React.ReactNode;
  path: string;
  description: string;
}

const AdminSidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { venue } = useMimenu();
  const [isOpen, setIsOpen] = useState(true);

  const menuItems: SidebarItem[] = [
    { label: 'Dashboard', icon: <LayoutDashboard className="w-5 h-5 text-amber-400" />, path: '/admin', description: 'Resumen & Kpis' },
    { label: 'Cocina & KDS', icon: <ChefHat className="w-5 h-5 text-emerald-400" />, path: '/cashier', description: 'Pedidos en vivo' },
    { label: 'Ofertas Inteligentes', icon: <Sparkles className="w-5 h-5 text-yellow-400" />, path: '/admin/offers', description: 'Cycling promos' },
    { label: 'Hotness & Métricas', icon: <Flame className="w-5 h-5 text-red-400" />, path: '/admin/analytics', description: 'Velocidad & Ventas' },
    { label: 'Mesas & QR', icon: <QrCode className="w-5 h-5 text-blue-400" />, path: '/admin/tables', description: 'Table mapping' },
    { label: 'Reseñas & Feedback', icon: <MessageSquare className="w-5 h-5 text-purple-400" />, path: '/admin/reviews', description: 'Moderación' },
    { label: 'White-Label & Marca', icon: <Palette className="w-5 h-5 text-pink-400" />, path: '/admin/branding', description: 'Personalización' },
    { label: 'Configuraciones', icon: <Settings className="w-5 h-5 text-gray-400" />, path: '/admin/settings', description: 'Sistema & Red' },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <>
      {/* Mobile Toggle */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed top-4 left-4 z-50 md:hidden bg-amber-600 text-white p-2 rounded-xl shadow-lg"
      >
        {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
      </button>

      {/* Sidebar */}
      <aside
        className={`fixed left-0 top-0 h-screen bg-gradient-to-b from-gray-950 via-gray-900 to-black text-white border-r border-gray-800 transition-all duration-300 z-40 ${
          isOpen ? 'w-64' : 'w-20'
        } md:w-64 md:relative md:translate-x-0 ${!isOpen && 'md:w-20'} flex flex-col`}
      >
        {/* Logo Section */}
        <div className="p-5 border-b border-gray-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-amber-500 to-red-600 flex items-center justify-center text-white font-black text-lg shadow-md shrink-0">
              🍺
            </div>
            {isOpen && (
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="font-black text-sm tracking-tight text-white">{venue.name}</span>
                  <span className="text-[9px] font-black uppercase bg-amber-500/20 text-amber-400 px-1 py-0.5 rounded">
                    SaaS
                  </span>
                </div>
                <p className="text-[10px] text-gray-400">MIMENU Santa Cruz</p>
              </div>
            )}
          </div>
        </div>

        {/* Live Menu Preview Link */}
        <div className="px-3 pt-3">
          <Link
            to="/menu"
            target="_blank"
            className="w-full flex items-center justify-between p-2.5 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 border border-amber-500/30 text-xs font-bold transition-all group"
          >
            <div className="flex items-center gap-2">
              <span className="flex h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
              {isOpen && <span>Ver Menú Digital</span>}
            </div>
            <ExternalLink className="w-3.5 h-3.5 opacity-70 group-hover:opacity-100" />
          </Link>
        </div>

        {/* Menu Items */}
        <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
          {menuItems.map((item) => (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 group ${
                isActive(item.path)
                  ? 'bg-gradient-to-r from-amber-500/30 to-red-500/20 text-white border border-amber-500/50 shadow-md font-bold'
                  : 'text-gray-400 hover:bg-gray-800/60 hover:text-white'
              }`}
              title={!isOpen ? item.label : ''}
            >
              <span className="flex-shrink-0">{item.icon}</span>
              {isOpen && (
                <div className="flex-1 text-left">
                  <div className="text-xs font-bold">{item.label}</div>
                  <div className="text-[10px] text-gray-400 group-hover:text-gray-300">{item.description}</div>
                </div>
              )}
            </button>
          ))}
        </nav>

        {/* Footer info */}
        <div className="p-3 border-t border-gray-800 text-[11px] text-gray-400 flex items-center justify-between">
          {isOpen && (
            <span className="text-[10px]">MIMENU v2.0 • SCZ</span>
          )}
          <button
            onClick={() => navigate('/')}
            className="text-[11px] text-amber-400 hover:underline font-bold"
          >
            {isOpen ? 'Landing Page' : '🏠'}
          </button>
        </div>
      </aside>

      {/* Mobile Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30 md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  );
};

export default AdminSidebar;
