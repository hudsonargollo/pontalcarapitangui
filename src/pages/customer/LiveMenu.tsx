import { useState, useEffect, useMemo, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  X,
  ShoppingBag,
  Plus,
  Minus,
  Heart,
  ChevronRight,
  ChevronLeft,
  Sparkles,
  UtensilsCrossed,
  BellRing,
  Check,
  Menu as MenuIcon,
  LayoutGrid,
} from "lucide-react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useCart } from "@/lib/cartContext";
import { useLang } from "@/i18n/LanguageProvider";
import { menu, pick, MenuItem as BaseMenuItem } from "@/data/menu";
import { getCurrentTableId, setCurrentTableId, formatTableDisplay } from "@/lib/tableContext";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { useBanners, getImageUrl, PromoBanner } from "@/lib/banners";

// Category icons map
const categoryIcons: Record<string, string> = {
  frios: "🧊",
  petiscos: "🍤",
  especial: "👑",
  kids: "🧒",
  sobremesas: "🥥",
  "drinks-autorais": "🍸",
  "drinks-classicos": "🍹",
  "drinks-experiencia": "🌊",
  "ice-drinks": "❄️",
  cervejas: "🍺",
  "sem-alcool": "🥤",
};

interface LiveItem extends BaseMenuItem {
  categoryKey: string;
  categoryName: { pt: string; en: string };
  isFeatured?: boolean;
  tags?: Array<"destaque" | "veggie" | "sem-gluten" | "sem-lactose" | "picante">;
  serves?: string;
  unitPriceNum: number;
}

