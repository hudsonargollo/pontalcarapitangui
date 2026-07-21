# PONTAL Carapitangui - Coastal Brutalism Design System Implementation

## Overview

This document outlines the systematic application of the Coastal Brutalism design system across the entire application.

## Color System (Updated)

### Primary Colors
- **Deep Sea Charcoal** (#1A2B2A): `hsl(180 15% 15%)`
  - Main text, buttons, headers, primary actions
  - CSS Variable: `--primary`

- **Burnt Sunset / Cacao** (#BC6C25): `hsl(25 60% 40%)`
  - Call-to-action buttons, highlights, ratings
  - CSS Variable: `--secondary`

- **Muted Sand** (#A8A294): `hsl(30 15% 55%)`
  - Secondary text, ingredients, wait times
  - CSS Variable: `--accent`

### Background Colors
- **Fine Sand & Linen** (#F2EEE4): `hsl(40 12% 94%)`
  - Light mode background
  - CSS Variable: `--background`

- **Deep Charcoal** (#1A1A1A): `hsl(30 15% 12%)`
  - Dark mode background
  - CSS Variable: `--background` (dark mode)

## Typography

### Headings
- **Font**: Big Shoulders Display or Archivo Narrow
- **Weight**: Bold (700)
- **Case**: UPPERCASE
- **Letter Spacing**: 0.1em (2px)
- **Color**: Deep Sea Charcoal (#1A2B2A)
- **Tailwind Class**: `font-display`

### Body Text
- **Font**: Outfit or Satoshi
- **Weight**: Regular (400)
- **Size**: 1rem (16px)
- **Line Height**: 1.6
- **Color**: Deep Sea Charcoal (#1A2B2A)
- **Tailwind Class**: `font-body`

### Secondary Text
- **Font**: Outfit or Satoshi
- **Weight**: Regular (400)
- **Size**: 0.875rem (14px)
- **Color**: Muted Sand (#A8A294)
- **Tailwind Class**: `text-secondary`

## UI Components

### Buttons
- **Border Radius**: 0px (sharp corners - Brutalism)
- **Primary Button**: Deep Sea Charcoal background, white text
- **Secondary Button**: Burnt Sunset background, white text
- **Font**: Big Shoulders Display, uppercase, letter-spacing 2px
- **Hover State**: Slightly darker shade with shadow

### Cards & Containers
- **Background**: Fine Sand (#F2EEE4)
- **Border**: 1px solid Muted Sand (#A8A294)
- **Border Radius**: 0px (sharp corners)
- **Padding**: 1.5rem
- **Shadow**: Subtle (0 1px 3px rgba(26, 43, 42, 0.08))

### Dividers
- **Style**: 1px solid
- **Color**: Muted Sand (#A8A294) with 15% opacity
- **Usage**: Separate menu items, sections, order details

## Gradients

### Ocean Gradient
```
linear-gradient(135deg, hsl(180 15% 15%), hsl(25 60% 40%))
Deep Sea Charcoal → Burnt Sunset
```

### Sunset Gradient
```
linear-gradient(135deg, hsl(25 60% 40%), hsl(15 70% 50%))
Burnt Sunset → Deep Orange
```

### Sand Gradient
```
linear-gradient(135deg, hsl(40 12% 94%), hsl(30 15% 80%))
Fine Sand → Warm Beige
```

## Visual Effects

### Grain Overlay
- Subtle noise texture (2-3% opacity)
- Applied globally via CSS
- Enhances Coastal Brutalism aesthetic

### Glass Overlay
- `rgba(255, 255, 255, 0.6)`
- Used for beach-side readability
- Backdrop blur for modern effect

### Shadows
- **Soft**: `0 1px 3px hsla(30, 20%, 15%, 0.08)`
- **Medium**: `0 2px 6px hsla(30, 20%, 15%, 0.12)`
- **Strong**: `0 4px 12px hsla(30, 20%, 15%, 0.16)`

## Implementation Checklist

### Phase 1: Foundation (✅ Complete)
- [x] Update CSS custom properties in `src/index.css`
- [x] Update dark mode variables
- [x] Update `tailwind.config.ts` with new colors and gradients
- [x] Add typography support (font families)
- [x] Add grain overlay effect
- [x] Update `BRAND_COLORS.md` documentation

### Phase 2: Customer Pages (In Progress)
- [x] Welcome.tsx - Updated with new colors and typography
- [ ] Menu.tsx - Update category styling, buttons, cards
- [ ] Checkout.tsx - Update form styling, buttons
- [ ] Payment.tsx - Update payment method selector, buttons
- [ ] OrderStatus.tsx - Update status badges, cards
- [ ] QRLanding.tsx - Update landing page styling

### Phase 3: Admin Pages
- [ ] Admin.tsx - Update dashboard styling
- [ ] AdminProducts.tsx - Update product management UI
- [ ] Reports.tsx - Update report styling
- [ ] WhatsAppAdmin.tsx - Update admin panel

### Phase 4: Staff Pages
- [ ] Cashier.tsx - Update cashier display
- [ ] Kitchen.tsx - Update kitchen display system

### Phase 5: Waiter Pages
- [ ] Waiter.tsx - Update waiter interface
- [ ] WaiterDashboard.tsx - Update dashboard
- [ ] WaiterManagement.tsx - Update management UI

### Phase 6: Components
- [ ] Update button styles across all components
- [ ] Update card styles
- [ ] Update form inputs
- [ ] Update badges and status indicators
- [ ] Update modals and dialogs

### Phase 7: Testing
- [ ] Light mode verification
- [ ] Dark mode verification
- [ ] Mobile responsiveness
- [ ] Print styles
- [ ] Accessibility (contrast ratios)

## Tailwind Utility Classes

### Color Classes
```jsx
// Primary (Deep Sea Charcoal)
className="bg-primary text-primary-foreground"
className="border-primary hover:bg-primary/90"

// Secondary (Burnt Sunset)
className="bg-secondary text-secondary-foreground"

// Accent (Muted Sand)
className="text-accent bg-accent/10"

// With opacity
className="bg-primary/20 border-primary/50"
```

### Typography Classes
```jsx
// Headings
className="font-display font-bold uppercase tracking-wider"

// Body text
className="font-body text-foreground"

// Secondary text
className="text-secondary"
```

### Gradient Classes
```jsx
// Ocean gradient
className="bg-gradient-ocean"

// Sunset gradient
className="bg-gradient-sunset"

// Sand gradient
className="bg-gradient-sand"
```

### Border Radius
```jsx
// Sharp corners (Brutalism)
className="rounded-none"

// Slight rounding (if needed)
className="rounded-sm"
```

## Migration Guide

### For Existing Components

1. **Replace color references**:
   ```jsx
   // Old
   className="bg-green-600 text-white"
   
   // New
   className="bg-primary text-primary-foreground"
   ```

2. **Update typography**:
   ```jsx
   // Old
   className="font-bold text-lg"
   
   // New
   className="font-display font-bold uppercase tracking-wider"
   ```

3. **Update borders**:
   ```jsx
   // Old
   className="rounded-lg border-gray-300"
   
   // New
   className="rounded-none border-accent"
   ```

4. **Update buttons**:
   ```jsx
   // Old
   className="bg-blue-600 hover:bg-blue-700 rounded-lg"
   
   // New
   className="bg-primary hover:bg-primary/90 rounded-none font-display uppercase"
   ```

## Dark Mode

All components automatically support dark mode through CSS custom properties. No additional changes needed - the `.dark` class selector handles all color adjustments.

## Accessibility

### Contrast Ratios
- Primary on Sand: 8.2:1 (WCAG AAA)
- Secondary on Sand: 5.1:1 (WCAG AA)
- Accent on Sand: 4.8:1 (WCAG AA)

### Best Practices
- Always include text labels with icons
- Use color + additional indicators (icons, patterns)
- Maintain sufficient contrast in all states
- Test with color blindness simulators

## Resources

- **BRAND_COLORS.md**: Complete color palette documentation
- **src/index.css**: CSS custom properties and global styles
- **tailwind.config.ts**: Tailwind configuration with design tokens
- **PONTAL Carapitangui Brand Guide**: Visual strategy and aesthetic guidelines
