import React, { useState } from 'react';
import {
  Flame,
  LayoutDashboard,
  UtensilsCrossed,
  FolderTree,
  ShoppingBag,
  Camera,
  FileText,
  MessageSquare,
  Star,
  Settings,
  LogOut,
  ExternalLink,
  Menu as MenuIcon,
  X,
  Bell,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import {
  MenuItem,
  Category,
  Order,
  Enquiry,
  GalleryItem,
  WebsiteSettings,
  Review,
  OrderStatus,
} from '../../types';
import { DashboardOverview } from './DashboardOverview';
import { MenuManager } from './MenuManager';
import { CategoryManager } from './CategoryManager';
import { OrderManager } from './OrderManager';
import { GalleryManager } from './GalleryManager';
import { ContentManager } from './ContentManager';
import { EnquiriesManager } from './EnquiriesManager';
import { ReviewManager } from './ReviewManager';
import { SettingsManager } from './SettingsManager';

interface Props {
  menuItems: MenuItem[];
  categories: Category[];
  orders: Order[];
  enquiries: Enquiry[];
  galleryItems: GalleryItem[];
  settings: WebsiteSettings;
  reviews: Review[];
  onBackToWebsite: () => void;
  onUpdateOrderStatus: (orderId: string, status: OrderStatus) => Promise<void>;
}

export const AdminLayout: React.FC<Props> = ({
  menuItems,
  categories,
  orders,
  enquiries,
  galleryItems,
  settings,
  reviews,
  onBackToWebsite,
  onUpdateOrderStatus,
}) => {
  const { signOut, user } = useAuth();
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(false);

  const pendingOrdersCount = orders.filter(
    (o) => o.status === 'New' || o.status === 'Confirmed' || o.status === 'Preparing'
  ).length;

  const unreadEnquiriesCount = enquiries.filter((e) => e.status === 'unread').length;

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'menu', label: 'Menu Management', icon: UtensilsCrossed, count: menuItems.length },
    { id: 'categories', label: 'Categories', icon: FolderTree, count: categories.length },
    { id: 'orders', label: 'Orders', icon: ShoppingBag, count: pendingOrdersCount, badgeColor: 'bg-[#E63932]' },
    { id: 'gallery', label: 'Gallery', icon: Camera, count: galleryItems.length },
    { id: 'content', label: 'Website Content', icon: FileText },
    { id: 'enquiries', label: 'Customer Enquiries', icon: MessageSquare, count: unreadEnquiriesCount, badgeColor: 'bg-blue-500' },
    { id: 'reviews', label: 'Reviews', icon: Star, count: reviews.length },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  const handleNavClick = (tabId: string) => {
    setActiveTab(tabId);
    setSidebarOpen(false);
  };

  return (
    <div className="min-h-screen bg-[#101010] flex text-white font-sans antialiased">
      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 z-40 bg-black/80 lg:hidden"
        />
      )}

      {/* Sidebar Navigation */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-72 bg-[#171717] border-r border-[#262626] flex flex-col justify-between transition-transform duration-300 lg:static lg:translate-x-0 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div>
          {/* Logo Brand Header */}
          <div className="p-6 border-b border-[#222] flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#E63932] flex items-center justify-center text-white shadow-lg shadow-[#E63932]/30">
                <Flame className="w-6 h-6 fill-current" />
              </div>
              <div className="flex flex-col">
                <span className="font-bebas text-2xl tracking-wider text-white leading-none">
                  BURGER <span className="text-[#E63932]">BITE</span>
                </span>
                <span className="text-[10px] uppercase font-bold tracking-widest text-[#888]">
                  ADMIN CONSOLE
                </span>
              </div>
            </div>
            <button
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden text-[#888] hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Nav List */}
          <nav className="p-4 space-y-1.5 overflow-y-auto max-h-[calc(100vh-210px)]">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;

              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className={`w-full flex items-center justify-between px-3.5 py-3 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    isActive
                      ? 'bg-[#E63932] text-white shadow-lg shadow-[#E63932]/25 font-black'
                      : 'text-[#B8B8B8] hover:text-white hover:bg-[#222222]'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className="w-4 h-4 shrink-0" />
                    <span>{item.label}</span>
                  </div>

                  {item.count !== undefined && item.count > 0 && (
                    <span
                      className={`text-[10px] font-black px-2 py-0.5 rounded-full ${
                        isActive
                          ? 'bg-white text-[#E63932]'
                          : item.badgeColor
                          ? `${item.badgeColor} text-white`
                          : 'bg-[#262626] text-[#BBB]'
                      }`}
                    >
                      {item.count}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Sidebar Footer */}
        <div className="p-4 border-t border-[#222] space-y-2">
          <button
            onClick={onBackToWebsite}
            className="w-full flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl bg-[#222222] hover:bg-[#2b2b2b] text-[#B8B8B8] hover:text-white text-xs font-semibold transition-all cursor-pointer"
          >
            <ExternalLink className="w-3.5 h-3.5 text-[#E63932]" />
            <span>View Public Website</span>
          </button>

          <button
            onClick={signOut}
            className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-xl text-xs font-semibold text-red-400 hover:bg-red-950/30 transition-all cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        {/* Top Navbar */}
        <header className="sticky top-0 z-30 bg-[#141414]/95 backdrop-blur-md border-b border-[#222] h-18 px-4 sm:px-8 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2 rounded-xl text-[#B8B8B8] hover:text-white hover:bg-[#222]"
            >
              <MenuIcon className="w-6 h-6" />
            </button>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-xs font-bold text-white uppercase tracking-wider hidden sm:inline">
                Live Firestore Synced
              </span>
            </div>
          </div>

          <div className="flex items-center gap-4">
            {pendingOrdersCount > 0 && (
              <button
                onClick={() => setActiveTab('orders')}
                className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#E63932]/20 border border-[#E63932]/40 text-[#E63932] text-xs font-bold animate-pulse cursor-pointer"
              >
                <Bell className="w-3.5 h-3.5" />
                <span>{pendingOrdersCount} New Orders</span>
              </button>
            )}

            <div className="text-right hidden sm:block">
              <div className="text-xs font-bold text-white">
                {user?.email || 'Store Owner (Peshawar)'}
              </div>
              <div className="text-[10px] text-emerald-400 font-semibold">Administrator</div>
            </div>
          </div>
        </header>

        {/* Tab Content Display */}
        <main className="p-4 sm:p-8 flex-1 max-w-7xl w-full mx-auto">
          {activeTab === 'dashboard' && (
            <DashboardOverview
              menuItems={menuItems}
              orders={orders}
              enquiries={enquiries}
              onNavigateTab={(tab) => setActiveTab(tab)}
              onUpdateOrderStatus={onUpdateOrderStatus}
            />
          )}

          {activeTab === 'menu' && (
            <MenuManager menuItems={menuItems} categories={categories} />
          )}

          {activeTab === 'categories' && (
            <CategoryManager categories={categories} menuItems={menuItems} />
          )}

          {activeTab === 'orders' && <OrderManager orders={orders} />}

          {activeTab === 'gallery' && <GalleryManager galleryItems={galleryItems} />}

          {activeTab === 'content' && <ContentManager settings={settings} />}

          {activeTab === 'enquiries' && <EnquiriesManager enquiries={enquiries} />}

          {activeTab === 'reviews' && <ReviewManager reviews={reviews} />}

          {activeTab === 'settings' && <SettingsManager />}
        </main>
      </div>
    </div>
  );
};
