import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useLang } from "@/i18n/LanguageProvider";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { ChevronDown, ShoppingCart } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

// Import menu images
import octopusVinaigrette from "@/assets/menu/octopus-vinaigrette.jpg";
import ceviche from "@/assets/menu/ceviche.jpg";
import friesCarapitangui from "@/assets/menu/fries-carapitangui.jpg";
import tapiocaCubes from "@/assets/menu/tapioca-cubes.jpg";
import fishStrips from "@/assets/menu/fish-strips.jpg";
import squidDoree from "@/assets/menu/squid-doree.jpg";
import crispyShrimp from "@/assets/menu/crispy-shrimp.jpg";
import codCakes from "@/assets/menu/cod-cakes.jpg";
import crabShells from "@/assets/menu/crab-shells.jpg";
import carneSol from "@/assets/menu/carne-sol.jpg";
import filetMignonAppetizer from "@/assets/menu/filet-mignon-appetizer.jpg";
import cassavaFries from "@/assets/menu/cassava-fries.jpg";
import fries from "@/assets/menu/fries.jpg";
import shrimpCarapitangui from "@/assets/menu/shrimp-carapitangui.jpg";
import seafoodMix from "@/assets/menu/seafood-mix.jpg";
import grilledFish from "@/assets/menu/grilled-fish.jpg";
import tropicalSalmon from "@/assets/menu/tropical-salmon.jpg";
import filetGorgonzola from "@/assets/menu/filet-gorgonzola.jpg";
import chickenParmesan from "@/assets/menu/chicken-parmesan.jpg";
import kidsFish from "@/assets/menu/kids-fish.jpg";
import kidsBeef from "@/assets/menu/kids-beef.jpg";
import cocada from "@/assets/menu/cocada.jpg";
import acai from "@/assets/menu/acai.jpg";
import popsicle from "@/assets/menu/popsicle.jpg";
import brigadeiro from "@/assets/menu/brigadeiro.jpg";
import caipitao from "@/assets/menu/caipitao.jpg";
import oxeMate from "@/assets/menu/oxe-mate.jpg";
import chefChoice from "@/assets/menu/chef-choice.jpg";
import neptuneTide from "@/assets/menu/neptune-tide.jpg";
import laEle from "@/assets/menu/la-ele.jpg";
import tadalaSour from "@/assets/menu/tadala-sour.jpg";
import caipirinha from "@/assets/menu/caipirinha.jpg";
import mojito from "@/assets/menu/mojito.jpg";
import blueLagoon from "@/assets/menu/blue-lagoon.jpg";
import ginLove from "@/assets/menu/gin-love.jpg";
import frozenSoft from "@/assets/menu/frozen-soft.jpg";
import heineken from "@/assets/menu/heineken.jpg";
import original from "@/assets/menu/original.jpg";
import water from "@/assets/menu/water.jpg";
import juice from "@/assets/menu/juice.jpg";

interface MenuItem {
  id: string;
  name: string;
  description: string | null;
  price: number;
  category_id: string;
  available: boolean;
  image_url: string | null;
  sort_order: number;
}

interface Category {
  id: string;
  name: string;
  display_order: number;
}

// Map image URLs to imported images
const imageMap: Record<string, string> = {
  "octopus-vinaigrette.jpg": octopusVinaigrette,
  "ceviche.jpg": ceviche,
  "fries-carapitangui.jpg": friesCarapitangui,
  "tapioca-cubes.jpg": tapiocaCubes,
  "fish-strips.jpg": fishStrips,
  "squid-doree.jpg": squidDoree,
  "crispy-shrimp.jpg": crispyShrimp,
  "cod-cakes.jpg": codCakes,
  "crab-shells.jpg": crabShells,
  "carne-sol.jpg": carneSol,
  "filet-mignon-appetizer.jpg": filetMignonAppetizer,
  "cassava-fries.jpg": cassavaFries,
  "fries.jpg": fries,
  "shrimp-carapitangui.jpg": shrimpCarapitangui,
  "seafood-mix.jpg": seafoodMix,
  "grilled-fish.jpg": grilledFish,
  "tropical-salmon.jpg": tropicalSalmon,
  "filet-gorgonzola.jpg": filetGorgonzola,
  "chicken-parmesan.jpg": chickenParmesan,
  "kids-fish.jpg": kidsFish,
  "kids-beef.jpg": kidsBeef,
  "cocada.jpg": cocada,
  "acai.jpg": acai,
  "popsicle.jpg": popsicle,
  "brigadeiro.jpg": brigadeiro,
  "caipitao.jpg": caipitao,
  "oxe-mate.jpg": oxeMate,
  "chef-choice.jpg": chefChoice,
  "neptune-tide.jpg": neptuneTide,
  "la-ele.jpg": laEle,
  "tadala-sour.jpg": tadalaSour,
  "caipirinha.jpg": caipirinha,
  "mojito.jpg": mojito,
  "blue-lagoon.jpg": blueLagoon,
  "gin-love.jpg": ginLove,
  "frozen-soft.jpg": frozenSoft,
  "heineken.jpg": heineken,
  "original.jpg": original,
  "water.jpg": water,
  "juice.jpg": juice,
};

