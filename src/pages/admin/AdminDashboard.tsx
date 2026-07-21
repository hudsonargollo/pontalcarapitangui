import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ShoppingBag, Users, TrendingUp, Clock, CheckCircle, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';

interface DashboardStats {
  totalOrders: number;
  totalWaiters: number;
  totalRevenue: number;
  pendingOrders: number;
  completedOrders: number;
  averageOrderValue: number;
}

const AdminDashboard = () => {
  const [stats, setStats] = useState<DashboardStats>({
    totalOrders: 0,
    totalWaiters: 0,
    totalRevenue: 0,
    pendingOrders: 0,
    completedOrders: 0,
    averageOrderValue: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardStats();
  }, []);

  const loadDashboardStats = async () => {
    try {
      setLoading(true);

      // Get orders stats
      const { data: orders, error: ordersError } = await supabase
        .from('orders')
        .select('id, total_amount, status')
        .is('deleted_at', null);

      if (ordersError) throw ordersError;

      // Get waiters count
      const { data: { users }, error: usersError } = await supabase.auth.admin.listUsers();
      if (usersError) throw usersError;

      const waiters = (users || []).filter(u => u.user_metadata?.role === 'waiter').length;

      // Calculate stats
      const totalOrders = orders?.length || 0;
      const completedOrders = orders?.filter(o => o.status === 'completed').length || 0;
      const pendingOrders = orders?.filter(o => o.status === 'pending' || o.status === 'pending_payment').length || 0;
      const totalRevenue = orders?.reduce((sum, o) => sum + (o.total_amount || 0), 0) || 0;
      const averageOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;

      setStats({
        totalOrders,
        totalWaiters: waiters,
        totalRevenue,
        pendingOrders,
        completedOrders,
        averageOrderValue,
      });
    } catch (error) {
      console.error('Error loading dashboard stats:', error);
      toast.error('Erro ao carregar estatísticas');
    } finally {
      setLoading(false);
    }
  };

  const StatCard = ({
    title,
    value,
    icon: Icon,
    color,
    subtitle,
  }: {
    title: string;
    value: string | number;
    icon: React.ReactNode;
    color: string;
    subtitle?: string;
  }) => (
    <Card className={`border-2 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 ${color}`}>
      <CardHeader className="pb-3">
        <CardTitle className="text-sm font-semibold text-gray-600 flex items-center justify-between">
          <span>{title}</span>
          <div className={`p-2 rounded-lg ${color.split(' ')[1]}`}>{Icon}</div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-3xl font-bold text-gray-900">{value}</div>
        {subtitle && <p className="text-xs text-gray-500 mt-1">{subtitle}</p>}
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-display font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600 mt-2">Bem-vindo ao painel de controle do PONTAL Carapitangui</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <StatCard
          title="Total de Pedidos"
          value={stats.totalOrders}
          icon={<ShoppingBag className="w-5 h-5 text-blue-600" />}
          color="bg-blue-50 border-blue-200"
          subtitle="Todos os pedidos"
        />
        <StatCard
          title="Garçons Ativos"
          value={stats.totalWaiters}
          icon={<Users className="w-5 h-5 text-purple-600" />}
          color="bg-purple-50 border-purple-200"
          subtitle="Membros da equipe"
        />
        <StatCard
          title="Receita Total"
          value={`R$ ${stats.totalRevenue.toFixed(2)}`}
          icon={<TrendingUp className="w-5 h-5 text-green-600" />}
          color="bg-green-50 border-green-200"
          subtitle="Faturamento"
        />
        <StatCard
          title="Pedidos Pendentes"
          value={stats.pendingOrders}
          icon={<Clock className="w-5 h-5 text-orange-600" />}
          color="bg-orange-50 border-orange-200"
          subtitle="Aguardando processamento"
        />
        <StatCard
          title="Pedidos Concluídos"
          value={stats.completedOrders}
          icon={<CheckCircle className="w-5 h-5 text-green-600" />}
          color="bg-green-50 border-green-200"
          subtitle="Finalizados"
        />
        <StatCard
          title="Ticket Médio"
          value={`R$ ${stats.averageOrderValue.toFixed(2)}`}
          icon={<AlertCircle className="w-5 h-5 text-indigo-600" />}
          color="bg-indigo-50 border-indigo-200"
          subtitle="Valor médio por pedido"
        />
      </div>

      {/* Quick Actions */}
      <Card className="border-2 border-gray-200 rounded-xl shadow-lg">
        <CardHeader>
          <CardTitle className="text-lg font-display">Ações Rápidas</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <button className="p-4 bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg hover:shadow-lg transition-all duration-200 border-2 border-blue-200">
              <ShoppingBag className="w-6 h-6 text-blue-600 mb-2" />
              <p className="font-semibold text-sm text-gray-900">Ver Pedidos</p>
              <p className="text-xs text-gray-600">Gerenciar pedidos</p>
            </button>
            <button className="p-4 bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg hover:shadow-lg transition-all duration-200 border-2 border-purple-200">
              <Users className="w-6 h-6 text-purple-600 mb-2" />
              <p className="font-semibold text-sm text-gray-900">Garçons</p>
              <p className="text-xs text-gray-600">Gerenciar equipe</p>
            </button>
            <button className="p-4 bg-gradient-to-br from-green-50 to-green-100 rounded-lg hover:shadow-lg transition-all duration-200 border-2 border-green-200">
              <TrendingUp className="w-6 h-6 text-green-600 mb-2" />
              <p className="font-semibold text-sm text-gray-900">Relatórios</p>
              <p className="text-xs text-gray-600">Ver análises</p>
            </button>
            <button className="p-4 bg-gradient-to-br from-orange-50 to-orange-100 rounded-lg hover:shadow-lg transition-all duration-200 border-2 border-orange-200">
              <ShoppingBag className="w-6 h-6 text-orange-600 mb-2" />
              <p className="font-semibold text-sm text-gray-900">Produtos</p>
              <p className="text-xs text-gray-600">Cardápio</p>
            </button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminDashboard;
