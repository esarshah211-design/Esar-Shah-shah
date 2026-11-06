import React, { useState } from 'react';
import {
  ShoppingBag,
  Bike,
  Store,
  Phone,
  MessageCircle,
  Clock,
  CheckCircle2,
  AlertCircle,
  Trash2,
  Search,
  Filter,
} from 'lucide-react';
import { Order, OrderStatus } from '../../types';
import { updateOrderStatus, deleteOrder } from '../../services/dbService';

interface Props {
  orders: Order[];
}

export const OrderManager: React.FC<Props> = ({ orders }) => {
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [search, setSearch] = useState('');
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const statuses: OrderStatus[] = [
    'New',
    'Confirmed',
    'Preparing',
    'Ready',
    'Completed',
    'Cancelled',
  ];

  const handleStatusChange = async (orderId: string, newStatus: OrderStatus) => {
    setUpdatingId(orderId);
    try {
      await updateOrderStatus(orderId, newStatus);
    } catch (err) {
      console.error('Failed to update status:', err);
    } finally {
      setUpdatingId(null);
    }
  };

  const handleDelete = async (orderId: string) => {
    if (confirm('Delete this order record permanently?')) {
      try {
        await deleteOrder(orderId);
      } catch (err) {
        console.error('Delete order failed:', err);
      }
    }
  };

  const handleWhatsAppCustomer = (order: Order) => {
    const cleanPhone = order.phone.replace(/[^0-9]/g, '');
    let msg = `Hi ${order.customerName}! This is Burger Bite (Mian Gujar, Peshawar) regarding your order #${order.id.slice(-6).toUpperCase()}.`;

    if (order.status === 'Confirmed') {
      msg += ` Your order has been confirmed and our grill is firing up!`;
    } else if (order.status === 'Preparing') {
      msg += ` We are freshly preparing your smash burgers & fries right now!`;
    } else if (order.status === 'Ready') {
      msg += order.orderType === 'pickup'
        ? ` Your order is freshly packed and ready for pickup at our counter!`
        : ` Your order is packed and our rider is heading to your address!`;
    } else if (order.status === 'Completed') {
      msg += ` Your order is completed. Thank you for dining with Burger Bite! Enjoy your meal!`;
    }

    const url = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(msg)}`;
    window.open(url, '_blank');
  };

  const filteredOrders = orders.filter((o) => {
    const matchStatus = filterStatus === 'all' || o.status.toLowerCase() === filterStatus.toLowerCase();
    const matchSearch =
      o.customerName.toLowerCase().includes(search.toLowerCase()) ||
      o.phone.includes(search) ||
      o.id.toLowerCase().includes(search.toLowerCase());
    return matchStatus && matchSearch;
  });

  const getStatusColor = (status: OrderStatus) => {
    switch (status) {
      case 'New':
        return 'bg-blue-500/20 text-blue-400 border-blue-500/40';
      case 'Confirmed':
        return 'bg-indigo-500/20 text-indigo-400 border-indigo-500/40';
      case 'Preparing':
        return 'bg-amber-500/20 text-amber-400 border-amber-500/40';
      case 'Ready':
        return 'bg-purple-500/20 text-purple-400 border-purple-500/40';
      case 'Completed':
        return 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40';
      case 'Cancelled':
        return 'bg-red-500/20 text-red-400 border-red-500/40';
      default:
        return 'bg-neutral-500/20 text-neutral-400 border-neutral-500/40';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-bebas text-3xl sm:text-4xl text-white tracking-wide">
            ORDER MANAGEMENT SYSTEM
          </h2>
          <p className="text-xs text-[#B8B8B8]">
            Manage incoming diner orders, update statuses, and message customers via WhatsApp.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs text-[#888]">Total Orders:</span>
          <span className="px-3 py-1 rounded-full bg-[#222] border border-[#333] text-xs font-bold text-white">
            {orders.length}
          </span>
        </div>
      </div>

      {/* Filter / Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-[#171717] p-4 rounded-2xl border border-[#272727]">
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-[#777] absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by customer, phone, ID..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-[#101010] border border-[#2a2a2a] rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder-[#555] outline-none focus:border-[#E63932]"
          />
        </div>

        <div className="flex items-center gap-1.5 w-full sm:w-auto overflow-x-auto pb-1">
          <button
            onClick={() => setFilterStatus('all')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap cursor-pointer transition-colors ${
              filterStatus === 'all'
                ? 'bg-[#E63932] text-white'
                : 'bg-[#101010] text-[#888] hover:text-white border border-[#2a2a2a]'
            }`}
          >
            All ({orders.length})
          </button>
          {statuses.map((st) => {
            const count = orders.filter((o) => o.status === st).length;
            return (
              <button
                key={st}
                onClick={() => setFilterStatus(st)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap cursor-pointer transition-colors ${
                  filterStatus === st
                    ? 'bg-[#E63932] text-white'
                    : 'bg-[#101010] text-[#888] hover:text-white border border-[#2a2a2a]'
                }`}
              >
                {st} ({count})
              </button>
            );
          })}
        </div>
      </div>

      {/* Orders List / Cards */}
      {filteredOrders.length === 0 ? (
        <div className="py-20 text-center bg-[#171717] rounded-3xl border border-[#272727] p-8">
          <ShoppingBag className="w-12 h-12 text-[#444] mx-auto mb-4" />
          <h3 className="font-bebas text-2xl text-white">No Orders Found</h3>
          <p className="text-xs text-[#888] mt-1">
            No orders match the current status filter.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredOrders.map((ord) => (
            <div
              key={ord.id}
              className="bg-[#171717] rounded-3xl border border-[#272727] p-6 shadow-xl hover:border-[#383838] transition-all"
            >
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-[#252525]">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[#222] flex items-center justify-center text-[#E63932] font-mono font-bold text-xs">
                    #{ord.id.slice(-4).toUpperCase()}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="font-bold text-base text-white">{ord.customerName}</h4>
                      <span className="text-xs text-[#888]">({ord.phone})</span>
                    </div>
                    <div className="flex items-center gap-3 text-xs text-[#888] mt-0.5">
                      <span>Placing time: {new Date(ord.createdAt).toLocaleTimeString()}</span>
                      <span>•</span>
                      <span className="inline-flex items-center gap-1 font-semibold text-white">
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
                    </div>
                  </div>
                </div>

                {/* Status selector & Actions */}
                <div className="flex items-center gap-3 flex-wrap">
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-[#888]">Status:</span>
                    <select
                      value={ord.status}
                      disabled={updatingId === ord.id}
                      onChange={(e) => handleStatusChange(ord.id, e.target.value as OrderStatus)}
                      className={`text-xs font-bold rounded-xl px-3 py-1.5 border outline-none cursor-pointer ${getStatusColor(
                        ord.status
                      )}`}
                    >
                      {statuses.map((s) => (
                        <option key={s} value={s} className="bg-[#171717] text-white">
                          {s}
                        </option>
                      ))}
                    </select>
                  </div>

                  <button
                    onClick={() => handleWhatsAppCustomer(ord)}
                    className="p-2 rounded-xl bg-emerald-600/20 hover:bg-emerald-600 text-emerald-400 hover:text-white border border-emerald-500/30 transition-all cursor-pointer"
                    title="Send WhatsApp update to customer"
                  >
                    <MessageCircle className="w-4 h-4" />
                  </button>

                  <a
                    href={`tel:${ord.phone.replace(/[^0-9+]/g, '')}`}
                    className="p-2 rounded-xl bg-[#252525] hover:bg-[#333] text-white border border-[#333] transition-all"
                    title="Call customer"
                  >
                    <Phone className="w-4 h-4" />
                  </a>

                  <button
                    onClick={() => handleDelete(ord.id)}
                    className="p-2 rounded-xl bg-red-950/30 hover:bg-red-900/50 text-red-400 transition-all cursor-pointer"
                    title="Delete order"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Order Items Breakdown */}
              <div className="py-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-[#888] block">
                    Ordered Dishes
                  </span>
                  <div className="space-y-1.5">
                    {ord.items?.map((item, idx) => (
                      <div
                        key={idx}
                        className="flex items-center justify-between text-xs text-[#DDD] bg-[#121212] p-2.5 rounded-xl border border-[#222]"
                      >
                        <div>
                          <span className="font-bold text-white mr-2">
                            {item.quantity}x
                          </span>
                          <span>{item.name}</span>
                          {item.specialInstructions && (
                            <span className="text-[10px] text-amber-400 block italic">
                              Note: {item.specialInstructions}
                            </span>
                          )}
                        </div>
                        <span className="font-semibold text-white">
                          Rs {(item.price * item.quantity).toLocaleString()}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="space-y-2 flex flex-col justify-between">
                  <div>
                    <span className="text-[11px] font-bold uppercase tracking-wider text-[#888] block">
                      Fulfillment & Notes
                    </span>
                    <div className="bg-[#121212] p-3 rounded-xl border border-[#222] text-xs space-y-1.5">
                      {ord.orderType === 'delivery' && (
                        <div>
                          <span className="text-[#888]">Delivery Address: </span>
                          <span className="text-white font-medium">{ord.address}</span>
                        </div>
                      )}
                      {ord.notes && (
                        <div>
                          <span className="text-[#888]">Customer Note: </span>
                          <span className="text-amber-300 italic">{ord.notes}</span>
                        </div>
                      )}
                      <div>
                        <span className="text-[#888]">Payment Method: </span>
                        <span className="text-emerald-400 font-semibold">
                          Cash on Delivery / Pickup Cash
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-[#252525]">
                    <span className="text-xs text-[#888]">
                      Subtotal: Rs {ord.subtotal} {ord.deliveryFee ? `+ Delivery: Rs ${ord.deliveryFee}` : ''}
                    </span>
                    <div className="text-right">
                      <span className="text-[10px] text-[#888] uppercase block">Grand Total</span>
                      <span className="font-bebas text-2xl text-[#E63932] tracking-wider">
                        Rs {ord.totalAmount?.toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
