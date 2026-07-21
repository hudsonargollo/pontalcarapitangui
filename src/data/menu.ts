import type { Lang } from "@/i18n/translations";

export interface MenuItem {
  name: { pt: string; en: string };
  description: { pt: string; en: string } | null;
  price: string;
  image?: string;
}

export interface MenuCategory {
  key: string;
  name: { pt: string; en: string };
  items: MenuItem[];
}

export const menu: MenuCategory[] = [
  {
    key: "frios",
    name: { pt: "Frios", en: "Cold Dishes" },
    items: [
      {
        name: { pt: "Vinagrete de Polvo", en: "Octopus Vinaigrette" },
        description: { pt: "Com torradas", en: "With toasted bread" },
        price: "R$ 138",
        image: "/menu/octopus-vinaigrette.jpg",
      },
      {
        name: { pt: "Ceviche de Peixe Branco", en: "White Fish Ceviche" },
        description: { pt: "Com torradas", en: "With toasted bread" },
        price: "R$ 85",
        image: "/menu/ceviche.jpg",
      },
    ],
  },
  {
    key: "petiscos",
    name: { pt: "Petiscos", en: "Appetizers" },
    items: [
      {
        name: { pt: "Fritas Carapitangui", en: "Carapitangui Fries" },
        description: { pt: "Batatas fritas com carne serenada desfiada e molho de alho negro", en: "Fries with shredded carne seca and black garlic sauce" },
        price: "R$ 79",
        image: "/menu/fries-carapitangui.jpg",
      },
      {
        name: { pt: "Dadinho de Tapioca", en: "Tapioca Cubes" },
        description: { pt: "Com geleia de pimenta biquinho", en: "With biquinho pepper jelly" },
        price: "R$ 79",
        image: "/menu/tapioca-cubes.jpg",
      },
      {
        name: { pt: "Isca de Peixe", en: "Fish Strips" },
        description: null,
        price: "R$ 89",
        image: "/menu/fish-strips.jpg",
      },
      {
        name: { pt: "Lula à Dorê", en: "Squid à Dorê" },
        description: null,
        price: "R$ 95",
        image: "/menu/squid-doree.jpg",
      },
      {
        name: { pt: "Camarão Crocante", en: "Crispy Shrimp" },
        description: { pt: "Empanado com tapioca", en: "Breaded with tapioca" },
        price: "R$ 169",
        image: "/menu/crispy-shrimp.jpg",
      },
      {
        name: { pt: "Bolinho de Bacalhau Português", en: "Portuguese Cod Cakes" },
        description: { pt: "6 unidades", en: "6 pieces" },
        price: "R$ 69",
        image: "/menu/cod-cakes.jpg",
      },
      {
        name: { pt: "Casquinha de Siri", en: "Crab Shells" },
        description: null,
        price: "R$ 49",
        image: "/menu/crab-shells.jpg",
      },
      {
        name: { pt: "Carne de Sol Acebolada com Fritas", en: "Carne de Sol with Onions & Fries" },
        description: null,
        price: "R$ 79",
        image: "/menu/carne-sol.jpg",
      },
      {
        name: { pt: "Filé Mignon Aperitivo com Fritas", en: "Filet Mignon Appetizer with Fries" },
        description: null,
        price: "R$ 92",
        image: "/menu/filet-mignon-appetizer.jpg",
      },
      {
        name: { pt: "Aipim Frito", en: "Fried Cassava" },
        description: null,
        price: "R$ 55",
        image: "/menu/cassava-fries.jpg",
      },
      {
        name: { pt: "Batata Frita", en: "French Fries" },
        description: null,
        price: "R$ 45",
        image: "/menu/fries.jpg",
      },
    ],
  },
  {
    key: "especial",
    name: { pt: "Especial 2 Pessoas", en: "Serves 2" },
    items: [
      {
        name: { pt: "Camarão Carapitangui", en: "Carapitangui Shrimp" },
        description: { pt: "Gratinado com catupiry ao creme e champignon", en: "Gratinéed with creamy catupiry and mushrooms" },
        price: "R$ 210",
        image: "/menu/shrimp-carapitangui.jpg",
      },
      {
        name: { pt: "Misto do Mar", en: "Seafood Mix" },
        description: { pt: "Frutos do mar com arroz branco e legumes", en: "Seafood with white rice and vegetables" },
        price: "R$ 299",
        image: "/menu/seafood-mix.jpg",
      },
      {
        name: { pt: "Filé de Peixe Branco Grelhado", en: "Grilled White Fish Fillet" },
        description: { pt: "Arroz branco e legumes, molho de champignon e alcaparras", en: "White rice and vegetables, mushroom and caper sauce" },
        price: "R$ 198",
        image: "/menu/grilled-fish.jpg",
      },
      {
        name: { pt: "Salmão Tropical", en: "Tropical Salmon" },
        description: { pt: "Arroz branco e legumes, molho de champignon e alcaparras", en: "White rice and vegetables, mushroom and caper sauce" },
        price: "R$ 198",
        image: "/menu/tropical-salmon.jpg",
      },
      {
        name: { pt: "Filé Mignon ao Gorgonzola", en: "Filet Mignon with Gorgonzola" },
        description: { pt: "Servido com Arroz e Fritas", en: "Served with rice and fries" },
        price: "R$ 189",
        image: "/menu/filet-gorgonzola.jpg",
      },
      {
        name: { pt: "Frango à Parmegiana", en: "Chicken Parmesan" },
        description: { pt: "Servido com Arroz e Fritas", en: "Served with rice and fries" },
        price: "R$ 169",
        image: "/menu/chicken-parmesan.jpg",
      },
    ],
  },
  {
    key: "kids",
    name: { pt: "Pratos Kids", en: "Kids Menu" },
    items: [
      {
        name: { pt: "Filezinho de Peixe", en: "Fish Fillet" },
        description: { pt: "Acompanha arroz, feijão e batata frita", en: "With rice, beans and fries" },
        price: "R$ 69",
        image: "/menu/kids-fish.jpg",
      },
      {
        name: { pt: "Filezinho de Carne", en: "Beef Fillet" },
        description: { pt: "Acompanha arroz, feijão e batata frita", en: "With rice, beans and fries" },
        price: "R$ 69",
        image: "/menu/kids-beef.jpg",
      },
    ],
  },
  {
    key: "sobremesas",
    name: { pt: "Sobremesas", en: "Desserts" },
    items: [
      {
        name: { pt: "Cocada de Forno Artesanal", en: "Artisanal Baked Coconut" },
        description: { pt: "Com sorvete e calda tropical de maracujá", en: "With ice cream and passion fruit sauce" },
        price: "R$ 35",
        image: "/menu/cocada.jpg",
      },
      {
        name: { pt: "Açaí", en: "Açaí" },
        description: { pt: "3 bolas com granola", en: "3 scoops with granola" },
        price: "R$ 35",
        image: "/menu/acai.jpg",
      },
      {
        name: { pt: "Picolé", en: "Popsicle" },
        description: null,
        price: "R$ 15",
        image: "/menu/popsicle.jpg",
      },
      {
        name: { pt: "Brigadeiro de Colher", en: "Brigadeiro" },
        description: null,
        price: "R$ 15",
        image: "/menu/brigadeiro.jpg",
      },
    ],
  },
  {
    key: "drinks-autorais",
    name: { pt: "Drinks Autorais Pontal", en: "Pontal Signature Drinks" },
    items: [
      {
        name: { pt: "Caipitão", en: "Caipitão" },
        description: { pt: "Rum, limão, gengibre, espuma de gengibre e água tônica", en: "Rum, lime, ginger, ginger foam and tonic water" },
        price: "R$ 45",
        image: "/menu/caipitao.jpg",
      },
      {
        name: { pt: "Oxe Mate", en: "Oxe Mate" },
        description: { pt: "Rum, mate, limão, hortelã e água com gás", en: "Rum, mate, lime, mint and sparkling water" },
        price: "R$ 45",
        image: "/menu/oxe-mate.jpg",
      },
      {
        name: { pt: "Do Chef", en: "Chef's Choice" },
        description: { pt: "Saquê e uva roxa macerada", en: "Sake and macerated purple grapes" },
        price: "R$ 45",
        image: "/menu/chef-choice.jpg",
      },
      {
        name: { pt: "Netuno Maré", en: "Neptune's Tide" },
        description: { pt: "Netuno, vodka, caju e hortelã", en: "Netuno, vodka, cashew and mint" },
        price: "R$ 45",
        image: "/menu/neptune-tide.jpg",
      },
      {
        name: { pt: "Lá Ele", en: "Lá Ele" },
        description: { pt: "Blend de conhaques, abacaxi e gengibre", en: "Cognac blend, pineapple and ginger" },
        price: "R$ 45",
        image: "/menu/la-ele.jpg",
      },
      {
        name: { pt: "Tadala Sour", en: "Tadala Sour" },
        description: { pt: "Whisky, limão, gengibre, hortelã, guaraná em pó e tadalafila", en: "Whisky, lime, ginger, mint, guarana powder and tadalafil" },
        price: "R$ 45",
        image: "/menu/tadala-sour.jpg",
      },
    ],
  },
  {
    key: "drinks-classicos",
    name: { pt: "Drinks Clássicos", en: "Classic Drinks" },
    items: [
      {
        name: { pt: "Caipirinha Especial", en: "Special Caipirinha" },
        description: { pt: "Cachaça especial", en: "Special cachaça" },
        price: "R$ 39",
        image: "/menu/caipirinha.jpg",
      },
      {
        name: { pt: "Mojito", en: "Mojito" },
        description: null,
        price: "R$ 40",
        image: "/menu/mojito.jpg",
      },
    ],
  },
  {
    key: "drinks-experiencia",
    name: { pt: "Drinks Pontal Experiência", en: "Pontal Experience Drinks" },
    items: [
      {
        name: { pt: "Blue Lagoon", en: "Blue Lagoon" },
        description: { pt: "Citrus + Curaçao Blue Monin + Vodka", en: "Citrus + Blue Curaçao Monin + Vodka" },
        price: "R$ 49",
        image: "/menu/blue-lagoon.jpg",
      },
      {
        name: { pt: "Gin Love", en: "Gin Love" },
        description: { pt: "Gin + Grenadine Monin + Tônica", en: "Gin + Grenadine Monin + Tonic" },
        price: "R$ 49",
        image: "/menu/gin-love.jpg",
      },
    ],
  },
  {
    key: "ice-drinks",
    name: { pt: "Ice Drinks", en: "Ice Drinks" },
    items: [
      {
        name: { pt: "Frozen Soft", en: "Frozen Soft" },
        description: { pt: "Mel de cacau / Morango Carapitangui", en: "Cocoa honey / Carapitangui strawberry" },
        price: "R$ 35",
        image: "/menu/frozen-soft.jpg",
      },
    ],
  },
  {
    key: "cervejas",
    name: { pt: "Cervejas", en: "Beers" },
    items: [
      {
        name: { pt: "Heineken 600ml", en: "Heineken 600ml" },
        description: null,
        price: "R$ 22",
        image: "/menu/heineken.jpg",
      },
      {
        name: { pt: "Original 600ml", en: "Original 600ml" },
        description: null,
        price: "R$ 18",
        image: "/menu/original.jpg",
      },
    ],
  },
  {
    key: "sem-alcool",
    name: { pt: "Bebidas sem Álcool", en: "Non-Alcoholic Drinks" },
    items: [
      {
        name: { pt: "Água sem gás", en: "Still Water" },
        description: null,
        price: "R$ 7",
        image: "/menu/water.jpg",
      },
      {
        name: { pt: "Suco (Morango, cajá ou limão)", en: "Juice (Strawberry, Cajá or Lemon)" },
        description: null,
        price: "R$ 18",
        image: "/menu/juice.jpg",
      },
    ],
  },
];

export function pick<T extends { pt: string; en: string }>(field: T, lang: Lang) {
  return field[lang];
}
