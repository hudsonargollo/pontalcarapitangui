import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { CheckCircle, ArrowLeft, Plus, Minus, X } from "lucide-react";
import { toast } from "sonner";
import { useCart } from "@/lib/cartContext";
import { normalizePhone } from "@/lib/phoneUtils";
import { notificationTriggers } from "@/integrations/whatsapp";

type CheckoutStep = 'NAME' | 'WHATSAPP' | 'CONFIRM' | 'REVIEW';

const WELCOME_PHRASES = [
  "Olá, é uma honra ter você aqui.",
  "Que alegria ter você conosco!",
  "Seja muito bem-vindo!",
  "É um prazer recebê-lo aqui.",
  "Que bom que você chegou!",
  "Estamos felizes em te atender!",
  "Sua presença nos alegra!",
  "Bem-vindo ao nosso cantinho!",
  "Que privilégio ter você aqui!",
  "Ficamos honrados com sua visita!",
  "É maravilhoso te ver por aqui!",
  "Sua chegada iluminou nosso dia!",
  "Que sorte a nossa te receber!",
  "Estamos radiantes com sua presença!",
  "Que felicidade ter você conosco!"
];

const Checkout = () => {
  const navigate = useNavigate();
  const { state: cartState, clearCart, addItem, removeItem } = useCart();
  
  useEffect(() => {
    document.title = "Checkout — PONTAL Carapitangui";
  }, []);
  
  const [step, setStep] = useState<CheckoutStep>('NAME');
  const [name, setName] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [errors, setErrors] = useState({ name: "", whatsapp: "" });
  const [touched, setTouched] = useState({ name: false, whatsapp: false });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isStaff, setIsStaff] = useState(false);
  const [welcomePhrase] = useState(() => {
    return WELCOME_PHRASES[Math.floor(Math.random() * WELCOME_PHRASES.length)];
  });
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

  useEffect(() => {
    const checkUserRole = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      const userRole = user?.user_metadata?.role;
      setIsStaff(userRole === 'waiter' || userRole === 'admin' || userRole === 'cashier');
    };
    checkUserRole();
  }, []);

  const pageVariants = {
    initial: { opacity: 0, x: 20 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -20 }
  };

  const transition = { duration: 0.3 };

  const capitalizeName = (name: string): string => {
    return name
      .trim()
      .toLowerCase()
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  const validateName = (value: string, showError: boolean = true): boolean => {
    const trimmed = value.trim();
    if (trimmed.length < 2) {
      if (showError) {
        setErrors(prev => ({ ...prev, name: "Nome deve ter pelo menos 2 caracteres" }));
      }
      return false;
    }
    setErrors(prev => ({ ...prev, name: "" }));
    return true;
  };

  const validateWhatsApp = (value: string, showError: boolean = true): boolean => {
    const digits = value.replace(/\D/g, '');
    if (digits.length !== 11) {
      if (showError) {
        setErrors(prev => ({ ...prev, whatsapp: "WhatsApp deve ter 11 dígitos (DDD + número)" }));
      }
      return false;
    }
    const ddd = parseInt(digits.substring(0, 2));
    if (ddd < 11 || ddd > 99) {
      if (showError) {
        setErrors(prev => ({ ...prev, whatsapp: "DDD inválido" }));
      }
      return false;
    }
    setErrors(prev => ({ ...prev, whatsapp: "" }));
    return true;
  };

  const handleNameContinue = () => {
    if (validateName(name)) {
      setName(capitalizeName(name));
      setStep('WHATSAPP');
    }
  };

  const handleWhatsAppContinue = () => {
    if (validateWhatsApp(whatsapp)) {
      if (isStaff) {
        handleGoToPayment();
      } else {
        setStep('CONFIRM');
      }
    }
  };

  const handleWhatsAppInput = (value: string) => {
    const digits = value.replace(/\D/g, '');
    setWhatsapp(digits.slice(0, 11));
  };

  useEffect(() => {
    if (step === 'CONFIRM') {
      const timer = setTimeout(() => {
        setStep('REVIEW');
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [step]);

  const handleGoToPayment = async () => {
    setIsSubmitting(true);
    
    try {
      const { data: { user } } = await supabase.auth.getUser();
      const userRole = user?.user_metadata?.role;
      const isWaiter = userRole === 'waiter';
      const isAdmin = userRole === 'admin' || userRole === 'cashier';
      const isStaff = isWaiter || isAdmin;
      
      const capitalizedName = capitalizeName(name);
      const normalizedPhone = normalizePhone(whatsapp);
      if (!normalizedPhone) {
        toast.error("Número de WhatsApp inválido");
        return;
      }

      try {
        const { error: customerError } = await supabase
          .from('customers')
          .upsert({
            whatsapp: normalizedPhone,
            name: capitalizedName,
            last_order_date: new Date().toISOString()
          }, {
            onConflict: 'whatsapp'
          });

        if (customerError) {
          console.error('Error upserting customer:', customerError);
        }
      } catch (err) {
        console.error('Exception upserting customer:', err);
      }

      const totalAmount = cartState.items.reduce((sum, item) => sum + item.price * item.quantity, 0);
      const commissionAmount = isWaiter ? totalAmount * 0.1 : 0;

      const orderData: any = {
        customer_name: capitalizedName,
        customer_phone: normalizedPhone,
        table_number: '-',
        status: isStaff ? 'in_preparation' : 'pending',
        payment_status: 'pending',
        total_amount: totalAmount
      };

      if (isWaiter && user) {
        orderData.waiter_id = user.id;
        orderData.commission_amount = commissionAmount;
        orderData.created_by_waiter = true;
      }
      
      if (isAdmin && user) {
        orderData.created_by_cashier = true;
        orderData.cashier_id = user.id;
      }

      const { data: order, error: orderError } = await supabase
        .from('orders')
        .insert(orderData)
        .select()
        .single();

      if (orderError || !order) {
        console.error('Error creating order:', orderError);
        toast.error("Erro ao criar pedido. Tente novamente.");
        return;
      }

      const orderItems = cartState.items.map((item) => ({
        order_id: order.id,
        menu_item_id: item.id,
        quantity: item.quantity,
        unit_price: item.price,
        item_name: item.name
      }));

      const { error: itemsError } = await supabase
        .from('order_items')
        .insert(orderItems);

      if (itemsError) {
        console.error('Error creating order items:', itemsError);
        toast.error("Erro ao criar itens do pedido. Tente novamente.");
        return;
      }

      sessionStorage.setItem('customerInfo', JSON.stringify({
        name: name.trim(),
        phone: normalizedPhone
      }));

      clearCart();

      if (isStaff) {
        toast.success("Pedido criado com sucesso!");
        
        setTimeout(() => {
          (async () => {
            try {
              await notificationTriggers.onOrderPreparing(order.id);
              console.log('✅ WhatsApp notification sent for staff order:', order.id);
            } catch (notifError) {
              console.error('❌ Failed to send WhatsApp notification:', notifError);
            }
          })().catch(err => {
            console.error('❌ WhatsApp notification error (caught):', err);
          });
        }, 100);

        if (isWaiter) {
          navigate('/waiter/dashboard');
        } else {
          navigate('/staff/cashier');
        }
      } else {
        toast.success("Pedido criado com sucesso!");
        navigate(`/payment/${order.id}`);

        setTimeout(() => {
          (async () => {
            try {
              const baseUrl = window.location.origin;
              await notificationTriggers.onOrderCreatedWithLinks(order.id, baseUrl);
              console.log('✅ WhatsApp notification triggered for order:', order.id);
            } catch (notifError) {
              console.error('❌ Failed to trigger WhatsApp notification:', notifError);
            }
          })().catch(err => {
            console.error('❌ WhatsApp notification error (caught):', err);
          });
        }, 100);
      }
      
    } catch (error) {
      console.error('Exception in handleGoToPayment:', error);
      toast.error("Erro ao processar. Tente novamente.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-background to-secondary/5">
      {/* Header */}
      <div className="bg-gradient-to-r from-primary via-primary/95 to-secondary text-white shadow-2xl sticky top-0 z-10 border-b-4 border-secondary">
        <div className="max-w-2xl mx-auto px-4 py-4 sm:py-6">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="icon"
              className="text-white hover:bg-white/20 transition-all rounded-lg"
              onClick={() => navigate("/menu")}
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div className="flex-1">
              <h1 className="text-xl sm:text-2xl font-display font-bold uppercase tracking-wider">Finalizar Pedido</h1>
              {name && (
                <p className="text-white/90 text-sm mt-0.5 font-body">{name}</p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-md mx-auto p-4 pt-8 pb-12 space-y-4">
        <AnimatePresence mode="wait">
          {step === 'NAME' && (
            <motion.div
              key="name"
              variants={pageVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              transition={transition}
            >
              <Card className="p-6 sm:p-8 shadow-lg border-0 rounded-2xl bg-white">
                <div className="text-center mb-8">
                  <div className="w-16 h-16 bg-gradient-to-br from-secondary to-secondary/80 text-white rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                    <span className="text-3xl">👋</span>
                  </div>
                  <h2 className="text-2xl sm:text-3xl font-display font-bold text-primary mb-2 uppercase tracking-wider">
                    {isStaff ? "Novo Pedido" : welcomePhrase}
                  </h2>
                  <p className="text-foreground/70 font-body text-sm">
                    {isStaff ? "Informe o nome do cliente" : "Como você gostaria de ser chamado?"}
                  </p>
                </div>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="name" className="text-base font-semibold text-foreground font-body">
                      Nome
                    </Label>
                    <Input
                      id="name"
                      type="text"
                      placeholder="ex: João"
                      value={name}
                      onChange={(e) => {
                        setName(e.target.value);
                        if (touched.name) {
                          validateName(e.target.value, true);
                        }
                      }}
                      onBlur={() => {
                        setTouched(prev => ({ ...prev, name: true }));
                        validateName(name, true);
                      }}
                      onKeyPress={(e) => e.key === 'Enter' && handleNameContinue()}
                      className="mt-2 text-lg h-14 border-2 border-accent/30 rounded-xl focus:border-secondary focus:ring-2 focus:ring-secondary/20 transition-all"
                      autoFocus
                    />
                    {touched.name && errors.name && (
                      <p className="text-red-500 text-sm mt-2 flex items-center gap-1 font-body">
                        <span>⚠️</span> {errors.name}
                      </p>
                    )}
                  </div>
                  <Button
                    onClick={handleNameContinue}
                    disabled={name.trim().length < 2}
                    className="w-full bg-gradient-to-r from-secondary to-secondary/90 hover:from-secondary/90 hover:to-secondary text-white font-display uppercase tracking-wider py-6 text-lg shadow-lg hover:shadow-xl transition-all rounded-xl disabled:opacity-50"
                  >
                    Continuar →
                  </Button>
                </div>
              </Card>
            </motion.div>
          )}

          {step === 'WHATSAPP' && (
            <motion.div
              key="whatsapp"
              variants={pageVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              transition={transition}
            >
              <Card className="p-6 sm:p-8 shadow-lg border-0 rounded-2xl bg-white">
                <div className="text-center mb-8">
                  <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-green-600 text-white rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                    <span className="text-3xl">📱</span>
                  </div>
                  <h2 className="text-2xl sm:text-3xl font-display font-bold text-primary mb-2 uppercase tracking-wider">
                    {isStaff ? "WhatsApp do Cliente" : `Ótimo, ${name}!`}
                  </h2>
                  <p className="text-foreground/70 font-body text-sm">
                    {isStaff 
                      ? "Informe o WhatsApp do cliente para enviar notificações" 
                      : "Agora precisamos do seu WhatsApp para te avisar quando o pedido estiver pronto"}
                  </p>
                </div>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="whatsapp" className="text-base font-semibold text-foreground font-body">
                      WhatsApp (com DDD)
                    </Label>
                    <Input
                      id="whatsapp"
                      type="tel"
                      placeholder="(71) 98765-4321"
                      value={whatsapp}
                      onChange={(e) => {
                        handleWhatsAppInput(e.target.value);
                        if (touched.whatsapp) {
                          validateWhatsApp(e.target.value, true);
                        }
                      }}
                      onBlur={() => {
                        setTouched(prev => ({ ...prev, whatsapp: true }));
                        validateWhatsApp(whatsapp, true);
                      }}
                      onKeyPress={(e) => e.key === 'Enter' && handleWhatsAppContinue()}
                      className="mt-2 text-lg h-14 border-2 border-accent/30 rounded-xl focus:border-green-500 focus:ring-2 focus:ring-green-500/20 transition-all"
                      autoFocus
                    />
                    <p className="text-xs text-accent/70 mt-1 font-body">Digite apenas números (DDD + número)</p>
                    {touched.whatsapp && errors.whatsapp && (
                      <p className="text-red-500 text-sm mt-2 flex items-center gap-1 font-body">
                        <span>⚠️</span> {errors.whatsapp}
                      </p>
                    )}
                  </div>
                  <Button
                    onClick={handleWhatsAppContinue}
                    disabled={whatsapp.replace(/\D/g, '').length !== 11}
                    className="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-display uppercase tracking-wider py-6 text-lg shadow-lg hover:shadow-xl transition-all rounded-xl disabled:opacity-50"
                  >
                    Confirmar →
                  </Button>
                </div>
              </Card>
            </motion.div>
          )}

          {step === 'CONFIRM' && (
            <motion.div
              key="confirm"
              variants={pageVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              transition={transition}
            >
              <Card className="p-8 shadow-lg text-center border-0 rounded-2xl bg-gradient-to-br from-green-50 to-green-100">
                <div className="w-20 h-20 bg-gradient-to-br from-green-500 to-green-600 text-white rounded-2xl flex items-center justify-center mx-auto mb-4 animate-bounce shadow-lg">
                  <CheckCircle className="w-12 h-12" />
                </div>
                <h2 className="text-2xl sm:text-3xl font-display font-bold text-green-700 mb-3 uppercase tracking-wider">
                  Tudo certo! ✨
                </h2>
                <p className="text-lg text-green-600 font-body">
                  Vamos te avisar pelo WhatsApp quando seu pedido estiver pronto!
                </p>
              </Card>
            </motion.div>
          )}

          {step === 'REVIEW' && (
            <motion.div
              key="review"
              variants={pageVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              transition={transition}
            >
              <Card className="p-6 sm:p-8 shadow-lg border-0 rounded-2xl bg-white">
                <div className="text-center mb-8">
                  <h2 className="text-2xl sm:text-3xl font-display font-bold text-primary mb-2 uppercase tracking-wider">
                    Seu Pedido, {name}!
                  </h2>
                  <p className="text-foreground/70 font-body text-sm">Confira se está tudo certo antes de prosseguir</p>
                </div>
                <div className="space-y-4">
                  {/* Cart items */}
                  <div className="bg-gradient-to-br from-background to-background/50 rounded-xl p-4 space-y-3 border-2 border-accent/20">
                    {cartState.items.map((item) => (
                      <div key={item.id} className="flex justify-between items-center py-2 border-b border-accent/10 last:border-0">
                        <div className="flex-1">
                          <p className="font-semibold text-foreground font-body">{item.name}</p>
                          <p className="text-sm text-accent/70 font-body">R$ {item.price.toFixed(2)} cada</p>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-foreground font-body">x{item.quantity}</p>
                          <p className="text-sm font-bold text-secondary font-body">
                            R$ {(item.price * item.quantity).toFixed(2)}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Total */}
                  <div className="bg-gradient-to-r from-primary to-secondary rounded-xl p-5 flex justify-between items-center shadow-lg">
                    <span className="font-display font-bold text-xl text-white uppercase tracking-wider">Total</span>
                    <span className="font-bold text-3xl text-white">
                      R$ {cartState.items.reduce((sum, item) => sum + item.price * item.quantity, 0).toFixed(2)}
                    </span>
                  </div>

                  {/* Action buttons */}
                  <div className="space-y-3 pt-4">
                    <Button
                      onClick={handleGoToPayment}
                      disabled={isSubmitting}
                      className="w-full bg-gradient-to-r from-secondary to-secondary/90 hover:from-secondary/90 hover:to-secondary text-white font-display uppercase tracking-wider py-7 text-lg shadow-lg hover:shadow-xl transition-all rounded-xl disabled:opacity-50"
                    >
                      {isSubmitting ? (
                        <span className="flex items-center gap-2">
                          <span className="animate-spin">⏳</span>
                          Processando...
                        </span>
                      ) : (
                        <>
                          💳 Ir para Pagamento
                        </>
                      )}
                    </Button>
                    <Button
                      onClick={() => navigate("/menu")}
                      variant="outline"
                      className="w-full py-6 text-lg font-display uppercase tracking-wider border-2 border-accent/30 hover:bg-primary/5 hover:border-secondary transition-colors rounded-xl"
                    >
                      ← Voltar ao Cardápio
                    </Button>
                  </div>
                </div>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default Checkout;
