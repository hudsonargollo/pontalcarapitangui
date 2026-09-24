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
    document.title = "MiMenu — Menú Digital Inteligente & Concierge IA para Gastronomía";
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
      aiReply: "✅ ¡Hecho en 2 segundos! Precio de 'Salchipapa Moe Monster' actualizado a 48 Bs y la oferta '2x1 Fernet Cruceño' está activa en el menú digital.",
      actionBadge: "Cambio de Precio + Oferta Flash"
    },
    {
      userMsg: "¿Cuáles son los 3 platos más pedidos de esta noche?",
      aiReply: "📊 1. Salchipapa Moe Monster (38 pedidos 🔥)\n2. Chopp Helado Escarchado (54 pedidos 🔥🔥🔥)\n3. Nachos Supremos (22 pedidos ⚡)",
      actionBadge: "Analítica en Tiempo Real"
    },
    {
      userMsg: "Llegó un lote fresco de cerveza artesanal IPA. Agrégala al menú a 28 Bs",
      aiReply: "✨ 'Cerveza Artesanal IPA' agregada automáticamente en la categoría Bebidas con foto optimizada y etiqueta 'NUEVO'.",
      actionBadge: "Creación de Producto con IA"
    }
  ];

  // 8 Core Pillars
  const solutions = [
    {
      id: 1,
      title: "Menú Digital Estratégico",
      shortDesc: "Diseñado para vender más con etiquetas inteligentes y algoritmo de 'Hotness' en tiempo real.",
      icon: Flame,
      color: "from-amber-500 to-orange-500",
      details: "Destaca automáticamente los platos más pedidos (🔥 En Llamas), sugiere maridajes inteligentes al agregar al carrito y aumenta el ticket promedio hasta un 24% sin esfuerzo."
    },
    {
      id: 2,
      title: "Cazador Automático de Reseñas Google",
      shortDesc: "Captura evaluaciones 5 estrellas en la mesa y dispara tu posicionamiento en Google Maps.",
      icon: Star,
      color: "from-yellow-500 to-amber-600",
      details: "Al terminar el pedido, el sistema pregunta de forma amigable por su experiencia. Calificaciones de 5 estrellas van directo a tu ficha de Google; cualquier reclamo va a tu WhatsApp privado."
    },
    {
      id: 3,
      title: "Copiloto IA por WhatsApp & Panel",
      shortDesc: "Administra todo tu restaurante por notas de voz o texto como si hablaras con un gerente experto.",
      icon: Bot,
      color: "from-emerald-500 to-teal-600",
      details: "Envía un audio: 'Desactiva la hamburguesa porque se acabó el pan y sube el chopp a 25 Bs'. La IA interpreta y ejecuta los cambios en milisegundos sin que toques una computadora."
    },
    {
      id: 4,
      title: "Pedidos en Mesa con QR Único",
      shortDesc: "Asignación automática de zona y número de mesa con carrito 'Express' estilo PedidosYa.",
      icon: QrCode,
      color: "from-blue-500 to-indigo-600",
      details: "El comensal escanea, navega sin lag, elige propina, pide maridajes y confirma en segundos con QR Simple Bolivia, tarjeta o efectivo."
    },
    {
      id: 5,
      title: "Link en Bio & Delivery 0% Comisión",
      shortDesc: "Canal directo para Instagram, TikTok y WhatsApp con despacho y tarifas por zonas.",
      icon: Smartphone,
      color: "from-purple-500 to-pink-600",
      details: "Deja de regalar entre 15% y 30% a apps de terceros. Centraliza tus pedidos directos conservando el 100% de tus ingresos y los datos de tus clientes."
    },
    {
      id: 6,
      title: "Comanda Digital & Flujo de Cocina (KDS)",
      shortDesc: "Pantalla interactiva para cocineros y camareros con estados en tiempo real.",
      icon: ChefHat,
      color: "from-rose-500 to-red-600",
      details: "Elimina los papeles perdidos y errores de cocina. Control de tiempos de preparación, estados de pedidos y alertas sonoras para el equipo."
    },
    {
      id: 7,
      title: "CRM Gastronómico & Fidelización",
      shortDesc: "Base de datos de tus clientes, historial de consumo y clientes frecuentes sin instalar apps.",
      icon: Users,
      color: "from-cyan-500 to-blue-600",
      details: "Conoce quiénes son tus clientes más fieles, qué días te visitan y automatiza promociones personalizadas para reactivar comensales dormidos."
    },
    {
      id: 8,
      title: "Alérgenos, Filtros & Multi-Idioma",
      shortDesc: "Cumplimiento normativo, detección de alérgenos y traducción gastronómica instantánea.",
      icon: Globe,
      color: "from-green-500 to-emerald-600",
      details: "Detecta automáticamente 14 tipos de alérgenos (gluten, lactosa, mariscos, frutos secos) y ofrece tu menú a turistas en su propio idioma con detección de navegador."
    }
  ];

  // FAQs
  const faqs = [
    {
      q: "¿Cuánto tiempo toma configurar MiMenu para mi negocio?",
      a: "Menos de 5 minutos. Puedes subir tu menú en PDF, fotos de tu carta física o dictarlo por voz. Nuestro motor de IA estructura categorías, precios, fotos y etiquetas automáticamente."
    },
    {
      q: "¿Mis clientes tienen que descargar alguna aplicación?",
      a: "No. MiMenu funciona 100% en la web móvil de forma ultra rápida (PWA). Solo escanean el código QR en la mesa o hacen clic en tu enlace de Instagram y el menú se abre al instante."
    },
    {
      q: "¿Cómo funciona el Cazador de Reseñas de Google?",
      a: "Cuando el comensal está en el carrito o finaliza su pedido, el sistema le solicita una valoración rápida con estrellas. Si califica 5 estrellas, se le redirige con 1 clic a tu perfil de Google My Business para publicar su reseña. Si califica bajo, el mensaje se envía como feedback interno a la gerencia para resolver el problema antes de que llegue a internet."
    },
    {
      q: "¿Puedo cambiar precios y platos desde WhatsApp?",
      a: "Sí. Nuestro Copiloto IA permite vincular tu número de WhatsApp autorizado. Puedes mandar un mensaje de texto o una nota de voz diciendo 'Pausa los postres por hoy' y la IA actualizará el menú en tiempo real."
    },
    {
      q: "¿Hay comisiones por cada pedido vendido?",
      a: "Cero comisiones (0%). A diferencia de plataformas como PedidosYa o iFood que cobran entre 15% y 30%, en MiMenu solo pagas tu suscripción fija y todo lo que vendes es 100% tuyo."
    }
  ];

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col selection:bg-amber-500 selection:text-white">
      {/* Top Banner Notice */}
      <div className="bg-gradient-to-r from-amber-600 via-orange-600 to-red-600 text-white text-xs font-bold py-2 px-4 text-center flex items-center justify-center gap-2">
        <Sparkles className="w-3.5 h-3.5 animate-pulse" />
        <span>🚀 <strong>Nuevo:</strong> Copiloto de IA por WhatsApp y Cazador de Reseñas Google activados.</span>
        <span className="hidden sm:inline opacity-80">| Prueba 14 días gratis sin tarjeta.</span>
      </div>

      {/* Main Navbar */}
      <header className="sticky top-0 z-50 w-full bg-background/95 backdrop-blur-md border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-18 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-amber-500 via-orange-500 to-red-600 flex items-center justify-center text-white font-black text-xl shadow-lg shadow-orange-500/20">
              ⚡
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-1.5">
                <span className="font-black text-xl tracking-tight text-foreground">MiMenu</span>
                <span className="text-[10px] font-extrabold uppercase bg-amber-500/15 text-amber-500 px-2 py-0.5 rounded-full border border-amber-500/30">
                  IA v2.4
                </span>
              </div>
              <span className="text-[10px] font-semibold text-muted-foreground -mt-0.5">SaaS Gastronómico Inteligente</span>
            </div>
          </Link>

          <nav className="hidden lg:flex items-center gap-8 text-sm font-semibold text-muted-foreground">
            <a href="#soluciones" className="hover:text-foreground transition-colors">8 Herramientas</a>
            <a href="#comparativa" className="hover:text-foreground transition-colors">Comparativa</a>
            <a href="#copiloto-ia" className="hover:text-foreground transition-colors">Copiloto IA</a>
            <a href="#calculadora-roi" className="hover:text-foreground transition-colors">Calculadora ROI</a>
            <a href="#precios" className="hover:text-foreground transition-colors">Precios</a>
            <a href="#faq" className="hover:text-foreground transition-colors">FAQ</a>
          </nav>

          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate('/menu')}
              className="hidden sm:inline-flex border-amber-500/30 hover:border-amber-500 text-foreground font-bold rounded-xl text-xs"
            >
              <Play className="w-3.5 h-3.5 mr-1.5 fill-amber-500 text-amber-500" />
              <span>Ver Demo en Vivo</span>
            </Button>

            <Button
              size="sm"
              onClick={() => navigate('/onboarding')}
              className="bg-gradient-to-r from-amber-500 to-red-600 hover:from-amber-600 hover:to-red-700 text-white font-bold text-xs shadow-md shadow-amber-500/20 rounded-xl"
            >
              <span>Probar 14 Días Gratis</span>
              <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
            </Button>
          </div>
        </div>
      </header>

      {/* HERO SECTION */}
      <section className="relative overflow-hidden pt-12 pb-20 md:pt-20 md:pb-32 bg-gradient-to-b from-background via-amber-950/10 to-background border-b border-border">
        {/* Background ambient glow */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-gradient-to-tr from-amber-500/20 via-red-500/20 to-orange-500/10 blur-[120px] pointer-events-none rounded-full" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Left Column: Core Copy */}
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 bg-amber-500/10 border border-amber-500/30 px-4 py-1.5 rounded-full text-xs font-bold text-amber-500">
                <Zap className="w-4 h-4 fill-amber-500" />
                <span>Activa 16 herramientas de venta en solo 5 minutos</span>
              </div>

              <h1 className="text-4xl sm:text-5xl md:text-6xl font-black tracking-tight leading-[1.08] text-foreground">
                Deja de perder dinero con menús estáticos. <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-500 via-orange-500 to-red-600">
                  Pasa al Menú con IA que Vende Solo.
                </span>
              </h1>

              <p className="text-base sm:text-lg text-muted-foreground leading-relaxed max-w-2xl mx-auto lg:mx-0">
                Aumenta tu ticket promedio en un <strong>24%</strong>, multiplica tus <strong>reseñas 5 estrellas en Google</strong> y recupera el control de tus pedidos en mesa y delivery <strong>sin pagar comisiones a intermediarios</strong>.
              </p>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2">
                <Button
                  size="lg"
                  onClick={() => navigate('/onboarding')}
                  className="w-full sm:w-auto bg-gradient-to-r from-amber-500 to-red-600 hover:from-amber-600 hover:to-red-700 text-white font-black text-base px-8 py-6 rounded-2xl shadow-xl shadow-amber-500/25"
                >
                  <Sparkles className="w-5 h-5 mr-2" />
                  <span>Crear Mi Menú con IA Gratis</span>
                </Button>

                <Button
                  size="lg"
                  variant="outline"
                  onClick={() => navigate('/menu')}
                  className="w-full sm:w-auto border-2 border-border hover:border-amber-500 font-bold text-base px-6 py-6 rounded-2xl"
                >
                  <UtensilsCrossed className="w-5 h-5 mr-2 text-amber-500" />
                  <span>Explorar Menú Demo (Moe's)</span>
                </Button>
              </div>

              {/* Trust Micro-Badges */}
              <div className="pt-4 flex flex-wrap items-center justify-center lg:justify-start gap-6 text-xs font-semibold text-muted-foreground">
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                  Sin comisiones por pedido
                </span>
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                  Setup automático en 5 min
                </span>
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                  Cancela cuando quieras
                </span>
              </div>
            </div>

            {/* Right Column: Interactive Phone Mockup */}
            <div className="lg:col-span-5 flex justify-center">
              <div className="relative w-full max-w-sm">
                {/* Phone container */}
                <div className="relative rounded-[40px] border-4 border-foreground/10 bg-card/90 backdrop-blur-xl shadow-2xl p-4 overflow-hidden space-y-4">
                  
                  {/* Phone Notch/Header */}
                  <div className="flex items-center justify-between pb-2 border-b border-border/60">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-lg bg-amber-500 flex items-center justify-center text-white text-xs font-bold">
                        🍺
                      </div>
                      <div>
                        <p className="text-xs font-black leading-none">{venue.name}</p>
                        <p className="text-[10px] text-muted-foreground">Mesa #4 • Terraza</p>
                      </div>
                    </div>
                    <span className="inline-flex items-center gap-1 text-[10px] font-extrabold bg-emerald-500/10 text-emerald-500 border border-emerald-500/30 px-2 py-0.5 rounded-full">
                      ● Abierto
                    </span>
                  </div>

                  {/* Hotness Item Preview */}
                  <div className="p-3.5 rounded-2xl bg-gradient-to-br from-amber-500/10 via-red-500/5 to-transparent border border-amber-500/30 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="inline-flex items-center gap-1 text-[10px] font-extrabold uppercase bg-red-500 text-white px-2 py-0.5 rounded-md">
                        <Flame className="w-3 h-3 fill-white" />
                        ¡En Llamas! (38 pedidos hoy)
                      </span>
                      <span className="text-xs font-black text-amber-500">Bs. 45</span>
                    </div>
                    <h4 className="text-xs font-black text-foreground">Salchipapa Moe's Monster</h4>
                    <p className="text-[11px] text-muted-foreground line-clamp-2">
                      450g papas rústicas, doble salchicha, tocino, queso cheddar y salsa secreta.
                    </p>
                  </div>

                  {/* AI Upsell Strip Simulation */}
                  <div className="p-3 rounded-2xl bg-amber-500/10 border border-amber-500/30 space-y-2">
                    <div className="flex items-center gap-1.5 text-[11px] font-black text-amber-500">
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>Sugerencia Inteligente de Maridaje</span>
                    </div>
                    <div className="flex items-center justify-between bg-card p-2 rounded-xl border border-border">
                      <div className="text-[11px]">
                        <p className="font-bold text-foreground">Chopp Helado Escarchado</p>
                        <p className="text-muted-foreground font-medium">+Bs. 25</p>
                      </div>
                      <Button size="sm" className="h-7 text-[10px] font-bold bg-amber-500 hover:bg-amber-600 text-white rounded-lg px-2">
                        + Agregar
                      </Button>
                    </div>
                  </div>

                  {/* Google Review Prompt Simulation */}
                  <div className="p-3.5 rounded-2xl bg-gradient-to-r from-blue-600/10 to-indigo-600/10 border border-blue-500/30 space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5 text-blue-500 font-black text-[11px]">
                        <Star className="w-3.5 h-3.5 fill-blue-500" />
                        <span>¿Cómo estuvo hoy tu noche?</span>
                      </div>
                      <span className="text-[9px] bg-blue-500/20 text-blue-500 font-bold px-1.5 py-0.5 rounded">Google Sync</span>
                    </div>
                    <div className="flex items-center justify-center gap-1.5 py-1">
                      {[1, 2, 3, 4, 5].map((s) => (
                        <div key={s} className="w-6 h-6 rounded-full bg-amber-400 flex items-center justify-center text-white text-xs shadow-sm font-bold">
                          ★
                        </div>
                      ))}
                    </div>
                    <p className="text-[10px] text-center text-muted-foreground">
                      Tu opinión sube directo a Google Maps con 1 clic.
                    </p>
                  </div>

                  {/* Express Cart CTA */}
                  <Button
                    onClick={() => navigate('/menu')}
                    className="w-full bg-foreground text-background hover:bg-foreground/90 font-bold text-xs py-5 rounded-2xl flex items-center justify-between px-4"
                  >
                    <span>Ver Carrito Express (2 items)</span>
                    <span className="bg-amber-500 text-white px-2 py-0.5 rounded text-[11px] font-black">Bs. 70 →</span>
                  </Button>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* METRICS & SOCIAL PROOF BAR */}
      <section className="py-10 bg-card border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div className="space-y-1">
              <p className="text-3xl sm:text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-amber-500 to-red-600">0%</p>
              <p className="text-xs sm:text-sm font-semibold text-muted-foreground">Comisión por tus pedidos</p>
            </div>
            <div className="space-y-1">
              <p className="text-3xl sm:text-4xl font-black text-foreground">+24%</p>
              <p className="text-xs sm:text-sm font-semibold text-muted-foreground">Incremento en Ticket Promedio</p>
            </div>
            <div className="space-y-1">
              <p className="text-3xl sm:text-4xl font-black text-amber-500">+4.9 ★</p>
              <p className="text-xs sm:text-sm font-semibold text-muted-foreground">Promedio en Google Maps</p>
            </div>
            <div className="space-y-1">
              <p className="text-3xl sm:text-4xl font-black text-emerald-500">&lt; 5 min</p>
              <p className="text-xs sm:text-sm font-semibold text-muted-foreground">Tiempo de Puesta en Marcha</p>
            </div>
          </div>
        </div>
      </section>

      {/* THE 8-IN-1 PLATFORM SOLUTION GRID */}
      <section id="soluciones" className="py-20 max-w-7xl mx-auto px-4 sm:px-6 space-y-12">
        <div className="text-center space-y-3 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 bg-amber-500/10 border border-amber-500/30 px-3.5 py-1 rounded-full text-xs font-bold text-amber-500">
            <Layers className="w-3.5 h-3.5" />
            <span>Plataforma Todo-en-Uno</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-black tracking-tight">
            8 Herramientas de Crecimiento en Una Sola Plataforma
          </h2>
          <p className="text-sm sm:text-base text-muted-foreground">
            Elimina el caos de tener 5 softwares distintos. MiMenu reúne todo lo que tu bar, restaurante o food truck necesita para operar y multiplicar su facturación.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {solutions.map((s) => {
            const Icon = s.icon;
            return (
              <div 
                key={s.id}
                className="group relative p-6 rounded-3xl bg-card border border-border hover:border-amber-500/50 transition-all duration-300 shadow-sm hover:shadow-xl hover:-translate-y-1 flex flex-col justify-between"
              >
                <div className="space-y-4">
                  <div className={`w-12 h-12 rounded-2xl bg-gradient-to-tr ${s.color} flex items-center justify-center text-white shadow-md`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <h3 className="text-lg font-black text-foreground group-hover:text-amber-500 transition-colors">
                    {s.title}
                  </h3>
                  <p className="text-xs font-medium text-muted-foreground leading-relaxed">
                    {s.details}
                  </p>
                </div>
                <div className="pt-4 mt-4 border-t border-border/50 flex items-center gap-1.5 text-xs font-bold text-amber-500">
                  <span>Explorar módulo</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* COMPARISON SECTION: TRADITIONAL VS MIMENU */}
      <section id="comparativa" className="py-20 bg-card border-y border-border">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 space-y-12">
          <div className="text-center space-y-3 max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 bg-red-500/10 border border-red-500/30 px-3.5 py-1 rounded-full text-xs font-bold text-red-500">
              <Percent className="w-3.5 h-3.5" />
              <span>Comparativa de Mercado</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-black tracking-tight">
              ¿Por qué los restaurantes líderes están migrando a MiMenu?
            </h2>
            <p className="text-sm sm:text-base text-muted-foreground">
              Compara el costo real y los resultados de un PDF estático o una app de delivery frente a MiMenu.
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[640px]">
              <thead>
                <tr className="border-b border-border text-xs uppercase font-black text-muted-foreground">
                  <th className="py-4 px-4">Capacidad / Característica</th>
                  <th className="py-4 px-4 text-center">Menú PDF Tradicional</th>
                  <th className="py-4 px-4 text-center">Apps de Delivery (iFood/PYa)</th>
                  <th className="py-4 px-4 text-center bg-amber-500/10 text-amber-500 rounded-t-2xl font-black">
                    MiMenu con IA 🔥
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border text-sm font-semibold">
                <tr>
                  <td className="py-4 px-4 font-bold">Comisión por Pedido</td>
                  <td className="py-4 px-4 text-center text-muted-foreground">0% (Sin pedidos)</td>
                  <td className="py-4 px-4 text-center text-red-500 font-bold">15% a 30% por venta</td>
                  <td className="py-4 px-4 text-center font-black text-emerald-500 bg-amber-500/5">0% (100% tuyo)</td>
                </tr>
                <tr>
                  <td className="py-4 px-4 font-bold">Reseñas en Google Maps</td>
                  <td className="py-4 px-4 text-center text-muted-foreground"><X className="w-4 h-4 mx-auto text-red-400" /></td>
                  <td className="py-4 px-4 text-center text-muted-foreground">Solo en su app cerrada</td>
                  <td className="py-4 px-4 text-center font-bold text-amber-500 bg-amber-500/5">Automático en la mesa</td>
                </tr>
                <tr>
                  <td className="py-4 px-4 font-bold">Sugerencias y Upselling con IA</td>
                  <td className="py-4 px-4 text-center text-muted-foreground"><X className="w-4 h-4 mx-auto text-red-400" /></td>
                  <td className="py-4 px-4 text-center text-muted-foreground">Limitado a su algoritmo</td>
                  <td className="py-4 px-4 text-center font-bold text-emerald-500 bg-amber-500/5">Maridajes inteligentes (+24%)</td>
                </tr>
                <tr>
                  <td className="py-4 px-4 font-bold">Administración por WhatsApp</td>
                  <td className="py-4 px-4 text-center text-muted-foreground"><X className="w-4 h-4 mx-auto text-red-400" /></td>
                  <td className="py-4 px-4 text-center text-muted-foreground"><X className="w-4 h-4 mx-auto text-red-400" /></td>
                  <td className="py-4 px-4 text-center font-bold text-emerald-500 bg-amber-500/5">Por notas de voz y chat</td>
                </tr>
                <tr>
                  <td className="py-4 px-4 font-bold">Dueño de los Datos del Cliente (CRM)</td>
                  <td className="py-4 px-4 text-center text-muted-foreground">0 datos</td>
                  <td className="py-4 px-4 text-center text-red-500">Los datos son de ellos</td>
                  <td className="py-4 px-4 text-center font-bold text-emerald-500 bg-amber-500/5">100% tu base de datos</td>
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
            <div className="inline-flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/30 px-3.5 py-1 rounded-full text-xs font-bold text-emerald-500">
              <Bot className="w-4 h-4" />
              <span>Copiloto de IA Conversacional</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-black tracking-tight">
              Maneja tu restaurante entero enviando un audio por WhatsApp.
            </h2>
            <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
              No pierdas tiempo entrando a paneles complicados en la computadora en mitad del servicio. Habla con tu Copiloto de MiMenu por WhatsApp como si fuera tu gerente operativo.
            </p>

            {/* Simulation Selection Buttons */}
            <div className="space-y-3 pt-2">
              <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Prueba una orden interactiva:</p>
              {copilotSimulations.map((sim, idx) => (
                <button
                  key={idx}
                  onClick={() => setSimulatedChatStep(idx)}
                  className={`w-full text-left p-3.5 rounded-2xl border text-xs font-bold transition-all flex items-center justify-between ${
                    simulatedChatStep === idx
                      ? 'bg-emerald-500/10 border-emerald-500 text-emerald-600 dark:text-emerald-400 shadow-sm'
                      : 'bg-card border-border text-foreground hover:border-emerald-500/40'
                  }`}
                >
                  <span>"{sim.userMsg}"</span>
                  <span className="text-[10px] bg-emerald-500/20 px-2 py-0.5 rounded text-emerald-600 font-extrabold ml-2">
                    {sim.actionBadge}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Interactive Chat Window */}
          <div className="lg:col-span-6 flex justify-center">
            <div className="w-full max-w-md rounded-3xl border border-border bg-[#0b141a] text-white p-5 shadow-2xl space-y-4">
              {/* Chat Header */}
              <div className="flex items-center justify-between pb-3 border-b border-white/10">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-emerald-600 flex items-center justify-center text-white font-black text-base shadow">
                    🤖
                  </div>
                  <div>
                    <h4 className="text-xs font-black text-white">MiMenu Copilot IA</h4>
                    <p className="text-[10px] text-emerald-400 font-semibold flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                      En línea (Respuestas &lt; 2s)
                    </p>
                  </div>
                </div>
                <span className="text-[10px] font-bold bg-white/10 px-2 py-1 rounded text-white/70">WhatsApp Bot</span>
              </div>

              {/* Chat Messages */}
              <div className="space-y-3 min-h-[160px] flex flex-col justify-center">
                {/* User message */}
                <div className="self-end bg-[#005c4b] text-white p-3.5 rounded-2xl rounded-tr-none text-xs font-medium max-w-[85%] shadow">
                  <p>{copilotSimulations[simulatedChatStep].userMsg}</p>
                  <span className="text-[9px] text-white/60 block text-right mt-1">21:42 ✓✓</span>
                </div>

                {/* AI reply */}
                <div className="self-start bg-[#202c33] text-white p-3.5 rounded-2xl rounded-tl-none text-xs font-medium max-w-[90%] space-y-1.5 shadow border border-white/5">
                  <div className="flex items-center gap-1 text-[10px] text-emerald-400 font-extrabold">
                    <Sparkles className="w-3 h-3" />
                    <span>MiMenu AI Assistant</span>
                  </div>
                  <p className="whitespace-pre-line text-white/90">
                    {copilotSimulations[simulatedChatStep].aiReply}
                  </p>
                  <span className="text-[9px] text-white/50 block text-right mt-1">21:42</span>
                </div>
              </div>

              {/* Input simulator bar */}
              <div className="pt-2 border-t border-white/10 flex items-center gap-2">
                <div className="flex-1 bg-[#2a3942] rounded-full px-4 py-2 text-[11px] text-white/50 flex items-center justify-between">
                  <span>Escribe o envía una nota de voz...</span>
                  <Bot className="w-3.5 h-3.5 text-emerald-400" />
                </div>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* ROI / COMMISSION CALCULATOR SECTION */}
      <section id="calculadora-roi" className="py-20 bg-gradient-to-b from-card via-background to-card border-y border-border">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 space-y-10">
          <div className="text-center space-y-3 max-w-2xl mx-auto">
            <div className="inline-flex items-center gap-2 bg-amber-500/10 border border-amber-500/30 px-3.5 py-1 rounded-full text-xs font-bold text-amber-500">
              <DollarSign className="w-3.5 h-3.5" />
              <span>Calculadora de Ganancias</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-black tracking-tight">
              Calcula cuánto dinero estás dejando sobre la mesa
            </h2>
            <p className="text-sm text-muted-foreground">
              Ajusta el volumen de pedidos de tu local y descubre el impacto económico inmediato de implementar MiMenu.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center bg-card p-6 md:p-8 rounded-3xl border border-border shadow-xl">
            
            {/* Controls */}
            <div className="md:col-span-6 space-y-6">
              <div className="space-y-2">
                <div className="flex justify-between text-xs font-bold">
                  <span>Pedidos totales al mes:</span>
                  <span className="text-amber-500 text-sm font-black">{monthlyOrders} pedidos</span>
                </div>
                <input
                  type="range"
                  min="100"
                  max="3000"
                  step="50"
                  value={monthlyOrders}
                  onChange={(e) => setMonthlyOrders(Number(e.target.value))}
                  className="w-full accent-amber-500 h-2 bg-border rounded-lg cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-muted-foreground">
                  <span>100</span>
                  <span>1,500</span>
                  <span>3,000+</span>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-xs font-bold">
                  <span>Ticket promedio por pedido:</span>
                  <span className="text-amber-500 text-sm font-black">Bs. {averageTicket}</span>
                </div>
                <input
                  type="range"
                  min="20"
                  max="200"
                  step="5"
                  value={averageTicket}
                  onChange={(e) => setAverageTicket(Number(e.target.value))}
                  className="w-full accent-amber-500 h-2 bg-border rounded-lg cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-muted-foreground">
                  <span>Bs. 20</span>
                  <span>Bs. 100</span>
                  <span>Bs. 200+</span>
                </div>
              </div>
            </div>

            {/* Results Card */}
            <div className="md:col-span-6 p-6 rounded-2xl bg-gradient-to-br from-amber-500/10 via-red-500/5 to-transparent border border-amber-500/30 space-y-4">
              <h4 className="text-xs font-black uppercase tracking-wider text-muted-foreground">Tu Retorno Estimado con MiMenu</h4>
              
              <div className="space-y-3">
                <div className="flex items-center justify-between pb-2 border-b border-border">
                  <span className="text-xs font-semibold text-foreground">Comisiones Ahorradas (vs iFood/PYa):</span>
                  <span className="text-base font-black text-emerald-500">+Bs. {thirdPartyCommissionsLost.toLocaleString()} / mes</span>
                </div>

                <div className="flex items-center justify-between pb-2 border-b border-border">
                  <span className="text-xs font-semibold text-foreground">Aumento por Maridaje IA (+24%):</span>
                  <span className="text-base font-black text-amber-500">+Bs. {upsellRevenueGain.toLocaleString()} / mes</span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-foreground">Nuevas Reseñas Google Estimadas:</span>
                  <span className="text-base font-black text-blue-500">+{estimatedGoogleReviews} reseñas 5★</span>
                </div>
              </div>

              <Button
                onClick={() => navigate('/onboarding')}
                className="w-full bg-gradient-to-r from-amber-500 to-red-600 hover:from-amber-600 hover:to-red-700 text-white font-black text-xs py-5 rounded-xl shadow-lg"
              >
                <span>Empezar a Ahorrar Hoy (14 Días Gratis)</span>
              </Button>
            </div>

          </div>
        </div>
      </section>

      {/* PRICING TIERS */}
      <section id="precios" className="py-20 max-w-7xl mx-auto px-4 sm:px-6 space-y-12">
        <div className="text-center space-y-3 max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-2 bg-amber-500/10 border border-amber-500/30 px-3.5 py-1 rounded-full text-xs font-bold text-amber-500">
            <Zap className="w-3.5 h-3.5" />
            <span>Precios Transparentes</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-black tracking-tight">
            Planes Diseñados para Crecer Sin Ataduras
          </h2>
          <p className="text-sm text-muted-foreground">
            Todas las suscripciones incluyen 0% comisiones por pedido y soporte personalizado.
          </p>

          {/* Billing Switch */}
          <div className="pt-4 flex items-center justify-center gap-3">
            <span className={`text-xs font-bold ${billingCycle === 'monthly' ? 'text-foreground' : 'text-muted-foreground'}`}>Mensual</span>
            <button
              onClick={() => setBillingCycle(billingCycle === 'monthly' ? 'yearly' : 'monthly')}
              className="w-12 h-6 rounded-full bg-border p-1 relative transition-colors focus:outline-none"
            >
              <div className={`w-4 h-4 rounded-full bg-amber-500 transition-transform ${billingCycle === 'yearly' ? 'translate-x-6' : ''}`} />
            </button>
            <span className={`text-xs font-bold flex items-center gap-1.5 ${billingCycle === 'yearly' ? 'text-foreground' : 'text-muted-foreground'}`}>
              Anual 
              <span className="text-[10px] bg-emerald-500/20 text-emerald-500 px-1.5 py-0.5 rounded font-black">2 Meses Gratis</span>
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          {/* Starter Plan */}
          <div className="p-8 rounded-3xl bg-card border border-border flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              <h3 className="text-lg font-black">Starter</h3>
              <p className="text-xs text-muted-foreground">Ideal para cafeterías, food trucks y locales pequeños.</p>
              <div className="flex items-baseline gap-1">
                <span className="text-4xl font-black">Bs. {billingCycle === 'monthly' ? '130' : '110'}</span>
                <span className="text-xs text-muted-foreground">/ mes</span>
              </div>

              <ul className="space-y-2.5 text-xs font-semibold text-muted-foreground pt-4 border-t border-border">
                <li className="flex items-center gap-2 text-foreground"><Check className="w-4 h-4 text-emerald-500" /> Menú Digital con Código QR</li>
                <li className="flex items-center gap-2 text-foreground"><Check className="w-4 h-4 text-emerald-500" /> Cazador de Reseñas en Google</li>
                <li className="flex items-center gap-2 text-foreground"><Check className="w-4 h-4 text-emerald-500" /> 0% Comisiones por Pedido</li>
                <li className="flex items-center gap-2 text-foreground"><Check className="w-4 h-4 text-emerald-500" /> Link en Bio para Redes</li>
                <li className="flex items-center gap-2 opacity-50"><X className="w-4 h-4 text-muted-foreground" /> Copiloto IA por WhatsApp</li>
              </ul>
            </div>

            <Button
              variant="outline"
              onClick={() => navigate('/onboarding')}
              className="w-full font-bold text-xs py-5 rounded-xl border-border hover:border-amber-500"
            >
              Comenzar con Starter
            </Button>
          </div>

          {/* Pro Plan (Featured) */}
          <div className="relative p-8 rounded-3xl bg-gradient-to-b from-card via-card to-amber-500/5 border-2 border-amber-500 shadow-2xl flex flex-col justify-between space-y-6">
            <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-gradient-to-r from-amber-500 to-red-600 text-white text-[10px] font-black uppercase px-3 py-1 rounded-full shadow">
              MÁS ELEGIDO POR BARES Y RESTAURANTES
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-black text-foreground">Pro IA</h3>
              <p className="text-xs text-muted-foreground">Para restaurantes, bares y cervecerías en crecimiento.</p>
              <div className="flex items-baseline gap-1">
                <span className="text-4xl font-black text-amber-500">Bs. {billingCycle === 'monthly' ? '340' : '290'}</span>
                <span className="text-xs text-muted-foreground">/ mes</span>
              </div>

              <ul className="space-y-2.5 text-xs font-semibold text-foreground pt-4 border-t border-border">
                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-500" /> <strong>Todo lo del plan Starter</strong></li>
                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-500" /> <strong>Copiloto IA por WhatsApp 24/7</strong></li>
                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-500" /> Carrito Express & Upselling IA (+24%)</li>
                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-500" /> Pedidos en Mesa con QR asignado</li>
                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-500" /> Comanda Digital / Pantalla Cocina (KDS)</li>
                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-500" /> CRM de Clientes & Fidelización</li>
              </ul>
            </div>

            <Button
              onClick={() => navigate('/onboarding')}
              className="w-full bg-gradient-to-r from-amber-500 to-red-600 hover:from-amber-600 hover:to-red-700 text-white font-black text-xs py-5 rounded-xl shadow-lg shadow-amber-500/25"
            >
              Probar 14 Días Gratis
            </Button>
          </div>

          {/* Enterprise Plan */}
          <div className="p-8 rounded-3xl bg-card border border-border flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              <h3 className="text-lg font-black">Multi-Sucursal</h3>
              <p className="text-xs text-muted-foreground">Para cadenas, franquicias y hoteles con múltiples puntos.</p>
              <div className="flex items-baseline gap-1">
                <span className="text-4xl font-black">Bs. {billingCycle === 'monthly' ? '680' : '590'}</span>
                <span className="text-xs text-muted-foreground">/ mes</span>
              </div>

              <ul className="space-y-2.5 text-xs font-semibold text-muted-foreground pt-4 border-t border-border">
                <li className="flex items-center gap-2 text-foreground"><Check className="w-4 h-4 text-emerald-500" /> <strong>Todo lo del plan Pro IA</strong></li>
                <li className="flex items-center gap-2 text-foreground"><Check className="w-4 h-4 text-emerald-500" /> Multi-sucursales unificadas</li>
                <li className="flex items-center gap-2 text-foreground"><Check className="w-4 h-4 text-emerald-500" /> Integración con Sistemas POS / Impresoras</li>
                <li className="flex items-center gap-2 text-foreground"><Check className="w-4 h-4 text-emerald-500" /> Soporte prioritario por WhatsApp VIP</li>
              </ul>
            </div>

            <Button
              variant="outline"
              onClick={() => navigate('/onboarding')}
              className="w-full font-bold text-xs py-5 rounded-xl border-border hover:border-amber-500"
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
            <h2 className="text-3xl font-black tracking-tight">Preguntas Frecuentes</h2>
            <p className="text-sm text-muted-foreground">Todo lo que necesitas saber antes de empezar.</p>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, i) => (
              <div 
                key={i} 
                className="p-5 rounded-2xl bg-background border border-border cursor-pointer transition-all"
                onClick={() => setOpenFaqIndex(openFaqIndex === i ? null : i)}
              >
                <div className="flex items-center justify-between font-bold text-sm text-foreground">
                  <span>{faq.q}</span>
                  <ChevronDown className={`w-4 h-4 text-muted-foreground transition-transform ${openFaqIndex === i ? 'rotate-180 text-amber-500' : ''}`} />
                </div>
                {openFaqIndex === i && (
                  <p className="pt-3 text-xs text-muted-foreground leading-relaxed border-t border-border/50 mt-3">
                    {faq.a}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CLOSING CTA BANNER */}
      <section className="py-20 bg-gradient-to-r from-amber-600 via-orange-600 to-red-600 text-white text-center">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 space-y-6">
          <h2 className="text-3xl sm:text-5xl font-black tracking-tight leading-tight">
            Transforma tu menú en una máquina de ventas hoy mismo.
          </h2>
          <p className="text-base text-white/90 max-w-xl mx-auto">
            Únete a los restaurantes que aumentaron su ticket promedio +24% y eliminaron las comisiones de terceros.
          </p>
          <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button
              size="lg"
              onClick={() => navigate('/onboarding')}
              className="bg-white text-gray-900 hover:bg-white/90 font-black text-sm px-8 py-6 rounded-2xl shadow-2xl"
            >
              <Sparkles className="w-4 h-4 mr-2 text-amber-600" />
              <span>Comenzar Prueba Gratis de 14 Días</span>
            </Button>
            <Button
              size="lg"
              variant="outline"
              onClick={() => navigate('/menu')}
              className="border-2 border-white/40 hover:border-white text-white font-bold text-sm px-6 py-6 rounded-2xl"
            >
              <span>Ver Demo en Vivo (Moe's)</span>
            </Button>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="py-12 bg-background border-t border-border text-xs text-muted-foreground">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-lg bg-amber-500 flex items-center justify-center text-white font-black text-xs">
              ⚡
            </div>
            <span className="font-bold text-foreground">MiMenu Platform</span>
            <span>• © 2026 ClubeMkt. Todos los derechos reservados.</span>
          </div>

          <div className="flex items-center gap-6 font-semibold">
            <Link to="/menu" className="hover:text-foreground transition-colors">Demo Moe's</Link>
            <Link to="/admin" className="hover:text-foreground transition-colors">Acceso Admin</Link>
            <Link to="/admin/ai-chat" className="hover:text-foreground transition-colors">Copiloto IA</Link>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
