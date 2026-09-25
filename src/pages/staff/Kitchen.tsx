import { useState, useMemo, useEffect } from "react";
import { Link } from "react-router-dom";
import { 
  ChefHat, 
  Clock, 
  CheckCircle2, 
  Package, 
  Bell, 
  UtensilsCrossed, 
  ShoppingBag, 
  Truck, 
  Flame, 
  Volume2, 
  VolumeX,
  RefreshCw,
  ArrowRight,
  Check
} from "lucide-react";
import { useMimenu } from "@/lib/mimenuContext";
import { MimenuOrder } from "@/types/mimenu";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { toast } from "sonner";

export const Kitchen = () => {
  const { orders, updateOrderStatus, venue } = useMimenu();
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [completedItemIds, setCompletedItemIds] = useState<Record<string, Set<string>>>({});
  const [currentTime, setCurrentTime] = useState(Date.now());

  // Update timer tick every 10 seconds for ticket durations
  useEffect(() => {
    const interval = setInterval(() => setCurrentTime(Date.now()), 10000);
    return () => clearInterval(interval);
  }, []);

  // Web Audio synthetic beep for new orders
  const playNewOrderBeep = () => {
    if (!soundEnabled || typeof window === 'undefined') return;
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(880, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(440, ctx.currentTime + 0.3);
      gain.gain.setValueAtTime(0.3, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.3);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.35);
    } catch (e) {
      // Audio context might be restricted before interaction
    }
  };

  const pendingOrders = useMemo(() => orders.filter(o => o.status === 'pending'), [orders]);
  const preparingOrders = useMemo(() => orders.filter(o => o.status === 'preparing'), [orders]);
  const readyOrders = useMemo(() => orders.filter(o => o.status === 'ready'), [orders]);

  const toggleItemDone = (orderId: string, itemIdx: number) => {
    const key = `${orderId}-${itemIdx}`;
    setCompletedItemIds(prev => {
      const current = prev[orderId] || new Set();
      const next = new Set(current);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return { ...prev, [orderId]: next };
    });
  };

  const getElapsedMinutes = (createdAt: string) => {
    const diff = Math.max(0, currentTime - new Date(createdAt).getTime());
    return Math.floor(diff / 60000);
  };

  const getTimerBadgeColor = (mins: number) => {
    if (mins >= 12) return 'bg-rose-500 text-white animate-pulse font-bold';
    if (mins >= 6) return 'bg-amber-500/15 text-amber-600 dark:text-amber-400 border border-amber-500/30 font-bold';
    return 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 font-bold';
  };

  const getFulfillmentBadge = (order: MimenuOrder) => {
    switch (order.fulfillment_type) {
      case 'dine_in':
        return (
          <Badge className="bg-amber-500 text-slate-950 font-bold text-xs flex items-center gap-1">
            <UtensilsCrossed className="w-3 h-3" aria-hidden="true" />
            <span>Mesa {order.table_number || '1'}</span>
          </Badge>
        );
      case 'pickup':
        return (
          <Badge className="bg-blue-600 text-white font-bold text-xs flex items-center gap-1">
            <ShoppingBag className="w-3 h-3" aria-hidden="true" />
            <span>Retiro en Barra</span>
          </Badge>
        );
      case 'delivery':
        return (
          <Badge className="bg-purple-600 text-white font-bold text-xs flex items-center gap-1">
            <Truck className="w-3 h-3" aria-hidden="true" />
            <span>Delivery Directo</span>
          </Badge>
        );
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      {/* KDS Header Bar */}
      <header className="bg-slate-900 border-b border-slate-800 px-4 py-3 sticky top-0 z-30 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-500">
            <ChefHat className="w-5 h-5" aria-hidden="true" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-base font-bold text-white tracking-tight">KDS Cocina & Barra</h1>
              <span className="text-[10px] font-bold uppercase bg-amber-500/10 text-amber-400 px-1.5 py-0.2 rounded border border-amber-500/20">
                {venue.name}
              </span>
            </div>
            <p className="text-[11px] text-slate-400">Pantalla de comandas en tiempo real</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              setSoundEnabled(!soundEnabled);
              toast.info(soundEnabled ? 'Alertas sonoras silenciadas' : 'Alertas sonoras activadas');
            }}
            className="p-2 rounded-lg bg-slate-800 hover:bg-slate-750 text-slate-300 border border-slate-700 text-xs flex items-center gap-1.5 transition-colors"
            title={soundEnabled ? 'Silenciar alertas' : 'Activar sonido'}
          >
            {soundEnabled ? (
              <>
                <Volume2 className="w-4 h-4 text-emerald-400" aria-hidden="true" />
                <span className="hidden sm:inline">Sonido ON</span>
              </>
            ) : (
              <>
                <VolumeX className="w-4 h-4 text-slate-500" aria-hidden="true" />
                <span className="hidden sm:inline">Silenciado</span>
              </>
            )}
          </button>

          <Link
            to="/admin"
            className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-colors"
          >
            Panel Admin
          </Link>
        </div>
      </header>

      {/* Main KDS Lanes Grid */}
      <main className="p-4 flex-1 grid grid-cols-1 md:grid-cols-3 gap-4 max-w-7xl mx-auto w-full">
        
        {/* Lane 1: Nuevos / Pendientes */}
        <div className="flex flex-col space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-slate-800 px-1">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-500" aria-hidden="true" />
              <h2 className="text-sm font-bold uppercase tracking-wider text-slate-200">Pendientes</h2>
            </div>
            <Badge variant="outline" className="bg-rose-500/10 text-rose-400 border-rose-500/30 tabular-nums font-bold">
              {pendingOrders.length}
            </Badge>
          </div>

          <div className="space-y-3 overflow-y-auto flex-1">
            {pendingOrders.length === 0 ? (
              <div className="p-8 text-center rounded-2xl bg-slate-900/50 border border-dashed border-slate-800 text-slate-500">
                <Bell className="w-8 h-8 mx-auto mb-2 opacity-30" aria-hidden="true" />
                <p className="text-xs font-semibold">No hay comandas pendientes</p>
                <p className="text-[10px] mt-0.5">Los nuevos pedidos de mesas o delivery llegarán aquí.</p>
              </div>
            ) : (
              pendingOrders.map((order) => {
                const elapsed = getElapsedMinutes(order.created_at);
                return (
                  <Card key={order.id} className="p-4 bg-slate-900 border-2 border-slate-800 hover:border-slate-700 text-slate-100 rounded-xl space-y-3 shadow-sm">
                    {/* Header */}
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-black text-white">#{order.order_number}</span>
                          {getFulfillmentBadge(order)}
                        </div>
                        <p className="text-xs text-slate-300 font-medium mt-1">{order.customer_name}</p>
                        {order.delivery_address && (
                          <p className="text-[11px] text-purple-300 line-clamp-1 mt-0.5">
                            📍 {order.delivery_address}
                          </p>
                        )}
                      </div>

                      <span className={`text-[10px] px-2 py-0.5 rounded-md flex items-center gap-1 tabular-nums ${getTimerBadgeColor(elapsed)}`}>
                        <Clock className="w-3 h-3" aria-hidden="true" />
                        <span>{elapsed}m</span>
                      </span>
                    </div>

                    {/* Items List */}
                    <div className="space-y-1.5 py-2 border-y border-slate-800/80">
                      {order.items.map((it, idx) => {
                        const isDone = completedItemIds[order.id]?.has(`${order.id}-${idx}`);
                        return (
                          <button
                            key={idx}
                            type="button"
                            onClick={() => toggleItemDone(order.id, idx)}
                            className={`w-full text-left p-1.5 rounded-lg flex items-center justify-between text-xs transition-colors ${
                              isDone ? 'bg-slate-800/40 text-slate-500 line-through' : 'hover:bg-slate-800 text-slate-200'
                            }`}
                          >
                            <span className="font-semibold">{it.quantity}x {it.name}</span>
                            {isDone && <Check className="w-3 h-3 text-emerald-400" aria-hidden="true" />}
                          </button>
                        );
                      })}
                    </div>

                    {order.items.some(i => i.notes) && (
                      <div className="p-2 rounded-lg bg-amber-500/10 border border-amber-500/20 text-[11px] text-amber-300">
                        <strong>Notas:</strong> {order.items.map(i => i.notes).filter(Boolean).join(', ')}
                      </div>
                    )}

                    {/* Action Button */}
                    <Button
                      onClick={() => updateOrderStatus(order.id, 'preparing')}
                      className="w-full bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs h-9 rounded-lg flex items-center justify-center gap-1.5"
                    >
                      <ChefHat className="w-3.5 h-3.5" aria-hidden="true" />
                      <span>Iniciar Preparación</span>
                    </Button>
                  </Card>
                );
              })
            )}
          </div>
        </div>

        {/* Lane 2: En Preparación */}
        <div className="flex flex-col space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-slate-800 px-1">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-400" aria-hidden="true" />
              <h2 className="text-sm font-bold uppercase tracking-wider text-slate-200">En Preparación</h2>
            </div>
            <Badge variant="outline" className="bg-amber-500/10 text-amber-400 border-amber-500/30 tabular-nums font-bold">
              {preparingOrders.length}
            </Badge>
          </div>

          <div className="space-y-3 overflow-y-auto flex-1">
            {preparingOrders.length === 0 ? (
              <div className="p-8 text-center rounded-2xl bg-slate-900/50 border border-dashed border-slate-800 text-slate-500">
                <ChefHat className="w-8 h-8 mx-auto mb-2 opacity-30" aria-hidden="true" />
                <p className="text-xs font-semibold">Nada en los fogones</p>
                <p className="text-[10px] mt-0.5">Inicia una comanda para empezar a cronometrar.</p>
              </div>
            ) : (
              preparingOrders.map((order) => {
                const elapsed = getElapsedMinutes(order.created_at);
                return (
                  <Card key={order.id} className="p-4 bg-slate-900 border-2 border-amber-500/40 text-slate-100 rounded-xl space-y-3 shadow-md">
                    {/* Header */}
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-black text-amber-400">#{order.order_number}</span>
                          {getFulfillmentBadge(order)}
                        </div>
                        <p className="text-xs text-slate-300 font-medium mt-1">{order.customer_name}</p>
                      </div>

                      <span className={`text-[10px] px-2 py-0.5 rounded-md flex items-center gap-1 tabular-nums ${getTimerBadgeColor(elapsed)}`}>
                        <Clock className="w-3 h-3" aria-hidden="true" />
                        <span>{elapsed}m</span>
                      </span>
                    </div>

                    {/* Items List */}
                    <div className="space-y-1.5 py-2 border-y border-slate-800/80">
                      {order.items.map((it, idx) => {
                        const isDone = completedItemIds[order.id]?.has(`${order.id}-${idx}`);
                        return (
                          <button
                            key={idx}
                            type="button"
                            onClick={() => toggleItemDone(order.id, idx)}
                            className={`w-full text-left p-1.5 rounded-lg flex items-center justify-between text-xs transition-colors ${
                              isDone ? 'bg-slate-800/40 text-slate-500 line-through' : 'hover:bg-slate-800 text-slate-200'
                            }`}
                          >
                            <span className="font-semibold">{it.quantity}x {it.name}</span>
                            {isDone && <Check className="w-3 h-3 text-emerald-400" aria-hidden="true" />}
                          </button>
                        );
                      })}
                    </div>

                    {/* Action Button */}
                    <Button
                      onClick={() => updateOrderStatus(order.id, 'ready')}
                      className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs h-9 rounded-lg flex items-center justify-center gap-1.5"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" aria-hidden="true" />
                      <span>Marcar como Listo para Servir</span>
                    </Button>
                  </Card>
                );
              })
            )}
          </div>
        </div>

        {/* Lane 3: Listos para Despacho / Entrega */}
        <div className="flex flex-col space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-slate-800 px-1">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" aria-hidden="true" />
              <h2 className="text-sm font-bold uppercase tracking-wider text-slate-200">Listos para Servir</h2>
            </div>
            <Badge variant="outline" className="bg-emerald-500/10 text-emerald-400 border-emerald-500/30 tabular-nums font-bold">
              {readyOrders.length}
            </Badge>
          </div>

          <div className="space-y-3 overflow-y-auto flex-1">
            {readyOrders.length === 0 ? (
              <div className="p-8 text-center rounded-2xl bg-slate-900/50 border border-dashed border-slate-800 text-slate-500">
                <CheckCircle2 className="w-8 h-8 mx-auto mb-2 opacity-30" aria-hidden="true" />
                <p className="text-xs font-semibold">Sin pedidos listos</p>
                <p className="text-[10px] mt-0.5">Los platos listos aparecerán aquí para despacho.</p>
              </div>
            ) : (
              readyOrders.map((order) => (
                <Card key={order.id} className="p-4 bg-slate-900 border-2 border-emerald-500/40 text-slate-100 rounded-xl space-y-3 shadow-md">
                  {/* Header */}
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-black text-emerald-400">#{order.order_number}</span>
                        {getFulfillmentBadge(order)}
                      </div>
                      <p className="text-xs text-slate-300 font-medium mt-1">{order.customer_name}</p>
                    </div>

                    <Badge className="bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 font-bold text-[10px]">
                      ¡Listo!
                    </Badge>
                  </div>

                  {/* Items List */}
                  <div className="space-y-1 py-1.5 border-y border-slate-800/80 text-xs text-slate-300">
                    {order.items.map((it, idx) => (
                      <p key={idx}>✓ {it.quantity}x {it.name}</p>
                    ))}
                  </div>

                  {/* Action Button */}
                  <Button
                    onClick={() => updateOrderStatus(order.id, 'delivered')}
                    variant="outline"
                    className="w-full border-slate-700 hover:bg-slate-800 text-slate-200 font-semibold text-xs h-9 rounded-lg flex items-center justify-center gap-1.5"
                  >
                    <Package className="w-3.5 h-3.5 text-emerald-400" aria-hidden="true" />
                    <span>Entregado / Finalizar</span>
                  </Button>
                </Card>
              ))
            )}
          </div>
        </div>

      </main>
    </div>
  );
};

export default Kitchen;
