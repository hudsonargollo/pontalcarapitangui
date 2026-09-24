import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  Venue, 
  MenuCategoryDetail, 
  MenuItemDetail, 
  CyclingOffer, 
  VenueTable, 
  MerchandiseItem, 
  MenuItemReview, 
  MimenuOrder,
  FulfillmentType,
  HotnessLevel
} from '@/types/mimenu';
import { 
  DEFAULT_VENUE, 
  INITIAL_CATEGORIES, 
  INITIAL_CYCLING_OFFERS, 
  INITIAL_TABLES, 
  INITIAL_REVIEWS,
  calculateHotnessScore
} from '@/data/mimenuData';
import { toast } from 'sonner';

interface MimenuContextType {
  venue: Venue;
  updateVenue: (updated: Partial<Venue>) => void;
  categories: MenuCategoryDetail[];
  cyclingOffers: CyclingOffer[];
  activeOffers: CyclingOffer[];
  tables: VenueTable[];
  reviews: MenuItemReview[];
  orders: MimenuOrder[];
  selectedTable: string | null;
  setSelectedTable: (table: string | null) => void;
  fulfillmentType: FulfillmentType;
  setFulfillmentType: (type: FulfillmentType) => void;
  
  // Hotness recalculation
  recalculateAllHotness: () => void;
  
  // Cycling offers methods
  addCyclingOffer: (offer: Omit<CyclingOffer, 'id' | 'analytics'>) => void;
  updateCyclingOffer: (id: string, offer: Partial<CyclingOffer>) => void;
  deleteCyclingOffer: (id: string) => void;
  recordOfferImpression: (offerId: string) => void;
  recordOfferClick: (offerId: string) => void;
  recordOfferConversion: (offerId: string, revenue: number) => void;
  
  // Reviews methods
  addReview: (itemId: string, customerName: string, rating: number, comment: string) => void;
  approveReview: (reviewId: string) => void;
  rejectReview: (reviewId: string) => void;
  getItemReviews: (itemId: string) => MenuItemReview[];
  
  // Table methods
  addTable: (table: Omit<VenueTable, 'id'>) => void;
  updateTable: (id: string, table: Partial<VenueTable>) => void;
  deleteTable: (id: string) => void;
  resolveTableByHash: (hash: string) => VenueTable | undefined;
  
  // Batch Onboarding & Menu methods
  setCategories: (cats: MenuCategoryDetail[] | ((prev: MenuCategoryDetail[]) => MenuCategoryDetail[])) => void;
  setTables: (tables: VenueTable[] | ((prev: VenueTable[]) => VenueTable[])) => void;
  batchSetupVenue: (venueData: Partial<Venue>, newCategories: MenuCategoryDetail[], tableCount: number) => void;
  
  // Order methods
  createOrder: (orderData: Omit<MimenuOrder, 'id' | 'order_number' | 'created_at' | 'status'>) => MimenuOrder;
  updateOrderStatus: (orderId: string, status: MimenuOrder['status']) => void;
}

const MimenuContext = createContext<MimenuContextType | undefined>(undefined);

const STORAGE_KEYS = {
  VENUE: 'mimenu_venue_v1',
  CATEGORIES: 'mimenu_categories_v1',
  OFFERS: 'mimenu_cycling_offers_v1',
  TABLES: 'mimenu_tables_v1',
  REVIEWS: 'mimenu_reviews_v1',
  ORDERS: 'mimenu_orders_v1',
  SELECTED_TABLE: 'mimenu_selected_table_v1',
  FULFILLMENT: 'mimenu_fulfillment_v1',
};

