---
name: Eco-Tech Marketplace
colors:
  surface: '#f8f9ff'
  surface-dim: '#ccdbf3'
  surface-bright: '#f8f9ff'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#eff4ff'
  surface-container: '#e6eeff'
  surface-container-high: '#dce9ff'
  surface-container-highest: '#d5e3fc'
  on-surface: '#0d1c2e'
  on-surface-variant: '#3f493f'
  inverse-surface: '#233144'
  inverse-on-surface: '#eaf1ff'
  outline: '#6f7a6e'
  outline-variant: '#becabc'
  surface-tint: '#006d30'
  primary: '#00652c'
  on-primary: '#ffffff'
  primary-container: '#15803d'
  on-primary-container: '#d3ffd5'
  inverse-primary: '#79db8d'
  secondary: '#006591'
  on-secondary: '#ffffff'
  secondary-container: '#39b8fd'
  on-secondary-container: '#004666'
  tertiary: '#97344a'
  on-tertiary: '#ffffff'
  tertiary-container: '#b64c62'
  on-tertiary-container: '#fff1f1'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#95f8a7'
  primary-fixed-dim: '#79db8d'
  on-primary-fixed: '#00210a'
  on-primary-fixed-variant: '#005323'
  secondary-fixed: '#c9e6ff'
  secondary-fixed-dim: '#89ceff'
  on-secondary-fixed: '#001e2f'
  on-secondary-fixed-variant: '#004c6e'
  tertiary-fixed: '#ffd9dd'
  tertiary-fixed-dim: '#ffb2bd'
  on-tertiary-fixed: '#400013'
  on-tertiary-fixed-variant: '#81233b'
  background: '#f8f9ff'
  on-background: '#0d1c2e'
  surface-variant: '#d5e3fc'
  emerald-wash: '#ecfdf5'
  status-available: '#22c55e'
  status-claimed: '#f59e0b'
  status-negotiation: '#6366f1'
  industry-neutral: '#1e293b'
typography:
  headline-lg:
    fontFamily: Geist
    fontSize: 32px
    fontWeight: '700'
    lineHeight: 40px
    letterSpacing: -0.02em
  headline-lg-mobile:
    fontFamily: Geist
    fontSize: 24px
    fontWeight: '700'
    lineHeight: 32px
    letterSpacing: -0.01em
  headline-md:
    fontFamily: Geist
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
    letterSpacing: -0.01em
  headline-sm:
    fontFamily: Geist
    fontSize: 20px
    fontWeight: '600'
    lineHeight: 28px
  body-lg:
    fontFamily: Inter
    fontSize: 18px
    fontWeight: '400'
    lineHeight: 28px
  body-md:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  body-sm:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 20px
  label-md:
    fontFamily: Geist
    fontSize: 14px
    fontWeight: '600'
    lineHeight: 20px
    letterSpacing: 0.01em
  label-sm:
    fontFamily: Geist
    fontSize: 12px
    fontWeight: '500'
    lineHeight: 16px
    letterSpacing: 0.02em
  data-mono:
    fontFamily: Geist
    fontSize: 13px
    fontWeight: '500'
    lineHeight: 18px
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  container-max: 1280px
  gutter: 1.5rem
  margin-mobile: 1rem
  margin-desktop: 2rem
  stack-sm: 0.5rem
  stack-md: 1rem
  stack-lg: 2rem
---

## Brand & Style

The design system is built for a professional, three-sided marketplace that bridges the gap between grassroots recycling and industrial processing. The brand personality is **Reliable, Sustainable, and Data-Driven**, aiming to evoke a sense of investor-ready stability and environmental impact.

The chosen style is **Corporate / Modern** with a focus on **Information-Dense Utility**. It leverages high-quality typography and a structured card-based layout to organize complex data—such as AI confidence scores, material weights, and logistical tracking—into a clean, manageable interface. The visual language balances the "earthiness" of recycling with the "precision" of technology through a refined color palette and professional SaaS aesthetics.

Key principles include:
- **Trustworthiness:** Using professional slate grays and clear borders to ensure users feel secure in financial transactions.
- **Sustainability:** Subtle use of deep greens and emerald washes to reinforce the circular economy mission.
- **Clarity:** Prioritizing functional data over decorative flourishes to support fast-paced decision-making for collectors and industrial buyers.

## Colors

The color palette is strategically designed to differentiate between the three marketplace roles while maintaining a cohesive brand identity. 

