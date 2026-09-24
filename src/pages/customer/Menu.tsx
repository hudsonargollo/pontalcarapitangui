import React, { useState, useMemo, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Flame, 
  Star, 
  Plus, 
  Minus, 
  Sparkles, 
  ShoppingBag, 
  UtensilsCrossed, 
  ChevronRight
} from 'lucide-react';
import { useMimenu } from '@/lib/mimenuContext';
import { useCart } from '@/lib/cartContext';
import { MenuItemDetail } from '@/types/mimenu';
import { MimenuHeader } from '@/components/MimenuHeader';
import { HotnessIndicator } from '@/components/HotnessIndicator';
import { ItemReviewDialog } from '@/components/ItemReviewDialog';
import { CyclingOffersBanner } from '@/components/CyclingOffersBanner';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

const Menu: React.FC = () => {
  const navigate = useNavigate();
  const { venue, categories, selectedTable, fulfillmentType } = useMimenu();
  const { addItem, removeItem, getItemQuantity, getTotalItems, getTotalPrice } = useCart();

  const [activeCategoryKey, setActiveCategoryKey] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [onlyHot, setOnlyHot] = useState<boolean>(false);
  const [selectedReviewItem, setSelectedReviewItem] = useState<MenuItemDetail | null>(null);

  useEffect(() => {
    document.title = `${venue.name} — Menú Digital & Pedidos Santa Cruz`;
  }, [venue.name]);

  // Flatten and filter items
  const allItems = useMemo(() => {
    return categories.flatMap(cat => cat.items);
  }, [categories]);

  const filteredItems = useMemo(() => {
    return allItems.filter(item => {
      // Category filter
      if (activeCategoryKey !== 'all' && item.category_id !== activeCategoryKey) {
        return false;
      }
      // Hot filter
      if (onlyHot && item.hotness_score < 4) {
        return false;
      }
      // Search filter
      if (searchTerm.trim()) {
        const term = searchTerm.toLowerCase();
        const matchesName = item.name.toLowerCase().includes(term);
        const matchesDesc = item.description?.toLowerCase().includes(term);
        const matchesTags = item.tags?.some(t => t.toLowerCase().includes(term));
        return matchesName || matchesDesc || matchesTags;
      }
      return true;
    });
  }, [allItems, activeCategoryKey, onlyHot, searchTerm]);

  const handleAddToCart = (item: MenuItemDetail) => {
    addItem({
      id: item.id,
      name: item.name,
      description: item.description,
      price: item.price,
      category_id: item.category_id,
      available: item.is_available,
    });
    toast.success(`Agregaste 1x ${item.name}`, {
      description: `${venue.currency} ${item.price}`,
    });
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col selection:bg-amber-500 selection:text-white pb-24">
      {/* Dynamic Header */}
      <MimenuHeader
        searchValue={searchTerm}
        onSearchChange={setSearchTerm}
      />

      <main className="max-w-6xl mx-auto px-4 py-6 w-full flex-1">
        {/* Venue Welcome Banner */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-amber-600 via-red-600 to-amber-700 text-white p-6 md:p-8 mb-8 shadow-xl">
          <div className="absolute right-0 top-0 bottom-0 w-1/2 opacity-20 pointer-events-none bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-yellow-300 via-red-500 to-transparent" />
          
          <div className="relative z-10 max-w-2xl space-y-2">
            <div className="inline-flex items-center gap-2 bg-black/30 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider text-amber-300 border border-white/10">
              <Flame className="w-3.5 h-3.5 fill-amber-300" />
              <span>Santa Cruz de la Sierra • Noche & Bajón</span>
            </div>
            
            <h1 className="text-2xl md:text-4xl font-black tracking-tight leading-tight">
              {venue.name}
            </h1>
            
            <p className="text-sm md:text-base text-white/90 font-medium">
              {venue.description}
            </p>

            <div className="pt-2 flex flex-wrap items-center gap-4 text-xs font-semibold text-white/80">
              <span className="flex items-center gap-1.5">
                📍 {venue.address}
              </span>
              <span className="flex items-center gap-1.5">
                🕒 {venue.opening_hours}
              </span>
            </div>
          </div>
        </div>

        {/* 5.1 Intelligent Cycling Offers Banner */}
        <CyclingOffersBanner />

        {/* Category Navigation Bar & Hotness Filter */}
        <div className="sticky top-24 z-30 bg-background/95 backdrop-blur-md py-3 mb-6 border-b border-border flex items-center justify-between gap-3 overflow-x-auto no-scrollbar">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveCategoryKey('all')}
              className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                activeCategoryKey === 'all'
                  ? 'bg-primary text-primary-foreground shadow-md'
                  : 'bg-muted/40 hover:bg-muted text-muted-foreground hover:text-foreground'
              }`}
            >
              🍽️ Todo el Menú ({allItems.length})
            </button>

            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveCategoryKey(cat.id)}
                className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                  activeCategoryKey === cat.id
                    ? 'bg-primary text-primary-foreground shadow-md'
                    : 'bg-muted/40 hover:bg-muted text-muted-foreground hover:text-foreground'
                }`}
              >
                {cat.name} ({cat.items.length})
              </button>
            ))}
          </div>

          {/* Hotness Filter Toggle */}
          <button
            onClick={() => setOnlyHot(!onlyHot)}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-black whitespace-nowrap border transition-all ${
              onlyHot
                ? 'bg-red-500 text-white border-red-500 shadow-md animate-pulse'
                : 'bg-red-500/10 text-red-500 border-red-500/30 hover:bg-red-500/20'
            }`}
          >
            <Flame className={`w-4 h-4 ${onlyHot ? 'fill-white' : 'fill-red-500'}`} />
            <span>🔥 Solo En Llamas</span>
          </button>
        </div>

        {/* Products Grid */}
        {filteredItems.length === 0 ? (
          <div className="text-center py-16 bg-muted/20 rounded-2xl border border-dashed border-border">
            <UtensilsCrossed className="w-12 h-12 text-muted-foreground mx-auto mb-3 opacity-40" />
            <h3 className="text-lg font-bold text-foreground">No encontramos platos con esos filtros</h3>
            <p className="text-xs text-muted-foreground mt-1">Prueba seleccionando otra categoría o borrando la búsqueda.</p>
            <Button
              variant="outline"
              size="sm"
              className="mt-4 text-xs"
              onClick={() => {
                setActiveCategoryKey('all');
                setSearchTerm('');
                setOnlyHot(false);
              }}
            >
              Restablecer Filtros
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredItems.map((item) => {
              const qtyInCart = getItemQuantity(item.id);

              return (
                <motion.div
                  key={item.id}
                  layout
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.2 }}
                  className="group relative flex flex-col justify-between bg-card hover:bg-card/90 border border-border/80 hover:border-primary/50 rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300"
                >
                  {/* Product Image & Badges */}
                  <div className="relative aspect-16/10 w-full overflow-hidden bg-muted">
                    <img
                      src={item.image_url}
                      alt={item.name}
                      className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                      loading="lazy"
                    />

                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                    {/* Top Badges */}
                    <div className="absolute top-3 left-3 right-3 flex items-start justify-between gap-2">
                      <div className="flex flex-wrap gap-1">
                        {item.is_best_seller && (
                          <span className="bg-amber-500 text-black text-[10px] font-black uppercase px-2 py-0.5 rounded shadow-sm">
                            ⭐ MÁS VENDIDO
                          </span>
                        )}
                        {item.original_price && (
                          <span className="bg-red-600 text-white text-[10px] font-black uppercase px-2 py-0.5 rounded shadow-sm">
                            PROMO
                          </span>
                        )}
                      </div>

                      {/* Hotness Score Tag */}
                      <HotnessIndicator score={item.hotness_score} compact />
                    </div>

                    {/* Bottom Price in Image */}
                    <div className="absolute bottom-3 left-3 right-3 flex items-end justify-between">
                      <div>
                        {item.original_price && (
                          <span className="text-xs text-white/70 line-through mr-2 font-medium">
                            {venue.currency} {item.original_price}
                          </span>
                        )}
                        <span className="text-xl font-black text-amber-400 drop-shadow-md">
                          {venue.currency} {item.price}
                        </span>
                      </div>

                      {/* Review Star Button */}
                      <button
                        onClick={() => setSelectedReviewItem(item)}
                        className="bg-black/60 hover:bg-black/80 backdrop-blur-md text-white text-xs font-bold px-2.5 py-1 rounded-full flex items-center gap-1 border border-white/20 transition-all hover:scale-105"
                      >
                        <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                        <span>{item.average_rating || 5.0}</span>
                        <span className="text-[10px] text-white/70">({item.reviews_count})</span>
                      </button>
                    </div>
                  </div>

                  {/* Card Body */}
                  <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                    <div className="space-y-1.5">
                      <h3 className="font-bold text-base text-foreground leading-snug group-hover:text-primary transition-colors">
                        {item.name}
                      </h3>
                      <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
                        {item.description || 'Delicioso plato preparado al momento con los mejores ingredientes.'}
                      </p>

                      {/* Tags */}
                      {item.tags && item.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1 pt-1">
                          {item.tags.map((tag, idx) => (
                            <span
                              key={idx}
                              className="text-[10px] bg-secondary/30 text-muted-foreground px-2 py-0.5 rounded-sm"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Hotness Thermometer Bar */}
                    <div className="pt-2 border-t border-border/40">
                      <HotnessIndicator
                        score={item.hotness_score}
                        velocity24h={item.velocity_24h}
                        showThermometer={true}
                      />
                    </div>

                    {/* Add to Cart Actions */}
                    <div className="pt-2">
                      {qtyInCart === 0 ? (
                        <Button
                          onClick={() => handleAddToCart(item)}
                          className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-bold text-xs shadow-sm flex items-center justify-center gap-1.5 h-10 rounded-xl"
                        >
                          <Plus className="w-4 h-4 stroke-[3]" />
                          <span>Agregar al Pedido</span>
                        </Button>
                      ) : (
                        <div className="flex items-center justify-between bg-primary/10 border border-primary/30 rounded-xl p-1">
                          <button
                            onClick={() => removeItem(item.id)}
                            className="w-8 h-8 rounded-lg bg-background hover:bg-muted text-foreground flex items-center justify-center transition-all shadow-xs"
                          >
                            <Minus className="w-4 h-4" />
                          </button>
                          <div className="flex flex-col items-center">
                            <span className="text-xs font-black text-primary">
                              {qtyInCart} en el carrito
                            </span>
                            <span className="text-[10px] text-muted-foreground font-bold">
                              {venue.currency} {item.price * qtyInCart}
                            </span>
                          </div>
                          <button
                            onClick={() => handleAddToCart(item)}
                            className="w-8 h-8 rounded-lg bg-primary text-primary-foreground flex items-center justify-center transition-all shadow-xs hover:scale-105"
                          >
                            <Plus className="w-4 h-4 stroke-[3]" />
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </main>

      {/* Floating Bottom Cart Bar for Mobile */}
      {getTotalItems() > 0 && (
        <div className="fixed bottom-4 left-4 right-4 z-40 max-w-md mx-auto">
          <button
            onClick={() => navigate('/checkout')}
            className="w-full bg-gradient-to-r from-amber-500 via-red-600 to-amber-600 text-white p-4 rounded-2xl shadow-2xl flex items-center justify-between border border-white/20 hover:scale-[1.02] transition-transform animate-in slide-in-from-bottom"
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-black/30 flex items-center justify-center font-black text-sm">
                {getTotalItems()}
              </div>
              <div className="text-left">
                <p className="text-xs font-bold uppercase tracking-wider text-amber-200">
                  {fulfillmentType === 'dine_in' ? `Mesa ${selectedTable || '1'}` : 'Retiro en Barra'}
                </p>
                <p className="text-sm font-black">Ver Pedido & Pagar</p>
              </div>
            </div>

            <div className="flex items-center gap-2 font-black text-base">
              <span>{venue.currency} {getTotalPrice()}</span>
              <ChevronRight className="w-5 h-5" />
            </div>
          </button>
        </div>
      )}

      {/* Item Review Dialog */}
      <ItemReviewDialog
        item={selectedReviewItem}
        isOpen={!!selectedReviewItem}
        onClose={() => setSelectedReviewItem(null)}
      />
    </div>
  );
};

export default Menu;
