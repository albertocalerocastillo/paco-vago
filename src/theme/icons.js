/* ════════════════════════════════════════════════════════════
   ICONOS — Catálogo único de iconografía
   Equivalente a Theme/Icons.ts de tms.web.

   Toda la app importa los iconos DESDE AQUÍ, no desde lucide-react
   directamente. Así, si algún día cambiamos de librería de iconos
   o sustituimos uno, solo se toca este fichero.
   ════════════════════════════════════════════════════════════ */

// Iconos de interfaz (lucide-react)
export {
  ChevronRight,
  Menu,
  X,
  Phone,
  MapPin,
  Clock
} from 'lucide-react';

// Iconos de categorías de producto (lucide-react)
export {
  Wheat,
  Wine,
  ShoppingBag,
  Palette,
  Home,
  Tent,
  Sparkles,
  Car,
  Candy
} from 'lucide-react';

// Iconos de marca personalizados (SVG propios: lucide eliminó los iconos
// de marcas comerciales en la v1.x)
export { default as InstagramIcon } from '../components/ui/InstagramIcon/InstagramIcon';
export { default as WhatsAppIcon } from '../components/ui/WhatsAppIcon/WhatsAppIcon';
export { default as TikTokIcon } from '../components/ui/TikTokIcon/TikTokIcon';
