import React from 'react';
import { CheckCircle2, Clock, MapPin, Phone, MessageCircle, X } from 'lucide-react';
import { WebsiteSettings } from '../../types';

interface Props {
  orderId: string;
  orderDetails: any;
  settings: WebsiteSettings;
  onClose: () => void;
}

export const OrderSuccessModal: React.FC<Props> = ({
  orderId,
  orderDetails,
  settings,
  onClose,
}) => {
  if (!orderId) return null;

  const cleanWhatsAppNumber = settings.whatsappNumber.replace(/[^0-9]/g, '');

  const itemsSummary =
    orderDetails?.items
      ?.map((i: any) => `${i.quantity}x ${i.name}`)
      .join(', ') || 'Fresh meal order';

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-[#171717] border border-[#2d2d2d] rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl relative animate-in zoom-in-95">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-[#888] hover:text-white p-1"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="text-center mb-6">
          <div className="w-16 h-16 rounded-2xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto mb-4 border border-emerald-500/30">
            <CheckCircle2 className="w-10 h-10" />
          </div>
          <span className="text-[11px] font-black uppercase tracking-widest text-[#E63932]">
            ORDER CONFIRMED
          </span>
          <h3 className="font-bebas text-3xl sm:text-4xl text-white mt-1">
            WE'RE FIRING UP THE GRILL!
          </h3>
          <p className="text-xs text-[#B8B8B8] max-w-xs mx-auto mt-1">
            Your order has been recorded into the Burger Bite system. Our kitchen is preparing your meal with care.
          </p>
        </div>

        {/* Order Details Receipt Box */}
        <div className="bg-[#101010] rounded-2xl border border-[#252525] p-4 text-xs space-y-3 mb-6">
          <div className="flex justify-between items-center pb-2 border-b border-[#222]">
            <span className="text-[#888]">Order Reference:</span>
            <span className="font-mono font-bold text-white uppercase">#{orderId.slice(-8)}</span>
          </div>

          <div className="flex justify-between items-center">
            <span className="text-[#888]">Customer Name:</span>
            <span className="font-semibold text-white">{orderDetails?.customerName}</span>
          </div>

          <div className="flex justify-between items-center">
            <span className="text-[#888]">Contact Phone:</span>
            <span className="font-semibold text-white">{orderDetails?.phone}</span>
          </div>

          <div className="flex justify-between items-center">
            <span className="text-[#888]">Order Type:</span>
            <span className="font-bold text-emerald-400 uppercase">
              {orderDetails?.orderType}
            </span>
          </div>

          {orderDetails?.orderType === 'delivery' && (
            <div className="flex justify-between items-start">
              <span className="text-[#888]">Delivery Address:</span>
              <span className="font-semibold text-white text-right max-w-[200px]">
                {orderDetails?.address}
              </span>
            </div>
          )}

          <div className="flex justify-between items-start pt-2 border-t border-[#222]">
            <span className="text-[#888]">Items:</span>
            <span className="font-semibold text-white text-right max-w-[220px]">
              {itemsSummary}
            </span>
          </div>

          <div className="flex justify-between items-center pt-2 border-t border-[#222]">
            <span className="text-white font-bold">Total Amount Due:</span>
            <span className="font-bebas text-xl text-[#E63932]">
              Rs {orderDetails?.totalAmount?.toLocaleString()}
            </span>
          </div>

          <div className="bg-[#171717] p-2.5 rounded-xl text-[11px] text-[#aaa] flex items-center gap-2">
            <Clock className="w-4 h-4 text-amber-400 shrink-0" />
            <span>Estimated prep & delivery: <strong>15 – 25 Minutes</strong></span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-3">
          <a
            href={`https://wa.me/${cleanWhatsAppNumber}?text=${encodeURIComponent(
              `Hi Burger Bite! Checking status on my order #${orderId.slice(-8).toUpperCase()} for ${orderDetails?.customerName}.`
            )}`}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-md transition-colors"
          >
            <MessageCircle className="w-4 h-4" />
            <span>Track via WhatsApp with Store</span>
          </a>

          <button
            onClick={onClose}
            className="w-full py-3 rounded-xl bg-[#252525] hover:bg-[#333] text-white font-bold text-xs uppercase tracking-wider transition-colors cursor-pointer"
          >
            Back to Website
          </button>
        </div>
      </div>
    </div>
  );
};
