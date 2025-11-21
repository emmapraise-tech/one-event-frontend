# Typography System

## Font Families

### Primary Typeface: Inter
- **Use for:** Body text, forms, dashboard UI, buttons
- **Weights:** Regular (400), Medium (500), Semi-bold (600)
- **CSS Variable:** `--font-inter`
- **Class:** `.font-body`

### Display Typeface: Poppins
- **Use for:** Headings (H1–H4), landing page hero sections, key page titles
- **Weights:** Medium (500), Semi-bold (600), Bold (700)
- **CSS Variable:** `--font-poppins`
- **Class:** `.font-display`

### Accent Typeface: Playfair Display
- **Use for:** Luxury venue highlights, special promo banners, category headers
- **Weights:** Regular (400), Medium (500)
- **CSS Variable:** `--font-playfair`
- **Class:** `.font-accent`

## Typography Scale

### H1 – Hero Titles
- **Font:** Poppins Bold (700)
- **Size:** 48px (mobile) / 56px (desktop)
- **Letter spacing:** -1%
- **Line height:** 1.2
- **Use:** Landing page hero, major section titles
- **Class:** `.h1` or use `<h1>` tag

### H2 – Section Headers
- **Font:** Poppins Semi-bold (600)
- **Size:** 32px (mobile) / 40px (desktop)
- **Letter spacing:** -0.5%
- **Line height:** 1.3
- **Use:** Dashboard title, venue category titles
- **Class:** `.h2` or use `<h2>` tag

### H3 – Subsection Titles
- **Font:** Poppins Medium (500)
- **Size:** 24px (mobile) / 28px (desktop)
- **Line height:** 1.4
- **Use:** Card titles, list headers
- **Class:** `.h3` or use `<h3>` tag

### H4 – Small Section Titles
- **Font:** Poppins Medium (500)
- **Size:** 20px / 22px
- **Line height:** 1.4
- **Use:** Pricing, booking summary headers
- **Class:** `.h4` or use `<h4>` tag

### Paragraph (Body)
- **Font:** Inter Regular (400)
- **Size:** 16px
- **Line height:** 1.6
- **Use:** Forms, descriptions, dashboard content
- **Class:** `.body` or use `<p>` tag

### Small Text / Labels
- **Font:** Inter Medium (500)
- **Size:** 14px
- **Line height:** 1.5
- **Use:** Tags, filters, button text, metadata
- **Class:** `.small` or use with labels

### Caption / Micro Copy
- **Font:** Inter Regular (400)
- **Size:** 12px
- **Line height:** 1.5
- **Use:** Hints, disclaimers, helper text
- **Class:** `.caption`

## Usage Examples

### Buttons
```tsx
<Button className="small">Button Text</Button>
// Font: Inter Medium 14-16px
```

### Navigation / Sidebar
```tsx
<Link className="small">Navigation Item</Link>
// Font: Inter Medium 14-15px
```

### Venue Cards
```tsx
<h3 className="h4">Venue Title</h3>
// Title: Poppins Medium 20px

<span className="font-semibold">Price</span>
// Price: Inter Semi-bold 16px

<span className="small">Metadata</span>
// Metadata: Inter Regular 14px
```

### Forms
```tsx
<Label className="small">Form Label</Label>
// Labels: Inter Medium 14px

<Input className="body" />
// Inputs: Inter Regular 16px
```

## CSS Variables

All typography values are available as CSS variables:

```css
--font-h1-size: 48px / 56px
--font-h2-size: 32px / 40px
--font-h3-size: 24px / 28px
--font-h4-size: 20px / 22px
--font-body-size: 16px
--font-small-size: 14px
--font-caption-size: 12px
```

## Implementation

The typography system is automatically applied through:
1. Font imports in `layout.tsx`
2. CSS variables and utility classes in `globals.css`
3. Semantic HTML tags (h1-h4, p) automatically use correct typography
4. Utility classes (`.h1`, `.h2`, `.body`, `.small`, `.caption`) for custom elements

