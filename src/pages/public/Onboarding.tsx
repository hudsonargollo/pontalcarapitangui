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
  Check, 
  Star, 
  Moon,
  Sun,
  Flame,
  Pizza,
  Wine,
  Utensils,
  Camera
} from 'lucide-react';
import { useMimenu } from '@/lib/mimenuContext';
import { MenuCategoryDetail, MenuItemDetail } from '@/types/mimenu';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { MenuPhotoIngesterModal } from '@/components/MenuPhotoIngesterModal';

// Sample presets for 1-click menu generation
const MENU_PRESETS: Record<string, { label: string; icon: React.ComponentType<{ className?: string }>; categories: MenuCategoryDetail[] }> = {
  burger_bar: {
    label: "Hamburguesas & Salchipapas",
    icon: Utensils,
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
    icon: Pizza,
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
    icon: Wine,
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
  const [isPhotoIngesterOpen, setIsPhotoIngesterOpen] = useState(false);

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

  // Menu Text Parser Simulation
  const handleParseMenuText = () => {
    if (!rawMenuText.trim()) {
      toast.error("Por favor pega el texto de tu menú o platos");
      return;
    }

    setIsAiParsing(true);
    setTimeout(() => {
      const lines = rawMenuText.split('\n').filter(l => l.trim().length > 0);
      const parsedItems: MenuItemDetail[] = lines.map((line, idx) => {
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
        name: "Carta Digital Importada",
        description: "Platos extraídos y estructurados",
        icon: "UtensilsCrossed",
        order_index: 1,
        items: parsedItems
      };

      setCustomCategories([newCategory]);
      setIsAiParsing(false);
      toast.success(`Se crearon ${parsedItems.length} platos estructurados.`);
    }, 800);
  };

  // Test WhatsApp Copilot
  const handleTestCopilot = (e: React.FormEvent) => {
    e.preventDefault();
    if (!copilotTestMsg.trim()) return;

    setCopilotTestResponse("Analizando instrucción...");
    setTimeout(() => {
      setCopilotTestResponse(
        `Copiloto IA: "¡Entendido! He actualizado el producto '${copilotTestMsg}' en tiempo real en tu menú digital. El cambio ya es visible para los clientes."`
      );
    }, 600);
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
          <Link to="/" className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-500">
              <Flame className="w-4 h-4 fill-amber-500" aria-hidden="true" />
            </div>
            <span className="font-bold text-base tracking-tight">MiMenu Setup</span>
          </Link>

          <div className="flex items-center gap-3 text-xs font-semibold text-muted-foreground">
            <span>Paso {step} de {totalSteps}</span>
            <div className="w-24 h-2 bg-muted rounded-full overflow-hidden">
              <div 
                className="h-full bg-amber-500 transition-all duration-300"
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
          <div className="space-y-6 animate-in fade-in duration-200">
            <div className="space-y-1 text-center sm:text-left">
              <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider bg-amber-500/10 text-amber-600 dark:text-amber-400 px-3 py-1 rounded-full border border-amber-500/20">
                <Building2 className="w-3.5 h-3.5" aria-hidden="true" />
                Paso 1: Identidad del Negocio
              </span>
              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
                Información de tu local o restaurante
              </h1>
              <p className="text-xs sm:text-sm text-muted-foreground">
                Configura los datos que verán tus comensales en el menú digital y códigos QR.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-card border border-border space-y-4 shadow-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-foreground">Nombre del Restaurante / Bar *</label>
                  <Input
                    value={venueName}
                    onChange={(e) => setVenueName(e.target.value)}
                    placeholder="ej. Moe's Taberna, Burger House"
                    className="h-10 rounded-lg text-xs bg-background"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-foreground">Ciudad *</label>
                  <Input
                    value={venueCity}
                    onChange={(e) => setVenueCity(e.target.value)}
                    placeholder="ej. Santa Cruz de la Sierra, La Paz"
                    className="h-10 rounded-lg text-xs bg-background"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground">Slogan o Tagline</label>
                <Input
                  value={venueTagline}
                  onChange={(e) => setVenueTagline(e.target.value)}
                  placeholder="ej. Las mejores salchipapas y chopp helado de la ciudad"
                  className="h-10 rounded-lg text-xs bg-background"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground">Dirección Física</label>
                <Input
                  value={venueAddress}
                  onChange={(e) => setVenueAddress(e.target.value)}
                  placeholder="ej. Av. San Martín #450, Barrio Equipetrol"
                  className="h-10 rounded-lg text-xs bg-background"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-foreground">WhatsApp para Pedidos *</label>
                  <Input
                    value={venueWhatsapp}
                    onChange={(e) => setVenueWhatsapp(e.target.value)}
                    placeholder="+591 78012345"
                    className="h-10 rounded-lg text-xs bg-background"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-foreground">Moneda Principal</label>
                  <select
                    value={venueCurrency}
                    onChange={(e) => setVenueCurrency(e.target.value)}
                    aria-label="Moneda Principal"
                    className="w-full h-10 px-3 rounded-lg border border-input bg-background text-xs font-medium focus:outline-hidden focus:ring-1 focus:ring-amber-500"
                  >
                    <option value="Bs.">Bs. — Bolivianos (BOB)</option>
                    <option value="USD $">USD $ — Dólares Americanos</option>
                    <option value="R$">R$ — Reais Brasileiros (BRL)</option>
                    <option value="€">€ — Euros (EUR)</option>
                  </select>
                </div>
              </div>

              {/* Color & Theme */}
              <div className="pt-3 border-t border-border flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <label className="text-xs font-semibold">Color de Marca:</label>
                  <div className="flex items-center gap-2">
                    {["#D97706", "#EF4444", "#10B981", "#3B82F6", "#8B5CF6"].map((color) => (
                      <button
                        key={color}
                        type="button"
                        onClick={() => setVenuePrimaryColor(color)}
                        aria-label={`Seleccionar color ${color}`}
                        className={`w-6 h-6 rounded-full transition-transform ${
                          venuePrimaryColor === color ? 'scale-115 ring-2 ring-foreground ring-offset-2' : ''
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
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold border flex items-center gap-1.5 transition-all ${
                      venueTheme === 'dark' ? 'bg-primary text-primary-foreground border-primary' : 'bg-background text-muted-foreground'
                    }`}
                  >
                    <Moon className="w-3.5 h-3.5" aria-hidden="true" />
                    <span>Modo Oscuro</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setVenueTheme('light')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold border flex items-center gap-1.5 transition-all ${
                      venueTheme === 'light' ? 'bg-primary text-primary-foreground border-primary' : 'bg-background text-muted-foreground'
                    }`}
                  >
                    <Sun className="w-3.5 h-3.5" aria-hidden="true" />
                    <span>Modo Claro</span>
                  </button>
                </div>
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <Button
                onClick={() => setStep(2)}
                className="bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs h-11 px-6 rounded-xl shadow-xs"
              >
                <span>Siguiente: Cargar Menú</span>
                <ArrowRight className="w-4 h-4 ml-1.5" aria-hidden="true" />
              </Button>
            </div>
          </div>
        )}

        {/* STEP 2: MENU DIGITIZER & PRESETS */}
        {step === 2 && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <div className="space-y-1 text-center sm:text-left">
              <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider bg-amber-500/10 text-amber-600 dark:text-amber-400 px-3 py-1 rounded-full border border-amber-500/20">
                <UtensilsCrossed className="w-3.5 h-3.5" aria-hidden="true" />
                Paso 2: Menú Digital
              </span>
              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
                Estructura tu carta en segundos
              </h1>
              <p className="text-xs sm:text-sm text-muted-foreground">
                Elige una plantilla base o importa tu lista de platos.
              </p>
            </div>

            {/* Photo Ingester Hero Option */}
            <div 
              onClick={() => setIsPhotoIngesterOpen(true)}
              className="p-5 rounded-2xl bg-gradient-to-r from-amber-500/15 via-primary/10 to-card border-2 border-amber-500/40 hover:border-amber-500 transition-all cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-sm group"
            >
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-amber-500 text-white flex items-center justify-center shrink-0 shadow-md shadow-amber-500/20 group-hover:scale-105 transition-transform">
                  <Camera className="w-6 h-6" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm font-bold text-foreground">Subir Foto o Escanear Carta con IA</h3>
                    <span className="text-[10px] bg-amber-500/20 text-amber-700 dark:text-amber-300 font-bold px-2 py-0.5 rounded-full">Recomendado</span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-0.5">Toma una foto de tu carta de papel y la IA extraerá todos los platos y precios automáticamente</p>
                </div>
              </div>
              <Button size="sm" className="bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs gap-1.5 shrink-0 pointer-events-none">
                <Camera className="w-3.5 h-3.5" />
                <span>Escanear Foto</span>
              </Button>
            </div>

            {/* Presets Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {Object.entries(MENU_PRESETS).map(([key, preset]) => {
                const Icon = preset.icon;
                return (
                  <button
                    key={key}
                    type="button"
                    onClick={() => handleSelectPreset(key)}
                    className={`p-4 rounded-xl border text-left transition-all ${
                      selectedPresetKey === key
                        ? 'bg-amber-500/10 border-amber-500 shadow-xs ring-1 ring-amber-500'
                        : 'bg-card border-border hover:border-slate-400'
                    }`}
                  >
                    <div className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center text-foreground mb-2">
                      <Icon className="w-4 h-4" aria-hidden="true" />
                    </div>
                    <p className="text-xs font-bold text-foreground">{preset.label}</p>
                    <p className="text-[10px] text-muted-foreground mt-0.5">{preset.categories.length} categorías listas</p>
                  </button>
                );
              })}
            </div>

            {/* AI Text Import */}
            <div className="p-5 rounded-2xl bg-card border border-border space-y-3 shadow-xs">
              <div className="flex items-center gap-2 text-xs font-bold text-foreground">
                <Sparkles className="w-4 h-4 text-amber-500" aria-hidden="true" />
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
                className="w-full text-xs font-semibold border-amber-500/30 hover:border-amber-500 h-9 rounded-lg"
              >
                <Sparkles className="w-3.5 h-3.5 mr-1.5 text-amber-500" aria-hidden="true" />
                {isAiParsing ? 'Estructurando platos...' : 'Estructurar Texto Automáticamente'}
              </Button>
            </div>

            {/* Current Loaded Menu Summary */}
            <div className="p-4 rounded-xl bg-muted/30 border border-border space-y-2">
              <div className="flex items-center justify-between text-xs font-semibold">
                <span className="text-foreground">Platos en tu menú actual:</span>
                <span className="text-amber-500 font-bold tabular-nums">
                  {customCategories.flatMap(c => c.items).length} platos configurados
                </span>
              </div>
              <div className="divide-y divide-border/60 max-h-40 overflow-y-auto">
                {customCategories.flatMap(c => c.items).map((item) => (
                  <div key={item.id} className="py-2 flex items-center justify-between text-xs">
                    <div>
                      <p className="font-semibold text-foreground">{item.name}</p>
                      <p className="text-[10px] text-muted-foreground">{item.description}</p>
                    </div>
                    <span className="font-bold text-amber-500 tabular-nums">{venueCurrency} {item.price}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex justify-between pt-2">
              <Button
                variant="outline"
                onClick={() => setStep(1)}
                className="text-xs h-11 px-6 rounded-xl"
              >
                <ArrowLeft className="w-4 h-4 mr-1.5" aria-hidden="true" />
                <span>Atrás</span>
              </Button>

              <Button
                onClick={() => setStep(3)}
                className="bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs h-11 px-6 rounded-xl shadow-xs"
              >
                <span>Siguiente: Mesas & QR</span>
                <ArrowRight className="w-4 h-4 ml-1.5" aria-hidden="true" />
              </Button>
            </div>
          </div>
        )}

        {/* STEP 3: TABLES & GOOGLE REVIEW HUNTER */}
        {step === 3 && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <div className="space-y-1 text-center sm:text-left">
              <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider bg-amber-500/10 text-amber-600 dark:text-amber-400 px-3 py-1 rounded-full border border-amber-500/20">
                <QrCode className="w-3.5 h-3.5" aria-hidden="true" />
                Paso 3: Mesas & Reseñas Google
              </span>
              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
                Genera los códigos QR de tus mesas
              </h1>
              <p className="text-xs sm:text-sm text-muted-foreground">
                Cada mesa tendrá un enlace único para pedidos y reseñas en Google Maps.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-card border border-border space-y-5 shadow-xs">
              <div className="space-y-2">
                <div className="flex justify-between text-xs font-semibold">
                  <label>Número de Mesas en Sala / Terraza:</label>
                  <span className="text-amber-500 font-bold tabular-nums">{tableCount} Mesas</span>
                </div>
                <input
                  type="range"
                  min="2"
                  max="40"
                  value={tableCount}
                  onChange={(e) => setTableCount(Number(e.target.value))}
                  aria-label="Número de Mesas"
                  className="w-full accent-amber-500 h-2 bg-muted rounded-lg cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-muted-foreground">
                  <span>2 Mesas</span>
                  <span>20 Mesas</span>
                  <span>40 Mesas</span>
                </div>
              </div>

              {/* Google Review URL */}
              <div className="space-y-1.5 pt-3 border-t border-border">
                <div className="flex items-center gap-1.5 text-xs font-semibold text-blue-600 dark:text-blue-400">
                  <Star className="w-3.5 h-3.5 fill-current" aria-hidden="true" />
                  <span>Enlace de Reseñas de Google Maps (Google My Business)</span>
                </div>
                <Input
                  value={googleReviewUrl}
                  onChange={(e) => setGoogleReviewUrl(e.target.value)}
                  placeholder="https://g.page/r/.../review o enlace de Google Maps"
                  className="h-10 rounded-lg text-xs bg-background"
                />
                <p className="text-[10px] text-muted-foreground leading-relaxed">
                  Los comensales satisfechos serán dirigidos a este enlace para publicar su calificación.
                </p>
              </div>

              {/* QR Preview Card */}
              <div className="p-4 rounded-xl bg-muted/40 border border-border flex items-center justify-between">
                <div className="space-y-1">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-amber-500">Vista Previa QR</span>
                  <h4 className="text-xs font-bold text-foreground">Mesa #1 • Sala Principal</h4>
                  <p className="text-[10px] text-muted-foreground">Incluye comanda express y captación de satisfacción.</p>
                </div>
                <div className="w-14 h-14 rounded-lg bg-white p-1.5 shadow-xs flex items-center justify-center">
                  <QrCode className="w-10 h-10 text-slate-900" aria-hidden="true" />
                </div>
              </div>
            </div>

            <div className="flex justify-between pt-2">
              <Button
                variant="outline"
                onClick={() => setStep(2)}
                className="text-xs h-11 px-6 rounded-xl"
              >
                <ArrowLeft className="w-4 h-4 mr-1.5" aria-hidden="true" />
                <span>Atrás</span>
              </Button>

              <Button
                onClick={() => setStep(4)}
                className="bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs h-11 px-6 rounded-xl shadow-xs"
              >
                <span>Siguiente: Copiloto WhatsApp</span>
                <ArrowRight className="w-4 h-4 ml-1.5" aria-hidden="true" />
              </Button>
            </div>
          </div>
        )}

        {/* STEP 4: WHATSAPP COPILOT SETUP */}
        {step === 4 && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <div className="space-y-1 text-center sm:text-left">
              <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 px-3 py-1 rounded-full border border-emerald-500/20">
                <Bot className="w-3.5 h-3.5" aria-hidden="true" />
                Paso 4: Copiloto por WhatsApp
              </span>
              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
                Conecta tu asistente de gestión
              </h1>
              <p className="text-xs sm:text-sm text-muted-foreground">
                Actualiza precios, pausa platos y consulta ventas desde tu celular.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-card border border-border space-y-4 shadow-xs">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground">Tu Número de WhatsApp Autorizado</label>
                <Input
                  value={copilotPhone}
                  onChange={(e) => setCopilotPhone(e.target.value)}
                  placeholder="+591 78012345"
                  className="h-10 rounded-lg text-xs bg-background"
                />
              </div>

              {/* Interactive Test Console */}
              <div className="p-4 rounded-xl bg-slate-900 text-white space-y-3 border border-slate-800">
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-400" aria-hidden="true" />
                    <span className="font-semibold text-emerald-400">Simulador de Copiloto</span>
                  </div>
                  <span className="text-[10px] text-slate-400">En línea</span>
                </div>

                <form onSubmit={handleTestCopilot} className="flex gap-2">
                  <Input
                    value={copilotTestMsg}
                    onChange={(e) => setCopilotTestMsg(e.target.value)}
                    placeholder="ej. Sube la cerveza a 25 Bs"
                    className="h-9 text-xs bg-slate-800 border-slate-700 text-white placeholder:text-slate-400"
                  />
                  <Button
                    type="submit"
                    size="sm"
                    className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs h-9 px-3 rounded-lg"
                  >
                    Enviar
                  </Button>
                </form>

                {copilotTestResponse && (
                  <div className="p-3 rounded-lg bg-slate-800/80 text-xs text-emerald-300 font-medium border border-slate-700 animate-in fade-in">
                    {copilotTestResponse}
                  </div>
                )}
              </div>
            </div>

            <div className="flex justify-between pt-2">
              <Button
                variant="outline"
                onClick={() => setStep(3)}
                className="text-xs h-11 px-6 rounded-xl"
              >
                <ArrowLeft className="w-4 h-4 mr-1.5" aria-hidden="true" />
                <span>Atrás</span>
              </Button>

              <Button
                onClick={handleFinishOnboarding}
                className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs h-11 px-8 rounded-xl shadow-xs"
              >
                <span>Activar & Publicar Menú</span>
                <Check className="w-4 h-4 ml-1.5" aria-hidden="true" />
              </Button>
            </div>
          </div>
        )}

        {/* STEP 5: SUCCESS & LAUNCH READY */}
        {step === 5 && (
          <div className="space-y-8 text-center py-6 animate-in fade-in duration-200">
            <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 text-emerald-500 border border-emerald-500/30 flex items-center justify-center mx-auto shadow-xs">
              <CheckCircle2 className="w-8 h-8" aria-hidden="true" />
            </div>

            <div className="space-y-2 max-w-lg mx-auto">
              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
                ¡{venueName} está configurado!
              </h1>
              <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                Tu menú digital, códigos QR de mesas y copiloto de gestión están listos para recibir pedidos.
              </p>
            </div>

            {/* Summary Checklist Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-2xl mx-auto text-left">
              <div className="p-4 rounded-xl bg-card border border-border space-y-1">
                <CheckCircle2 className="w-4 h-4 text-emerald-500" aria-hidden="true" />
                <p className="text-xs font-bold text-foreground">Menú Digital</p>
                <p className="text-[10px] text-muted-foreground">{customCategories.flatMap(c => c.items).length} platos con etiquetas de demanda</p>
              </div>

              <div className="p-4 rounded-xl bg-card border border-border space-y-1">
                <CheckCircle2 className="w-4 h-4 text-emerald-500" aria-hidden="true" />
                <p className="text-xs font-bold text-foreground">{tableCount} Mesas QR</p>
                <p className="text-[10px] text-muted-foreground">Listas para imprimir con captación de reseñas</p>
              </div>

              <div className="p-4 rounded-xl bg-card border border-border space-y-1">
                <CheckCircle2 className="w-4 h-4 text-emerald-500" aria-hidden="true" />
                <p className="text-xs font-bold text-foreground">Copiloto WhatsApp</p>
                <p className="text-[10px] text-muted-foreground">Vinculado para recibir órdenes y cambios</p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
              <Button
                size="lg"
                onClick={() => navigate('/menu')}
                className="w-full sm:w-auto bg-amber-500 hover:bg-amber-600 text-white font-bold text-sm px-8 py-5 rounded-xl shadow-xs"
              >
                <UtensilsCrossed className="w-4 h-4 mr-2" aria-hidden="true" />
                <span>Ver Menú Digital (/menu)</span>
              </Button>

              <Button
                size="lg"
                variant="outline"
                onClick={() => navigate('/admin')}
                className="w-full sm:w-auto font-bold text-sm px-8 py-5 rounded-xl border border-border hover:border-slate-400"
              >
                <Bot className="w-4 h-4 mr-2 text-amber-500" aria-hidden="true" />
                <span>Ir al Panel de Administración (/admin)</span>
              </Button>
            </div>
          </div>
        )}

      </main>

      {/* Menu Photo Ingester Modal */}
      <MenuPhotoIngesterModal
        open={isPhotoIngesterOpen}
        onOpenChange={setIsPhotoIngesterOpen}
      />
    </div>
  );
};

export default Onboarding;
