import React from 'react';
import AdminLayout from '@/components/AdminLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  MessageSquare, 
  Star, 
  CheckCircle, 
  XCircle, 
  Trash2, 
  ShieldCheck,
  User
} from 'lucide-react';
import { useMimenu } from '@/lib/mimenuContext';

export const AdminReviews: React.FC = () => {
  const { venue, categories, reviews, approveReview, rejectReview } = useMimenu();

  const allItems = categories.flatMap(c => c.items);
  const getItemName = (itemId: string) => {
    return allItems.find(i => i.id === itemId)?.name || 'Plato / Bebida';
  };

  const pendingReviews = reviews.filter(r => r.status === 'pending');
  const approvedReviews = reviews.filter(r => r.status === 'approved');

  return (
    <AdminLayout>
      <div className="space-y-8 pb-12">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-border">
          <div>
            <div className="flex items-center gap-2">
              <MessageSquare className="w-6 h-6 text-purple-500" />
              <h1 className="text-2xl sm:text-3xl font-black text-foreground">
                Cola de Moderación de Reseñas
              </h1>
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Controla y modera las opiniones de clientes de 1 a 5 estrellas sobre salchipapas, nachos, tragos y chopp antes o después de su publicación.
            </p>
          </div>

          <div className="flex items-center gap-2 text-xs font-bold text-muted-foreground">
            <span className="bg-amber-500/10 text-amber-500 px-2.5 py-1 rounded-full border border-amber-500/30">
              {pendingReviews.length} pendientes
            </span>
            <span className="bg-emerald-500/10 text-emerald-500 px-2.5 py-1 rounded-full border border-emerald-500/30">
              {approvedReviews.length} aprobadas
            </span>
          </div>
        </div>

        {/* Reviews List */}
        <div className="space-y-4">
          <h2 className="text-sm font-black uppercase tracking-wider text-foreground">
            Todas las Opiniones Registradas
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {reviews.map((rev) => {
              const itemName = getItemName(rev.item_id);

              return (
                <Card
                  key={rev.id}
                  className={`border-2 transition-all bg-card overflow-hidden shadow-xs ${
                    rev.status === 'pending'
                      ? 'border-amber-500/50 bg-amber-500/5'
                      : rev.status === 'rejected'
                      ? 'border-red-500/30 opacity-60'
                      : 'border-border/80'
                  }`}
                >
                  <CardHeader className="p-4 bg-muted/20 border-b border-border/60 pb-3 flex flex-row items-center justify-between">
                    <div>
                      <span className="text-[10px] font-extrabold uppercase text-primary">
                        {itemName}
                      </span>
                      <CardTitle className="text-sm font-bold text-foreground flex items-center gap-1.5 mt-0.5">
                        <User className="w-3.5 h-3.5 text-muted-foreground" />
                        <span>{rev.customer_name}</span>
                      </CardTitle>
                    </div>

                    <div className="flex items-center gap-0.5">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star
                          key={i}
                          className={`w-3.5 h-3.5 ${
                            i < rev.rating ? 'text-amber-500 fill-amber-500' : 'text-muted-foreground/30'
                          }`}
                        />
                      ))}
                    </div>
                  </CardHeader>

                  <CardContent className="p-4 space-y-3">
                    <p className="text-xs text-foreground/90 italic leading-relaxed">
                      "{rev.comment}"
                    </p>

                    <div className="flex items-center justify-between pt-2 border-t border-border/60 text-[11px]">
                      <span className="text-muted-foreground">
                        {new Date(rev.created_at).toLocaleString('es-BO')}
                      </span>

                      <div className="flex items-center gap-2">
                        {rev.status === 'pending' && (
                          <>
                            <Button
                              size="sm"
                              onClick={() => approveReview(rev.id)}
                              className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs h-7 px-3"
                            >
                              <CheckCircle className="w-3 h-3 mr-1" />
                              Aprobar
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => rejectReview(rev.id)}
                              className="text-red-500 hover:bg-red-500/10 font-bold text-xs h-7 px-3"
                            >
                              <XCircle className="w-3 h-3 mr-1" />
                              Rechazar
                            </Button>
                          </>
                        )}

                        {rev.status === 'approved' && (
                          <span className="text-emerald-500 font-bold flex items-center gap-1">
                            <CheckCircle className="w-3.5 h-3.5" /> Aprobada en Menú
                          </span>
                        )}

                        {rev.status === 'rejected' && (
                          <span className="text-red-500 font-bold flex items-center gap-1">
                            <XCircle className="w-3.5 h-3.5" /> Rechazada
                          </span>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminReviews;
