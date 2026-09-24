import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { 
  Building2, 
  UtensilsCrossed, 
  QrCode, 
  Bot, 
  CheckCircle2, 
  ArrowRight, 
  ArrowLeft, 
  Sparkles, 
  Upload, 
  FileText, 
  Check, 
  Flame, 
  Star, 
  Smartphone, 
  ShieldCheck, 
  Plus, 
  Trash2, 
  ExternalLink, 
  Zap,
  DollarSign
} from 'lucide-react';
import { useMimenu } from '@/lib/mimenuContext';
import { MenuCategoryDetail, MenuItemDetail, Venue } from '@/types/mimenu';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';

// Sample presets for 1-click AI menu generation
const MENU_PRESETS: Record<string, { label: string; icon: string; categories: MenuCategoryDetail[] }> = {
  burger_bar: {
    label: "Hamburguesas & Salchipapas",
    icon: "🍔",
    categories: [
      {
        id: "cat-burgers",
        venue_id: "custom-venue",
        key: "burgers",
        name: "Hamburguesas Artesanales",
        description: "Carne 100% de res a la parrilla en pan brioche",
        icon: "UtensilsCrossed",
        order_index: 1,
        items: [
          {
            id: "item-b1",
            venue_id: "custom-venue",
            category_id: "cat-burgers",
            name: "Burger Doble Bacon Cheddar",
            description: "Doble medallón de 120g, queso cheddar fundido, tocino crocante y salsa secreta.",
            price: 42,
            original_price: 48,
            image_url: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=800&q=80",
            is_available: true,
            is_best_seller: true,
            hotness_score: 5,
            velocity_24h: 35,
            baseline_14d: 8,
            reviews_count: 32,
            average_rating: 4.9,
            tags: ["Insignia", "Doble Carne"],
            allergens: ["Gluten", "Lácteos"]
          },
          {
            id: "item-b2",
            venue_id: "custom-venue",
            category_id: "cat-burgers",
            name: "Burger Clásica Royal",
            description: "Medallón simple, lechuga fresca, tomate, huevo frito y queso mozzarella.",
            price: 32,
            image_url: "https://images.unsplash.com/photo-1586190848861-99aa4a171e90?auto=format&fit=crop&w=800&q=80",
            is_available: true,
            hotness_score: 4,
            velocity_24h: 21,
            baseline_14d: 7,
            reviews_count: 18,
            average_rating: 4.8,
            tags: ["Clásico"],
            allergens: ["Gluten", "Lácteos", "Huevo"]
          }
        ]
      },
      {
        id: "cat-bebidas",
        venue_id: "custom-venue",
        key: "bebidas",
        name: "Cervezas & Tragos",
        description: "Tarros escarchados y tragos de la casa",
        icon: "Beer",
        order_index: 2,
        items: [
          {
            id: "item-b3",
            venue_id: "custom-venue",
            category_id: "cat-bebidas",
            name: "Chopp Artesanal 500ml",
            description: "Cerveza rubia helada servida en vaso escarchado.",
            price: 22,
            image_url: "https://images.unsplash.com/photo-1514933651103-005eec06c04b?auto=format&fit=crop&w=800&q=80",
            is_available: true,
            is_best_seller: true,
            hotness_score: 5,
            velocity_24h: 44,
            baseline_14d: 10,
            reviews_count: 40,
            average_rating: 5.0,
            tags: ["Top Maridaje", "Escarchado"],
            allergens: ["Gluten"]
          }
        ]
      }
    ]
  },
  pizzeria: {
    label: "Pizzería & Pastas",
    icon: "🍕",
    categories: [
      {
        id: "cat-pizzas",
        venue_id: "custom-venue",
        key: "pizzas",
        name: "Pizzas a la Leña",
        description: "Masa madre madurada 48h y mozzarella fundida",
        icon: "UtensilsCrossed",
        order_index: 1,
        items: [
          {
            id: "item-p1",
            venue_id: "custom-venue",
            category_id: "cat-pizzas",
            name: "Pizza Pepperoni Supremo",
            description: "Salsa de tomate San Marzano, doble mozzarella y rodajas de pepperoni crocante.",
            price: 58,
            image_url: "https://images.unsplash.com/photo-1534308983496-4fabb1a015ee?auto=format&fit=crop&w=800&q=80",
            is_available: true,
            is_best_seller: true,
            hotness_score: 5,
            velocity_24h: 29,
            baseline_14d: 7,
            reviews_count: 27,
            average_rating: 4.9,
            tags: ["Favorito", "Masa Madre"],
            allergens: ["Gluten", "Lácteos"]
          }
        ]
      }
    ]
  },
  cocktail_lounge: {
    label: "Bar & Coctelería Nocturna",
    icon: "🍸",
    categories: [
      {
        id: "cat-tragos",
        venue_id: "custom-venue",
        key: "tragos",
        name: "Coctelería de Autor",
        description: "Mezclas exclusivas de nuestros bartenders",
        icon: "Wine",
        order_index: 1,
        items: [
          {
            id: "item-c1",
            venue_id: "custom-venue",
            category_id: "cat-tragos",
            name: "Gin Tonic Botánico",
            description: "Gin premium, agua tónica francesa, frutos rojos macerados y romero flameado.",
            price: 35,
            image_url: "https://images.unsplash.com/photo-1551024709-8f23befc6f87?auto=format&fit=crop&w=800&q=80",
            is_available: true,
            hotness_score: 5,
            velocity_24h: 30,
            baseline_14d: 6,
            reviews_count: 22,
            average_rating: 4.9,
            tags: ["Premium", "Refrescante"]
          }
        ]
      }
    ]
  }
};

