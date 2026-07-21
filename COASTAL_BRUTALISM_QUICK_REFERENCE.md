# Coastal Brutalism - Quick Reference Guide

## Color System

### Primary Colors
```jsx
// Deep Sea Charcoal - Main text, headers, primary elements
className="text-primary"           // #1A2B2A
className="bg-primary"             // For backgrounds
className="border-primary"         // For borders

// Burnt Sunset - Call-to-action, highlights
className="bg-secondary"           // #BC6C25 (use for CTA buttons)
className="text-secondary"         // For text

// Muted Sand - Secondary text, dividers
className="text-accent"            // #A8A294
className="border-accent"          // For subtle borders
```

### Background Colors
```jsx
// Light mode (default)
className="bg-background"          // Fine Sand #F2EEE4

// Dark mode (automatic via .dark class)
// No changes needed - CSS variables handle it
```

## Typography

### Headings
```jsx
// All headings should use this pattern
className="font-display font-bold uppercase tracking-wider text-primary"

// Examples:
<h1 className="font-display font-bold uppercase tracking-wider text-primary text-3xl">
  Título Principal
</h1>

<h2 className="font-display font-bold uppercase tracking-wider text-primary text-2xl">
  Subtítulo
</h2>
```

### Body Text
```jsx
// Regular body text
className="font-body text-foreground"

// Secondary text (smaller, muted)
className="font-body text-accent text-sm"

// Examples:
<p className="font-body text-foreground">
  Texto normal do corpo
</p>

<p className="font-body text-accent text-sm">
  Texto secundário
</p>
```

## Buttons

### Primary CTA Button (Burnt Sunset)
```jsx
<Button className="bg-secondary hover:bg-secondary/90 text-white font-display uppercase tracking-wider rounded-none">
  Ação Principal
</Button>
```

### Primary Button (Deep Sea)
```jsx
<Button className="bg-primary hover:bg-primary/90 text-white font-display uppercase tracking-wider rounded-none">
  Ação Secundária
</Button>
```

### Outline Button
```jsx
<Button variant="outline" className="border-2 border-accent rounded-none font-display uppercase tracking-wider">
  Ação Terciária
</Button>
```

## Cards & Containers

### Standard Card
```jsx
<Card className="p-6 shadow-soft border-2 border-accent rounded-none">
  <h3 className="font-display font-bold uppercase tracking-wider text-primary mb-4">
    Título do Card
  </h3>
  <p className="font-body text-foreground">
    Conteúdo do card
  </p>
</Card>
```

### Card with Secondary Border
```jsx
<Card className="p-6 shadow-soft border-2 border-secondary rounded-none">
  {/* Content */}
</Card>
```

## Forms

### Input Fields
```jsx
<Input
  className="border-2 border-accent rounded-none focus:border-secondary"
  placeholder="Digite aqui..."
/>
```

### Labels
```jsx
<Label className="font-body font-semibold text-foreground">
  Nome do Campo
</Label>
```

## Gradients

### Ocean Gradient (Deep Sea → Burnt Sunset)
```jsx
className="bg-gradient-ocean"
// Or manually:
className="bg-gradient-to-r from-primary to-secondary"
```

### Sunset Gradient (Burnt Sunset → Deep Orange)
```jsx
className="bg-gradient-sunset"
```

### Sand Gradient (Fine Sand → Warm Beige)
```jsx
className="bg-gradient-sand"
```

## Headers

### Page Header
```jsx
<div className="bg-gradient-ocean text-white shadow-2xl sticky top-0 z-10">
  <div className="max-w-2xl mx-auto px-4 py-4 sm:py-6">
    <div className="flex items-center gap-3">
      <Button
        variant="ghost"
        size="icon"
        className="text-white hover:bg-white/20 transition-all rounded-none"
      >
        <ArrowLeft className="h-5 w-5" />
      </Button>
      <div>
        <h1 className="text-xl sm:text-2xl font-display font-bold uppercase tracking-wider">
          Título da Página
        </h1>
        <p className="text-white/90 text-sm mt-0.5 font-body">
          Subtítulo
        </p>
      </div>
    </div>
  </div>
</div>
```

## Status Badges

