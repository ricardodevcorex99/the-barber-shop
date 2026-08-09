---
version: alpha
name: THE BARBER SHOP — Dark Matte Gold
description: Landing page y sistema de reservas de una barbería premium. Estética de barbería de lujo en oscuro mate con acento dorado, tipografías display artesanales y micro-interacciones contenidas.
colors:
  primary: "#d4af37"
  primary-light: "#f0c75e"
  primary-dark: "#b8960e"
  primary-darkest: "#9a7d0c"
  neutral: "#0b0b0b"
  surface: "#18181B"
  surface-elevated: "#27272A"
  surface-higher: "#3F3F46"
  on-surface: "#fffffe"
  on-surface-muted: "rgba(255, 255, 254, 0.7)"
  success: "#22c55e"
  error: "#ef4444"
  warning: "#f59e0b"
typography:
  display:
    fontFamily: UrbanJungle
    fontSize: 72px
    fontWeight: 400
    lineHeight: 0.95
    letterSpacing: 0.08em
  headline:
    fontFamily: Rockabye
    fontSize: 48px
    fontWeight: 400
    lineHeight: 1.1
  logo:
    fontFamily: QuicksilverFast
    fontSize: 24px
    fontWeight: 400
    lineHeight: 1
    letterSpacing: 0.04em
  brand:
    fontFamily: Sedgwick Ave
    fontSize: 16px
    fontWeight: 400
    lineHeight: 1.5
    letterSpacing: 0.15em
  body:
    fontFamily: Oregano
    fontSize: 16px
    fontWeight: 400
    lineHeight: 1.625
  price:
    fontFamily: Cinzel
    fontSize: 20px
    fontWeight: 400
    lineHeight: 1.5
    fontFeature: "tnum"
rounded:
  sm: 4px
  md: 6px
  lg: 8px
  xl: 12px
  xxl: 16px
  full: 9999px
spacing:
  xs: 4px
  sm: 8px
  md: 16px
  lg: 24px
  xl: 40px
  xxl: 64px
  section: 112px
  container: 1280px
components:
  button-primary:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.neutral}"
    rounded: "{rounded.md}"
    padding: 12px 24px
  button-primary-hover:
    backgroundColor: "{colors.primary-light}"
  card:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.on-surface}"
    rounded: "{rounded.xl}"
  card-checked:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.on-surface}"
    rounded: "{rounded.xl}"
  input:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.on-surface}"
    rounded: "{rounded.lg}"
  chip-selected:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.neutral}"
    rounded: "{rounded.full}"
  chip-active:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.neutral}"
    rounded: "{rounded.full}"
  divider:
    backgroundColor: "{colors.primary}"
    width: 64px
    height: 1px
  nav-link:
    textColor: "{colors.on-surface}"
    height: 40px
  nav-link-active:
    textColor: "{colors.primary}"
    height: 40px
  text-muted:
    textColor: "{colors.on-surface-muted}"
  scrollbar-track:
    backgroundColor: "{colors.neutral}"
    width: 10px
  scrollbar-thumb:
    backgroundColor: "{colors.surface-higher}"
    width: 10px
  success-text:
    textColor: "{colors.success}"
  warning-text:
    textColor: "{colors.warning}"
  error-text:
    textColor: "{colors.error}"
  card-elevated:
    backgroundColor: "{colors.surface-elevated}"
    textColor: "{colors.on-surface}"
    rounded: "{rounded.xl}"
  border-strong:
    backgroundColor: "{colors.primary-dark}"
    height: 1px
    rounded: "{rounded.full}"
  gold-border:
    backgroundColor: "{colors.neutral}"
    rounded: "{rounded.xl}"
  border-strongest:
    backgroundColor: "{colors.primary-darkest}"
    height: 2px
    rounded: "{rounded.full}"
---

## Overview