export const MimenuProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Venue state
  const [venue, setVenue] = useState<Venue>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.VENUE);
    return saved ? JSON.parse(saved) : DEFAULT_VENUE;
  });

  // Categories & items state
  const [categories, setCategories] = useState<MenuCategoryDetail[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.CATEGORIES);
    return saved ? JSON.parse(saved) : INITIAL_CATEGORIES;
  });

  // Cycling offers state
  const [cyclingOffers, setCyclingOffers] = useState<CyclingOffer[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.OFFERS);
    return saved ? JSON.parse(saved) : INITIAL_CYCLING_OFFERS;
  });

  // Tables state
  const [tables, setTables] = useState<VenueTable[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.TABLES);
    return saved ? JSON.parse(saved) : INITIAL_TABLES;
  });

  // Reviews state
  const [reviews, setReviews] = useState<MenuItemReview[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.REVIEWS);
    return saved ? JSON.parse(saved) : INITIAL_REVIEWS;
  });

  // Orders state
  const [orders, setOrders] = useState<MimenuOrder[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.ORDERS);
    return saved ? JSON.parse(saved) : [
      {
        id: "ord-1001",
        order_number: "#1001",
        venue_id: "venue-moes-taberna-scz",
        fulfillment_type: "dine_in",
        table_number: "4",
        customer_name: "Andrés Banzer",
        customer_phone: "+59178055443",
        items: [
          { item_id: "item-salchipapa-monster", name: "Salchipapa Moe's Monster", price: 45, quantity: 1, notes: "Extra salsa de ajo" },
          { item_id: "item-chopp-artesanal", name: "Chopp Artesanal Moe's (500ml)", price: 25, quantity: 2 }
        ],
        subtotal: 95,
        discount: 0,
        total: 95,
        status: "preparing",
        payment_method: "qr_simple",
        payment_status: "paid",
        created_at: new Date(Date.now() - 1000 * 60 * 12).toISOString(),
      },
      {
        id: "ord-1002",
        order_number: "#1002",
        venue_id: "venue-moes-taberna-scz",
        fulfillment_type: "dine_in",
        table_number: "VIP 1",
        customer_name: "Mariana Justiniano",
        customer_phone: "+59176012998",
        items: [
          { item_id: "item-fernet-branca", name: "Fernet Branca con Coca (Jarra 1L)", price: 35, quantity: 2 },
          { item_id: "item-nachos-supremos", name: "Nachos Supremos Moe's", price: 48, quantity: 1 }
        ],
        subtotal: 118,
        discount: 0,
        total: 118,
        status: "delivered",
        payment_method: "card",
        payment_status: "paid",
        created_at: new Date(Date.now() - 1000 * 60 * 35).toISOString(),
      }
    ];
  });

  // Selected table & fulfillment
  const [selectedTable, setSelectedTableState] = useState<string | null>(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const tableParam = urlParams.get('table') || urlParams.get('mesa') || urlParams.get('t');
    if (tableParam) return tableParam;
    return localStorage.getItem(STORAGE_KEYS.SELECTED_TABLE) || "4";
  });

  const [fulfillmentType, setFulfillmentTypeState] = useState<FulfillmentType>(() => {
    return (localStorage.getItem(STORAGE_KEYS.FULFILLMENT) as FulfillmentType) || 'dine_in';
  });

  // Persist state changes
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.VENUE, JSON.stringify(venue));
  }, [venue]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.CATEGORIES, JSON.stringify(categories));
  }, [categories]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.OFFERS, JSON.stringify(cyclingOffers));
  }, [cyclingOffers]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.TABLES, JSON.stringify(tables));
  }, [tables]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.REVIEWS, JSON.stringify(reviews));
  }, [reviews]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(orders));
  }, [orders]);

  const setSelectedTable = (table: string | null) => {
    setSelectedTableState(table);
    if (table) {
      localStorage.setItem(STORAGE_KEYS.SELECTED_TABLE, table);
    } else {
      localStorage.removeItem(STORAGE_KEYS.SELECTED_TABLE);
    }
  };

  const setFulfillmentType = (type: FulfillmentType) => {
    setFulfillmentTypeState(type);
    localStorage.setItem(STORAGE_KEYS.FULFILLMENT, type);
  };

  const updateVenue = (updated: Partial<Venue>) => {
    setVenue(prev => ({ ...prev, ...updated }));
    toast.success('Configuración de la taberna actualizada');
  };

  // Hotness recalculation
  const recalculateAllHotness = () => {
    setCategories(prevCats => 
      prevCats.map(cat => ({
        ...cat,
        items: cat.items.map(item => {
          const newScore = calculateHotnessScore(item.velocity_24h, item.baseline_14d);
          return { ...item, hotness_score: newScore };
        })
      }))
    );
    toast.success('Algoritmo de Hotness recalculado con éxito');
  };

  // Active offers computation
  const activeOffers = cyclingOffers.filter(o => o.is_active);

  // Cycling offers actions
  const addCyclingOffer = (offerData: Omit<CyclingOffer, 'id' | 'analytics'>) => {
    const newOffer: CyclingOffer = {
      ...offerData,
      id: `offer-${Date.now()}`,
      analytics: {
        impressions: 0,
        clicks: 0,
        add_to_carts: 0,
        conversions: 0,
        revenue_generated: 0,
      }
    };
    setCyclingOffers(prev => [newOffer, ...prev]);
    toast.success('Oferta inteligente creada');
  };

  const updateCyclingOffer = (id: string, updated: Partial<CyclingOffer>) => {
    setCyclingOffers(prev => prev.map(o => o.id === id ? { ...o, ...updated } : o));
    toast.success('Oferta actualizada');
  };

  const deleteCyclingOffer = (id: string) => {
    setCyclingOffers(prev => prev.filter(o => o.id !== id));
    toast.success('Oferta eliminada');
  };

  const recordOfferImpression = (offerId: string) => {
    setCyclingOffers(prev => prev.map(o => {
      if (o.id === offerId) {
        return {
          ...o,
          analytics: { ...o.analytics, impressions: o.analytics.impressions + 1 }
        };
      }
      return o;
    }));
  };

  const recordOfferClick = (offerId: string) => {
    setCyclingOffers(prev => prev.map(o => {
      if (o.id === offerId) {
        return {
          ...o,
          analytics: { ...o.analytics, clicks: o.analytics.clicks + 1, add_to_carts: o.analytics.add_to_carts + 1 }
        };
      }
      return o;
    }));
  };

  const recordOfferConversion = (offerId: string, revenue: number) => {
    setCyclingOffers(prev => prev.map(o => {
      if (o.id === offerId) {
        return {
          ...o,
          analytics: { 
            ...o.analytics, 
            conversions: o.analytics.conversions + 1,
            revenue_generated: o.analytics.revenue_generated + revenue
          }
        };
      }
      return o;
    }));
  };

  // Review methods
  const addReview = (itemId: string, customerName: string, rating: number, comment: string) => {
    const newReview: MenuItemReview = {
      id: `rev-${Date.now()}`,
      item_id: itemId,
      customer_name: customerName,
      rating,
      comment,
      status: 'approved', // Auto approved for instant delight, visible in moderation
      created_at: new Date().toISOString(),
    };
    setReviews(prev => [newReview, ...prev]);

    // Update item review count & average rating
    setCategories(prevCats => 
      prevCats.map(cat => ({
        ...cat,
        items: cat.items.map(item => {
          if (item.id === itemId) {
            const allItemReviews = [...reviews.filter(r => r.item_id === itemId), newReview];
            const avg = allItemReviews.reduce((sum, r) => sum + r.rating, 0) / allItemReviews.length;
            return {
              ...item,
              reviews_count: allItemReviews.length,
              average_rating: Number(avg.toFixed(1)),
            };
          }
          return item;
        })
      }))
    );

    toast.success('¡Gracias por tu reseña! Ya está visible en el menú.');
  };

  const approveReview = (reviewId: string) => {
    setReviews(prev => prev.map(r => r.id === reviewId ? { ...r, status: 'approved' } : r));
    toast.success('Reseña aprobada');
  };

  const rejectReview = (reviewId: string) => {
    setReviews(prev => prev.map(r => r.id === reviewId ? { ...r, status: 'rejected' } : r));
    toast.info('Reseña rechazada');
  };

  const getItemReviews = (itemId: string) => {
    return reviews.filter(r => r.item_id === itemId && r.status === 'approved');
  };

  // Table methods
  const addTable = (tableData: Omit<VenueTable, 'id'>) => {
    const newTable: VenueTable = {
      ...tableData,
      id: `tbl-${Date.now()}`,
    };
    setTables(prev => [...prev, newTable]);
    toast.success('Mesa agregada');
  };

  const updateTable = (id: string, updated: Partial<VenueTable>) => {
    setTables(prev => prev.map(t => t.id === id ? { ...t, ...updated } : t));
    toast.success('Mesa actualizada');
  };

  const deleteTable = (id: string) => {
    setTables(prev => prev.filter(t => t.id !== id));
    toast.success('Mesa eliminada');
  };

  const resolveTableByHash = (hash: string) => {
    return tables.find(t => t.qr_code_hash.toLowerCase() === hash.toLowerCase() || t.table_number.toLowerCase() === hash.toLowerCase());
  };

  const batchSetupVenue = (venueData: Partial<Venue>, newCategories: MenuCategoryDetail[], tableCount: number) => {
    const updatedVenue: Venue = {
      ...venue,
      ...venueData,
    };
    setVenue(updatedVenue);

    if (newCategories && newCategories.length > 0) {
      setCategories(newCategories);
    }

    if (tableCount > 0) {
      const generatedTables: VenueTable[] = Array.from({ length: tableCount }, (_, idx) => {
        const num = (idx + 1).toString();
        const zone: VenueTable['zone'] = idx < 6 ? 'Principal' : idx < 12 ? 'Terraza' : 'Barra';
        return {
          id: `tbl-${Date.now()}-${num}`,
          venue_id: updatedVenue.id,
          table_number: num,
          label: `Mesa ${num}`,
          qr_code_hash: `${updatedVenue.slug || 'venue'}-m${num}-${Math.random().toString(36).substring(2, 7)}`,
          zone,
          is_occupied: false,
          is_active: true,
        };
      });
      setTables(generatedTables);
    }

    toast.success('¡Restaurante configurado con éxito!', {
      description: 'Menú, mesas y branding listos para operar.',
    });
  };

  // Order methods
  const createOrder = (orderData: Omit<MimenuOrder, 'id' | 'order_number' | 'created_at' | 'status'>): MimenuOrder => {
    const orderNumber = `#${Math.floor(1000 + Math.random() * 9000)}`;
    const newOrder: MimenuOrder = {
      ...orderData,
      id: `ord-${Date.now()}`,
      order_number: orderNumber,
      status: 'pending',
      created_at: new Date().toISOString(),
    };
    setOrders(prev => [newOrder, ...prev]);

    // Increase 24h velocity on ordered items
    setCategories(prevCats => 
      prevCats.map(cat => ({
        ...cat,
        items: cat.items.map(item => {
          const matchedItem = orderData.items.find(i => i.item_id === item.id);
          if (matchedItem) {
            const newVelocity = item.velocity_24h + matchedItem.quantity;
            const newScore = calculateHotnessScore(newVelocity, item.baseline_14d);
            return {
              ...item,
              velocity_24h: newVelocity,
              hotness_score: newScore,
            };
          }
          return item;
        })
      }))
    );

    return newOrder;
  };

  const updateOrderStatus = (orderId: string, status: MimenuOrder['status']) => {
    setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status } : o));
    toast.success(`Pedido actualizado a: ${status}`);
  };

  return (
    <MimenuContext.Provider
      value={{
        venue,
        updateVenue,
        categories,
        cyclingOffers,
        activeOffers,
        tables,
        reviews,
        orders,
        selectedTable,
        setSelectedTable,
        fulfillmentType,
        setFulfillmentType,
        recalculateAllHotness,
        addCyclingOffer,
        updateCyclingOffer,
        deleteCyclingOffer,
        recordOfferImpression,
        recordOfferClick,
        recordOfferConversion,
        addReview,
        approveReview,
        rejectReview,
        getItemReviews,
        addTable,
        updateTable,
        deleteTable,
        resolveTableByHash,
        setCategories,
        setTables,
        batchSetupVenue,
        createOrder,
        updateOrderStatus,
      }}
    >
      {children}
    </MimenuContext.Provider>
  );
};

export const useMimenu = () => {
  const context = useContext(MimenuContext);
  if (!context) {
    throw new Error('useMimenu must be used within a MimenuProvider');
  }
  return context;
};
