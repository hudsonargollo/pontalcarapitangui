import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ShoppingBag, UtensilsCrossed, Sparkles, MapPin, Search, Menu as MenuIcon, X, ShieldAlert, Award } from 'lucide-react';
import { useMimenu } from '@/lib/mimenuContext';
import { useCart } from '@/lib/cartContext';
import { Button } from '@/components/ui/button';
import { TableSelectorModal } from '@/components/TableSelectorModal';
import { CartDrawerExpress } from '@/components/CartDrawerExpress';

interface MimenuHeaderProps {
  onSearchChange?: (term: string) => void;
  searchValue?: string;
  showSearch?: boolean;
}

export const MimenuHeader: React.FC<MimenuHeaderProps> = ({
  onSearchChange,
  searchValue = '',
  showSearch = true,
}) => {
  const navigate = useNavigate();
  const { venue, selectedTable, fulfillmentType } = useMimenu();
  const { getTotalItems, getTotalPrice } = useCart();
  const [isTableModalOpen, setIsTableModalOpen] = useState(false);
  const [isCartDrawerOpen, setIsCartDrawerOpen] = useState(false);

  const totalCartItems = getTotalItems();
  const totalCartPrice = getTotalPrice();

  return (
    <>
      <header className="sticky top-0 z-40 w-full bg-background/90 backdrop-blur-md border-b border-border/70 shadow-xs">
        {/* Top Info Bar */}
        <div className="bg-gradient-to-r from-amber-600 via-red-600 to-amber-600 text-white text-[11px] font-bold py-1 px-4 flex items-center justify-between">
          <div className="flex items-center gap-2 mx-auto sm:mx-0">
            <span className="flex h-2 w-2 rounded-full bg-yellow-300 animate-pulse" />
            <span>{venue.name} • {venue.city}</span>
            <span className="opacity-80 hidden md:inline">| {venue.opening_hours}</span>
          </div>

          <div className="hidden sm:flex items-center gap-3">
            <Link to="/admin/ai" className="hover:underline flex items-center gap-1 opacity-90 hover:opacity-100 font-bold">
              <Sparkles className="w-3 h-3 text-yellow-300" /> Copiloto AI
            </Link>
            <Link to="/admin" className="hover:underline flex items-center gap-1 opacity-90 hover:opacity-100">
              <ShieldAlert className="w-3 h-3" /> Panel Admin
            </Link>
          </div>
        </div>

        {/* Main Navbar */}
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between gap-3">
          {/* Logo & Brand */}
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-red-600 flex items-center justify-center text-white font-black text-xl shadow-md group-hover:scale-105 transition-transform">
              🍺
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-black text-lg tracking-tight text-foreground group-hover:text-amber-500 transition-colors">
                  {venue.name}
                </span>
                <span className="text-[10px] font-extrabold uppercase bg-amber-500/15 text-amber-500 px-1.5 py-0.5 rounded border border-amber-500/30">
                  SCZ
                </span>
              </div>
              <p className="text-[11px] text-muted-foreground line-clamp-1">
                {venue.tagline}
              </p>
            </div>
          </Link>

          {/* Table / Fulfillment Indicator */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsTableModalOpen(true)}
              className="flex items-center gap-2 bg-muted/40 hover:bg-muted/70 border border-border px-3 py-1.5 rounded-full text-xs font-bold text-foreground transition-all hover:scale-105 shadow-xs"
            >
              <UtensilsCrossed className="w-3.5 h-3.5 text-primary" />
              <span>
                {fulfillmentType === 'dine_in'
                  ? selectedTable
                    ? `Mesa ${selectedTable}`
                    : 'Elegir Mesa'
                  : 'Retiro en Barra'}
              </span>
              <span className="text-[10px] text-primary font-normal underline ml-0.5">
                Cambiar
              </span>
            </button>

            {/* Cart Button with Slide-Over Drawer */}
            <Button
              size="sm"
              onClick={() => setIsCartDrawerOpen(true)}
              className={`relative font-bold text-xs shadow-md transition-all ${
                totalCartItems > 0
                  ? 'bg-gradient-to-r from-amber-500 to-red-600 hover:from-amber-600 hover:to-red-700 text-white animate-pulse'
                  : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
              }`}
            >
              <ShoppingBag className="w-4 h-4 mr-1.5" />
              <span>
                {totalCartItems > 0
                  ? `${venue.currency} ${totalCartPrice}`
                  : 'Comanda'}
              </span>
              {totalCartItems > 0 && (
                <span className="absolute -top-1.5 -right-1.5 bg-red-600 text-white text-[10px] font-black w-5 h-5 rounded-full flex items-center justify-center border-2 border-background shadow-xs">
                  {totalCartItems}
                </span>
              )}
            </Button>
          </div>
        </div>

        {/* Search bar row if enabled */}
        {showSearch && onSearchChange && (
          <div className="max-w-6xl mx-auto px-4 pb-3">
            <div className="relative">
              <Search className="w-4 h-4 text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchValue}
                onChange={(e) => onSearchChange(e.target.value)}
                placeholder="Buscar salchipapas, nachos, tragos, chopp helado..."
                className="w-full pl-9 pr-4 py-2 text-xs rounded-xl bg-muted/30 border border-border focus:outline-hidden focus:border-primary focus:ring-1 focus:ring-primary transition-all text-foreground placeholder:text-muted-foreground"
              />
              {searchValue && (
                <button
                  onClick={() => onSearchChange('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>
        )}
      </header>

      {/* Table Selector Modal */}
      <TableSelectorModal
        isOpen={isTableModalOpen}
        onClose={() => setIsTableModalOpen(false)}
      />

      {/* Express Slide-Over Cart Drawer */}
      <CartDrawerExpress
        isOpen={isCartDrawerOpen}
        onClose={() => setIsCartDrawerOpen(false)}
      />
    </>
  );
};
