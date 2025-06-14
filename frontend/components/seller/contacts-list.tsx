"use client";

import { useEffect, useState } from "react";
import { dashboardApi } from "@/lib/api/dashboard";
import { Contact } from "@/types/api";
import { toast } from "sonner";
import { Loader2, User } from "lucide-react";

interface ContactsListProps {
  limit?: number;
}

const ContactsList = ({ limit = 5 }: ContactsListProps) => {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const loadContacts = async () => {
      try {
        setLoading(true);
        const response: any = await dashboardApi.getContacts(1, limit);
        setContacts(response.data ?? []);
      } catch (error) {
        console.error("Failed to load contacts:", error);
        toast.error("Failed to load contacts");
      } finally {
        setLoading(false);
      }
    };
    loadContacts();
  }, [limit]);

  const formatTime = (dateString?: string) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
    if (diffInMinutes < 1) return "Just now";
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
    return `${Math.floor(diffInMinutes / 1440)}d ago`;
  };

  return (
    <div className="bg-white rounded-xl p-4 shadow-sm">
      <h3 className="font-semibold text-lg mb-4 text-black">Your Contacts</h3>
      <div className="space-y-2 max-h-96 overflow-y-auto pr-1">
        {contacts.map((contact) => (
          <div
            key={contact.id}
            className="flex items-start gap-3 p-2 rounded-lg transition-colors hover:bg-gray-50"
          >
            <div className="flex items-center justify-center w-9 h-9 rounded-full bg-gray-100">
              {contact.image ? (
                <img
                  src={contact.image}
                  alt={contact.name}
                  className="w-full h-full rounded-full object-cover"
                />
              ) : (
                <User className="w-5 h-5 text-gray-400" />
              )}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-black truncate">
                {contact.name}
              </p>
              {contact.lastMessage && (
                <p className="text-xs text-gray-600 truncate">
                  {contact.lastMessage}
                </p>
              )}
              {contact.lastMessageTime && (
                <span className="text-xs text-gray-400 block mt-0.5">
                  {formatTime(contact.lastMessageTime)}
                </span>
              )}
            </div>
            {contact.unreadCount && contact.unreadCount > 0 && (
              <span className="ml-2 bg-blue-500 text-white text-xs rounded-full px-2 py-0.5">
                {contact.unreadCount}
              </span>
            )}
          </div>
        ))}

        {loading && (
          <div className="flex justify-center py-4">
            <Loader2 className="w-5 h-5 animate-spin text-gray-500" />
          </div>
        )}

        {(contacts?.length ?? 0) === 0 && !loading && (
          <div className="text-center py-4 text-gray-500">
            <User className="w-8 h-8 mx-auto mb-2 opacity-50" />
            <p className="text-sm">No contacts found</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ContactsList;
