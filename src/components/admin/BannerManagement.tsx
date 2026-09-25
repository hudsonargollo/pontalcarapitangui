import React, { useState } from "react";
import {
  PromoBanner,
  useBanners,
  PRESET_BANNER_IMAGES,
  getImageUrl,
} from "@/lib/banners";
import { menu } from "@/data/menu";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  Sparkles,
  Plus,
  Edit,
  Trash2,
  RotateCcw,
  ArrowUp,
  ArrowDown,
  Eye,
  ExternalLink,
  Check,
  Image as ImageIcon,
  Tag,
  MapPin,
  Layers,
} from "lucide-react";
import { toast } from "sonner";

export const BannerManagement: React.FC = () => {
  const {
    banners,
    activeBanners,
    saveBanners,
    updateBanner,
    addBanner,
    deleteBanner,
    resetBanners,
  } = useBanners();

  const [editingBanner, setEditingBanner] = useState<PromoBanner | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [previewingBanner, setPreviewingBanner] = useState<PromoBanner | null>(null);
  const [imageInputMode, setImageInputMode] = useState<"preset" | "custom">("preset");

  // Open dialog for new banner
  const handleOpenCreate = () => {
    const newBanner: PromoBanner = {
      id: `banner-${Date.now()}`,
      badge: { pt: "Novo Destaque", en: "New Highlight" },
      title: { pt: "Título do Destaque", en: "Highlight Title" },
      subtitle: {
        pt: "Descrição detalhada do prato ou drink especial.",
        en: "Detailed description of the special dish or cocktail.",
      },
      location: { pt: "Barra Grande • Bahia", en: "Barra Grande • Bahia" },
      image: PRESET_BANNER_IMAGES[0].value,
      categoryTarget: "especial",
      isActive: true,
    };
    setEditingBanner(newBanner);
    setImageInputMode("preset");
    setIsDialogOpen(true);
  };

  // Open dialog for edit
  const handleOpenEdit = (banner: PromoBanner) => {
    setEditingBanner({ ...banner });
    const isPreset = PRESET_BANNER_IMAGES.some((p) => p.value === banner.image);
    setImageInputMode(isPreset ? "preset" : "custom");
    setIsDialogOpen(true);
  };

  // Save banner (create or update)
  const handleSave = () => {
    if (!editingBanner) return;

    if (!editingBanner.title.pt.trim()) {
      toast.error("O título em português é obrigatório.");
      return;
    }

    const exists = banners.some((b) => b.id === editingBanner.id);
    if (exists) {
      updateBanner(editingBanner);
      toast.success("Banner atualizado com sucesso!");
    } else {
      addBanner(editingBanner);
      toast.success("Novo banner criado com sucesso!");
    }

    setIsDialogOpen(false);
    setEditingBanner(null);
  };

  // Delete banner
  const handleDelete = (id: string) => {
    if (banners.length <= 1) {
      toast.error("O cardápio precisa ter pelo menos um banner cadastrado.");
      return;
    }
    deleteBanner(id);
    toast.success("Banner removido.");
  };

  // Toggle active status
  const handleToggleActive = (banner: PromoBanner) => {
    const updated = { ...banner, isActive: !banner.isActive };
    updateBanner(updated);
    toast.success(
      updated.isActive ? "Banner ativado no cardápio!" : "Banner desativado."
    );
  };

  // Move banner order
  const handleMove = (index: number, direction: "up" | "down") => {
    const newIndex = direction === "up" ? index - 1 : index + 1;
    if (newIndex < 0 || newIndex >= banners.length) return;

    const reordered = [...banners];
    const [moved] = reordered.splice(index, 1);
    reordered.splice(newIndex, 0, moved);
    saveBanners(reordered);
    toast.success("Ordem dos banners atualizada!");
  };

  // Reset to default
  const handleReset = () => {
    resetBanners();
    toast.success("Banners restaurados para a configuração padrão!");
  };

  return (
    <div className="space-y-6">
      {/* Header with Title and Actions */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-display uppercase tracking-wider text-gray-900 flex items-center gap-2">
            <Sparkles className="w-6 h-6 text-[#BC6C25]" />
            Banners de Destaque do Cardápio
          </h2>
          <p className="text-gray-600 font-body text-sm mt-1">
            Configure os banners do topo do cardápio digital do cliente. As edições são restritas exclusivamente ao painel administrativo.
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                className="border-gray-300 text-gray-700 hover:text-red-600 hover:bg-red-50"
              >
                <RotateCcw className="w-4 h-4 mr-1.5" />
                Restaurar Padrão
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Restaurar banners originais?</AlertDialogTitle>
                <AlertDialogDescription>
                  Isso irá redefinir todos os banners de destaque para os 4 itens originais do Pontal Carapitangui. Quaisquer personalizações serão perdidas.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancelar</AlertDialogCancel>
                <AlertDialogAction
                  onClick={handleReset}
                  className="bg-primary text-white hover:bg-primary/90"
                >
                  Confirmar Restauração
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>

          <Button
            onClick={handleOpenCreate}
            className="bg-[#BC6C25] hover:bg-[#9E571C] text-white font-display uppercase tracking-wider rounded-lg shadow-md"
            size="sm"
          >
            <Plus className="mr-1.5 h-4 w-4" />
            Novo Banner
          </Button>
        </div>
      </div>

      {/* Summary stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="bg-white/95 border border-gray-200 shadow-sm">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-gray-500">Total de Banners</p>
              <p className="text-2xl font-bold text-gray-900 mt-0.5">{banners.length}</p>
            </div>
            <div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center text-[#BC6C25]">
              <Layers className="w-5 h-5" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white/95 border border-gray-200 shadow-sm">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-gray-500">Banners Ativos</p>
              <p className="text-2xl font-bold text-emerald-600 mt-0.5">{activeBanners.length}</p>
            </div>
            <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600">
              <Check className="w-5 h-5" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white/95 border border-gray-200 shadow-sm">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-gray-500">Link no Cardápio</p>
              <a
                href="/cardapio"
                target="_blank"
                rel="noreferrer"
                className="text-xs font-bold text-[#BC6C25] hover:underline flex items-center gap-1 mt-1"
              >
                Ver Cardápio Ao Vivo
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
            <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600">
              <Eye className="w-5 h-5" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* List of banners */}
      <div className="space-y-4">
        {banners.map((banner, index) => {
          const categoryObj = menu.find((c) => c.key === banner.categoryTarget);

          return (
            <Card
              key={banner.id}
              className={`bg-white/95 backdrop-blur-sm border transition-all duration-200 overflow-hidden shadow-sm hover:shadow-md ${
                banner.isActive ? "border-gray-300" : "border-gray-200 opacity-70 bg-gray-50/80"
              }`}
            >
              <div className="p-4 sm:p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                {/* Left: Thumbnail + Info */}
                <div className="flex items-start sm:items-center gap-4 flex-1 min-w-0">
                  {/* Position number & Reorder controls */}
                  <div className="flex flex-col items-center justify-center gap-1 shrink-0">
                    <button
                      onClick={() => handleMove(index, "up")}
                      disabled={index === 0}
                      className="p-1 rounded hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed text-gray-600"
                      title="Mover para cima"
                    >
                      <ArrowUp className="w-3.5 h-3.5" />
                    </button>
                    <span className="text-xs font-bold text-gray-400">#{index + 1}</span>
                    <button
                      onClick={() => handleMove(index, "down")}
                      disabled={index === banners.length - 1}
                      className="p-1 rounded hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed text-gray-600"
                      title="Mover para baixo"
                    >
                      <ArrowDown className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* Thumbnail */}
                  <div className="relative w-24 h-24 sm:w-28 sm:h-24 rounded-xl overflow-hidden bg-gray-100 border border-gray-200 shrink-0">
                    <img
                      src={getImageUrl(banner.image)}
                      alt={banner.title.pt}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-1 right-1">
                      <Badge
                        variant={banner.isActive ? "default" : "secondary"}
                        className={`text-[9px] px-1.5 py-0 ${
                          banner.isActive ? "bg-emerald-600 text-white" : "bg-gray-400 text-white"
                        }`}
                      >
                        {banner.isActive ? "Ativo" : "Inativo"}
                      </Badge>
                    </div>
                  </div>

                  {/* Text Details */}
                  <div className="flex-1 min-w-0 space-y-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-[#BC6C25]/10 text-[#BC6C25] text-[10px] font-bold uppercase tracking-wider border border-[#BC6C25]/20">
                        <Tag className="w-2.5 h-2.5" />
                        {banner.badge.pt}
                      </span>
                      {banner.location?.pt && (
                        <span className="text-xs text-gray-500 flex items-center gap-1">
                          <MapPin className="w-3 h-3 text-gray-400" />
                          {banner.location.pt}
                        </span>
                      )}
                      {categoryObj && (
                        <Badge variant="outline" className="text-[10px] text-gray-600">
                          Categoria: {categoryObj.name.pt}
                        </Badge>
                      )}
                    </div>

                    <h3 className="font-bold text-base text-gray-900 line-clamp-1">
                      {banner.title.pt}
                    </h3>
                    {banner.title.en && (
                      <p className="text-xs text-gray-400 italic line-clamp-1">
                        EN: {banner.title.en}
                      </p>
                    )}

                    <p className="text-xs text-gray-600 line-clamp-2 mt-0.5">
                      {banner.subtitle.pt}
                    </p>
                  </div>
                </div>

                {/* Right: Actions */}
                <div className="flex items-center gap-3 shrink-0 self-end md:self-center">
                  <div className="flex items-center gap-2 mr-2">
                    <Label htmlFor={`switch-${banner.id}`} className="text-xs text-gray-600 cursor-pointer">
                      {banner.isActive ? "Ativo" : "Inativo"}
                    </Label>
                    <Switch
                      id={`switch-${banner.id}`}
                      checked={banner.isActive}
                      onCheckedChange={() => handleToggleActive(banner)}
                    />
                  </div>

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setPreviewingBanner(banner);
                      setIsPreviewOpen(true);
                    }}
                    className="border-gray-200 hover:bg-gray-100 text-gray-700"
                    title="Prévia visual"
                  >
                    <Eye className="w-4 h-4" />
                  </Button>

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleOpenEdit(banner)}
                    className="border-primary/40 hover:bg-primary/10 text-primary"
                    title="Editar banner"
                  >
                    <Edit className="w-4 h-4 mr-1" />
                    Editar
                  </Button>

                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDelete(banner.id)}
                    className="hover:bg-red-50 text-red-600"
                    title="Excluir banner"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      {/* ================= CREATE / EDIT MODAL ================= */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto bg-white rounded-2xl p-6">
          <DialogHeader>
            <DialogTitle className="font-display uppercase tracking-wider text-xl flex items-center gap-2 text-gray-900">
              <Sparkles className="w-5 h-5 text-[#BC6C25]" />
              {editingBanner?.id.startsWith("banner-") && !banners.some((b) => b.id === editingBanner.id)
                ? "Novo Banner de Destaque"
                : "Editar Banner de Destaque"}
            </DialogTitle>
            <DialogDescription className="text-xs text-gray-500">
              Preencha as informações do banner em português e inglês para exibição no cardápio digital.
            </DialogDescription>
          </DialogHeader>

          {editingBanner && (
            <div className="space-y-4 py-2">
              {/* Status Switch */}
              <div className="flex items-center justify-between p-3 rounded-xl bg-gray-50 border border-gray-200">
                <div>
                  <p className="text-sm font-bold text-gray-900">Exibir no Carrossel</p>
                  <p className="text-xs text-gray-500">Quando ativado, aparece em destaque para os clientes.</p>
                </div>
                <Switch
                  checked={editingBanner.isActive}
                  onCheckedChange={(checked) =>
                    setEditingBanner({ ...editingBanner, isActive: checked })
                  }
                />
              </div>

              {/* Title PT & EN */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label className="text-xs font-bold text-gray-700">Título (Português) *</Label>
                  <Input
                    value={editingBanner.title.pt}
                    onChange={(e) =>
                      setEditingBanner({
                        ...editingBanner,
                        title: { ...editingBanner.title, pt: e.target.value },
                      })
                    }
                    placeholder="Ex: Frutos do Mar Frescos & Sunset"
                    className="text-sm"
                  />
                </div>

                <div className="space-y-1.5">
                  <Label className="text-xs font-bold text-gray-700">Título (Inglês)</Label>
                  <Input
                    value={editingBanner.title.en}
                    onChange={(e) =>
                      setEditingBanner({
                        ...editingBanner,
                        title: { ...editingBanner.title, en: e.target.value },
                      })
                    }
                    placeholder="Ex: Fresh Seafood & Sunset Vibes"
                    className="text-sm"
                  />
                </div>
              </div>

              {/* Subtitle PT & EN */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label className="text-xs font-bold text-gray-700">Descrição / Subtítulo (Português)</Label>
                  <Textarea
                    value={editingBanner.subtitle.pt}
                    onChange={(e) =>
                      setEditingBanner({
                        ...editingBanner,
                        subtitle: { ...editingBanner.subtitle, pt: e.target.value },
                      })
                    }
                    rows={2}
                    placeholder="Ex: Camarões gratinados, peixes frescos e o visual inesquecível..."
                    className="text-sm"
                  />
                </div>

                <div className="space-y-1.5">
                  <Label className="text-xs font-bold text-gray-700">Descrição / Subtítulo (Inglês)</Label>
                  <Textarea
                    value={editingBanner.subtitle.en}
                    onChange={(e) =>
                      setEditingBanner({
                        ...editingBanner,
                        subtitle: { ...editingBanner.subtitle, en: e.target.value },
                      })
                    }
                    rows={2}
                    placeholder="Ex: Gratinéed shrimp, fresh catch, and stunning views..."
                    className="text-sm"
                  />
                </div>
              </div>

              {/* Badge & Location */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label className="text-xs font-bold text-gray-700">Tag / Badge (PT / EN)</Label>
                  <div className="grid grid-cols-2 gap-2">
                    <Input
                      value={editingBanner.badge.pt}
                      onChange={(e) =>
                        setEditingBanner({
                          ...editingBanner,
                          badge: { ...editingBanner.badge, pt: e.target.value },
                        })
                      }
                      placeholder="Destaque do Chef"
                      className="text-xs"
                    />
                    <Input
                      value={editingBanner.badge.en}
                      onChange={(e) =>
                        setEditingBanner({
                          ...editingBanner,
                          badge: { ...editingBanner.badge, en: e.target.value },
                        })
                      }
                      placeholder="Chef's Special"
                      className="text-xs"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <Label className="text-xs font-bold text-gray-700">Ambiente / Localização (PT / EN)</Label>
                  <div className="grid grid-cols-2 gap-2">
                    <Input
                      value={editingBanner.location.pt}
                      onChange={(e) =>
                        setEditingBanner({
                          ...editingBanner,
                          location: { ...editingBanner.location, pt: e.target.value },
                        })
                      }
                      placeholder="Barra Grande • Bahia"
                      className="text-xs"
                    />
                    <Input
                      value={editingBanner.location.en}
                      onChange={(e) =>
                        setEditingBanner({
                          ...editingBanner,
                          location: { ...editingBanner.location, en: e.target.value },
                        })
                      }
                      placeholder="Barra Grande • Bahia"
                      className="text-xs"
                    />
                  </div>
                </div>
              </div>

              {/* Target Category Selection */}
              <div className="space-y-1.5">
                <Label className="text-xs font-bold text-gray-700">
                  Categoria de Destino ao Clicar (Opcional)
                </Label>
                <select
                  value={editingBanner.categoryTarget || ""}
                  onChange={(e) =>
                    setEditingBanner({
                      ...editingBanner,
                      categoryTarget: e.target.value || undefined,
                    })
                  }
                  className="w-full text-sm rounded-lg bg-white border border-gray-300 p-2.5"
                >
                  <option value="">Nenhum botão de ação</option>
                  {menu.map((cat) => (
                    <option key={cat.key} value={cat.key}>
                      {cat.name.pt} ({cat.items.length} itens)
                    </option>
                  ))}
                </select>
              </div>

              {/* Image Selection */}
              <div className="space-y-2 p-3.5 bg-gray-50 rounded-xl border border-gray-200">
                <div className="flex items-center justify-between">
                  <Label className="text-xs font-bold text-gray-800 flex items-center gap-1.5">
                    <ImageIcon className="w-4 h-4 text-[#BC6C25]" />
                    Imagem do Banner
                  </Label>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setImageInputMode("preset")}
                      className={`text-xs px-2.5 py-1 rounded-md transition-colors ${
                        imageInputMode === "preset"
                          ? "bg-[#BC6C25] text-white font-bold"
                          : "bg-gray-200 text-gray-700"
                      }`}
                    >
                      Galeria do Cardápio
                    </button>
                    <button
                      type="button"
                      onClick={() => setImageInputMode("custom")}
                      className={`text-xs px-2.5 py-1 rounded-md transition-colors ${
                        imageInputMode === "custom"
                          ? "bg-[#BC6C25] text-white font-bold"
                          : "bg-gray-200 text-gray-700"
                      }`}
                    >
                      URL Personalizada
                    </button>
                  </div>
                </div>

                {imageInputMode === "preset" ? (
                  <div className="space-y-2">
                    <div className="grid grid-cols-3 sm:grid-cols-4 gap-2 max-h-48 overflow-y-auto p-1">
                      {PRESET_BANNER_IMAGES.map((preset) => {
                        const isSelected = editingBanner.image === preset.value;
                        return (
                          <button
                            key={preset.label}
                            type="button"
                            onClick={() =>
                              setEditingBanner({ ...editingBanner, image: preset.value })
                            }
                            className={`relative rounded-lg overflow-hidden aspect-video border-2 transition-all ${
                              isSelected
                                ? "border-[#BC6C25] ring-2 ring-[#BC6C25]/40 scale-95"
                                : "border-gray-200 hover:border-gray-400 opacity-80 hover:opacity-100"
                            }`}
                          >
                            <img
                              src={getImageUrl(preset.value)}
                              alt={preset.label}
                              className="w-full h-full object-cover"
                            />
                            <div className="absolute inset-x-0 bottom-0 bg-black/70 p-1 text-[9px] text-white truncate text-center">
                              {preset.label}
                            </div>
                            {isSelected && (
                              <div className="absolute top-1 right-1 bg-[#BC6C25] text-white rounded-full p-0.5 shadow-sm">
                                <Check className="w-2.5 h-2.5" />
                              </div>
                            )}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                ) : (
                  <div className="space-y-1.5">
                    <Input
                      value={editingBanner.image}
                      onChange={(e) =>
                        setEditingBanner({ ...editingBanner, image: e.target.value })
                      }
                      placeholder="https://exemplo.com/foto-banner.jpg"
                      className="text-sm"
                    />
                  </div>
                )}
              </div>

              {/* Live Mini Preview inside Dialog */}
              <div className="space-y-1.5">
                <Label className="text-xs font-bold text-gray-500">Prévia Visual</Label>
                <div className="relative overflow-hidden rounded-2xl min-h-[140px] shadow border border-gray-300">
                  <div className="absolute inset-0 z-0">
                    <img
                      src={getImageUrl(editingBanner.image)}
                      alt={editingBanner.title.pt}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-r from-[#0F1716]/95 via-[#0F1716]/75 to-transparent" />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0F1716]/90 via-transparent to-transparent" />
                  </div>

                  <div className="relative z-10 p-4 text-white max-w-md flex flex-col justify-between min-h-[140px]">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-[#BC6C25] text-white text-[9px] font-bold uppercase tracking-wider">
                          <Sparkles className="w-2.5 h-2.5 text-amber-300" />
                          {editingBanner.badge.pt || "Destaque"}
                        </span>
                        <span className="text-[10px] text-white/80">
                          {editingBanner.location.pt || "Barra Grande"}
                        </span>
                      </div>
                      <h4 className="font-display font-bold text-sm text-white line-clamp-1">
                        {editingBanner.title.pt || "Título do Banner"}
                      </h4>
                      <p className="text-[11px] text-white/80 line-clamp-2 mt-0.5">
                        {editingBanner.subtitle.pt || "Descrição do banner aparecerá aqui..."}
                      </p>
                    </div>

                    {editingBanner.categoryTarget && (
                      <div className="pt-2">
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-white/20 text-white text-[10px] font-bold uppercase">
                          Ver Pratos →
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          <DialogFooter className="gap-2 sm:gap-0">
            <Button
              variant="outline"
              onClick={() => setIsDialogOpen(false)}
              className="rounded-lg text-sm"
            >
              Cancelar
            </Button>
            <Button
              onClick={handleSave}
              className="bg-[#BC6C25] hover:bg-[#9E571C] text-white rounded-lg text-sm font-bold"
            >
              Salvar Banner
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ================= FULL PREVIEW MODAL ================= */}
      <Dialog open={isPreviewOpen} onOpenChange={setIsPreviewOpen}>
        <DialogContent className="max-w-xl bg-[#F2EEE4] rounded-3xl p-6 border border-[#E5DFD3]">
          <DialogHeader>
            <DialogTitle className="font-display uppercase tracking-wider text-lg text-[#1A2B2A]">
              Prévia do Banner no Cardápio
            </DialogTitle>
            <DialogDescription className="text-xs text-[#7A7568]">
              Exatamente como o cliente visualiza no topo do cardápio digital em tempo real.
            </DialogDescription>
          </DialogHeader>

          {previewingBanner && (
            <div className="relative overflow-hidden rounded-3xl min-h-[180px] shadow-xl border border-[#D9D2C2]/60 mt-2">
              <div className="absolute inset-0 z-0">
                <img
                  src={getImageUrl(previewingBanner.image)}
                  alt={previewingBanner.title.pt}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-[#0F1716]/95 via-[#0F1716]/75 to-transparent" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0F1716]/90 via-transparent to-transparent" />
              </div>

              <div className="relative z-10 p-6 text-white max-w-lg flex flex-col justify-between min-h-[180px]">
                <div>
                  <div className="flex items-center gap-2 mb-1.5">
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-[#BC6C25] text-white text-[10px] font-bold uppercase tracking-wider border border-white/20">
                      <Sparkles className="w-3 h-3 text-amber-300" />
                      {previewingBanner.badge.pt}
                    </span>
                    <span className="text-[11px] text-white/80 font-medium">
                      {previewingBanner.location.pt}
                    </span>
                  </div>

                  <h3 className="font-display text-xl font-bold tracking-tight text-white">
                    {previewingBanner.title.pt}
                  </h3>

                  <p className="text-xs text-white/85 mt-1 leading-relaxed">
                    {previewingBanner.subtitle.pt}
                  </p>
                </div>

                {previewingBanner.categoryTarget && (
                  <div className="pt-3">
                    <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-white/20 text-white text-xs font-bold uppercase tracking-wider border border-white/30">
                      Ver Pratos →
                    </span>
                  </div>
                )}
              </div>
            </div>
          )}

          <DialogFooter className="mt-4">
            <Button
              onClick={() => setIsPreviewOpen(false)}
              className="w-full bg-[#1A2B2A] hover:bg-[#2A3B3A] text-white font-bold rounded-xl"
            >
              Fechar Prévia
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};
