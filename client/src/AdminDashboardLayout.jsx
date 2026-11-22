import { useState } from "react";
import { BarChart3, LayoutDashboard, ListOrdered, LogOut, Menu, ShieldCheck, Users as UsersIcon, X } from "lucide-react";
import Overview from "./components/Overview";
import Users from "./components/Users";
import Transactions from "./components/Transactions";
import Statistics from "./components/Statistics";
import { SERVICE_KEYS, SERVICE_META } from "./utils";

const NAV = [
  { group: "Monitor", items: [
    { id: "overview", label: "Overview", icon: LayoutDashboard },
    { id: "stats", label: "Statistics", icon: BarChart3 },
  ] },
  { group: "People", items: [{ id: "users", label: "Users", icon: UsersIcon }] },
  { group: "Transactions", items: [
    { id: "all", label: "All transactions", icon: ListOrdered },
    ...SERVICE_KEYS.map((k) => ({ id: k, label: SERVICE_META[k].label, icon: SERVICE_META[k].icon })),
  ] },
];

export default function AdminDashboardLayout() {
  const [active, setActive] = useState("overview");
  const [menuOpen, setMenuOpen] = useState(false);

  const go = (id) => {
    setActive(id);
    setMenuOpen(false);
    window.scrollTo({ top: 0 });
  };

  const logout = () => {
    localStorage.removeItem("token");
    window.location.href = "/admin/login";
  };

  // The sidebar picks which imported component fills the content area.
  const content =
    active === "overview" ? <Overview onNavigate={go} /> :
    active === "stats" ? <Statistics /> :
    active === "users" ? <Users /> :
    <Transactions key={active} type={active} />;

  return (
    <div className="min-h-screen bg-[#f5f6f3] text-slate-800">
      {menuOpen && <div className="fixed inset-0 z-30 bg-slate-900/40 lg:hidden" onClick={() => setMenuOpen(false)} />}

      <aside
        className={`fixed inset-y-0 left-0 z-40 flex w-64 flex-col bg-[#10241f] text-emerald-50/80 transition-transform lg:translate-x-0 ${
          menuOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex h-16 items-center justify-between px-5">
          <div className="flex items-center gap-2.5 text-white">
            <ShieldCheck size={20} className="text-emerald-300" />
            <span className="font-semibold">Admin console</span>
          </div>
          <button className="lg:hidden" onClick={() => setMenuOpen(false)} aria-label="Close menu"><X size={18} /></button>
        </div>

        <nav className="flex-1 overflow-y-auto px-3 pb-4">
          {NAV.map((section) => (
            <div key={section.group} className="mt-4">
              <p className="px-3 pb-1.5 text-xs text-emerald-100/40">{section.group}</p>
              {section.items.map(({ id, label, icon: Icon }) => (
                <button
                  key={id}
                  onClick={() => go(id)}
                  aria-current={active === id ? "page" : undefined}
                  className={`mb-0.5 flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors ${
                    active === id ? "bg-emerald-400/15 font-medium text-white" : "hover:bg-white/5 hover:text-white"
                  }`}
                >
                  <Icon size={16} />
                  {label}
                </button>
              ))}
            </div>
          ))}
        </nav>

        <button onClick={logout} className="m-3 flex items-center gap-3 rounded-lg px-3 py-2 text-sm hover:bg-white/5 hover:text-white">
          <LogOut size={16} /> Log out
        </button>
      </aside>

      <div className="lg:pl-64">
        <header className="sticky top-0 z-20 flex h-14 items-center gap-3 border-b border-slate-200 bg-[#f5f6f3]/90 px-4 backdrop-blur lg:hidden">
          <button onClick={() => setMenuOpen(true)} aria-label="Open menu"><Menu size={20} /></button>
          <span className="font-semibold">Admin console</span>
        </header>
        <main className="mx-auto max-w-[1400px] p-4 sm:p-6 lg:p-8">{content}</main>
      </div>
    </div>
  );
}