export default function LiveMenu() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { lang, setLang } = useLang();
  const { state: cartState, addItem, removeItem, updateQuantity, getTotalPrice, getTotalItems } = useCart();

  // Table State
  const [tableNumber, setTableNumber] = useState<string>(() => {
    const fromUrl = searchParams.get("mesa") || searchParams.get("table");
    if (fromUrl) {
      setCurrentTableId(fromUrl);
      return fromUrl;
    }
    return getCurrentTableId() || "12";
  });

  // Search & Active Filter States
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState<string>("all");
  const [activeCategory, setActiveCategory] = useState<string>(menu[0]?.key || "frios");

  // Category Drawer State (Hamburger Menu)
  const [isCategoryDrawerOpen, setIsCategoryDrawerOpen] = useState(false);

  // Banners Hook & Carousel State
  const { banners, activeBanners } = useBanners();
  const [currentBannerIndex, setCurrentBannerIndex] = useState(0);

  // Modal / Detail States
  const [selectedItem, setSelectedItem] = useState<LiveItem | null>(null);
  const [itemQuantity, setItemQuantity] = useState(1);
  const [itemNotes, setItemNotes] = useState("");
  const [favorites, setFavorites] = useState<Record<string, boolean>>({});

  // Comanda Sheet & Waiter Modal States
  const [isComandaOpen, setIsComandaOpen] = useState(false);
  const [isWaiterModalOpen, setIsWaiterModalOpen] = useState(false);
  const [waiterReason, setWaiterReason] = useState("atendimento");
  const [waiterNotes, setWaiterNotes] = useState("");
  const [includeTip, setIncludeTip] = useState(true);

  // Scrollspy & Nav refs
  const categoryRefs = useRef<Record<string, HTMLElement | null>>({});
  const tabsContainerRef = useRef<HTMLDivElement | null>(null);
  const isProgrammaticScroll = useRef(false);

  useEffect(() => {
    document.title = "Cardápio Digital — Pontal Carapitangui";
  }, []);

  // Sync table if URL parameter changes
  useEffect(() => {
    const urlTable = searchParams.get("mesa") || searchParams.get("table");
    if (urlTable && urlTable !== tableNumber) {
      setTableNumber(urlTable);
      setCurrentTableId(urlTable);
    }
  }, [searchParams]);

  useEffect(() => {
    if (activeBanners.length <= 1) return;
    const timer = setInterval(() => {
      setCurrentBannerIndex((prev) => (prev + 1) % activeBanners.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [activeBanners.length]);

  // Flatten & enrich menu items
  const allEnrichedItems = useMemo<LiveItem[]>(() => {
    return menu.flatMap((cat) =>
      cat.items.map((item) => {
        const rawPrice = parseFloat(item.price.replace(/[^\d.]/g, "")) || 0;
        const itemNamePt = item.name.pt.toLowerCase();

        const tags: Array<"destaque" | "veggie" | "sem-gluten" | "sem-lactose" | "picante"> = [];
        let isFeatured = false;

        if (
          itemNamePt.includes("carapitangui") ||
          itemNamePt.includes("tapioca") ||
          itemNamePt.includes("misto do mar") ||
          itemNamePt.includes("caipitão") ||
          itemNamePt.includes("tadala") ||
          itemNamePt.includes("ceviche")
        ) {
          tags.push("destaque");
          isFeatured = true;
        }

        if (
          itemNamePt.includes("tapioca") ||
          itemNamePt.includes("aipim") ||
          itemNamePt.includes("batata") ||
          itemNamePt.includes("suco") ||
          itemNamePt.includes("açaí")
        ) {
          tags.push("veggie");
        }

        if (
          itemNamePt.includes("ceviche") ||
          itemNamePt.includes("polvo") ||
          itemNamePt.includes("grelhado") ||
          itemNamePt.includes("aipim") ||
          itemNamePt.includes("tapioca")
        ) {
          tags.push("sem-gluten");
        }

        if (
          itemNamePt.includes("ceviche") ||
          itemNamePt.includes("polvo") ||
          itemNamePt.includes("grelhado") ||
          itemNamePt.includes("aipim") ||
          itemNamePt.includes("isca de peixe")
        ) {
          tags.push("sem-lactose");
        }

        if (itemNamePt.includes("tadala") || itemNamePt.includes("biquinho") || itemNamePt.includes("ceviche")) {
          tags.push("picante");
        }

        return {
          ...item,
          categoryKey: cat.key,
          categoryName: cat.name,
          isFeatured,
          tags,
          unitPriceNum: rawPrice,
        };
      })
    );
  }, []);

  // Filter items by search & dietary chips
  const filteredCategories = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();

    return menu
      .map((cat) => {
        const items = cat.items
          .map((item) => {
            return allEnrichedItems.find(
              (i) => i.categoryKey === cat.key && i.name.pt === item.name.pt
            )!;
          })
          .filter((item) => {
            if (!item) return false;

            // Search filter
            if (q) {
              const nameMatch =
                item.name.pt.toLowerCase().includes(q) ||
                item.name.en.toLowerCase().includes(q);
              const descMatch =
                item.description &&
                (item.description.pt?.toLowerCase().includes(q) ||
                  item.description.en?.toLowerCase().includes(q));
              if (!nameMatch && !descMatch) return false;
            }

            // Tag filter
            if (activeFilter !== "all") {
              if (activeFilter === "destaque" && !item.isFeatured) return false;
              if (activeFilter === "veggie" && !item.tags?.includes("veggie")) return false;
              if (activeFilter === "sem-gluten" && !item.tags?.includes("sem-gluten")) return false;
              if (activeFilter === "sem-lactose" && !item.tags?.includes("sem-lactose")) return false;
              if (activeFilter === "picante" && !item.tags?.includes("picante")) return false;
            }

            return true;
          });

        return {
          ...cat,
          items,
        };
      })
      .filter((cat) => cat.items.length > 0);
  }, [allEnrichedItems, searchQuery, activeFilter]);

  // Robust Scrollspy observer using getBoundingClientRect
  useEffect(() => {
    const handleScroll = () => {
      if (isProgrammaticScroll.current) return;

      const triggerY = 220; // Trigger line below sticky header
      let currentActive = activeCategory;

      for (const cat of menu) {
        const el = categoryRefs.current[cat.key];
        if (el) {
          const rect = el.getBoundingClientRect();
          if (rect.top <= triggerY && rect.bottom > triggerY) {
            currentActive = cat.key;
            break;
          }
        }
      }

      if (currentActive !== activeCategory) {
        setActiveCategory(currentActive);
        // Center the active category tab smoothly
        const tabBtn = document.getElementById(`tab-btn-${currentActive}`);
        if (tabBtn && tabsContainerRef.current) {
          const container = tabsContainerRef.current;
          const scrollLeft =
            tabBtn.offsetLeft - container.offsetWidth / 2 + tabBtn.offsetWidth / 2;
          container.scrollTo({ left: scrollLeft, behavior: "smooth" });
        }
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [activeCategory]);

  // Fix: Click-to-scroll category handler with reliable document offset
  const scrollToCategory = (key: string) => {
    // If filtered out, reset search and tag filters so all categories appear
    if (searchQuery || activeFilter !== "all") {
      setSearchQuery("");
      setActiveFilter("all");
    }

    setActiveCategory(key);
    setIsCategoryDrawerOpen(false);
    isProgrammaticScroll.current = true;

    // Center tab button immediately
    const tabBtn = document.getElementById(`tab-btn-${key}`);
    if (tabBtn && tabsContainerRef.current) {
      const container = tabsContainerRef.current;
      const scrollLeft =
        tabBtn.offsetLeft - container.offsetWidth / 2 + tabBtn.offsetWidth / 2;
      container.scrollTo({ left: scrollLeft, behavior: "smooth" });
    }

    setTimeout(() => {
      const el = categoryRefs.current[key];
      if (el) {
        const rect = el.getBoundingClientRect();
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        const targetY = rect.top + scrollTop - 150; // Offset for sticky headers
        window.scrollTo({
          top: Math.max(0, targetY),
          behavior: "smooth",
        });
      }
      setTimeout(() => {
        isProgrammaticScroll.current = false;
      }, 700);
    }, 60);
  };

  const handleOpenDetail = (item: LiveItem) => {
    setSelectedItem(item);
    setItemQuantity(1);
    setItemNotes("");
  };

  const handleAddDetailToCart = () => {
    if (!selectedItem) return;
    const notesSuffix = itemNotes.trim() ? ` (Obs: ${itemNotes.trim()})` : "";
    const customId = `${selectedItem.categoryKey}-${selectedItem.name.pt}${notesSuffix}`;

    for (let i = 0; i < itemQuantity; i++) {
      addItem({
        id: customId,
        name: `${selectedItem.name[lang]}${notesSuffix}`,
        description: selectedItem.description ? pick(selectedItem.description, lang) : null,
        price: selectedItem.unitPriceNum,
        category_id: selectedItem.categoryKey,
        available: true,
      });
    }

    toast.success(
      lang === "pt"
        ? `${itemQuantity}x ${selectedItem.name.pt} adicionado à comanda!`
        : `${itemQuantity}x ${selectedItem.name.en} added to table order!`,
      {
        icon: <ShoppingBag className="w-4 h-4 text-[#BC6C25]" />,
      }
    );

    setSelectedItem(null);
  };

  const handleQuickAdd = (e: React.MouseEvent, item: LiveItem) => {
    e.stopPropagation();
    addItem({
      id: `${item.categoryKey}-${item.name.pt}`,
      name: item.name[lang],
      description: item.description ? pick(item.description, lang) : null,
      price: item.unitPriceNum,
      category_id: item.categoryKey,
      available: true,
    });
    toast.success(
      lang === "pt"
        ? `+1 ${item.name.pt} adicionado!`
        : `+1 ${item.name.en} added!`,
      { duration: 1500 }
    );
  };

  const toggleFavorite = (e: React.MouseEvent, itemName: string) => {
    e.stopPropagation();
    setFavorites((prev) => ({
      ...prev,
      [itemName]: !prev[itemName],
    }));
  };

  const totalItemsCount = getTotalItems();
  const subtotalPrice = getTotalPrice();
  const tipAmount = includeTip ? subtotalPrice * 0.1 : 0;
  const grandTotal = subtotalPrice + tipAmount;

  const handleCallWaiterSubmit = () => {
    const reasonsMap: Record<string, string> = {
      atendimento: "Chamar Garçom na Mesa",
      conta: "Pedir a Conta / Fechar Mesa",
      gelo: "Solicitar Gelo / Copos / Pratos",
      duvida: "Dúvida sobre o Cardápio",
    };

    const text = `🔔 *CHAMADA DE MESA - PONTAL CARAPITANGUI*\n📍 *${formatTableDisplay(
      tableNumber
    )}*\n📌 *Motivo:* ${reasonsMap[waiterReason] || waiterReason}${
      waiterNotes ? `\n📝 *Observação:* ${waiterNotes}` : ""
    }\n⏰ *Horário:* ${new Date().toLocaleTimeString("pt-BR", {
      hour: "2-digit",
      minute: "2-digit",
    })}`;

    const encoded = encodeURIComponent(text);
    window.open(`https://wa.me/5573999999999?text=${encoded}`, "_blank");

    toast.success(
      lang === "pt"
        ? `Garçom acionado para atendimento!`
        : `Waiter notified for assistance!`,
      { icon: <BellRing className="w-4 h-4 text-[#BC6C25]" /> }
    );
    setIsWaiterModalOpen(false);
    setWaiterNotes("");
  };

  const filterChips = [
    { id: "all", label: lang === "pt" ? "Todos os Itens" : "All Items", icon: null },
    { id: "destaque", label: lang === "pt" ? "Destaques" : "Best Sellers", icon: "⭐" },
    { id: "veggie", label: lang === "pt" ? "Vegetariano" : "Veggie", icon: "🌱" },
    { id: "sem-gluten", label: lang === "pt" ? "Sem Glúten" : "Gluten Free", icon: "🌾" },
    { id: "sem-lactose", label: lang === "pt" ? "Sem Lactose" : "Lactose Free", icon: "🥛" },
    { id: "picante", label: lang === "pt" ? "Picante" : "Spicy", icon: "🌶️" },
  ];

  const currentBanner = activeBanners[currentBannerIndex] || activeBanners[0];

  return (
    <div className="min-h-screen bg-[#F2EEE4] text-[#1A2B2A] pb-32 selection:bg-[#BC6C25] selection:text-white font-sans">
      {/* ================= STICKY TOP BRAND & ACTION BAR ================= */}
      <header className="sticky top-0 z-40 bg-[#FFFFFF]/95 backdrop-blur-md border-b border-[#E5DFD3] shadow-xs transition-all">
        {/* Main Header Container (Contained to max-w-5xl) */}
        <div className="max-w-5xl mx-auto px-4 py-2.5">
          <div className="flex items-center justify-between gap-2.5">
            {/* Left: Hamburger Menu Button + Logo */}
            <div className="flex items-center gap-2.5">
              {/* Category Hamburger Menu Button (Always available on sticky header) */}
              <button
                id="btn-header-categories"
                onClick={() => setIsCategoryDrawerOpen(true)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#1A2B2A] text-white hover:bg-[#2A3B3A] text-xs font-bold uppercase tracking-wider transition-colors shadow-xs active:scale-95 shrink-0"
                title={lang === "pt" ? "Ver todas as categorias" : "View all categories"}
              >
                <MenuIcon className="w-3.5 h-3.5" />
                <span className="text-[11px] font-bold">
                  {lang === "pt" ? "Categorias" : "Categories"}
                </span>
              </button>

              {/* Logo Image */}
              <button
                onClick={() => navigate("/")}
                className="flex items-center gap-2 text-left group transition-transform active:scale-95 shrink-0"
                aria-label="Pontal Carapitangui — Início"
              >
                <img
                  src="/logo-pontal.webp"
                  alt="PONTAL Carapitangui"
                  className="h-8 sm:h-10 w-auto object-contain drop-shadow-xs"
                />
              </button>
            </div>

            {/* Right: Language Pill & Call Waiter */}
            <div className="flex items-center gap-2 shrink-0">
              {/* Language Pill Switcher */}
              <div className="flex items-center h-8 bg-[#F2EEE4] p-0.5 rounded-full border border-[#D9D2C2]">
                <button
                  onClick={() => setLang("pt")}
                  className={`h-full px-2.5 flex items-center justify-center text-[11px] font-bold rounded-full transition-all ${
                    lang === "pt"
                      ? "bg-[#BC6C25] text-white shadow-xs"
                      : "text-[#1A2B2A]/60 hover:text-[#1A2B2A]"
                  }`}
                >
                  PT
                </button>
                <button
                  onClick={() => setLang("en")}
                  className={`h-full px-2.5 flex items-center justify-center text-[11px] font-bold rounded-full transition-all ${
                    lang === "en"
                      ? "bg-[#BC6C25] text-white shadow-xs"
                      : "text-[#1A2B2A]/60 hover:text-[#1A2B2A]"
                  }`}
                >
                  EN
                </button>
              </div>

              {/* Call Waiter Bell Button */}
              <button
                onClick={() => setIsWaiterModalOpen(true)}
                title={lang === "pt" ? "Chamar Garçom" : "Call Waiter"}
                className="h-8 w-8 flex items-center justify-center rounded-full bg-[#1A2B2A] hover:bg-[#2A3B3A] text-white transition-colors shadow-xs active:scale-90 shrink-0"
              >
                <BellRing className="w-4 h-4 text-amber-300" />
              </button>
            </div>
          </div>

          {/* Search Bar Input */}
          <div className="mt-2 relative">
            <div className="relative flex items-center">
              <Search className="absolute left-3.5 w-4 h-4 text-[#A8A294]" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={
                  lang === "pt"
                    ? "Buscar pratos, frutos do mar, drinks ou ingredientes..."
                    : "Search seafood, appetizers, drinks or ingredients..."
                }
                className="w-full pl-10 pr-9 py-2 rounded-2xl bg-[#F8F6F0] border border-[#E0D8C8] focus:border-[#BC6C25] focus:bg-white focus:outline-hidden text-xs sm:text-sm text-[#1A2B2A] placeholder:text-[#A8A294] transition-all shadow-inner"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-3 p-1 text-[#A8A294] hover:text-[#1A2B2A]"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        </div>

        {/* ================= CONTAINED HORIZONTAL CATEGORY TABS (SCROLLSPY) ================= */}
        <div className="border-t border-[#EDE7DB] bg-[#FFFFFF]">
          <div
            ref={tabsContainerRef}
            className="max-w-5xl mx-auto px-4 py-2 overflow-x-auto no-scrollbar flex items-center gap-2"
          >
            {menu.map((cat) => {
              const isActive = activeCategory === cat.key;
              return (
                <button
                  key={cat.key}
                  id={`tab-btn-${cat.key}`}
                  onClick={() => scrollToCategory(cat.key)}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider whitespace-nowrap transition-all duration-200 shrink-0 ${
                    isActive
                      ? "bg-[#BC6C25] text-white shadow-xs scale-102"
                      : "bg-[#F4F0E6] text-[#1A2B2A]/75 hover:bg-[#EBE5D8] hover:text-[#1A2B2A] border border-[#E0D8C8]"
                  }`}
                >
                  {pick(cat.name, lang)}
                </button>
              );
            })}
          </div>
        </div>

        {/* ================= CONTAINED DIETARY & HIGHLIGHT FILTER CHIPS ================= */}
        <div className="bg-[#FAF8F3] border-t border-[#F0EBE0]">
          <div className="max-w-5xl mx-auto px-4 py-2 overflow-x-auto no-scrollbar flex items-center gap-1.5">
            {filterChips.map((chip) => {
              const isSelected = activeFilter === chip.id;
              return (
                <button
                  key={chip.id}
                  onClick={() => setActiveFilter(chip.id)}
                  className={`flex items-center gap-1 px-3 py-1 rounded-xl text-[11px] font-semibold whitespace-nowrap transition-colors shrink-0 ${
                    isSelected
                      ? "bg-[#1A2B2A] text-white shadow-xs"
                      : "bg-white text-[#1A2B2A]/80 hover:bg-[#F2EEE4] border border-[#E2DCCE]"
                  }`}
                >
                  {chip.icon && <span>{chip.icon}</span>}
                  <span>{chip.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </header>

      {/* ================= MULTI-BANNER SPOTLIGHT CAROUSEL ================= */}
      {activeBanners.length > 0 && (
        <div className="max-w-5xl mx-auto px-4 pt-4">
          <div className="relative overflow-hidden rounded-3xl min-h-[160px] sm:min-h-[190px] shadow-lg border border-[#D9D2C2]/60 group">
            {/* Background Image with Dark Scrim Gradient */}
            <AnimatePresence mode="wait">
              <motion.div
                key={currentBanner.id}
                initial={{ opacity: 0, scale: 1.05 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.6 }}
                className="absolute inset-0 z-0"
              >
                <img
                  src={getImageUrl(currentBanner.image)}
                  alt={pick(currentBanner.title, lang)}
                  className="w-full h-full object-cover"
                />
                {/* Dual Scrim overlay for high typography legibility */}
                <div className="absolute inset-0 bg-gradient-to-r from-[#0F1716]/95 via-[#0F1716]/75 to-transparent sm:to-[#0F1716]/30" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0F1716]/90 via-transparent to-transparent" />
              </motion.div>
            </AnimatePresence>

            {/* Banner Content */}
            <div className="relative z-10 p-5 sm:p-6 text-white max-w-lg flex flex-col justify-between min-h-[160px] sm:min-h-[190px]">
              <div>
                <div className="flex items-center gap-2 mb-1.5">
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-[#BC6C25]/90 text-white text-[10px] font-bold uppercase tracking-wider backdrop-blur-xs border border-white/20">
                    <Sparkles className="w-3 h-3 text-amber-300" />
                    {pick(currentBanner.badge, lang)}
                  </span>
                  <span className="text-[11px] text-white/80 font-medium tracking-wide">
                    {pick(currentBanner.location, lang)}
                  </span>
                </div>

                <h1 className="font-display text-lg sm:text-2xl font-bold tracking-tight text-white line-clamp-2">
                  {pick(currentBanner.title, lang)}
                </h1>

                <p className="text-xs text-white/80 mt-1 line-clamp-2 leading-relaxed">
                  {pick(currentBanner.subtitle, lang)}
                </p>
              </div>

              {/* Bottom CTA / Action inside banner */}
              <div className="pt-3 flex items-center justify-between gap-2">
                {currentBanner.categoryTarget ? (
                  <button
                    onClick={() => scrollToCategory(currentBanner.categoryTarget!)}
                    className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-white/20 hover:bg-white/30 backdrop-blur-md text-white text-xs font-bold uppercase tracking-wider transition-colors border border-white/30"
                  >
                    <span>{lang === "pt" ? "Ver Pratos" : "Explore Dishes"}</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                ) : (
                  <div />
                )}

                {/* Micro Pagination Dots */}
                {activeBanners.length > 1 && (
                  <div className="flex items-center gap-1 bg-black/50 px-2 py-1 rounded-full backdrop-blur-xs">
                    {activeBanners.map((_, idx) => (
                      <button
                        key={idx}
                        onClick={() => setCurrentBannerIndex(idx)}
                        className={`h-1.5 rounded-full transition-all duration-300 ${
                          currentBannerIndex === idx ? "w-4 bg-[#BC6C25]" : "w-1.5 bg-white/50"
                        }`}
                      />
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Carousel Navigation Arrows */}
            {activeBanners.length > 1 && (
              <>
                <button
                  onClick={() =>
                    setCurrentBannerIndex(
                      (prev) => (prev - 1 + activeBanners.length) % activeBanners.length
                    )
                  }
                  className="absolute left-2 top-1/2 -translate-y-1/2 z-20 p-1.5 rounded-full bg-black/40 hover:bg-black/70 text-white opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button
                  onClick={() =>
                    setCurrentBannerIndex((prev) => (prev + 1) % activeBanners.length)
                  }
                  className="absolute right-2 top-1/2 -translate-y-1/2 z-20 p-1.5 rounded-full bg-black/40 hover:bg-black/70 text-white opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </>
            )}
          </div>
        </div>
      )}

      {/* ================= CATEGORIES HAMBURGER DRAWER DIALOG ================= */}
      <Dialog open={isCategoryDrawerOpen} onOpenChange={setIsCategoryDrawerOpen}>
        <DialogContent className="max-w-md rounded-3xl bg-white border border-[#E5DFD3] p-5 shadow-2xl max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="font-display font-bold text-lg text-[#1A2B2A] flex items-center justify-between">
              <span className="flex items-center gap-2">
                <LayoutGrid className="w-5 h-5 text-[#BC6C25]" />
                {lang === "pt" ? "Todas as Categorias" : "All Categories"}
              </span>
            </DialogTitle>
            <DialogDescription className="text-xs text-[#7A7568]">
              {lang === "pt"
                ? "Navegue rapidamente para qualquer seção do cardápio."
                : "Jump directly to any section of the menu."}
            </DialogDescription>
          </DialogHeader>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 py-3">
            {menu.map((cat) => {
              const isActive = activeCategory === cat.key;
              const icon = categoryIcons[cat.key] || "🍽️";

              return (
                <button
                  key={cat.key}
                  onClick={() => scrollToCategory(cat.key)}
                  className={`p-3 rounded-2xl border text-left transition-all flex items-center justify-between gap-3 ${
                    isActive
                      ? "bg-[#1A2B2A] text-white border-[#1A2B2A] shadow-sm"
                      : "bg-[#FAF8F3] hover:bg-[#F2EEE4] text-[#1A2B2A] border-[#E8E2D5]"
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <span className="text-xl">{icon}</span>
                    <div>
                      <div className="font-display font-bold text-xs uppercase tracking-wide">
                        {pick(cat.name, lang)}
                      </div>
                      <div
                        className={`text-[10px] ${
                          isActive ? "text-white/70" : "text-[#A8A294]"
                        }`}
                      >
                        {cat.items.length} {lang === "pt" ? "itens" : "items"}
                      </div>
                    </div>
                  </div>
                  <ChevronRight
                    className={`w-4 h-4 ${
                      isActive ? "text-amber-300" : "text-[#A8A294]"
                    }`}
                  />
                </button>
              );
            })}
          </div>
        </DialogContent>
      </Dialog>

      {/* ================= MAIN MENU SECTIONS & DISH CARDS ================= */}
      <main className="max-w-5xl mx-auto px-4 py-6 space-y-10">
        {filteredCategories.length === 0 ? (
          <div className="py-20 text-center bg-white rounded-3xl border border-[#E5DFD3] p-8 shadow-xs">
            <UtensilsCrossed className="w-12 h-12 text-[#A8A294] mx-auto mb-3" />
            <h3 className="font-display text-lg font-bold text-[#1A2B2A]">
              {lang === "pt" ? "Nenhum prato encontrado" : "No dishes found"}
            </h3>
            <p className="text-xs text-[#A8A294] max-w-sm mx-auto mt-1">
              {lang === "pt"
                ? "Tente buscar por outro termo ou limpe os filtros selecionados."
                : "Try searching for a different item or clear active filters."}
            </p>
            <Button
              onClick={() => {
                setSearchQuery("");
                setActiveFilter("all");
              }}
              className="mt-4 bg-[#BC6C25] hover:bg-[#9E571C] text-white rounded-xl text-xs font-bold uppercase tracking-wider"
            >
              {lang === "pt" ? "Limpar Filtros" : "Clear Filters"}
            </Button>
          </div>
        ) : (
          filteredCategories.map((category) => (
            <section
              key={category.key}
              id={`section-${category.key}`}
              ref={(el) => {
                categoryRefs.current[category.key] = el;
              }}
              className="scroll-mt-44 space-y-4"
            >
              {/* Category Header (LiveMenu Style) */}
              <div className="flex items-baseline justify-between border-b-2 border-[#1A2B2A]/10 pb-2">
                <div>
                  <h2 className="font-display text-xl font-bold uppercase tracking-tight text-[#1A2B2A] flex items-center gap-2">
                    <span>{categoryIcons[category.key] || "🍽️"}</span>
                    <span>{pick(category.name, lang)}</span>
                    <Badge variant="secondary" className="bg-[#EAE4D6] text-[#1A2B2A] font-bold text-xs">
                      {category.items.length}
                    </Badge>
                  </h2>
                </div>
              </div>

              {/* Items Grid (LiveMenu Responsive Layout) */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                {category.items.map((item) => {
                  const cartItem = cartState.items.find(
                    (ci) => ci.name.startsWith(item.name[lang])
                  );
                  const isFav = !!favorites[item.name.pt];

                  return (
                    <div
                      key={item.name.pt}
                      onClick={() => handleOpenDetail(item)}
                      className="group relative flex flex-row items-stretch justify-between bg-white rounded-2xl p-3.5 border border-[#E8E2D5] shadow-xs hover:shadow-md hover:border-[#BC6C25]/40 transition-all duration-200 cursor-pointer overflow-hidden active:scale-[0.99]"
                    >
                      {/* Left: Info, Badges, Price */}
                      <div className="flex-1 pr-3 flex flex-col justify-between">
                        <div>
                          {/* Dietary Badges */}
                          {item.tags && item.tags.length > 0 && (
                            <div className="flex flex-wrap items-center gap-1 mb-1.5">
                              {item.tags.map((t) => {
                                if (t === "destaque") {
                                  return (
                                    <span
                                      key={t}
                                      className="inline-flex items-center gap-0.5 px-2 py-0.5 rounded-md bg-amber-100 text-amber-900 text-[10px] font-bold uppercase tracking-wider"
                                    >
                                      ⭐ {lang === "pt" ? "Destaque" : "Special"}
                                    </span>
                                  );
                                }
                                if (t === "veggie") {
                                  return (
                                    <span
                                      key={t}
                                      className="inline-flex items-center gap-0.5 px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-900 text-[10px] font-bold"
                                    >
                                      🌱 Veggie
                                    </span>
                                  );
                                }
                                if (t === "sem-gluten") {
                                  return (
                                    <span
                                      key={t}
                                      className="inline-flex items-center gap-0.5 px-2 py-0.5 rounded-md bg-sky-100 text-sky-900 text-[10px] font-bold"
                                    >
                                      🌾 Sem Glúten
                                    </span>
                                  );
                                }
                                if (t === "picante") {
                                  return (
                                    <span
                                      key={t}
                                      className="inline-flex items-center gap-0.5 px-2 py-0.5 rounded-md bg-rose-100 text-rose-900 text-[10px] font-bold"
                                    >
                                      🌶️ Picante
                                    </span>
                                  );
                                }
                                return null;
                              })}
                            </div>
                          )}

                          {/* Dish Title */}
                          <h3 className="font-display font-bold text-base text-[#1A2B2A] leading-snug group-hover:text-[#BC6C25] transition-colors">
                            {item.name[lang]}
                          </h3>

                          {/* Description */}
                          {item.description && (
                            <p className="text-xs text-[#7A7568] mt-1 line-clamp-2 leading-relaxed">
                              {pick(item.description, lang)}
                            </p>
                          )}
                        </div>

                        {/* Price & Quantity in Cart */}
                        <div className="mt-3 flex items-center justify-between">
                          <div className="flex items-baseline gap-1.5">
                            <span className="font-display font-black text-base text-[#BC6C25]">
                              {item.price}
                            </span>
                          </div>

                          {cartItem && (
                            <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                              <Check className="w-3 h-3" />
                              {cartItem.quantity} na comanda
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Right: Dish Image (Click opens detail) */}
                      <div className="relative w-28 h-28 sm:w-32 sm:h-32 rounded-xl overflow-hidden bg-[#1A2B2A]/5 shrink-0">
                        <img
                          src={getImageUrl(item.image)}
                          alt={item.name[lang]}
                          loading="lazy"
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />

                        {/* Favorite button overlay */}
                        <button
                          onClick={(e) => toggleFavorite(e, item.name.pt)}
                          className="absolute top-1.5 right-1.5 p-1.5 rounded-full bg-black/40 hover:bg-black/60 backdrop-blur-xs text-white transition-colors"
                        >
                          <Heart
                            className={`w-3.5 h-3.5 ${
                              isFav ? "fill-rose-500 text-rose-500" : "text-white"
                            }`}
                          />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>
          ))
        )}
      </main>

      {/* ================= ITEM DETAIL DIALOG / MODAL (LIVEMENU STYLE) ================= */}
      <Dialog open={!!selectedItem} onOpenChange={(open) => !open && setSelectedItem(null)}>
        <DialogContent className="w-[94vw] sm:max-w-lg p-0 overflow-hidden rounded-3xl bg-white border border-[#E5DFD3] shadow-2xl max-h-[88vh] flex flex-col my-auto">
          {selectedItem && (
            <div className="flex flex-col h-full overflow-hidden">
              {/* Modal Image Hero */}
              <div className="relative aspect-16/10 sm:aspect-16/9 w-full bg-[#1A2B2A] overflow-hidden shrink-0">
                <img
                  src={getImageUrl(selectedItem.image)}
                  alt={selectedItem.name[lang]}
                  className="w-full h-full object-cover"
                />
                <button
                  onClick={() => setSelectedItem(null)}
                  className="absolute top-3 left-3 p-2 rounded-full bg-black/60 hover:bg-black/80 text-white backdrop-blur-md transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
                <div className="absolute bottom-3 right-3 px-3.5 py-1.5 rounded-full bg-[#BC6C25] text-white font-display font-black text-sm shadow-md">
                  {selectedItem.price}
                </div>
              </div>

              {/* Modal Body (Scrollable) */}
              <div className="p-4 sm:p-6 space-y-4 overflow-y-auto flex-1">
                <div>
                  {selectedItem.tags && selectedItem.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1 mb-2">
                      {selectedItem.tags.map((t) => (
                        <Badge
                          key={t}
                          variant="secondary"
                          className="bg-[#F2EEE4] text-[#1A2B2A] text-[10px] font-bold uppercase"
                        >
                          {t}
                        </Badge>
                      ))}
                    </div>
                  )}
                  <h2 className="font-display font-bold text-xl sm:text-2xl text-[#1A2B2A]">
                    {selectedItem.name[lang]}
                  </h2>
                  {selectedItem.description && (
                    <p className="text-xs sm:text-sm text-[#7A7568] mt-1.5 leading-relaxed">
                      {pick(selectedItem.description, lang)}
                    </p>
                  )}
                </div>

                {/* Custom Notes / Observations input */}
                <div className="space-y-1.5 pt-2 border-t border-[#EDE7DB]">
                  <label className="text-xs font-bold text-[#1A2B2A] uppercase tracking-wider flex items-center justify-between">
                    <span>{lang === "pt" ? "Observações do Pedido" : "Special Instructions"}</span>
                    <span className="text-[10px] font-normal text-[#A8A294]">
                      {lang === "pt" ? "Opcional" : "Optional"}
                    </span>
                  </label>
                  <Textarea
                    value={itemNotes}
                    onChange={(e) => setItemNotes(e.target.value)}
                    placeholder={
                      lang === "pt"
                        ? "Ex: Sem cebola, ponto da carne mal passado, molho à parte..."
                        : "E.g.: No onions, sauce on the side, well done..."
                    }
                    className="text-xs rounded-xl bg-[#F8F6F0] border-[#E0D8C8] focus:border-[#BC6C25] resize-none"
                    rows={2}
                  />
                </div>
              </div>

              {/* Modal Footer (Sticky Stepper + Add Button) */}
              <div className="p-4 bg-[#FAF8F3] border-t border-[#EDE7DB] flex items-center gap-3 shrink-0">
                {/* Quantity Stepper */}
                <div className="flex items-center border border-[#D9D2C2] rounded-2xl bg-[#FFFFFF] p-1 shadow-xs">
                  <button
                    onClick={() => setItemQuantity((q) => Math.max(1, q - 1))}
                    className="p-2 rounded-xl hover:bg-[#EAE4D6] text-[#1A2B2A] transition-colors"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="w-8 text-center font-display font-bold text-sm text-[#1A2B2A]">
                    {itemQuantity}
                  </span>
                  <button
                    onClick={() => setItemQuantity((q) => q + 1)}
                    className="p-2 rounded-xl hover:bg-[#EAE4D6] text-[#1A2B2A] transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>

                {/* Add to Comanda CTA */}
                <Button
                  onClick={handleAddDetailToCart}
                  className="flex-1 py-5 bg-[#BC6C25] hover:bg-[#9E571C] text-white font-display font-bold text-xs sm:text-sm uppercase tracking-wider rounded-2xl shadow-md transition-all"
                >
                  <span>
                    {lang === "pt" ? "Adicionar à Comanda" : "Add to Order"} • R${" "}
                    {(selectedItem.unitPriceNum * itemQuantity).toFixed(2).replace(".", ",")}
                  </span>
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* ================= PERSISTENT FLOATING COMANDA BAR (LIVEMENU STYLE) ================= */}
      <AnimatePresence>
        {totalItemsCount > 0 && (
          <motion.div
            initial={{ y: 80, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 80, opacity: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            className="fixed bottom-4 inset-x-0 z-40 px-4 pointer-events-none"
          >
            <div className="max-w-xl mx-auto pointer-events-auto bg-[#1A2B2A] text-white rounded-3xl p-3 shadow-2xl border border-white/10 flex items-center justify-between gap-3">
              {/* Cart Summary Icon */}
              <button
                onClick={() => setIsComandaOpen(true)}
                className="flex items-center gap-3 pl-2 text-left group"
              >
                <div className="relative p-2.5 bg-[#BC6C25] rounded-2xl text-white shadow-md group-hover:scale-105 transition-transform">
                  <ShoppingBag className="w-5 h-5" />
                  <span className="absolute -top-1.5 -right-1.5 px-2 py-0.5 bg-rose-600 text-white font-bold text-[10px] rounded-full border border-[#1A2B2A] shadow-xs">
                    {totalItemsCount}
                  </span>
                </div>
                <div>
                  <div className="text-[11px] font-medium text-white/70">
                    {totalItemsCount} {totalItemsCount === 1 ? "item" : "itens"}
                  </div>
                  <div className="font-display font-black text-lg text-white">
                    R$ {subtotalPrice.toFixed(2).replace(".", ",")}
                  </div>
                </div>
              </button>

              {/* View Comanda & Checkout Button */}
              <div className="flex items-center gap-2">
                <Button
                  onClick={() => setIsComandaOpen(true)}
                  className="bg-[#BC6C25] hover:bg-[#9E571C] text-white rounded-2xl px-5 py-5 font-display font-bold text-xs uppercase tracking-wider shadow-lg flex items-center gap-1.5"
                >
                  <span>{lang === "pt" ? "Ver Comanda" : "View Order"}</span>
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ================= COMANDA SLIDE-UP DRAWER / SHEET ================= */}
      <Dialog open={isComandaOpen} onOpenChange={setIsComandaOpen}>
        <DialogContent className="max-w-lg p-0 overflow-hidden rounded-3xl bg-white border border-[#E5DFD3] shadow-2xl">
          <div className="p-5 border-b border-[#EDE7DB] flex items-center justify-between bg-[#FAF8F3]">
            <div>
              <h3 className="font-display font-bold text-lg text-[#1A2B2A]">
                {lang === "pt" ? "Comanda de Pedidos" : "Table Order"}
              </h3>
              <p className="text-xs text-[#7A7568] mt-0.5">
                {lang === "pt"
                  ? "Revise seus pratos antes de confirmar o pedido."
                  : "Review your dishes before confirming order."}
              </p>
            </div>
            <button
              onClick={() => setIsComandaOpen(false)}
              className="p-2 rounded-full hover:bg-[#EAE4D6] text-[#1A2B2A] transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Cart Items List */}
          <div className="p-5 space-y-3.5 max-h-[50vh] overflow-y-auto divide-y divide-[#F0EBE0]">
            {cartState.items.map((item) => (
              <div key={item.id} className="pt-3.5 first:pt-0 flex items-center justify-between gap-3">
                <div className="flex-1">
                  <h4 className="font-display font-bold text-sm text-[#1A2B2A]">{item.name}</h4>
                  <p className="text-xs font-semibold text-[#BC6C25] mt-0.5">
                    R$ {item.price.toFixed(2).replace(".", ",")}
                  </p>
                </div>

                {/* Stepper */}
                <div className="flex items-center border border-[#D9D2C2] rounded-xl bg-[#F8F6F0] p-0.5">
                  <button
                    onClick={() => removeItem(item.id)}
                    className="p-1.5 rounded-lg hover:bg-[#EAE4D6] text-[#1A2B2A]"
                  >
                    <Minus className="w-3.5 h-3.5" />
                  </button>
                  <span className="w-6 text-center font-display font-bold text-xs text-[#1A2B2A]">
                    {item.quantity}
                  </span>
                  <button
                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                    className="p-1.5 rounded-lg hover:bg-[#EAE4D6] text-[#1A2B2A]"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Pricing Calculations & Tip Toggle */}
          <div className="p-5 border-t border-[#EDE7DB] bg-[#FAF8F3] space-y-3">
            <div className="flex items-center justify-between text-xs text-[#7A7568]">
              <span>{lang === "pt" ? "Subtotal dos Pratos" : "Dishes Subtotal"}</span>
              <span className="font-bold text-[#1A2B2A]">
                R$ {subtotalPrice.toFixed(2).replace(".", ",")}
              </span>
            </div>

            <div className="flex items-center justify-between text-xs text-[#7A7568]">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={includeTip}
                  onChange={(e) => setIncludeTip(e.target.checked)}
                  className="rounded text-[#BC6C25] focus:ring-[#BC6C25]"
                />
                <span>{lang === "pt" ? "Taxa de Serviço Opcional (10%)" : "Optional 10% Service Tip"}</span>
              </label>
              <span className="font-bold text-[#1A2B2A]">
                R$ {tipAmount.toFixed(2).replace(".", ",")}
              </span>
            </div>

            <div className="flex items-center justify-between text-base font-display font-black text-[#1A2B2A] pt-2 border-t border-[#E5DFD3]">
              <span>{lang === "pt" ? "Total da Comanda" : "Grand Total"}</span>
              <span className="text-[#BC6C25] text-lg">
                R$ {grandTotal.toFixed(2).replace(".", ",")}
              </span>
            </div>

            {/* Actions: Proceed to Checkout */}
            <div className="pt-2 flex flex-col sm:flex-row gap-2">
              <Button
                onClick={() => {
                  setIsComandaOpen(false);
                  navigate("/checkout");
                }}
                className="flex-1 py-5 bg-[#BC6C25] hover:bg-[#9E571C] text-white font-display font-bold text-xs uppercase tracking-wider rounded-2xl shadow-md"
              >
                {lang === "pt" ? "Concluir Pedido no Caixa / PIX" : "Proceed to Payment / PIX"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* ================= CALL WAITER / BILL MODAL ================= */}
      <Dialog open={isWaiterModalOpen} onOpenChange={setIsWaiterModalOpen}>
        <DialogContent className="max-w-sm rounded-3xl bg-white border border-[#E5DFD3] p-5 shadow-2xl">
          <DialogHeader>
            <DialogTitle className="font-display font-bold text-base text-[#1A2B2A] flex items-center gap-2">
              <BellRing className="w-5 h-5 text-[#BC6C25]" />
              <span>{lang === "pt" ? "Chamar Atendimento" : "Call Waiter"}</span>
            </DialogTitle>
            <DialogDescription className="text-xs text-[#7A7568]">
              {lang === "pt"
                ? `Notificar garçom para atendimento.`
                : `Notify waiter for assistance.`}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-3 py-2">
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setWaiterReason("atendimento")}
                className={`p-3 rounded-2xl text-xs font-bold border transition-all text-left ${
                  waiterReason === "atendimento"
                    ? "bg-[#1A2B2A] text-white border-[#1A2B2A]"
                    : "bg-[#F8F6F0] text-[#1A2B2A] border-[#E0D8C8] hover:bg-[#EAE4D6]"
                }`}
              >
                🛎️ {lang === "pt" ? "Garçom na Mesa" : "Call Waiter"}
              </button>

              <button
                type="button"
                onClick={() => setWaiterReason("conta")}
                className={`p-3 rounded-2xl text-xs font-bold border transition-all text-left ${
                  waiterReason === "conta"
                    ? "bg-[#1A2B2A] text-white border-[#1A2B2A]"
                    : "bg-[#F8F6F0] text-[#1A2B2A] border-[#E0D8C8] hover:bg-[#EAE4D6]"
                }`}
              >
                💳 {lang === "pt" ? "Pedir a Conta" : "Ask for Bill"}
              </button>

              <button
                type="button"
                onClick={() => setWaiterReason("gelo")}
                className={`p-3 rounded-2xl text-xs font-bold border transition-all text-left ${
                  waiterReason === "gelo"
                    ? "bg-[#1A2B2A] text-white border-[#1A2B2A]"
                    : "bg-[#F8F6F0] text-[#1A2B2A] border-[#E0D8C8] hover:bg-[#EAE4D6]"
                }`}
              >
                🧊 {lang === "pt" ? "Gelo e Copos" : "Ice & Glasses"}
              </button>

              <button
                type="button"
                onClick={() => setWaiterReason("duvida")}
                className={`p-3 rounded-2xl text-xs font-bold border transition-all text-left ${
                  waiterReason === "duvida"
                    ? "bg-[#1A2B2A] text-white border-[#1A2B2A]"
                    : "bg-[#F8F6F0] text-[#1A2B2A] border-[#E0D8C8] hover:bg-[#EAE4D6]"
                }`}
              >
                ❓ {lang === "pt" ? "Dúvida do Menu" : "Menu Question"}
              </button>
            </div>

            <div>
              <label className="text-[11px] font-bold text-[#1A2B2A] uppercase">
                {lang === "pt" ? "Mensagem Adicional (Opcional)" : "Additional Note (Optional)"}
              </label>
              <Textarea
                value={waiterNotes}
                onChange={(e) => setWaiterNotes(e.target.value)}
                placeholder={
                  lang === "pt"
                    ? "Ex: Trazer maquininha de cartão, talheres extras..."
                    : "E.g.: Bring card reader, extra silverware..."
                }
                rows={2}
                className="text-xs rounded-xl bg-[#F8F6F0] border-[#E0D8C8] mt-1"
              />
            </div>
          </div>

          <div className="flex gap-2 pt-2">
            <Button
              variant="outline"
              onClick={() => setIsWaiterModalOpen(false)}
              className="flex-1 rounded-xl text-xs"
            >
              {lang === "pt" ? "Voltar" : "Back"}
            </Button>
            <Button
              onClick={handleCallWaiterSubmit}
              className="flex-1 bg-[#BC6C25] hover:bg-[#9E571C] text-white rounded-xl text-xs font-bold"
            >
              {lang === "pt" ? "Chamar Agora" : "Call Now"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
