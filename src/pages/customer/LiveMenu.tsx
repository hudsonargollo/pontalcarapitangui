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
  Edit3,
  Save,
  RotateCcw,
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

// Image imports
import acaiImg from "@/assets/menu/acai.jpg";
import blueLagoonImg from "@/assets/menu/blue-lagoon.jpg";
import brigaderoImg from "@/assets/menu/brigadeiro.jpg";
import caiprinhaImg from "@/assets/menu/caipirinha.jpg";
import caipitaoImg from "@/assets/menu/caipitao.jpg";
import carnesolImg from "@/assets/menu/carne-sol.jpg";
import cassavafriesImg from "@/assets/menu/cassava-fries.jpg";
import cevicheImg from "@/assets/menu/ceviche.jpg";
import chefchoiceImg from "@/assets/menu/chef-choice.jpg";
import chickenparmeImg from "@/assets/menu/chicken-parmesan.jpg";
import cocadaImg from "@/assets/menu/cocada.jpg";
import codcakesImg from "@/assets/menu/cod-cakes.jpg";
import crabshellsImg from "@/assets/menu/crab-shells.jpg";
import crispyshrimpImg from "@/assets/menu/crispy-shrimp.jpg";
import filetgorgonzolaImg from "@/assets/menu/filet-gorgonzola.jpg";
import filetmignonappImg from "@/assets/menu/filet-mignon-appetizer.jpg";
import fishstripsImg from "@/assets/menu/fish-strips.jpg";
import friescarapitanguiImg from "@/assets/menu/fries-carapitangui.jpg";
import friesImg from "@/assets/menu/fries.jpg";
import frozensoftImg from "@/assets/menu/frozen-soft.jpg";
import ginloveImg from "@/assets/menu/gin-love.jpg";
import grilledfishImg from "@/assets/menu/grilled-fish.jpg";
import heinekenImg from "@/assets/menu/heineken.jpg";
import juiceImg from "@/assets/menu/juice.jpg";
import kidsbeefImg from "@/assets/menu/kids-beef.jpg";
import kidsfishImg from "@/assets/menu/kids-fish.jpg";
import laeleImg from "@/assets/menu/la-ele.jpg";
import mojitoImg from "@/assets/menu/mojito.jpg";
import neptunetideImg from "@/assets/menu/neptune-tide.jpg";
import octopusvinaigreImg from "@/assets/menu/octopus-vinaigrette.jpg";
import originalImg from "@/assets/menu/original.jpg";
import oxemateImg from "@/assets/menu/oxe-mate.jpg";
import popsicleImg from "@/assets/menu/popsicle.jpg";
import seafoodmixImg from "@/assets/menu/seafood-mix.jpg";
import shrimpcarapitanguiImg from "@/assets/menu/shrimp-carapitangui.jpg";
import squiddoreeImg from "@/assets/menu/squid-doree.jpg";
import tadalasourImg from "@/assets/menu/tadala-sour.jpg";
import tapiocacubesImg from "@/assets/menu/tapioca-cubes.jpg";
import tropicalsalmonImg from "@/assets/menu/tropical-salmon.jpg";
import waterImg from "@/assets/menu/water.jpg";

const imageMap: Record<string, string> = {
  "acai.jpg": acaiImg,
  "blue-lagoon.jpg": blueLagoonImg,
  "brigadeiro.jpg": brigaderoImg,
  "caipirinha.jpg": caiprinhaImg,
  "caipitao.jpg": caipitaoImg,
  "carne-sol.jpg": carnesolImg,
  "cassava-fries.jpg": cassavafriesImg,
  "ceviche.jpg": cevicheImg,
  "chef-choice.jpg": chefchoiceImg,
  "chicken-parmesan.jpg": chickenparmeImg,
  "cocada.jpg": cocadaImg,
  "cod-cakes.jpg": codcakesImg,
  "crab-shells.jpg": crabshellsImg,
  "crispy-shrimp.jpg": crispyshrimpImg,
  "filet-gorgonzola.jpg": filetgorgonzolaImg,
  "filet-mignon-appetizer.jpg": filetmignonappImg,
  "fish-strips.jpg": fishstripsImg,
  "fries-carapitangui.jpg": friescarapitanguiImg,
  "fries.jpg": friesImg,
  "frozen-soft.jpg": frozensoftImg,
  "gin-love.jpg": ginloveImg,
  "grilled-fish.jpg": grilledfishImg,
  "heineken.jpg": heinekenImg,
  "juice.jpg": juiceImg,
  "kids-beef.jpg": kidsbeefImg,
  "kids-fish.jpg": kidsfishImg,
  "la-ele.jpg": laeleImg,
  "mojito.jpg": mojitoImg,
  "neptune-tide.jpg": neptunetideImg,
  "octopus-vinaigrette.jpg": octopusvinaigreImg,
  "original.jpg": originalImg,
  "oxe-mate.jpg": oxemateImg,
  "popsicle.jpg": popsicleImg,
  "seafood-mix.jpg": seafoodmixImg,
  "shrimp-carapitangui.jpg": shrimpcarapitanguiImg,
  "squid-doree.jpg": squiddoreeImg,
  "tadala-sour.jpg": tadalasourImg,
  "tapioca-cubes.jpg": tapiocacubesImg,
  "tropical-salmon.jpg": tropicalsalmonImg,
  "water.jpg": waterImg,
};

