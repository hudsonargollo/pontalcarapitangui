import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { UtensilsCrossed, ShoppingBag, QrCode, CheckCircle2, MapPin } from 'lucide-react';
import { useMimenu } from '@/lib/mimenuContext';
import { FulfillmentType } from '@/types/mimenu';
import { toast } from 'sonner';

interface TableSelectorModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const TableSelectorModal: React.FC<TableSelectorModalProps> = ({
  isOpen,
  onClose,
}) => {
  const { 
    venue, 
    tables, 
    selectedTable, 
    setSelectedTable, 
    fulfillmentType, 
    setFulfillmentType,
    resolveTableByHash 
  } = useMimenu();

  const [inputTable, setInputTable] = useState(selectedTable || '');
  const [activeMode, setActiveMode] = useState<FulfillmentType>(fulfillmentType);

  const handleSave = () => {
    if (activeMode === 'dine_in') {
      if (!inputTable.trim()) {
        toast.error('Por favor selecciona o escribe el número de tu mesa');
        return;
      }
      // Check if hash matches
      const matched = resolveTableByHash(inputTable.trim());
      const tableToSave = matched ? matched.table_number : inputTable.trim();
      setSelectedTable(tableToSave);
      setFulfillmentType('dine_in');
      toast.success(`Mesa configurada: ${tableToSave}`);
    } else {
      setSelectedTable(null);
      setFulfillmentType('pickup');
      toast.success('Modo Retiro en Barra / Pickup seleccionado');
    }
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-md w-full bg-card border-border">
        <DialogHeader>
          <div className="flex items-center gap-2 text-primary font-semibold text-xs uppercase tracking-wider">
            <QrCode className="w-4 h-4" />
            <span>Ubicación del Pedido</span>
          </div>
          <DialogTitle className="text-xl font-bold">
            ¿Cómo vas a disfrutar hoy en {venue.name}?
          </DialogTitle>
          <DialogDescription className="text-xs text-muted-foreground">
            {venue.address}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 pt-2">
          {/* Fulfillment Toggle */}
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => setActiveMode('dine_in')}
              className={`p-4 rounded-xl border-2 text-left transition-all flex flex-col justify-between gap-2 ${
                activeMode === 'dine_in'
                  ? 'border-primary bg-primary/10 shadow-sm'
                  : 'border-border/60 bg-muted/20 hover:border-border'
              }`}
            >
              <div className="flex items-center justify-between">
                <UtensilsCrossed className={`w-5 h-5 ${activeMode === 'dine_in' ? 'text-primary' : 'text-muted-foreground'}`} />
                {activeMode === 'dine_in' && <CheckCircle2 className="w-4 h-4 text-primary" />}
              </div>
              <div>
                <p className="font-bold text-sm text-foreground">En el Local</p>
                <p className="text-[11px] text-muted-foreground">Servicio directo a tu mesa</p>
              </div>
            </button>

            <button
              type="button"
              onClick={() => setActiveMode('pickup')}
              className={`p-4 rounded-xl border-2 text-left transition-all flex flex-col justify-between gap-2 ${
                activeMode === 'pickup'
                  ? 'border-primary bg-primary/10 shadow-sm'
                  : 'border-border/60 bg-muted/20 hover:border-border'
              }`}
            >
              <div className="flex items-center justify-between">
                <ShoppingBag className={`w-5 h-5 ${activeMode === 'pickup' ? 'text-primary' : 'text-muted-foreground'}`} />
                {activeMode === 'pickup' && <CheckCircle2 className="w-4 h-4 text-primary" />}
              </div>
              <div>
                <p className="font-bold text-sm text-foreground">Retiro en Barra</p>
                <p className="text-[11px] text-muted-foreground">Para llevar o pasar a recoger</p>
              </div>
            </button>
          </div>

          {/* If Dine-In, Table Selector Grid */}
          {activeMode === 'dine_in' && (
            <div className="space-y-3 pt-2">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-foreground">
                  Selecciona tu Mesa o escribe el número:
                </label>
                {inputTable && (
                  <span className="text-xs font-black text-primary bg-primary/10 px-2 py-0.5 rounded">
                    Mesa {inputTable}
                  </span>
                )}
              </div>

              {/* Quick Table Grid */}
              <div className="grid grid-cols-4 sm:grid-cols-6 gap-2 max-h-40 overflow-y-auto p-1 bg-muted/20 rounded-lg border border-border/50">
                {tables.map((t) => (
                  <button
                    key={t.id}
                    type="button"
                    onClick={() => setInputTable(t.table_number)}
                    className={`py-2 px-1 text-xs font-bold rounded-lg border transition-all ${
                      inputTable === t.table_number
                        ? 'bg-primary text-primary-foreground border-primary shadow-sm scale-105'
                        : 'bg-background hover:bg-muted text-foreground border-border/70'
                    }`}
                  >
                    {t.table_number}
                  </button>
                ))}
              </div>

              <div className="flex gap-2 items-center">
                <Input
                  value={inputTable}
                  onChange={(e) => setInputTable(e.target.value)}
                  placeholder="O escribe ej: 14, VIP 2, Barra 1"
                  className="text-xs h-9"
                />
              </div>
            </div>
          )}

          {/* Action buttons */}
          <div className="flex gap-2 pt-3 border-t border-border">
            <Button
              variant="outline"
              size="sm"
              className="flex-1 text-xs"
              onClick={onClose}
            >
              Cerrar
            </Button>
            <Button
              size="sm"
              onClick={handleSave}
              className="flex-1 text-xs bg-primary text-primary-foreground font-bold shadow-md"
            >
              Confirmar
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
