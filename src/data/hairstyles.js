import {
  Square,
  User,
  Layers,
  Star,
  Flame,
  ChevronRight,
  Expand,
} from "lucide-react";

const hairstyles = [
  {
    id: "h1",
    name: "Buzz Cut",
    tagline: "Clean and sharp. Built for simplicity.",
    description: `The ultimate no-fuss, high-confidence haircut. Uniform short length all over — fast to style, never goes out of season. Our barbers precision-clip every length to match your face shape and head contour perfectly.`,
    icon: Square,
    image: "/hairstyles/buzz-cut.jpg",
  },
  {
    id: "h2",
    name: "Crew Cut",
    tagline: "Short and low-maintenance. Always in style.",
    description: `Timeless gentleman's cut: short on the sides with slight length on top. Polished enough for the boardroom, rugged enough for casual weekends — the ultimate versatile staple.`,
    icon: User,
    image: "/hairstyles/crew-cut.jpg",
  },
  {
    id: "h3",
    name: "Fade",
    tagline: "Smooth and seamless. Built for precision.",
    description: `Signature barbershop craftsmanship: a flawless gradient from skin on the sides to length on top. High fade, low fade, mid fade, drop fade — we blend it seamlessly every single time. Expect a mirror-shine finish.`,
    icon: Layers,
    image: "/hairstyles/fade.jpg",
  },
  {
    id: "h4",
    name: "Modern Mullet",
    tagline: "Edgy and versatile. Built to stand out.",
    description: `The 2025 reimagined mullet: short sharp front with controlled length and texture at the back. Controllable chaos — for gents who want a statement without the "2000s rockstar" costume vibe.`,
    icon: Star,
    image: "/hairstyles/modern-mullet.jpg",
  },
  {
    id: "h5",
    name: "Pompadour",
    tagline: "Bold and neat. Built for presence.",
    description: `Volume on top, volume everywhere that matters. A signature Gentleman cut — sculpted for height, texture, and a clean shape that turns heads from the boardroom to the bar.`,
    icon: Flame,
    image: "/hairstyles/pompadour.jpg",
  },
  {
    id: "h6",
    name: "Side Part",
    tagline: "Clean and confident. A staple for the modern gentleman.",
    description: `Classic split combed neatly to one side. The definition of "pulled together." Our barbers map your natural hair swirl to find the perfect line every single visit.`,
    icon: ChevronRight,
    image: "/hairstyles/side-part.jpg",
  },
  {
    id: "h7",
    name: "Taper",
    tagline: "Classic and refined. Built for balance.",
    description: `Gradual graduation of hair length at the neckline and sides. A softer, more natural cousin to the fade. Grows out cleanly — the "1 haircut every 3 weeks guys' favorite."`,
    icon: Expand,
    image: "/hairstyles/taper-fade.jpg",
  },
];

export default hairstyles;