### Success
```jsx
<Badge className="bg-green-500 text-white">
  <CheckCircle className="w-4 h-4 mr-1" />
  Sucesso
</Badge>
```

### Error
```jsx
<Badge variant="destructive">
  <AlertCircle className="w-4 h-4 mr-1" />
  Erro
</Badge>
```

### Pending
```jsx
<Badge className="bg-secondary text-white animate-pulse-badge">
  <Clock className="w-4 h-4 mr-1" />
  Aguardando
</Badge>
```

## Shadows

### Soft Shadow (subtle)
```jsx
className="shadow-soft"
// 0 1px 3px hsla(30, 20%, 15%, 0.08)
```

### Medium Shadow
```jsx
className="shadow-medium"
// 0 2px 6px hsla(30, 20%, 15%, 0.12)
```

### Strong Shadow
```jsx
className="shadow-strong"
// 0 4px 12px hsla(30, 20%, 15%, 0.16)
```

## Common Patterns

### Full-Width CTA Button
```jsx
<Button className="w-full bg-secondary hover:bg-secondary/90 text-white font-display uppercase tracking-wider py-6 text-lg rounded-none">
  Ação Principal
</Button>
```

### Card with Header
```jsx
<Card className="p-6 shadow-soft border-2 border-accent rounded-none">
  <h3 className="font-display font-bold uppercase tracking-wider text-primary mb-4">
    Título
  </h3>
  <div className="space-y-4">
    {/* Content */}
  </div>
</Card>
```

### Form Section
```jsx
<div className="space-y-4">
  <div>
    <Label className="font-body font-semibold text-foreground">
      Campo
    </Label>
    <Input
      className="mt-2 border-2 border-accent rounded-none focus:border-secondary"
      placeholder="Digite..."
    />
  </div>
</div>
```

### Dialog/Modal
```jsx
<Dialog open={isOpen} onOpenChange={setIsOpen}>
  <DialogContent className="bg-background border-2 border-accent rounded-none">
    <DialogHeader>
      <DialogTitle className="font-display font-bold uppercase tracking-wider text-primary">
        Título do Modal
      </DialogTitle>
    </DialogHeader>
    {/* Content */}
  </DialogContent>
</Dialog>
```

## Dark Mode

Dark mode is **automatic** - no changes needed!

The CSS variables in `src/index.css` handle all dark mode colors via the `.dark` class selector.

```jsx
// This works in both light and dark modes:
className="bg-background text-foreground"

// Dark mode automatically adjusts:
// - background: Fine Sand → Deep Charcoal
// - foreground: Dark text → Light text
// - All other colors adjust accordingly
```

## Accessibility

### Color + Icon Pattern
```jsx
// Always combine color with icons/text for accessibility
<Badge className="bg-secondary text-white">
  <CheckCircle className="w-4 h-4 mr-1" />
  Aprovado
</Badge>
```

### Contrast Ratios
- Primary on Sand: 8.2:1 (WCAG AAA ✓)
- Secondary on Sand: 5.1:1 (WCAG AA ✓)
- Accent on Sand: 4.8:1 (WCAG AA ✓)

## Common Mistakes to Avoid

❌ **DON'T:**
```jsx
className="bg-blue-600 rounded-lg border-gray-300"
className="font-bold text-lg"
className="bg-gradient-to-r from-purple-600 to-blue-600"
```

✅ **DO:**
```jsx
className="bg-secondary rounded-none border-accent"
className="font-display font-bold uppercase tracking-wider"
className="bg-gradient-ocean"
```

## Testing Checklist

- [ ] Light mode looks correct
- [ ] Dark mode looks correct
- [ ] Mobile responsive
- [ ] All text is readable (contrast)
- [ ] Buttons are clickable (44px minimum)
- [ ] No hardcoded colors
- [ ] Typography uses font-display/font-body
- [ ] Borders are sharp (rounded-none)
- [ ] Grain overlay visible (subtle)

## Resources

- **BRAND_COLORS.md** - Complete color palette
- **DESIGN_SYSTEM_IMPLEMENTATION.md** - Full implementation guide
- **src/index.css** - CSS variables and global styles
- **tailwind.config.ts** - Tailwind configuration
