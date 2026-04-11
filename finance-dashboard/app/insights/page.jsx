"use client";

import React, { useState, useEffect } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { TopNavbar } from "@/components/layout/TopNavbar";
import { useAuth } from "@/context/AuthContext";
import { apiService } from "@/lib/api-service";
import {
  Loader2, AlertTriangle, Sparkles, TrendingUp, ShieldAlert,
  Wallet, Tag, ChevronRight, CheckCircle, Info, Zap, Brain
} from "lucide-react";

// ─── Reusable Card Shell ───────────────────────────────────────────────────
function SectionCard({ icon: Icon, title, accent, children, badge }) {
  return (
    <div className="rounded-2xl bg-[oklch(0.18_0.01_260)] border border-[oklch(0.25_0.02_260)] overflow-hidden">
      <div className="flex items-center justify-between px-6 py-4 border-b border-[oklch(0.22_0.02_260)]">
        <div className="flex items-center gap-3">
          <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${accent}`}>
            <Icon size={16} className="text-white" />
          </div>
          <h2 className="text-base font-bold text-[oklch(0.985_0_0)]">{title}</h2>
        </div>
        {badge && (
          <span className="text-[10px] uppercase font-bold tracking-widest px-2 py-0.5 rounded-full bg-[oklch(0.25_0.02_260)] text-[oklch(0.65_0.01_260)]">
            {badge}
          </span>
        )}
      </div>
      <div className="p-6">{children}</div>
    </div>
  );
}

// ─── Section 1: Spending Persona ─────────────────────────────────────────────
function PersonaSection({ persona }) {
  if (!persona) return null;
  return (
    <SectionCard icon={Brain} title="Spending Persona" accent="bg-violet-600" badge="AI Assigned">
      <div className="flex flex-col md:flex-row items-center gap-6">
        <div className="text-7xl">{persona.emoji}</div>
        <div className="flex-1">
          <h3 className="text-2xl font-bold text-[oklch(0.985_0_0)] mb-1">{persona.name}</h3>
          <p className="text-[oklch(0.70_0.01_260)] mb-4 leading-relaxed">{persona.description}</p>
          <div className="flex items-start gap-2 bg-violet-500/10 border border-violet-500/20 rounded-xl p-3">
            <Zap size={14} className="text-violet-400 mt-0.5 shrink-0" />
            <p className="text-sm text-violet-300">{persona.tip}</p>
          </div>
        </div>
      </div>
    </SectionCard>
  );
}

// ─── Section 2: Safe-to-Spend ─────────────────────────────────────────────
function SafeToSpendSection({ data }) {
  if (!data) return null;
  const isSafe = data.status === "safe";
  return (
    <SectionCard icon={Wallet} title="Safe-to-Spend Calculator" accent="bg-emerald-600" badge="ML Powered">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="rounded-xl bg-[oklch(0.22_0.01_260)] p-4 text-center">
          <p className="text-xs text-[oklch(0.55_0.01_260)] mb-1">Daily Budget</p>
          <p className={`text-2xl font-bold ${isSafe ? "text-emerald-400" : "text-red-400"}`}>
            ₹{data.daily_safe_to_spend?.toLocaleString("en-IN", { maximumFractionDigits: 0 })}
          </p>
          <p className="text-[10px] text-[oklch(0.50_0.01_260)] mt-1">per day</p>
        </div>
        <div className="rounded-xl bg-[oklch(0.22_0.01_260)] p-4 text-center">
          <p className="text-xs text-[oklch(0.55_0.01_260)] mb-1">Days Left</p>
          <p className="text-2xl font-bold text-[oklch(0.985_0_0)]">{data.days_remaining}</p>
          <p className="text-[10px] text-[oklch(0.50_0.01_260)] mt-1">this month</p>
        </div>
        <div className="rounded-xl bg-[oklch(0.22_0.01_260)] p-4 text-center">
          <p className="text-xs text-[oklch(0.55_0.01_260)] mb-1">Spent So Far</p>
          <p className="text-2xl font-bold text-amber-400">
            ₹{data.expenses_this_month?.toLocaleString("en-IN", { maximumFractionDigits: 0 })}
          </p>
          <p className="text-[10px] text-[oklch(0.50_0.01_260)] mt-1">this month</p>
        </div>
        <div className="rounded-xl bg-[oklch(0.22_0.01_260)] p-4 text-center">
          <p className="text-xs text-[oklch(0.55_0.01_260)] mb-1">Predicted Remaining</p>
          <p className="text-2xl font-bold text-sky-400">
            ₹{data.predicted_remaining?.toLocaleString("en-IN", { maximumFractionDigits: 0 })}
          </p>
          <p className="text-[10px] text-[oklch(0.50_0.01_260)] mt-1">AI estimate</p>
        </div>
      </div>
      <div className={`mt-4 flex items-center gap-2 rounded-xl p-3 ${isSafe ? "bg-emerald-500/10 border border-emerald-500/20" : "bg-red-500/10 border border-red-500/20"}`}>
        {isSafe
          ? <CheckCircle size={14} className="text-emerald-400 shrink-0" />
          : <AlertTriangle size={14} className="text-red-400 shrink-0" />}
        <p className={`text-sm ${isSafe ? "text-emerald-300" : "text-red-300"}`}>
          {isSafe
            ? `You can safely spend ₹${data.daily_safe_to_spend?.toLocaleString("en-IN", { maximumFractionDigits: 0 })} per day for the rest of the month without exceeding your predicted budget.`
            : "Your predicted expenses exceed your current balance. Avoid unnecessary spending for the rest of the month."}
        </p>
      </div>
    </SectionCard>
  );
}

// ─── Section 3: Anomaly Detection ─────────────────────────────────────────
function AnomalySection({ anomalies }) {
  if (!anomalies) return null;
  const list = anomalies || [];
  return (
    <SectionCard icon={ShieldAlert} title="Spending Anomalies" accent="bg-red-600" badge="Z-Score Detection">
      {list.length === 0 ? (
        <div className="flex items-center gap-3 p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-xl">
          <CheckCircle size={20} className="text-emerald-400" />
          <p className="text-sm text-emerald-300">No anomalies detected. All your transactions are within your normal spending range!</p>
        </div>
      ) : (
        <div className="space-y-3">
          {list.map((a, i) => (
            <div key={i} className="flex items-start gap-3 p-4 rounded-xl bg-red-500/10 border border-red-500/20">
              <AlertTriangle size={16} className="text-red-400 mt-0.5 shrink-0" />
              <div className="flex-1">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-bold uppercase tracking-wider text-red-400">{a.category}</span>
                  <span className="text-xs text-[oklch(0.55_0.01_260)]">Z-score: {a.z_score}</span>
                </div>
                <p className="text-sm text-[oklch(0.85_0.01_260)]">{a.message}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </SectionCard>
  );
}

// ─── Section 4: AI Recommendations ──────────────────────────────────────
const TYPE_CONFIG = {
  alert: { bg: "bg-red-500/10", border: "border-red-500/20", icon: AlertTriangle, color: "text-red-400", label: "Alert" },
  info: { bg: "bg-sky-500/10", border: "border-sky-500/20", icon: Info, color: "text-sky-400", label: "Info" },
  success: { bg: "bg-emerald-500/10", border: "border-emerald-500/20", icon: CheckCircle, color: "text-emerald-400", label: "Great" },
};

function InsightRow({ insight }) {
  const cfg = TYPE_CONFIG[insight.type] || TYPE_CONFIG.info;
  const Icon = cfg.icon;
  return (
    <div className={`flex items-start gap-3 p-4 rounded-xl ${cfg.bg} border ${cfg.border}`}>
      <Icon size={16} className={`${cfg.color} mt-0.5 shrink-0`} />
      <div className="flex-1">
        <div className="flex items-center gap-2 mb-1">
          <span className={`text-[10px] font-bold uppercase tracking-widest ${cfg.color}`}>{cfg.label}</span>
          <span className="text-[10px] text-[oklch(0.55_0.01_260)]">· {insight.category}</span>
        </div>
        <p className="text-sm text-[oklch(0.85_0.01_260)] leading-relaxed">{insight.message}</p>
      </div>
    </div>
  );
}

function InsightsSection({ insights }) {
  if (!insights) return null;
  return (
    <SectionCard icon={TrendingUp} title="Budget & Spending Insights" accent="bg-sky-600" badge="Rule-Based AI">
      <div className="space-y-3">
        {insights.length === 0
          ? <p className="text-sm text-[oklch(0.55_0.01_260)] text-center py-4">Add more transactions to unlock personalized insights.</p>
          : insights.map((ins, i) => <InsightRow key={i} insight={ins} />)
        }
      </div>
    </SectionCard>
  );
}

// ─── Section 5: Financial Advisor ────────────────────────────────────────
function AdvisorSection({ advice, predicted }) {
  return (
    <SectionCard icon={Sparkles} title="AI Financial Advisor" accent="bg-amber-500" badge="50/30/20 Model">
      <div className="space-y-4">
        {advice && (
          <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/20">
            <p className="text-sm text-amber-200 leading-relaxed">{advice}</p>
          </div>
        )}
        {predicted > 0 && (
          <div className="flex items-center justify-between p-4 rounded-xl bg-[oklch(0.22_0.01_260)]">
            <div>
              <p className="text-xs text-[oklch(0.55_0.01_260)] mb-1">Next Month Expense Forecast</p>
              <p className="text-xl font-bold text-[oklch(0.985_0_0)]">
                ₹{predicted?.toLocaleString("en-IN", { maximumFractionDigits: 0 })}
              </p>
            </div>
            <TrendingUp size={32} className="text-amber-400 opacity-60" />
          </div>
        )}
      </div>
    </SectionCard>
  );
}

// ─── Main Page ───────────────────────────────────────────────────────────────
export default function InsightsPage() {
  const { user } = useAuth();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (user) fetchAll();
  }, [user]);

  const fetchAll = async () => {
    setLoading(true);
    setError(false);
    const result = await apiService.getAllInsights(user.uid);
    if (result) {
      setData(result);
    } else {
      setError(true);
    }
    setLoading(false);
  };

  return (
    <DashboardLayout>
      <TopNavbar title="AI Insights" />
      <div className="p-6 md:p-8 space-y-6 max-w-[960px] mx-auto pb-24">

        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-[oklch(0.985_0_0)]">Financial Insights</h1>
          <p className="text-[oklch(0.55_0.01_260)] mt-1 text-sm">
            AI-powered analysis of your spending habits — all 5 models run in a single call.
          </p>
        </div>

        {loading ? (
          <div className="h-80 flex flex-col items-center justify-center gap-4">
            <div className="relative">
              <Loader2 className="animate-spin text-violet-500" size={48} />
              <div className="absolute inset-0 rounded-full bg-violet-500/20 blur-xl" />
            </div>
            <p className="text-[oklch(0.65_0.01_260)] font-medium text-sm">Running FinAI Brain Scan...</p>
          </div>
        ) : error ? (
          <div className="h-40 flex items-center justify-center">
            <div className="text-center space-y-3">
              <AlertTriangle className="mx-auto text-amber-400" size={32} />
              <p className="text-[oklch(0.65_0.01_260)] text-sm">Could not connect to AI backend.</p>
              <button onClick={fetchAll} className="text-xs text-violet-400 hover:underline">Retry</button>
            </div>
          </div>
        ) : (
          <div className="space-y-5">
            {/* 1. Spending Persona */}
            <PersonaSection persona={data?.persona} />

            {/* 2. Safe-to-Spend */}
            <SafeToSpendSection data={data?.safe_to_spend} />

            {/* 3. Anomaly Detection */}
            <AnomalySection anomalies={data?.anomalies} />

            {/* 4. Budget & Spending Insights */}
            <InsightsSection insights={data?.insights} />

            {/* 5. AI Advisor */}
            <AdvisorSection advice={data?.advice} predicted={data?.predicted_next_month} />
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
