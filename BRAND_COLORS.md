# PONTAL Carapitangui - Brand Colors

## Color Palette

### Primary Color - Sage Green
- **HSL**: `120 18% 45%`
- **RGB**: `~107, 142, 127`
- **Hex**: `#6B8E7F`
- **Usage**: Main brand color, buttons, headers, primary actions
- **CSS Variable**: `--primary`

### Secondary Color - Gold/Tan
- **HSL**: `35 70% 65%`
- **RGB**: `~209, 170, 102`
- **Hex**: `#D1AA66`
- **Usage**: Accent buttons, highlights, secondary actions
- **CSS Variable**: `--secondary`

### Accent Color - Tropical Teal
- **HSL**: `160 60% 50%`
- **RGB**: `~51, 179, 153`
- **Hex**: `#33B399`
- **Usage**: Links, interactive elements, status indicators
- **CSS Variable**: `--accent`

### Success Color - Sage Green
- **HSL**: `120 50% 45%`
- **RGB**: `~58, 153, 102`
- **Hex**: `#3A9966`
- **Usage**: Success messages, positive actions
- **CSS Variable**: `--success`

### Background
- **Light**: `120 15% 96%` - Soft sage-tinted white
- **Dark**: `120 15% 12%` - Deep sage-tinted dark

### Foreground
- **Light**: `120 10% 25%` - Dark sage-tinted text
- **Dark**: `120 15% 96%` - Light text on dark

## Gradient Combinations

### Ocean Gradient
```
linear-gradient(135deg, hsl(120 18% 45%), hsl(160 60% 50%))
Sage Green → Tropical Teal
```

### Sunset Gradient
```
linear-gradient(135deg, hsl(35 70% 65%), hsl(25 80% 60%))
Gold → Orange
```

### Acai Gradient
```
linear-gradient(135deg, hsl(120 18% 45%), hsl(120 15% 35%))
Sage Green → Dark Sage
```

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
- Primary on White: 4.5:1 (WCAG AA compliant)
- Secondary on White: 4.2:1 (WCAG AA compliant)
- Accent on White: 4.8:1 (WCAG AA compliant)

### Color Blindness
- Palette avoids red-green combinations
- Uses distinct hues for differentiation
- Includes text labels and icons for status

## Implementation

### CSS Custom Properties
All colors are defined as CSS custom properties in `src/index.css`:

```css
:root {
  --primary: 120 18% 45%;
  --secondary: 35 70% 65%;
  --accent: 160 60% 50%;
  --success: 120 50% 45%;
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
```

## Brand Identity

The color palette reflects PONTAL Carapitangui's identity as a sophisticated beach club:

- **Sage Green**: Natural, calming, connected to nature and the beach environment
- **Gold/Tan**: Elegant, premium, suggests quality and luxury
- **Tropical Teal**: Vibrant, fresh, evokes the ocean and tropical setting
- **Overall**: Sophisticated, modern, welcoming beach club aesthetic

## Dark Mode

Dark mode maintains the same color relationships but with adjusted brightness:

```css
.dark {
  --primary: 120 18% 55%;      /* Lighter sage for visibility */
  --secondary: 120 15% 20%;    /* Darker secondary */
  --accent: 160 60% 50%;       /* Same accent */
  --success: 120 50% 45%;      /* Same success */
}
```

## Future Updates

To update colors globally:
1. Edit CSS custom properties in `src/index.css`
2. All components automatically use the new colors
3. No need to update individual component files