function getImageUrl(imagePath?: string) {
  if (!imagePath) return "/placeholder.svg";
  const filename = imagePath.split("/").pop() || "";
  return imageMap[filename] || imagePath;
}

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

// Banner Type & Defaults
export interface PromoBanner {
  id: string;
  badge: { pt: string; en: string };
  title: { pt: string; en: string };
  subtitle: { pt: string; en: string };
  location: { pt: string; en: string };
  image: string;
  categoryTarget?: string;
  isActive: boolean;
}

const DEFAULT_BANNERS: PromoBanner[] = [
  {
    id: "banner-1",
    badge: { pt: "Destaque do Chef", en: "Chef's Special" },
    title: {
      pt: "Frutos do Mar Frescos & Sunset",
      en: "Fresh Seafood & Sunset Vibes",
    },
    subtitle: {
      pt: "Camarões gratinados, peixes frescos e o visual inesquecível do Rio Carapitangui.",
      en: "Gratinéed shrimp, fresh catch, and stunning views by Rio Carapitangui.",
    },
    location: { pt: "Barra Grande • Bahia", en: "Barra Grande • Bahia" },
    image: shrimpcarapitanguiImg,
    categoryTarget: "especial",
    isActive: true,
  },
  {
    id: "banner-2",
    badge: { pt: "Mixologia Autoral", en: "Signature Mixology" },
    title: {
      pt: "Drinks Pontal Experiência",
      en: "Pontal Signature Drinks",
    },
    subtitle: {
      pt: "Cocktails exclusivos preparados com ingredientes tropicais e alta mixologia.",
      en: "Exclusive cocktails crafted with fresh tropical notes and premium spirits.",
    },
    location: { pt: "Bar da Praia & Lounge", en: "Beach Bar & Lounge" },
    image: blueLagoonImg,
    categoryTarget: "drinks-experiencia",
    isActive: true,
  },
  {
    id: "banner-3",
    badge: { pt: "Para Compartilhar", en: "To Share" },
    title: {
      pt: "Dadinhos de Tapioca & Petiscos",
      en: "Tapioca Cubes & Beach Bites",
    },
    subtitle: {
      pt: "Porções crocantes perfeitas para curtir com uma cerveja artesanal ou drink gelado.",
      en: "Crispy appetizers made for sharing with cold beer or fresh cocktails.",
    },
    location: { pt: "Quiosque & Bangalôs", en: "Kiosk & Bungalows" },
    image: tapiocacubesImg,
    categoryTarget: "petiscos",
    isActive: true,
  },
  {
    id: "banner-4",
    badge: { pt: "Especial da Casa", en: "House Special" },
    title: {
      pt: "Misto do Mar para 2 Pessoas",
      en: "Seafood Mix for Two",
    },
    subtitle: {
      pt: "Polvo, camarão, lula e peixe branco com arroz aromático e legumes salteados.",
      en: "Octopus, shrimp, squid and white fish served with savory rice and sautéed veggies.",
    },
    location: { pt: "Almoço & Jantar", en: "Lunch & Dinner" },
    image: seafoodmixImg,
    categoryTarget: "especial",
    isActive: true,
  },
];

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

  // Banners State & Carousel
  const [banners, setBanners] = useState<PromoBanner[]>(() => {
    const saved = localStorage.getItem("pontal_live_banners");
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error("Error parsing saved banners", e);
      }
    }
    return DEFAULT_BANNERS;
  });
  const [currentBannerIndex, setCurrentBannerIndex] = useState(0);
  const [isBannerAdminOpen, setIsBannerAdminOpen] = useState(false);
  const [editingBanner, setEditingBanner] = useState<PromoBanner | null>(null);

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

  // Auto-rotate active banner carousel
  const activeBanners = useMemo(() => banners.filter((b) => b.isActive), [banners]);

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

  // Banner Admin Handlers
  const handleSaveBanner = (updated: PromoBanner) => {
    const newBanners = banners.map((b) => (b.id === updated.id ? updated : b));
    setBanners(newBanners);
    localStorage.setItem("pontal_live_banners", JSON.stringify(newBanners));
    setEditingBanner(null);
    toast.success(lang === "pt" ? "Banner atualizado com sucesso!" : "Banner updated successfully!");
  };

  const handleResetBanners = () => {
    setBanners(DEFAULT_BANNERS);
    localStorage.removeItem("pontal_live_banners");
    setIsBannerAdminOpen(false);
    toast.info(lang === "pt" ? "Banners restaurados para o padrão." : "Banners reset to default.");
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
        <div className="max-w-5xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between gap-3">
            {/* Logo Image replacing text name */}
            <button
              onClick={() => navigate("/")}
              className="flex items-center gap-2 text-left group transition-transform active:scale-95"
              aria-label="Pontal Carapitangui — Início"
            >
              <img
                src="/logo-pontal.webp"
                alt="PONTAL Carapitangui"
                className="h-9 sm:h-11 w-auto object-contain drop-shadow-xs"
              />
            </button>

            {/* Top Actions (Language & Call Waiter - Table Selector Hidden) */}
            <div className="flex items-center gap-2">
              {/* Language Pill Switcher */}
              <div className="flex items-center bg-[#F2EEE4] p-0.5 rounded-full border border-[#D9D2C2]">
                <button
                  onClick={() => setLang("pt")}
                  className={`px-2 py-1 text-[11px] font-bold rounded-full transition-all ${
                    lang === "pt"
                      ? "bg-[#BC6C25] text-white shadow-xs"
                      : "text-[#1A2B2A]/60 hover:text-[#1A2B2A]"
                  }`}
                >
                  PT
                </button>
                <button
                  onClick={() => setLang("en")}
                  className={`px-2 py-1 text-[11px] font-bold rounded-full transition-all ${
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
                className="p-2 rounded-full bg-[#1A2B2A] hover:bg-[#2A3B3A] text-white transition-colors shadow-xs active:scale-90"
              >
                <BellRing className="w-4 h-4 text-amber-300" />
              </button>
            </div>
          </div>

          {/* Search Bar Input */}
          <div className="mt-2.5 relative">
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
                className="w-full pl-10 pr-9 py-2.5 rounded-2xl bg-[#F8F6F0] border border-[#E0D8C8] focus:border-[#BC6C25] focus:bg-white focus:outline-hidden text-sm text-[#1A2B2A] placeholder:text-[#A8A294] transition-all shadow-inner"
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

        {/* ================= CONTAINED CATEGORY BAR WITH HAMBURGER MENU ================= */}
        <div className="border-t border-[#EDE7DB] bg-[#FFFFFF]">
          <div className="max-w-5xl mx-auto px-4 py-2.5 flex items-center gap-2">
            {/* Category Hamburger Menu Button */}
            <button
              id="btn-categories-drawer"
              onClick={() => setIsCategoryDrawerOpen(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#1A2B2A] text-white hover:bg-[#2A3B3A] text-xs font-bold uppercase tracking-wider transition-colors shrink-0 shadow-xs active:scale-95"
              title={lang === "pt" ? "Ver todas as categorias" : "View all categories"}
            >
              <MenuIcon className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">{lang === "pt" ? "Categorias" : "Categories"}</span>
            </button>

            {/* Horizontal Scrollable Tabs */}
            <div
              ref={tabsContainerRef}
              className="overflow-x-auto no-scrollbar flex items-center gap-2 flex-1"
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

                {/* Micro Pagination Dots (Cleanly positioned away from text) */}
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

                {/* Admin Banner Trigger */}
                <button
                  onClick={() => setIsBannerAdminOpen(true)}
                  className="inline-flex items-center gap-1 text-[11px] text-white/70 hover:text-white bg-black/40 hover:bg-black/60 px-2.5 py-1 rounded-lg backdrop-blur-xs transition-colors"
                >
                  <Edit3 className="w-3 h-3 text-amber-300" />
                  <span className="hidden xs:inline">Admin</span>
                </button>
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

                      {/* Right: Dish Image + Quick Action Button */}
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

                        {/* Quick Add Button (+) */}
                        <button
                          onClick={(e) => handleQuickAdd(e, item)}
                          title={lang === "pt" ? "Adicionar rápido" : "Quick Add"}
                          className="absolute bottom-1.5 right-1.5 p-2 rounded-xl bg-[#BC6C25] hover:bg-[#9E571C] text-white shadow-md active:scale-90 transition-transform"
                        >
                          <Plus className="w-4 h-4 font-bold" />
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
        <DialogContent className="max-w-md p-0 overflow-hidden rounded-3xl bg-white border border-[#E5DFD3] shadow-2xl">
          {selectedItem && (
            <div>
              {/* Modal Image Hero */}
              <div className="relative aspect-4/3 w-full bg-[#1A2B2A] overflow-hidden">
                <img
                  src={getImageUrl(selectedItem.image)}
                  alt={selectedItem.name[lang]}
                  className="w-full h-full object-cover"
                />
                <button
                  onClick={() => setSelectedItem(null)}
                  className="absolute top-3 left-3 p-2 rounded-full bg-black/50 hover:bg-black/75 text-white backdrop-blur-md transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
                <div className="absolute bottom-3 right-3 px-3 py-1.5 rounded-full bg-[#BC6C25] text-white font-display font-black text-sm shadow-md">
                  {selectedItem.price}
                </div>
              </div>

              {/* Modal Body */}
              <div className="p-5 space-y-4 max-h-[60vh] overflow-y-auto">
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
                  <h2 className="font-display font-bold text-xl text-[#1A2B2A]">
                    {selectedItem.name[lang]}
                  </h2>
                  {selectedItem.description && (
                    <p className="text-sm text-[#7A7568] mt-1.5 leading-relaxed">
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

                {/* Stepper Quantity + Add Button */}
                <div className="pt-3 border-t border-[#EDE7DB] flex items-center gap-3">
                  {/* Quantity Stepper */}
                  <div className="flex items-center border border-[#D9D2C2] rounded-2xl bg-[#F8F6F0] p-1">
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
                    className="flex-1 py-6 bg-[#BC6C25] hover:bg-[#9E571C] text-white font-display font-bold text-sm uppercase tracking-wider rounded-2xl shadow-lg transition-all"
                  >
                    <span>
                      {lang === "pt" ? "Adicionar à Comanda" : "Add to Order"} • R${" "}
                      {(selectedItem.unitPriceNum * itemQuantity).toFixed(2).replace(".", ",")}
                    </span>
                  </Button>
                </div>
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

      {/* ================= ADMIN BANNER MANAGEMENT MODAL ================= */}
      <Dialog open={isBannerAdminOpen} onOpenChange={setIsBannerAdminOpen}>
        <DialogContent className="max-w-lg rounded-3xl bg-white border border-[#E5DFD3] p-5 shadow-2xl max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="font-display font-bold text-lg text-[#1A2B2A] flex items-center justify-between">
              <span className="flex items-center gap-2">
                <Edit3 className="w-5 h-5 text-[#BC6C25]" />
                {lang === "pt" ? "Gerenciar Banners do Cardápio" : "Manage Menu Banners"}
              </span>
              <button
                onClick={handleResetBanners}
                title={lang === "pt" ? "Restaurar padrão" : "Reset default"}
                className="text-xs text-[#A8A294] hover:text-rose-600 flex items-center gap-1"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                {lang === "pt" ? "Padrão" : "Reset"}
              </button>
            </DialogTitle>
            <DialogDescription className="text-xs text-[#7A7568]">
              {lang === "pt"
                ? "Ative, desative ou edite os textos e fotos dos destaques principais."
                : "Enable, disable or customize highlight banners and photos."}
            </DialogDescription>
          </DialogHeader>

          {editingBanner ? (
            /* Editing single banner form */
            <div className="space-y-3.5 py-2">
              <div className="p-3 bg-[#FAF8F3] rounded-2xl border border-[#EDE7DB] space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-[#1A2B2A]">
                    {lang === "pt" ? "Editar Banner" : "Edit Banner"}
                  </span>
                  <label className="flex items-center gap-1.5 text-xs cursor-pointer font-medium">
                    <input
                      type="checkbox"
                      checked={editingBanner.isActive}
                      onChange={(e) =>
                        setEditingBanner({ ...editingBanner, isActive: e.target.checked })
                      }
                      className="rounded text-[#BC6C25]"
                    />
                    {lang === "pt" ? "Ativo no Carrossel" : "Active"}
                  </label>
                </div>

                <div>
                  <label className="text-[11px] font-bold text-[#1A2B2A]">
                    {lang === "pt" ? "Título (PT)" : "Title (PT)"}
                  </label>
                  <Input
                    value={editingBanner.title.pt}
                    onChange={(e) =>
                      setEditingBanner({
                        ...editingBanner,
                        title: { ...editingBanner.title, pt: e.target.value },
                      })
                    }
                    className="text-xs rounded-xl bg-white border-[#E0D8C8]"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-bold text-[#1A2B2A]">
                    {lang === "pt" ? "Subtítulo / Descrição (PT)" : "Subtitle (PT)"}
                  </label>
                  <Textarea
                    value={editingBanner.subtitle.pt}
                    onChange={(e) =>
                      setEditingBanner({
                        ...editingBanner,
                        subtitle: { ...editingBanner.subtitle, pt: e.target.value },
                      })
                    }
                    rows={2}
                    className="text-xs rounded-xl bg-white border-[#E0D8C8]"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-[11px] font-bold text-[#1A2B2A]">Badge / Tag (PT)</label>
                    <Input
                      value={editingBanner.badge.pt}
                      onChange={(e) =>
                        setEditingBanner({
                          ...editingBanner,
                          badge: { ...editingBanner.badge, pt: e.target.value },
                        })
                      }
                      className="text-xs rounded-xl bg-white border-[#E0D8C8]"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-bold text-[#1A2B2A]">
                      {lang === "pt" ? "Categoria Alvo" : "Category Target"}
                    </label>
                    <select
                      value={editingBanner.categoryTarget || ""}
                      onChange={(e) =>
                        setEditingBanner({
                          ...editingBanner,
                          categoryTarget: e.target.value,
                        })
                      }
                      className="w-full text-xs rounded-xl bg-white border border-[#E0D8C8] p-2"
                    >
                      <option value="">Nenhuma</option>
                      {menu.map((cat) => (
                        <option key={cat.key} value={cat.key}>
                          {cat.name.pt}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              <div className="flex gap-2">
                <Button
                  variant="outline"
                  onClick={() => setEditingBanner(null)}
                  className="flex-1 rounded-xl text-xs"
                >
                  {lang === "pt" ? "Cancelar" : "Cancel"}
                </Button>
                <Button
                  onClick={() => handleSaveBanner(editingBanner)}
                  className="flex-1 bg-[#BC6C25] hover:bg-[#9E571C] text-white rounded-xl text-xs font-bold"
                >
                  <Save className="w-3.5 h-3.5 mr-1" />
                  {lang === "pt" ? "Salvar Alterações" : "Save Changes"}
                </Button>
              </div>
            </div>
          ) : (
            /* Banner list */
            <div className="space-y-3 py-2">
              {banners.map((banner, index) => (
                <div
                  key={banner.id}
                  className="p-3 bg-[#FAF8F3] rounded-2xl border border-[#EDE7DB] flex items-center justify-between gap-3"
                >
                  <div className="flex items-center gap-3">
                    <img
                      src={getImageUrl(banner.image)}
                      alt={banner.title.pt}
                      className="w-14 h-14 rounded-xl object-cover border border-[#D9D2C2]"
                    />
                    <div>
                      <div className="flex items-center gap-1.5">
                        <Badge
                          variant={banner.isActive ? "default" : "secondary"}
                          className={`text-[9px] px-1.5 py-0 ${
                            banner.isActive ? "bg-emerald-600 text-white" : "bg-gray-300 text-gray-700"
                          }`}
                        >
                          {banner.isActive ? "Ativo" : "Inativo"}
                        </Badge>
                        <span className="text-[10px] text-[#A8A294] font-medium">
                          #{index + 1} • {banner.badge.pt}
                        </span>
                      </div>
                      <h4 className="font-display font-bold text-xs text-[#1A2B2A] mt-0.5 line-clamp-1">
                        {banner.title.pt}
                      </h4>
                      <p className="text-[11px] text-[#7A7568] line-clamp-1">
                        {banner.subtitle.pt}
                      </p>
                    </div>
                  </div>

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setEditingBanner(banner)}
                    className="rounded-xl text-xs font-bold border-[#D9D2C2] hover:bg-white"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                  </Button>
                </div>
              ))}

              <Button
                onClick={() => setIsBannerAdminOpen(false)}
                className="w-full bg-[#1A2B2A] hover:bg-[#2A3B3A] text-white rounded-xl text-xs font-bold"
              >
                {lang === "pt" ? "Concluir" : "Done"}
              </Button>
            </div>
          )}
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
