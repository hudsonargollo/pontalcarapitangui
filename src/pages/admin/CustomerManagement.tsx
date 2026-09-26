import { useState, useMemo } from "react";
import AdminLayout from "@/components/AdminLayout";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { 
  Users, 
  TrendingUp, 
  ShoppingBag, 
  Search, 
  MessageSquare, 
  Star, 
  Download, 
  Sparkles, 
  CheckCircle2, 
  Calendar,
  UtensilsCrossed
} from "lucide-react";
import { useMimenu } from "@/lib/mimenuContext";
import { CustomerProfile } from "@/types/mimenu";
import { toast } from "sonner";
import { ScrollArea } from "@/components/ui/scroll-area";

const CustomerManagement = () => {
  const { customers, orders, venue, updateCustomerNotes } = useMimenu();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCustomer, setSelectedCustomer] = useState<CustomerProfile | null>(null);
  const [isNotesDialogOpen, setIsNotesDialogOpen] = useState(false);
  const [isOrdersDialogOpen, setIsOrdersDialogOpen] = useState(false);
  const [customerNotes, setCustomerNotes] = useState("");

  const filteredCustomers = useMemo(() => {
    if (!searchTerm.trim()) return customers;
    const term = searchTerm.toLowerCase();
    return customers.filter(
      (c) =>
        c.name.toLowerCase().includes(term) ||
        c.phone.includes(term) ||
        c.loyalty_tier.toLowerCase().includes(term)
    );
  }, [customers, searchTerm]);

  // Overall CRM metrics
  const stats = useMemo(() => {
    const totalCustomers = customers.length;
    const totalOrders = customers.reduce((sum, c) => sum + c.total_orders, 0);
    const totalRevenue = customers.reduce((sum, c) => sum + c.total_spent, 0);
    const vipCount = customers.filter(c => c.loyalty_tier === 'VIP' || c.loyalty_tier === 'Oro').length;

    return {
      totalCustomers,
      totalOrders,
      totalRevenue,
      vipCount,
    };
  }, [customers]);

  const handleOpenNotes = (cust: CustomerProfile) => {
    setSelectedCustomer(cust);
    setCustomerNotes(cust.notes || "");
    setIsNotesDialogOpen(true);
  };

  const handleSaveNotes = () => {
    if (!selectedCustomer) return;
    updateCustomerNotes(selectedCustomer.id, customerNotes);
    setIsNotesDialogOpen(false);
  };

  const handleOpenOrders = (cust: CustomerProfile) => {
    setSelectedCustomer(cust);
    setIsOrdersDialogOpen(true);
  };

  const customerOrders = useMemo(() => {
    if (!selectedCustomer) return [];
    return orders.filter(o => o.customer_phone.includes(selectedCustomer.phone) || o.customer_name === selectedCustomer.name);
  }, [orders, selectedCustomer]);

  const handleWhatsAppReengage = (cust: CustomerProfile) => {
    const favItem = cust.favorite_items[0] || 'tu plato favorito';
    const message = `¡Hola ${cust.name}! Te extrañamos en ${venue.name}. Esta noche tenemos una cortesía especial para ti: pide tu ${favItem} y disfruta de la mejor noche en Equipetrol. ¡Te esperamos!`;
    const cleanPhone = cust.phone.replace(/\D/g, '');
    window.open(`https://wa.me/${cleanPhone}?text=${encodeURIComponent(message)}`, '_blank');
  };

  const handleExportCSV = () => {
    const headers = ["Nombre", "WhatsApp", "Total Pedidos", "Total Consumo", "Nivel Fidelidad", "Platos Favoritos", "Última Visita"];
    const rows = customers.map((c) => [
      c.name,
      c.phone,
      c.total_orders.toString(),
      `${venue.currency} ${c.total_spent}`,
      c.loyalty_tier,
      c.favorite_items.join(" | "),
      new Date(c.last_visit_at).toLocaleDateString("es-BO"),
    ]);

    const csvContent = [
      headers.join(","),
      ...rows.map((row) => row.map((cell) => `"${cell}"`).join(",")),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `clientes_${venue.slug || 'mimenu'}_${new Date().toISOString().split("T")[0]}.csv`;
    link.click();
    toast.success("Listado de clientes exportado en CSV");
  };

  const getTierBadge = (tier: CustomerProfile['loyalty_tier']) => {
    switch (tier) {
      case 'VIP':
        return (
          <Badge className="bg-amber-500 text-slate-950 font-bold flex items-center gap-1">
            <Star className="w-3 h-3 fill-current" />
            <span>VIP</span>
          </Badge>
        );
      case 'Oro':
        return <Badge className="bg-yellow-500/15 text-yellow-600 dark:text-yellow-400 border border-yellow-500/30 font-bold">Oro</Badge>;
      case 'Plata':
        return <Badge className="bg-slate-200 text-slate-800 dark:bg-slate-800 dark:text-slate-200 font-bold">Plata</Badge>;
      default:
        return <Badge variant="outline" className="text-muted-foreground font-semibold">Bronce</Badge>;
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6 pb-12">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-border">
          <div>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-500">
                <Users className="w-4 h-4" aria-hidden="true" />
              </div>
              <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground">
                CRM Gastronómico & Fidelización
              </h1>
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Base de datos propia de tus comensales en {venue.name}. Identifica clientes VIP y reactívalos con 1 clic por WhatsApp.
            </p>
          </div>

          <Button 
            onClick={handleExportCSV} 
            variant="outline"
            className="text-xs font-semibold gap-1.5 h-9"
          >
            <Download className="w-3.5 h-3.5" aria-hidden="true" />
            <span>Exportar Clientes (CSV)</span>
          </Button>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card className="p-4 bg-card border border-border shadow-xs">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-amber-500/10 border border-amber-500/20 text-amber-500 rounded-xl flex items-center justify-center">
                <Users className="w-5 h-5" aria-hidden="true" />
              </div>
              <div>
                <p className="text-[11px] text-muted-foreground font-medium">Total Clientes</p>
                <p className="text-xl font-bold text-foreground tabular-nums">{stats.totalCustomers}</p>
              </div>
            </div>
          </Card>

          <Card className="p-4 bg-card border border-border shadow-xs">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-500/10 border border-blue-500/20 text-blue-500 rounded-xl flex items-center justify-center">
                <ShoppingBag className="w-5 h-5" aria-hidden="true" />
              </div>
              <div>
                <p className="text-[11px] text-muted-foreground font-medium">Pedidos Acumulados</p>
                <p className="text-xl font-bold text-foreground tabular-nums">{stats.totalOrders}</p>
              </div>
            </div>
          </Card>

          <Card className="p-4 bg-card border border-border shadow-xs">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 rounded-xl flex items-center justify-center">
                <TrendingUp className="w-5 h-5" aria-hidden="true" />
              </div>
              <div>
                <p className="text-[11px] text-muted-foreground font-medium">Consumo Total</p>
                <p className="text-xl font-bold text-foreground tabular-nums">{venue.currency} {stats.totalRevenue}</p>
              </div>
            </div>
          </Card>

          <Card className="p-4 bg-card border border-border shadow-xs">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-rose-500/10 border border-rose-500/20 text-rose-500 rounded-xl flex items-center justify-center">
                <Star className="w-5 h-5" aria-hidden="true" />
              </div>
              <div>
                <p className="text-[11px] text-muted-foreground font-medium">Clientes VIP & Oro</p>
                <p className="text-xl font-bold text-foreground tabular-nums">{stats.vipCount}</p>
              </div>
            </div>
          </Card>
        </div>

        {/* Main Customer List Card */}
        <Card className="p-6 border border-border bg-card shadow-xs space-y-4">
          {/* Search bar */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" aria-hidden="true" />
            <Input
              placeholder="Buscar por nombre, teléfono o nivel (VIP, Oro, Plata)..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9 h-10 text-xs rounded-xl"
            />
          </div>

          {/* Table */}
          {filteredCustomers.length === 0 ? (
            <div className="text-center py-12 bg-muted/20 rounded-xl border border-dashed border-border">
              <Users className="w-10 h-10 text-muted-foreground mx-auto mb-2 opacity-40" aria-hidden="true" />
              <p className="text-sm font-semibold text-foreground">No encontramos clientes con ese filtro</p>
              <p className="text-xs text-muted-foreground mt-1">Los comensales que realicen pedidos en el menú aparecerán aquí automáticamente.</p>
            </div>
          ) : (
            <div className="overflow-x-auto rounded-xl border border-border">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/40 text-xs font-bold text-muted-foreground">
                    <TableHead>Comensal</TableHead>
                    <TableHead>Nivel</TableHead>
                    <TableHead className="text-center">Visitas</TableHead>
                    <TableHead className="text-right">Consumo</TableHead>
                    <TableHead>Favoritos</TableHead>
                    <TableHead>Última Visita</TableHead>
                    <TableHead className="text-right">Acciones WhatsApp</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredCustomers.map((cust) => (
                    <TableRow key={cust.id} className="hover:bg-muted/30 transition-colors text-xs">
                      <TableCell>
                        <div>
                          <p className="font-bold text-foreground">{cust.name}</p>
                          <p className="text-[11px] text-muted-foreground font-mono">{cust.phone}</p>
                        </div>
                      </TableCell>
                      <TableCell>{getTierBadge(cust.loyalty_tier)}</TableCell>
                      <TableCell className="text-center font-bold tabular-nums">
                        <button
                          onClick={() => handleOpenOrders(cust)}
                          className="hover:underline text-amber-500 font-bold"
                          title="Ver historial de pedidos"
                        >
                          {cust.total_orders} pedidos
                        </button>
                      </TableCell>
                      <TableCell className="text-right font-bold text-emerald-600 dark:text-emerald-400 tabular-nums">
                        {venue.currency} {cust.total_spent}
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-1 max-w-xs">
                          {cust.favorite_items.slice(0, 2).map((fav, i) => (
                            <span key={i} className="text-[10px] bg-muted/60 text-muted-foreground px-1.5 py-0.5 rounded border border-border">
                              {fav}
                            </span>
                          ))}
                        </div>
                      </TableCell>
                      <TableCell className="text-muted-foreground tabular-nums">
                        {new Date(cust.last_visit_at).toLocaleDateString("es-BO", { day: '2-digit', month: 'short' })}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleOpenNotes(cust)}
                            className="h-8 text-[11px] px-2"
                            title="Ver o editar notas"
                          >
                            Notas
                          </Button>
                          <Button
                            size="sm"
                            onClick={() => handleWhatsAppReengage(cust)}
                            className="h-8 text-[11px] bg-emerald-600 hover:bg-emerald-700 text-white font-semibold gap-1 px-2.5 rounded-lg"
                            title="Reactivar comensal por WhatsApp"
                          >
                            <MessageSquare className="w-3.5 h-3.5" aria-hidden="true" />
                            <span>WhatsApp Promo</span>
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </Card>
      </div>

      {/* Notes Dialog */}
      <Dialog open={isNotesDialogOpen} onOpenChange={setIsNotesDialogOpen}>
        <DialogContent className="max-w-md bg-card border-border rounded-2xl">
          <DialogHeader>
            <DialogTitle className="text-base font-bold text-foreground">
              Notas de Cliente: {selectedCustomer?.name}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-3 py-2">
            <Label className="text-xs font-semibold">Preferencias, alergias o solicitudes especiales:</Label>
            <Input
              value={customerNotes}
              onChange={(e) => setCustomerNotes(e.target.value)}
              placeholder="ej. Mesa preferida en terraza, extra picante, cumpleaños en octubre"
              className="text-xs h-10"
            />
          </div>
          <DialogFooter className="gap-2">
            <Button variant="outline" size="sm" onClick={() => setIsNotesDialogOpen(false)}>
              Cancelar
            </Button>
            <Button size="sm" onClick={handleSaveNotes} className="bg-amber-500 hover:bg-amber-600 text-white font-bold">
              Guardar Notas
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Orders History Dialog */}
      <Dialog open={isOrdersDialogOpen} onOpenChange={setIsOrdersDialogOpen}>
        <DialogContent className="max-w-2xl bg-card border-border rounded-2xl">
          <DialogHeader>
            <DialogTitle className="text-base font-bold text-foreground flex items-center gap-2">
              <UtensilsCrossed className="w-4 h-4 text-amber-500" aria-hidden="true" />
              <span>Historial de Pedidos: {selectedCustomer?.name}</span>
            </DialogTitle>
          </DialogHeader>
          <ScrollArea className="max-h-[60vh] pr-2">
            {customerOrders.length === 0 ? (
              <p className="text-xs text-muted-foreground py-6 text-center">No hay pedidos registrados en la sesión actual.</p>
            ) : (
              <div className="space-y-3">
                {customerOrders.map((ord) => (
                  <div key={ord.id} className="p-3.5 rounded-xl bg-muted/30 border border-border space-y-2 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-foreground">Comanda #{ord.order_number} • {ord.fulfillment_type === 'dine_in' ? `Mesa ${ord.table_number}` : 'Retiro'}</span>
                      <span className="font-bold text-amber-500 tabular-nums">{venue.currency} {ord.total}</span>
                    </div>
                    <div className="text-muted-foreground space-y-0.5">
                      {ord.items.map((it, idx) => (
                        <p key={idx}>• {it.quantity}x {it.name} ({venue.currency} {it.price * it.quantity})</p>
                      ))}
                    </div>
                    <p className="text-[10px] text-muted-foreground border-t border-border/40 pt-1 flex items-center gap-1">
                      <Calendar className="w-3 h-3" aria-hidden="true" />
                      <span>{new Date(ord.created_at).toLocaleString("es-BO")}</span>
                    </p>
                  </div>
                ))}
              </div>
            )}
          </ScrollArea>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
};

export default CustomerManagement;