**Barbería de lujo con estética de mercado urbano.** El sitio debe transmitir la
calidad artesanal de una barbería premium: superficies en negro mate profundo,
un único acento dorado metálico para todo lo interactivo y tipografías display
de carácter (UrbanJungle, Rockabye, QuicksilverFast) que refuerzan la identidad
de la marca por encima de los estilos de sistema genéricos.

El tono es **confidente y contenido**: nada de brillos excesivos, gradientes
ruidosos ni animaciones constantes. La elegancia viene del contraste alto
(negro mate sobre texto casi blanco), del oro aplicado con moderación y de
micro-interacciones suaves (tilt, spotlight, press feedback) que solo ocurren
en hover con puntero fino.

## Colors

La paleta se apoya en **neutros de altísimo contraste** y un único acento
metálico.

- **Neutral (#0b0b0b):** Negro mate profundo. Fondo base de toda la página,
  también del track del scrollbar y del header con blur.
- **Surface (#18181B):** Superficie elevada (tarjetas, inputs, paneles glass).
- **Surface-elevated (#27272A) / Surface-higher (#3F3F46):** Capas superiores;
  la más clara se usa en el thumb del scrollbar.
- **On-surface (#fffffe):** Blanco crudo para todo el texto. Solo texto inverso
  sobre el dorado usa el negro mate.
- **Primary (#d4af37):** El oro. **Único driver de interacción**: botones
  primarios, checks activos, time slots seleccionados, nav activa, focus rings,
  borde y relleno de los logos SVG.
- **Primary-light (#f0c75e):** Hover sobre dorado (más claro).
- **Primary-dark / Primary-darkest (#b8960e / #9a7d0c):** Tonos dorados oscuros
  para bordes y estados que requieren menos protagonismo.

Regla de oro: los estados activos/seleccionados siempre son fondo dorado con
texto negro mate y un glow `rgba(212, 175, 55, X)`; nunca al revés.

## Typography

Estrategia de **tipografías display con carácter** para identidad, y una fuente
cursiva legible como cuerpo principal.

- **Display (UrbanJungle):** Solo el título del hero. Uppercase, `letter-spacing
  0.08em`, `line-height 0.95`, con text-shadow dorado sutil y micro-scale en
  hover. Es la firma de la marca; no debe repetirse en otros lugares.
- **Headline (Rockabye):** Títulos de sección. Display condensado, sin peso.
- **Logo (QuicksilverFast):** "THE BARBER SHOP" en header y footer. Tracking
  amplio, blanco con hover dorado.
- **Brand (Sedgwick Ave):** Etiquetas con personalidad (labels de photo stack),
  siempre uppercase con `letter-spacing 0.15em`.
- **Body (Oregano):** Texto y UI general. Cursiva cálida que compensa el dark;
  se renderiza ~15% más grande que el tamaño declarado, así que los tamaños
  pequeños se suben un escalón (`.text-[9px]` → 12px, `.text-xs` → 0.875rem…).
- **Price (Cinzel):** Precios y números. Usa `font-variant-numeric: tabular-nums`
  para que las cifras queden alineadas.

Convención: Cinzel + Sedgwick Ave + Oregano vienen de Google Fonts;
UrbanJungle, Chicanos, Rockabye y QuicksilverFast son fuentes locales
(`@font-face` en styles.css, carpetas `fonts/`).

## Layout

Layout **container centrado** con un máximo de `1280px` y padding lateral de
`1.5rem` (móvil) a `2rem` (escritorio).

Escala de espaciado de **base 4px**. Las secciones usan `py-24` en móvil y
`md:py-28` en escritorio. Los grids de contenido (tarjetas de servicios,
barberos, galería) usan separaciones de `16–24px` entre elementos. El texto
aplica `text-wrap: balance` en títulos para evitar huérfanas.

El hero usa una gradiente radial dorada muy tenue (`rgba(212, 175, 55, 0.06)`)
sobre el fondo oscuro para dar profundidad sin competir con el logo.

## Elevation & Depth

La profundidad se logra por **capas tonales** y **glows dorados**, no por
sombras negras pesadas:

- Tarjetas y paneles: fondo `#18181B` sobre `#0b0b0b`, con borde sutil
  `rgba(255, 255, 255, 0.07)`.
- **Glass panel** (formulario): `rgba(11, 11, 11, 0.55)` + `blur(20px)
  saturate(1.8)` + sombra interior superior e inferior que simulan luz y
  profundidad.
- **Glow dorado** como lenguaje de elevación interactiva: `0 8px 25px
  rgba(212, 175, 55, 0.12)` en hover de tarjetas, hasta `0 0 30–60px` en
  estados checked.
- Hay un **overlay de ruido** (`body::after`, opacidad 0.035) fijo encima de
  todo para romper la planitud digital; se desactiva con `prefers-reduced-motion`.

## Shapes

Lenguaje de formas **rectilíneo con esquinas suaves contenidas**: radio
predominante de `8–12px` en tarjetas e inputs, `6px` en botones, `9999px` en
checks e iconos. Las fotos del photo-stack usan `12px` con borde blanco de 5px
aparentando polaroids.

## Components

- **Button primario:** fondo `primary`, texto negro mate, `radius 6px`.
  Hover: `primary-light`. Press: `scale(0.97)`. Sin gradientes.
- **Card de selección** (barberos, servicios, galería): fondo `surface`, borde
  sutil. Hover (puntero fino): `translateY(-3px)` + glow dorado tenue. Estado
  checked: borde dorado, glow `0 0 30px rgba(212,175,55,0.25)` e icono de check
  dorado.
- **Chip de selección** (time slots / preferencia de hora): igual que el card;
  el seleccionado es fondo dorado con texto negro mate.
- **Nav link:** texto blanco, `border-b-2` transparente que se ilumina en
  dorado en hover y en la sección activa.
- **Divider dorado:** `64px × 1px` centrado, revelado con `scaleX` animado
  (one-shot al entrar en viewport).
- **Header sticky:** `rgba(11, 11, 11, 0.95)` + `blur(12px)` + borde inferior
  `rgba(212, 175, 55, 0.15)` al hacer scroll.
- **Inputs:** fondo `surface`, texto `on-surface`, borde `rgba(255,255,255,0.07)`,
  error en `#ef4444`, focus ring dorado `2px`.

## Do's and Don'ts

- **Do** usar el dorado `#d4af37` solo para interacción, selección y acentos de
  marca (divisores, logos, focus).
- **Don't** usar gradientes dorados degradados; el oro es sólido.
- **Do** mantener texto casi blanco `#fffffe` sobre cualquier superficie oscura.
- **Don't** poner texto negro sobre superficies oscuras; el texto inverso
  (negro) solo va sobre dorado.
- **Do** aplicar `prefers-reduced-motion`: desactivar todo el movimiento
  (reveals, pulse, floating badge, hover transforms).
- **Don't** añadir animaciones en loop al contenido de valor (precios, texto);
  a lo sumo, reveals one-shot al entrar.
- **Do** mantener `md:py-28` en secciones y `md:p-12` en formularios para
  respiración premium.
- **Don't** volver a importar Inter, Montserrat, Permanent Marker o Just
  Another Hand en el `<link>` de Google Fonts.
- **Don't** reemplazar los nombres de las tipografías locales (UrbanJungle,
  Chicanos, Rockabye, QuicksilverFast) ni las rutas de `fonts/`.
- **Do** mantener la localización Ecuador: teléfonos en formato
  `098 326 7552` (nacional) / `+593 98 326 7552` (intl), dirección Carapungo,
  Quito, precios en USD.
- **Do** conservar los `id` de anclas (`hero`, `nosotros`, `galeria`,
  `servicios`, `reservas`) y los nombres de campos del formulario
  (`barber`, `client-*`, `description`, `selected-*`, `services`).
