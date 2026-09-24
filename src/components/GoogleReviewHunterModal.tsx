import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Star, Sparkles, ExternalLink, HeartHandshake, CheckCircle2, MessageSquare, ShieldAlert } from 'lucide-react';
import { useMimenu } from '@/lib/mimenuContext';
import { toast } from 'sonner';

interface GoogleReviewHunterModalProps {
  isOpen: boolean;
  onClose: () => void;
  orderId?: string;
  defaultCustomerName?: string;
}

export const GoogleReviewHunterModal: React.FC<GoogleReviewHunterModalProps> = ({
  isOpen,
  onClose,
  orderId,
  defaultCustomerName = '',
}) => {
  const { venue, addReview } = useMimenu();
  const [rating, setRating] = useState<number>(5);
  const [hoverRating, setHoverRating] = useState<number | null>(null);
  const [customerName, setCustomerName] = useState(defaultCustomerName);
  const [comment, setComment] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  // Google Maps review link (fallback to search if not explicitly set)
  const googleMapsUrl = venue.google_review_url || `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(venue.name + ' ' + venue.city)}`;

  const handleRatingSelect = (selectedStar: number) => {
    setRating(selectedStar);
  };

  const handleSubmitReview = (e: React.FormEvent) => {
    e.preventDefault();
    const finalName = customerName.trim() || 'Cliente Satisfecho';
    const finalComment = comment.trim() || (rating >= 4 ? 'Excelente atención y comida deliciosa.' : 'Comentario sobre el servicio.');

    // Save review internally in MiMenu store
    addReview('venue-overall', finalName, rating, finalComment);

    if (rating >= 4) {
      // 5-Star: Direct to Google Maps
      window.open(googleMapsUrl, '_blank', 'noopener,noreferrer');
      toast.success('¡Gracias por tu reseña 5 estrellas! Redirigiendo a Google Maps...', {
        description: 'Tu opinión nos ayuda a seguir creciendo.',
      });
    } else {
      // Internal feedback for management
      toast.info('Gracias por tu feedback sincero.', {
        description: 'La gerencia revisará tus comentarios para mejorar el servicio de inmediato.',
      });
    }

    setIsSubmitted(true);
    setTimeout(() => {
      onClose();
      setIsSubmitted(false);
    }, 1500);
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-md w-full p-0 overflow-hidden bg-card border-border rounded-3xl shadow-2xl">
        {/* Modal Header */}
        <div className="bg-gradient-to-r from-amber-500 via-orange-500 to-red-600 text-white p-6 text-center relative">
          <div className="w-12 h-12 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center mx-auto mb-2 text-2xl shadow-inner">
            ⭐
          </div>
          <DialogTitle className="text-xl font-black text-white">
            ¿Cómo estuvo hoy tu noche?
          </DialogTitle>
          <DialogDescription className="text-white/90 text-xs mt-1 font-medium">
            Tu opinión en {venue.name} es fundamental para nosotros.
          </DialogDescription>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-5">
          {!isSubmitted ? (
            <form onSubmit={handleSubmitReview} className="space-y-4">
              {/* Star Rating Bar */}
              <div className="flex flex-col items-center justify-center space-y-2 py-1">
                <div className="flex items-center gap-2">
                  {[1, 2, 3, 4, 5].map((star) => {
                    const activeRating = hoverRating !== null ? hoverRating : rating;
                    const isFilled = star <= activeRating;
                    return (
                      <button
                        key={star}
                        type="button"
                        onClick={() => handleRatingSelect(star)}
                        onMouseEnter={() => setHoverRating(star)}
                        onMouseLeave={() => setHoverRating(null)}
                        className="p-1 text-2xl sm:text-3xl transition-transform hover:scale-125 focus:outline-none"
                      >
                        <Star
                          className={`w-8 h-8 transition-colors ${
                            isFilled
                              ? 'text-amber-400 fill-amber-400 drop-shadow-sm'
                              : 'text-muted-foreground/30 hover:text-amber-300'
                          }`}
                        />
                      </button>
                    );
                  })}
                </div>
                
                <span className="text-xs font-black uppercase tracking-wider text-amber-500">
                  {rating === 5 && '🔥 ¡Increíble! Excelente experiencia'}
                  {rating === 4 && '✨ Muy Buena comida y ambiente'}
                  {rating === 3 && '👍 Regular / Aceptable'}
                  {rating === 2 && '⚠️ Podría Mejorar'}
                  {rating === 1 && '❌ Mala experiencia'}
                </span>
              </div>

              {/* Dynamic message based on rating */}
              {rating >= 4 ? (
                <div className="p-3.5 rounded-2xl bg-gradient-to-r from-blue-500/10 to-indigo-500/10 border border-blue-500/30 text-xs space-y-1">
                  <div className="flex items-center gap-1.5 text-blue-500 font-bold">
                    <Sparkles className="w-4 h-4" />
                    <span>¡Sube tu reseña directo a Google Maps!</span>
                  </div>
                  <p className="text-muted-foreground text-[11px]">
                    Al enviar, se abrirá la ficha de <strong>{venue.name}</strong> en Google para publicar tus 5 estrellas en 1 clic.
                  </p>
                </div>
              ) : (
                <div className="p-3.5 rounded-2xl bg-red-500/10 border border-red-500/30 text-xs space-y-1">
                  <div className="flex items-center gap-1.5 text-red-500 font-bold">
                    <ShieldAlert className="w-4 h-4" />
                    <span>Canal Privado de Feedback a Gerencia</span>
                  </div>
                  <p className="text-muted-foreground text-[11px]">
                    Tu mensaje no se publicará en Google; irá directo al teléfono del administrador para solucionar cualquier inconveniente.
                  </p>
                </div>
              )}

              {/* Customer Inputs */}
              <div className="space-y-3">
                <Input
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  placeholder="Tu nombre (opcional)"
                  className="text-xs h-10 rounded-xl bg-background"
                />

                <Textarea
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder={
                    rating >= 4 
                      ? "¿Qué fue lo que más te gustó? (ej. La Salchipapa Monster y el Chopp bien frío)"
                      : "Cuéntanos qué salió mal para solucionarlo de inmediato..."
                  }
                  rows={3}
                  className="text-xs rounded-xl bg-background resize-none"
                />
              </div>

              {/* Action Button */}
              <Button
                type="submit"
                className={`w-full font-black text-xs py-5 rounded-2xl shadow-lg transition-all ${
                  rating >= 4
                    ? 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-blue-500/25'
                    : 'bg-primary hover:bg-primary/90 text-primary-foreground'
                }`}
              >
                {rating >= 4 ? (
                  <>
                    <ExternalLink className="w-4 h-4 mr-1.5" />
                    <span>Publicar en Google Maps (5★)</span>
                  </>
                ) : (
                  <>
                    <MessageSquare className="w-4 h-4 mr-1.5" />
                    <span>Enviar Feedback a Administración</span>
                  </>
                )}
              </Button>
            </form>
          ) : (
            <div className="py-8 text-center space-y-3">
              <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto animate-bounce" />
              <h4 className="text-base font-black text-foreground">¡Muchas Gracias!</h4>
              <p className="text-xs text-muted-foreground">Tu feedback fue registrado con éxito.</p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default GoogleReviewHunterModal;
