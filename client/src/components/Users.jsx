import { useEffect, useState } from "react";
import { Eye, Search } from "lucide-react";
import useFetch from "../hooks/useFetch";
import { Card, Empty, ErrorBox, Loader, PageHeader, Pagination, Pill, StatCard, inputCls } from "./ui";
import UserDetail from "./UserDetail";
import { dateOnly, naira, num } from "../utils";

export const userState = (u) => (u.isDeleted ? "deleted" : u.isActive === false ? "suspended" : "active");
const STATE_TONE = { active: "emerald", suspended: "amber", deleted: "rose" };

export default function Users() {
  const [filters, setFilters] = useState({ search: "", status: "", role: "", sort: "newest" });
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    const t = setTimeout(() => {
      setSearch(filters.search);
      setPage(1);
    }, 400);
    return () => clearTimeout(t);
  }, [filters.search]);

  const set = (k, v) => {
    setFilters((f) => ({ ...f, [k]: v }));
    if (k !== "search") setPage(1);
  };

  const { data, loading, error, reload } = useFetch("/users", { ...filters, search, page, limit: 20 });

  return (
    <>
      <PageHeader title="Users" subtitle="Balances, lifetime spend and account status for every user." />

      <div className="mb-5 grid gap-4 sm:grid-cols-2">
        <StatCard title="Users matching filters" value={num(data?.pagination?.total)} />
        <StatCard title="Wallet balance held by them" value={naira(data?.walletTotal)} tone="amber" />
      </div>

      <Card bodyClass="p-0">
        <div className="flex flex-wrap items-center gap-2 border-b border-slate-100 p-4">
          <div className="relative min-w-[220px] flex-1">
            <Search size={15} className="pointer-events-none absolute left-3 top-3 text-slate-400" />
            <input
              value={filters.search}
              onChange={(e) => set("search", e.target.value)}
              placeholder="Search name, email, phone or username"
              className={`${inputCls} w-full pl-9`}
            />
          </div>
          <select value={filters.status} onChange={(e) => set("status", e.target.value)} className={inputCls}>
            <option value="">Any status</option>
            <option value="active">Active</option>
            <option value="suspended">Suspended</option>
            <option value="deleted">Deleted</option>
          </select>
          <select value={filters.role} onChange={(e) => set("role", e.target.value)} className={inputCls}>
            <option value="">Any role</option>
            <option value="user">User</option>
            <option value="admin">Admin</option>
          </select>
          <select value={filters.sort} onChange={(e) => set("sort", e.target.value)} className={inputCls}>
            <option value="newest">Newest first</option>
            <option value="oldest">Oldest first</option>
            <option value="balance_desc">Highest balance</option>
            <option value="balance_asc">Lowest balance</option>
            <option value="name">Name A–Z</option>
          </select>
        </div>

        {error ? (
          <div className="p-4"><ErrorBox message={error} onRetry={reload} /></div>
        ) : loading && !data ? (
          <Loader />
        ) : !data.items.length ? (
          <Empty text="No users match these filters" />
        ) : (
          <div className={loading ? "opacity-60 transition-opacity" : ""}>
            <div className="overflow-x-auto">
              <table className="w-full min-w-[860px] text-sm">
                <thead>
                  <tr className="border-b border-slate-100 text-left text-xs text-slate-500">
                    <th className="px-5 py-3 font-medium">User</th>
                    <th className="px-3 py-3 font-medium">Role</th>
                    <th className="px-3 py-3 text-right font-medium">Wallet balance</th>
                    <th className="px-3 py-3 text-right font-medium">Total spent</th>
                    <th className="px-3 py-3 text-right font-medium">Transactions</th>
                    <th className="px-3 py-3 font-medium">Status</th>
                    <th className="px-3 py-3 font-medium">Joined</th>
                    <th className="w-12" />
                  </tr>
                </thead>
                <tbody>
                  {data.items.map((u) => {
                    const state = userState(u);
                    return (
                      <tr key={u._id} onClick={() => setSelected(u._id)} className="cursor-pointer border-b border-slate-50 hover:bg-slate-50/60">
                        <td className="px-5 py-3">
                          <p className="font-medium text-slate-800">{u.fullName}</p>
                          <p className="text-xs text-slate-500">{u.email}{u.phone ? ` · ${u.phone}` : ""}</p>
                        </td>
                        <td className="px-3 py-3 capitalize text-slate-600">{u.role}</td>
                        <td className="px-3 py-3 text-right font-medium tabular-nums">{naira(u.wallet?.balance)}</td>
                        <td className="px-3 py-3 text-right tabular-nums">{naira(u.totalSpent)}</td>
                        <td className="px-3 py-3 text-right tabular-nums text-slate-600">{num(u.txCount)}</td>
                        <td className="px-3 py-3"><Pill tone={STATE_TONE[state]}>{state}</Pill></td>
                        <td className="whitespace-nowrap px-3 py-3 text-slate-600">{dateOnly(u.createdAt)}</td>
                        <td className="pr-4 text-slate-400"><Eye size={16} /></td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
            <Pagination pagination={data.pagination} onChange={setPage} />
          </div>
        )}
      </Card>

      {selected && <UserDetail userId={selected} onClose={() => setSelected(null)} onChanged={reload} />}
    </>
  );
}