function MenuPage() {
  const { t } = useLang();
  const [expandedCategory, setExpandedCategory] = useState<string | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    document.title = "Cardápio — PONTAL Carapitangui";
    loadMenu();
  }, []);

  // Set first category as expanded when data loads
  useEffect(() => {
    if (categories.length > 0 && expandedCategory === null) {
      setExpandedCategory(categories[0].id);
    }
  }, [categories, expandedCategory]);

  const loadMenu = async () => {
    try {
      setLoading(true);
      
      const { data: categoriesData, error: catError } = await supabase
        .from("menu_categories")
        .select("*")
        .order("display_order");

      if (catError) throw catError;

      const { data: itemsData, error: itemsError } = await supabase
        .from("menu_items")
        .select("*")
        .eq("available", true)
        .order("category_id")
        .order("sort_order");

      if (itemsError) throw itemsError;

      setCategories(categoriesData || []);
      setMenuItems(itemsData || []);
    } catch (error) {
      console.error("Error loading menu:", error);
      toast.error("Erro ao carregar cardápio");
    } finally {
      setLoading(false);
    }
  };

  const getCategoryItems = (categoryId: string) => {
    return menuItems.filter(item => item.category_id === categoryId);
  };

  const getImageUrl = (imageUrl: string | null) => {
    if (!imageUrl) return null;
    const filename = imageUrl.split('/').pop();
    return filename ? imageMap[filename] : null;
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05,
        delayChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.3 },
    },
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="mb-4 inline-block">
            <div className="h-12 w-12 animate-spin rounded-full border-4 border-border border-t-secondary"></div>
          </div>
          <p className="text-muted-foreground">Carregando cardápio...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8">
      {/* Header Section */}
      <motion.header
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-16"
      >
        <div>
          <p className="text-xs uppercase tracking-[0.25em] text-secondary">
            {t.hero.eyebrow}
          </p>
          <h1 className="mt-3 font-display text-5xl sm:text-6xl">{t.menu.title}</h1>
          <p className="mt-4 max-w-2xl text-lg text-muted-foreground">{t.menu.lead}</p>
        </div>
      </motion.header>

      {/* Categories Grid */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="space-y-12"
      >
        {categories.map((category) => {
          const categoryItems = getCategoryItems(category.id);
          if (categoryItems.length === 0) return null;

          return (
            <motion.section key={category.id} variants={itemVariants}>
              {/* Category Header */}
              <button
                onClick={() =>
                  setExpandedCategory(
                    expandedCategory === category.id ? null : category.id
                  )
                }
                className="group mb-8 flex w-full items-center justify-between border-b-2 border-border pb-4 transition-colors hover:border-secondary"
              >
                <div className="text-left">
                  <h2 className="font-display text-3xl text-foreground">
                    {category.name}
                  </h2>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {categoryItems.length} {categoryItems.length === 1 ? "item" : "items"}
                  </p>
                </div>
                <ChevronDown
                  className={`h-6 w-6 text-secondary transition-transform duration-300 ${
                    expandedCategory === category.id ? "rotate-180" : ""
                  }`}
                />
              </button>

              {/* Items Grid */}
              {expandedCategory === category.id && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3 }}
                  className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
                >
                  {categoryItems.map((item, idx) => {
                    const imageUrl = getImageUrl(item.image_url);
                    
                    return (
                      <motion.article
                        key={item.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.05 }}
                        className="group overflow-hidden rounded-2xl border border-border bg-card transition-all hover:border-secondary hover:shadow-lg"
                      >
                        {/* Image */}
                        <div className="relative h-48 overflow-hidden bg-muted">
                          {imageUrl ? (
                            <img
                              src={imageUrl}
                              alt={item.name}
                              className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-110"
                              loading="lazy"
                            />
                          ) : (
                            <div className="h-full w-full flex items-center justify-center bg-muted">
                              <ShoppingCart className="h-12 w-12 text-muted-foreground/30" />
                            </div>
                          )}
                          <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent" />
                        </div>

                        {/* Content */}
                        <div className="p-5">
                          <div className="flex items-start justify-between gap-3">
                            <div className="flex-1">
                              <h3 className="font-display text-lg text-foreground">
                                {item.name}
                              </h3>
                              {item.description && (
                                <p className="mt-2 text-sm text-muted-foreground">
                                  {item.description}
                                </p>
                              )}
                            </div>
                          </div>
                          <p className="mt-4 font-display text-xl text-secondary">
                            R$ {item.price.toFixed(2)}
                          </p>
                        </div>
                      </motion.article>
                    );
                  })}
                </motion.div>
              )}
            </motion.section>
          );
        })}
      </motion.div>

      {/* Footer Note */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="mt-16 text-center text-sm text-muted-foreground"
      >
        {t.menu.note}
      </motion.p>
    </div>
  );
}

const LandingMenu = () => {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        <MenuPage />
      </main>
      <Footer />
    </div>
  );
};

export default LandingMenu;
