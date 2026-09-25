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
import { Star, Sparkles, ExternalLink, MessageSquare, ShieldAlert, CheckCircle2 } from 'lucide-react';
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

  const getRatingFeedbackLabel = (score: number) => {
    switch (score) {
      case 5:
        return 'Excelente experiencia';
      case 4:
        return 'Muy buena experiencia';
      case 3:
        return 'Aceptable / Regular';
      case 2:
        return 'Podría mejorar';
      case 1:
        return 'Experiencia insatisfactoria';
      default:
        return '';
    }
  };

  const handleSubmitReview = (e: React.FormEvent) => {
    e.preventDefault();
    const finalName = customerName.trim() || 'Cliente Satisfecho';
    const finalComment = comment.trim() || (rating >= 4 ? 'Excelente atención y comida deliciosa.' : 'Comentario sobre el servicio.');

    // Save review internally in MiMenu store
    addReview('venue-overall', finalName, rating, finalComment);

    if (rating >= 4) {
      // 4-5 Star: Direct to Google Maps
      window.open(googleMapsUrl, '_blank', 'noopener,noreferrer');
      toast.success('¡Gracias por tu reseña! Redirigiendo a Google Maps...', {
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
      <DialogContent className="max-w-md w-full p-0 overflow-hidden bg-card border-border rounded-2xl sm:rounded-3xl shadow-2xl">
        {/* Modal Header */}
        <div className="bg-slate-900 dark:bg-slate-950 text-white p-6 text-center relative border-b border-slate-800">
          <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center mx-auto mb-3 shadow-inner">
            <Star className="w-6 h-6 text-amber-400 fill-amber-400" aria-hidden="true" />
          </div>
          <DialogTitle className="text-xl font-bold tracking-tight text-white">
            ¿Cómo estuvo hoy tu experiencia?
          </DialogTitle>
          <DialogDescription className="text-slate-400 text-xs mt-1 font-medium">
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
                        aria-label={`Calificar ${star} de 5 estrellas`}
                        className="p-1 text-2xl sm:text-3xl transition-transform hover:scale-115 focus:outline-hidden focus-visible:ring-2 focus-visible:ring-amber-500 rounded-md"
                      >
                        <Star
                          className={`w-8 h-8 transition-colors ${
                            isFilled
                              ? 'text-amber-400 fill-amber-400 drop-shadow-xs'
                              : 'text-muted-foreground/30 hover:text-amber-300'
                          }`}
                          aria-hidden="true"
                        />
                      </button>
                    );
                  })}
                </div>
                
                <span className="text-xs font-bold tracking-wide uppercase text-amber-500">
                  {getRatingFeedbackLabel(hoverRating !== null ? hoverRating : rating)}
                </span>
              </div>

              {/* Dynamic message based on rating */}
              {rating >= 4 ? (
                <div className="p-3.5 rounded-xl bg-blue-500/10 border border-blue-500/30 text-xs space-y-1">
                  <div className="flex items-center gap-1.5 text-blue-600 dark:text-blue-400 font-bold">
                    <Sparkles className="w-4 h-4" aria-hidden="true" />
                    <span>Publica tu reseña directa en Google Maps</span>
                  </div>
                  <p className="text-muted-foreground text-[11px] leading-relaxed">
                    Al enviar, se abrirá la ficha de <strong>{venue.name}</strong> en Google para publicar tu calificación con 1 clic.
                  </p>
                </div>
              ) : (
                <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-xs space-y-1">
                  <div className="flex items-center gap-1.5 text-rose-600 dark:text-rose-400 font-bold">
                    <ShieldAlert className="w-4 h-4" aria-hidden="true" />
                    <span>Canal Privado de Feedback a Gerencia</span>
                  </div>
                  <p className="text-muted-foreground text-[11px] leading-relaxed">
                    Tu mensaje irá directamente a la administración para resolver cualquier observación de forma inmediata.
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
                      : "Cuéntanos qué podemos mejorar..."
                  }
                  rows={3}
                  className="text-xs rounded-xl bg-background resize-none"
                />
              </div>

              {/* Action Button */}
              <Button
                type="submit"
                className={`w-full font-bold text-xs py-5 rounded-xl shadow-md transition-all ${
                  rating >= 4
                    ? 'bg-blue-600 hover:bg-blue-700 text-white'
                    : 'bg-primary hover:bg-primary/90 text-primary-foreground'
                }`}
              >
                {rating >= 4 ? (
                  <>
                    <ExternalLink className="w-4 h-4 mr-1.5" aria-hidden="true" />
                    <span>Publicar en Google Maps</span>
                  </>
                ) : (
                  <>
                    <MessageSquare className="w-4 h-4 mr-1.5" aria-hidden="true" />
                    <span>Enviar Feedback a Administración</span>
                  </>
                )}
              </Button>
            </form>
          ) : (
            <div className="py-8 text-center space-y-3">
              <div className="w-14 h-14 rounded-full bg-emerald-500/10 text-emerald-500 border border-emerald-500/30 flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-8 h-8" aria-hidden="true" />
              </div>
              <h4 className="text-base font-bold text-foreground">
                ¡Gracias por tu opinión!
              </h4>
              <p className="text-xs text-muted-foreground max-w-xs mx-auto">
                {rating >= 4
                  ? 'Redirigiendo a Google Maps para completar tu publicación...'
                  : 'Tu mensaje fue recibido por la administración.'}
              </p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default GoogleReviewHunterModal;
