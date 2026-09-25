import React, { useState, useMemo, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { 
  Flame, 
  Sparkles, 
  QrCode, 
  Star, 
  ArrowRight, 
  CheckCircle2, 
  Smartphone, 
  UtensilsCrossed, 
  Layers, 
  Zap, 
  Globe, 
  Users, 
  ChefHat, 
  DollarSign, 
  Check, 
  X, 
  ChevronDown,
  Bot,
  Percent,
  Play
} from "lucide-react";
import { useMimenu } from "@/lib/mimenuContext";
import { Button } from "@/components/ui/button";

export const Landing: React.FC = () => {
  const navigate = useNavigate();
  const { venue } = useMimenu();

  // State for interactive features
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly');
  const [monthlyOrders, setMonthlyOrders] = useState<number>(650);
  const [averageTicket, setAverageTicket] = useState<number>(45); // in Bs. or USD
  const [simulatedChatStep, setSimulatedChatStep] = useState<number>(0);
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  useEffect(() => {
    document.title = "MiMenu — Menú Digital Inteligente & Gestión Gastronómica";
  }, []);

  // ROI Calculator math
  const thirdPartyCommissionsLost = useMemo(() => {
    return Math.round(monthlyOrders * averageTicket * 0.22); // 22% avg commission
  }, [monthlyOrders, averageTicket]);

  const upsellRevenueGain = useMemo(() => {
    return Math.round(monthlyOrders * averageTicket * 0.24); // 24% boost from AI suggestions
  }, [monthlyOrders, averageTicket]);

  const estimatedGoogleReviews = useMemo(() => {
    return Math.round(monthlyOrders * 0.18); // 18% review capture rate
  }, [monthlyOrders]);

  // WhatsApp Copilot interactive simulations
  const copilotSimulations = [
    {
      userMsg: "Sube el precio de la Salchipapa Monster a 48 Bs y activa la promo 2x1 en Fernet",
      aiReply: "Precio de 'Salchipapa Moe Monster' actualizado a 48 Bs y la oferta '2x1 Fernet Cruceño' ha sido activada en el menú digital.",
      actionBadge: "Cambio de Precio + Oferta"
    },
    {
      userMsg: "¿Cuáles son los 3 platos más pedidos de esta noche?",
      aiReply: "1. Salchipapa Moe Monster (38 pedidos)\n2. Chopp Helado Escarchado (54 pedidos)\n3. Nachos Supremos (22 pedidos)",
      actionBadge: "Analítica en Tiempo Real"
    },
    {
      userMsg: "Llegó un lote fresco de cerveza artesanal IPA. Agrégala al menú a 28 Bs",
      aiReply: "'Cerveza Artesanal IPA' agregada a la categoría Bebidas con fotografía sugerida y etiqueta 'NUEVO'.",
      actionBadge: "Creación de Producto"
    }
  ];

  // 8 Core Pillars
  const solutions = [
    {
      id: 1,
      title: "Menú Digital Estratégico",
      shortDesc: "Diseñado para vender más con etiquetas de demanda y algoritmo de alta rotación.",
      icon: Flame,
      details: "Destaca automáticamente los platos de mayor rotación, sugiere maridajes inteligentes al agregar al carrito y estimula el ticket promedio hasta un 24%."
    },
    {
      id: 2,
      title: "Cazador de Reseñas en Google",
      shortDesc: "Captura evaluaciones 5 estrellas en la mesa y posiciona tu local en Google Maps.",
      icon: Star,
      details: "Al terminar el pedido, el sistema solicita una valoración rápida. Calificaciones de 5 estrellas van directo a Google; cualquier observación va al WhatsApp de gerencia."
    },
    {
      id: 3,
      title: "Copiloto por WhatsApp",
      shortDesc: "Administra tu restaurante por notas de voz o texto en segundos.",
      icon: Bot,
      details: "Envía un mensaje: 'Pausa las hamburguesas porque se acabó el pan y sube el chopp a 25 Bs'. El copiloto interpreta y ejecuta los cambios en tiempo real."
    },
    {
      id: 4,
      title: "Pedidos en Mesa con QR Único",
      shortDesc: "Asignación automática de zona y mesa con comanda express ágil.",
      icon: QrCode,
      details: "El comensal escanea, navega sin demoras, elige propina voluntaria, agrega maridajes y confirma con QR Simple, tarjeta o efectivo."
    },
    {
      id: 5,
      title: "Link en Bio & Pedidos Directos",
      shortDesc: "Canal directo para Instagram, TikTok y WhatsApp con 0% comisión.",
      icon: Smartphone,
      details: "Evita perder entre 15% y 30% en plataformas agregadoras. Centraliza tus pedidos directos conservando el 100% de tus ingresos y los datos de tus clientes."
    },
    {
      id: 6,
      title: "Comanda Digital & KDS de Cocina",
      shortDesc: "Pantalla interactiva para cocina y barra con estados en tiempo real.",
      icon: ChefHat,
      details: "Elimina papeles perdidos y errores en cocina. Control de tiempos de preparación, estados de comanda y alertas para el equipo."
    },
    {
      id: 7,
      title: "CRM Gastronómico & Fidelización",
      shortDesc: "Base de datos propia de tus clientes e historial de consumo sin instalar apps.",
      icon: Users,
      details: "Conoce a tus comensales más frecuentes, qué días te visitan y programa promociones para reactivar clientes de forma directa."
    },
    {
      id: 8,
      title: "Alérgenos & Menú Multi-Idioma",
      shortDesc: "Cumplimiento normativo, detección de alérgenos y traducción automática.",
      icon: Globe,
      details: "Identifica alérgenos (gluten, lácteos, frutos secos) y ofrece tu carta a turistas en su idioma preferido mediante detección automática del navegador."
    }
  ];

  // FAQs
  const faqs = [
    {
      q: "¿Cuánto tiempo toma configurar MiMenu para mi negocio?",
      a: "Menos de 5 minutos. Puedes elegir una plantilla preconfigurada o pegar el texto de tu carta física. El sistema organiza categorías, precios y fotos automáticamente."
    },
    {
      q: "¿Mis clientes tienen que descargar alguna aplicación?",
      a: "No. MiMenu funciona 100% en la web móvil de forma ultra rápida (PWA). Solo escanean el código QR en la mesa o hacen clic en tu enlace de redes sociales y la carta se abre al instante."
    },
    {
      q: "¿Cómo funciona el Cazador de Reseñas de Google?",
      a: "Cuando el comensal confirma su comanda, el sistema le solicita una valoración con estrellas. Si califica con 4 o 5 estrellas, se le redirige en 1 clic a tu perfil de Google Maps para publicar su reseña. Si califica bajo, el mensaje se envía como feedback interno a la gerencia para resolver la situación antes de que llegue a internet."
    },
    {
      q: "¿Puedo cambiar precios y platos desde WhatsApp?",
      a: "Sí. Nuestro Copiloto permite vincular tu número de WhatsApp autorizado. Puedes mandar un mensaje de texto diciendo 'Pausa los postres por hoy' y la carta se actualizará en tiempo real."
    },
    {
      q: "¿Hay comisiones por cada pedido vendido?",
      a: "Cero comisiones (0%). A diferencia de agregadores que cobran entre 15% y 30%, en MiMenu pagas una suscripción fija y todo lo que vendes es 100% tuyo."
    }
  ];

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col selection:bg-amber-500 selection:text-white">
      {/* Top Banner Notice */}
      <div className="bg-slate-900 text-slate-300 text-xs font-medium py-2 px-4 text-center flex items-center justify-center gap-2 border-b border-slate-800">
        <Sparkles className="w-3.5 h-3.5 text-amber-400" aria-hidden="true" />
        <span><strong>Nuevo:</strong> Copiloto por WhatsApp y Cazador de Reseñas de Google Maps activados.</span>
        <span className="hidden sm:inline text-slate-400">| Prueba 14 días sin tarjeta.</span>
      </div>

      {/* Main Navbar */}
      <header className="sticky top-0 z-50 w-full bg-background/95 backdrop-blur-md border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-500">
              <Flame className="w-5 h-5 fill-amber-500" aria-hidden="true" />
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-1.5">
                <span className="font-bold text-lg tracking-tight text-foreground">MiMenu</span>
                <span className="text-[10px] font-bold uppercase bg-amber-500/10 text-amber-600 dark:text-amber-400 px-1.5 py-0.2 rounded border border-amber-500/20">
                  v2.4
                </span>
              </div>
              <span className="text-[10px] font-medium text-muted-foreground -mt-0.5">SaaS Gastronómico</span>
            </div>
          </Link>

          <nav className="hidden lg:flex items-center gap-7 text-xs font-semibold text-muted-foreground">
            <a href="#soluciones" className="hover:text-foreground transition-colors">8 Módulos</a>
            <a href="#comparativa" className="hover:text-foreground transition-colors">Comparativa</a>
            <a href="#copiloto-ia" className="hover:text-foreground transition-colors">Copiloto WhatsApp</a>
            <a href="#calculadora-roi" className="hover:text-foreground transition-colors">Calculadora ROI</a>
            <a href="#precios" className="hover:text-foreground transition-colors">Precios</a>
            <a href="#faq" className="hover:text-foreground transition-colors">Preguntas Frecuentes</a>
          </nav>

          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate('/menu')}
              className="hidden sm:inline-flex border-border hover:border-amber-500 text-foreground font-semibold rounded-xl text-xs h-9"
            >
              <Play className="w-3.5 h-3.5 mr-1.5 fill-amber-500 text-amber-500" aria-hidden="true" />
              <span>Ver Demo en Vivo</span>
            </Button>

            <Button
              size="sm"
              onClick={() => navigate('/onboarding')}
              className="bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs shadow-xs rounded-xl h-9"
            >
              <span>Probar 14 Días</span>
              <ArrowRight className="w-3.5 h-3.5 ml-1.5" aria-hidden="true" />
            </Button>
          </div>
        </div>
      </header>

      {/* HERO SECTION */}
      <section className="relative overflow-hidden pt-12 pb-16 md:pt-20 md:pb-28 bg-card border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Left Column: Core Copy */}
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 bg-amber-500/10 border border-amber-500/20 px-3.5 py-1.5 rounded-full text-xs font-semibold text-amber-600 dark:text-amber-400">
                <Zap className="w-3.5 h-3.5 fill-current" aria-hidden="true" />
                <span>Menú digital interactivo, comandas QR y fidelización directa</span>
              </div>

              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black tracking-tight leading-[1.1] text-foreground">
                Menú digital inteligente que aumenta tus ventas <br className="hidden sm:inline" />
                <span className="text-amber-500">
                  sin comisiones intermediarias.
                </span>
              </h1>

              <p className="text-sm sm:text-base text-muted-foreground leading-relaxed max-w-2xl mx-auto lg:mx-0">
                Aumenta tu ticket promedio hasta un <strong>24%</strong> mediante sugerencias estratégicas, multiplica tus <strong>reseñas 5 estrellas en Google Maps</strong> y gestiona pedidos en mesa con <strong>0% de comisión por venta</strong>.
              </p>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3.5 pt-2">
                <Button
                  size="lg"
                  onClick={() => navigate('/onboarding')}
                  className="w-full sm:w-auto bg-amber-500 hover:bg-amber-600 text-white font-bold text-sm px-7 py-5 rounded-xl shadow-xs"
                >
                  <Sparkles className="w-4 h-4 mr-2" aria-hidden="true" />
                  <span>Configurar Mi Menú Gratis</span>
                </Button>

                <Button
                  size="lg"
                  variant="outline"
                  onClick={() => navigate('/menu')}
                  className="w-full sm:w-auto border border-border hover:border-slate-400 font-semibold text-sm px-6 py-5 rounded-xl"
                >
                  <UtensilsCrossed className="w-4 h-4 mr-2 text-amber-500" aria-hidden="true" />
                  <span>Explorar Menú Demo</span>
                </Button>
              </div>

              {/* Trust Micro-Badges */}
              <div className="pt-3 flex flex-wrap items-center justify-center lg:justify-start gap-6 text-xs font-medium text-muted-foreground">
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" aria-hidden="true" />
                  0% comisiones por pedido
                </span>
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" aria-hidden="true" />
                  Puesta en marcha en 5 min
                </span>
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" aria-hidden="true" />
                  Cancela cuando quieras
                </span>
              </div>
            </div>

            {/* Right Column: Interactive Phone Mockup */}
            <div className="lg:col-span-5 flex justify-center">
              <div className="relative w-full max-w-sm">
                {/* Phone container */}
                <div className="relative rounded-3xl border border-border bg-card shadow-xl p-4 overflow-hidden space-y-4">
                  
                  {/* Phone Notch/Header */}
                  <div className="flex items-center justify-between pb-2 border-b border-border">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-lg bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-500">
                        <Flame className="w-3.5 h-3.5 fill-amber-500" aria-hidden="true" />
                      </div>
                      <div>
                        <p className="text-xs font-bold leading-none">{venue.name}</p>
                        <p className="text-[10px] text-muted-foreground">Mesa #4 • Terraza</p>
                      </div>
                    </div>
                    <span className="inline-flex items-center gap-1 text-[10px] font-semibold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 px-2 py-0.5 rounded-full">
                      ● Abierto
                    </span>
                  </div>

                  {/* Hotness Item Preview */}
                  <div className="p-3.5 rounded-xl bg-muted/40 border border-border space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20 px-2 py-0.5 rounded-md">
                        <Flame className="w-3 h-3 fill-rose-500" aria-hidden="true" />
                        Alta Demanda (38 pedidos hoy)
                      </span>
                      <span className="text-xs font-bold text-amber-500 tabular-nums">Bs. 45</span>
                    </div>
                    <h4 className="text-xs font-bold text-foreground">Salchipapa Moe's Monster</h4>
                    <p className="text-[11px] text-muted-foreground line-clamp-2 leading-relaxed">
                      450g papas rústicas, doble salchicha vienesa, tocino, queso cheddar y salsa de ajo secreta.
                    </p>
                  </div>

                  {/* AI Upsell Strip Simulation */}
                  <div className="p-3 rounded-xl bg-amber-500/5 border border-amber-500/20 space-y-2">
                    <div className="flex items-center gap-1.5 text-[11px] font-bold text-amber-600 dark:text-amber-400">
                      <Sparkles className="w-3.5 h-3.5" aria-hidden="true" />
                      <span>Sugerencia de Maridaje</span>
                    </div>
                    <div className="flex items-center justify-between bg-card p-2 rounded-lg border border-border">
                      <div className="text-[11px]">
                        <p className="font-semibold text-foreground">Chopp Helado Escarchado</p>
                        <p className="text-muted-foreground font-medium tabular-nums">+Bs. 25</p>
                      </div>
                      <Button size="sm" className="h-7 text-[10px] font-bold bg-amber-500 hover:bg-amber-600 text-white rounded-lg px-2">
                        + Agregar
                      </Button>
                    </div>
                  </div>

                  {/* Google Review Prompt Simulation */}
                  <div className="p-3.5 rounded-xl bg-blue-500/5 border border-blue-500/20 space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5 text-blue-600 dark:text-blue-400 font-bold text-[11px]">
                        <Star className="w-3.5 h-3.5 fill-blue-500 text-blue-500" aria-hidden="true" />
                        <span>¿Cómo estuvo hoy tu experiencia?</span>
                      </div>
                      <span className="text-[9px] bg-blue-500/10 text-blue-600 dark:text-blue-400 font-semibold px-1.5 py-0.5 rounded border border-blue-500/20">Google Sync</span>
                    </div>
                    <div className="flex items-center justify-center gap-1.5 py-1">
                      {[1, 2, 3, 4, 5].map((s) => (
                        <div key={s} className="w-6 h-6 rounded-md bg-amber-400/20 border border-amber-400/40 flex items-center justify-center text-amber-500 text-xs shadow-2xs font-bold">
                          ★
                        </div>
                      ))}
                    </div>
                    <p className="text-[10px] text-center text-muted-foreground">
                      Tu opinión se publica en Google Maps con 1 clic.
                    </p>
                  </div>

                  {/* Express Cart CTA */}
                  <Button
                    onClick={() => navigate('/menu')}
                    className="w-full bg-foreground text-background hover:bg-foreground/90 font-bold text-xs py-4 rounded-xl flex items-center justify-between px-4"
                  >
                    <span>Ver Comanda (2 ítems)</span>
                    <span className="bg-amber-500 text-white px-2 py-0.5 rounded text-[11px] font-bold tabular-nums">Bs. 70 →</span>
                  </Button>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* METRICS & SOCIAL PROOF BAR */}
      <section className="py-8 bg-muted/30 border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div className="space-y-1">
              <p className="text-3xl sm:text-4xl font-black text-amber-500 tabular-nums">0%</p>
              <p className="text-xs font-semibold text-muted-foreground">Comisión por pedido</p>
            </div>
            <div className="space-y-1">
              <p className="text-3xl sm:text-4xl font-black text-foreground tabular-nums">+24%</p>
              <p className="text-xs font-semibold text-muted-foreground">Incremento en ticket promedio</p>
            </div>
            <div className="space-y-1">
              <p className="text-3xl sm:text-4xl font-black text-amber-500 tabular-nums">+4.9 ★</p>
              <p className="text-xs font-semibold text-muted-foreground">Calificación promedio en Google</p>
            </div>
            <div className="space-y-1">
              <p className="text-3xl sm:text-4xl font-black text-emerald-600 dark:text-emerald-400 tabular-nums">&lt; 5 min</p>
              <p className="text-xs font-semibold text-muted-foreground">Tiempo de puesta en marcha</p>
            </div>
          </div>
        </div>
      </section>

      {/* THE 8-IN-1 PLATFORM SOLUTION GRID (BENTO BOX) */}
      <section id="soluciones" className="py-20 max-w-7xl mx-auto px-4 sm:px-6 space-y-12">
        <div className="text-center space-y-3 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 bg-amber-500/10 border border-amber-500/20 px-3.5 py-1 rounded-full text-xs font-bold text-amber-600 dark:text-amber-400">
            <Layers className="w-3.5 h-3.5" aria-hidden="true" />
            <span>Módulos Integrados</span>
          </div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-black tracking-tight text-foreground">
            8 Herramientas Esenciales en Una Sola Plataforma
          </h2>
          <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
            Elimina la complejidad de manejar múltiples sistemas aislados. MiMenu reúne todo lo que tu bar, restaurante o local gastronómico necesita para operar con fluidez.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          {solutions.map((s) => {
            const Icon = s.icon;
            return (
              <div 
                key={s.id}
                className="group relative p-6 rounded-2xl bg-card border border-border hover:border-slate-400 dark:hover:border-slate-600 transition-all duration-200 shadow-2xs hover:shadow-xs flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-500">
                    <Icon className="w-5 h-5" aria-hidden="true" />
                  </div>
                  <h3 className="text-base font-bold text-foreground group-hover:text-amber-500 transition-colors">
                    {s.title}
                  </h3>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    {s.details}
                  </p>
                </div>
                <div className="pt-4 mt-4 border-t border-border flex items-center gap-1.5 text-xs font-semibold text-amber-600 dark:text-amber-400">
                  <span>Conocer más</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" aria-hidden="true" />
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* COMPARISON SECTION: TRADITIONAL VS MIMENU */}
      <section id="comparativa" className="py-20 bg-card border-y border-border">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 space-y-12">
          <div className="text-center space-y-3 max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 bg-rose-500/10 border border-rose-500/20 px-3.5 py-1 rounded-full text-xs font-bold text-rose-600 dark:text-rose-400">
              <Percent className="w-3.5 h-3.5" aria-hidden="true" />
              <span>Comparativa Directa</span>
            </div>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-black tracking-tight text-foreground">
              ¿Por qué migrar a MiMenu?
            </h2>
            <p className="text-xs sm:text-sm text-muted-foreground">
              Compara el impacto financiero y operativo frente a cartas PDF estáticas o apps de delivery.
            </p>
          </div>

          <div className="overflow-x-auto rounded-2xl border border-border bg-background">
            <table className="w-full text-left border-collapse min-w-[600px]">
              <thead>
                <tr className="border-b border-border text-xs uppercase font-bold text-muted-foreground bg-muted/40">
                  <th className="py-3.5 px-4">Capacidad / Característica</th>
                  <th className="py-3.5 px-4 text-center">Menú PDF Tradicional</th>
                  <th className="py-3.5 px-4 text-center">Apps de Delivery (Agregadores)</th>
                  <th className="py-3.5 px-4 text-center bg-amber-500/10 text-amber-600 dark:text-amber-400 font-bold">
                    MiMenu Directo
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border text-xs font-medium">
                <tr>
                  <td className="py-3.5 px-4 font-semibold text-foreground">Comisión por Pedido</td>
                  <td className="py-3.5 px-4 text-center text-muted-foreground">0% (Sin pedidos)</td>
                  <td className="py-3.5 px-4 text-center text-rose-500 font-bold">15% a 30% por venta</td>
                  <td className="py-3.5 px-4 text-center font-bold text-emerald-600 dark:text-emerald-400 bg-amber-500/5">0% (100% tuyo)</td>
                </tr>
                <tr>
                  <td className="py-3.5 px-4 font-semibold text-foreground">Reseñas en Google Maps</td>
                  <td className="py-3.5 px-4 text-center text-muted-foreground"><X className="w-4 h-4 mx-auto text-rose-400" aria-hidden="true" /></td>
                  <td className="py-3.5 px-4 text-center text-muted-foreground">Solo en su app cerrada</td>
                  <td className="py-3.5 px-4 text-center font-semibold text-amber-500 bg-amber-500/5">Directo en Google Maps</td>
                </tr>
                <tr>
                  <td className="py-3.5 px-4 font-semibold text-foreground">Sugerencias y Maridaje</td>
                  <td className="py-3.5 px-4 text-center text-muted-foreground"><X className="w-4 h-4 mx-auto text-rose-400" aria-hidden="true" /></td>
                  <td className="py-3.5 px-4 text-center text-muted-foreground">Genérico</td>
                  <td className="py-3.5 px-4 text-center font-semibold text-emerald-600 dark:text-emerald-400 bg-amber-500/5">Maridajes automáticos (+24%)</td>
                </tr>
                <tr>
                  <td className="py-3.5 px-4 font-semibold text-foreground">Administración por WhatsApp</td>
                  <td className="py-3.5 px-4 text-center text-muted-foreground"><X className="w-4 h-4 mx-auto text-rose-400" aria-hidden="true" /></td>
                  <td className="py-3.5 px-4 text-center text-muted-foreground"><X className="w-4 h-4 mx-auto text-rose-400" aria-hidden="true" /></td>
                  <td className="py-3.5 px-4 text-center font-semibold text-emerald-600 dark:text-emerald-400 bg-amber-500/5">Por notas de voz y chat</td>
                </tr>
                <tr>
                  <td className="py-3.5 px-4 font-semibold text-foreground">Control de Base de Datos de Clientes</td>
                  <td className="py-3.5 px-4 text-center text-muted-foreground">0 registros</td>
                  <td className="py-3.5 px-4 text-center text-rose-500">Los datos son del agregador</td>
                  <td className="py-3.5 px-4 text-center font-semibold text-emerald-600 dark:text-emerald-400 bg-amber-500/5">100% tu base de clientes</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* WHATSAPP COPILOT SIMULATOR SPOTLIGHT */}
      <section id="copiloto-ia" className="py-20 max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          <div className="lg:col-span-6 space-y-6">
            <div className="inline-flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/20 px-3.5 py-1 rounded-full text-xs font-bold text-emerald-600 dark:text-emerald-400">
              <Bot className="w-3.5 h-3.5" aria-hidden="true" />
              <span>Gestión por WhatsApp</span>
            </div>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-black tracking-tight text-foreground">
              Actualiza tu menú enviando un mensaje o audio por WhatsApp.
            </h2>
            <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
              Sin paneles complicados durante el servicio. Vincula tu número de WhatsApp autorizado y solicita cambios de precio, pausas de stock o resúmenes de venta al instante.
            </p>

            {/* Simulation Selection Buttons */}
            <div className="space-y-2.5 pt-2">
              <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Prueba una instrucción interactiva:</p>
              {copilotSimulations.map((sim, idx) => (
                <button
                  key={idx}
                  onClick={() => setSimulatedChatStep(idx)}
                  className={`w-full text-left p-3.5 rounded-xl border text-xs font-semibold transition-all flex items-center justify-between ${
                    simulatedChatStep === idx
                      ? 'bg-emerald-500/10 border-emerald-500 text-emerald-600 dark:text-emerald-400 shadow-2xs'
                      : 'bg-card border-border text-foreground hover:border-slate-400'
                  }`}
                >
                  <span>"{sim.userMsg}"</span>
                  <span className="text-[10px] bg-emerald-500/20 px-2 py-0.5 rounded text-emerald-600 dark:text-emerald-400 font-bold ml-2 shrink-0">
                    {sim.actionBadge}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Interactive Chat Window */}
          <div className="lg:col-span-6 flex justify-center">
            <div className="w-full max-w-md rounded-2xl border border-slate-800 bg-slate-900 text-white p-5 shadow-xl space-y-4">
              {/* Chat Header */}
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-emerald-600 flex items-center justify-center text-white font-bold text-sm shadow-xs">
                    <Bot className="w-4 h-4" aria-hidden="true" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-white">MiMenu Copiloto</h4>
                    <p className="text-[10px] text-emerald-400 font-medium flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" aria-hidden="true" />
                      En línea • Respuesta inmediata
                    </p>
                  </div>
                </div>
                <span className="text-[10px] font-semibold bg-slate-800 text-slate-300 px-2 py-1 rounded">WhatsApp Integrado</span>
              </div>

              {/* Chat Messages */}
              <div className="space-y-3 min-h-[150px] flex flex-col justify-center">
                {/* User message */}
                <div className="self-end bg-[#005c4b] text-white p-3.5 rounded-2xl rounded-tr-none text-xs font-normal max-w-[85%] shadow-xs">
                  <p>{copilotSimulations[simulatedChatStep].userMsg}</p>
                  <span className="text-[9px] text-white/60 block text-right mt-1">21:42 ✓✓</span>
                </div>

                {/* AI reply */}
                <div className="self-start bg-[#202c33] text-white p-3.5 rounded-2xl rounded-tl-none text-xs font-normal max-w-[90%] space-y-1 shadow-xs border border-white/5">
                  <div className="flex items-center gap-1 text-[10px] text-emerald-400 font-bold">
                    <Sparkles className="w-3 h-3" aria-hidden="true" />
                    <span>MiMenu Copiloto</span>
                  </div>
                  <p className="whitespace-pre-line text-slate-100 text-[11px] leading-relaxed">
                    {copilotSimulations[simulatedChatStep].aiReply}
                  </p>
                  <span className="text-[9px] text-slate-400 block text-right mt-1">21:42</span>
                </div>
              </div>

              {/* Input simulator bar */}
              <div className="pt-2 border-t border-slate-800 flex items-center gap-2">
                <div className="flex-1 bg-slate-800 rounded-full px-4 py-2 text-[11px] text-slate-400 flex items-center justify-between">
                  <span>Escribe un comando o envía una nota de voz...</span>
                  <Bot className="w-3.5 h-3.5 text-emerald-400" aria-hidden="true" />
                </div>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* ROI / COMMISSION CALCULATOR SECTION */}
      <section id="calculadora-roi" className="py-20 bg-card border-y border-border">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 space-y-10">
          <div className="text-center space-y-3 max-w-2xl mx-auto">
            <div className="inline-flex items-center gap-2 bg-amber-500/10 border border-amber-500/20 px-3.5 py-1 rounded-full text-xs font-bold text-amber-600 dark:text-amber-400">
              <DollarSign className="w-3.5 h-3.5" aria-hidden="true" />
              <span>Calculadora de Ahorro</span>
            </div>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-black tracking-tight text-foreground">
              Proyecta tu Ahorro Mensual
            </h2>
            <p className="text-xs sm:text-sm text-muted-foreground">
              Ajusta el volumen de pedidos de tu local y descubre el impacto directo en tus finanzas.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center bg-background p-6 md:p-8 rounded-2xl border border-border shadow-xs">
            
            {/* Controls */}
            <div className="md:col-span-6 space-y-6">
              <div className="space-y-2">
                <div className="flex justify-between text-xs font-semibold">
                  <span>Pedidos mensuales aproximados:</span>
                  <span className="text-amber-500 text-sm font-bold tabular-nums">{monthlyOrders} pedidos</span>
                </div>
                <input
                  type="range"
                  min="100"
                  max="3000"
                  step="50"
                  value={monthlyOrders}
                  onChange={(e) => setMonthlyOrders(Number(e.target.value))}
                  aria-label="Pedidos mensuales"
                  className="w-full accent-amber-500 h-2 bg-muted rounded-lg cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-muted-foreground">
                  <span>100</span>
                  <span>1,500</span>
                  <span>3,000+</span>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-xs font-semibold">
                  <span>Ticket promedio por pedido:</span>
                  <span className="text-amber-500 text-sm font-bold tabular-nums">Bs. {averageTicket}</span>
                </div>
                <input
                  type="range"
                  min="20"
                  max="200"
                  step="5"
                  value={averageTicket}
                  onChange={(e) => setAverageTicket(Number(e.target.value))}
                  aria-label="Ticket promedio"
                  className="w-full accent-amber-500 h-2 bg-muted rounded-lg cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-muted-foreground">
                  <span>Bs. 20</span>
                  <span>Bs. 100</span>
                  <span>Bs. 200+</span>
                </div>
              </div>
            </div>

            {/* Results Card */}
            <div className="md:col-span-6 p-6 rounded-xl bg-muted/40 border border-border space-y-4">
              <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Retorno Estimado Mensual</h4>
              
              <div className="space-y-3">
                <div className="flex items-center justify-between pb-2 border-b border-border">
                  <span className="text-xs font-medium text-foreground">Comisiones Ahorradas (vs 22% apps):</span>
                  <span className="text-sm font-bold text-emerald-600 dark:text-emerald-400 tabular-nums">+Bs. {thirdPartyCommissionsLost.toLocaleString()} / mes</span>
                </div>

                <div className="flex items-center justify-between pb-2 border-b border-border">
                  <span className="text-xs font-medium text-foreground">Ingreso Extra por Maridaje (+24%):</span>
                  <span className="text-sm font-bold text-amber-500 tabular-nums">+Bs. {upsellRevenueGain.toLocaleString()} / mes</span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium text-foreground">Nuevas Reseñas en Google Estimadas:</span>
                  <span className="text-sm font-bold text-blue-600 dark:text-blue-400 tabular-nums">+{estimatedGoogleReviews} reseñas 5★</span>
                </div>
              </div>

              <Button
                onClick={() => navigate('/onboarding')}
                className="w-full bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs py-5 rounded-xl shadow-xs"
              >
                <span>Comenzar Prueba Gratis (14 Días)</span>
              </Button>
            </div>

          </div>
        </div>
      </section>

      {/* PRICING TIERS */}
      <section id="precios" className="py-20 max-w-7xl mx-auto px-4 sm:px-6 space-y-12">
        <div className="text-center space-y-3 max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-2 bg-amber-500/10 border border-amber-500/20 px-3.5 py-1 rounded-full text-xs font-bold text-amber-600 dark:text-amber-400">
            <Zap className="w-3.5 h-3.5" aria-hidden="true" />
            <span>Planes Transparentes</span>
          </div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-black tracking-tight text-foreground">
            Suscripciones Sin Contratos de Permanencia
          </h2>
          <p className="text-xs sm:text-sm text-muted-foreground">
            Todas las cuentas cuentan con 0% de comisiones por pedido y soporte personalizado.
          </p>

          {/* Billing Switch */}
          <div className="pt-4 flex items-center justify-center gap-3">
            <span className={`text-xs font-semibold ${billingCycle === 'monthly' ? 'text-foreground' : 'text-muted-foreground'}`}>Mensual</span>
            <button
              onClick={() => setBillingCycle(billingCycle === 'monthly' ? 'yearly' : 'monthly')}
              aria-label="Alternar facturación mensual o anual"
              className="w-12 h-6 rounded-full bg-muted border border-border p-1 relative transition-colors focus:outline-hidden"
            >
              <div className={`w-4 h-4 rounded-full bg-amber-500 transition-transform ${billingCycle === 'yearly' ? 'translate-x-6' : ''}`} />
            </button>
            <span className={`text-xs font-semibold flex items-center gap-1.5 ${billingCycle === 'yearly' ? 'text-foreground' : 'text-muted-foreground'}`}>
              Anual 
              <span className="text-[10px] bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 px-1.5 py-0.5 rounded border border-emerald-500/20 font-bold">2 Meses Gratis</span>
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Starter Plan */}
          <div className="p-7 rounded-2xl bg-card border border-border flex flex-col justify-between space-y-6 shadow-2xs">
            <div className="space-y-4">
              <h3 className="text-lg font-bold text-foreground">Starter</h3>
              <p className="text-xs text-muted-foreground">Para cafeterías, food trucks y locales independientes.</p>
              <div className="flex items-baseline gap-1">
                <span className="text-3xl font-black tabular-nums">Bs. {billingCycle === 'monthly' ? '130' : '110'}</span>
                <span className="text-xs text-muted-foreground">/ mes</span>
              </div>

              <ul className="space-y-2.5 text-xs font-medium text-muted-foreground pt-4 border-t border-border">
                <li className="flex items-center gap-2 text-foreground"><Check className="w-4 h-4 text-emerald-500" aria-hidden="true" /> Menú Digital con Código QR</li>
                <li className="flex items-center gap-2 text-foreground"><Check className="w-4 h-4 text-emerald-500" aria-hidden="true" /> Cazador de Reseñas en Google</li>
                <li className="flex items-center gap-2 text-foreground"><Check className="w-4 h-4 text-emerald-500" aria-hidden="true" /> 0% Comisiones por Pedido</li>
                <li className="flex items-center gap-2 text-foreground"><Check className="w-4 h-4 text-emerald-500" aria-hidden="true" /> Link en Bio para Redes</li>
                <li className="flex items-center gap-2 opacity-50"><X className="w-4 h-4 text-muted-foreground" aria-hidden="true" /> Copiloto por WhatsApp</li>
              </ul>
            </div>

            <Button
              variant="outline"
              onClick={() => navigate('/onboarding')}
              className="w-full font-semibold text-xs py-4 rounded-xl border-border hover:border-slate-400"
            >
              Comenzar con Starter
            </Button>
          </div>

          {/* Pro Plan (Featured) */}
          <div className="relative p-7 rounded-2xl bg-card border-2 border-amber-500 shadow-md flex flex-col justify-between space-y-6">
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-amber-500 text-white text-[10px] font-bold uppercase px-3 py-0.5 rounded-full shadow-xs">
              MÁS ELEGIDO POR LOCALES
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-bold text-foreground">Pro</h3>
              <p className="text-xs text-muted-foreground">Para restaurantes, bares y cervecerías en crecimiento.</p>
              <div className="flex items-baseline gap-1">
                <span className="text-3xl font-black text-amber-500 tabular-nums">Bs. {billingCycle === 'monthly' ? '340' : '290'}</span>
                <span className="text-xs text-muted-foreground">/ mes</span>
              </div>

              <ul className="space-y-2.5 text-xs font-medium text-foreground pt-4 border-t border-border">
                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-500" aria-hidden="true" /> <strong>Todo lo de Starter</strong></li>
                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-500" aria-hidden="true" /> <strong>Copiloto por WhatsApp</strong></li>
                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-500" aria-hidden="true" /> Carrito Express & Maridajes (+24%)</li>
                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-500" aria-hidden="true" /> Pedidos en Mesa con QR único</li>
                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-500" aria-hidden="true" /> Comanda Digital / Pantalla KDS</li>
                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-500" aria-hidden="true" /> CRM de Clientes & Fidelización</li>
              </ul>
            </div>

            <Button
              onClick={() => navigate('/onboarding')}
              className="w-full bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs py-4 rounded-xl shadow-xs"
            >
              Probar 14 Días Gratis
            </Button>
          </div>

          {/* Enterprise Plan */}
          <div className="p-7 rounded-2xl bg-card border border-border flex flex-col justify-between space-y-6 shadow-2xs">
            <div className="space-y-4">
              <h3 className="text-lg font-bold text-foreground">Multi-Sucursal</h3>
              <p className="text-xs text-muted-foreground">Para cadenas, franquicias y grupos gastronómicos.</p>
              <div className="flex items-baseline gap-1">
                <span className="text-3xl font-black tabular-nums">Bs. {billingCycle === 'monthly' ? '680' : '590'}</span>
                <span className="text-xs text-muted-foreground">/ mes</span>
              </div>

              <ul className="space-y-2.5 text-xs font-medium text-muted-foreground pt-4 border-t border-border">
                <li className="flex items-center gap-2 text-foreground"><Check className="w-4 h-4 text-emerald-500" aria-hidden="true" /> <strong>Todo lo del plan Pro</strong></li>
                <li className="flex items-center gap-2 text-foreground"><Check className="w-4 h-4 text-emerald-500" aria-hidden="true" /> Multi-sucursales unificadas</li>
                <li className="flex items-center gap-2 text-foreground"><Check className="w-4 h-4 text-emerald-500" aria-hidden="true" /> Integración con Sistemas POS e Impresoras</li>
                <li className="flex items-center gap-2 text-foreground"><Check className="w-4 h-4 text-emerald-500" aria-hidden="true" /> Soporte prioritario dedicado</li>
              </ul>
            </div>

            <Button
              variant="outline"
              onClick={() => navigate('/onboarding')}
              className="w-full font-semibold text-xs py-4 rounded-xl border-border hover:border-slate-400"
            >
              Contactar Asesor
            </Button>
          </div>

        </div>
      </section>

      {/* FAQ SECTION */}
      <section id="faq" className="py-20 bg-card border-t border-border">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 space-y-8">
          <div className="text-center space-y-3">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-black tracking-tight text-foreground">Preguntas Frecuentes</h2>
            <p className="text-xs sm:text-sm text-muted-foreground">Respuestas claras sobre la plataforma.</p>
          </div>

          <div className="space-y-3">
            {faqs.map((faq, i) => (
              <div 
                key={i} 
                className="p-4 rounded-xl bg-background border border-border cursor-pointer transition-all"
                onClick={() => setOpenFaqIndex(openFaqIndex === i ? null : i)}
              >
                <div className="flex items-center justify-between font-bold text-xs sm:text-sm text-foreground">
                  <span>{faq.q}</span>
                  <ChevronDown className={`w-4 h-4 text-muted-foreground transition-transform ${openFaqIndex === i ? 'rotate-180 text-amber-500' : ''}`} aria-hidden="true" />
                </div>
                {openFaqIndex === i && (
                  <p className="pt-3 text-xs text-muted-foreground leading-relaxed border-t border-border mt-3">
                    {faq.a}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CLOSING CTA BANNER */}
      <section className="py-16 bg-slate-900 text-white text-center border-t border-slate-800">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 space-y-5">
          <h2 className="text-2xl sm:text-4xl font-black tracking-tight text-white leading-tight">
            Digitaliza la experiencia de tu restaurante hoy.
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 max-w-xl mx-auto leading-relaxed">
            Aumenta el ticket promedio, capta opiniones verificadas en Google Maps y toma el control de tus pedidos directos.
          </p>
          <div className="pt-3 flex flex-col sm:flex-row items-center justify-center gap-3">
            <Button
              size="lg"
              onClick={() => navigate('/onboarding')}
              className="bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs px-7 py-5 rounded-xl shadow-xs"
            >
              <Sparkles className="w-4 h-4 mr-2" aria-hidden="true" />
              <span>Comenzar Prueba Gratis (14 Días)</span>
            </Button>
            <Button
              size="lg"
              variant="outline"
              onClick={() => navigate('/menu')}
              className="border border-slate-700 hover:border-slate-500 text-white font-semibold text-xs px-6 py-5 rounded-xl bg-slate-800/50"
            >
              <span>Ver Menú Demo</span>
            </Button>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="py-10 bg-background border-t border-border text-xs text-muted-foreground">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2.5">
            <div className="w-6 h-6 rounded-md bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-500">
              <Flame className="w-3.5 h-3.5 fill-amber-500" aria-hidden="true" />
            </div>
            <span className="font-bold text-foreground">MiMenu Platform</span>
            <span>• © 2026 ClubeMkt. Todos los derechos reservados.</span>
          </div>

          <div className="flex items-center gap-6 font-medium">
            <Link to="/menu" className="hover:text-foreground transition-colors">Demo Carta</Link>
            <Link to="/admin" className="hover:text-foreground transition-colors">Panel Admin</Link>
            <Link to="/admin/ai" className="hover:text-foreground transition-colors">Copiloto IA</Link>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
