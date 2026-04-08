import {
  Activity,
  Banknote,
  BriefcaseBusiness,
  CarFront,
  CalendarClock,
  Gauge,
  LayoutDashboard,
  Settings,
  ShoppingCart,
  Users,
  Wrench,
  Zap,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

export type NavigationItem = {
  title: string;
  href: string;
  icon?: LucideIcon;
  badgeKey?: string;
  children?: NavigationItem[];
};

export const statusLabels = {
  SERVISE_ALINIYOR: "Servise Aliniyor",
  BAKIM_ONARIMDA: "Bakim/Onarimda",
  PARCA_BEKLIYOR: "Parca Bekliyor",
  TESLIME_HAZIR: "Teslime Hazir",
  TESLIM_EDILDI: "Teslim Edildi",
  IPTAL: "Iptal",
} as const;

export const altStatusLabels = {
  MEKANIK: "Mekanik",
  ELEKTRIK: "Elektrik",
  KAPORTA: "Kaporta",
  BOYA: "Boya",
  HARICI_MEKANIK: "Harici Mekanik",
  HARICI_ELEKTRIK: "Harici Elektrik",
  HARICI_KAPORTA: "Harici Kaporta",
  HARICI_BOYA: "Harici Boya",
} as const;

export const statusColors = {
  SERVISE_ALINIYOR: "bg-sky-500/15 text-sky-300 border-sky-500/30",
  BAKIM_ONARIMDA: "bg-amber-500/15 text-amber-200 border-amber-500/30",
  PARCA_BEKLIYOR: "bg-yellow-500/15 text-yellow-200 border-yellow-500/30",
  TESLIME_HAZIR: "bg-emerald-500/15 text-emerald-200 border-emerald-500/30",
  TESLIM_EDILDI: "bg-green-500/15 text-green-200 border-green-500/30",
  IPTAL: "bg-rose-500/15 text-rose-200 border-rose-500/30",
} as const;

export const serviceTemplates = [
  "Periyodik bakim",
  "Fren balata degisimi",
  "On takim kontrolu",
  "Akumulator kontrolu",
  "Klima bakimi",
];

export const navigation: NavigationItem[] = [
  {
    title: "Ana Sayfa",
    href: "/ana-sayfa",
    icon: LayoutDashboard,
  },
  {
    title: "Hizli Kabul",
    href: "/servis/hizli-kabul",
    icon: Zap,
  },
  {
    title: "Servis",
    href: "/servis/kabul",
    icon: Wrench,
    children: [
      { title: "Servis Kabul", href: "/servis/kabul" },
      { title: "Serviste Bugun", href: "/servis/bugun", badgeKey: "bugun" },
      { title: "Servis Gecmisi", href: "/servis/gecmis", badgeKey: "gecmis" },
      { title: "Servise Aliniyor", href: "/servis/alinan", badgeKey: "SERVISE_ALINIYOR" },
      { title: "Bakim/Onarimda", href: "/servis/bakimda", badgeKey: "BAKIM_ONARIMDA" },
      { title: "Parca Bekliyor", href: "/servis/parca-bekleyen", badgeKey: "PARCA_BEKLIYOR" },
      { title: "Teslime Hazir", href: "/servis/teslime-hazir", badgeKey: "TESLIME_HAZIR" },
      { title: "Teslim Edildi", href: "/servis/teslim-edildi", badgeKey: "TESLIM_EDILDI" },
    ],
  },
  {
    title: "Musteri Kartlari",
    href: "/musteriler",
    icon: Users,
  },
  {
    title: "Arac Kartlari",
    href: "/araclar",
    icon: CarFront,
  },
  {
    title: "Randevular",
    href: "/randevular",
    icon: CalendarClock,
  },
  {
    title: "Alis-Satis",
    href: "/stok/urunler",
    icon: ShoppingCart,
    children: [
      { title: "Urun ve Hizmetler", href: "/stok/urunler" },
      { title: "Satislar", href: "/stok/satislar" },
      { title: "Alislar", href: "/stok/alislar" },
      { title: "Raporlar", href: "/stok/raporlar" },
    ],
  },
  {
    title: "Muhasebe",
    href: "/muhasebe/tahsilat",
    icon: Banknote,
    children: [
      { title: "Tahsilat ve Odemeler", href: "/muhasebe/tahsilat" },
      { title: "Kasa - Bankalar", href: "/muhasebe/kasalar" },
      { title: "Masraflar", href: "/muhasebe/masraflar" },
    ],
  },
  {
    title: "Ayarlar",
    href: "/ayarlar/firma",
    icon: Settings,
    children: [
      { title: "Firma Bilgileri", href: "/ayarlar/firma" },
      { title: "Ozellestirilmis Notlar", href: "/ayarlar/notlar" },
      { title: "Arac Markalari", href: "/ayarlar/markalar" },
      { title: "Teknisyenler", href: "/ayarlar/teknisyenler" },
    ],
  },
];

export const dashboardCards = [
  { key: "gelir", label: "Toplam Gelir", icon: Gauge },
  { key: "servis", label: "Servis Cirosu", icon: Activity },
  { key: "satis", label: "Satis Cirosu", icon: ShoppingCart },
  { key: "gider", label: "Toplam Gider", icon: BriefcaseBusiness },
] as const;
