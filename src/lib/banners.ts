import { useState, useEffect, useCallback } from "react";

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

export const imageMap: Record<string, string> = {
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

export function getImageUrl(imagePath?: string) {
  if (!imagePath) return "/placeholder.svg";
  const filename = imagePath.split("/").pop() || "";
  return imageMap[filename] || imagePath;
}

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

export const DEFAULT_BANNERS: PromoBanner[] = [
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

export const STORAGE_KEY = "pontal_live_banners";
const EVENT_KEY = "pontal_banners_updated";

export function getStoredBanners(): PromoBanner[] {
  if (typeof window === "undefined") return DEFAULT_BANNERS;
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch (e) {
    console.error("Error reading banners from storage", e);
  }
  return DEFAULT_BANNERS;
}

export function saveStoredBanners(banners: PromoBanner[]): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(banners));
    window.dispatchEvent(new CustomEvent(EVENT_KEY, { detail: banners }));
  } catch (e) {
    console.error("Error saving banners to storage", e);
  }
}

export function resetStoredBanners(): PromoBanner[] {
  if (typeof window !== "undefined") {
    try {
      localStorage.removeItem(STORAGE_KEY);
      window.dispatchEvent(new CustomEvent(EVENT_KEY, { detail: DEFAULT_BANNERS }));
    } catch (e) {
      console.error("Error resetting banners", e);
    }
  }
  return DEFAULT_BANNERS;
}

export function useBanners() {
  const [banners, setBanners] = useState<PromoBanner[]>(() => getStoredBanners());

  useEffect(() => {
    const handleUpdate = (e: CustomEvent<PromoBanner[]>) => {
      if (e.detail) {
        setBanners(e.detail);
      } else {
        setBanners(getStoredBanners());
      }
    };

    const handleStorage = (e: StorageEvent) => {
      if (e.key === STORAGE_KEY) {
        setBanners(getStoredBanners());
      }
    };

    window.addEventListener(EVENT_KEY as any, handleUpdate);
    window.addEventListener("storage", handleStorage);

    return () => {
      window.removeEventListener(EVENT_KEY as any, handleUpdate);
      window.removeEventListener("storage", handleStorage);
    };
  }, []);

  const saveBanners = useCallback((newBanners: PromoBanner[]) => {
    setBanners(newBanners);
    saveStoredBanners(newBanners);
  }, []);

  const updateBanner = useCallback((updated: PromoBanner) => {
    setBanners((prev) => {
      const next = prev.map((b) => (b.id === updated.id ? updated : b));
      saveStoredBanners(next);
      return next;
    });
  }, []);

  const addBanner = useCallback((banner: PromoBanner) => {
    setBanners((prev) => {
      const next = [...prev, banner];
      saveStoredBanners(next);
      return next;
    });
  }, []);

  const deleteBanner = useCallback((id: string) => {
    setBanners((prev) => {
      const next = prev.filter((b) => b.id !== id);
      saveStoredBanners(next);
      return next;
    });
  }, []);

  const resetBanners = useCallback(() => {
    const defaults = resetStoredBanners();
    setBanners(defaults);
  }, []);

  const activeBanners = banners.filter((b) => b.isActive);

  return {
    banners,
    activeBanners,
    saveBanners,
    updateBanner,
    addBanner,
    deleteBanner,
    resetBanners,
  };
}

export const PRESET_BANNER_IMAGES = [
  { label: "Camarão Carapitangui (Destaque)", value: shrimpcarapitanguiImg },
  { label: "Blue Lagoon Drink (Experiência)", value: blueLagoonImg },
  { label: "Dadinhos de Tapioca (Petiscos)", value: tapiocacubesImg },
  { label: "Misto de Frutos do Mar", value: seafoodmixImg },
  { label: "Salmão Tropical", value: tropicalsalmonImg },
  { label: "Ceviche de Peixe Branco", value: cevicheImg },
  { label: "Casquinha de Siri", value: crabshellsImg },
  { label: "Caipirinha Pontal", value: caiprinhaImg },
  { label: "Gin Love Drink", value: ginloveImg },
  { label: "Mojito Tradicional", value: mojitoImg },
  { label: "Filet ao Molho Gorgonzola", value: filetgorgonzolaImg },
  { label: "Petisco de Filé Mignon", value: filetmignonappImg },
  { label: "Iscas de Peixe Crocantes", value: fishstripsImg },
  { label: "Batata Pontal Carapitangui", value: friescarapitanguiImg },
  { label: "Cocada Fornada Especial", value: cocadaImg },
  { label: "Açaí da Praia", value: acaiImg },
  { label: "Cerveja Heineken Gelada", value: heinekenImg },
];
