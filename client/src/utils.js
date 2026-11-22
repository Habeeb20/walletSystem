import { Smartphone, Wifi, Zap, Tv, Send } from "lucide-react";

export const naira = (n = 0) =>
  new Intl.NumberFormat("en-NG", { style: "currency", currency: "NGN", maximumFractionDigits: 2 }).format(n || 0);

export const compact = (n = 0) =>
  new Intl.NumberFormat("en", { notation: "compact", maximumFractionDigits: 1 }).format(n || 0);

export const num = (n = 0) => new Intl.NumberFormat("en").format(n || 0);

export const dateTime = (d) =>
  d ? new Date(d).toLocaleString("en-NG", { dateStyle: "medium", timeStyle: "short" }) : "—";

export const dateOnly = (d) => (d ? new Date(d).toLocaleDateString("en-NG", { dateStyle: "medium" }) : "—");

export const SERVICE_KEYS = ["airtime", "data", "electricity", "tv", "transfer"];

export const SERVICE_META = {
  airtime: { label: "Airtime", color: "#0f766e", tone: "teal", icon: Smartphone },
  data: { label: "Data", color: "#2563eb", tone: "blue", icon: Wifi },
  electricity: { label: "Electricity", color: "#d97706", tone: "amber", icon: Zap },
  tv: { label: "TV", color: "#be185d", tone: "pink", icon: Tv },
  transfer: { label: "Transfers", color: "#6d28d9", tone: "violet", icon: Send },
};
