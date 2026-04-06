"use client";

import React, { useState, useEffect } from "react";
import { Bell, Check, Info, AlertTriangle, ShieldAlert, Sparkles, X } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { apiService } from "@/lib/api-service";
import { cn } from "@/lib/utils";

// Module-level cache: avoids hitting the slow AI API on every bell click
const notifCache = { data: null, expiresAt: 0 };

export function NotificationDropdown() {
  const [isOpen, setIsOpen] = useState(false);
  const { user } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user && isOpen) {
      fetchData();
    }
  }, [user, isOpen]);

  const fetchData = async () => {
    // Use cached data if available and less than 5 minutes old
    if (notifCache.data && Date.now() < notifCache.expiresAt) {
      setNotifications(notifCache.data);
      return;
    }

    try {
      setLoading(true);
      const [insightsData, alertsData] = await Promise.all([
        apiService.getInsights(user.uid),
        apiService.getAlerts(user.uid)
      ]);

      const formatted = [
        ...(insightsData.insights || []).map((ins, i) => ({
          id: `ins-${i}`,
          title: "AI Insight",
          message: ins.message,
          type: ins.type === 'alert' ? 'warning' : 'info',
          icon: <Sparkles size={16} />,
          time: "Just now"
        })),
        ...(alertsData || []).map((alert) => ({
          id: alert.id,
          title: "Fraud Alert",
          message: alert.message,
          type: 'danger',
          icon: <ShieldAlert size={16} />,
          time: new Date(alert.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }))
      ];

      const result = formatted.sort((a,b) => 0.5 - Math.random()).slice(0, 5);
      // Cache for 5 minutes
      notifCache.data = result;
      notifCache.expiresAt = Date.now() + 5 * 60 * 1000;
      setNotifications(result);
    } catch (error) {
      console.error("Failed to fetch notifications:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "flex h-10 w-10 items-center justify-center rounded-full transition-all relative",
          isOpen ? "bg-[oklch(0.25_0.02_260)] text-[oklch(0.985_0_0)]" : "bg-[oklch(0.18_0.01_260)] text-[oklch(0.65_0.01_260)] hover:bg-[oklch(0.25_0.02_260)] hover:text-[oklch(0.985_0_0)]"
        )}
      >
        <Bell className="h-5 w-5" />
        {notifications.length > 0 && (
          <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-red-500 ring-2 ring-[oklch(0.145_0_0)]"></span>
        )}
      </button>

      {isOpen && (
        <>
          <div 
            className="fixed inset-0 z-20" 
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute right-0 mt-3 w-80 rounded-2xl bg-[oklch(0.18_0.01_260)] border border-[oklch(0.25_0.02_260)] shadow-2xl z-30 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
            <div className="p-4 border-b border-[oklch(0.25_0.02_260)] flex items-center justify-between bg-[oklch(0.145_0_0)]">
              <h3 className="font-bold text-[oklch(0.985_0_0)]">Notifications</h3>
              <button 
                onClick={() => setNotifications([])}
                className="text-xs text-[oklch(0.50_0.20_250)] hover:text-white transition-colors"
              >
                Mark all read
              </button>
            </div>

            <div className="max-h-[400px] overflow-y-auto">
              {loading ? (
                <div className="p-8 text-center text-sm text-[oklch(0.65_0.01_260)]">
                  Loading updates...
                </div>
              ) : notifications.length > 0 ? (
                notifications.map((n) => (
                  <div 
                    key={n.id} 
                    onClick={() => {
                      window.location.href = n.title === "AI Insight" ? '/insights' : '/alerts';
                      setIsOpen(false);
                    }}
                    className="p-4 border-b border-[oklch(0.25_0.02_260)] hover:bg-[oklch(0.145_0_0)] transition-colors cursor-pointer group"
                  >
                    <div className="flex gap-3">
                      <div className={cn(
                        "mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg",
                        n.type === 'danger' || n.type === 'alert' ? "bg-red-500/10 text-red-500" :
                        n.type === 'warning' ? "bg-amber-500/10 text-amber-500" :
                        n.type === 'success' ? "bg-[oklch(0.70_0.15_150)]/10 text-[oklch(0.70_0.15_150)]" :
                        "bg-blue-500/10 text-blue-500"
                      )}>
                        {n.icon}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-1">
                          <p className="text-sm font-bold text-[oklch(0.985_0_0)]">{n.title}</p>
                          <span className="text-[10px] text-[oklch(0.65_0.01_260)]">{n.time}</span>
                        </div>
                        <p className="text-xs text-[oklch(0.65_0.01_260)] leading-relaxed line-clamp-2 group-hover:line-clamp-none transition-all">
                          {n.message}
                        </p>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="p-12 text-center">
                  <div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-[oklch(0.145_0_0)] text-[oklch(0.25_0.02_260)] mb-3">
                    <Bell size={24} />
                  </div>
                  <p className="text-sm font-medium text-[oklch(0.65_0.01_260)]">No new notifications</p>
                  <p className="text-xs text-[oklch(0.25_0.02_260)] mt-1">You're all caught up!</p>
                </div>
              )}
            </div>

            {notifications.length > 0 && (
              <button 
                className="w-full py-3 text-xs font-bold text-[oklch(0.65_0.01_260)] hover:text-[oklch(0.985_0_0)] hover:bg-[oklch(0.145_0_0)] transition-all uppercase tracking-widest border-t border-[oklch(0.25_0.02_260)]"
                onClick={() => setIsOpen(false)}
              >
                View all activity
              </button>
            )}
          </div>
        </>
      )}
    </div>
  );
}
