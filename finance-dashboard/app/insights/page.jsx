"use client";

import React, { useState, useEffect } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { TopNavbar } from "@/components/layout/TopNavbar";
import { useAuth } from "@/context/AuthContext";
import { apiService } from "@/lib/api-service";
import {
  AlertTriangle, Sparkles, TrendingUp,
  CheckCircle, Info, Activity
} from "lucide-react";
import dynamic from 'next/dynamic'
const SpendingChart = dynamic(() => import("@/components/charts/SpendingChart").then(mod => mod.SpendingChart), { ssr: false })

// ─── Section 0: Spending Persona ───────────────────────────────────────────
function PersonaSection({ data, expenses }) {
  if (!data || !expenses || expenses.length === 0) return null;

  // Compute top category and its share
  const catTotals = {};
  expenses.forEach(e => {
    catTotals[e.category] = (catTotals[e.category] || 0) + e.amount;
  });
  const topCat = Object.keys(catTotals).sort((a, b) => catTotals[b] - catTotals[a])[0] || "General";
  const topPct = data.totalExpenses > 0 ? Math.round((catTotals[topCat] / data.totalExpenses) * 100) : 0;

  const savingsRate = parseFloat(data.savingsRate || "0");

  let personaName = "The Well-Rounded Saver";
  let personaDesc = `Your spending is balanced. Your top category is '${topCat}' at ${topPct}% of total expenses.`;
  let tip = "You're doing great! Consider channelling your surplus into a diversified index fund.";
  let emoji = "💰";
  let accentBg = "bg-purple-600";
  let accentBorder = "border-purple-500/30";

  if (savingsRate > 40) {
    personaName = "The Master Saver";
    personaDesc = `Incredible discipline! You save over 40% of income. Top spend: '${topCat}' at ${topPct}%.`;
    tip = "Consider investing your surplus — a diversified index fund could grow your wealth significantly.";
    emoji = "🏆";
    accentBg = "bg-emerald-600";
    accentBorder = "border-emerald-500/30";
  } else if (savingsRate < 5 && data.income > 0) {
    personaName = "The Spontaneous Spender";
    personaDesc = `Spending is running high vs income. Main driver: '${topCat}' at ${topPct}%.`;
    tip = "Try the 50/30/20 rule: 50% needs, 30% wants, 20% savings to build a safety net.";
    emoji = "⚡";
    accentBg = "bg-red-600";
    accentBorder = "border-red-500/30";
  } else if (topCat === "Food & Dining" && topPct > 25) {
    personaName = "The Foodie";
    personaDesc = `A big chunk of your budget goes to dining. '${topCat}' accounts for ${topPct}% of total expenses.`;
    tip = "Meal prepping a few times a week can cut your food bill by up to 30%.";
    emoji = "🍜";
    accentBg = "bg-orange-500";
    accentBorder = "border-orange-500/30";
  } else if (topCat === "Entertainment" && topPct > 25) {
    personaName = "The Entertainer";
    personaDesc = `You love a good time! '${topCat}' leads at ${topPct}% of total expenses.`;
    tip = "Set a weekly entertainment cap to enjoy life AND keep your savings on track.";
    emoji = "🎬";
    accentBg = "bg-pink-600";
    accentBorder = "border-pink-500/30";
  } else if (topCat === "Transport" && topPct > 25) {
    personaName = "The Commuter";
    personaDesc = `Travel costs are your biggest outlay. '${topCat}' is ${topPct}% of expenses.`;
    tip = "Carpooling or a monthly transit pass could save you thousands a year.";
    emoji = "🚌";
    accentBg = "bg-sky-600";
    accentBorder = "border-sky-500/30";
  }

  return (
    <div className="rounded-2xl bg-[oklch(0.18_0.01_260)] border border-[oklch(0.25_0.02_260)] overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-[oklch(0.22_0.02_260)]">
        <div className="flex items-center gap-3">
          <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${accentBg}`}>
            <Sparkles size={16} className="text-white" />
          </div>
          <h2 className="text-base font-bold text-[oklch(0.985_0_0)]">Spending Persona</h2>
        </div>
        <span className="text-[10px] uppercase font-bold tracking-widest px-2 py-0.5 rounded-full bg-[oklch(0.25_0.02_260)] text-[oklch(0.65_0.01_260)]">
          AI Assigned
        </span>
      </div>
      {/* Body */}
      <div className="p-6">
        <div className="flex items-center gap-5 mb-5">
          <div className={`w-16 h-16 rounded-full flex items-center justify-center text-3xl shrink-0 ${accentBg}/20 border ${accentBorder}`}>
            {emoji}
          </div>
          <div>
            <h3 className="text-2xl font-bold text-[oklch(0.985_0_0)] mb-1">{personaName}</h3>
            <p className="text-sm text-[oklch(0.70_0.01_260)] leading-relaxed">{personaDesc}</p>
          </div>
        </div>
        {/* AI Tip chip */}
        <div className="flex items-start gap-2 px-4 py-3 rounded-xl bg-purple-500/10 border border-purple-500/20">
          <Sparkles size={14} className="text-purple-400 mt-0.5 shrink-0" />
          <p className="text-sm text-purple-200 leading-relaxed">{tip}</p>
        </div>
      </div>
    </div>
  );
}
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
  if (!advice) {
    return (
      <SectionCard icon={Sparkles} title="AI Financial Advisor" accent="bg-amber-500" badge="50/30/20 Model">
        <div className="flex flex-col items-center justify-center py-8 text-center px-4">
            <Sparkles className="text-amber-500/30 mb-3" size={32} />
            <p className="text-[oklch(0.85_0.01_260)] font-semibold mb-1">Advisor Offline</p>
            <p className="text-sm text-[oklch(0.55_0.01_260)] max-w-sm">Log more income and expenses to generate personalized financial advice.</p>
        </div>
      </SectionCard>
    );
  }

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

// ─── Section 6: Financial Health Score ────────────────────────────────────────
function HealthScoreSection({ data }) {
  if (!data) return null;
  const savingsRate = data.savingsRate;
  return (
    <SectionCard icon={Activity} title="Financial Health Score" accent="bg-teal-600" badge="Overview">
      <div className="space-y-4 mb-8">
        <div>
          <div className="flex justify-between text-sm mb-1 text-[oklch(0.65_0.01_260)] font-medium">
            <span>Income</span>
            <span className="text-[oklch(0.70_0.15_150)] font-bold">₹{data.income.toLocaleString()}</span>
          </div>
          <div className="h-2 w-full bg-[oklch(0.145_0_0)] rounded-full overflow-hidden">
            <div className="h-full bg-[oklch(0.70_0.15_150)] rounded-full" style={{ width: '100%' }}></div>
          </div>
        </div>
        <div>
          <div className="flex justify-between text-sm mb-1 text-[oklch(0.65_0.01_260)] font-medium">
            <span>Expenses</span>
            <span className="text-[oklch(0.50_0.20_250)] font-bold">₹{data.totalExpenses.toLocaleString()}</span>
          </div>
          <div className="h-2 w-full bg-[oklch(0.145_0_0)] rounded-full overflow-hidden">
            <div className="h-full bg-[oklch(0.50_0.20_250)] rounded-full" style={{ width: `${Math.min((data.totalExpenses / data.income * 100), 100)}%` }}></div>
          </div>
        </div>
      </div>

      <div className="p-4 rounded-xl bg-[oklch(0.145_0_0)] border border-[oklch(0.25_0.02_260)] flex items-center gap-4">
        <div className="h-16 w-16 rounded-full border-4 border-[oklch(0.70_0.15_150)] flex items-center justify-center shrink-0">
          <span className="text-lg font-bold text-[oklch(0.985_0_0)]">{savingsRate}%</span>
        </div>
        <div>
          <h4 className="font-bold text-[oklch(0.985_0_0)]">Health Score</h4>
          <p className="text-sm text-[oklch(0.65_0.01_260)]">{parseFloat(savingsRate) > 20 ? "Exceeding goals" : "Needs attention"}</p>
        </div>
      </div>
    </SectionCard>
  );
}

// ─── Section 7: Spending Trend ────────────────────────────────────────────────
function SpendingTrendSection({ data }) {
  if (!data || !data.weeklySpending) return null;
  return (
    <SectionCard icon={TrendingUp} title="Spending Trend" accent="bg-pink-600" badge="Weekly Analysis">
      <div className="-mt-2 mb-2 text-sm text-[oklch(0.65_0.01_260)]">Weekly breakdown of expenses</div>
      <SpendingChart data={data.weeklySpending} />
    </SectionCard>
  );
}

// ─── Main Page ───────────────────────────────────────────────────────────────
export default function InsightsPage() {
  const { user } = useAuth();
  
  // Unified state for all AI data
  const [aiData, setAiData] = useState({
    data: null,
    loading: true,
    error: false
  });
  const [spendingData, setSpendingData] = useState({ data: null, loading: true, error: false });

  useEffect(() => {
    if (user) {
      fetchAllData();
      fetchBaseData();
    }
  }, [user]);

  const fetchAllData = async () => {
    try {
      setAiData(prev => ({ ...prev, loading: true }));
      const data = await apiService.getAllInsights(user.uid);
      if (data) {
        setAiData({ data, loading: false, error: false });
      } else {
        setAiData({ data: null, loading: false, error: true });
      }
    } catch (error) {
      console.error("AI Insights load failed:", error);
      setAiData({ data: null, loading: false, error: true });
    }
  };

  const fetchBaseData = async () => {
    try {
      const expenses = await apiService.getExpenses(user.uid);
      const totalExp = expenses.reduce((acc, curr) => acc + curr.amount, 0);
      
      const storedIncome = localStorage.getItem('monthlyIncome');
      const currentIncome = storedIncome ? parseFloat(storedIncome) : 8250;
      const savingsRate = ((currentIncome - totalExp) / currentIncome * 100).toFixed(1);

      const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
      const weeklyData = days.map(day => ({ name: day, value: 0, budget: 500 }));
      expenses.forEach((t) => {
        const d = new Date(t.date);
        const dayName = days[d.getDay()];
        const weekDay = weeklyData.find(w => w.name === dayName);
        if (weekDay) weekDay.value += t.amount;
      });

      setSpendingData({
        data: {
          totalExpenses: totalExp,
          income: currentIncome,
          savingsRate,
          weeklySpending: weeklyData,
          rawExpenses: expenses
        },
        loading: false,
        error: false
      });
    } catch {
      setSpendingData({ data: null, loading: false, error: true });
    }
  };

  return (
    <DashboardLayout>
      <TopNavbar title="AI Insights" />
      <div className="p-6 md:p-8 space-y-6 max-w-[960px] mx-auto pb-24">

        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-[oklch(0.985_0_0)]">AI Insights</h1>
          <p className="text-[oklch(0.55_0.01_260)] mt-1 text-sm">
            AI-powered analysis of your spending habits running entirely in real-time.
          </p>
        </div>

        <div className="space-y-6">
          {/* 0. Spending Persona */}
          {spendingData.loading ? (
             <div className="animate-pulse rounded-2xl bg-[oklch(0.18_0.01_260)] h-36" />
          ) : !spendingData.error && spendingData.data && (
             <PersonaSection data={spendingData.data} expenses={spendingData.data.rawExpenses} />
          )}

          {/* 1. Financial Health Score — appears 2nd just like the old design */}
          {spendingData.loading ? (
             <div className="animate-pulse rounded-2xl bg-[oklch(0.18_0.01_260)] h-40" />
          ) : !spendingData.error && <HealthScoreSection data={spendingData.data} />}

          {/* 2. Budget & Spending Insights */}
          {aiData.loading ? (
             <div className="animate-pulse rounded-2xl bg-[oklch(0.18_0.01_260)] h-40" />
          ) : !aiData.error && <InsightsSection insights={aiData.data?.insights} />}

          {/* 3. AI Advisor */}
          {aiData.loading ? (
             <div className="animate-pulse rounded-2xl bg-[oklch(0.18_0.01_260)] h-40" />
          ) : !aiData.error && <AdvisorSection advice={aiData.data?.advice} predicted={aiData.data?.predicted_next_month} />}

          {/* 4. Spending Trend */}
          {spendingData.loading ? (
             <div className="animate-pulse rounded-2xl bg-[oklch(0.18_0.01_260)] h-48" />
          ) : !spendingData.error && <SpendingTrendSection data={spendingData.data} />}
        </div>
      </div>
    </DashboardLayout>
  );
}
