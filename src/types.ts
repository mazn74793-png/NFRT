export interface MenuItem {
  id: string;
  nameEn: string;
  nameAr: string;
  descriptionEn: string;
  descriptionAr: string;
  price: number;
  tags?: string[];
  image?: string; // Optional image of the dish itself
}

export interface MenuCategory {
  id: string;
  nameEn: string;
  nameAr: string;
  icon: string; // Lucide icon name
  items: MenuItem[];
}

export interface CloudinarySettings {
  cloudName: string;
  uploadPreset: string;
}

export interface BackgroundConfig {
  coverUrl: string;
  logoUrl?: string;
  backgroundUrl?: string; // Option to set an independent general website background
  brandName?: string; // Option to set the restaurant/brand name
  categoryBackgrounds: Record<string, string>; // Maps category ID to Cloudinary URL
  itemImages: Record<string, string>; // Maps item ID to uploaded Cloudinary URL of the dish
  cloudinary?: CloudinarySettings;
  storyEn?: string;
  storyAr?: string;
  adminPassword?: string;
}

export interface OrderItem {
  itemId: string;
  nameEn: string;
  nameAr: string;
  price: number;
  qty: number;
}

export interface LiveOrder {
  id: string;
  customerName: string;
  tableNumber: string;
  items: OrderItem[];
  totalPrice: number;
  status: "pending" | "completed" | "cancelled";
  createdAt: any; // Can be a timestamp or a serialized string
}

