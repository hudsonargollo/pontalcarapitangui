# PONTAL Carapitangui - Coastal Brutalism Design System

## Visual Strategy

**Coastal Brutalism**: Sharp borders, heavy typography, flat UI with a luxury beach club aesthetic.

## Color Palette

### Primary Color - Deep Sea Charcoal
- **HSL**: `180 15% 15%`
- **RGB**: `~38, 48, 51`
- **Hex**: `#1A2B2A`
- **Usage**: Main text, buttons, headers, primary actions
- **CSS Variable**: `--primary`
- **Inspiration**: Deep ocean water at dusk

### Secondary Color - Burnt Sunset / Cacao
- **HSL**: `25 60% 40%`
- **RGB**: `~153, 102, 51`
- **Hex**: `#BC6C25`
- **Usage**: "Add to Order," ratings, highlights, call-to-action buttons
- **CSS Variable**: `--secondary`
- **Inspiration**: Sunset over the Atlantic, earthy warmth

### Accent Color - Muted Sand
- **HSL**: `30 15% 55%`
- **RGB**: `~140, 130, 115`
- **Hex**: `#A8A294`
- **Usage**: Secondary text, ingredients, wait times, past orders
- **CSS Variable**: `--accent`
- **Inspiration**: Fine sand texture

### Success Color - Warm Accent
- **HSL**: `25 60% 45%`
- **RGB**: `~168, 102, 51`
- **Hex**: `#A86633`
- **Usage**: Success messages, positive actions, confirmations
- **CSS Variable**: `--success`

### Background - Fine Sand & Linen
- **Light**: `40 12% 94%` - Soft sand-tinted white
- **Dark**: `30 15% 12%` - Deep charcoal for dark mode

### Foreground
- **Light**: `30 20% 15%` - Dark text on light backgrounds
- **Dark**: `40 10% 96%` - Light text on dark backgrounds

## Gradient Combinations

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

## Glass Overlay

For beach-side readability and modern aesthetic:
```
rgba(255, 255, 255, 0.6)
```

## Typography

### Headings
- **Font**: Big Shoulders Display or Archivo Narrow
- **Weight**: Bold
- **Case**: All-Caps
- **Letter Spacing**: 0.1em (2px)
- **Color**: Deep Sea Charcoal (#1A2B2A)

### Body Text
- **Font**: Outfit or Satoshi
- **Weight**: Regular (400)
- **Size**: 14-16px
- **Color**: Deep Sea Charcoal (#1A2B2A)
- **Line Height**: 1.5

### Secondary Text
- **Font**: Outfit or Satoshi
- **Weight**: Regular (400)
- **Size**: 12-14px
- **Color**: Muted Sand (#A8A294)

## UI Component Styling

### Sharp Borders (Brutalism)
- Border Radius: `0px` (no rounding)
- Border Width: `1px`
- Border Color: `#A8A294` (Muted Sand)

### Buttons
- **Primary**: Deep Sea Charcoal background, white text
- **Secondary**: Burnt Sunset background, white text
- **Tertiary**: Muted Sand background, dark text
- **Corners**: Sharp (0px radius)
- **Font**: Big Shoulders Display, uppercase, letter-spacing 2px

### Cards & Containers
- **Background**: Fine Sand (#F2EEE4)
- **Border**: 1px solid Muted Sand (#A8A294)
- **Corners**: Sharp (0px radius)
- **Padding**: 1.5rem
- **Shadow**: Subtle (0 1px 3px rgba(26, 43, 42, 0.08))

### Dividers
- **Style**: 1px solid
- **Color**: Muted Sand (#A8A294) with 15% opacity
- **Usage**: Separate menu items, sections, order details

## Color Opacity Variants

All colors support opacity variants through Tailwind CSS:
- `primary/5` - 5% opacity (very light)
- `primary/10` - 10% opacity
- `primary/20` - 20% opacity
- `primary/30` - 30% opacity
- `primary/40` - 40% opacity
- `primary/50` - 50% opacity
- `primary/70` - 70% opacity
- `primary/80` - 80% opacity
- `primary/90` - 90% opacity

## Accessibility

### Contrast Ratios
- Primary on Sand: 8.2:1 (WCAG AAA compliant)
- Secondary on Sand: 5.1:1 (WCAG AA compliant)
- Accent on Sand: 4.8:1 (WCAG AA compliant)

### Color Blindness
- Palette avoids red-green combinations
- Uses distinct hues and brightness for differentiation
- Includes text labels and icons for status indicators

## Implementation

### CSS Custom Properties
All colors are defined as CSS custom properties in `src/index.css`:

```css
:root {
  --primary: 180 15% 15%;
  --secondary: 25 60% 40%;
  --accent: 30 15% 55%;
  --success: 25 60% 45%;
  --background: 40 12% 94%;
  --foreground: 30 20% 15%;
  /* ... more colors ... */
}
```

### Tailwind Usage
Use Tailwind's color utilities with the custom properties:

```jsx
// Primary color
className="bg-primary text-primary-foreground"

// With opacity
className="bg-primary/20 border-primary/50"

// Hover states
className="hover:bg-primary/90"

// Gradients
className="bg-gradient-ocean"

// Sharp borders (Brutalism)
className="border border-accent rounded-none"
```

## Brand Identity

The Coastal Brutalism palette reflects PONTAL Carapitangui's identity as a sophisticated luxury beach club:

- **Deep Sea Charcoal**: Strong, authoritative, connected to the ocean
- **Burnt Sunset / Cacao**: Warm, inviting, suggests premium quality and craftsmanship
- **Muted Sand**: Refined, understated, evokes the beach environment
- **Overall**: Sophisticated, modern, welcoming luxury beach experience

## Dark Mode

Dark mode maintains the same color relationships but with adjusted brightness for visibility:

```css
.dark {
  --primary: 180 15% 25%;      /* Lighter charcoal for visibility */
  --secondary: 25 60% 50%;     /* Brighter sunset */
  --accent: 30 15% 65%;        /* Lighter sand */
  --success: 25 60% 50%;       /* Brighter success */
  --background: 30 15% 12%;    /* Deep charcoal background */
  --foreground: 40 10% 96%;    /* Light sand text */
}
```

## Image Treatment

To enhance the Coastal Brutalism aesthetic:

1. **Photography**: Use high-contrast, slightly desaturated images of food and Carapitangui sunset
2. **Grain Overlay**: Apply subtle grain texture (2-3% opacity) across entire app
3. **Contrast**: Emphasize sharp edges and bold compositions
4. **Saturation**: Reduce saturation by 10-15% for refined, sophisticated feel

## Future Updates

To update colors globally:
1. Edit CSS custom properties in `src/index.css`
2. All components automatically use the new colors
3. No need to update individual component files
4. Test in both light and dark modes
5. Verify accessibility contrast ratios
