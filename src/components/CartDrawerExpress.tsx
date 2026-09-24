import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { 
  ShoppingBag, 
  Plus, 
  Minus, 
  Trash2, 
  UtensilsCrossed, 
  QrCode, 
  Banknote, 
  CreditCard, 
  Sparkles, 
  CheckCircle2, 
  X, 
  Share2,
  Clock,
  ArrowRight
} from 'lucide-react';
import { useCart } from '@/lib/cartContext';
import { useMimenu } from '@/lib/mimenuContext';
import { toast } from 'sonner';

interface CartDrawerExpressProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CartDrawerExpress: React.FC<CartDrawerExpressProps> = ({
  isOpen,
  onClose,
}) => {
  const { state: cartState, addItem, removeItem, clearCart, getTotalPrice, getTotalItems } = useCart();
  const { venue, selectedTable, fulfillmentType, setFulfillmentType, setSelectedTable, createOrder } = useMimenu();

  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [orderNotes, setOrderNotes] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'qr_simple' | 'cash' | 'card'>('qr_simple');
  const [selectedTip, setSelectedTip] = useState<number>(5);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [confirmedOrder, setConfirmedOrder] = useState<any | null>(null);

  const subtotal = getTotalPrice();
  const grandTotal = subtotal + selectedTip;

  // AI Upsell Items
  const upsellItems = [
    { id: 'up-1', name: 'Chopp Helado (500ml)', price: 25, badge: '🔥 TOP MARIDAJE' },
    { id: 'up-2', name: 'Extra Queso Cheddar Fundido', price: 6, badge: '⚡ POPULAR' },
    { id: 'up-3', name: 'Salsa Tártara Casera Extra', price: 4, badge: 'RECOMENDADO' },
  ];

  const handleAddUpsell = (item: { id: string; name: string; price: number }) => {
    addItem({
      id: item.id,
      name: item.name,
      description: 'Agregado desde sugerencia rápida',
      price: item.price,
      category_id: 'cat-addons',
      available: true,
    });
    toast.success(`Agregaste ${item.name} (+Bs. ${item.price})`);
  };

  const handleSubmitOrder = (e: React.FormEvent) => {
    e.preventDefault();
    if (cartState.items.length === 0) {
      toast.error('Tu pedido está vacío');
      return;
    }
    if (!customerName.trim()) {
      toast.error('Por favor ingresa tu nombre');
      return;
    }

    setIsSubmitting(true);

    setTimeout(() => {
      try {
        const order = createOrder({
          venue_id: venue.id,
          fulfillment_type: fulfillmentType,
          table_number: fulfillmentType === 'dine_in' ? (selectedTable || '1') : undefined,
          customer_name: customerName.trim(),
          customer_phone: customerPhone.trim() || '+591 70000000',
          items: cartState.items.map(i => ({
            item_id: i.id,
            name: i.name,
            price: i.price,
            quantity: i.quantity,
            notes: orderNotes || undefined,
          })),
          subtotal,
          discount: 0,
          total: grandTotal,
          payment_method: paymentMethod,
          payment_status: paymentMethod === 'qr_simple' ? 'paid' : 'pending',
        });

        setConfirmedOrder(order);
        clearCart();
        toast.success(`¡Pedido ${order.order_number} enviado a la cocina de Moe's!`);
      } catch (err) {
        console.error(err);
        toast.error('Error al procesar el pedido');
      } finally {
        setIsSubmitting(false);
      }
    }, 500);
  };

  const getWhatsAppTicketText = () => {
    if (!confirmedOrder) return '';
    const tableInfo = fulfillmentType === 'dine_in' ? `Mesa ${selectedTable || '1'}` : 'Retiro en Barra';
    const itemsList = confirmedOrder.items.map((i: any) => `• ${i.quantity}x ${i.name} (Bs. ${i.price * i.quantity})`).join('\n');
    return `🍺 *${venue.name.toUpperCase()} — PEDIDO ${confirmedOrder.order_number}*\n📍 *Ubicación:* ${tableInfo}\n👤 *Cliente:* ${confirmedOrder.customer_name}\n\n*ÍTEMS:* \n${itemsList}\n\n*Subtotal:* Bs. ${confirmedOrder.subtotal}\n*Propina:* Bs. ${selectedTip}\n*TOTAL:* Bs. ${confirmedOrder.total}\n*Método:* ${paymentMethod.replace('_', ' ').toUpperCase()}\n\n_Enviado desde MIMENU Santa Cruz_ 🚀`;
  };

  const handleShareWhatsApp = () => {
    const text = encodeURIComponent(getWhatsAppTicketText());
    window.open(`https://wa.me/${venue.whatsapp.replace(/\D/g, '')}?text=${text}`, '_blank');
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-lg w-full max-h-[92vh] flex flex-col p-0 overflow-hidden bg-card border-border shadow-2xl">
        
        {/* Header */}
        <div className="p-4 bg-gradient-to-r from-amber-600 via-red-600 to-amber-600 text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-black/30 flex items-center justify-center">
              <ShoppingBag className="w-4 h-4" />
            </div>
            <div>
              <DialogTitle className="text-sm font-black uppercase tracking-tight text-white">
                {confirmedOrder ? '¡Pedido Confirmado!' : 'Tu Comanda • Moe\'s Taberna'}
              </DialogTitle>
              <p className="text-[11px] text-white/80">
                {fulfillmentType === 'dine_in' ? `Servicio en Mesa ${selectedTable || '1'}` : 'Retiro en Barra'}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-7 h-7 rounded-full bg-black/20 hover:bg-black/40 flex items-center justify-center text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {confirmedOrder ? (
            /* Order Success View */
            <div className="space-y-4 text-center py-4 animate-in zoom-in-95">
              <div className="w-16 h-16 rounded-full bg-emerald-500/15 text-emerald-500 flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-10 h-10" />
              </div>

              <div className="space-y-1">
                <span className="text-xs font-black uppercase tracking-wider text-emerald-500">
                  Comanda #{confirmedOrder.order_number}
                </span>
                <h3 className="text-2xl font-black text-foreground">
                  ¡Ya lo estamos preparando! 🔥
                </h3>
                <p className="text-xs text-muted-foreground max-w-xs mx-auto">
                  La cocina y la barra de Moe's han recibido tu pedido. Tiempo estimado: 10-15 min.
                </p>
              </div>

              <div className="p-3.5 rounded-2xl bg-muted/40 border border-border text-left space-y-2 text-xs">
                <div className="flex justify-between font-medium">
                  <span className="text-muted-foreground">Destino:</span>
                  <span className="font-bold">{fulfillmentType === 'dine_in' ? `Mesa ${selectedTable || '1'}` : 'Retiro en Barra'}</span>
                </div>
                <div className="flex justify-between font-medium">
                  <span className="text-muted-foreground">Total:</span>
                  <span className="font-black text-amber-500">{venue.currency} {confirmedOrder.total}</span>
                </div>
                <div className="flex justify-between font-medium">
                  <span className="text-muted-foreground">Método:</span>
                  <span className="font-bold uppercase">{paymentMethod.replace('_', ' ')}</span>
                </div>
              </div>

              <div className="flex flex-col gap-2 pt-2">
                <Button
                  onClick={handleShareWhatsApp}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs h-10 rounded-xl shadow-md flex items-center justify-center gap-2"
                >
                  <Share2 className="w-4 h-4" />
                  <span>Enviar Comanda por WhatsApp</span>
                </Button>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setConfirmedOrder(null);
                    onClose();
                  }}
                  className="text-xs h-10 rounded-xl"
                >
                  Cerrar & Seguir Viendo el Menú
                </Button>
              </div>
            </div>
          ) : (
            /* Cart & Express Checkout Form */
            <form onSubmit={handleSubmitOrder} className="space-y-4">
              {/* Item List */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs font-black uppercase tracking-wider text-muted-foreground">
                  <span>Platos y Bebidas ({getTotalItems()})</span>
                  {cartState.items.length > 0 && (
                    <button
                      type="button"
                      onClick={clearCart}
                      className="text-[11px] text-red-500 hover:underline font-normal flex items-center gap-1"
                    >
                      <Trash2 className="w-3 h-3" /> Vaciar
                    </button>
                  )}
                </div>

                {cartState.items.length === 0 ? (
                  <div className="p-8 text-center rounded-2xl bg-muted/20 border border-dashed border-border text-muted-foreground">
                    <ShoppingBag className="w-10 h-10 mx-auto mb-2 opacity-30" />
                    <p className="text-xs font-bold">Tu comanda está vacía</p>
                    <p className="text-[11px] mt-0.5">Elige salchipapas, nachos o chopp helado para empezar.</p>
                  </div>
                ) : (
                  <div className="divide-y divide-border/60 bg-muted/20 rounded-2xl p-2 border border-border/70 max-h-48 overflow-y-auto">
                    {cartState.items.map((item) => (
                      <div key={item.id} className="py-2 px-1 flex items-center justify-between gap-2">
                        <div className="flex-1">
                          <p className="text-xs font-bold text-foreground line-clamp-1">{item.name}</p>
                          <p className="text-[10px] text-amber-500 font-bold">{venue.currency} {item.price}</p>
                        </div>

                        <div className="flex items-center gap-1.5">
                          <button
                            type="button"
                            onClick={() => removeItem(item.id)}
                            className="w-6 h-6 rounded-md bg-background hover:bg-muted text-foreground flex items-center justify-center border border-border"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="text-xs font-black w-4 text-center">{item.quantity}</span>
                          <button
                            type="button"
                            onClick={() => addItem(item)}
                            className="w-6 h-6 rounded-md bg-primary text-primary-foreground flex items-center justify-center"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>

                        <div className="text-right min-w-[50px]">
                          <span className="text-xs font-black text-foreground">
                            {venue.currency} {item.price * item.quantity}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* AI Upsell Strip ("¿Completamos tu mesa?") */}
              {cartState.items.length > 0 && (
                <div className="p-3 rounded-2xl bg-gradient-to-r from-amber-500/10 via-card to-red-500/10 border border-amber-500/30 space-y-2">
                  <div className="flex items-center gap-1.5 text-[11px] font-black uppercase text-amber-500">
                    <Sparkles className="w-3.5 h-3.5 fill-amber-500" />
                    <span>¿Completamos tu mesa? (Sugerencias AI)</span>
                  </div>

                  <div className="grid grid-cols-3 gap-2">
                    {upsellItems.map((up) => (
                      <button
                        key={up.id}
                        type="button"
                        onClick={() => handleAddUpsell(up)}
                        className="p-2 rounded-xl bg-background border border-border/80 hover:border-amber-500 text-left transition-all hover:scale-105 shadow-xs flex flex-col justify-between"
                      >
                        <div>
                          <span className="text-[8px] font-bold text-primary block leading-none">{up.badge}</span>
                          <p className="text-[10px] font-bold text-foreground line-clamp-1 mt-0.5">{up.name}</p>
                        </div>
                        <div className="flex items-center justify-between pt-1 mt-1 border-t border-border/40">
                          <span className="text-[10px] font-black text-amber-500">+{venue.currency}{up.price}</span>
                          <Plus className="w-3 h-3 text-primary" />
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Customer Info & Table */}
              <div className="space-y-3 pt-1">
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-[11px] font-bold text-foreground mb-1 block">Tu Nombre</label>
                    <Input
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      placeholder="Ej. Lucas SCZ"
                      className="text-xs h-9"
                      required
                    />
                  </div>

                  <div>
                    <label className="text-[11px] font-bold text-foreground mb-1 block">N° de Mesa</label>
                    <Input
                      value={selectedTable || ''}
                      onChange={(e) => setSelectedTable(e.target.value)}
                      placeholder="Ej. 4, 12, VIP 1"
                      className="text-xs h-9 font-bold text-primary"
                      required={fulfillmentType === 'dine_in'}
                    />
                  </div>
                </div>

                <div>
                  <label className="text-[11px] font-bold text-foreground mb-1 block">Notas para Cocina (opcional)</label>
                  <Input
                    value={orderNotes}
                    onChange={(e) => setOrderNotes(e.target.value)}
                    placeholder="Ej. Sin cebolla, extra salsa de ajo, trago con bastante hielo"
                    className="text-xs h-9"
                  />
                </div>
              </div>

              {/* Bolivian Payment Selector */}
              <div className="space-y-1.5">
                <label className="text-[11px] font-black uppercase tracking-wider text-muted-foreground block">
                  Método de Pago en Bolivia
                </label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('qr_simple')}
                    className={`p-2.5 rounded-xl border-2 text-center flex flex-col items-center gap-1 transition-all ${
                      paymentMethod === 'qr_simple'
                        ? 'border-primary bg-primary/10 font-bold'
                        : 'border-border bg-muted/20 text-muted-foreground'
                    }`}
                  >
                    <QrCode className="w-4 h-4 text-primary" />
                    <span className="text-[10px] leading-tight">QR Simple</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPaymentMethod('cash')}
                    className={`p-2.5 rounded-xl border-2 text-center flex flex-col items-center gap-1 transition-all ${
                      paymentMethod === 'cash'
                        ? 'border-primary bg-primary/10 font-bold'
                        : 'border-border bg-muted/20 text-muted-foreground'
                    }`}
                  >
                    <Banknote className="w-4 h-4 text-emerald-500" />
                    <span className="text-[10px] leading-tight">Efectivo Mesa</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPaymentMethod('card')}
                    className={`p-2.5 rounded-xl border-2 text-center flex flex-col items-center gap-1 transition-all ${
                      paymentMethod === 'card'
                        ? 'border-primary bg-primary/10 font-bold'
                        : 'border-border bg-muted/20 text-muted-foreground'
                    }`}
                  >
                    <CreditCard className="w-4 h-4 text-amber-500" />
                    <span className="text-[10px] leading-tight">Tarjeta TPV</span>
                  </button>
                </div>
              </div>

              {/* Voluntary Tip Selector */}
              <div className="space-y-1.5">
                <div className="flex justify-between items-center text-[11px]">
                  <span className="font-bold text-muted-foreground">Propina voluntaria para el camarero:</span>
                  <span className="font-bold text-amber-500">Bs. {selectedTip}</span>
                </div>
                <div className="grid grid-cols-4 gap-2">
                  {[0, 5, 10, 20].map((tip) => (
                    <button
                      key={tip}
                      type="button"
                      onClick={() => setSelectedTip(tip)}
                      className={`py-1.5 rounded-lg text-xs font-bold border transition-all ${
                        selectedTip === tip
                          ? 'bg-amber-500 text-black border-amber-500 shadow-xs'
                          : 'bg-muted/30 border-border text-muted-foreground hover:text-foreground'
                      }`}
                    >
                      {tip === 0 ? 'Sin propina' : `Bs. ${tip}`}
                    </button>
                  ))}
                </div>
              </div>

              {/* Total & Submit Button */}
              <div className="pt-2 border-t border-border space-y-3">
                <div className="flex justify-between items-baseline">
                  <div>
                    <span className="text-xs text-muted-foreground block">Total a Pagar</span>
                    <span className="text-xs text-emerald-500 font-bold">Servicio digital gratuito</span>
                  </div>
                  <div className="text-right">
                    <span className="text-2xl font-black text-amber-500">
                      {venue.currency} {grandTotal}
                    </span>
                  </div>
                </div>

                <Button
                  type="submit"
                  disabled={isSubmitting || cartState.items.length === 0}
                  className="w-full bg-gradient-to-r from-amber-500 via-red-600 to-amber-600 hover:from-amber-600 hover:to-red-700 text-white font-black text-sm h-12 rounded-xl shadow-xl hover:scale-[1.01] transition-all flex items-center justify-center gap-2"
                >
                  {isSubmitting ? (
                    'Enviando a Cocina...'
                  ) : (
                    <>
                      <span>Enviar Pedido a Cocina ({venue.currency} {grandTotal})</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </Button>
              </div>
            </form>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};