export const Onboarding: React.FC = () => {
  const navigate = useNavigate();
  const { batchSetupVenue, venue: currentVenue } = useMimenu();

  const [step, setStep] = useState<number>(1);
  const totalSteps = 5;

  // Step 1: Venue form state
  const [venueName, setVenueName] = useState(currentVenue.name || "La Taberna de Moe");
  const [venueTagline, setVenueTagline] = useState(currentVenue.tagline || "El mejor ambiente y sabor de la ciudad");
  const [venueCity, setVenueCity] = useState(currentVenue.city || "Santa Cruz de la Sierra");
  const [venueAddress, setVenueAddress] = useState(currentVenue.address || "Av. San Martín #450, Equipetrol");
  const [venueCurrency, setVenueCurrency] = useState("Bs.");
  const [venueWhatsapp, setVenueWhatsapp] = useState("+591 78012345");
  const [venuePrimaryColor, setVenuePrimaryColor] = useState("#D97706");
  const [venueTheme, setVenueTheme] = useState<'dark' | 'light'>('dark');

  // Step 2: Menu parsing & categories
  const [selectedPresetKey, setSelectedPresetKey] = useState<string>("burger_bar");
  const [customCategories, setCustomCategories] = useState<MenuCategoryDetail[]>(
    MENU_PRESETS.burger_bar.categories
  );
  const [rawMenuText, setRawMenuText] = useState("");
  const [isAiParsing, setIsAiParsing] = useState(false);

  // Step 3: Tables & QR setup
  const [tableCount, setTableCount] = useState<number>(10);
  const [googleReviewUrl, setGoogleReviewUrl] = useState("https://maps.google.com");

  // Step 4: WhatsApp copilot test
  const [copilotPhone, setCopilotPhone] = useState("+591 78012345");
  const [copilotTestMsg, setCopilotTestMsg] = useState("Sube la cerveza a 25 Bs");
  const [copilotTestResponse, setCopilotTestResponse] = useState<string | null>(null);

  // Handle Preset Selection
  const handleSelectPreset = (key: string) => {
    setSelectedPresetKey(key);
    if (MENU_PRESETS[key]) {
      setCustomCategories(MENU_PRESETS[key].categories);
      toast.success(`Plantilla cargada: ${MENU_PRESETS[key].label}`);
    }
  };

  // AI Menu Text Parser Simulation
  const handleParseMenuText = () => {
    if (!rawMenuText.trim()) {
      toast.error("Por favor pega el texto de tu menú o platos");
      return;
    }

    setIsAiParsing(true);
    setTimeout(() => {
      const lines = rawMenuText.split('\n').filter(l => l.trim().length > 0);
      const parsedItems: MenuItemDetail[] = lines.map((line, idx) => {
        // Simple heuristic: extract price if numbers present
        const priceMatch = line.match(/\d+/);
        const price = priceMatch ? parseInt(priceMatch[0], 10) : 35;
        const cleanName = line.replace(/(\$|Bs\.?|R\$|€)?\s*\d+(\.\d+)?/g, '').trim() || `Plato Especial #${idx + 1}`;

        return {
          id: `ai-item-${Date.now()}-${idx}`,
          venue_id: "venue-custom",
          category_id: "cat-ai-import",
          name: cleanName,
          description: "Preparado al momento con ingredientes seleccionados.",
          price: price,
          image_url: "https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=800&q=80",
          is_available: true,
          hotness_score: 4,
          velocity_24h: 15,
          baseline_14d: 5,
          reviews_count: 12,
          average_rating: 4.8,
          tags: ["Recomendado"]
        };
      });

      const newCategory: MenuCategoryDetail = {
        id: "cat-ai-import",
        venue_id: "venue-custom",
        key: "carta_digital",
        name: "Carta Digital Importada con IA",
        description: "Platos extraídos y estructurados automáticamente",
        icon: "UtensilsCrossed",
        order_index: 1,
        items: parsedItems
      };

      setCustomCategories([newCategory]);
      setIsAiParsing(false);
      toast.success(`¡IA analizó tu menú! Se crearon ${parsedItems.length} platos estructurados.`);
    }, 1200);
  };

  // Test WhatsApp Copilot
  const handleTestCopilot = (e: React.FormEvent) => {
    e.preventDefault();
    if (!copilotTestMsg.trim()) return;

    setCopilotTestResponse("⏳ Analizando instrucción...");
    setTimeout(() => {
      setCopilotTestResponse(
        `🤖 Copiloto IA: "¡Entendido! He actualizado el producto '${copilotTestMsg}' en tiempo real en tu menú digital. El cambio ya es visible para los clientes."`
      );
    }, 800);
  };

  // Final Submit
  const handleFinishOnboarding = () => {
    const slug = venueName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') || 'mi-restaurante';

    batchSetupVenue(
      {
        name: venueName,
        slug: slug,
        tagline: venueTagline,
        city: venueCity,
        address: venueAddress,
        currency: venueCurrency,
        currency_code: venueCurrency === 'Bs.' ? 'BOB' : venueCurrency === 'USD' ? 'USD' : 'BRL',
        phone: venueWhatsapp,
        whatsapp: venueWhatsapp,
        primary_color: venuePrimaryColor,
        background_theme: venueTheme,
        google_review_url: googleReviewUrl,
        is_active: true,
      },
      customCategories,
      tableCount
    );

    setStep(5);
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col selection:bg-amber-500 selection:text-white">
      {/* Onboarding Navigation Bar */}
      <header className="sticky top-0 z-50 w-full bg-background/95 backdrop-blur-md border-b border-border">
        <div className="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-amber-500 to-red-600 flex items-center justify-center text-white font-black text-sm shadow">
              ⚡
            </div>
            <span className="font-black text-base tracking-tight">MiMenu Setup Wizard</span>
          </Link>

          <div className="flex items-center gap-2 text-xs font-bold text-muted-foreground">
            <span>Paso {step} de {totalSteps}</span>
            <div className="w-24 h-2 bg-border rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-amber-500 to-red-600 transition-all duration-300"
                style={{ width: `${(step / totalSteps) * 100}%` }}
              />
            </div>
          </div>
        </div>
      </header>

      {/* Main Wizard Container */}
      <main className="max-w-3xl mx-auto px-4 py-10 w-full flex-1">
        
        {/* STEP 1: VENUE IDENTITY & BRANDING */}
        {step === 1 && (
          <div className="space-y-6 animate-in fade-in duration-300">
            <div className="space-y-1 text-center sm:text-left">
              <span className="inline-flex items-center gap-1.5 text-xs font-extrabold uppercase bg-amber-500/10 text-amber-500 px-3 py-1 rounded-full">
                <Building2 className="w-3.5 h-3.5" />
                Paso 1: Identidad del Negocio
              </span>
              <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
                Cuéntanos sobre tu local o restaurante
              </h1>
              <p className="text-xs sm:text-sm text-muted-foreground">
                Configura los datos básicos que verán tus comensales en el menú digital y códigos QR.
              </p>
            </div>

            <div className="p-6 rounded-3xl bg-card border border-border space-y-4 shadow-sm">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-foreground">Nombre del Restaurante / Bar *</label>
                  <Input
                    value={venueName}
                    onChange={(e) => setVenueName(e.target.value)}
                    placeholder="ej. Moe's Taberna, Burger House"
                    className="h-11 rounded-xl text-xs bg-background"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-foreground">Ciudad *</label>
                  <Input
                    value={venueCity}
                    onChange={(e) => setVenueCity(e.target.value)}
                    placeholder="ej. Santa Cruz de la Sierra, La Paz"
                    className="h-11 rounded-xl text-xs bg-background"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-foreground">Slogan o Tagline</label>
                <Input
                  value={venueTagline}
                  onChange={(e) => setVenueTagline(e.target.value)}
                  placeholder="ej. Las mejores salchipapas y chopp helado de la ciudad"
                  className="h-11 rounded-xl text-xs bg-background"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-foreground">Dirección Física</label>
                <Input
                  value={venueAddress}
                  onChange={(e) => setVenueAddress(e.target.value)}
                  placeholder="ej. Av. San Martín #450, Barrio Equipetrol"
                  className="h-11 rounded-xl text-xs bg-background"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-foreground">WhatsApp para Pedidos & Copiloto *</label>
                  <Input
                    value={venueWhatsapp}
                    onChange={(e) => setVenueWhatsapp(e.target.value)}
                    placeholder="+591 78012345"
                    className="h-11 rounded-xl text-xs bg-background"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-foreground">Moneda Principal</label>
                  <select
                    value={venueCurrency}
                    onChange={(e) => setVenueCurrency(e.target.value)}
                    className="w-full h-11 px-3 rounded-xl border border-input bg-background text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-ring"
                  >
                    <option value="Bs.">Bs. — Bolivianos (BOB)</option>
                    <option value="USD $">USD $ — Dólares Americanos</option>
                    <option value="R$">R$ — Reais Brasileiros (BRL)</option>
                    <option value="€">€ — Euros (EUR)</option>
                  </select>
                </div>
              </div>

              {/* Color & Theme */}
              <div className="pt-2 border-t border-border/60 flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <label className="text-xs font-bold">Color de Marca:</label>
                  <div className="flex items-center gap-2">
                    {["#D97706", "#EF4444", "#10B981", "#3B82F6", "#8B5CF6"].map((color) => (
                      <button
                        key={color}
                        type="button"
                        onClick={() => setVenuePrimaryColor(color)}
                        className={`w-7 h-7 rounded-full transition-transform ${
                          venuePrimaryColor === color ? 'scale-125 ring-2 ring-foreground ring-offset-2' : ''
                        }`}
                        style={{ backgroundColor: color }}
                      />
                    ))}
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setVenueTheme('dark')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold border transition-all ${
                      venueTheme === 'dark' ? 'bg-primary text-primary-foreground border-primary' : 'bg-background text-muted-foreground'
                    }`}
                  >
                    Modo Oscuro 🌙
                  </button>
                  <button
                    type="button"
                    onClick={() => setVenueTheme('light')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold border transition-all ${
                      venueTheme === 'light' ? 'bg-primary text-primary-foreground border-primary' : 'bg-background text-muted-foreground'
                    }`}
                  >
                    Modo Claro ☀️
                  </button>
                </div>
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <Button
                onClick={() => setStep(2)}
                className="bg-gradient-to-r from-amber-500 to-red-600 hover:from-amber-600 hover:to-red-700 text-white font-bold text-xs h-12 px-6 rounded-xl shadow-md"
              >
                <span>Siguiente: Cargar Menú con IA</span>
                <ArrowRight className="w-4 h-4 ml-1.5" />
              </Button>
            </div>
          </div>
        )}

        {/* STEP 2: AI MENU DIGITIZER & PRESETS */}
        {step === 2 && (
          <div className="space-y-6 animate-in fade-in duration-300">
            <div className="space-y-1 text-center sm:text-left">
              <span className="inline-flex items-center gap-1.5 text-xs font-extrabold uppercase bg-amber-500/10 text-amber-500 px-3 py-1 rounded-full">
                <UtensilsCrossed className="w-3.5 h-3.5" />
                Paso 2: Menú Digital & Digitalizador IA
              </span>
              <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
                Estructura tu carta en segundos
              </h1>
              <p className="text-xs sm:text-sm text-muted-foreground">
                Elige una plantilla lista o deja que nuestro motor de IA extraiga tus platos automáticamente.
              </p>
            </div>

            {/* Presets Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {Object.entries(MENU_PRESETS).map(([key, preset]) => (
                <button
                  key={key}
                  type="button"
                  onClick={() => handleSelectPreset(key)}
                  className={`p-4 rounded-2xl border text-left transition-all ${
                    selectedPresetKey === key
                      ? 'bg-amber-500/10 border-amber-500 shadow-md ring-1 ring-amber-500'
                      : 'bg-card border-border hover:border-amber-500/40'
                  }`}
                >
                  <span className="text-2xl block mb-1">{preset.icon}</span>
                  <p className="text-xs font-black text-foreground">{preset.label}</p>
                  <p className="text-[10px] text-muted-foreground mt-0.5">{preset.categories.length} categorías listas</p>
                </button>
              ))}
            </div>

            {/* AI Text Import Accordion */}
            <div className="p-5 rounded-3xl bg-card border border-border space-y-3 shadow-sm">
              <div className="flex items-center gap-2 text-xs font-black text-foreground">
                <Sparkles className="w-4 h-4 text-amber-500" />
                <span>O importa pegando el texto de tu menú:</span>
              </div>
              <Textarea
                value={rawMenuText}
                onChange={(e) => setRawMenuText(e.target.value)}
                placeholder="Pega aquí la lista de tus platos con precios, ej:
Salchipapa Mixta 38 Bs
Burger BBQ con Tocino 45 Bs
Chopp Helado Artesanal 22 Bs"
                rows={3}
                className="text-xs rounded-xl bg-background"
              />
              <Button
                type="button"
                onClick={handleParseMenuText}
                disabled={isAiParsing}
                variant="outline"
                className="w-full text-xs font-bold border-amber-500/30 hover:border-amber-500 h-10 rounded-xl"
              >
                {isAiParsing ? 'Analizando con IA...' : '✨ Procesar Texto con IA'}
              </Button>
            </div>

            {/* Current Loaded Menu Summary */}
            <div className="p-4 rounded-2xl bg-muted/20 border border-border space-y-2">
              <div className="flex items-center justify-between text-xs font-bold">
                <span className="text-foreground">Platos en tu menú actual:</span>
                <span className="text-amber-500 font-black">
                  {customCategories.flatMap(c => c.items).length} platos configurados
                </span>
              </div>
              <div className="divide-y divide-border/60 max-h-40 overflow-y-auto">
                {customCategories.flatMap(c => c.items).map((item) => (
                  <div key={item.id} className="py-2 flex items-center justify-between text-xs">
                    <div>
                      <p className="font-bold text-foreground">{item.name}</p>
                      <p className="text-[10px] text-muted-foreground">{item.description}</p>
                    </div>
                    <span className="font-black text-amber-500">{venueCurrency} {item.price}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex justify-between pt-2">
              <Button
                variant="outline"
                onClick={() => setStep(1)}
                className="text-xs h-12 px-6 rounded-xl"
              >
                <ArrowLeft className="w-4 h-4 mr-1.5" />
                <span>Atrás</span>
              </Button>

              <Button
                onClick={() => setStep(3)}
                className="bg-gradient-to-r from-amber-500 to-red-600 hover:from-amber-600 hover:to-red-700 text-white font-bold text-xs h-12 px-6 rounded-xl shadow-md"
              >
                <span>Siguiente: Mesas & Códigos QR</span>
                <ArrowRight className="w-4 h-4 ml-1.5" />
              </Button>
            </div>
          </div>
        )}

        {/* STEP 3: TABLES & GOOGLE REVIEW HUNTER */}
        {step === 3 && (
          <div className="space-y-6 animate-in fade-in duration-300">
            <div className="space-y-1 text-center sm:text-left">
              <span className="inline-flex items-center gap-1.5 text-xs font-extrabold uppercase bg-amber-500/10 text-amber-500 px-3 py-1 rounded-full">
                <QrCode className="w-3.5 h-3.5" />
                Paso 3: Mesas, QR & Reseñas Google
              </span>
              <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
                Genera los códigos QR de tus mesas
              </h1>
              <p className="text-xs sm:text-sm text-muted-foreground">
                Cada mesa tendrá un enlace único que solicita pedidos y captura reseñas 5 estrellas de Google.
              </p>
            </div>

            <div className="p-6 rounded-3xl bg-card border border-border space-y-5 shadow-sm">
              <div className="space-y-2">
                <div className="flex justify-between text-xs font-bold">
                  <label>Número de Mesas en Sala / Terraza:</label>
                  <span className="text-amber-500 font-black">{tableCount} Mesas</span>
                </div>
                <input
                  type="range"
                  min="2"
                  max="40"
                  value={tableCount}
                  onChange={(e) => setTableCount(Number(e.target.value))}
                  className="w-full accent-amber-500 h-2 bg-border rounded-lg cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-muted-foreground">
                  <span>2 Mesas</span>
                  <span>20 Mesas</span>
                  <span>40 Mesas</span>
                </div>
              </div>

              {/* Google Review URL */}
              <div className="space-y-1.5 pt-2 border-t border-border/60">
                <div className="flex items-center gap-1.5 text-xs font-bold text-blue-500">
                  <Star className="w-3.5 h-3.5 fill-blue-500" />
                  <span>Enlace de Reseñas de Google Maps (Google My Business)</span>
                </div>
                <Input
                  value={googleReviewUrl}
                  onChange={(e) => setGoogleReviewUrl(e.target.value)}
                  placeholder="https://g.page/r/.../review o enlace de Google Maps"
                  className="h-11 rounded-xl text-xs bg-background"
                />
                <p className="text-[10px] text-muted-foreground">
                  Los comensales que califiquen con 5 estrellas serán redirigidos automáticamente a este enlace para publicar su opinión.
                </p>
              </div>

              {/* QR Preview Card */}
              <div className="p-4 rounded-2xl bg-gradient-to-r from-amber-500/10 via-orange-500/5 to-transparent border border-amber-500/30 flex items-center justify-between">
                <div className="space-y-1">
                  <span className="text-[10px] font-black uppercase text-amber-500">Vista Previa Código QR</span>
                  <h4 className="text-xs font-black text-foreground">Mesa #1 • Zona Principal</h4>
                  <p className="text-[10px] text-muted-foreground">Incluye menú digital, comanda express y detector de satisfacción.</p>
                </div>
                <div className="w-16 h-16 rounded-xl bg-white p-1.5 shadow-md flex items-center justify-center">
                  <QrCode className="w-12 h-12 text-black" />
                </div>
              </div>
            </div>

            <div className="flex justify-between pt-2">
              <Button
                variant="outline"
                onClick={() => setStep(2)}
                className="text-xs h-12 px-6 rounded-xl"
              >
                <ArrowLeft className="w-4 h-4 mr-1.5" />
                <span>Atrás</span>
              </Button>

              <Button
                onClick={() => setStep(4)}
                className="bg-gradient-to-r from-amber-500 to-red-600 hover:from-amber-600 hover:to-red-700 text-white font-bold text-xs h-12 px-6 rounded-xl shadow-md"
              >
                <span>Siguiente: Copiloto WhatsApp</span>
                <ArrowRight className="w-4 h-4 ml-1.5" />
              </Button>
            </div>
          </div>
        )}

        {/* STEP 4: WHATSAPP COPILOT SETUP */}
        {step === 4 && (
          <div className="space-y-6 animate-in fade-in duration-300">
            <div className="space-y-1 text-center sm:text-left">
              <span className="inline-flex items-center gap-1.5 text-xs font-extrabold uppercase bg-emerald-500/10 text-emerald-500 px-3 py-1 rounded-full">
                <Bot className="w-3.5 h-3.5" />
                Paso 4: Copiloto de IA por WhatsApp
              </span>
              <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
                Conecta tu asistente de voz y chat
              </h1>
              <p className="text-xs sm:text-sm text-muted-foreground">
                Actualiza precios, pausa platos y consulta ventas diarias enviando un mensaje o audio desde tu propio celular.
              </p>
            </div>

            <div className="p-6 rounded-3xl bg-card border border-border space-y-4 shadow-sm">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-foreground">Tu Número de WhatsApp Autorizado</label>
                <Input
                  value={copilotPhone}
                  onChange={(e) => setCopilotPhone(e.target.value)}
                  placeholder="+591 78012345"
                  className="h-11 rounded-xl text-xs bg-background"
                />
              </div>

              {/* Interactive Test Console */}
              <div className="p-4 rounded-2xl bg-[#0b141a] text-white space-y-3">
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                    <span className="font-bold text-emerald-400">Prueba tu Copiloto en Vivo</span>
                  </div>
                  <span className="text-[10px] text-white/60">Simulador</span>
                </div>

                <form onSubmit={handleTestCopilot} className="flex gap-2">
                  <Input
                    value={copilotTestMsg}
                    onChange={(e) => setCopilotTestMsg(e.target.value)}
                    placeholder="ej. Sube la cerveza a 25 Bs"
                    className="h-9 text-xs bg-[#2a3942] border-none text-white placeholder:text-white/40"
                  />
                  <Button
                    type="submit"
                    size="sm"
                    className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs h-9 px-3 rounded-lg"
                  >
                    Enviar
                  </Button>
                </form>

                {copilotTestResponse && (
                  <div className="p-3 rounded-xl bg-[#202c33] text-xs text-emerald-300 font-medium border border-white/5 animate-in fade-in">
                    {copilotTestResponse}
                  </div>
                )}
              </div>
            </div>

            <div className="flex justify-between pt-2">
              <Button
                variant="outline"
                onClick={() => setStep(3)}
                className="text-xs h-12 px-6 rounded-xl"
              >
                <ArrowLeft className="w-4 h-4 mr-1.5" />
                <span>Atrás</span>
              </Button>

              <Button
                onClick={handleFinishOnboarding}
                className="bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-black text-xs h-12 px-8 rounded-xl shadow-lg"
              >
                <span>🚀 Activar Plataforma & Lanzar Menú</span>
                <Check className="w-4 h-4 ml-1.5" />
              </Button>
            </div>
          </div>
        )}

        {/* STEP 5: SUCCESS & LAUNCH READY */}
        {step === 5 && (
          <div className="space-y-8 text-center py-6 animate-in zoom-in-95 duration-300">
            <div className="w-16 h-16 rounded-3xl bg-gradient-to-tr from-amber-500 to-emerald-500 text-white flex items-center justify-center mx-auto text-3xl shadow-xl shadow-amber-500/25">
              🎉
            </div>

            <div className="space-y-2 max-w-lg mx-auto">
              <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-foreground">
                ¡{venueName} está 100% listo!
              </h1>
              <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                Tu menú digital inteligente, códigos QR de mesas y copiloto de IA ya están activos para recibir órdenes sin comisiones.
              </p>
            </div>

            {/* Summary Checklist Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-2xl mx-auto text-left">
              <div className="p-4 rounded-2xl bg-card border border-border space-y-1">
                <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                <p className="text-xs font-black text-foreground">Menú con IA</p>
                <p className="text-[10px] text-muted-foreground">{customCategories.flatMap(c => c.items).length} platos optimizados con Hotness</p>
              </div>

              <div className="p-4 rounded-2xl bg-card border border-border space-y-1">
                <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                <p className="text-xs font-black text-foreground">{tableCount} Mesas QR</p>
                <p className="text-[10px] text-muted-foreground">Listas para imprimir con Cazador Google</p>
              </div>

              <div className="p-4 rounded-2xl bg-card border border-border space-y-1">
                <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                <p className="text-xs font-black text-foreground">Copiloto WhatsApp</p>
                <p className="text-[10px] text-muted-foreground">Conectado para recibir órdenes y cambios</p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
              <Button
                size="lg"
                onClick={() => navigate('/menu')}
                className="w-full sm:w-auto bg-gradient-to-r from-amber-500 to-red-600 hover:from-amber-600 hover:to-red-700 text-white font-black text-sm px-8 py-6 rounded-2xl shadow-xl shadow-amber-500/25"
              >
                <UtensilsCrossed className="w-4 h-4 mr-2" />
                <span>Ver Menú Digital del Cliente (/menu)</span>
              </Button>

              <Button
                size="lg"
                variant="outline"
                onClick={() => navigate('/admin')}
                className="w-full sm:w-auto font-bold text-sm px-8 py-6 rounded-2xl border-2 border-border hover:border-amber-500"
              >
                <Bot className="w-4 h-4 mr-2 text-amber-500" />
                <span>Ir al Panel de Administración (/admin)</span>
              </Button>
            </div>
          </div>
        )}

      </main>
    </div>
  );
};

export default Onboarding;