- **Primary (Deep Forest Green):** Represents the core mission of sustainability. Used for primary actions, brand elements, and the "Household" role.
- **Secondary (Sky Blue):** Symbolizes logistics and action. Used for tracking, maps, and the "Collector" role interaction points.
- **Neutral (Slate Gray):** Provides the professional foundation for typography and interface structure, ensuring high legibility against white surfaces.
- **Emerald Wash:** A very soft background tint used to differentiate sections or provide a "clean" feel to dashboard cards without the harshness of pure white.

Semantic colors are utilized for status tracking: Green for completed/available, Amber for claimed/pending, and Indigo for active negotiations.

## Typography

This design system employs a dual-font strategy to maximize technical clarity and readability. 

**Geist** is used for headlines, labels, and technical data. Its precise, geometric nature suits the "tech" side of the marketplace, making ID numbers, weights, and confidence scores feel structured and official.

**Inter** is used for all body text and descriptions. Its high legibility ensures that chat messages and marketplace descriptions remain accessible on both mobile and desktop screens.

A special `data-mono` style (using Geist's technical spacing) is reserved for material traceability IDs and batch numbers, giving them a distinct "system-generated" appearance.

## Layout & Spacing

The layout follows a **fluid grid** model optimized for high-density information display. 

- **Desktop:** A 12-column grid with 24px gutters. Dashboards utilize a "sidebar + main content" structure, where content is organized into cards that can span 4, 6, or 12 columns depending on data complexity.
- **Mobile:** A single-column fluid layout with 16px margins. Cards stack vertically, with horizontal scrolling reserved strictly for material category filters or image carousels.
- **Rhythm:** An 8px base unit drives all padding and margin decisions. Consistent "Stack" variables (`stack-sm`, `stack-md`) ensure vertical rhythm within cards and forms.

Layouts for the "Collector" role prioritize the map view, which should occupy the top 40% of the screen on mobile or a dedicated left-hand panel on desktop.

## Elevation & Depth

To maintain a professional SaaS aesthetic, hierarchy is established through **Tonal Layers** supplemented by **Ambient Shadows**.

1.  **Background:** The lowest layer, using pure white or the very light `emerald-wash` to define distinct content areas.
2.  **Surface (Cards):** Elevated slightly using a very soft, diffused shadow (e.g., `0 4px 12px rgba(0,0,0,0.05)`). This makes the information feel "tangible" and organized.
3.  **Interactive Elements:** Buttons and active input fields use a slightly more pronounced shadow on hover to indicate interactability.
4.  **Overlays:** Modals and "Offer/Counter-offer" drawers use a backdrop blur (glassmorphism lite) to maintain context of the underlying dashboard while focusing the user's attention.

Avoid heavy borders; instead, use 1px hairlines in light slate to define table rows and card boundaries.

## Shapes

The shape language is consistently **Rounded**, reflecting a modern and approachable "Eco-tech" feel.

- **Standard Elements:** Input fields, buttons, and small cards use a 0.5rem (8px) radius.
- **Large Containers:** Dashboard cards and main content areas use `rounded-lg` (16px) to create a distinct, modern containerized look.
- **Action Indicators:** Status badges and "Pills" use the maximum roundedness (pill-shaped) to distinguish them from interactive buttons.

This roundedness softens the data-heavy nature of the interface, making the platform feel friendly and accessible to everyday household users.

## Components

### Buttons
Primary buttons use the **Deep Forest Green** with white text. Secondary buttons for logistics actions use **Sky Blue**. All buttons should have a subtle 8px corner radius and a 2px vertical offset shadow to feel "pressable."

### Cards
The core of the marketplace. Cards must have a 16px radius and a light 1px slate border. Use the `emerald-wash` background for "Featured" or "AI-Verified" listings to give them a premium status.

### Input Fields
Inputs use a clean white background with a 1px slate border that thickens and changes to Forest Green on focus. Labels should use the `label-md` Geist typography for a technical feel.

### Chips & Badges
Used for waste categories (Plastic, Metal, etc.) and status tracking. These should be pill-shaped. Category chips should include a small icon from the Lucide set for quick visual recognition.

### Negotiation Thread
A unique component for offers. Use a split-bubble UI: "My Offer" bubbles in Forest Green (right) and "Counter-Offer" bubbles in Sky Blue (left), with clear weight and price metadata displayed in `data-mono` font.

### AI Confidence Score
A small circular progress indicator or a subtle percentage label in the `label-sm` font, placed in the top-right corner of uploaded waste images to show classification certainty.