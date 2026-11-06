import React, { useState } from 'react';
import {
  X,
  Trash2,
  Plus,
  Minus,
  ShoppingBag,
  Bike,
  Store,
  MessageCircle,
  ArrowRight,
  ShieldCheck,
  AlertCircle,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { useCart } from '../../context/CartContext';
import { placeOrder } from '../../services/dbService';
import { WebsiteSettings } from '../../types';

interface Props {
  settings: WebsiteSettings;
  onOrderSuccess: (orderId: string, orderDetails: any) => void;
}

export const CartDrawer: React.FC<Props> = ({ settings, onOrderSuccess }) => {
  const {
    cart,
    isOpen,
    closeCart,
    updateQuantity,
    removeFromCart,
    clearCart,
    orderType,
    setOrderType,
    customerName,
    setCustomerName,
    phone,
    setPhone,
    address,
    setAddress,
    notes,
    setNotes,
    subtotal,
    deliveryFee,
    totalAmount,
    totalItemsCount,
  } = useCart();

  const [submitting, setSubmitting] = useState(false);
  const [validationError, setValidationError] = useState<string | null>(null);

  if (!isOpen) return null;

  const cleanWhatsAppNumber = settings.whatsappNumber.replace(/[^0-9]/g, '');

  const handlePlaceOrder = async (sendWhatsAppAfter: boolean = false) => {
    setValidationError(null);

    if (cart.length === 0) {
      setValidationError('Your cart is empty. Please add items to order.');
      return;
    }

    if (!customerName.trim() || customerName.trim().length < 2) {
      setValidationError('Please enter your full customer name.');
      return;
    }

    if (!phone.trim() || phone.trim().length < 7) {
      setValidationError('Please provide a valid phone number so we can confirm your order.');
      return;
    }

    if (orderType === 'delivery' && (!address.trim() || address.trim().length < 5)) {
      setValidationError('Please provide your complete delivery address in Mian Gujar.');
      return;
    }

    setSubmitting(true);

    try {
      const orderPayload = {
        customerName: customerName.trim(),
        phone: phone.trim(),
        address: orderType === 'delivery' ? address.trim() : 'Pickup at Restaurant',
        orderType,
        items: cart,
        subtotal,
        deliveryFee,
        totalAmount,
        notes: notes.trim() || undefined,
      };

      const orderId = await placeOrder(orderPayload);

      // Trigger celebration confetti
      try {
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#E63932', '#f59e0b', '#ffffff'],
        });
      } catch (e) {
        // Confetti fallback
      }

      // If user wants WhatsApp transmission
      if (sendWhatsAppAfter) {
        const itemsList = cart
          .map((i) => `• ${i.quantity}x ${i.name} (Rs ${i.price * i.quantity})`)
          .join('\n');

        const waText = `*NEW BURGER BITE ORDER #${orderId.slice(-6).toUpperCase()}*
*Customer:* ${customerName.trim()}
*Phone:* ${phone.trim()}
*Order Type:* ${orderType.toUpperCase()}
${orderType === 'delivery' ? `*Delivery Address:* ${address.trim()}\n` : ''}
*Items:*
${itemsList}

*Subtotal:* Rs ${subtotal}
*Delivery Fee:* Rs ${deliveryFee}
*TOTAL AMOUNT:* Rs ${totalAmount}
*Payment Method:* Cash on Delivery / Pay at Pickup
${notes.trim() ? `*Special Notes:* ${notes.trim()}\n` : ''}
Please confirm my order. Thank you!`;

        const waUrl = `https://wa.me/${cleanWhatsAppNumber}?text=${encodeURIComponent(waText)}`;
        window.open(waUrl, '_blank');
      }

      clearCart();
      closeCart();
      onOrderSuccess(orderId, orderPayload);
    } catch (err: any) {
      console.error('Order submission error:', err);
      setValidationError('Failed to place order. Please try again or order via WhatsApp directly.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        onClick={closeCart}
        className="absolute inset-0 bg-black/80 backdrop-blur-sm transition-opacity"
      />

      {/* Slide-over panel */}
      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-[#171717] border-l border-[#272727] text-white flex flex-col shadow-2xl animate-in slide-in-from-right duration-300">
          {/* Header */}
          <div className="p-6 border-b border-[#252525] flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#E63932] flex items-center justify-center text-white">
                <ShoppingBag className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bebas text-2xl tracking-wide leading-none">Your Order</h3>
                <span className="text-xs text-[#B8B8B8]">{totalItemsCount} items selected</span>
              </div>
            </div>
            <button
              onClick={closeCart}
              className="p-2 rounded-xl text-[#B8B8B8] hover:text-white hover:bg-[#252525] transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Cart Content */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {validationError && (
              <div className="p-3.5 rounded-xl bg-red-950/50 border border-red-500/50 text-red-200 text-xs flex items-start gap-2.5">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                <span>{validationError}</span>
              </div>
            )}

            {cart.length === 0 ? (
              <div className="py-20 text-center">
                <ShoppingBag className="w-16 h-16 text-[#333] mx-auto mb-4" />
                <h4 className="font-bebas text-2xl text-white">Your Cart is Empty</h4>
                <p className="text-xs text-[#888] mt-1 max-w-xs mx-auto">
                  Browse our gourmet burgers, loaded fries, and meal deals to add items.
                </p>
                <button
                  onClick={closeCart}
                  className="mt-6 px-6 py-2.5 rounded-xl bg-[#E63932] text-white font-bold text-xs uppercase"
                >
                  Explore Menu
                </button>
              </div>
            ) : (
              <>
                {/* Items List */}
                <div className="space-y-3">
                  {cart.map((item) => (
                    <div
                      key={item.id}
                      className="p-3.5 rounded-2xl bg-[#101010] border border-[#252525] flex items-center justify-between gap-3"
                    >
                      <div className="flex-1 min-w-0">
                        <h4 className="font-bold text-sm text-white truncate">{item.name}</h4>
                        <div className="text-xs text-[#E63932] font-semibold mt-0.5">
                          Rs {item.price.toLocaleString()} each
                        </div>
                        {item.specialInstructions && (
                          <p className="text-[11px] text-[#888] italic truncate mt-1">
                            Note: {item.specialInstructions}
                          </p>
                        )}
                      </div>

                      {/* Quantity Controller */}
                      <div className="flex items-center gap-2 bg-[#1c1c1c] rounded-xl p-1 border border-[#2e2e2e]">
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="w-6 h-6 rounded-lg bg-[#272727] text-white flex items-center justify-center hover:bg-[#333] transition-colors"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="text-xs font-bold text-white px-1.5">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="w-6 h-6 rounded-lg bg-[#272727] text-white flex items-center justify-center hover:bg-[#333] transition-colors"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>

                      <button
                        onClick={() => removeFromCart(item.id)}
                        className="text-[#666] hover:text-red-400 p-1.5 transition-colors"
                        title="Remove item"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>

                {/* Delivery or Pickup Toggle */}
                <div className="pt-2">
                  <label className="block text-xs font-bold text-white uppercase tracking-wider mb-2">
                    Fulfillment Preference
                  </label>
                  <div className="grid grid-cols-2 gap-2 bg-[#101010] p-1.5 rounded-2xl border border-[#252525]">
                    <button
                      type="button"
                      onClick={() => setOrderType('delivery')}
                      className={`flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                        orderType === 'delivery'
                          ? 'bg-[#E63932] text-white shadow-md'
                          : 'text-[#888] hover:text-white'
                      }`}
                    >
                      <Bike className="w-4 h-4" />
                      <span>Home Delivery</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setOrderType('pickup')}
                      className={`flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                        orderType === 'pickup'
                          ? 'bg-[#E63932] text-white shadow-md'
                          : 'text-[#888] hover:text-white'
                      }`}
                    >
                      <Store className="w-4 h-4" />
                      <span>Self Pickup</span>
                    </button>
                  </div>
                </div>

                {/* Customer Details Form */}
                <div className="space-y-3.5 pt-2">
                  <label className="block text-xs font-bold text-white uppercase tracking-wider">
                    Customer Information
                  </label>

                  <div>
                    <input
                      type="text"
                      placeholder="Your Full Name *"
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      className="w-full bg-[#101010] border border-[#272727] focus:border-[#E63932] rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-[#666] outline-none"
                    />
                  </div>

                  <div>
                    <input
                      type="tel"
                      placeholder="Phone Number (e.g. 0311 9598182) *"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full bg-[#101010] border border-[#272727] focus:border-[#E63932] rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-[#666] outline-none"
                    />
                  </div>

                  {orderType === 'delivery' && (
                    <div>
                      <textarea
                        rows={2}
                        placeholder="Delivery Address in Mian Gujar, Peshawar *"
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                        className="w-full bg-[#101010] border border-[#272727] focus:border-[#E63932] rounded-xl p-3 text-xs text-white placeholder-[#666] outline-none resize-none"
                      />
                    </div>
                  )}

                  <div>
                    <input
                      type="text"
                      placeholder="Order Notes / Extra napkins, cutlery, etc."
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      className="w-full bg-[#101010] border border-[#272727] focus:border-[#E63932] rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-[#666] outline-none"
                    />
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Footer & Checkout */}
          {cart.length > 0 && (
            <div className="p-6 bg-[#121212] border-t border-[#252525] space-y-4">
              {/* Cost Summary */}
              <div className="space-y-2 text-xs">
                <div className="flex justify-between text-[#B8B8B8]">
                  <span>Subtotal</span>
                  <span className="text-white font-medium">Rs {subtotal.toLocaleString()}</span>
                </div>
                {orderType === 'delivery' && (
                  <div className="flex justify-between text-[#B8B8B8]">
                    <span>Delivery Fee (Mian Gujar)</span>
                    <span className="text-white font-medium">
                      {deliveryFee === 0 ? (
                        <span className="text-emerald-400 font-bold">FREE</span>
                      ) : (
                        `Rs ${deliveryFee}`
                      )}
                    </span>
                  </div>
                )}
                <div className="flex justify-between items-center text-sm font-bold text-white pt-2 border-t border-[#252525]">
                  <span>Total Amount</span>
                  <span className="font-bebas text-2xl text-[#E63932] tracking-wider">
                    Rs {totalAmount.toLocaleString()}
                  </span>
                </div>
                <p className="text-[10px] text-[#777]">
                  Payment method: Cash on Delivery / Direct Bank Transfer at pickup.
                </p>
              </div>

              {/* Order Submission Buttons */}
              <div className="space-y-2.5 pt-1">
                <button
                  onClick={() => handlePlaceOrder(false)}
                  disabled={submitting}
                  className="w-full py-3.5 rounded-xl bg-[#E63932] hover:bg-[#c92f29] disabled:bg-[#444] text-white font-bold text-xs uppercase tracking-wider shadow-lg shadow-[#E63932]/30 transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  {submitting ? 'Placing Order...' : 'Confirm & Place Order'}
                  <ArrowRight className="w-4 h-4" />
                </button>

                <button
                  onClick={() => handlePlaceOrder(true)}
                  disabled={submitting}
                  className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 disabled:bg-[#444] text-white font-bold text-xs uppercase tracking-wider shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>Place & Send to WhatsApp</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
