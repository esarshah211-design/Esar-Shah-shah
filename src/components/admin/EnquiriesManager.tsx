import React from 'react';
import {
  MessageSquare,
  Mail,
  Phone,
  Clock,
  CheckCircle2,
  Trash2,
  MessageCircle,
} from 'lucide-react';
import { Enquiry } from '../../types';
import { updateEnquiryStatus, deleteEnquiry } from '../../services/dbService';

interface Props {
  enquiries: Enquiry[];
}

export const EnquiriesManager: React.FC<Props> = ({ enquiries }) => {
  const handleToggleStatus = async (enquiry: Enquiry) => {
    try {
      const nextStatus = enquiry.status === 'read' ? 'unread' : 'read';
      await updateEnquiryStatus(enquiry.id, nextStatus);
    } catch (err) {
      console.error('Failed to toggle status:', err);
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm('Delete this customer message permanently?')) {
      try {
        await deleteEnquiry(id);
      } catch (err) {
        console.error('Delete enquiry failed:', err);
      }
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-bebas text-3xl sm:text-4xl text-white tracking-wide">
            CUSTOMER ENQUIRIES
          </h2>
          <p className="text-xs text-[#B8B8B8]">
            Messages sent through the contact form on the Burger Bite website.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs text-[#888]">Total Received:</span>
          <span className="px-3 py-1 rounded-full bg-[#222] border border-[#333] text-xs font-bold text-white">
            {enquiries.length}
          </span>
        </div>
      </div>

      {enquiries.length === 0 ? (
        <div className="py-20 text-center bg-[#171717] rounded-3xl border border-[#272727] p-8">
          <MessageSquare className="w-12 h-12 text-[#444] mx-auto mb-4" />
          <h3 className="font-bebas text-2xl text-white">Inbox Clean & Clear</h3>
          <p className="text-xs text-[#888] mt-1">
            No customer enquiries received yet. Messages sent through the website will appear here in real time.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {enquiries.map((enq) => {
            const isUnread = enq.status === 'unread';
            const cleanPhone = enq.phone ? enq.phone.replace(/[^0-9]/g, '') : null;

            return (
              <div
                key={enq.id}
                className={`p-6 rounded-3xl border transition-all ${
                  isUnread
                    ? 'bg-[#1b1919] border-[#E63932]/40 shadow-lg'
                    : 'bg-[#171717] border-[#272727]'
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#252525]">
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="font-bold text-base text-white">{enq.name}</h4>
                      {isUnread && (
                        <span className="bg-[#E63932] text-white text-[10px] font-black uppercase px-2 py-0.5 rounded">
                          NEW
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-4 text-xs text-[#888] mt-1 flex-wrap">
                      {enq.phone && (
                        <span className="flex items-center gap-1 text-[#BBB]">
                          <Phone className="w-3.5 h-3.5 text-[#E63932]" />
                          <span>{enq.phone}</span>
                        </span>
                      )}
                      {enq.email && (
                        <span className="flex items-center gap-1 text-[#BBB]">
                          <Mail className="w-3.5 h-3.5 text-blue-400" />
                          <span>{enq.email}</span>
                        </span>
                      )}
                      <span className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5" />
                        <span>{new Date(enq.createdAt).toLocaleString()}</span>
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    {cleanPhone && (
                      <a
                        href={`https://wa.me/${cleanPhone}?text=${encodeURIComponent(
                          `Hi ${enq.name}! Thank you for reaching out to Burger Bite (Mian Gujar). Regarding your enquiry:`
                        )}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2 rounded-xl bg-emerald-600/20 hover:bg-emerald-600 text-emerald-400 hover:text-white border border-emerald-500/30 transition-all"
                        title="Reply on WhatsApp"
                      >
                        <MessageCircle className="w-4 h-4" />
                      </a>
                    )}

                    <button
                      onClick={() => handleToggleStatus(enq)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                        isUnread
                          ? 'bg-[#252525] hover:bg-[#333] text-white'
                          : 'bg-[#1f1f1f] text-[#777] hover:text-white'
                      }`}
                    >
                      {isUnread ? 'Mark as Read' : 'Mark as Unread'}
                    </button>

                    <button
                      onClick={() => handleDelete(enq.id)}
                      className="p-2 rounded-xl bg-red-950/30 hover:bg-red-900/50 text-red-400 transition-all cursor-pointer"
                      title="Delete enquiry"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <div className="pt-4 text-xs sm:text-sm text-[#CCC] leading-relaxed whitespace-pre-wrap">
                  {enq.message}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
