import React, { useEffect } from 'react';
import { Sparkles, Clock, Plus, Flame, ArrowRight } from 'lucide-react';
import { CyclingOffer } from '@/types/mimenu';
import { useMimenu } from '@/lib/mimenuContext';
import { useCart } from '@/lib/cartContext';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

export const CyclingOffersBanner: React.FC = () => {
  const { activeOffers, recordOfferImpression, recordOfferClick, recordOfferConversion, venue } = useMimenu();
  const { addItem } = useCart();

  useEffect(() => {
    activeOffers.forEach(offer => {
      recordOfferImpression(offer.id);
    });
  }, [activeOffers]);

  if (activeOffers.length === 0) return null;

  const handleAddOfferToCart = (offer: CyclingOffer) => {
    recordOfferClick(offer.id);
    recordOfferConversion(offer.id, offer.discount_price);
    
    // Add to cart as special promotional bundle
    addItem({
      id: offer.id,
      name: offer.title.replace(/^[^\w\s]+/, '').trim(),
      description: offer.subtitle,
      price: offer.discount_price,
      category_id: 'cat-promos',
      available: true,
    });

    toast.success(`¡${offer.title} agregada a tu pedido!`, {
      description: `Ahorraste ${venue.currency} ${offer.original_price - offer.discount_price}`,
    });
  };

  return (
    <section className="mb-8">
      <div className="flex items-center justify-between mb-3 px-1">
        <div className="flex items-center gap-2">
          <span className="flex h-2.5 w-2.5 rounded-full bg-red-500 animate-ping" />
          <h3 className="text-base font-black tracking-tight text-foreground uppercase flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-amber-500 fill-amber-500" />
            Ofertas Inteligentes en Vivo
          </h3>
        </div>
        <span className="text-xs text-muted-foreground font-medium hidden sm:inline">
          Rotan automáticamente según el horario
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {activeOffers.map((offer) => {
          const discountPct = Math.round(
            ((offer.original_price - offer.discount_price) / offer.original_price) * 100
          );

          return (
            <div
              key={offer.id}
              className="relative overflow-hidden rounded-2xl border-2 border-amber-500/40 bg-gradient-to-br from-amber-500/10 via-background to-red-500/10 p-4 shadow-lg hover:shadow-xl transition-all duration-300 flex flex-col justify-between group"
            >
              {/* Badge & Discount */}
              <div className="flex items-start justify-between gap-2 mb-3">
                <div className="inline-flex items-center gap-1 bg-gradient-to-r from-red-600 to-amber-600 text-white font-black text-xs px-2.5 py-1 rounded-full shadow-xs uppercase tracking-wider">
                  <Flame className="w-3.5 h-3.5 fill-white" />
                  <span>{offer.badge || 'PROMO TOP'}</span>
                </div>
                <div className="bg-red-500/15 text-red-500 border border-red-500/30 text-xs font-black px-2 py-0.5 rounded-md">
                  -{discountPct}% OFF
                </div>
              </div>

              {/* Offer Info */}
              <div className="space-y-1.5 flex-1">
                <h4 className="text-base font-bold text-foreground leading-snug group-hover:text-amber-500 transition-colors">
                  {offer.title}
                </h4>
                <p className="text-xs text-muted-foreground line-clamp-2">
                  {offer.description}
                </p>

                {offer.included_item_names && offer.included_item_names.length > 0 && (
                  <div className="pt-2 flex flex-wrap gap-1.5">
                    {offer.included_item_names.map((item, idx) => (
                      <span
                        key={idx}
                        className="text-[10px] font-medium bg-secondary/40 text-foreground/80 px-2 py-0.5 rounded-sm border border-border/40"
                      >
                        ✓ {item}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Price & Action */}
              <div className="flex items-center justify-between gap-3 pt-4 mt-3 border-t border-border/60">
                <div>
                  <div className="text-[11px] text-muted-foreground line-through">
                    {venue.currency} {offer.original_price}
                  </div>
                  <div className="text-lg font-black text-amber-500">
                    {venue.currency} {offer.discount_price}
                  </div>
                </div>

                <Button
                  size="sm"
                  onClick={() => handleAddOfferToCart(offer)}
                  className="bg-gradient-to-r from-amber-500 to-red-600 hover:from-amber-600 hover:to-red-700 text-white font-bold text-xs shadow-md group-hover:scale-105 transition-all flex items-center gap-1.5"
                >
                  <Plus className="w-3.5 h-3.5 stroke-[3]" />
                  <span>Pedir Combo</span>
                </Button>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};
