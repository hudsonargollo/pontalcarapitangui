import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import {
  ChefHat,
  ShoppingBag,
  Sparkles,
  BarChart3,
  Users,
  MessageCircle,
  LogOut,
  Menu,
  X,
  LayoutDashboard,
  Settings,
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
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
  const [isOpen, setIsOpen] = useState(true);

  const menuItems: SidebarItem[] = [
    { label: 'Dashboard', icon: <LayoutDashboard className="w-5 h-5" />, path: '/admin', description: 'Visão geral' },
    { label: 'Pedidos', icon: <ChefHat className="w-5 h-5" />, path: '/cashier', description: 'Gerenciar pedidos' },
    { label: 'Produtos', icon: <ShoppingBag className="w-5 h-5" />, path: '/admin/products', description: 'Cardápio' },
    { label: 'Banners', icon: <Sparkles className="w-5 h-5" />, path: '/admin/banners', description: 'Destaques do cardápio' },
    { label: 'Garçons', icon: <Users className="w-5 h-5" />, path: '/waiter-management', description: 'Equipe' },
    { label: 'Relatórios', icon: <BarChart3 className="w-5 h-5" />, path: '/reports', description: 'Análises' },
    { label: 'WhatsApp', icon: <MessageCircle className="w-5 h-5" />, path: '/whatsapp-admin', description: 'Mensagens' },
    { label: 'Configurações', icon: <Settings className="w-5 h-5" />, path: '/admin/settings', description: 'Sistema' },
  ];

  const handleLogout = async () => {
    await supabase.auth.signOut();
    toast.success('Logout realizado com sucesso!');
    navigate('/auth');
  };

  const isActive = (path: string) => location.pathname === path;

  return (
    <>
      {/* Mobile Toggle */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed top-4 left-4 z-50 md:hidden bg-primary text-white p-2 rounded-lg"
      >
        {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
      </button>

      {/* Sidebar */}
      <aside
        className={`fixed left-0 top-0 h-screen bg-gradient-to-b from-primary to-primary/90 text-white transition-all duration-300 z-40 ${
          isOpen ? 'w-64' : 'w-20'
        } md:w-64 md:relative md:translate-x-0 ${!isOpen && 'md:w-20'}`}
      >
        {/* Logo Section */}
        <div className="p-6 border-b border-white/10">
          <div className="flex items-center justify-center">
            <img
              src="/logo-pontal.webp"
              alt="PONTAL"
              className={`transition-all duration-300 ${isOpen ? 'h-12' : 'h-10'}`}
            />
          </div>
        </div>

        {/* Menu Items */}
        <nav className="flex-1 overflow-y-auto py-6 px-3 space-y-2">
          {menuItems.map((item) => (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 group ${
                isActive(item.path)
                  ? 'bg-white/20 text-white shadow-lg'
                  : 'text-white/70 hover:bg-white/10 hover:text-white'
              }`}
              title={!isOpen ? item.label : ''}
            >
              <span className="flex-shrink-0">{item.icon}</span>
              {isOpen && (
                <div className="flex-1 text-left">
                  <div className="font-semibold text-sm">{item.label}</div>
                  <div className="text-xs text-white/60 group-hover:text-white/80">{item.description}</div>
                </div>
              )}
            </button>
          ))}
        </nav>

        {/* Logout Button */}
        <div className="p-3 border-t border-white/10">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-white/70 hover:bg-red-500/20 hover:text-red-200 transition-all duration-200"
            title={!isOpen ? 'Sair' : ''}
          >
            <LogOut className="w-5 h-5 flex-shrink-0" />
            {isOpen && <span className="font-semibold text-sm">Sair</span>}
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
