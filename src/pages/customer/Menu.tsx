import { useState, useEffect, useMemo } from "react";
import { motion } from "framer-motion";
import { Heart, ShoppingBag } from "lucide-react";
import { useCart } from "@/lib/cartContext";
import { useLang } from "@/i18n/LanguageProvider";
import { menu, pick } from "@/data/menu";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

// Image imports for all 40 menu items
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

// Image map for matching menu items to imported images
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

interface FoodpornCardProps {
  name: string;
  description: string | null;
  price: string;
  image: string;
  isBestSeller?: boolean;
  onAddToCart: () => void;
}

const FoodpornCard = ({
  name,
  description,
  price,
  image,
  isBestSeller = false,
  onAddToCart,
}: FoodpornCardProps) => {
  const [isFavorite, setIsFavorite] = useState(false);

  const getImageUrl = (imagePath: string) => {
    const filename = imagePath.split("/").pop() || "";
    return imageMap[filename] || imagePath;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      viewport={{ once: true, margin: "-50px" }}
      className="group relative overflow-hidden rounded-3xl bg-white shadow-sm hover:shadow-xl transition-shadow duration-300"
    >
      {/* Image Container */}
      <div className="relative aspect-square overflow-hidden bg-gradient-to-br from-[#1A2B2A] to-[#2A3B3A]">
        <img
          src={getImageUrl(image)}
          alt={name}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
        />

        {/* Best Seller Badge */}
        {isBestSeller && (
          <div className="absolute top-3 left-3 backdrop-blur-md bg-white/30 px-3 py-1 rounded-full border border-white/50">
            <span className="text-xs font-bold text-white uppercase tracking-wider">
              ⭐ Destaque
            </span>
          </div>
        )}

        {/* Favorite Button */}
        <button
          onClick={() => setIsFavorite(!isFavorite)}
          className="absolute top-3 right-3 p-2 rounded-full bg-white/20 backdrop-blur-md hover:bg-white/40 transition-all duration-200 border border-white/30"
        >
          <Heart
            size={18}
            className={`transition-colors ${
              isFavorite ? "fill-red-500 text-red-500" : "text-white"
            }`}
          />
        </button>

        {/* Price Badge */}
        <div className="absolute bottom-3 right-3 backdrop-blur-md bg-[#BC6C25]/90 px-3 py-2 rounded-full border border-[#BC6C25]">
          <span className="text-sm font-bold text-white">{price}</span>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 space-y-3">
        <div>
          <h3 className="font-display text-lg font-bold text-[#1A2B2A] uppercase tracking-tight line-clamp-2">
            {name}
          </h3>
          {description && (
            <p className="text-xs text-[#A8A294] mt-1 line-clamp-2">
              {description}
            </p>
          )}
        </div>

        {/* Add to Cart Button */}
        <button
          onClick={onAddToCart}
          className="w-full py-2 px-3 bg-[#D97706] hover:bg-[#B85E00] text-white font-bold text-sm uppercase tracking-wider rounded-lg transition-colors duration-200 flex items-center justify-center gap-2"
        >
          <ShoppingBag size={16} />
          Adicionar
        </button>
      </div>
    </motion.div>
  );
};

const Menu = () => {
  const navigate = useNavigate();
  const { lang } = useLang();
  const { state: cartState, addItem } = useCart();
  const [selectedCategory, setSelectedCategory] = useState<string>("frios");

  useEffect(() => {
    document.title = "Menu — PONTAL Carapitangui";
  }, []);

  const categories = useMemo(() => menu, []);
  const selectedCategoryData = useMemo(
    () => categories.find((cat) => cat.key === selectedCategory),
    [selectedCategory, categories]
  );

  const handleAddToCart = (item: any, categoryKey: string) => {
    addItem({
      id: `${categoryKey}-${item.name[lang]}`,
      name: item.name[lang],
      description: item.description ? pick(item.description, lang) : null,
      price: parseFloat(item.price.replace(/[^\d.]/g, "")),
      category_id: categoryKey,
      available: true,
    });
  };

  const cartItemCount = cartState.items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div className="min-h-screen bg-[#F2EEE4] flex flex-col">
      <Header />

      <main className="flex-1 w-full max-w-7xl mx-auto px-4 py-8">
        {/* Layout Switcher Banner */}
        <div className="mb-6 flex items-center justify-between bg-white rounded-2xl p-3 border border-[#E5DFD3] shadow-xs">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-[#1A2B2A] uppercase tracking-wide">
              {lang === "pt" ? "Visualização:" : "View Mode:"}
            </span>
            <span className="text-xs text-[#7A7568]">
              {lang === "pt" ? "Modo Galeria (Foodporn)" : "Gallery Mode (Foodporn)"}
            </span>
          </div>
          <button
            onClick={() => navigate("/live-menu")}
            className="px-3.5 py-1.5 rounded-xl bg-[#1A2B2A] hover:bg-[#2A3B3A] text-white text-xs font-bold uppercase tracking-wider transition-colors shadow-xs flex items-center gap-1.5"
          >
            <span>{lang === "pt" ? "Alternar para LiveMenu" : "Switch to LiveMenu"}</span>
            <span className="text-[10px] bg-[#BC6C25] px-1.5 py-0.5 rounded-md">Tagme style</span>
          </button>
        </div>

        {/* Category Tabs */}
        <div className="mb-8 overflow-x-auto pb-2">
          <div className="flex gap-2 min-w-max">
            {categories.map((category) => (
              <button
                key={category.key}
                onClick={() => setSelectedCategory(category.key)}
                className={`px-4 py-2 rounded-lg font-bold uppercase text-sm tracking-wider transition-all duration-200 whitespace-nowrap ${
                  selectedCategory === category.key
                    ? "bg-[#BC6C25] text-white shadow-md"
                    : "bg-white text-[#1A2B2A] border-2 border-[#1A2B2A] hover:bg-[#F2EEE4]"
                }`}
              >
                {pick(category.name, lang)}
              </button>
            ))}
          </div>
        </div>

        {/* Items Grid */}
        {selectedCategoryData && (
          <motion.div
            key={selectedCategory}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
          >
            {selectedCategoryData.items.map((item, index) => (
              <FoodpornCard
                key={`${selectedCategory}-${index}`}
                name={pick(item.name, lang)}
                description={item.description ? pick(item.description, lang) : null}
                price={item.price}
                image={item.image || ""}
                isBestSeller={index === 0}
                onAddToCart={() => handleAddToCart(item, selectedCategory)}
              />
            ))}
          </motion.div>
        )}
      </main>

      {/* Sticky Cart Button */}
      {cartItemCount > 0 && (
        <motion.div
          initial={{ y: 100 }}
          animate={{ y: 0 }}
          className="fixed bottom-6 right-6 z-40"
        >
          <Button
            onClick={() => navigate("/checkout")}
            className="bg-[#BC6C25] hover:bg-[#A85A1F] text-white font-bold py-3 px-6 rounded-full shadow-xl flex items-center gap-2 text-lg"
          >
            <ShoppingBag size={20} />
            SEUS PEDIDOS ({cartItemCount})
          </Button>
        </motion.div>
      )}

      <Footer />
    </div>
  );
};

export default Menu;
