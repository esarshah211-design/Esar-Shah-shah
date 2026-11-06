import React, { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { CartProvider, useCart } from './context/CartContext';
import {
  MenuItem,
  Category,
  Order,
  Enquiry,
  GalleryItem,
  WebsiteSettings,
  Review,
  OrderStatus,
} from './types';
import {
  INITIAL_SETTINGS,
  INITIAL_CATEGORIES,
  INITIAL_MENU_ITEMS,
  INITIAL_GALLERY,
  INITIAL_REVIEWS,
} from './data/initialData';
import {
  subscribeToSettings,
  subscribeToMenuItems,
  subscribeToCategories,
  subscribeToOrders,
  subscribeToEnquiries,
  subscribeToGallery,
  subscribeToReviews,
  seedInitialDataIfNeeded,
  updateOrderStatus,
} from './services/dbService';

// Public customer components
import { AnnouncementBar } from './components/public/AnnouncementBar';
import { Navbar } from './components/public/Navbar';
import { Hero } from './components/public/Hero';
import { MenuSection } from './components/public/MenuSection';
import { AboutSection } from './components/public/AboutSection';
import { WhyChooseUs } from './components/public/WhyChooseUs';
import { GallerySection } from './components/public/GallerySection';
import { ReviewsSection } from './components/public/ReviewsSection';
import { FaqSection } from './components/public/FaqSection';
import { ContactSection } from './components/public/ContactSection';
import { MapSection } from './components/public/MapSection';
import { Footer } from './components/public/Footer';
import { CartDrawer } from './components/public/CartDrawer';
import { OrderSuccessModal } from './components/public/OrderSuccessModal';
import { StickyActions } from './components/public/StickyActions';

// Admin components
import { AdminLogin } from './components/admin/AdminLogin';
import { AdminLayout } from './components/admin/AdminLayout';

function BurgerBiteApp() {
  const { isAdmin, loading: authLoading } = useAuth();
  const { setDeliveryConfig } = useCart();

  // Navigation route state ('public' | 'admin')
  const [currentView, setCurrentView] = useState<'public' | 'admin'>(() => {
    if (typeof window !== 'undefined' && window.location.pathname.startsWith('/admin')) {
      return 'admin';
    }
    return 'public';
  });

  // Real-time Firestore state
  const [settings, setSettings] = useState<WebsiteSettings>(INITIAL_SETTINGS);
  const [menuItems, setMenuItems] = useState<MenuItem[]>(INITIAL_MENU_ITEMS);
  const [categories, setCategories] = useState<Category[]>(INITIAL_CATEGORIES);
  const [orders, setOrders] = useState<Order[]>([]);
  const [enquiries, setEnquiries] = useState<Enquiry[]>([]);
  const [galleryItems, setGalleryItems] = useState<GalleryItem[]>(INITIAL_GALLERY);
  const [reviews, setReviews] = useState<Review[]>(INITIAL_REVIEWS);

  // Success order confirmation modal
  const [successOrderId, setSuccessOrderId] = useState<string | null>(null);
  const [successOrderDetails, setSuccessOrderDetails] = useState<any>(null);

  // Check URL pathname popstate
  useEffect(() => {
    const handleLocationChange = () => {
      if (window.location.pathname.startsWith('/admin')) {
        setCurrentView('admin');
      } else {
        setCurrentView('public');
      }
    };

    window.addEventListener('popstate', handleLocationChange);
    return () => window.removeEventListener('popstate', handleLocationChange);
  }, []);

  // Update URL history when switching views
  const navigateToView = (view: 'public' | 'admin') => {
    setCurrentView(view);
    const targetUrl = view === 'admin' ? '/admin' : '/';
    if (window.location.pathname !== targetUrl) {
      window.history.pushState({}, '', targetUrl);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Seed Firestore on startup if empty
  useEffect(() => {
    seedInitialDataIfNeeded().catch(console.warn);
  }, []);

  // Attach Firestore realtime listeners
  useEffect(() => {
    const unsubSettings = subscribeToSettings((data) => {
      setSettings(data);
      setDeliveryConfig(data.deliveryActive ?? true, data.deliveryFee ?? 100, data.minOrder ?? 1500);
    });

    const unsubMenu = subscribeToMenuItems((items) => {
      setMenuItems(items);
    });

    const unsubCategories = subscribeToCategories((cats) => {
      setCategories(cats);
    });

    const unsubOrders = subscribeToOrders((ords) => {
      setOrders(ords);
    });

    const unsubEnquiries = subscribeToEnquiries((enqs) => {
      setEnquiries(enqs);
    });

    const unsubGallery = subscribeToGallery((gals) => {
      setGalleryItems(gals);
    });

    const unsubReviews = subscribeToReviews((revs) => {
      setReviews(revs);
    });

    return () => {
      unsubSettings();
      unsubMenu();
      unsubCategories();
      unsubOrders();
      unsubEnquiries();
      unsubGallery();
      unsubReviews();
    };
  }, []);

  const handleOrderSuccess = (orderId: string, orderDetails: any) => {
    setSuccessOrderId(orderId);
    setSuccessOrderDetails(orderDetails);
  };

  const handleUpdateOrderStatus = async (orderId: string, status: OrderStatus) => {
    await updateOrderStatus(orderId, status);
  };

  // If in Admin Mode
  if (currentView === 'admin') {
    if (!isAdmin) {
      return <AdminLogin onBackToWebsite={() => navigateToView('public')} />;
    }

    return (
      <AdminLayout
        menuItems={menuItems}
        categories={categories}
        orders={orders}
        enquiries={enquiries}
        galleryItems={galleryItems}
        settings={settings}
        reviews={reviews}
        onBackToWebsite={() => navigateToView('public')}
        onUpdateOrderStatus={handleUpdateOrderStatus}
      />
    );
  }

  // Customer Facing Website
  return (
    <div className="min-h-screen bg-[#101010] text-white flex flex-col selection:bg-[#E63932] selection:text-white">
      {/* 1. Announcement Bar */}
      <AnnouncementBar settings={settings} />

      {/* 2. Navigation Header */}
      <Navbar
        settings={settings}
        onNavigateToAdmin={() => navigateToView('admin')}
      />

      <main className="flex-1">
        {/* 3. Hero Section */}
        <Hero
          settings={settings}
          onExploreMenu={() => {
            const menuEl = document.getElementById('menu');
            if (menuEl) menuEl.scrollIntoView({ behavior: 'smooth' });
          }}
        />

        {/* 4. Food Menu */}
        <MenuSection menuItems={menuItems} categories={categories} />

        {/* 5. About Burger Bite */}
        <AboutSection settings={settings} />

        {/* 6. Why Choose Us */}
        <WhyChooseUs settings={settings} />

        {/* 7. Food Gallery */}
        <GallerySection galleryItems={galleryItems} />

        {/* 8. Customer Reviews */}
        <ReviewsSection reviews={reviews} />

        {/* 9. FAQ Section */}
        <FaqSection settings={settings} />

        {/* 10. Contact Section */}
        <ContactSection settings={settings} />

        {/* 11. Google Maps Location */}
        <MapSection settings={settings} />
      </main>

      {/* 12. Footer */}
      <Footer
        settings={settings}
        onNavigateToAdmin={() => navigateToView('admin')}
      />

      {/* Interactive Cart Drawer */}
      <CartDrawer
        settings={settings}
        onOrderSuccess={handleOrderSuccess}
      />

      {/* Order Confirmation Success Modal */}
      {successOrderId && (
        <OrderSuccessModal
          orderId={successOrderId}
          orderDetails={successOrderDetails}
          settings={settings}
          onClose={() => setSuccessOrderId(null)}
        />
      )}

      {/* Sticky Mobile Actions (WhatsApp & Call) */}
      <StickyActions settings={settings} />
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <BurgerBiteApp />
      </CartProvider>
    </AuthProvider>
  );
}
