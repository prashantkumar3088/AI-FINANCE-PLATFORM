"use client";

import React, { useState, useEffect } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { TopNavbar } from "@/components/layout/TopNavbar";
import { Button } from "@/components/ui/button";
import { signOut } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { User, Bell, Shield, LogOut, Moon, ChevronRight, Check } from "lucide-react";

export default function SettingsPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [saved, setSaved] = useState(false);
  const [notifications, setNotifications] = useState(() => {
    if (typeof window !== "undefined") {
      try {
        const saved = localStorage.getItem("finai_notification_prefs");
        if (saved) return JSON.parse(saved);
      } catch {}
    }
    return {
      fraudAlerts: true,
      budgetWarnings: true,
      weeklyReport: false,
      aiInsights: true,
    };
  });

  const handleSignOut = async () => {
    await signOut(auth);
    router.push("/login");
  };

  const handleSave = () => {
    try {
      localStorage.setItem("finai_notification_prefs", JSON.stringify(notifications));
    } catch {}
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  const toggleNotification = (key) => {
    setNotifications((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const Toggle = ({ enabled, onToggle }) => (
    <button
      onClick={onToggle}
      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
        enabled ? "bg-[oklch(0.50_0.20_250)]" : "bg-[oklch(0.25_0.02_260)]"
      }`}
    >
      <span
        className={`inline-block h-4 w-4 rounded-full bg-white shadow transition-transform ${
          enabled ? "translate-x-6" : "translate-x-1"
        }`}
      />
    </button>
  );

  return (
    <DashboardLayout>
      <TopNavbar title="Settings" />
      <div className="p-8 max-w-[900px] mx-auto pb-24 space-y-6">

        {saved && (
          <div className="fixed top-6 left-1/2 -translate-x-1/2 z-50 bg-[oklch(0.70_0.15_150)] text-white px-6 py-3 rounded-full shadow-lg font-bold flex items-center gap-2 animate-in fade-in zoom-in duration-300">
            <Check size={16} /> Settings saved!
          </div>
        )}

        {/* Profile */}
        <div className="rounded-2xl bg-[oklch(0.18_0.01_260)] border border-[oklch(0.25_0.02_260)] p-6 shadow-sm">
          <div className="flex items-center gap-3 mb-6">
            <User size={20} className="text-[oklch(0.50_0.20_250)]" />
            <h3 className="text-lg font-bold text-[oklch(0.985_0_0)]">Profile</h3>
          </div>
          <div className="flex items-center gap-5">
            <div className="h-16 w-16 rounded-full bg-[oklch(0.50_0.20_250)]/20 border-2 border-[oklch(0.50_0.20_250)] flex items-center justify-center shrink-0">
              <span className="text-2xl font-bold text-[oklch(0.50_0.20_250)]">
                {user?.email?.[0]?.toUpperCase() ?? "U"}
              </span>
            </div>
            <div>
              <p className="text-lg font-bold text-[oklch(0.985_0_0)]">{user?.displayName ?? "FinAI User"}</p>
              <p className="text-sm text-[oklch(0.65_0.01_260)]">{user?.email ?? "Not signed in"}</p>
              <p className="text-xs text-[oklch(0.65_0.01_260)] mt-1">
                UID: <span className="font-mono">{user?.uid?.slice(0, 16) ?? "—"}...</span>
              </p>
            </div>
          </div>
        </div>

        {/* Notifications */}
        <div className="rounded-2xl bg-[oklch(0.18_0.01_260)] border border-[oklch(0.25_0.02_260)] p-6 shadow-sm">
          <div className="flex items-center gap-3 mb-6">
            <Bell size={20} className="text-[oklch(0.50_0.20_250)]" />
            <h3 className="text-lg font-bold text-[oklch(0.985_0_0)]">Notifications</h3>
          </div>
          <div className="space-y-5">
            {[
              { key: "fraudAlerts", label: "Fraud Alerts", desc: "Get notified about suspicious transactions immediately." },
              { key: "budgetWarnings", label: "Budget Warnings", desc: "Alert when you hit 80% of a budget category." },
              { key: "weeklyReport", label: "Weekly Report", desc: "Receive a weekly summary of your spending." },
              { key: "aiInsights", label: "AI Insights", desc: "Get new AI recommendations when patterns are detected." },
            ].map(({ key, label, desc }) => (
              <div key={key} className="flex items-center justify-between gap-4">
                <div>
                  <p className="font-medium text-[oklch(0.985_0_0)] text-sm">{label}</p>
                  <p className="text-xs text-[oklch(0.65_0.01_260)] mt-0.5">{desc}</p>
                </div>
                <Toggle enabled={notifications[key]} onToggle={() => toggleNotification(key)} />
              </div>
            ))}
          </div>
        </div>

        {/* Appearance */}
        <div className="rounded-2xl bg-[oklch(0.18_0.01_260)] border border-[oklch(0.25_0.02_260)] p-6 shadow-sm">
          <div className="flex items-center gap-3 mb-6">
            <Moon size={20} className="text-[oklch(0.50_0.20_250)]" />
            <h3 className="text-lg font-bold text-[oklch(0.985_0_0)]">Appearance</h3>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-[oklch(0.985_0_0)] text-sm">Dark Mode</p>
              <p className="text-xs text-[oklch(0.65_0.01_260)] mt-0.5">App is currently in dark mode (default).</p>
            </div>
            <span className="text-xs uppercase font-bold tracking-wider px-2 py-1 rounded bg-[oklch(0.50_0.20_250)]/20 text-[oklch(0.50_0.20_250)]">Active</span>
          </div>
        </div>

        {/* Security */}
        <div className="rounded-2xl bg-[oklch(0.18_0.01_260)] border border-[oklch(0.25_0.02_260)] p-6 shadow-sm">
          <div className="flex items-center gap-3 mb-6">
            <Shield size={20} className="text-[oklch(0.50_0.20_250)]" />
            <h3 className="text-lg font-bold text-[oklch(0.985_0_0)]">Security</h3>
          </div>
          <div className="space-y-3">
            {["Change Password", "Two-Factor Authentication", "Connected Devices"].map((item) => (
              <button
                key={item}
                className="w-full flex items-center justify-between p-4 rounded-xl bg-[oklch(0.145_0_0)] border border-[oklch(0.25_0.02_260)] text-[oklch(0.985_0_0)] hover:border-[oklch(0.50_0.20_250)] transition-colors"
              >
                <span className="text-sm font-medium">{item}</span>
                <ChevronRight size={16} className="text-[oklch(0.65_0.01_260)]" />
              </button>
            ))}
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-4">
          <Button
            onClick={handleSave}
            className="flex-1 bg-[oklch(0.50_0.20_250)] hover:bg-[oklch(0.55_0.20_250)] text-white rounded-xl h-12 font-bold"
          >
            Save Preferences
          </Button>
          <Button
            onClick={handleSignOut}
            variant="outline"
            className="flex-1 border-[oklch(0.60_0.20_20)]/40 text-[oklch(0.60_0.20_20)] hover:bg-[oklch(0.60_0.20_20)]/10 rounded-xl h-12 font-bold flex items-center gap-2"
          >
            <LogOut size={16} /> Sign Out
          </Button>
        </div>
      </div>
    </DashboardLayout>
  );
}
