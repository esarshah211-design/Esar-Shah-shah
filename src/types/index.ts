export interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  imageUrl: string;
  isAvailable: boolean;
  isFeatured: boolean;
  badge?: string; // e.g., 'Best Seller', 'Spicy', 'Chef Special'
  createdAt?: string;
  updatedAt?: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  displayOrder: number;
  createdAt?: string;
}

export interface OrderItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  specialInstructions?: string;
  imageUrl?: string;
}

export type OrderStatus = 'New' | 'Confirmed' | 'Preparing' | 'Ready' | 'Completed' | 'Cancelled';

export interface Order {
  id: string;
  customerName: string;
  phone: string;
  address?: string;
  orderType: 'pickup' | 'delivery';
  items: OrderItem[];
  subtotal: number;
  deliveryFee: number;
  totalAmount: number;
  notes?: string;
  status: OrderStatus;
  createdAt: string;
  updatedAt?: string;
}

export interface Enquiry {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  message: string;
  status: 'unread' | 'read';
  createdAt: string;
}

export interface GalleryItem {
  id: string;
  imageUrl: string;
  caption: string;
  category?: string;
  displayOrder: number;
  createdAt?: string;
}

export interface WebsiteSettings {
  id?: string;
  heroTitle: string;
  heroSubtitle: string;
  heroBadge: string;
  phone: string;
  whatsappNumber: string;
  address: string;
  openingHours: string;
  aboutTitle: string;
  aboutText: string;
  aboutStats: {
    label: string;
    value: string;
  }[];
  whyChooseUs: {
    title: string;
    description: string;
    icon: string;
  }[];
  faqItems: {
    question: string;
    answer: string;
  }[];
  deliveryActive: boolean;
  deliveryFee: number;
  minOrder: number;
  facebookUrl?: string;
  instagramUrl?: string;
  tiktokUrl?: string;
  passkeyHash?: string;
  passkeyUpdatedAt?: string;
  updatedAt?: string;
}

export interface Review {
  id: string;
  customerName: string;
  rating: number;
  reviewText: string;
  date: string;
  isApproved: boolean;
  isFeatured: boolean;
  source?: string;
  createdAt?: string;
}
