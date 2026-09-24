import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { 
  Flame, 
  Beer, 
  UtensilsCrossed, 
  QrCode, 
  Sparkles, 
  Clock, 
  MapPin, 
  Phone, 
  ShoppingBag, 
  Star, 
  ArrowRight, 
  Calendar,
  CheckCircle2,
  ShieldCheck
} from "lucide-react";
import { useMimenu } from "@/lib/mimenuContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

export const Landing: React.FC = () => {
  const navigate = useNavigate();
  const { venue, activeOffers, setSelectedTable, setFulfillmentType } = useMimenu();
  const [quickTableInput, setQuickTableInput] = useState("");

  useEffect(() => {
    document.title = `${venue.name} — Taberna & Bar en Santa Cruz de la Sierra | MIMENU`;
  }, [venue.name]);

  const handleQuickTableSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!quickTableInput.trim()) {
      toast.error("Por favor ingresa tu número de mesa");
      return;
    }
    setSelectedTable(quickTableInput.trim());
    setFulfillmentType('dine_in');
    navigate(`/menu?table=${encodeURIComponent(quickTableInput.trim())}`);
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col selection:bg-amber-500 selection:text-white">
      {/* Top Notice Bar */}
      <div className="bg-gradient-to-r from-amber-600 via-red-600 to-amber-600 text-white text-xs font-bold py-1.5 px-4 text-center">
        <span>🔥 Santa Cruz de la Sierra • ¡La Taberna de las Salchipapas y el Chopp Helado!</span>
        <Link to="/admin" className="ml-3 underline opacity-80 hover:opacity-100 hidden sm:inline">
          Panel Admin
        </Link>
      </div>

      {/* Main Navbar */}
      <header className="sticky top-0 z-40 w-full bg-background/90 backdrop-blur-md border-b border-border">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-red-600 flex items-center justify-center text-white font-black text-xl shadow-md">
              🍺
            </div>
            <div>
              <span className="font-black text-lg tracking-tight text-foreground">{venue.name}</span>
              <span className="text-[10px] font-extrabold uppercase bg-amber-500/15 text-amber-500 px-1.5 py-0.5 rounded ml-1.5 border border-amber-500/30">
                SCZ
              </span>
            </div>
          </Link>

          <nav className="hidden md:flex items-center gap-6 text-sm font-semibold text-muted-foreground">
            <a href="#menu-highlights" className="hover:text-foreground transition-colors">Especialidades</a>
            <a href="#promos" className="hover:text-foreground transition-colors">Promos en Vivo</a>
            <a href="#eventos" className="hover:text-foreground transition-colors">Agenda Semanal</a>
            <a href="#merch" className="hover:text-foreground transition-colors">Merch Oficial</a>
            <a href="#ubicacion" className="hover:text-foreground transition-colors">Ubicación</a>
          </nav>

          <div className="flex items-center gap-2">
            <Button
              onClick={() => navigate('/menu')}
              className="bg-gradient-to-r from-amber-500 to-red-600 hover:from-amber-600 hover:to-red-700 text-white font-bold text-xs shadow-md rounded-xl"
            >
              <UtensilsCrossed className="w-3.5 h-3.5 mr-1.5" />
              <span>Ver Menú & Pedir</span>
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-12 pb-20 md:pt-20 md:pb-28 border-b border-border bg-gradient-to-b from-background via-amber-950/10 to-background">
        <div className="max-w-6xl mx-auto px-4 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Column: Copy & Actions */}
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 bg-amber-500/10 border border-amber-500/30 px-3.5 py-1.5 rounded-full text-xs font-bold text-amber-500">
              <Flame className="w-4 h-4 fill-amber-500" />
              <span>Santa Cruz de la Sierra • Equipetrol</span>
            </div>

            <h1 className="text-4xl sm:text-5xl md:text-6xl font-black tracking-tight leading-[1.08] text-foreground">
              La Taberna Más <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-500 via-orange-500 to-red-600">
                Prendida de Santa Cruz
              </span> 🍺🔥
            </h1>

            <p className="text-base sm:text-lg text-muted-foreground leading-relaxed max-w-xl">
              Salchipapas legendarias con queso derretido, nachos monstruosos, fernet viajero en jarra de litro, chopp artesanal bien frío y el mejor ambiente para tu noche.
            </p>

            {/* Quick Table Jump Form */}
            <div className="p-4 rounded-2xl bg-card border-2 border-primary/40 shadow-xl max-w-lg space-y-3">
              <div className="flex items-center gap-2 text-xs font-bold text-foreground">
                <QrCode className="w-4 h-4 text-primary" />
                <span>¿Ya estás sentado en {venue.name}? Pide directo:</span>
              </div>
              <form onSubmit={handleQuickTableSubmit} className="flex gap-2">
                <Input
                  value={quickTableInput}
                  onChange={(e) => setQuickTableInput(e.target.value)}
                  placeholder="Escribe tu N° de Mesa (ej. 4, VIP 1)"
                  className="text-xs h-10 bg-background"
                />
                <Button
                  type="submit"
                  className="bg-primary hover:bg-primary/90 text-primary-foreground font-bold text-xs h-10 px-5 shadow-sm whitespace-nowrap"
                >
                  Pedir a Mesa
                </Button>
              </form>
            </div>

            {/* Primary Action Buttons */}
            <div className="flex flex-wrap gap-3 pt-2">
              <Button
                size="lg"
                onClick={() => navigate('/menu')}
                className="bg-gradient-to-r from-amber-500 to-red-600 hover:from-amber-600 hover:to-red-700 text-white font-bold text-sm h-12 px-7 rounded-xl shadow-lg hover:scale-105 transition-all flex items-center gap-2"
              >
                <span>Explorar Menú Completo</span>
                <ArrowRight className="w-4 h-4" />
              </Button>

              <a
                href="#ubicacion"
                className="inline-flex items-center justify-center h-12 px-6 rounded-xl border border-border bg-card/60 hover:bg-muted font-bold text-sm text-foreground transition-all"
              >
                📍 Ver Ubicación & Horarios
              </a>
            </div>
          </div>

          {/* Right Column: Hero Visual Card */}
          <div className="lg:col-span-5 relative">
            <div className="relative rounded-3xl overflow-hidden border-2 border-amber-500/30 shadow-2xl bg-card">
              <img
                src="https://images.unsplash.com/photo-1585109649139-366815a0d713?auto=format&fit=crop&w=800&q=80"
                alt="Salchipapa Moe's Monster"
                className="w-full h-80 sm:h-96 object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />
              
              <div className="absolute top-4 right-4 bg-red-600 text-white text-xs font-black px-3 py-1 rounded-full shadow-md flex items-center gap-1">
                <Flame className="w-3.5 h-3.5 fill-white" />
                <span>HOTTEST ITEM SCZ</span>
              </div>

              <div className="absolute bottom-4 left-4 right-4 p-4 rounded-2xl bg-black/70 backdrop-blur-md border border-white/10 space-y-1">
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-white text-base">Salchipapa Moe's Monster</h3>
                  <span className="text-amber-400 font-black text-lg">Bs. 45</span>
                </div>
                <p className="text-xs text-white/80">450g de papas rústicas, doble salchicha vienesa ahumada, queso cheddar fundido y huevo frito.</p>
                <div className="flex items-center gap-2 text-[11px] text-amber-300 font-bold pt-1">
                  <span>⭐⭐⭐⭐⭐ 4.9 (48 reseñas)</span>
                  <span>• 🔥 +38 pedidos hoy</span>
                </div>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* 4 Pillars Section */}
      <section className="py-16 bg-muted/20 border-b border-border">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center max-w-2xl mx-auto mb-12 space-y-2">
            <span className="text-xs font-bold text-primary uppercase tracking-widest">¿Por qué Moe's Taberna?</span>
            <h2 className="text-2xl sm:text-3xl font-black text-foreground">La Experiencia Gastronómica & Nocturna</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="p-6 rounded-2xl bg-card border border-border/80 shadow-xs space-y-3">
              <div className="w-12 h-12 rounded-xl bg-amber-500/15 text-amber-500 flex items-center justify-center">
                <UtensilsCrossed className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-base text-foreground">Salchipapas & Nachos</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Porciones generosas con queso cheddar caliente, tocino crocante y salsas secretas caseras.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-card border border-border/80 shadow-xs space-y-3">
              <div className="w-12 h-12 rounded-xl bg-red-500/15 text-red-500 flex items-center justify-center">
                <Beer className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-base text-foreground">Chopp & Paceña Helada</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Tarros escarchados a punto de nieve y baldes de cerveza con hielo frappé para combatir el calor.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-card border border-border/80 shadow-xs space-y-3">
              <div className="w-12 h-12 rounded-xl bg-orange-500/15 text-orange-500 flex items-center justify-center">
                <Flame className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-base text-foreground">Hotness Social Proof</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Mira en tiempo real qué platos y tragos están en llamas 🔥 gracias a nuestro algoritmo de velocidad.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-card border border-border/80 shadow-xs space-y-3">
              <div className="w-12 h-12 rounded-xl bg-emerald-500/15 text-emerald-500 flex items-center justify-center">
                <QrCode className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-base text-foreground">Cero Filas con QR</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Escaneas el código de tu mesa, ordenas en segundos y la cocina recibe tu pedido al instante.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Promos en Vivo */}
      <section id="promos" className="py-16 max-w-6xl mx-auto px-4 w-full">
        <div className="flex items-center justify-between mb-8">
          <div>
            <span className="text-xs font-bold text-primary uppercase tracking-wider">Promociones Automáticas</span>
            <h2 className="text-2xl sm:text-3xl font-black text-foreground">Ofertas Inteligentes Activas</h2>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate('/menu')}
            className="text-xs font-bold"
          >
            Ver Todas
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {activeOffers.map((offer) => (
            <div
              key={offer.id}
              className="p-5 rounded-2xl border-2 border-amber-500/40 bg-card shadow-lg flex flex-col justify-between space-y-4"
            >
              <div className="space-y-2">
                <div className="inline-flex items-center gap-1 bg-red-600 text-white font-black text-[11px] px-2.5 py-0.5 rounded-full uppercase">
                  <Flame className="w-3 h-3 fill-white" />
                  <span>{offer.badge}</span>
                </div>
                <h3 className="font-bold text-base text-foreground">{offer.title}</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">{offer.description}</p>
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-border">
                <div>
                  <span className="text-xs text-muted-foreground line-through mr-2">Bs. {offer.original_price}</span>
                  <span className="text-xl font-black text-amber-500">Bs. {offer.discount_price}</span>
                </div>
                <Button
                  size="sm"
                  onClick={() => navigate('/menu')}
                  className="bg-primary hover:bg-primary/90 text-primary-foreground font-bold text-xs"
                >
                  Pedir Promo
                </Button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Agenda Semanal */}
      <section id="eventos" className="py-16 bg-muted/30 border-y border-border">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center max-w-2xl mx-auto mb-10 space-y-2">
            <span className="text-xs font-bold text-primary uppercase tracking-wider">Nightlife Santa Cruz</span>
            <h2 className="text-2xl sm:text-3xl font-black text-foreground">Agenda Semanal en Moe's</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="p-4 rounded-xl bg-card border border-border shadow-xs flex items-start gap-3">
              <div className="w-10 h-10 rounded-lg bg-primary/10 text-primary flex items-center justify-center font-bold text-xs shrink-0">
                MAR
              </div>
              <div>
                <h4 className="font-bold text-sm">Martes de Salchipapas</h4>
                <p className="text-xs text-muted-foreground">20% de descuento en Salchipapas Monster & Mixtas toda la noche.</p>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-card border border-border shadow-xs flex items-start gap-3">
              <div className="w-10 h-10 rounded-lg bg-primary/10 text-primary flex items-center justify-center font-bold text-xs shrink-0">
                MIÉ
              </div>
              <div>
                <h4 className="font-bold text-sm">Miércoles Choppero</h4>
                <p className="text-xs text-muted-foreground">3x2 en Chopp Artesanal Moe's en tarros escarchados.</p>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-card border border-border shadow-xs flex items-start gap-3">
              <div className="w-10 h-10 rounded-lg bg-red-500/10 text-red-500 flex items-center justify-center font-bold text-xs shrink-0">
                JUE
              </div>
              <div>
                <h4 className="font-bold text-sm">Jueves de Fernet 2x1</h4>
                <p className="text-xs text-muted-foreground">La previa oficial de Santa Cruz con Jarras de 1 Litro.</p>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-card border border-border shadow-xs flex items-start gap-3">
              <div className="w-10 h-10 rounded-lg bg-amber-500/10 text-amber-500 flex items-center justify-center font-bold text-xs shrink-0">
                VIE
              </div>
              <div>
                <h4 className="font-bold text-sm">Viernes de Rock & Baldes</h4>
                <p className="text-xs text-muted-foreground">Balde 5 Paceñas en hielo + Nachos Supremos en promo especial.</p>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-card border border-border shadow-xs flex items-start gap-3">
              <div className="w-10 h-10 rounded-lg bg-purple-500/10 text-purple-500 flex items-center justify-center font-bold text-xs shrink-0">
                SÁB
              </div>
              <div>
                <h4 className="font-bold text-sm">Sábado Noche Flaming Moe</h4>
                <p className="text-xs text-muted-foreground">Shots flambeados en barra y DJ set en vivo.</p>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-card border border-border shadow-xs flex items-start gap-3">
              <div className="w-10 h-10 rounded-lg bg-emerald-500/10 text-emerald-500 flex items-center justify-center font-bold text-xs shrink-0">
                DOM
              </div>
              <div>
                <h4 className="font-bold text-sm">Domingo de Bajón</h4>
                <p className="text-xs text-muted-foreground">El rescate de fin de semana con combos XL.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Ubicacion & Contacto */}
      <section id="ubicacion" className="py-16 max-w-6xl mx-auto px-4 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          <div className="space-y-6">
            <div>
              <span className="text-xs font-bold text-primary uppercase tracking-wider">¿Cómo Llegar?</span>
              <h2 className="text-3xl font-black text-foreground mt-1">Ubicación & Contacto</h2>
              <p className="text-sm text-muted-foreground mt-2">
                En el corazón de Equipetrol, Santa Cruz de la Sierra. Zona segura con parqueo y ambiente climatizado.
              </p>
            </div>

            <div className="space-y-3">
              <div className="flex items-start gap-3 p-3 rounded-xl bg-card border border-border">
                <MapPin className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                <div>
                  <p className="text-xs font-bold text-foreground">Dirección</p>
                  <p className="text-xs text-muted-foreground">{venue.address}</p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3 rounded-xl bg-card border border-border">
                <Clock className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                <div>
                  <p className="text-xs font-bold text-foreground">Horarios de Atención</p>
                  <p className="text-xs text-muted-foreground">{venue.opening_hours}</p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3 rounded-xl bg-card border border-border">
                <Phone className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                <div>
                  <p className="text-xs font-bold text-foreground">WhatsApp & Reservas</p>
                  <p className="text-xs text-muted-foreground">{venue.phone}</p>
                </div>
              </div>
            </div>

            <a
              href={`https://wa.me/${venue.whatsapp.replace(/\D/g, '')}?text=Hola%20Moe's%20Taberna,%20quiero%20hacer%20una%20reserva`}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs py-3 px-6 rounded-xl shadow-md transition-all"
            >
              <span>Escribir por WhatsApp</span>
            </a>
          </div>

          <div className="rounded-3xl overflow-hidden border-2 border-border shadow-xl h-80 bg-muted flex items-center justify-center relative">
            <iframe
              title="Moe's Taberna Santa Cruz de la Sierra"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3799.3664326162383!2d-63.1996229!3d-17.7663246!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x93f1e84775d72f9d%3A0x6b801a6b0c20ab50!2sEquipetrol%2C%20Santa%20Cruz%20de%20la%20Sierra!5e0!3m2!1ses!2sbo!4v1713450000000"
              className="w-full h-full border-0"
              loading="lazy"
              allowFullScreen
            />
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-card border-t border-border py-8 text-center text-xs text-muted-foreground">
        <div className="max-w-6xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-bold text-foreground">{venue.name}</span>
            <span>• Santa Cruz de la Sierra, Bolivia</span>
          </div>
          <div className="flex items-center gap-4">
            <span>Potenciado por <strong className="text-primary font-black">MIMENU Multi-Tenant SaaS</strong></span>
            <Link to="/admin" className="text-primary font-bold hover:underline">Acceso Panel Admin</Link>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
