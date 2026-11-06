import React from 'react';
import {
  ShoppingBag,
  UtensilsCrossed,
  Clock,
  CheckCircle2,
  AlertCircle,
  TrendingUp,
  MessageSquare,
  Flame,
  ArrowRight,
  Bike,
  Store,
} from 'lucide-react';
import { MenuItem, Order, Enquiry, OrderStatus } from '../../types';

interface Props {
  menuItems: MenuItem[];
  orders: Order[];
  enquiries: Enquiry[];
  onNavigateTab: (tab: string) => void;
  onUpdateOrderStatus: (orderId: string, status: OrderStatus) => Promise<void>;
}

export const DashboardOverview: React.FC<Props> = ({
  menuItems,
  orders,
  enquiries,
  onNavigateTab,
  onUpdateOrderStatus,
}) => {
  const totalItems = menuItems.length;
  const availableItems = menuItems.filter((i) => i.isAvailable).length;

  const totalOrders = orders.length;
  const pendingOrders = orders.filter(
    (o) => o.status === 'New' || o.status === 'Confirmed' || o.status === 'Preparing'
  ).length;
  const completedOrders = orders.filter((o) => o.status === 'Completed').length;

  const totalRevenue = orders
    .filter((o) => o.status !== 'Cancelled')
    .reduce((sum, o) => sum + (o.totalAmount || 0), 0);

  const unreadEnquiries = enquiries.filter((e) => e.status === 'unread').length;

  const recentOrders = orders.slice(0, 5);

  const getStatusColor = (status: OrderStatus) => {
    switch (status) {
      case 'New':
        return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      case 'Confirmed':
        return 'bg-indigo-500/20 text-indigo-400 border-indigo-500/30';
      case 'Preparing':
        return 'bg-amber-500/20 text-amber-400 border-amber-500/30';
      case 'Ready':
        return 'bg-purple-500/20 text-purple-400 border-purple-500/30';
      case 'Completed':
        return 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30';
      case 'Cancelled':
        return 'bg-red-500/20 text-red-400 border-red-500/30';
      default:
        return 'bg-neutral-500/20 text-neutral-400 border-neutral-500/30';
    }
  };

  return (
    <div className="space-y-8">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-[#1f1f1f] via-[#242424] to-[#1a1a1a] p-6 sm:p-8 rounded-3xl border border-[#333] shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div>
          <span className="text-[11px] font-black uppercase tracking-widest text-[#E63932]">
            LIVE STORE OVERVIEW
          </span>
          <h2 className="font-bebas text-3xl sm:text-5xl text-white tracking-wide mt-1">
            BURGER BITE CONTROL CENTER
          </h2>
          <p className="text-xs sm:text-sm text-[#B8B8B8] max-w-xl mt-1">
            Mian Gujar Branch • Peshawar. Real-time synchronized orders, live menu inventory, and customer messages.
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={() => onNavigateTab('orders')}
            className="px-5 py-3 rounded-xl bg-[#E63932] hover:bg-[#c92f29] text-white font-bold text-xs uppercase tracking-wider shadow-lg shadow-[#E63932]/30 transition-all flex items-center gap-2 cursor-pointer"
          >
            <ShoppingBag className="w-4 h-4" />
            <span>Manage Orders</span>
          </button>
          <button
            onClick={() => onNavigateTab('menu')}
            className="px-5 py-3 rounded-xl bg-[#2b2b2b] hover:bg-[#333] text-white font-bold text-xs uppercase tracking-wider border border-[#444] transition-all flex items-center gap-2 cursor-pointer"
          >
            <UtensilsCrossed className="w-4 h-4" />
            <span>Edit Menu</span>
          </button>
        </div>
      </div>

      {/* KPI Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {/* Total Orders */}
        <div className="bg-[#171717] p-5 sm:p-6 rounded-2xl border border-[#272727] shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-bold text-[#888] uppercase tracking-wider">
              Total Orders
            </span>
            <div className="w-10 h-10 rounded-xl bg-[#222] flex items-center justify-center text-[#E63932]">
              <ShoppingBag className="w-5 h-5" />
            </div>
          </div>
          <div className="font-bebas text-3xl sm:text-4xl text-white">{totalOrders}</div>
          <div className="flex items-center gap-1.5 text-xs text-amber-400 mt-2 font-medium">
            <Clock className="w-3.5 h-3.5" />
            <span>{pendingOrders} awaiting fulfillment</span>
          </div>
        </div>

        {/* Revenue */}
        <div className="bg-[#171717] p-5 sm:p-6 rounded-2xl border border-[#272727] shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-bold text-[#888] uppercase tracking-wider">
              Order Volume
            </span>
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-400">
              <TrendingUp className="w-5 h-5" />
            </div>
          </div>
          <div className="font-bebas text-3xl sm:text-4xl text-white">
            Rs {totalRevenue.toLocaleString()}
          </div>
          <div className="text-xs text-emerald-400 mt-2 font-medium">
            {completedOrders} successfully delivered/picked up
          </div>
        </div>

        {/* Menu Items */}
        <div className="bg-[#171717] p-5 sm:p-6 rounded-2xl border border-[#272727] shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-bold text-[#888] uppercase tracking-wider">
              Menu Items
            </span>
            <div className="w-10 h-10 rounded-xl bg-[#222] flex items-center justify-center text-amber-400">
              <UtensilsCrossed className="w-5 h-5" />
            </div>
          </div>
          <div className="font-bebas text-3xl sm:text-4xl text-white">{totalItems}</div>
          <div className="flex items-center gap-1.5 text-xs text-emerald-400 mt-2 font-medium">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>{availableItems} active on public menu</span>
          </div>
        </div>

        {/* Customer Enquiries */}
        <div className="bg-[#171717] p-5 sm:p-6 rounded-2xl border border-[#272727] shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-bold text-[#888] uppercase tracking-wider">
              Enquiries
            </span>
            <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-400">
              <MessageSquare className="w-5 h-5" />
            </div>
          </div>
          <div className="font-bebas text-3xl sm:text-4xl text-white">{enquiries.length}</div>
          <div className="flex items-center gap-1.5 text-xs text-blue-400 mt-2 font-medium">
            <span>{unreadEnquiries} unread messages</span>
          </div>
        </div>
      </div>

      {/* Recent Orders Section */}
      <div className="bg-[#171717] rounded-3xl border border-[#272727] p-6 sm:p-8 shadow-xl">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="font-bebas text-2xl sm:text-3xl text-white tracking-wide">
              RECENT ORDERS
            </h3>
            <p className="text-xs text-[#888]">Live stream of incoming food requests</p>
          </div>
          <button
            onClick={() => onNavigateTab('orders')}
            className="text-xs font-bold text-[#E63932] hover:text-[#ff5249] flex items-center gap-1 transition-colors cursor-pointer"
          >
            <span>View All Orders</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        {recentOrders.length === 0 ? (
          <div className="py-12 text-center text-[#777] text-xs">
            No orders received yet. Place an order on the customer website to test real-time updates!
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-[#252525] text-[#888] uppercase font-bold text-[10px] tracking-wider">
                  <th className="pb-3 pl-2">Order ID</th>
                  <th className="pb-3">Customer</th>
                  <th className="pb-3">Type</th>
                  <th className="pb-3">Items Summary</th>
                  <th className="pb-3">Total Amount</th>
                  <th className="pb-3">Status</th>
                  <th className="pb-3 text-right pr-2">Quick Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#222]">
                {recentOrders.map((ord) => (
                  <tr key={ord.id} className="hover:bg-[#1f1f1f] transition-colors">
                    <td className="py-3.5 pl-2 font-mono font-bold text-white">
                      #{ord.id.slice(-6).toUpperCase()}
                    </td>
                    <td className="py-3.5">
                      <div className="font-bold text-white">{ord.customerName}</div>
                      <div className="text-[11px] text-[#888]">{ord.phone}</div>
                    </td>
                    <td className="py-3.5">
                      <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#B8B8B8]">
                        {ord.orderType === 'delivery' ? (
                          <>
                            <Bike className="w-3.5 h-3.5 text-emerald-400" />
                            <span>Delivery</span>
                          </>
                        ) : (
                          <>
                            <Store className="w-3.5 h-3.5 text-blue-400" />
                            <span>Pickup</span>
                          </>
                        )}
                      </span>
                    </td>
                    <td className="py-3.5 max-w-xs truncate text-[#CCC]">
                      {ord.items?.map((i) => `${i.quantity}x ${i.name}`).join(', ')}
                    </td>
                    <td className="py-3.5 font-bold text-[#E63932]">
                      Rs {ord.totalAmount?.toLocaleString()}
                    </td>
                    <td className="py-3.5">
                      <span
                        className={`inline-block px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider border ${getStatusColor(
                          ord.status
                        )}`}
                      >
                        {ord.status}
                      </span>
                    </td>
                    <td className="py-3.5 text-right pr-2">
                      <select
                        value={ord.status}
                        onChange={(e) => onUpdateOrderStatus(ord.id, e.target.value as OrderStatus)}
                        className="bg-[#101010] border border-[#333] text-white text-[11px] rounded-lg px-2 py-1 outline-none cursor-pointer focus:border-[#E63932]"
                      >
                        <option value="New">New</option>
                        <option value="Confirmed">Confirmed</option>
                        <option value="Preparing">Preparing</option>
                        <option value="Ready">Ready</option>
                        <option value="Completed">Completed</option>
                        <option value="Cancelled">Cancelled</option>
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
